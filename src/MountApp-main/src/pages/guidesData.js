import hanla from "../assets/hanla.jpeg";
import hanla1 from "../assets/hanla1.jpg";
import hanla2 from "../assets/hanla2.jpg";
import seorak from "../assets/seorak.jpg";
import seorak1 from "../assets/seorak1.jpg";
import seorak2 from "../assets/seorak2.jpg";
import bukhan from "../assets/bukhan.jpeg";
import bukhan1 from "../assets/bukhan1.jpg";
import bukhan2 from "../assets/bukhan2.jpg";
import gyeyang from "../assets/gyeyang.jpeg";
import gyeyang1 from "../assets/gyeyang1.jpg";
import gyeyang2 from "../assets/gyeyang2.jpg";

export const guides = [
  {
    name: "한라산",
    image: [hanla, hanla1, hanla2], 
    description:
      "남한에서 가장 높은 산이자 유네스코 세계자연유산입니다. 정상의 백록담과 사계절 내내 변하는 아름다운 자연 경관으로 유명합니다.",
    trails: "성판악 코스 (9.6km, 편도 4시간 30분)\n관음사 코스 (8.7km, 편도 5시간)",
    difficulty: "성판악(중), 관음사(상)",
    height: "1,947m",
    lat: 33.3617, 
    lon: 126.5292, 
    notices: [
      "한라산은 날씨 변동이 매우 심하니, 방한/방수 의류를 꼭 챙기세요.",
      "탐방로 입산 및 하산 시간이 정해져 있으니(계절별 상이) 미리 확인해야 합니다.",
      "성판악, 관음사 코스를 이용한 정상(백록담) 탐방은 사전 예약이 필수입니다.",
      "지정된 탐방로 외에는 출입을 금합니다.",
      "비상 시 119 또는 한라산국립공원사무소(064-713-9950)로 연락하세요."
    ]
  },
  {
    name: "설악산",
    image: [seorak, seorak1, seorak2],
    description:
      "웅장한 기암괴석과 맑은 계곡이 어우러진 대한민국 대표 명산입니다. 유네스코 생물권 보전지역으로, 특히 가을 단풍이 절경입니다.",
    trails:
      "대청봉 코스 (오색 출발, 5km, 편도 4시간)\n울산바위 코스 (3.8km, 왕복 4시간)",
    difficulty: "대청봉(상), 울산바위(중)",
    height: "1,708m",
    lat: 38.1197, 
    lon: 128.4659, 
    notices: [
      "설악산은 지형이 험하고 날씨 변화가 심합니다. 안전사고에 유의하세요.",
      "대청봉 등 고지대는 기온이 낮으니 보온 의류를 준비하세요.",
      "입산 시간이 정해져 있으니 미리 확인하세요.",
      "야생동물(특히 곰) 출몰 지역이 있으니 주의가 필요합니다.",
      "낙석 위험 구간이 있으니, 지정된 탐방로를 이용하세요."
    ]
  },
  {
    name: "북한산",
    image: [bukhan, bukhan1, bukhan2],
    description:
      "서울과 경기도에 걸쳐 있는 국립공원으로, '서울의 폐'라 불립니다. 화강암 봉우리와 북한산성이 어우러져 수많은 등산객이 찾습니다.",
    trails:
      "백운대 코스 (우이동 기점, 3.4km, 편도 1시간 30분)\n북한산성 코스 (산성입구 기점, 3.4km, 편도 1시간 10분)",
    difficulty: "백운대(중상), 북한산성(하)",
    height: "836m (백운대)",
    lat: 37.6581, 
    lon: 126.9895, 
    notices: [
      "암벽 구간이 많으니 미끄러지지 않는 등산화를 착용하세요.",
      "주말 및 공휴일에는 매우 혼잡할 수 있으니, 여유롭게 산행하세요.",
      "지정된 탐방로가 아닌 샛길(비법정 탐방로) 출입을 금합니다.",
      "고양이 등 야생동물에게 먹이를 주지 마세요.",
      "낙석 위험 구간에서는 주의가 필요합니다."
    ]
  },
  {
    name: "계양산",
    image: [gyeyang, gyeyang1, gyeyang2 ],
    description:
      "인천광역시를 대표하는 산으로, 정상에서 인천 시내는 물론, 날씨가 좋으면 서울과 서해 바다까지 조망할 수 있습니다. 잘 정비된 숲길과 둘레길이 특징입니다.",
    trails:
      "연무정 코스 (1.5km, 편도 40분)\n계산역 코스 (1.9km, 편도 50분)",
    difficulty: "하~중",
    height: "395m",
    lat: 37.5556, 
    lon: 126.7372,
    notices: [
      "도심과 가까워 주말에 등산객이 많으니, 안전사고에 유의하세요.",
      "계양산성 등 문화재가 있으니 훼손되지 않도록 주의해주세요.",
      "낮은 산이지만, 등산로가 아닌 샛길로 빠지지 않도록 주의합니다.",
      "산불 조심 기간(봄, 가을)에는 화기 소지를 엄격히 금합니다."
    ]
  }
];