import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
    const navigate = useNavigate();


    const [userid, setUserid] = useState("");
    const [password, setPassword] = useState("");


    const handleLogin = async () => {
        if (!userid || !password) {
            alert("아이디와 비밀번호를 모두 입력해주세요.");
            return;
        }

        try {

            const response = await axios.post("/api/auth/login", {
                userid: userid,
                password: password,
            });


            if (response.status === 200) {
                const token = response.data.token;


                localStorage.setItem("jwtToken", token);


                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                alert("로그인 성공! 환영합니다.");
                navigate("/"); // 메인 페이지로 이동
            }
        } catch (error) {
            console.error("로그인 에러:", error);

            alert(error.response?.data || "아이디 또는 비밀번호가 일치하지 않습니다.");
        }
    };


    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
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
                            value={userid} // 변수와 연결
                            onChange={(e) => setUserid(e.target.value)} // 입력할 때마다 변수 업데이트
                            onKeyDown={handleKeyDown} // 엔터키 기능 추가
                            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-2 font-medium text-gray-700">비밀번호</label>
                        <input
                            type="password"
                            placeholder="비밀번호 입력"
                            value={password} // 변수와 연결
                            onChange={(e) => setPassword(e.target.value)} // 입력할 때마다 변수 업데이트
                            onKeyDown={handleKeyDown} // 엔터키 기능 추가
                            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleLogin} // 클릭 시 로그인 함수 실행
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
                    아이디와 비밀 번호를 잃어버리셨나요? <br />
                    <span
                        onClick={() => navigate("/find")}
                        className="text-blue-600 cursor-pointer font-semibold hover:underline text-center"
                    >
            아이디/비밀번호 찾기
          </span>
                </p>
            </motion.div>
        </div>
    );
}