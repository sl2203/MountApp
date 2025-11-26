import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios"; // axios 추가

export default function MyPage() {
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [user, setUser] = useState(null); // 사용자 정보 저장

    // 1. 페이지 들어오면 로그인 체크 & 정보 가져오기
    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            alert("로그인이 필요한 페이지입니다.");
            navigate("/login");
        }

        // axios.get('/api/users/me').then(res => setUser(res.data));
    }, []);

    // 2. 실제 로그아웃 로직
    const handleLogout = () => {

        localStorage.removeItem("jwtToken");


        delete axios.defaults.headers.common['Authorization'];

        alert("로그아웃 되었습니다.");
        setShowLogoutModal(false);
        navigate("/");
    };

    // 3. 실제 계정 탈퇴 로직
    const handleDeleteAccount = async () => {
        try {
            // 1. 로컬 스토리지에서 토큰 직접 꺼내기
            const token = localStorage.getItem("jwtToken");

            // 2. 토큰이 없으면 로그인 화면으로 쫓아내기
            if (!token) {
                alert("로그인 정보가 없습니다.");
                navigate("/login");
                return;
            }

            // 3. [핵심] 헤더에 Authorization: Bearer 토큰을 직접 넣어서 요청
            await axios.delete("/api/auth/withdraw", {
                headers: {
                    Authorization: `Bearer ${token}` // 'Bearer ' 다음에 공백 필수!
                }
            });

            // 4. 성공 시 처리
            localStorage.removeItem("jwtToken");
            delete axios.defaults.headers.common['Authorization'];

            alert("계정 탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.");
            setShowDeleteModal(false);
            navigate("/");

        } catch (error) {
            console.error("탈퇴 에러:", error);
            // 에러 메시지 보여주기
            alert(error.response?.data || "계정 탈퇴에 실패했습니다.");
        }
    };

    return (
        <motion.section className="flex flex-col p-4">
            <motion.header className="flex flex-col items-center ">
                <h2 className="text-2xl font-bold">마이페이지</h2>
            </motion.header>

            <motion.div className="flex flex-col items-center justify-center gap-5 py-[150px]">
                {/* 계정정보 확인 버튼 (아직 페이지 없으면 임시 alert) */}
                <button
                    onClick={() => alert("준비 중인 기능입니다.")}
                    className="w-64 border-2 p-3 rounded-md hover:bg-gray-50 transition"
                >
                    계정정보 확인/수정
                </button>

                <button
                    onClick={() => setShowLogoutModal(true)}
                    className="w-64 border-2 p-3 rounded-md hover:bg-gray-50 transition"
                >
                    로그아웃
                </button>

                <button
                    onClick={() => setShowDeleteModal(true)}
                    className="w-64 border-2 border-red-200 text-red-500 p-3 rounded-md hover:bg-red-50 transition"
                >
                    계정 탈퇴
                </button>
            </motion.div>

            {/* 로그아웃 모달 */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 shadow-lg w-80 text-center">
                        <h3 className="text-lg font-semibold mb-4">로그아웃 하시겠습니까?</h3>
                        <div className="flex justify-center gap-4">
                            <button onClick={handleLogout} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">확인</button>
                            <button onClick={() => setShowLogoutModal(false)} className="px-4 py-2 border rounded-md hover:bg-gray-100">취소</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 계정 탈퇴 모달 */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 shadow-lg w-80 text-center">
                        <h3 className="text-lg font-semibold mb-2 text-red-600">정말 계정을 탈퇴하시겠습니까?</h3>
                        <p className="text-sm mb-4 text-gray-600">계정을 삭제하면 모든 정보가 복구되지 않습니다.</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={handleDeleteAccount} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">탈퇴하기</button>
                            <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 border rounded-md hover:bg-gray-100">취소</button>
                        </div>
                    </div>
                </div>
            )}
        </motion.section>
    );
}