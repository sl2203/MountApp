import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Star, StarHalf } from "lucide-react";
import { posts, reviews } from "../data";

export default function Community() {
  const navigate = useNavigate();

  const renderStars = (score) => {
    const fullStars = Math.floor(score);
    const hasHalf = score % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    return (
      <div className="flex items-center space-x-1">
        {Array(fullStars).fill().map((_, i) => (
          <Star key={`full-${i}`} size={14} className="text-yellow-400 fill-yellow-400" />
        ))}
        {hasHalf && <StarHalf key="half" size={14} className="text-yellow-400 fill-yellow-400" />}
        {Array(emptyStars).fill().map((_, i) => (
          <Star key={`empty-${i}`} size={14} className="text-gray-300" />
        ))}
      </div>
    );
  };

  return (
    <motion.section className="flex flex-col h-screen">
      {/* 헤더 */}
      <motion.header className="flex flex-col items-center px-5 py-4">
        <h2 className="text-2xl font-bold">커뮤니티</h2>
      </motion.header>
      <div className="h-px bg-gray-200 mb-4"></div>

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
                  <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
                  <span>user</span>
                </div>
                <h4 className="font-bold">{post.title}</h4>
                <p className="text-gray-600 line-clamp-2">{post.comment}</p>
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
                  <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
                  <span>user</span>
                </div>
                <div className="flex justify-between mb-2">
                  <h4 className="font-bold">{review.title}</h4>
                  {renderStars(review.rating)}
                </div>
                <p className="text-gray-600 line-clamp-2">{review.comment}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      </motion.section>
    </motion.section>
  );
}
