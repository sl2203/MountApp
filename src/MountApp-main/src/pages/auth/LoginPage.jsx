import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Lock, Eye, EyeOff } from "lucide-react";

import logo from "/src/assets/logo.png";
export default function LoginPage() {
    const navigate = useNavigate();
    const [userid, setUserid] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // JWT 토큰 해독 로직
    const parseJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) { return {}; }
    };

    const handleLogin = async () => {
        if (!userid || !password) {
            alert("아이디와 비밀번호를 모두 입력해주세요.");
            return;
        }
        try {
            const response = await axios.post("http://localhost:8082/api/auth/login", { userid, password });
            if (response.status === 200) {
                const token = response.data.token;
                const decodedToken = parseJwt(token);
                let role = response.data.role || decodedToken.role || (decodedToken.sub === "admin" ? "admin" : "user");

                localStorage.setItem("jwtToken", token);
                localStorage.setItem("role", role);
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                alert("로그인 성공!");
                navigate("/home");
                window.location.reload();
            }
        } catch (error) {
            alert("아이디 또는 비밀번호가 일치하지 않습니다.");
        }
    };

    return (
        <div className="w-full min-h-screen max-w-[450px] bg-white flex justify-center items-center font-sans p-4">
            {/* 메인 카드 박스 */}
            <div className="w-full max-w-[450px] bg-white min-h-full p-10 flex flex-col items-center">

                {/* 서비스 로고 */}
                <img src={logo} alt="Logo" className="w-28 h-28 object-fill rounded-full" />
                <h1 className="text-[30px] font-bold text-gray-900 mb-2 p-3">로그인</h1>
                <p className="text-gray-500 text-sm mb-10 text-center">계정에 로그인하여 서비스를 이용해보세요.</p>

                <div className="w-full space-y-4">
                    {/* 아이디 입력창 */}
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="이메일 또는 아이디"
                            value={userid}
                            onChange={(e) => setUserid(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-[#F3F4F6] border-none rounded-[18px] focus:ring-2 focus:ring-indigo-500 transition-all text-sm outline-none"
                        />
                    </div>

                    {/* 비밀번호 입력창 */}
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                            className="w-full pl-12 pr-12 py-4 bg-[#F3F4F6] border-none rounded-[18px] focus:ring-2 focus:ring-indigo-500 transition-all text-sm outline-none"
                        />
                        <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* 로그인 유지 및 링크 */}
                    <div className="flex items-center justify-between px-1">
                        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-indigo-600" />
                            <span>로그인 유지</span>
                        </label>

                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <button
                                onClick={() => navigate("/find_id")}
                                className="text-gray-600 font-medium hover:text-indigo-600 hover:underline transition-colors"
                            >
                                아이디 찾기
                            </button>
                            <span className="text-[10px]">|</span>
                            <button
                                onClick={() => navigate("/find_pw")}
                                className="text-gray-600 font-medium hover:text-indigo-600 hover:underline transition-colors"
                            >
                                비밀번호 찾기
                            </button>
                        </div>
                    </div>

                    {/* 로그인 버튼 */}
                    <button
                        onClick={handleLogin}
                        className="w-full bg-[#6366F1] text-white py-4 rounded-[18px] font-bold text-lg hover:bg-[#4F46E5] shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] mt-2"
                    >
                        로그인
                    </button>
                </div>

                {/* 소셜 로그인 섹션 */}
                <div className="w-full mt-12">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="flex-1 h-[1px] bg-gray-200" />
                        <span className="text-[12px] text-gray-400 font-medium whitespace-nowrap">SNS 계정으로 간편 로그인</span>
                        <div className="flex-1 h-[1px] bg-gray-200" />
                    </div>

                    <div className="flex justify-center gap-5">
                        <SocialBtn imgSrc="/src/assets/kakao.png" altText="카카오" bgColor="bg-[#FEE500]" />
                        <SocialBtn imgSrc="/src/assets/naver.png" altText="네이버" bgColor="bg-[#03C75A]" />
                        <SocialBtn imgSrc="/src/assets/google.png" altText="구글" bgColor="bg-white border border-gray-100" />
                        <SocialBtn imgSrc="/src/assets/github.png" altText="깃허브" bgColor="bg-[#181717]" />
                        <SocialBtn imgSrc="/src/assets/facebook.png" altText="페이스북" bgColor="bg-[#1877F2]" />
                    </div>
                </div>

                <div className="mt-10 text-sm text-gray-500">
                    아직 계정이 없으신가요? <button onClick={() => navigate("/Join_1")} className="text-indigo-600 font-bold hover:underline ml-1">회원가입</button>
                </div>
            </div>
        </div>
    );
}

// 소셜 버튼 컴포넌트 (이미지용)
function SocialBtn({ imgSrc, altText, bgColor }) {
    return (
        <button
            className={`${bgColor} w-11 h-11 rounded-full flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all overflow-hidden p-2.5`}
            title={altText}
        >
            <img
                src={imgSrc}
                alt={altText}
                className={`
                    ${altText === '네이버' ? 'w-4 h-4' :
                    altText === '구글' ? 'w-6 h-6' : 'w-full h-full'} 
                    object-contain transition-transform group-hover:scale-110
                `}
            />
        </button>
    );
}