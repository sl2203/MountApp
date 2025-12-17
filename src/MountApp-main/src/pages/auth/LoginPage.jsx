import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
    const navigate = useNavigate();

    const [userid, setUserid] = useState("");
    const [password, setPassword] = useState("");

    // [추가됨] JWT 토큰 해독 함수 (토큰 안에 있는 정보를 꺼냅니다)
    const parseJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch (e) {
            return {};
        }
    };

    const handleLogin = async () => {
        if (!userid || !password) {
            alert("아이디와 비밀번호를 모두 입력해주세요.");
            return;
        }

        try {
            // [주의] 포트번호가 8080인지 8082인지 확인해주세요 (스크린샷 에러에는 8080, 8082 둘 다 보였습니다)
            // 일단 기존에 성공했던 주소를 사용하세요.
            const response = await axios.post("http://localhost:8082/api/auth/login", {
                userid: userid,
                password: password,
            });

            if (response.status === 200) {
                const token = response.data.token;
                const decodedToken = parseJwt(token); // 토큰 해독

                console.log("해독된 토큰:", decodedToken);

                // ==========================================================
                // [수정 핵심] role 결정 로직
                // 1. 서버가 response.data.role로 직접 주면 최우선
                // 2. 토큰 안에 role, roles, auth 키가 있으면 사용
                // 3. ★ 중요: 토큰의 주인(sub)이 'admin'이면 관리자로 인정!
                // ==========================================================
                let role = "user"; // 기본값

                if (response.data.role) {
                    role = response.data.role;
                } else if (decodedToken.role || decodedToken.roles || decodedToken.auth) {
                    role = decodedToken.role || decodedToken.roles || decodedToken.auth;
                } else if (decodedToken.sub === "admin") {
                    // ★ 여기가 추가되었습니다. 아이디가 admin이면 관리자 권한 부여
                    role = "admin";
                }

                // 배열로 들어오는 경우 등 예외 처리 (ROLE_ADMIN 변환)
                if (Array.isArray(role)) {
                    role = role.includes("ROLE_ADMIN") || role.includes("admin") ? "admin" : "user";
                }
                if (role === "ROLE_ADMIN") role = "admin";

                console.log("최종 설정된 Role:", role); // 이제 여기에 'admin'이 찍힐 겁니다.

                localStorage.setItem("jwtToken", token);
                localStorage.setItem("role", role);

                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

                alert("로그인 성공! 환영합니다.");

                navigate("/home");
                window.location.reload();
            }
        } catch (error) {
            console.error("로그인 에러:", error);
            const errorMessage = error.response?.data?.message || error.response?.data || "아이디 또는 비밀번호가 일치하지 않습니다.";
            alert(typeof errorMessage === 'string' ? errorMessage : "로그인 실패");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-100 flex justify-center">
            <div className="w-[450px] min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center">
                <motion.div className="bg-white rounded-2xl shadow-xl p-10 w-96">
                    <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
                        로그인
                    </h2>

                    <form className="space-y-5">
                        <div className="flex flex-col">
                            <label className="mb-2 font-medium text-gray-700">아이디</label>
                            <input
                                type="text"
                                placeholder="아이디 입력"
                                value={userid}
                                onChange={(e) => setUserid(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-2 font-medium text-gray-700">비밀번호</label>
                            <input
                                type="password"
                                placeholder="비밀번호 입력"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleLogin}
                            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-semibold"
                        >
                            로그인
                        </button>
                    </form>

                    <p className="text-center mt-6 text-gray-600">
                        계정이 없으신가요?{" "}
                        <span
                            onClick={() => navigate("/join")}
                            className="text-blue-600 cursor-pointer font-semibold hover:underline"
                        >
                            회원가입
                        </span>
                    </p>

                    <p className="text-center m-2 text-gray-600">
                        아이디와 비밀번호를 잃어버리셨나요? <br />
                        <span
                            onClick={() => navigate("/find")}
                            className="text-blue-600 cursor-pointer font-semibold hover:underline"
                        >
                            아이디/비밀번호 찾기
                        </span>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}