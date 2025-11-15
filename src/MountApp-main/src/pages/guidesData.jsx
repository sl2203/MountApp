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
  },
];