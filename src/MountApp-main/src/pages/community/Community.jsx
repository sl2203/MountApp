import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Star, StarHalf, PenLine, Camera } from "lucide-react";
import axios from "axios";

export default function Community() {
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);   // 일반 게시글
    const [reviews, setReviews] = useState([]); // 리뷰

    // 선택된 카테고리 State (기본: 전체)
    const [selectedCategory, setSelectedCategory] = useState("전체");

    // 필터 카테고리 목록
    const categories = ["전체", "산", "등산 용품", "맛집", "숙소"];

    const alertShown = useRef(false);

    const getImageUrl = (path) => {
        if (!path) return "";
        const filename = path.replace(/^.*[\\\/]/, '');
        return `http://localhost:8082/images/${filename}`;
    };

    // 1. 백엔드 데이터 불러오기
    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        console.log("현재 내 토큰:", token);

        axios.get("http://localhost:8082/api/posts", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                const allData = response.data;
                console.log("서버 응답 데이터:", allData);

                const normalPosts = allData.filter((item) => item.rating === 0);
                const reviewPosts = allData.filter((item) => item.rating > 0);

                setPosts(normalPosts);
                setReviews(reviewPosts);
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

    // 별점 렌더링 함수
    const renderStars = (rating) => {
        const score = Number(rating) || 0;
        const fullStars = Math.floor(score);
        const hasHalfStar = score - fullStars >= 0.5;

        return (
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((idx) => {
                    if (idx <= fullStars) return <Star key={idx} size={14} className="text-yellow-400 fill-yellow-400" />;
                    else if (idx === fullStars + 1 && hasHalfStar) return <StarHalf key={idx} size={14} className="text-yellow-400 fill-yellow-400" />;
                    else return <Star key={idx} size={14} className="text-gray-300" />;
                })}
            </div>
        );
    };

    // 2️⃣ 선택된 카테고리 기반 리뷰 필터링
    const filteredReviews = selectedCategory === "전체"
        ? reviews
        : reviews.filter((review) => review.category === selectedCategory);

    return (
        <motion.section className="flex flex-col h-screen">
            {/* 헤더 */}
            <motion.header className="flex flex-col items-center px-5 py-4">
                <h2 className="text-2xl font-bold">커뮤니티</h2>
            </motion.header>
            <div className="h-px bg-gray-200 mb-4"></div>

            <motion.section className="flex-1 flex flex-col overflow-hidden space-y-6 p-4 gap-5">

                {/* === 게시글 섹션 === */}
                <motion.section className="overflow-x-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">📢 게시글</h3>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold shadow-sm hover:bg-blue-700 transition-colors"
                            onClick={() => navigate("/community/new-post", { state: { type: "post" } })}
                        >
                            <PenLine size={16} />
                            <span>글쓰기</span>
                        </motion.button>
                    </div>

                    <motion.div className="flex gap-4 pb-3 overflow-x-auto">
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <motion.div
                                    key={post.id}
                                    className="flex-shrink-0 w-64 border rounded-2xl p-4 bg-white shadow-md cursor-pointer"
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => navigate(`/community/DetailPage/${post.id}`)}
                                >
                                    <div className="flex items-center mb-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
                                            <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-500">
                                                {post.nickname ? post.nickname.substring(0, 2) : "??"}
                                            </div>
                                        </div>
                                        <span className="font-medium text-sm">{post.nickname || "익명"}</span>
                                    </div>
                                    <h4 className="font-bold mb-1 truncate">{post.title}</h4>
                                    <p className="text-gray-600 text-sm line-clamp-2">{post.comment}</p>
                                </motion.div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm p-2">등록된 게시글이 없습니다.</p>
                        )}
                    </motion.div>
                </motion.section>

                {/* === 리뷰 섹션 === */}
                <motion.section className="overflow-x-auto">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold">⭐️ 리뷰</h3>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-full text-sm font-semibold shadow-sm hover:bg-green-700 transition-colors"
                            onClick={() => navigate("/community/new-review", { state: { type: "review" } })}
                        >
                            <Camera size={16} />
                            <span>리뷰 작성</span>
                        </motion.button>
                    </div>

                    {/* 3️⃣ 필터 버튼 UI */}
                    <div className="flex gap-2 mb-4 overflow-x-auto hide-scrollbar pb-1 px-1">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
                                    selectedCategory === cat
                                        ? "bg-green-600 text-white border-green-600"
                                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <motion.div className="flex gap-4 pb-4 px-1 overflow-x-auto snap-x">
                        {filteredReviews.length > 0 ? (
                            filteredReviews.map((review, index) => (
                                <motion.div
                                    key={review.id || index}
                                    className="snap-center flex-shrink-0 w-72 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer group"
                                    whileHover={{ y: -4, shadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    onClick={() => navigate(`/community/review/${review.postId || review.postid || review.id}`)}
                                >
                                    {(review.imagePath || review.image_path || review.image) ? (
                                        <div className="h-40 w-full bg-gray-100 relative overflow-hidden">
                                            <img
                                                src={getImageUrl(review.imagePath)}
                                                alt="post-img"
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-40 w-full flex flex-col items-center justify-center text-gray-400 bg-gray-100">
                                            <Camera size={32} />
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                                                {review.nickname ? review.nickname.substring(0, 2) : "??"}
                                            </div>
                                            <span className="font-medium text-gray-700 truncate">{review.nickname || "익명"}</span>
                                        </div>

                                        <div className="relative mb-1">
                                            <h4 className="font-bold text-base text-gray-900 truncate pr-16">{review.title}</h4>
                                            <div className="absolute right-10 top-0 flex-shrink-0">
                                                {renderStars(review.rating)}
                                            </div>
                                        </div>

                                        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                                            {review.postContents || review.postcontents || review.comment}
                                        </p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm p-2">등록된 리뷰가 없습니다.</p>
                        )}
                    </motion.div>
                </motion.section>

            </motion.section>
        </motion.section>
    );
}
