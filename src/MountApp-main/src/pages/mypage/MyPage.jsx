import { motion, AnimatePresence } from "framer-motion"; // AnimatePresence 추가
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronRight, FileText, Heart, MessageSquare, ThumbsUp } from "lucide-react"; // 아이콘 추가

// --- 하위 컴포넌트 (디자인 유지) ---
const StatItem = ({ label, value }) => (
    <div className="flex flex-col items-center justify-center flex-1 py-4">
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

// --- [추가됨] 게시글/리뷰 카드 컴포넌트 ---
const PostCard = ({ post }) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="block bg-white border border-gray-200 rounded-xl p-4 mb-3 hover:border-gray-400 transition-colors cursor-pointer"
    >
        <div className="flex justify-between items-start mb-2">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${post.type === 'REVIEW' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                {post.type === 'REVIEW' ? '리뷰' : '자유게시판'}
            </span>
            <span className="text-xs text-gray-400">{post.date}</span>
        </div>
        <h4 className="text-base font-bold text-gray-900 mb-1 line-clamp-1">{post.title}</h4>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3 h-10">{post.content}</p>

        <div className="flex items-center gap-3 border-t border-gray-100 pt-3">
            <div className="flex items-center gap-1 text-gray-400 text-xs">
                <ThumbsUp size={14} />
                <span>{post.likes}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400 text-xs">
                <MessageSquare size={14} />
                <span>{post.comments}</span>
            </div>
        </div>
    </motion.div>
);

// --- 메인 페이지 ---
export default function MyPage() {
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [imgError, setImgError] = useState(false);

    // [추가됨] 탭 상태 및 더미 데이터
    const [activeTab, setActiveTab] = useState("ALL"); // ALL, POST, REVIEW
    const [myPosts, setMyPosts] = useState([]);

    const BACKEND_URL = "http://localhost:8082";

    const getProfileImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith("http")) return path;
        return `${BACKEND_URL}${path}`;
    };

    const [user, setUser] = useState({
        name: "",
        email: "",
        userid: "",
        profileImage: null,
        stats: { point: 0, like: 0 },
    });

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
                    headers: { Authorization: `Bearer ${token}` }
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
                    profileImage: userData.profileImage,
                    stats: { point: postCount, like: likeCount }
                });

                // [추가됨] 더미 데이터 설정 (나중에 실제 API 호출로 대체하세요)
                // 예: const postsRes = await axios.get(`${BACKEND_URL}/api/posts/my`, ...);
                setMyPosts([
                    { id: 1, type: 'POST', title: 'React 렌더링 질문있습니다.', content: 'useEffect가 두 번 실행되는데 이유가 뭘까요? strict mode 때문인가요?', date: '2024.05.20', likes: 12, comments: 4 },
                    { id: 2, type: 'REVIEW', title: '이번 프로젝트 후기 남깁니다.', content: '정말 많은 것을 배울 수 있었던 프로젝트였습니다. 팀원분들 고생 많으셨습니다.', date: '2024.05.18', likes: 35, comments: 10 },
                    { id: 3, type: 'POST', title: '프론트엔드 로드맵 공유', content: '제가 공부했던 순서대로 정리해봤습니다. 도움 되시길 바랍니다.', date: '2024.05.15', likes: 50, comments: 22 },
                ]);

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

    const handleLogout = () => {
        localStorage.removeItem("jwtToken");
        setShowLogoutModal(false);
        navigate("/login");
    };

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

    // [추가됨] 필터링 로직
    const filteredPosts = myPosts.filter(post => {
        if (activeTab === 'ALL') return true;
        return post.type === activeTab;
    });

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

                {/* 프로필 요약 */}
                <div className="px-5 py-6 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-200">
                            {user.profileImage && !imgError ? (
                                <img
                                    src={getProfileImageUrl(user.profileImage)}
                                    alt="프로필"
                                    className="w-full h-full object-cover"
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <span className="text-4xl">👤</span>
                            )}
                        </div>

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
                <div className="flex gap-4 justify-center pb-4">
                    <motion.div whileTap={{ scale: 0.97 }} className="w-52 bg-white border border-gray-200 rounded-2xl p-5 shadow hover:shadow-md transition-shadow flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-gray-400 text-xs font-medium mb-1 uppercase tracking-wide">게시글/리뷰</span>
                            <span className="text-2xl font-extrabold text-gray-900">{user.stats.point}</span>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-600">
                            <FileText size={22} strokeWidth={1.5} />
                        </div>
                    </motion.div>

                    <motion.div whileTap={{ scale: 0.97 }} className="w-52 bg-white border border-gray-200 rounded-2xl p-5 shadow hover:shadow-md transition-shadow flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-gray-400 text-xs font-medium mb-1 uppercase tracking-wide">좋아요</span>
                            <span className="text-2xl font-extrabold text-gray-900">{user.stats.like}</span>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-600">
                            <Heart size={22} strokeWidth={1.5} />
                        </div>
                    </motion.div>
                </div>
                <div className="h-2 bg-gray-100 mb-8"></div>

                {/* [수정됨] 게시글/리뷰 섹션 */}
                <div className="px-5 mb-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">내 활동 내역</h3>
                    </div>

                    {/* 탭 버튼 */}
                    <div className="flex gap-2 mb-4">
                        {['ALL', 'POST', 'REVIEW'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                                    activeTab === tab
                                        ? "bg-gray-900 text-white shadow-md"
                                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                }`}
                            >
                                {tab === 'ALL' ? '전체' : tab === 'POST' ? '게시글' : '리뷰'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 게시글 리스트 영역 */}
                <div className="px-5 mb-8 min-h-[100px]">
                    <AnimatePresence mode="popLayout">
                        {filteredPosts.length > 0 ? (
                            filteredPosts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-10 text-gray-400"
                            >
                                <FileText size={40} strokeWidth={1} className="mb-2 opacity-50"/>
                                <span className="text-sm">작성된 내역이 없습니다.</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
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

            {/* 모달들 (기존과 동일) */}
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