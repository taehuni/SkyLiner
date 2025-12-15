// 기존 데이터베이스 데이터 한국어 번역
require('dotenv').config();
const { query } = require('../config/database');
const translator = require('../services/translator');

console.log('========================================');
console.log('🌐 기존 데이터 한국어 번역');
console.log('========================================\n');

// 딜레이 함수 (API 호출 제한 방지)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 1. 역 정보 번역
const translateStations = async () => {
  try {
    console.log('📍 역 정보 번역 시작...\n');

    // 한국어 없는 역 찾기
    const stations = await query(`
      SELECT stationGroupCode, stationNameJa, stationNameEn, stationNameKo
      FROM stationInfo
      WHERE stationNameKo IS NULL OR stationNameKo = ''
    `);

    console.log(`  찾은 역: ${stations.length}개\n`);

    if (stations.length === 0) {
      console.log('  ✅ 모든 역에 한국어 이름이 있습니다.\n');
      return { total: 0, translated: 0 };
    }

    let translatedCount = 0;

    for (const station of stations) {
      try {
        // 일본어 우선, 없으면 영어
        const source = station.stationNameJa || station.stationNameEn;

        if (!source) {
          console.log(`  ⚠️  번역 불가: stationGroupCode ${station.stationGroupCode} (원본 없음)`);
          continue;
        }

        // 번역
        const translated = station.stationNameJa
          ? await translator.japaneseToKorean(station.stationNameJa)
          : await translator.englishToKorean(station.stationNameEn);

        // 업데이트
        await query(
          `UPDATE stationInfo SET stationNameKo = ? WHERE stationGroupCode = ?`,
          [translated, station.stationGroupCode]
        );

        translatedCount++;
        console.log(`  ${translatedCount}/${stations.length}. ${source} → ${translated}`);

        // API 호출 제한 방지 (100ms 딜레이)
        await delay(100);

      } catch (err) {
        console.error(`  ❌ 번역 실패: ${station.stationNameJa} - ${err.message}`);
      }
    }

    console.log(`\n  ✅ 역 정보 번역 완료: ${translatedCount}/${stations.length}개\n`);

    return { total: stations.length, translated: translatedCount };

  } catch (error) {
    console.error('❌ 역 정보 번역 중 오류:', error.message);
    throw error;
  }
};

// 2. 장소 정보 번역
const translatePlaces = async () => {
  try {
    console.log('🏛️  장소 정보 번역 시작...\n');

    // 한국어 없는 장소 찾기 (전체)
    const places = await query(`
      SELECT placeID, name, description
      FROM placeInfo
      WHERE (name IS NOT NULL AND name != '' AND name NOT REGEXP '[가-힣]')
         OR (description IS NOT NULL AND description != '' AND description NOT REGEXP '[가-힣]')
    `);

    console.log(`  찾은 장소: ${places.length}개 (전체 처리)\n`);

    if (places.length === 0) {
      console.log('  ✅ 모든 장소에 한국어가 있거나 번역할 데이터가 없습니다.\n');
      return { total: 0, translatedNames: 0, translatedDescs: 0 };
    }

    let translatedNameCount = 0;
    let translatedDescCount = 0;

    for (let i = 0; i < places.length; i++) {
      const place = places[i];

      try {
        let translatedName = place.name;
        let translatedDesc = place.description;

        // 이름 번역 (한글이 없으면)
        if (place.name && !/[가-힣]/.test(place.name)) {
          translatedName = await translator.autoTranslate(place.name);
          translatedNameCount++;
          console.log(`  ${i + 1}/${places.length}. 이름: ${place.name} → ${translatedName}`);
          await delay(100);
        }

        // 설명 번역 (한글이 없으면)
        if (place.description && !/[가-힣]/.test(place.description)) {
          translatedDesc = await translator.autoTranslate(place.description);
          translatedDescCount++;
          const preview = translatedDesc.substring(0, 30);
          console.log(`           설명: ${place.description.substring(0, 30)}... → ${preview}...`);
          await delay(100);
        }

        // 업데이트
        await query(
          `UPDATE placeInfo SET name = ?, description = ? WHERE placeID = ?`,
          [translatedName, translatedDesc, place.placeID]
        );

      } catch (err) {
        console.error(`  ❌ 번역 실패: ${place.name} - ${err.message}`);
      }
    }

    console.log(`\n  ✅ 장소 정보 번역 완료:`);
    console.log(`     - 이름: ${translatedNameCount}개`);
    console.log(`     - 설명: ${translatedDescCount}개\n`);

    return {
      total: places.length,
      translatedNames: translatedNameCount,
      translatedDescs: translatedDescCount
    };

  } catch (error) {
    console.error('❌ 장소 정보 번역 중 오류:', error.message);
    throw error;
  }
};

// 3. 태그 번역
const translateTags = async () => {
  try {
    console.log('🏷️  태그 정보 번역 시작...\n');

    // 태그가 있는 장소 찾기
    const places = await query(`
      SELECT placeID, tags
      FROM placeInfo
      WHERE tags IS NOT NULL AND tags != '' AND tags != '[]'
    `);

    console.log(`  태그가 있는 장소: ${places.length}개\n`);

    if (places.length === 0) {
      console.log('  ✅ 번역할 태그가 없습니다.\n');
      return { total: 0, translatedTags: 0 };
    }

    let translatedPlaceCount = 0;
    let totalTagsTranslated = 0;

    for (let i = 0; i < places.length; i++) {
      const place = places[i];

      try {
        // JSON 파싱
        let tags = [];
        try {
          tags = typeof place.tags === 'string' ? JSON.parse(place.tags) : place.tags;
        } catch (e) {
          console.log(`  ⚠️  태그 파싱 실패: placeID ${place.placeID}`);
          continue;
        }

        if (!Array.isArray(tags) || tags.length === 0) {
          continue;
        }

        // 한글이 없는 태그만 번역
        const needsTranslation = tags.some(tag => tag && !/[가-힣]/.test(tag));

        if (!needsTranslation) {
          continue;
        }

        const translatedTags = [];
        let tagCount = 0;

        for (const tag of tags) {
          if (!tag || tag.trim() === '') {
            translatedTags.push(tag);
            continue;
          }

          // 이미 한글이면 그대로
          if (/[가-힣]/.test(tag)) {
            translatedTags.push(tag);
            continue;
          }

          // 번역
          const translated = await translator.autoTranslate(tag);
          translatedTags.push(translated);
          tagCount++;
          await delay(100);
        }

        if (tagCount > 0) {
          // 업데이트
          await query(
            `UPDATE placeInfo SET tags = ? WHERE placeID = ?`,
            [JSON.stringify(translatedTags), place.placeID]
          );

          translatedPlaceCount++;
          totalTagsTranslated += tagCount;
          console.log(`  ${translatedPlaceCount}. placeID ${place.placeID}: ${tagCount}개 태그 번역 - ${translatedTags.join(', ')}`);
        }

      } catch (err) {
        console.error(`  ❌ 번역 실패: placeID ${place.placeID} - ${err.message}`);
      }
    }

    console.log(`\n  ✅ 태그 번역 완료: ${translatedPlaceCount}개 장소, ${totalTagsTranslated}개 태그\n`);

    return { total: places.length, translatedPlaces: translatedPlaceCount, translatedTags: totalTagsTranslated };

  } catch (error) {
    console.error('❌ 태그 번역 중 오류:', error.message);
    throw error;
  }
};

// 4. 노선 정보 번역
const translateLines = async () => {
  try {
    console.log('🚇 노선 정보 번역 시작...\n');

    // 한국어 없는 노선 찾기
    const lines = await query(`
      SELECT lineCode, lineNameJa, lineNameEn, lineNameKo
      FROM lineInfo
      WHERE lineNameKo IS NULL OR lineNameKo = ''
    `);

    console.log(`  찾은 노선: ${lines.length}개\n`);

    if (lines.length === 0) {
      console.log('  ✅ 모든 노선에 한국어 이름이 있습니다.\n');
      return { total: 0, translated: 0 };
    }

    let translatedCount = 0;

    for (const line of lines) {
      try {
        const source = line.lineNameJa || line.lineNameEn;

        if (!source) {
          console.log(`  ⚠️  번역 불가: ${line.lineCode} (원본 없음)`);
          continue;
        }

        // 번역
        const translated = line.lineNameJa
          ? await translator.japaneseToKorean(line.lineNameJa)
          : await translator.englishToKorean(line.lineNameEn);

        // 업데이트
        await query(
          `UPDATE lineInfo SET lineNameKo = ? WHERE lineCode = ?`,
          [translated, line.lineCode]
        );

        translatedCount++;
        console.log(`  ${translatedCount}/${lines.length}. ${source} → ${translated}`);

        await delay(100);

      } catch (err) {
        console.error(`  ❌ 번역 실패: ${line.lineNameJa} - ${err.message}`);
      }
    }

    console.log(`\n  ✅ 노선 정보 번역 완료: ${translatedCount}/${lines.length}개\n`);

    return { total: lines.length, translated: translatedCount };

  } catch (error) {
    console.error('❌ 노선 정보 번역 중 오류:', error.message);
    throw error;
  }
};

// 메인 실행
const main = async () => {
  try {
    const startTime = Date.now();

    // 1. 역 정보 번역
    const stationResult = await translateStations();

    // 2. 노선 정보 번역
    const lineResult = await translateLines();

    // 3. 장소 정보 번역
    const placeResult = await translatePlaces();

    // 4. 태그 번역
    const tagResult = await translateTags();

    // 사용량 확인
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 번역 완료 요약\n');
    console.log(`  역 정보: ${stationResult.translated}/${stationResult.total}개`);
    console.log(`  노선 정보: ${lineResult.translated}/${lineResult.total}개`);
    console.log(`  장소 이름: ${placeResult.translatedNames}개`);
    console.log(`  장소 설명: ${placeResult.translatedDescs}개`);
    console.log(`  태그: ${tagResult.translatedTags}개 (${tagResult.translatedPlaces}개 장소)`);

    const usage = await translator.getUsage();
    if (usage) {
      console.log(`\n  DeepL 사용량: ${usage.used.toLocaleString()}/${usage.limit.toLocaleString()} 글자 (${usage.percentage}%)`);
      console.log(`  남은 글자: ${usage.remaining.toLocaleString()}`);
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n  소요 시간: ${elapsed}초`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('✅ 모든 번역 작업 완료!');

    process.exit(0);

  } catch (error) {
    console.error('\n❌ 번역 작업 실패:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

// 실행
main();
