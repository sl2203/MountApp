import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import BackButton from "../../layouts/BackButton";
import { EllipsisVertical, Edit, Trash2, Star, StarHalf } from "lucide-react";
import axios from "axios"; // axios 추가

export default function DetailPage() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const commentRef = useRef(null);

    // 서버에서 받아온 데이터를 저장할 State
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    // 좋아요 로직 (DB 연동이 아직 없다면 로컬 State 유지)
    const [likeCount, setLikeCount] = useState(0);
    const [liked, setLiked] = useState(false);

    // 메뉴 모달 제어
    const [menuOpen, setMenuOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // 1. 서버에서 상세 데이터 가져오기
    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                // API 엔드포인트는 백엔드 설계에 따라 다를 수 있음 (예: /api/posts/1)
                const response = await axios.get(`http://localhost:8082/api/posts/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = response.data;
                setItem(data);

                // 데이터가 로드되면 좋아요 수나 기타 초기값 설정 가능
                // setLikeCount(data.likes || 0);
            } catch (error) {
                console.error("상세 데이터 로딩 실패:", error);
                alert("게시글을 불러오는데 실패했습니다.");
                navigate("/community");
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [id, navigate]);

    // 2. 게시글 삭제 핸들러
    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            await axios.delete(`http://localhost:8082/api/posts/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("삭제되었습니다.");
            setShowDeleteModal(false);
            navigate("/community");
        } catch (error) {
            console.error("삭제 실패:", error);
            alert("삭제 권한이 없거나 오류가 발생했습니다.");
        }
    };
    {/* 이미지 렌더링: DB 컬럼명 imagePath, image 등 호환 */}
    const getImageUrl = (path) => {
        if (!path) return "";
        const filename = path.replace(/^.*[\\\/]/, '');
        return `http://localhost:8082/images/${filename}`;
    };
    // 로딩 중일 때 처리 (UI 깨짐 방지)
    if (loading) return <div className="p-5 text-center">데이터를 불러오는 중...</div>;
    if (!item) return <div className="p-5 text-center">데이터를 찾을 수 없습니다.</div>;

    // 데이터 타입 판별 (리뷰인지 일반 글인지 rating으로 판단하거나 URL로 판단)
    // Community.jsx 로직에 따라 rating이 0보다 크면 리뷰로 간주
    const isReview = (item.rating && item.rating > 0) || location.pathname.includes("/review");

    const onLikeClick = () => {
        // 추후 서버에 좋아요 요청 보내는 로직 추가 필요
        setLiked(!liked);
        setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    };

    // 별점 렌더링 함수
    const renderStars = (score) => {
        if (!score) return null;
        const fullStars = Math.floor(score);
        const hasHalf = score % 1 !== 0; // 혹은 score - fullStars >= 0.5
        const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

        return (
            <div className="flex items-center space-x-1">
                {Array(fullStars).fill().map((_, i) => (
                    <Star key={`full-${i}`} size={14} className="text-yellow-400 fill-yellow-400" />
                ))}
                {hasHalf && (
                    <StarHalf key="half" size={14} className="text-yellow-400 fill-yellow-400" />
                )}
                {Array(emptyStars).fill().map((_, i) => (
                    <Star key={`empty-${i}`} size={14} className="text-gray-300" />
                ))}
                <span className="ml-1 text-sm font-bold text-gray-400">
          {Number(score).toFixed(1)}
        </span>
            </div>
        );
    };

    return (
        <motion.section className="flex flex-col p-3 pb-10 relative">
            {/* Header */}
            <motion.header className="flex items-center justify-center py-2 border-b relative">
                <BackButton />
                {/* DB 컬럼명 매핑: title */}
                <h2 className="text-xl font-bold">{item.title}</h2>

                <EllipsisVertical
                    className="w-5 h-5 absolute right-2 cursor-pointer z-50"
                    onClick={() => setMenuOpen((prev) => !prev)}
                />

                {menuOpen && (
                    <div className="absolute right-2 top-10 bg-white shadow-lg rounded-lg py-2 w-36 z-50">
                        <button
                            className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                            onClick={() =>
                                navigate("/community/new-post", {
                                    // 수정 시 현재 데이터를 전달
                                    state: { isEdit: true, postData: item, type: isReview ? "review" : "post" },
                                })
                            }
                        >
                            <Edit size={16} /> 수정
                        </button>
                        <button
                            className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                            onClick={() => setShowDeleteModal(true)}
                        >
                            <Trash2 size={16} /> 삭제
                        </button>
                    </div>
                )}
            </motion.header>

            <div className="flex items-center justify-between mt-4 px-1">
                <div className="flex items-center">
                    <div className="w-11 h-11 rounded-full bg-gray-300"></div>
                    <div className="ml-3">
                        {/* DB 컬럼명 매핑: userId, userid, author 등 */}
                        <p className="font-semibold">{item.userid || "User"}</p>
                        {/* DB 컬럼명 매핑: created_at, date 등 */}
                        <p className="text-xs text-gray-500">{item.postdate || "날짜 미상"}</p>
                    </div>
                </div>
                {/* 리뷰일 경우에만 별점 표시 */}
                {isReview && <div>{renderStars(item.rating)}</div>}
            </div>
            <img
                src={getImageUrl(item.imagePath)}
                alt="post-img"
                className="w-full h-full object-cover"
            />
            <div className="flex items-center space-x-5 mt-3 px-1 text-2xl">
                <button onClick={onLikeClick}>{liked ? "❤️" : "🤍"}</button>
            </div>
            <p className="px-1 mt-1 text-sm font-semibold">좋아요 {likeCount}개</p>

            {/* 본문 내용: DB 컬럼명 postContents, comment 등 호환 */}
            <p className="px-1 mt-4 text-gray-800 leading-relaxed whitespace-pre-line">
                {item.postContents || item.comment || item.content}
            </p>

            {/* 댓글 섹션 (현재는 더미, 추후 API 연동 필요) */}
            <div ref={commentRef} className="mt-8 px-1">
                <h3 className="text-lg font-semibold mb-4">댓글</h3>
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="flex items-start bg-white shadow-md p-5 rounded-xl mb-3 hover:bg-gray-50 transition duration-200 space-x-4"
                    >
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0"></div>
                        <div className="flex-1">
                            <p className="font-semibold mb-1">User {i}</p>
                            <p className="text-gray-700 leading-relaxed">와 정말 이뻐요</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 삭제 확인 모달 */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-80 shadow-lg">
                        <h3 className="text-lg font-bold mb-4">정말 삭제하시겠습니까?</h3>
                        <div className="flex justify-end space-x-2">
                            <button
                                className="px-4 py-2 rounded-lg bg-gray-200"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                취소
                            </button>
                            <button
                                className="px-4 py-2 rounded-lg bg-red-500 text-white"
                                // 실제 삭제 함수 호출
                                onClick={handleDelete}
                            >
                                삭제하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </motion.section>
    );
}