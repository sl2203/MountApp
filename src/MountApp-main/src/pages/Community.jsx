import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Community() {
  const navigate = useNavigate();

  const posts = [
    { id: 1, title: "북한산 등산 후기", comment: "정상에서 본 서울 야경이 정말 멋졌어요!" },
    { id: 2, title: "등산화 추천 부탁드려요", comment: "초보인데 발 안 아픈 신발 있을까요?" },
    { id: 3, title: "지리산 종주 준비 중입니다", comment: "코스와 숙박 팁 공유해요!" },
    { id: 4, title: "비 오는 날 등산 꿀팁", comment: "방수 자켓은 필수! 그리고 여분 양말 챙기세요." },
    { id: 5, title: "한라산 겨울 등산 후기", comment: "눈 덮인 백록담 너무 아름다웠어요!" },
    { id: 6, title: "속리산 단풍 산행", comment: "가을 단풍이 정말 장관이에요." },
  ];

  const reviews = [
    { id: 101, title: "설악산", rating: "⭐️⭐️⭐️⭐️⭐️", comment: "경치 최고예요. 단풍철에 꼭 가보세요!" },
    { id: 102, title: "블랙야크 등산화", rating: "⭐️⭐️⭐️⭐️", comment: "착용감 좋고 방수도 괜찮아요." },
    { id: 103, title: "도봉산", rating: "⭐️⭐️⭐️", comment: "초보자도 오르기 쉬워요. 다만 주말엔 붐빕니다." },
    { id: 104, title: "네파 바람막이", rating: "⭐️⭐️⭐️⭐️⭐️", comment: "가볍고 통풍이 잘 돼요. 여름 산행에 딱!" },
    { id: 105, title: "북한산 국립공원", rating: "⭐️⭐️⭐️⭐️⭐️", comment: "서울 도심 근처인데 자연 그대로예요!" },
    { id: 106, title: "고어텍스 재킷", rating: "⭐️⭐️⭐️⭐️", comment: "비 오는 날에도 쾌적하게 등산 가능해요." },
  ];

  return (
    <motion.section className="flex flex-col h-screen">
      <motion.header className="flex flex-col items-center py-5">
        <h2 className="text-2xl font-bold">커뮤니티</h2>
      </motion.header>

      <motion.section className="flex-1 flex flex-col overflow-hidden space-y-6 p-4 gap-5">
        {/* 게시글 섹션 */}
        <motion.section className="overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">📢 게시글</h3>
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
              onClick={() => navigate("/community/new-post")}
            >
              글쓰기
            </button>
          </div>

          <motion.div className="flex gap-4 pb-3 overflow-x-auto">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                className="flex-shrink-0 w-64 border rounded-2xl p-4 bg-white shadow-md"
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate(`/community/post/${post.id}`)}
              >
                <div className="flex items-center mb-3">
                  <img className="w-10 h-10 rounded-full mr-3" />
                  <span>user</span>
                </div>
                <h4 className="font-bold">{post.title}</h4>
                <p className="text-gray-600">{post.comment}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* 리뷰 섹션 */}
        <motion.section className="overflow-x-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-semibold">⭐️ 리뷰</h3>
            <button
              className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
              onClick={() => navigate("/community/new-review")}
            >
              리뷰 작성
            </button>
          </div>

          <motion.div className="flex gap-4 pb-3 overflow-x-auto">
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                className="flex-shrink-0 w-64 border rounded-2xl p-4 bg-white shadow-md"
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate(`/community/review/${review.id}`)}
              >
                <div className="flex items-center mb-3">
                  <img className="w-10 h-10 rounded-full mr-3" />
                  <span>user</span>
                </div>
                <div className="flex justify-between mb-2">
                  <h4 className="font-bold">{review.title}</h4>
                  <span>{review.rating}</span>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

      </motion.section>
    </motion.section>
  );
}
