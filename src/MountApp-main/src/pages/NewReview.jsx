import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import BackButton from "../layouts/BackButton";

export default function NewPost() {
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = location.state?.isEdit || false; 

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false); 

  const handleSubmit = () => {
    setShowModal(true); 
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {  
      const newImages = Array.from(files);
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    navigate("/community");
  };

  return (
    <motion.div className="flex flex-col h-screen p-4 bg-gray-50">
      <div className="relative flex items-center justify-center border rounded-lg p-3 bg-white mb-4 min-h-[50px]">
        <BackButton />
        <h2 className="font-bold text-lg">리뷰 작성</h2>
      </div>

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
          placeholder="리뷰 내용 작성하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

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
          {images.map((image, index) => (
            <div
              key={index}
              className="relative flex-shrink-0 w-20 h-20 border rounded-lg overflow-hidden"
            >
              <img
                src={URL.createObjectURL(image)}
                alt={`preview-${index}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleRemoveImage(index)}
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
            placeholder="비밀번호 입력란"
            className="flex-1 border rounded-lg p-2 bg-white outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={handleSubmit}
          >
            확인 버튼
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-xl w-80 p-6 text-center animate-fadeIn">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">리뷰 작성 완료!</h3>
            <p className="text-gray-600 mb-6">리뷰가 성공적으로 등록되었습니다.</p>
            <button
              onClick={handleModalConfirm}
              className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
