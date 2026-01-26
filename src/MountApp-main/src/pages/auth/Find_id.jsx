import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, User, Phone, Mail, AlertCircle } from "lucide-react";

export default function Find_id() {
    const navigate = useNavigate();
    const [method, setMethod] = useState("phone"); // 'phone' 또는 'email'
    const [name, setName] = useState("");
    const [contact, setContact] = useState(""); // 휴대폰번호와 이메일을 공통으로 관리

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-[450px] bg-white flex flex-col">

                {/* 헤더 */}
                <div className="flex items-center px-4 py-6 border-b border-gray-100 relative">
                    <button onClick={() => navigate(-1)} className="absolute left-4">
                        <ChevronLeft size={24} className="text-gray-900" />
                    </button>
                    <h2 className="w-full text-center font-bold text-2xl text-gray-900">아이디 찾기</h2>
                </div>

                <div className="p-8 flex flex-col flex-1">
                    {/* 타이틀 및 설명 */}
                    <div className="mb-10">
                        <h1 className="text-[24px] font-bold text-gray-900 mb-3">아이디를 잊으셨나요?</h1>
                        <p className="text-gray-500 text-[15px] leading-relaxed">
                            회원가입 시 등록한 정보로<br />
                            간편하게 아이디를 찾을 수 있습니다.
                        </p>
                    </div>

                    {/* 인증 방식 선택 탭 */}
                    <div className="flex p-1 bg-gray-100 rounded-[14px] mb-10">
                        <button
                            onClick={() => { setMethod("phone"); setContact(""); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[12px] text-sm font-semibold transition-all ${
                                method === "phone" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-400"
                            }`}
                        >
                            <Phone size={16} /> 휴대폰 인증
                        </button>
                        <button
                            onClick={() => { setMethod("email"); setContact(""); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[12px] text-sm font-semibold transition-all ${
                                method === "email" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-400"
                            }`}
                        >
                            <Mail size={16} /> 이메일 인증
                        </button>
                    </div>

                    {/* 입력 필드 섹션 */}
                    <div className="space-y-6 flex-1">
                        <div>
                            <label className="block text-[15px] font-bold text-gray-900 mb-3">이름</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="실명을 입력해주세요"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-[14px] focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-[15px]"
                                />
                            </div>
                        </div>

                        {/* 이메일 인증 클릭 시 가변적으로 변하는 부분 */}
                        <div>
                            <label className="block text-[15px] font-bold text-gray-900 mb-3">
                                {method === "phone" ? "휴대폰 번호" : "이메일 주소"}
                            </label>
                            <div className="relative">
                                {method === "phone" ? (
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                ) : (
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                )}
                                <input
                                    type={method === "phone" ? "tel" : "email"}
                                    placeholder={method === "phone" ? "'-' 없이 번호만 입력" : "example@mail.com"}
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-[14px] focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-[15px]"
                                />
                            </div>
                        </div>

                        {/* 인증번호 받기 버튼 */}
                        <button
                            className={`w-full py-4 rounded-[14px] font-bold text-lg transition-colors mt-4 ${
                                name && contact
                                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                    : "bg-[#C1C4F8] text-white cursor-not-allowed"
                            }`}
                        >
                            인증번호 받기
                        </button>

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
        </div>
    );
}