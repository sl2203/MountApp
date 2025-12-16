import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
    ShieldCheck, X, UserCog, MessageSquareText,
    ArrowLeft, Search, Trash2, Star, FileText, Calendar, User
} from "lucide-react";

export default function AdminMode({ children }) {
    const location = useLocation();

    // 권한 확인
    const currentRole = localStorage.getItem("role");
    const isAdmin = currentRole === "admin" || currentRole === "ROLE_ADMIN";

    if (location.pathname === "/login" || location.pathname === "/join" || location.pathname === "/find") {
        return <>{children}</>;
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentView, setCurrentView] = useState("menu"); // menu, users, community
    const [searchTerm, setSearchTerm] = useState("");

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const [communityPosts, setCommunityPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null); // [추가] 선택된 게시글 상세 데이터
    const [communityTab, setCommunityTab] = useState("all");

    // ============================================================
    // API 통신 함수들
    // ============================================================

    // 1. 사용자 목록 가져오기
    const fetchUsers = async () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) return;

        try {
            const response = await axios.get("http://localhost:8082/api/admin/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            console.error("사용자 로딩 실패:", error);
        }
    };

    // 2. 사용자 상세 보기
    const handleUserClick = async (id) => {
        const token = localStorage.getItem("jwtToken");
        try {
            const response = await axios.get(`http://localhost:8082/api/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSelectedUser(response.data);
        } catch (error) {
            console.error("상세 로딩 실패:", error);
        }
    };

    // 3. 사용자 삭제
    const handleDeleteUser = async (id) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        const token = localStorage.getItem("jwtToken");
        try {
            await axios.delete(`http://localhost:8082/api/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(prev => prev.filter(user => user.id !== id));
            setSelectedUser(null);
            alert("삭제되었습니다.");
        } catch (error) {
            alert("삭제 실패");
        }
    };

    // 4. 커뮤니티 글 목록 가져오기
    const fetchCommunityPosts = async () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) return;

        try {
            const response = await axios.get("http://localhost:8082/api/posts", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCommunityPosts(response.data);
        } catch (error) {
            console.error("게시글 로딩 실패:", error);
        }
    };

    // [추가] 5. 게시글 상세 내용 가져오기
    const handlePostClick = async (id) => {
        const token = localStorage.getItem("jwtToken");
        try {
            const response = await axios.get(`http://localhost:8082/api/posts/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("상세 데이터:", response.data);
            setSelectedPost(response.data); // 상세 데이터 저장
        } catch (error) {
            console.error("게시글 상세 로딩 실패:", error);
            alert("글 내용을 불러오지 못했습니다.");
        }
    };

    // 6. 게시글 삭제
    const handleDeletePost = async (id) => {
        if (!window.confirm("게시글을 삭제하시겠습니까?")) return;
        const token = localStorage.getItem("jwtToken");
        try {
            await axios.delete(`http://localhost:8082/api/posts/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // 목록에서 제거
            setCommunityPosts(prev => prev.filter(post => post.id !== id));
            // 만약 상세 보는 중이었다면 닫기
            if (selectedPost && selectedPost.id === id) {
                setSelectedPost(null);
            }
            alert("삭제되었습니다.");
        } catch (error) {
            console.error("삭제 실패:", error);
            alert("삭제 권한이 없거나 오류가 발생했습니다.");
        }
    };

    // ============================================================
    // 화면 제어 로직
    // ============================================================

    useEffect(() => {
        if (!isModalOpen) return;
        if (currentView === "users") fetchUsers();
        else if (currentView === "community") fetchCommunityPosts();
    }, [isModalOpen, currentView]);

    const handleClose = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setCurrentView("menu");
            setSearchTerm("");
            setCommunityTab("all");
            setSelectedUser(null);
            setSelectedPost(null); // 닫을 때 상세 보기 초기화
        }, 300);
    };

    // 필터링 로직
    const filteredUsers = users.filter(user =>
        (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
        (user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
        String(user.id).includes(searchTerm)
    );

    const filteredPosts = communityPosts.filter(post => {
        const isReview = post.rating > 0;
        if (communityTab === "post" && isReview) return false;
        if (communityTab === "review" && !isReview) return false;
        if (searchTerm) {
            const title = post.title?.toLowerCase() || "";
            const nickname = post.nickname?.toLowerCase() || "";
            const search = searchTerm.toLowerCase();
            return title.includes(search) || nickname.includes(search);
        }
        return true;
    });

    // 뒤로가기 버튼 핸들러 (상세 화면 -> 목록)
    const handleBack = () => {
        if (selectedUser) setSelectedUser(null);
        else if (selectedPost) setSelectedPost(null);
        else setCurrentView("menu");
    };

    return (
        <div className="w-full flex justify-center bg-gray-100">
            <div className="w-[450px] min-h-screen pb-16 bg-white relative shadow-2xl">
                {isAdmin && (
                    <div className="absolute flex items-center gap-2 top-4 right-4 bg-red-500/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm shadow-md z-40 hover:scale-105 transition-transform cursor-pointer"
                         onClick={() => setIsModalOpen(true)}>
                        <ShieldCheck size={16} />
                        <span className="font-medium">관리자</span>
                    </div>
                )}

                {isModalOpen && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                        <div className={`bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${currentView === 'menu' ? 'w-[320px] h-[340px]' : 'w-[400px] h-[600px]'}`}>

                            {/* 헤더 */}
                            <div className="bg-red-500 text-white p-4 flex justify-between items-center shrink-0 z-10 shadow-md">
                                <div className="flex items-center gap-2">
                                    {currentView !== "menu" ? (
                                        <button onClick={handleBack} className="hover:bg-white/20 p-1 rounded-full transition-colors mr-1">
                                            <ArrowLeft size={20} />
                                        </button>
                                    ) : (<ShieldCheck size={20} />)}
                                    <h2 className="font-bold text-lg">
                                        {currentView === "menu" && "관리자 메뉴"}
                                        {currentView === "users" && "사용자 관리"}
                                        {currentView === "community" && "커뮤니티 관리"}
                                    </h2>
                                </div>
                                <button onClick={handleClose} className="hover:bg-white/20 rounded-full p-1"><X size={20} /></button>
                            </div>

                            {/* 바디 */}
                            <div className="flex-1 overflow-y-auto bg-gray-50 scrollbar-hide p-4">
                                {currentView === "menu" && (
                                    <div className="flex flex-col gap-4 justify-center h-full p-2">
                                        <button onClick={() => setCurrentView("users")} className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:border-red-400 hover:shadow-lg transition-all group text-left">
                                            <div className="bg-red-50 p-3 rounded-full text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors"><UserCog size={24} /></div>
                                            <div><h3 className="font-bold text-gray-800">사용자 관리</h3><p className="text-xs text-gray-400">회원 조회 및 삭제</p></div>
                                        </button>
                                        <button onClick={() => setCurrentView("community")} className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:border-red-400 hover:shadow-lg transition-all group text-left">
                                            <div className="bg-blue-50 p-3 rounded-full text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors"><MessageSquareText size={24} /></div>
                                            <div><h3 className="font-bold text-gray-800">커뮤니티 관리</h3><p className="text-xs text-gray-400">게시글 및 리뷰 관리</p></div>
                                        </button>
                                    </div>
                                )}

                                {/* 사용자 관리 뷰 */}
                                {currentView === "users" && (
                                    <div className="flex flex-col gap-3">
                                        {!selectedUser && (
                                            <>
                                                <div className="relative mb-2"><Search className="absolute left-3 top-3 text-gray-400" size={18} /><input type="text" placeholder="검색..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-red-500 text-sm" /></div>
                                                {filteredUsers.map(user => (
                                                    <div key={user.id} onClick={() => handleUserClick(user.id)} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center cursor-pointer hover:border-red-200">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">{user.name?.[0]}</div>
                                                            <div><h4 className="font-bold text-sm">{user.name}</h4><p className="text-xs text-gray-400">{user.email}</p></div>
                                                        </div>
                                                        <Trash2 size={18} className="text-gray-300 hover:text-red-500" onClick={(e) => { e.stopPropagation(); handleDeleteUser(user.id); }} />
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                        {selectedUser && (
                                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                                <div className="text-center mb-6"><div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl font-bold text-gray-500">{selectedUser.name?.[0]}</div><h3 className="text-xl font-bold">{selectedUser.name}</h3></div>
                                                <div className="space-y-4 text-sm">
                                                    <div className="flex justify-between border-b pb-2"><span className="font-bold">아이디</span><span>{selectedUser.userid}</span></div>
                                                    <div className="flex justify-between border-b pb-2"><span className="font-bold">이메일</span><span>{selectedUser.email}</span></div>
                                                    <div className="flex justify-between border-b pb-2"><span className="font-bold">전화번호</span><span>{selectedUser.phone}</span></div>
                                                </div>
                                                <button onClick={() => handleDeleteUser(selectedUser.id)} className="w-full mt-6 py-3 bg-red-50 text-red-500 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-red-100"><Trash2 size={18} />강제 탈퇴</button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* 커뮤니티 관리 뷰 */}
                                {currentView === "community" && (
                                    <div className="flex flex-col gap-3">
                                        {!selectedPost ? (
                                            /* === 글 목록 화면 === */
                                            <>
                                                <div className="relative mb-2"><Search className="absolute left-3 top-3 text-gray-400" size={18} /><input type="text" placeholder="제목, 작성자 검색..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-red-500 text-sm" /></div>
                                                <div className="flex gap-2 mb-2">
                                                    {['all', 'post', 'review'].map(tab => (<button key={tab} onClick={() => setCommunityTab(tab)} className={`flex-1 py-1.5 text-xs font-bold rounded-lg border ${communityTab === tab ? 'bg-gray-800 text-white' : 'bg-white text-gray-500'}`}>{tab === 'all' ? '전체' : (tab === 'post' ? '게시글' : '리뷰')}</button>))}
                                                </div>

                                                {/* 목록 리스트 */}
                                                {filteredPosts.length > 0 ? filteredPosts.map(post => (
                                                    <div key={post.id}
                                                         onClick={() => handlePostClick(post.id)} // [클릭 이벤트]
                                                         className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center hover:shadow-md cursor-pointer hover:border-red-200">
                                                        <div className="flex items-center gap-3 overflow-hidden">
                                                            <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${post.rating > 0 ? 'bg-yellow-100 text-yellow-500' : 'bg-blue-100 text-blue-500'}`}>{post.rating > 0 ? <Star size={18} /> : <FileText size={18} />}</div>
                                                            <div className="min-w-0">
                                                                <h4 className="font-bold text-sm truncate">{post.title}</h4>
                                                                <div className="flex items-center gap-2 text-xs text-gray-400"><span>{post.nickname || "익명"}</span><span className="w-px h-2 bg-gray-300"></span><span>{post.rating > 0 ? `★ ${post.rating}` : "일반글"}</span></div>
                                                            </div>
                                                        </div>
                                                        <button onClick={(e) => {e.stopPropagation(); handleDeletePost(post.id);}} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full shrink-0"><Trash2 size={18} /></button>
                                                    </div>
                                                )) : <div className="text-center py-10 text-gray-400 text-sm">글이 없습니다.</div>}
                                            </>
                                        ) : (
                                            /* === 글 상세 보기 화면 === */
                                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-right-4 duration-300">

                                                {/* 카테고리 및 날짜 */}
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className={`text-xs px-2 py-1 rounded-md font-bold ${selectedPost.rating > 0 ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>
                                                        {selectedPost.rating > 0 ? `★ ${selectedPost.rating} 리뷰` : "일반 게시글"}
                                                    </span>
                                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                                        <Calendar size={12} /> {selectedPost.date || selectedPost.postdate}
                                                    </span>
                                                </div>

                                                {/* 제목 */}
                                                <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedPost.title}</h3>

                                                {/* 작성자 */}
                                                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                                        <User size={16} className="text-gray-500"/>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-600">{selectedPost.nickname || selectedPost.author}</span>
                                                </div>

                                                {/* 내용 (comment 필드 사용) */}
                                                <div className="text-sm text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap min-h-[100px]">
                                                    {selectedPost.comment || selectedPost.content || "내용이 없습니다."}
                                                </div>

                                                {/* 이미지 (있는 경우만 표시) */}
                                                {selectedPost.imagePath && (
                                                    <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
                                                        <img
                                                            src={`http://localhost:8082/uploads/${selectedPost.imagePath.split(',')[0]}`}
                                                            alt="게시글 이미지"
                                                            className="w-full object-cover"
                                                            onError={(e) => e.target.style.display = 'none'}
                                                        />
                                                    </div>
                                                )}

                                                {/* 하단 버튼 */}
                                                <div className="flex gap-2 pt-2">
                                                    <button onClick={() => setSelectedPost(null)} className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors">목록으로</button>
                                                    <button onClick={() => handleDeletePost(selectedPost.id)} className="flex-1 py-2.5 bg-red-50 text-red-500 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-1"><Trash2 size={16}/> 삭제하기</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {children}
            </div>
        </div>
    );
}