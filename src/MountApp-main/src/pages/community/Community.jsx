import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Star, StarHalf, PenLine, Camera, CameraOff, Megaphone, ThumbsUp, User } from "lucide-react"; // User 추가
import axios from "axios";

// ▼▼▼ [추가] 프로필 이미지 전용 컴포넌트 ▼▼▼
const ProfileAvatar = ({ imagePath, nickname, size = "w-6 h-6" }) => {
    const [imgError, setImgError] = useState(false);
    const BACKEND_URL = "http://localhost:8082";

    const getProfileImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith("http")) return path;
        return `${BACKEND_URL}${path}`;
    };

    return (
        <div className={`${size} rounded-full bg-gray-200 overflow-hidden border border-gray-200 flex-shrink-0 flex items-center justify-center`}>
            {imagePath && !imgError ? (
                <img
                    src={getProfileImageUrl(imagePath)}
                    alt={nickname}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                />
            ) : (
                <User className="text-gray-400 w-3/5 h-3/5" />
            )}
        </div>
    );
};
// ▲▲▲ [추가 끝] ▲▲▲

export default function Community() {
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("전체");
    const categories = ["전체", "산", "등산용품", "맛집", "숙소"];
    const alertShown = useRef(false);
    const reviewsContainerRef = useRef(null);

    // 게시글/리뷰 썸네일용 이미지 처리
    const getImageUrl = (path) => {
        if (!path) return "";
        const filename = path.replace(/^.*[\\\/]/, '');
        return `http://localhost:8082/images/${filename}`;
    };

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");

        axios.get("http://localhost:8082/api/posts", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                const allData = response.data;
                setPosts(allData.filter(item => item.rating === 0).reverse());
                setReviews(allData.filter(item => item.rating > 0).reverse());
            })
            .catch((error) => {
                console.error("데이터 로딩 실패:", error);
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    if (alertShown.current) return;
                    alertShown.current = true;
                    alert("로그인이 필요한 서비스입니다.");
                    navigate("/login");
                }
            });
    }, [navigate]);

    const renderStars = (rating) => {
        const score = Number(rating) || 0;
        const fullStars = Math.floor(score);
        const hasHalfStar = score - fullStars >= 0.5;

        return (
            <div className="flex items-center space-x-0.5">
                {[1,2,3,4,5].map(idx => {
                    if (idx <= fullStars) return <Star key={idx} size={12} className="text-yellow-400 fill-yellow-400" />;
                    else if (idx === fullStars + 1 && hasHalfStar) return <StarHalf key={idx} size={12} className="text-yellow-400 fill-yellow-400" />;
                    else return <Star key={idx} size={12} className="text-gray-300" />;
                })}
            </div>
        );
    };

    const filteredReviews = selectedCategory === "전체"
        ? reviews
        : reviews.filter(review => review.category === selectedCategory);

    useEffect(() => {
        if (reviewsContainerRef.current) {
            reviewsContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
        }
    }, [selectedCategory]);

    return (
        <motion.section className="flex flex-col h-screen bg-gray-50">
            <motion.header className="flex flex-col items-center px-5 py-4 bg-white shadow-sm z-10">
                <h2 className="text-2xl font-bold">커뮤니티</h2>
            </motion.header>

            <motion.section className="flex-1 flex flex-col overflow-y-auto space-y-6 p-4 pb-20">

                {/* 게시글 섹션 */}
                <motion.section className="overflow-x-auto">
                    <div className="flex justify-between items-center mb-4 px-1">
                        <h3 className="flex items-center gap-3 mb-4">
                            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md text-white">
                                <Megaphone className="w-5 h-5" />
                            </span>
                            <span className="text-2xl font-bold text-gray-900">게시글</span>
                        </h3>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold shadow-sm hover:bg-blue-700 transition-colors"
                            onClick={() => navigate("/community/new-post", { state: { type: "post" } })}
                        >
                            <PenLine size={18} />
                            <span>글쓰기</span>
                        </motion.button>
                    </div>

                    <motion.div className="flex gap-3 pb-2 px-1 overflow-x-auto snap-x">
                        {posts.length > 0 ? (
                            posts.map(post => {
                                const imagePath = post.imagePath || post.image_path || post.image;
                                const content = post.comment || post.postContents;

                                return (
                                    <motion.div
                                        key={post.id}
                                        className="snap-center flex-shrink-0 w-60 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer group"
                                        whileHover={{ y: -4, shadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                                        onClick={() => navigate(`/community/DetailPage/${post.id}`)}
                                    >
                                        <div className="h-28 w-full bg-gray-100 relative overflow-hidden">
                                            {imagePath ? (
                                                <img
                                                    src={getImageUrl(imagePath)}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center bg-blue-50 text-blue-200">
                                                    <CameraOff size={32} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-3 flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                                {/* ▼▼▼ [수정됨] 게시글 작성자 프로필 ▼▼▼ */}
                                                <ProfileAvatar
                                                    imagePath={post.profileImage} // DTO에 profileImage 필드가 있어야 함
                                                    nickname={post.nickname}
                                                    size="w-6 h-6"
                                                />
                                                {/* ▲▲▲ [수정됨] ▲▲▲ */}

                                                <span className="font-medium text-xs text-gray-600 truncate">{post.nickname || "익명"}</span>
                                            </div>
                                            <h4 className="font-bold text-sm text-gray-900 truncate">{post.title}</h4>
                                            <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed h-8">{content}</p>
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="w-full py-8 text-center text-gray-400 bg-white rounded-xl border border-dashed">
                                <p className="text-xs">등록된 게시글이 없습니다.</p>
                            </div>
                        )}
                    </motion.div>
                </motion.section>

                {/* 리뷰 섹션 */}
                <motion.section className="overflow-x-auto mt-2">
                    <div className="flex justify-between items-center mb-2 px-1">
                        <h3 className="flex items-center gap-3 mb-4">
                            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-md text-white">
                                <ThumbsUp className="w-5 h-5" />
                            </span>
                            <span className="text-2xl font-bold text-gray-900">리뷰</span>
                        </h3>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-full text-sm font-semibold shadow-sm hover:bg-green-700 transition-colors"
                            onClick={() => navigate("/community/new-review", { state: { type: "review" } })}
                        >
                            <Camera size={18} />
                            <span>리뷰 작성</span>
                        </motion.button>
                    </div>

                    <div className="flex gap-2 mb-2 mt-4 overflow-x-auto hide-scrollbar pb-1 px-1">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
                                    selectedCategory === cat
                                        ? "bg-green-500 text-white border-green-500"
                                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <motion.div className="flex gap-3 pb-4 px-1 overflow-x-auto snap-x" ref={reviewsContainerRef}>
                        {filteredReviews.length > 0 ? (
                            filteredReviews.map((review, index) => {
                                const imagePath = review.imagePath || review.image_path || review.image;
                                const content = review.postContents || review.postcontents || review.comment;
                                const reviewId = review.postId || review.postid || review.id;

                                return (
                                    <motion.div
                                        key={reviewId || index}
                                        layout
                                        className="snap-center flex-shrink-0 w-60 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer group"
                                        whileHover={{ y: -4, shadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                                        onClick={() => navigate(`/community/review/${reviewId}`)}
                                    >
                                        <div className="h-28 w-full bg-gray-100 relative overflow-hidden">
                                            {imagePath ? (
                                                <img
                                                    src={getImageUrl(imagePath)}
                                                    alt={review.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-400 bg-gray-100">
                                                    <CameraOff size={32} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-3 flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                                {/* ▼▼▼ [수정됨] 리뷰 작성자 프로필 ▼▼▼ */}
                                                <ProfileAvatar
                                                    imagePath={review.profileImage}
                                                    nickname={review.nickname}
                                                    size="w-6 h-6"
                                                />
                                                {/* ▲▲▲ [수정됨] ▲▲▲ */}

                                                <span className="font-medium text-xs text-gray-600 truncate">{review.nickname || "익명"}</span>
                                            </div>

                                            <div className="flex justify-between items-center gap-2">
                                                <h4 className="font-bold text-sm text-gray-900 truncate flex-1">{review.title}</h4>
                                                <div className="flex-shrink-0">{renderStars(review.rating)}</div>
                                            </div>

                                            <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed h-8">{content}</p>
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="w-full py-8 text-center text-gray-400 bg-white rounded-xl border border-dashed">
                                <p className="text-xs">'{selectedCategory}' 카테고리의 리뷰가 없습니다.</p>
                            </div>
                        )}
                    </motion.div>
                </motion.section>

            </motion.section>
        </motion.section>
    );
}