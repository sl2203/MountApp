import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function MapPage() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleLogout = () => {
    console.log("로그아웃 완료");
    setShowLogoutModal(false);
    navigate("/login");
  };

  const handleDeleteAccount = () => {
    console.log("계정 탈퇴 완료");
    setShowDeleteModal(false);
    navigate("/login"); 
  };

  return (
    <motion.section className="flex flex-col p-4">
      <motion.header className="flex flex-col items-center ">
        <h2 className="text-2xl font-bold">마이페이지</h2>
      </motion.header>

      <motion.div className="flex flex-col items-center justify-center gap-5 py-[150px]">
        <button onClick={() => navigate("/account")} className="w-64 border-2 p-3 rounded-md">계정정보 확인/수정</button>
        <button onClick={() => setShowLogoutModal(true)} className="w-64 border-2 p-3 rounded-md">로그아웃 </button>
        <button onClick={() => setShowDeleteModal(true)} className="w-64 border-2 p-3 rounded-md"> 계정 탈퇴 </button>
      </motion.div>
      
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-80 text-center">
            <h3 className="text-lg font-semibold mb-4">로그아웃 하시겠습니까?</h3>
            <div className="flex justify-center gap-4">
              <button onClick={handleLogout}className="px-4 py-2 bg-gray-500 text-white rounded-md">확인</button>
              <button onClick={() => setShowLogoutModal(false)} className="px-4 py-2 border rounded-md">취소</button>
            </div>
          </div>
        </div>
      )}
       {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 shadow-lg w-80 text-center">
          <h3 className="text-lg font-semibold mb-4">정말 계정을 탈퇴하시겠습니까?</h3>
          <p className="text-sm mb-4 text-gray-600">계정을 삭제하면 모든 정보가 복구되지 않습니다.</p>
          <div className="flex justify-center gap-4">
            <button onClick={handleDeleteAccount}className="px-4 py-2 bg-gray-500 text-white rounded-md">확인</button>
            <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 border rounded-md">취소</button>
          </div>
        </div>
      </div>
      )}
    </motion.section>
  );
}
