import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChevronRight } from "lucide-react";

// --- 하위 컴포넌트 ---
const StatItem = ({ label, value }) => (
    <div className="flex flex-col items-center justify-center w-1/3 py-4">
        <span className="text-gray-500 text-sm mb-1">{label}</span>
        <span className="text-xl font-bold text-gray-800">{value}</span>
    </div>
);

const ProfileButton = ({ label, onClick }) => (
    <button
        onClick={onClick}
        className="w-full py-4 px-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all flex justify-between items-center"
    >
        <span className="font-medium text-gray-700">{label}</span>
        <ChevronRight className="w-5 h-5 text-gray-400" />
    </button>
);

const Modal = ({ title, description, onCancel, onConfirm, confirmText = "확인", confirmColor = "bg-gray-900" }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-sm text-center"
        >
            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
            {description && <p className="text-sm text-gray-500 mb-6 whitespace-pre-wrap">{description}</p>}
            <div className="flex gap-3">
                <button onClick={onCancel} className="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                    취소
                </button>
                <button onClick={onConfirm} className={`flex-1 py-3 text-white rounded-xl font-medium hover:brightness-105 transition-colors ${confirmColor}`}>
                    {confirmText}
                </button>
            </div>
        </motion.div>
    </div>
);

// --- 메인 페이지 ---
export default function MapPage() {
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // 사용자 정보 (실제 구현 시 API 연동 필요)
    const user = {
        name: "User",
        email: "absssa@naver.com",
        stats: { point: 0, schedule: 0, like: 0 },
        contents: { log: 0, community: 0, item: 0, draft: 0, groupBuy: 0, schedule: 0 }
    };

    // 로그아웃 핸들러
    const handleLogout = () => {
        localStorage.removeItem("jwtToken"); // 토큰 삭제
        console.log("로그아웃 완료");
        setShowLogoutModal(false);
        navigate("/login");
    };

    // 회원 탈퇴 핸들러 (API 연동)
    const handleDeleteAccount = async () => {
        try {
            const token = localStorage.getItem("jwtToken");

            if (!token) {
                alert("로그인 정보가 없습니다.");
                navigate("/login");
                return;
            }

            // API 요청
            const response = await fetch("/api/auth/withdraw", {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                console.log("계정 탈퇴 완료");
                localStorage.clear(); // 모든 로컬 데이터 삭제
                setShowDeleteModal(false);
                alert("회원 탈퇴가 성공적으로 처리되었습니다.");
                navigate("/login");
            } else {
                const errorText = await response.text();
                alert(`탈퇴 실패: ${errorText || "서버 오류가 발생했습니다."}`);
            }
        } catch (error) {
            console.error("탈퇴 요청 중 에러:", error);
            alert("서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.");
        }
    };

    // 화면 렌더링 (return은 여기서 한 번만!)
    return (
        <motion.section className="flex flex-col min-h-screen bg-white overflow-x-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            {/* 상단 헤더 */}
            <header className="flex items-center justify-center px-5 py-4 bg-white relative">
                <h1 className="text-2xl font-bold text-gray-900">마이페이지</h1>
            </header>
            <div className="h-px bg-gray-200 mb-4"></div>

            {/* 메인 컨텐츠 */}
            <div className="flex-1 overflow-y-auto pb-10">

                {/* 프로필 요약 */}
                <div className="px-5 py-6 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden"></div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                            <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate("/mypage/detail")}
                        className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        자세히 보기
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                </div>

                {/* 활동 통계 */}
                <div className="px-5 pb-6">
                    <div className="flex bg-white rounded-2xl shadow-sm border border-gray-100 divide-x divide-gray-100">
                        <StatItem label="게시글/리뷰" value={user.stats.point} />
                        <StatItem label="등산 일정" value={user.stats.schedule} />
                        <StatItem label="좋아요" value={user.stats.like} />
                    </div>
                </div>

                {/* 구분선 */}
                <div className="h-2 bg-gray-100 mb-6"></div>

                {/* 게시글/리뷰 섹션 */}
                <div className="px-5 flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900"> 게시글/리뷰</h3>
                </div>
                <div className="px-5 mb-8 min-h-[50px] flex items-center justify-center text-gray-400 text-sm">
                    (작성된 게시글/리뷰가 없습니다)
                </div>

                <div className="h-2 bg-gray-100 mb-6"></div>

                {/* 버튼 그룹 */}
                <motion.div className="flex flex-col items-center gap-4 px-4 w-full max-w-md mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    <ProfileButton label="로그아웃" onClick={() => setShowLogoutModal(true)} />
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="w-full mt-2 py-3 text-sm text-gray-400 underline decoration-gray-300 hover:text-red-500 hover:decoration-red-400 transition-colors"
                    >
                        계정 탈퇴하기
                    </button>
                </motion.div>

            </div>

            {/* 모달 */}
            {showLogoutModal && (
                <Modal title="로그아웃 하시겠습니까?" onCancel={() => setShowLogoutModal(false)} onConfirm={handleLogout} />
            )}
            {showDeleteModal && (
                <Modal
                    title="정말 떠나시나요?"
                    description="계정을 삭제하면 모든 활동 기록이 영구적으로 삭제됩니다."
                    confirmText="탈퇴"
                    confirmColor="bg-red-500 hover:bg-red-600"
                    onCancel={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteAccount}
                />
            )}
        </motion.section>
    );
}