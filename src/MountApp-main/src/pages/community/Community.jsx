

import { useState, useEffect,   useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Star, StarHalf } from "lucide-react";
import axios from "axios";

export default function Community() {
    const navigate = useNavigate();

    // 데이터를 저장할 State
    const [posts, setPosts] = useState([]);   // 일반 게시글
    const [reviews, setReviews] = useState([]); // 리뷰
    const alertShown = useRef(false);
    // 1. 백엔드 데이터 불러오기
    useEffect(() => {
        // (1) 로컬 스토리지에서 토큰 가져오기 (로그인 시 저장한 키 이름 확인: 'token' 또는 'accessToken')
        const token = localStorage.getItem("jwtToken");

        axios.get("http://localhost:8082/api/posts", {
            // (2) 헤더에 토큰 실어 보내기
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                const allData = response.data;
                console.log("서버 응답 데이터:", allData); // F12 콘솔에서 데이터 구조 꼭 확인하세요!

                // 2. 데이터 분류 로직
                const normalPosts = allData.filter((item) => item.rating === 0);
                const reviewPosts = allData.filter((item) => item.rating > 0);

                setPosts(normalPosts);
                setReviews(reviewPosts);
            })
            .catch((error) => {
                console.error("데이터 로딩 실패:", error);

                // (3) 인증 실패(403 Forbidden, 401 Unauthorized) 시 로그인 페이지로 이동
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {

                    // [핵심] "이미 알림창 띄운 적 있어?" 체크
                    if (alertShown.current) {
                        return; // 띄운 적 있으면 여기서 바로 멈춤 (두 번째 실행 막음)
                    }

                    // 띄운 적 없다면 실행 + 기록 남기기
                    alertShown.current = true;
                    alert("로그인이 필요한 서비스입니다.");
                    navigate("/login");
                }
            });
    }, [navigate]);



    // 별점 렌더링 함수 (최종 수정)
    const renderStars = (rating) => {
        const score = Number(rating) || 0;

        // 1. 꽉 찬 별의 개수 (예: 4.5 -> 4개)
        const fullStars = Math.floor(score);

        // 2. 반쪽 별이 필요한지 여부 (예: 4.5 - 4 = 0.5 -> true)
        // 0.5 이상이면 반쪽 별을 표시 (4.3점은 4개, 4.5점은 4.5개)
        const hasHalfStar = score - fullStars >= 0.5;

        return (
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((idx) => {
                    // (1) 현재 인덱스가 꽉 찬 별 개수보다 작거나 같으면 -> Full
                    if (idx <= fullStars) {
                        return <Star key={idx} size={14} className="text-yellow-400 fill-yellow-400" />;
                    }

                        // (2) 현재 인덱스가 '꽉 찬 별 다음'이고, 반쪽 별이 필요하다면 -> Half
                    // 예: 4.5점일 때, idx가 5인 경우 여기에 걸림
                    else if (idx === fullStars + 1 && hasHalfStar) {
                        return <StarHalf key={idx} size={14} className="text-yellow-400 fill-yellow-400" />;

                    }

                    // (3) 그 외 -> Empty
                    else {
                        return <Star key={idx} size={14} className="text-gray-300" />;
                    }
                })}
            </div>
        );
    };

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
                        {/* 글쓰기 버튼 */}
                        <button
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                            onClick={() => navigate("/community/new-post", { state: { type: "post" } })}
                        >
                            글쓰기
                        </button>
                    </div>

                    <motion.div className="flex gap-4 pb-3 overflow-x-auto">
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <motion.div
                                    // DB 컬럼명 호환성 처리 (postId가 없으면 id 사용)
                                    key={post.id}
                                    className="flex-shrink-0 w-64 border rounded-2xl p-4 bg-white shadow-md cursor-pointer"
                                    whileHover={{ scale: 1.02 }}
                                    // 상세 페이지 이동 시 ID 전달
                                    onClick={() => navigate(`/community/DetailPage/${post.postId || post.postid || post.id}`)}
                                >
                                    <div className="flex items-center mb-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
                                            <div className="w-full h-full bg-gray-300"></div>
                                        </div>
                                        {/* 작성자: DB USERID 컬럼 대응 */}
                                        <span className="font-medium text-sm">{post.id || post.userid || post.author}</span>
                                    </div>
                                    <h4 className="font-bold mb-1 truncate">{post.title}</h4>
                                    {/* 내용: DB POSTCONTENTS 컬럼 대응 */}
                                    <p className="text-gray-600 text-sm line-clamp-2">
                                        {post.comment}
                                    </p>
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
                        {/* 리뷰 작성 버튼 */}
                        <button
                            className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                            onClick={() => navigate("/community/new-review", { state: { type: "review" } })}
                        >
                            리뷰 작성
                        </button>
                    </div>

                    <motion.div className="flex gap-4 pb-3 overflow-x-auto">
                        {reviews.length > 0 ? (
                            reviews.map((review,index) => (
                                <motion.div
                                    key={review.id || index}
                                    className="flex-shrink-0 w-64 border rounded-2xl p-4 bg-white shadow-md cursor-pointer"
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => navigate(`/community/review/${review.postId || review.postid || review.id}`)}
                                >
                                    {/* 이미지: DB IMAGE_PATH 컬럼 대응 */}
                                    {(review.imagePath || review.image_path || review.image) && (
                                        <div className="w-full h-32 mb-3 rounded-lg overflow-hidden">
                                            <img
                                                src={review.imagePath || review.image_path || review.image}
                                                alt="review-img"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    <div className="flex items-center mb-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
                                        <span className="font-medium text-sm">{review.userId || review.userid || review.author}</span>
                                    </div>

                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-bold truncate w-24">{review.title}</h4>

                                        {/* 수정된 함수 사용: review 객체가 아니라 review.rating(점수)을 전달 */}
                                        {renderStars(review.rating)}
                                    </div>
                                    <p className="text-gray-600 text-sm line-clamp-2">
                                        {review.postContents || review.postcontents || review.comment}
                                    </p>
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