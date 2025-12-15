// 지하철 경로 탐색 서비스
const db = require('../config/database');

class RouteFinder {
  constructor() {
    this.graph = null;
    this.stations = null;
  }

  // 그래프 초기화 (DB에서 데이터 로드)
  async initialize(calendarType = 'weekday') {
    console.log(`🔄 경로 탐색 그래프 초기화 중... (${calendarType})`);

    // 1. 모든 역 정보 로드
    this.stations = await db.query(`
      SELECT
        sbl.stationCode,
        sbl.lineCode,
        si.stationNameJa,
        si.stationNameKo,
        si.stationGroupCode
      FROM stationByLineInfo sbl
      JOIN stationInfo si ON sbl.stationGroupCode = si.stationGroupCode
    `);

    // 2. 그래프 구조 생성
    this.graph = {};

    // 각 역을 노드로 추가
    this.stations.forEach(station => {
      this.graph[station.stationCode] = {
        info: station,
        edges: []
      };
    });

    // 3. 같은 노선 연결 (stationConnectionInfo)
    const connections = await db.query(`
      SELECT
        stationCode,
        nextStationCode,
        timeToNextStation,
        distanceToNextStation,
        railDirection
      FROM stationConnectionInfo
      WHERE nextStationCode IS NOT NULL
        AND calendarType = ?
    `, [calendarType]);

    connections.forEach(conn => {
      if (this.graph[conn.stationCode]) {
        this.graph[conn.stationCode].edges.push({
          to: conn.nextStationCode,
          type: 'direct',
          time: conn.timeToNextStation,
          distance: conn.distanceToNextStation,
          direction: conn.railDirection
        });
      }
    });

    // 4. 환승 연결 (transferInfo)
    const transfers = await db.query(`
      SELECT
        fromStationCode,
        toStationCode,
        travelTime
      FROM transferInfo
    `);

    transfers.forEach(transfer => {
      if (this.graph[transfer.fromStationCode]) {
        this.graph[transfer.fromStationCode].edges.push({
          to: transfer.toStationCode,
          type: 'transfer',
          time: transfer.travelTime,
          distance: 0
        });
      }
    });

    console.log(`✅ 그래프 초기화 완료: ${Object.keys(this.graph).length}개 역`);
  }

  // Dijkstra 알고리즘 - 최단 시간 경로
  findShortestTime(fromCode, toCode) {
    if (!this.graph[fromCode] || !this.graph[toCode]) {
      return null;
    }

    // 초기화
    const distances = {};
    const previous = {};
    const visited = new Set();
    const pq = []; // Priority Queue (배열로 구현)

    // 모든 노드 거리 무한대로 초기화
    Object.keys(this.graph).forEach(code => {
      distances[code] = Infinity;
      previous[code] = null;
    });

    distances[fromCode] = 0;
    pq.push({ code: fromCode, distance: 0 });

    while (pq.length > 0) {
      // 최소 거리 노드 찾기
      pq.sort((a, b) => a.distance - b.distance);
      const current = pq.shift();

      if (visited.has(current.code)) continue;
      visited.add(current.code);

      // 목적지 도착
      if (current.code === toCode) break;

      // 인접 노드 탐색
      const node = this.graph[current.code];
      node.edges.forEach(edge => {
        if (visited.has(edge.to)) return;

        const newDistance = distances[current.code] + edge.time;

        if (newDistance < distances[edge.to]) {
          distances[edge.to] = newDistance;
          previous[edge.to] = {
            code: current.code,
            type: edge.type,
            time: edge.time,
            distance: edge.distance
          };
          pq.push({ code: edge.to, distance: newDistance });
        }
      });
    }

    // 경로 재구성
    if (distances[toCode] === Infinity) {
      return null; // 경로 없음
    }

    return this.reconstructPath(previous, fromCode, toCode, distances[toCode]);
  }

  // 최소 환승 경로
  findFewestTransfers(fromCode, toCode) {
    if (!this.graph[fromCode] || !this.graph[toCode]) {
      return null;
    }

    // BFS + 환승 횟수 추적
    const queue = [{
      code: fromCode,
      transfers: 0,
      time: 0,
      path: [fromCode],
      edges: []
    }];

    const visited = new Map(); // code -> {transfers, time}
    visited.set(fromCode, { transfers: 0, time: 0 });

    let bestResult = null;

    while (queue.length > 0) {
      const current = queue.shift();

      // 목적지 도착
      if (current.code === toCode) {
        if (!bestResult ||
            current.transfers < bestResult.transfers ||
            (current.transfers === bestResult.transfers && current.time < bestResult.time)) {
          bestResult = current;
        }
        continue;
      }

      // 인접 노드 탐색
      const node = this.graph[current.code];
      node.edges.forEach(edge => {
        const newTransfers = current.transfers + (edge.type === 'transfer' ? 1 : 0);
        const newTime = current.time + edge.time;

        // 이미 방문했는지 확인
        const visitedInfo = visited.get(edge.to);

        // 더 나은 경로인 경우만 탐색
        if (!visitedInfo ||
            newTransfers < visitedInfo.transfers ||
            (newTransfers === visitedInfo.transfers && newTime < visitedInfo.time)) {

          visited.set(edge.to, { transfers: newTransfers, time: newTime });

          queue.push({
            code: edge.to,
            transfers: newTransfers,
            time: newTime,
            path: [...current.path, edge.to],
            edges: [...current.edges, {
              from: current.code,
              to: edge.to,
              type: edge.type,
              time: edge.time,
              distance: edge.distance
            }]
          });
        }
      });
    }

    if (!bestResult) return null;

    // 경로 정보 구성
    return this.formatPath(bestResult.path, bestResult.edges, bestResult.time);
  }

  // 경로 재구성 (Dijkstra 결과용)
  reconstructPath(previous, fromCode, toCode, totalTime) {
    const path = [];
    const edges = [];
    let current = toCode;

    while (current !== fromCode) {
      path.unshift(current);
      const prev = previous[current];
      if (!prev) break;

      edges.unshift({
        from: prev.code,
        to: current,
        type: prev.type,
        time: prev.time,
        distance: prev.distance
      });

      current = prev.code;
    }

    path.unshift(fromCode);

    return this.formatPath(path, edges, totalTime);
  }

  // 경로 포맷팅
  formatPath(path, edges, totalTime) {
    const transfers = edges.filter(e => e.type === 'transfer').length;
    const totalDistance = edges.reduce((sum, e) => sum + (e.distance || 0), 0);

    // 역 정보 추가
    const stationsInPath = path.map(code => {
      const station = this.stations.find(s => s.stationCode === code);
      return {
        stationCode: code,
        stationNameJa: station?.stationNameJa,
        stationNameKo: station?.stationNameKo,
        lineCode: station?.lineCode
      };
    });

    // 구간별 정보
    const segments = edges.map((edge, idx) => {
      const fromStation = this.stations.find(s => s.stationCode === edge.from);
      const toStation = this.stations.find(s => s.stationCode === edge.to);

      return {
        from: {
          stationCode: edge.from,
          stationNameJa: fromStation?.stationNameJa,
          stationNameKo: fromStation?.stationNameKo,
          lineCode: fromStation?.lineCode
        },
        to: {
          stationCode: edge.to,
          stationNameJa: toStation?.stationNameJa,
          stationNameKo: toStation?.stationNameKo,
          lineCode: toStation?.lineCode
        },
        type: edge.type,
        time: edge.time,
        distance: edge.distance
      };
    });

    return {
      path: stationsInPath,
      segments,
      summary: {
        totalTime,
        totalDistance,
        transfers,
        stops: path.length
      }
    };
  }
}

// 싱글톤 인스턴스 (calendarType별로 관리)
const instances = {};

async function getRouteFinder(calendarType = 'weekday') {
  if (!instances[calendarType]) {
    instances[calendarType] = new RouteFinder();
    await instances[calendarType].initialize(calendarType);
  }
  return instances[calendarType];
}

module.exports = { getRouteFinder };
