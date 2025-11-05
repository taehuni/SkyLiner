// src/data/placesData.js
// 핫플레이스 데이터 구조

export const placesData = [
  {
    id: 1,
    title: "핫플레이스",
    placeName: "메구로강",
    stationName: "나카메구로역",
    stationDistance: "0.26km",
    openTime: "10:00 - 20:30",
    rating: 5,
    ratingCount: 99999,
    temperature: "26°C",
    humidity: "70%",
    imageUrl: "https://images.unsplash.com/photo-1554254279-f9040052697c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVycnklMjBibG9zc29tJTIwcml2ZXIlMjBuaWdodHxlbnwxfHx8fDE3NjExMTkyNDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    imageLabel: "Meguro River",
    address: "일본 〒153-0051 도쿄도 메구로구 가미메구로 1-1",
    phoneNumber: "03-1234-5678"
  },
  {
    id: 2,
    title: "핫플레이스",
    placeName: "시부야 스크램블",
    stationName: "시부야역",
    stationDistance: "0.1km",
    openTime: "24시간",
    rating: 5,
    ratingCount: 150000,
    temperature: "24°C",
    humidity: "65%",
    imageUrl: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxzaGlidXlhJTIwY3Jvc3Npbmd8ZW58MXx8fHwxNzYxMTIwMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    imageLabel: "Shibuya Crossing",
    address: "일본 〒150-0043 도쿄도 시부야구 도겐자카 2-1",
    phoneNumber: "03-2345-6789"
  },
  {
    id: 3,
    title: "핫플레이스",
    placeName: "센소지",
    stationName: "아사쿠사역",
    stationDistance: "0.5km",
    openTime: "06:00 - 17:00",
    rating: 5,
    ratingCount: 200000,
    temperature: "25°C",
    humidity: "68%",
    imageUrl: "https://images.unsplash.com/photo-1528164344705-47542687000d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW5zb2ppJTIwdGVtcGxlfGVufDF8fHx8MTc2MTEyMDAwMHww&ixlib=rb-4.1.0&q=80&w=1080",
    imageLabel: "Senso-ji Temple",
    address: "일본 〒111-0032 도쿄도 다이토구 아사쿠사 2-3-1",
    phoneNumber: "03-3842-0181"
  }
];

// 기본 표시할 장소 (처음 로드 시)
export const defaultPlace = placesData[0];