import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import BackButton from "../../layouts/BackButton";
import { EllipsisVertical, Edit, Trash2, Star, StarHalf, User } from "lucide-react"; // User 추가
import axios from "axios";

// ▼▼▼ [추가] 프로필 이미지 전용 컴포넌트 ▼▼▼
const ProfileAvatar = ({ imagePath, nickname, size = "w-11 h-11" }) => {
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

export default function DetailPage() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const commentRef = useRef(null);
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState("");
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    const [likeCount, setLikeCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                const response = await axios.get(`http://localhost:8082/api/posts/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = response.data;
                setItem(data);
                setLikeCount(data.likeCount || 0);

                if (token) {
                    try {
                        const likeStatusRes = await axios.get(`http://localhost:8082/api/likes/${id}/status`, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        setLiked(likeStatusRes.data);
                    } catch (e) { /* ignore */ }
                }
                const commentsResponse = await axios.get(`http://localhost:8082/api/posts/${id}/comments`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setComments(commentsResponse.data);

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

    const handleCommentSubmit = async () => {
        if (!commentContent.trim()) {
            alert("댓글 내용을 입력해주세요.");
            return;
        }

        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                alert("로그인이 필요합니다.");
                return;
            }

            const currentUserId = localStorage.getItem("userId");
            const newCommentData = {
                userId: currentUserId,
                commentContents: commentContent
            };

            await axios.post(`http://localhost:8082/api/posts/${id}/comments`, newCommentData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setCommentContent("");
            alert("댓글이 등록되었습니다.");

            const commentsResponse = await axios.get(`http://localhost:8082/api/posts/${id}/comments`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setComments(commentsResponse.data);

        } catch (error) {
            console.error("댓글 등록 실패:", error);
            alert("댓글 등록 중 오류가 발생했습니다.");
        }
    };

    const onLikeClick = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token || token === "null" || token === "undefined") {
                alert("로그인이 필요합니다.");
                return;
            }

            const response = await axios.post(`http://localhost:8082/api/likes/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setLiked(response.data.liked);
            setLikeCount(response.data.count);

        } catch (error) {
            console.error("좋아요 오류:", error);
            alert("오류가 발생했습니다.");
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            await axios.delete(`http://localhost:8082/api/posts/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("삭제되었습니다.");
            setShowDeleteModal(false);
            navigate("/community");
        } catch (error) {
            console.error("삭제 실패:", error);
            alert("삭제 권한이 없거나 오류가 발생했습니다.");
        }
    };

    const getImageUrl = (path) => {
        if (!path) return "";
        const filename = path.replace(/^.*[\\\/]/, '');
        return `http://localhost:8082/images/${filename}`;
    };

    if (loading) return <div className="p-5 text-center">데이터를 불러오는 중...</div>;
    if (!item) return <div className="p-5 text-center">데이터를 찾을 수 없습니다.</div>;

    const isReview = (item.rating && item.rating > 0) || location.pathname.includes("/review");

    const renderStars = (score) => {
        if (!score) return null;
        const fullStars = Math.floor(score);
        const hasHalf = score % 1 !== 0;
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
            <motion.header className="flex items-center justify-center py-2 border-b relative">
                <BackButton />
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
                    {/* ▼▼▼ [수정됨] 메인 글 작성자 프로필 ▼▼▼ */}
                    <div className="mr-3">
                        <ProfileAvatar
                            imagePath={item.profileImage}
                            nickname={item.nickname}
                            size="w-11 h-11"
                        />
                    </div>
                    {/* ▲▲▲ [수정됨] ▲▲▲ */}

                    <div>
                        <p className="font-semibold">{item.nickname}</p>
                        <p className="text-xs text-gray-500">{item.postdate || "날짜 미상"}</p>
                    </div>
                </div>
                {isReview && <div>{renderStars(item.rating)}</div>}
            </div>

            {item.imagePath && (
                <img
                    src={getImageUrl(item.imagePath)}
                    alt="post-img"
                    className="w-full h-auto object-cover mt-4 rounded-lg"
                />
            )}
            <p className="px-1 mt-4 text-gray-800 leading-relaxed whitespace-pre-line">
                {item.postContents || item.comment || item.content}
            </p>
            <div className="flex items-center space-x-5 mt-3 px-1 text-2xl">
                <button onClick={onLikeClick}>
                    {liked ? "❤️" : "🤍"}
                </button>
            </div>
            <p className="px-1 mt-1 text-sm font-semibold">좋아요 {likeCount}개</p>

            <div ref={commentRef} className="mt-8 px-1">
                <h3 className="text-lg font-semibold mb-4">댓글 ({comments.length})</h3>
                <div className="flex gap-2 mb-6">
                    <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                        placeholder="댓글을 입력하세요..."
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
                        onClick={handleCommentSubmit}
                    >
                        등록
                    </button>
                </div>
                {comments.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">아직 댓글이 없습니다.</p>
                ) : (
                    comments.map((comment) => (
                        <div
                            key={comment.commentId}
                            className="flex items-start bg-white shadow-md p-5 rounded-xl mb-3 hover:bg-gray-50 transition duration-200 space-x-4"
                        >
                            {/* ▼▼▼ [수정됨] 댓글 작성자 프로필 ▼▼▼ */}
                            <ProfileAvatar
                                imagePath={comment.profileImage}
                                nickname={comment.nickname}
                                size="w-10 h-10"
                            />
                            {/* ▲▲▲ [수정됨] ▲▲▲ */}

                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <p className="font-semibold">{comment.nickname}</p>
                                    <span className="text-xs text-gray-400">{comment.commentDate}</span>
                                </div>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {comment.commentContents}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
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