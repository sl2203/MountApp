import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, User, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import BackButton from "../layouts/BackButton";
import { useNavigate } from "react-router-dom";

async function checkNicknameAPI(nickname) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const takenNames = ["admin", "test", "manager"]; 
      resolve(!takenNames.includes(nickname.toLowerCase()));
    }, 600);
  });
}

export default function Profile({ userProfile = {}, onSave = () => {}, onBack = () => {} }) {
  const [nickname, setNickname] = useState(userProfile?.nickname ?? "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(userProfile?.avatarUrl ?? null);
  const [checking, setChecking] = useState(false);          
  const [checkResult, setCheckResult] = useState(null);   
  const fileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!avatarFile && userProfile?.avatarUrl) {
      setAvatarPreview(userProfile.avatarUrl);
    }
  }, [userProfile, avatarFile]);

  useEffect(() => {
    if (!avatarFile) return;
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  useEffect(() => {
    setCheckResult(null);
  }, [nickname]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) setAvatarFile(f);
  };

  const handleCheckNickname = async () => {
    if (!nickname.trim()) {
      alert("활동명을 입력하세요.");
      return;
    }

    setChecking(true);
    const result = await checkNicknameAPI(nickname.trim());
    setChecking(false);
    setCheckResult(result);
  };

  const handleConfirm = () => {
    if (!nickname.trim()) {
      alert("활동명을 입력해 주세요.");
      return;
    }
    if (checkResult !== true) {
      alert("활동명 중복 확인이 필요합니다.");
      return;
    }

    const updated = {
      ...userProfile,
      nickname: nickname.trim(),
      avatarUrl: avatarPreview,
      avatarFile: avatarFile ?? null,
    };

    onSave(updated);
    navigate("/mypage"); 
  };

  return (
    <motion.div
      className="flex flex-col h-screen bg-white absolute inset-0 z-20"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <header className="flex justify-center items-center h-14 px-4 bg-white sticky top-0 z-10 border-b border-gray-100">
        <BackButton onClick={onBack} />
        <h1 className="text-lg font-bold text-gray-900 ml-2">프로필 수정</h1>
      </header>

      <div className="flex-1 overflow-y-auto pb-32">

        <div className="flex justify-center py-8">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-gray-50 overflow-hidden border border-gray-200 flex items-center justify-center shadow-sm">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                  <User className="w-12 h-12 text-gray-300" />
                </div>
              )}
            </div>

            <button
              type="button"
              className="absolute bottom-0 right-0 p-2 bg-white rounded-full border border-gray-300 shadow-lg hover:bg-gray-50 active:scale-95 transition"
              onClick={() => fileRef.current?.click()}
            >
              <Camera className="w-5 h-5 text-gray-600" />
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="px-5 space-y-3">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            활동명 <span className="text-orange-500">*</span>
          </label>

          <div className="flex items-center gap-2">

            <div className="relative flex-1">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="활동명을 입력하세요"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 
                focus:ring-blue-400 focus:border-blue-400 transition-all pr-10"
              />

              {checkResult === true && (
                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
              )}
              {checkResult === false && (
                <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 w-5 h-5" />
              )}
            </div>

            <button
              type="button"
              onClick={handleCheckNickname}
              className="px-4 py-3 bg-blue-600 text-white font-bold rounded-xl shadow 
              hover:bg-blue-700 active:scale-95 transition min-w-[90px] flex items-center justify-center"
            >
              {checking ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "중복확인"
              )}
            </button>
          </div>

          {checkResult === true && (
            <p className="text-sm text-green-600 font-medium">사용 가능한 활동명입니다.</p>
          )}
          {checkResult === false && (
            <p className="text-sm text-red-600 font-medium">이미 사용 중인 활동명입니다.</p>
          )}
        </div>

        <div className="h-3 bg-gray-50 my-8"></div>

        {/* 내 정보 */}
        <div className="px-5">
          <h3 className="text-lg font-bold text-gray-900 mb-4">내 정보</h3>

          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-900">이름</span>
              <span className="text-sm text-gray-600">{userProfile?.name ?? "장민영"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-900">계정</span>
              <span className="text-sm text-gray-600">{userProfile?.email ?? "asvas"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-900">이름</span>
              <span className="text-sm text-gray-600">{userProfile?.name ?? "장민영"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 max-w-md mx-auto w-full z-30">
        <button
          onClick={handleConfirm}
          className="w-full py-4 bg-[#0F172A] text-white font-bold rounded-xl 
          active:scale-[0.98] transition-transform shadow-lg shadow-gray-200"
        >
          확인
        </button>
      </div>
    </motion.div>
  );
}
