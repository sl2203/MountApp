import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import BackButton from "../layouts/BackButton";
import { Star, StarHalf } from "lucide-react";

const categories = ["산", "등산용품", "맛집", "숙소"];

function StarRating({ rating, setRating }) {
  const handleClick = (e, star) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - left;
    const isHalf = clickX < width / 2;
    setRating(star - (isHalf ? 0.5 : 0));
  };

  return (
    <div className="flex gap-1 mt-2 mb-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <div
          key={star}
          className="relative w-6 h-6 cursor-pointer"
          onClick={(e) => handleClick(e, star)}
        >
          {rating >= star ? (
            <Star
              size={24}
              className="text-yellow-400 fill-yellow-400 absolute top-0 left-0"
            />
          ) : rating + 0.5 >= star ? (
            <StarHalf
              size={24}
              className="text-yellow-400 fill-yellow-400 absolute top-0 left-0"
            />
          ) : (
            <Star
              size={24}
              className="text-gray-300 absolute top-0 left-0"
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function NewPost({ type = "post" }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isEdit = location.state?.isEdit || false;
  const postData = location.state?.postData || {};
  const postType = location.state?.type || type;

  const [title, setTitle] = useState(isEdit ? postData.title : "");
  const [content, setContent] = useState(isEdit ? postData.comment : "");
  const [images, setImages] = useState(
    isEdit && postData.image ? [postData.image] : []
  );
  const [password, setPassword] = useState("");
  const [rating, setRating] = useState(
    isEdit && postData.rating ? postData.rating : 0
  );
  const [category, setCategory] = useState(
    isEdit && postData.category ? postData.category : categories[0]
  );
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = () => {
    const payload = { title, content, images, type: postType };
    if (postType === "review") {
      payload.rating = rating;
      payload.category = category;
    }
    if (isEdit) {
      console.log("수정 완료:", payload);
    } else {
      console.log("새 작성:", payload);
    }
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImages((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const handleRemoveImage = (index) =>
    setImages(images.filter((_, i) => i !== index));

  const handleModalConfirm = () => {
    setShowModal(false);
    navigate("/community");
  };

  return (
    <motion.div className="flex flex-col min-h-screen p-4 bg-gray-50">
      <div className="relative flex items-center border rounded-lg p-3 bg-white mb-4 min-h-[50px] w-full">
        <BackButton />
        <h2 className="font-bold text-lg text-center flex-1">
          {isEdit
            ? postType === "review"
              ? "리뷰 수정"
              : "게시글 수정"
            : postType === "review"
            ? "리뷰 작성"
            : "게시글 작성"}
        </h2>
      </div>

      {postType === "review" && (
        <div className="flex gap-2 mb-4 justify-center sm:justify-start">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full border transition-colors
                ${category === cat ? "bg-blue-500 text-white" : "bg-white text-gray-700 border-gray-300"}
                hover:bg-blue-400 hover:text-white`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="border rounded-lg bg-white p-3 mb-4">
        <input
          type="text"
          placeholder="제목을 입력하세요"
          className="w-full outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="h-[500px] border rounded-lg bg-white p-3 mb-4">
        <textarea
          className="w-full h-full resize-none outline-none"
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {postType === "review" && <StarRating rating={rating} setRating={setRating} />}

      <div className="mb-2 flex items-center justify-between">
        <label className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 text-sm font-semibold hover:bg-blue-200 cursor-pointer transition-colors">
          이미지 추가
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={handleSubmit}
        >
          완료
        </button>
      </div>

      {images.length > 0 && (
        <div className="flex gap-2 mt-2 pb-2 overflow-x-auto">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative flex-shrink-0 w-20 h-20 border rounded-lg overflow-hidden"
            >
              <img
                src={typeof img === "string" ? img : URL.createObjectURL(img)}
                alt={`preview-${i}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleRemoveImage(i)}
                className="absolute top-0 right-0 bg-red-400 text-white w-5 h-5 flex items-center justify-center text-xs"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}

      {isEdit && (
        <div className="mt-4 flex gap-3">
          <input
            type="password"
            placeholder="비밀번호"
            className="flex-1 border rounded-lg p-2 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={() => {
              console.log("입력한 비밀번호 확인:", password);
              alert("비밀번호를 확인했습니다.");
            }}
          >
            확인
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-xl w-80 p-6 text-center">
            <h3 className="text-2xl font-bold mb-4">
              {isEdit ? "수정 완료!" : "작성 완료!"}
            </h3>
            <p className="text-gray-600 mb-6">
              {isEdit
                ? postType === "review"
                  ? "리뷰가 성공적으로 수정되었습니다."
                  : "게시글이 성공적으로 수정되었습니다."
                : postType === "review"
                ? "리뷰가 성공적으로 등록되었습니다."
                : "게시글이 성공적으로 등록되었습니다."}
            </p>
            <button
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl"
              onClick={handleModalConfirm}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
