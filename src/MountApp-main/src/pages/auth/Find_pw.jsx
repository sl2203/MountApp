import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Smartphone, Mail, AlertCircle } from "lucide-react";

export default function Find_pw() {
    const navigate = useNavigate();
    const [method, setMethod] = useState("phone"); // 'phone' 또는 'email'
    const [userid, setUserid] = useState("");
    const [contact, setContact] = useState("");

    // 인증 요청 버튼 활성화 조건
    const isFormValid = userid.trim() !== "" && contact.trim() !== "";

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-[450px] bg-white flex flex-col">

                {/* 헤더 */}
                <div className="flex items-center px-4 py-6 border-b border-gray-100 relative">
                    <button onClick={() => navigate(-1)} className="absolute left-4">
                        <ChevronLeft size={24} className="text-gray-900" />
                    </button>
                    <h2 className="w-full text-center font-bold text-xl text-gray-900">비밀번호 찾기</h2>
                </div>

                <div className="p-8 flex flex-col flex-1">
                    {/* 타이틀 및 설명 */}
                    <div className="mb-10">
                        <h1 className="text-[26px] font-bold text-gray-900 mb-3">비밀번호 재설정</h1>
                        <p className="text-gray-500 text-[15px] leading-relaxed">
                            회원정보에 등록된 정보로<br />
                            비밀번호를 재설정할 수 있습니다.
                        </p>
                    </div>

                    {/* 아이디 입력 섹션 */}
                    <div className="mb-8">
                        <label className="block text-[15px] font-bold text-gray-900 mb-3">아이디</label>
                        <input
                            type="text"
                            placeholder="가입한 아이디를 입력하세요"
                            value={userid}
                            onChange={(e) => setUserid(e.target.value)}
                            className="w-full px-5 py-4 bg-[#f9fafb] border border-gray-100 rounded-[14px] focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-[15px]"
                        />
                    </div>

                    {/* 인증 수단 선택 (이미지 스타일 적용) */}
                    <div className="mb-8">
                        <label className="block text-[15px] font-bold text-gray-900 mb-3">인증 수단 선택</label>
                        <div className="flex gap-4">
                            <button
                                onClick={() => { setMethod("phone"); setContact(""); }}
                                className={`flex-1 flex flex-col items-center justify-center py-6 rounded-2xl border-2 transition-all gap-2 ${
                                    method === "phone"
                                        ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                                        : "border-gray-100 bg-white text-gray-400"
                                }`}
                            >
                                <Smartphone size={24} />
                                <span className="text-sm font-bold">휴대폰 인증</span>
                            </button>
                            <button
                                onClick={() => { setMethod("email"); setContact(""); }}
                                className={`flex-1 flex flex-col items-center justify-center py-6 rounded-2xl border-2 transition-all gap-2 ${
                                    method === "email"
                                        ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                                        : "border-gray-100 bg-white text-gray-400"
                                }`}
                            >
                                <Mail size={24} />
                                <span className="text-sm font-bold">이메일 인증</span>
                            </button>
                        </div>
                    </div>

                    {/* 가변 입력 필드 (휴대폰 번호 / 이메일) */}
                    <div className="mb-10">
                        <label className="block text-[15px] font-bold text-gray-900 mb-3">
                            {method === "phone" ? "휴대폰 번호" : "이메일 주소"}
                        </label>
                        <div className="flex gap-2">
                            <input
                                type={method === "phone" ? "tel" : "email"}
                                placeholder={method === "phone" ? "'-' 없이 숫자만 입력" : "example@mail.com"}
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                className="flex-1 px-5 py-4 bg-[#f9fafb] border border-gray-100 rounded-[14px] focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-[15px]"
                            />
                            <button
                                disabled={!isFormValid}
                                className={`px-5 py-4 rounded-[14px] font-bold text-sm whitespace-nowrap transition-all ${
                                    isFormValid
                                        ? "bg-indigo-600 text-white shadow-md active:scale-95"
                                        : "bg-[#C1C4F8] text-white cursor-not-allowed"
                                }`}
                            >
                                인증 요청
                            </button>
                        </div>
                    </div>
                    {/* 안내 문구 박스 */}
                    <div className="bg-gray-50 rounded-[12px] p-4 flex items-start gap-3 mt-auto">
                        <AlertCircle size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="text-[12px] text-gray-500 leading-normal">
                            입력하신 정보가 회원정보와 일치해야 인증번호를 받을 수 있습니다.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}