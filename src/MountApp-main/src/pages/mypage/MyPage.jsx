import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronRight } from "lucide-react";

// --- 하위 컴포넌트 (디자인 유지) ---
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
export default function MyPage() {
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [imgError, setImgError] = useState(false);
    const BACKEND_URL = "http://localhost:8082";
    const getProfileImageUrl = (path) => {
        if (!path) return null;
        // 이미 http로 시작하는 완전한 URL이면 그대로 사용 (소셜 로그인 등)
        if (path.startsWith("http")) return path;
        // 아니면 백엔드 주소를 앞에 붙임
        return `${BACKEND_URL}${path}`;
    };
    // 사용자 정보 상태 관리
    const [user, setUser] = useState({
        name: "",
        email: "",
        userid: "",
        profileImage: null, // [추가] 프로필 이미지 경로 저장용
        stats: { point: 0, like: 0 },
    });

    // 1. 페이지 로드 시 사용자 정보 가져오기
    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem("jwtToken");

            if (!token) {
                alert("로그인이 필요합니다.");
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get("/api/auth/me", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const userData = response.data;

                const countRes = await axios.get(`${BACKEND_URL}/api/posts/my/count`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const postCount = countRes.data;

                const likeCountRes = await axios.get(`${BACKEND_URL}/api/likes/my/count`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const likeCount = likeCountRes.data;
                setUser({
                    name: userData.nickname || userData.name,
                    email: userData.email,
                    userid: userData.userid,
                    // [추가] DB에서 가져온 프로필 이미지 경로 매핑
                    profileImage: userData.profileImage,
                    stats: { point: postCount, like: likeCount }
                });
                setLoading(false);

            } catch (error) {
                console.error("유저 정보 로딩 실패:", error);
                alert("사용자 정보를 불러오는데 실패했습니다. 다시 로그인 해주세요.");
                localStorage.removeItem("jwtToken");
                navigate("/login");
            }
        };

        fetchUserInfo();
    }, [navigate]);

    // 2. 로그아웃 핸들러
    const handleLogout = () => {
        localStorage.removeItem("jwtToken");
        console.log("로그아웃 완료");
        setShowLogoutModal(false);
        navigate("/login");
    };

    // 3. 회원 탈퇴 핸들러
    const handleDeleteAccount = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                alert("로그인 정보가 없습니다.");
                navigate("/login");
                return;
            }

            const response = await axios.delete(`/api/auth/withdraw`, {
                headers: { "Authorization": `Bearer ${token}` },
                data: { userid: user.userid }
            });

            if (response.status === 200) {
                console.log("계정 탈퇴 완료");
                localStorage.clear();
                setShowDeleteModal(false);
                alert("회원 탈퇴가 성공적으로 처리되었습니다.");
                navigate("/login");
            }
        } catch (error) {
            console.error("탈퇴 요청 중 에러:", error);
            const msg = error.response?.data || "서버 오류가 발생했습니다.";
            alert(`탈퇴 실패: ${msg}`);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-white">로딩 중...</div>;
    }

    return (
        <motion.section
            className="flex flex-col min-h-screen bg-white overflow-x-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >

            {/* 상단 헤더 */}
            <header className="flex items-center justify-center px-5 py-4 bg-white relative">
                <h1 className="text-2xl font-bold text-gray-900">마이페이지</h1>
            </header>
            <div className="h-px bg-gray-200 mb-4"></div>

            {/* 메인 컨텐츠 */}
            <div className="flex-1 overflow-y-auto pb-10">

                {/* 프로필 요약 (DB 데이터 바인딩) */}
                <div className="px-5 py-6 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-4">
                        {/* ▼▼▼ [수정됨] 프로필 이미지 UI ▼▼▼ */}
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-200">
                            {/* 1. 이미지가 있고 & 2. 에러가 나지 않았을 때만 이미지를 보여줌 */}
                            {user.profileImage && !imgError ? (
                                <img
                                    src={getProfileImageUrl(user.profileImage)}
                                    alt="프로필"
                                    className="w-full h-full object-cover"
                                    onError={() => setImgError(true)} // 에러 나면 imgError를 true로 변경
                                />
                            ) : (
                                // 이미지가 없거나 에러가 났으면 기본 아이콘 표시
                                <span className="text-4xl">👤</span>
                            )}
                        </div>
                        {/* ▲▲▲ [수정됨 끝] ▲▲▲ */}

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
                        {/* value에 user.stats.point 가 들어가면서 개수가 표시됨 */}
                        <StatItem label="게시글/리뷰" value={user.stats.point} />
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
                <motion.div
                    className="flex flex-col items-center gap-4 px-4 w-full max-w-md mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <ProfileButton label="로그아웃" onClick={() => setShowLogoutModal(true)} />
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="w-full mt-2 py-3 text-sm text-gray-400 underline decoration-gray-300 hover:text-red-500 hover:decoration-red-400 transition-colors"
                    >
                        계정 탈퇴하기
                    </button>
                </motion.div>

            </div>

            {/* 모달들 (생략 없음) */}
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