import React, { useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import BackButton from "../layouts/BackButton";
import { EllipsisVertical, Edit, Trash2, Star, StarHalf } from "lucide-react";
import { posts, reviews } from "../data";

export default function DetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const commentRef = useRef(null);

  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const path = location.pathname;
  const dataType = path.includes("/post/") ? "post" : "review";

  const item =
    dataType === "post"
      ? posts.find(p => p.id === parseInt(id))
      : reviews.find(r => r.id === parseInt(id));

  if (!item) return <div>데이터를 찾을 수 없습니다.</div>;

  const onLikeClick = () => {
    setLiked(!liked);
    setLikeCount(prev => (liked ? prev - 1 : prev + 1));
  };

  const renderStars = score => {
    if (!score) return null;
    const fullStars = Math.floor(score);
    const hasHalf = score % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    return (
      <div className="flex items-center space-x-1">
        {Array(fullStars)
          .fill()
          .map((_, i) => (
            <Star
              key={`full-${i}`}
              size={14}
              className="text-yellow-400 fill-yellow-400"
            />
          ))}
        {hasHalf && (
          <StarHalf
            key="half"
            size={14}
            className="text-yellow-400 fill-yellow-400"
          />
        )}
        {Array(emptyStars)
          .fill()
          .map((_, i) => (
            <Star key={`empty-${i}`} size={14} className="text-gray-300" />
          ))}
        <span className="ml-1 text-sm font-bold text-gray-400">
          {score.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <motion.section className="flex flex-col p-3 pb-10 relative">
      {/* Header */}
      <motion.header className="flex items-center justify-center py-2 border-b relative">
        <BackButton />
        <h2 className="text-xl font-bold">{item.title}</h2>

        <EllipsisVertical
          className="w-5 h-5 absolute right-2 cursor-pointer z-50"
          onClick={() => setMenuOpen(prev => !prev)}
        />

        {menuOpen && (
          <div className="absolute right-2 top-10 bg-white shadow-lg rounded-lg py-2 w-36 z-50">
            <button
              className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() =>
                navigate("/community/new-post", {
                  state: { isEdit: true, postData: item, type: dataType },
                })
              }
            >
              <Edit size={16} /> 수정
            </button>
            <button
              className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 size={16} /> 삭제
            </button>
          </div>
        )}
      </motion.header>

      <div className="flex items-center justify-between mt-4 px-1">
        <div className="flex items-center">
          <div className="w-11 h-11 rounded-full bg-gray-300"></div>
          <div className="ml-3">
            <p className="font-semibold">user</p>
            <p className="text-xs text-gray-500">{item.date}</p>
          </div>
        </div>
        {dataType === "review" && <div>{renderStars(item.rating)}</div>}
      </div>

      {item.image && (
        <img
          src={item.image}
          className="w-full h-64 object-cover rounded-lg mt-4"
        />
      )}

      <div className="flex items-center space-x-5 mt-3 px-1 text-2xl">
        <button onClick={onLikeClick}>{liked ? "❤️" : "🤍"}</button>
      </div>
      <p className="px-1 mt-1 text-sm font-semibold">좋아요 {likeCount}개</p>

      <p className="px-1 mt-4 text-gray-800 leading-relaxed whitespace-pre-line">
        {item.comment}
      </p>
      <div ref={commentRef} className="mt-8 px-1">
        <h3 className="text-lg font-semibold mb-4">댓글</h3>
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="flex items-start bg-white shadow-md p-5 rounded-xl mb-3 hover:bg-gray-50 transition duration-200 space-x-4"
          >
            <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0"></div>
            <div className="flex-1">
              <p className="font-semibold mb-1">user</p>
              <p className="text-gray-700 leading-relaxed">와 정말 이뻐요</p>
            </div>
          </div>
        ))}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-80 shadow-lg">
            <h3 className="text-lg font-bold mb-4">
              정말 삭제하시겠습니까?
            </h3>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200"
                onClick={() => setShowDeleteModal(false)}
              >
                취소
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-500 text-white"
                onClick={() => {
                  setShowDeleteModal(false);
                  navigate("/community");
                }}
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
}
