import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function JoinPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        userid: '',
        password: '',
        passwordConfirm: '',
        phone: '',
        authCode: '',
        email: '',
        name: '',
        birthdate: '',
        gender: '',
        nickname: ''
    });

    const [checkingNick, setCheckingNick] = useState(false);
    const [nickCheckResult, setNickCheckResult] = useState(null);

    const [checkingID, setCheckingID] = useState(false);
    const [idCheckResult, setIdCheckResult] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === "nickname") setNickCheckResult(null);
        if (name === "userid") setIdCheckResult(null);
    };

    const handleCheckNickname = async () => {
        if (!formData.nickname.trim()) {
            alert("활동명을 입력하세요.");
            return;
        }

        try {
            setCheckingNick(true);

            // [수정] 백엔드 API 호출 (GET 방식 예시)
            // 파라미터로 nickname을 보냄
            const response = await axios.get(`/api/auth/check-nickname`, {
                params: { nickname: formData.nickname }
            });

            // 서버에서 사용 가능하면 true, 불가능하면 false를 반환한다고 가정
            // response.data가 true이면 사용 가능
            setNickCheckResult(response.data);

        } catch (error) {
            console.error("중복 확인 에러:", error);
            // 에러 발생 시(서버 오류 등) 일단 false 처리하거나 에러 메시지 표시
            setNickCheckResult(false);
            alert("중복 확인 중 오류가 발생했습니다.");
        } finally {
            setCheckingNick(false);
        }
    };

    const handleCheckID = async () => {
        if (!formData.userid.trim()) {
            alert("아이디를 입력하세요.");
            return;
        }

        try {
            setCheckingID(true);

            // [수정] 백엔드 API 호출
            const response = await axios.get(`/api/auth/check-userid`, {
                params: { userid: formData.userid }
            });

            // response.data가 true이면 사용 가능
            setIdCheckResult(response.data);

        } catch (error) {
            console.error("중복 확인 에러:", error);
            setIdCheckResult(false);
            alert("중복 확인 중 오류가 발생했습니다.");
        } finally {
            setCheckingID(false);
        }
    };

    const handleSubmit = async () => {
        if (nickCheckResult !== true) {
            alert("활동명 중복 확인이 필요합니다.");
            return;
        }

        if (idCheckResult !== true) {
            alert("아이디 중복 확인이 필요합니다.");
            return;
        }

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
                navigate('/home');
            }
        } catch (error) {
            console.error("회원가입 에러:", error);
            alert(error.response?.data || "회원가입에 실패했습니다.");
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-100 flex justify-center">
            {/* 450px 앱 화면 */}
            <div className="w-[450px] min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center p-4">

                <motion.div className="bg-white rounded-2xl shadow-xl p-4 w-[310px]">
                    <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">회원가입</h2>

                    <form className="space-y-4">

                        {/* 활동명 */}
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">활동명</label>
                            <div className="flex gap-2 relative">
                                <input
                                    type="text"
                                    name="nickname"
                                    value={formData.nickname}
                                    onChange={handleChange}
                                    placeholder="활동명"
                                    className="w-[210px] p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-8"
                                />

                                {nickCheckResult === true && (
                                    <CheckCircle className="absolute left-[115px] top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
                                )}
                                {nickCheckResult === false && (
                                    <XCircle className="absolute left-[115px] top-1/2 -translate-y-1/2 text-red-500 w-5 h-5" />
                                )}

                                <button
                                    type="button"
                                    className="bg-blue-500 text-white px-3 rounded-lg hover:bg-blue-600 transition font-semibold flex items-center"
                                    onClick={handleCheckNickname}
                                >
                                    {checkingNick ? <Loader2 className="w-5 h-5 animate-spin" /> : "중복"}
                                </button>
                            </div>

                            {nickCheckResult === true && (
                                <p className="text-sm text-green-600 mt-1">사용 가능한 활동명입니다.</p>
                            )}
                            {nickCheckResult === false && (
                                <p className="text-sm text-red-600 mt-1">이미 사용 중입니다.</p>
                            )}
                        </div>

                        {/* 아이디 */}
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">아이디</label>
                            <div className="flex gap-2 relative">

                                <input
                                    type="text"
                                    name="userid"
                                    value={formData.userid}
                                    onChange={handleChange}
                                    placeholder="아이디"
                                    className="w-[210px] p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-8"
                                />

                                {idCheckResult === true && (
                                    <CheckCircle className="absolute left-[115px] top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
                                )}
                                {idCheckResult === false && (
                                    <XCircle className="absolute left-[115px] top-1/2 -translate-y-1/2 text-red-500 w-5 h-5" />
                                )}

                                <button
                                    type="button"
                                    className="bg-blue-500 text-white px-3 rounded-lg hover:bg-blue-600 transition font-semibold flex items-center"
                                    onClick={handleCheckID}
                                >
                                    {checkingID ? <Loader2 className="w-5 h-5 animate-spin" /> : "중복"}
                                </button>
                            </div>

                            {idCheckResult === true && (
                                <p className="text-sm text-green-600 mt-1">사용 가능한 아이디입니다.</p>
                            )}
                            {idCheckResult === false && (
                                <p className="text-sm text-red-600 mt-1">이미 사용 중입니다.</p>
                            )}
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
                                <div className="flex items-center p-2 rounded-xl bg-gray-50 border border-gray-200">
                                    <span className="text-gray-500">+82</span>
                                </div>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="전화번호 입력"
                                    className="w-[160px] flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
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
                        <div>
                            <label className="block text-sm font-bold text-gray-800 mb-2">성별</label>
                            <div className="flex gap-3">
                                {[
                                    { label: "남성", value: "MALE" },
                                    { label: "여성", value: "FEMALE" }
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        // 클릭 시: 화면에 보이는 label(남성)이 아니라 value(MALE)를 저장함
                                        onClick={() => setFormData({ ...formData, gender: option.value })}
                                        className={`flex-1 py-3.5 rounded-full border text-sm font-medium transition-colors ${
                                            // 현재 저장된 값(MALE/FEMALE)과 버튼의 value를 비교해서 색상 변경
                                            formData.gender === option.value
                                                ? "bg-blue-500 border-blue-500 text-white"
                                                : "bg-white border-gray-300 text-gray-500 hover:bg-blue-50"
                                        }`}
                                    >
                                        {option.label} {/* 화면에는 한글(label)을 보여줌 */}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="w-full bg-sky-500 text-white py-3 rounded-lg hover:bg-sky-600 transition font-semibold"
                        >
                            확인
                        </button>
                    </form>
                </motion.div>

            </div>
        </div>
    );
}
