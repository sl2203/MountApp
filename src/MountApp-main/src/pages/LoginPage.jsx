import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
        <motion.div className="bg-white rounded-2xl shadow-xl p-10 w-96" >
            <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">로그인</h2>
            <form className="space-y-5">
            <div className="flex flex-col">
                <label className="mb-2 font-medium text-gray-700">아이디</label>
                <input
                type="아이디"
                placeholder="아이디 입력"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <div className="flex flex-col">
                <label className="mb-2 font-medium text-gray-700">비밀번호</label>
                <input
                type="password"
                placeholder="비밀번호 입력"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <button
                type="button"
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-semibold"
            >
                로그인
            </button>
            </form>
            
            <p className="text-center mt-6 text-gray-600">
            계정이 없으신가요?{" "}
            <span 
            onClick={() => navigate("/join")}
            className="text-blue-600 cursor-pointer font-semibold hover:underline">
                회원가입
            </span>
            </p>
            
            <p className="text-center m-2 text-gray-600">
                아이디와 비멀 번호를 잃어버리셨나요? <br />
            <span 
            onClick={() => navigate("/find")}
            className="text-blue-600 cursor-pointer font-semibold hover:underline text-center">
                아아디/비멀번호 찾기
            </span>
            </p>
        </motion.div>
        </div>
  );
}
