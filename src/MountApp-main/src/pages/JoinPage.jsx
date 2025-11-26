import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function JoinPage() {
    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        userid: '',       // 아이디
        password: '',       // 비밀번호
        passwordConfirm: '',// 비밀번호 확인
        phone: '',          // 전화번호
        authCode: '',       // 인증번호 (지금은 UI만)
        email: '',          // 이메일
        name: '',           // 이름
        birthdate: '',      // 생년월일
        gender: '',          // 성별
        nickname: ''           //활동명
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };


    const handleSubmit = async () => {
        // 유효성 검사 (비밀번호 일치 여부 등)
        if (formData.password !== formData.passwordConfirm) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {

            const response = await axios.post('/api/auth/join', {
                userid: formData.userid,
                password: formData.password,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                birthdate: formData.birthdate,
                gender: formData.gender,
                nickname: formData.nickname
            });

            if (response.status === 200) {
                alert("회원가입 성공! 로그인 페이지로 이동합니다.");
                navigate('/login');
            }
        } catch (error) {
            console.error("회원가입 에러:", error);

            alert(error.response?.data || "회원가입에 실패했습니다.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-4">
            <motion.div className="bg-white rounded-2xl shadow-xl p-4 w-[310px]">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">회원가입</h2>
                <form className="space-y-4">

                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">활동명</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                name="nickname"
                                value={formData.nickname}
                                onChange={handleChange}
                                placeholder="활동명 입력"
                                className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <button
                                type="button"
                                className="bg-blue-500 text-white px-3 whitespace-nowrap rounded-lg hover:bg-blue-600 transition font-semibold"
                            >
                                중복
                            </button>
                        </div>
                    </div>
                    {/* 아이디 */}
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">아이디</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                name="userid" // state 이름과 일치시켜야 함
                                value={formData.userid}
                                onChange={handleChange}
                                placeholder="아이디 입력"
                                className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <button
                                type="button"
                                className="bg-blue-500 text-white px-3 whitespace-nowrap rounded-lg hover:bg-blue-600 transition font-semibold"
                                onClick={() => alert('중복 확인 기능은 백엔드 API가 필요합니다.')}
                            >
                                중복
                            </button>
                        </div>
                    </div>

                    {/* 비밀번호 */}
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">비밀번호</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="비밀번호 입력"
                            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* 비밀번호 확인 */}
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">비밀번호 확인</label>
                        <input
                            type="password"
                            name="passwordConfirm"
                            value={formData.passwordConfirm}
                            onChange={handleChange}
                            placeholder="비밀번호 재입력"
                            className={`p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                                formData.password && formData.password !== formData.passwordConfirm
                                    ? "border-red-500 focus:ring-red-400"
                                    : "focus:ring-blue-400"
                            }`}
                        />
                    </div>

                    {/* 전화번호 */}
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">전화번호</label>
                        <div className="flex gap-2">
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="전화번호 입력"
                                className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <button type="button" className="bg-sky-500 text-white px-3 py-2 whitespace-nowrap rounded-lg hover:bg-sky-600 transition font-semibold">
                                인증
                            </button>
                        </div>
                    </div>

                    {/* 인증번호 (UI만 존재) */}
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">인증번호</label>
                        <input
                            type="text"
                            name="authCode"
                            placeholder="인증번호 입력"
                            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* 이메일 */}
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">이메일</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="이메일 입력"
                            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* 이름 */}
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">이름</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="이름 입력"
                            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* 생년월일 */}
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">생년월일</label>
                        <input
                            type="date"
                            name="birthdate"
                            value={formData.birthdate}
                            onChange={handleChange}
                            className="p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* 성별 */}
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">성별</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">선택</option>
                            <option value="MALE">남성</option>
                            <option value="FEMALE">여성</option>
                        </select>
                    </div>

                    {/* 제출 버튼 */}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-semibold"
                    >
                        확인
                    </button>
                </form>
            </motion.div>
        </div>
    );
}