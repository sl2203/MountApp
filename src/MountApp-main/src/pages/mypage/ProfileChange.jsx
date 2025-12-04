import React, { useState } from "react";
import { motion } from "framer-motion";
import BackButton from "../../layouts/BackButton";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export default function ProfileChange({ onSave = () => {} }) {
  const navigate = useNavigate();
  const location = useLocation();

  const userProfile = location.state?.userProfile || {
    name: "장민영",
    birth: "20010101",
    gender: "남성",
    phone: "01099700483",
    email: "",
    address: ""
  };

  const [name, setName] = useState(userProfile.name);
  const [birth, setBirth] = useState(userProfile.birth);
  const [gender, setGender] = useState(userProfile.gender); 
  const [phone, setPhone] = useState(userProfile.phone);

  const [emailId, setEmailId] = useState(userProfile.email ? userProfile.email.split("@")[0] : "");
  const [emailDomain, setEmailDomain] = useState(userProfile.email ? userProfile.email.split("@")[1] : "");

  const handleConfirm = () => {
    const updated = {
      name,
      birth,
      gender,
      phone,
      email: emailId && emailDomain ? `${emailId}@${emailDomain}` : "",
      address: zipCode
    };

    onSave(updated);
    console.log("저장된 데이터:", updated);
    navigate(-1);
  };

  const inputClass =
    "w-full px-4 py-3.5 rounded-xl border border-gray-300 text-gray-900 focus:outline-none focus:border-gray-500 placeholder-gray-400";

  return (
    <motion.div
      className="flex flex-col h-screen bg-white absolute inset-0 z-20"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <header className="flex items-center h-14 px-4 bg-white sticky top-0 z-10 border-b border-gray-100 justify-center">
        <BackButton onClick={() => navigate(-1)} />
        <h1 className="text-lg font-bold text-gray-900 ml-2 ">내 정보 변경</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-32 space-y-6">

        {/* 이름 */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">
            이름 <span className="text-orange-500">*</span>
          </label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </div>

        {/* 생년월일 */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">생년월일</label>
          <input type="date" value={birth} onChange={(e) => setBirth(e.target.value)} placeholder="예)20010101" className={inputClass} />
        </div>

        {/* 성별 선택 */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">성별</label>
          <div className="flex gap-3">
            {["남성", "여성"].map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`flex-1 py-3.5 rounded-full border text-sm font-medium transition-colors ${
                  gender === g
                    ? "bg-blue-100 border-blue-700 text-blue-700"
                    : "bg-white border-gray-300 text-gray-400 hover:bg-gray-50"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
          {/* 전화 번호*/}  
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">전화번호</label>
            <div className="flex gap-2">
              {/* 국가번호 고정 */}
              <div className="flex items-center px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-gray-500">+82</span>
              </div>

              {/* 전화번호 입력 */}
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="000-0000-0000"
                className="flex-1 px-4 py-3.5 rounded-xl border border-gray-300 text-gray-900 
                          focus:outline-none focus:border-gray-500 placeholder-gray-400"
              />
            </div>
          </div>
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">이메일 주소</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              placeholder="이메일 주소"
              className={`flex-1 ${inputClass}`}
            />
            <div className="relative w-[40%]">
              <select value={emailDomain} onChange={(e) => setEmailDomain(e.target.value)} className={`w-full appearance-none ${inputClass} pr-8 truncate`}>
                <option value="">주소 선택</option>
                <option value=" ">직접 입력</option>
                <option value="naver.com">naver.com</option>
                <option value="gmail.com">gmail.com</option>
                <option value="daum.net">daum.net</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>
        </div>

      </div>

      {/* 확인 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 max-w-md mx-auto w-full z-30">
        <button
          onClick={handleConfirm}
          className="w-full py-4 bg-[#0F172A] text-white font-bold rounded-xl active:scale-[0.98] transition-transform shadow-lg shadow-gray-200 text-base"
        >
          확인
        </button>
      </div>
    </motion.div>
  );
}
