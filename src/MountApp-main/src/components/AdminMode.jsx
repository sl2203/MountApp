import { useState, useEffect } from "react";
import axios from "axios";
import {
    ShieldCheck, Settings, X, UserCog, MessageSquareText,
    ArrowLeft, Search, Trash2, Star, FileText, User
} from "lucide-react";

export default function AdminMode({ children }) {
    const isAdmin = localStorage.getItem("role") === "admin";
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentView, setCurrentView] = useState("menu"); // menu, users, community
    const [searchTerm, setSearchTerm] = useState("");

    // === 1. 사용자 관리 데이터 (상세 정보 필드 추가) ===
    const [users, setUsers] = useState([
        { id: 1, name: "김등산", email: "mount@test.com", role: "user", birth: "1990-05-12", gender: "남성", phone: "010-1234-5678" },
        { id: 2, name: "이산악", email: "lee@test.com", role: "guide", birth: "1985-08-20", gender: "여성", phone: "010-9876-5432" },
        { id: 3, name: "박대장", email: "park@test.com", role: "user", birth: "1992-01-15", gender: "남성", phone: "010-5555-7777" },
        { id: 4, name: "최정상", email: "top@test.com", role: "user", birth: "1998-11-03", gender: "여성", phone: "010-1111-2222" },
        { id: 5, name: "정하산", email: "down@test.com", role: "user", birth: "2000-03-01", gender: "남성", phone: "010-3333-4444" },
    ]);

    // 선택된 사용자 상세 정보를 저장할 state
    const [selectedUser, setSelectedUser] = useState(null);

    // === 2. 커뮤니티 관리 데이터 ===
    const [communityPosts, setCommunityPosts] = useState([]);
    const [communityTab, setCommunityTab] = useState("all");

    // === 3. 데이터 가져오기 ===
    useEffect(() => {
        if (isModalOpen && currentView === "community") {
            fetchCommunityPosts();
        }
    }, [isModalOpen, currentView]);

    const fetchCommunityPosts = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            const response = await axios.get("http://localhost:8082/api/posts", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCommunityPosts(response.data);
        } catch (error) {
            console.error("게시글 로딩 실패:", error);
        }
    };

    // === 4. 핸들러 함수들 ===

    const handleDeleteUser = (id) => {
        if (window.confirm("정말 이 사용자를 삭제 하시겠습니까?")) {
            setUsers(users.filter(user => user.id !== id));
            if (selectedUser && selectedUser.id === id) {
                setSelectedUser(null); // 상세 보고 있던 유저 삭제 시 상세창 닫기
            }
        }
    };

    const handleDeletePost = async (id) => {
        if (window.confirm("이 게시글을 삭제하시겠습니까?")) {
            try {
                // await axios.delete(`http://localhost:8082/api/posts/${id}`, ...);
                setCommunityPosts(communityPosts.filter(post => post.id !== id));
            } catch (error) {
                console.error("삭제 실패:", error);
            }
        }
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setCurrentView("menu");
            setSearchTerm("");
            setCommunityTab("all");
            setSelectedUser(null);
        }, 300);
    };

    // 뷰 변경 시 선택된 유저 초기화
    useEffect(() => {
        setSelectedUser(null);
        setSearchTerm("");
    }, [currentView]);

    // === 5. 필터링 로직 ===

    // 사용자 검색 (이름, 이메일, ID 포함)
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(user.id).includes(searchTerm) // ID 검색 추가
    );

    const filteredPosts = communityPosts.filter(post => {
        const isReview = post.rating > 0;
        if (communityTab === "post" && isReview) return false;
        if (communityTab === "review" && !isReview) return false;

        if (searchTerm) {
            const title = post.title?.toLowerCase() || "";
            const author = post.nickname?.toLowerCase() || "";
            const search = searchTerm.toLowerCase();
            return title.includes(search) || author.includes(search);
        }
        return true;
    });

    return (
        <div className="w-full flex justify-center bg-gray-100">
            <div className="w-[450px] min-h-screen pb-16 bg-white relative shadow-2xl">

                {/* 관리자 버튼 */}
                {isAdmin && (
                    <div className="absolute flex items-center gap-2 top-4 right-4 bg-red-500/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm shadow-md z-40 hover:scale-105 transition-transform cursor-pointer"
                         onClick={() => setIsModalOpen(true)}>
                        <ShieldCheck size={16} />
                        <span className="font-medium">관리자</span>
                    </div>
                )}

                {/* 관리자 모달 */}
                {isModalOpen && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                        <div className={`bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                                ${currentView === 'menu' ? 'w-[320px] h-[340px]' : 'w-[400px] h-[600px]'}
                            `}>
                            {/* 헤더 */}
                            <div className="bg-red-500 text-white p-4 flex justify-between items-center shrink-0 z-10 shadow-md">
                                <div className="flex items-center gap-2">
                                    {currentView !== "menu" ? (
                                        <button onClick={() => {
                                            if (selectedUser) setSelectedUser(null); // 상세정보 보고 있으면 목록으로
                                            else setCurrentView("menu");
                                        }} className="hover:bg-white/20 p-1 rounded-full transition-colors mr-1">
                                            <ArrowLeft size={20} />
                                        </button>
                                    ) : (
                                        <ShieldCheck size={20} />
                                    )}
                                    <h2 className="font-bold text-lg">
                                        {currentView === "menu" && "관리자 메뉴"}
                                        {currentView === "users" && (selectedUser ? "회원 상세 정보" : "사용자 관리")}
                                        {currentView === "community" && "커뮤니티 관리"}
                                    </h2>
                                </div>
                                <button onClick={handleClose} className="hover:bg-white/20 rounded-full p-1">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* 콘텐츠 영역 */}
                            <div className="flex-1 overflow-y-auto bg-gray-50 scrollbar-hide relative">

                                {/* VIEW 1: 메뉴 */}
                                {currentView === "menu" && (
                                    <div className="p-6 flex flex-col justify-center h-full gap-4 animate-in fade-in zoom-in-95">
                                        <button onClick={() => setCurrentView("users")} className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:border-red-400 hover:shadow-lg transition-all active:scale-95 group text-left">
                                            <div className="bg-red-50 p-3 rounded-full text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors"><UserCog size={24} /></div>
                                            <div><h3 className="font-bold text-gray-800">사용자 관리</h3><p className="text-xs text-gray-400">회원 조회 및 삭제</p></div>
                                        </button>
                                        <button onClick={() => setCurrentView("community")} className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:border-red-400 hover:shadow-lg transition-all active:scale-95 group text-left">
                                            <div className="bg-blue-50 p-3 rounded-full text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors"><MessageSquareText size={24} /></div>
                                            <div><h3 className="font-bold text-gray-800">커뮤니티 관리</h3><p className="text-xs text-gray-400">게시글 및 리뷰 관리</p></div>
                                        </button>
                                    </div>
                                )}

                                {/* VIEW 2: 사용자 관리 */}
                                {currentView === "users" && (
                                    <div className="p-4 h-full">

                                        {/* (2-1) 상세 정보 뷰 (selectedUser가 있을 때 표시) */}
                                        {selectedUser ? (
                                            <div className="animate-in slide-in-from-right duration-300 h-full flex flex-col">
                                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1">

                                                    {/* 프로필 헤더 */}
                                                    <div className="flex flex-col items-center mb-8">
                                                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-3xl text-gray-500 font-bold mb-3 shadow-inner">
                                                            {selectedUser.name[0]}
                                                        </div>
                                                        <h3 className="text-xl font-bold text-gray-800">{selectedUser.name}</h3>
                                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full mt-1">
                                                                ID: {selectedUser.id}
                                                            </span>
                                                    </div>

                                                    {/* 상세 정보 리스트 (요청하신 디자인) */}
                                                    <div className="space-y-6 px-2">
                                                        <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                                            <span className="font-bold text-gray-800">이름</span>
                                                            <span className="text-gray-600">{selectedUser.name}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                                            <span className="font-bold text-gray-800">생년월일</span>
                                                            <span className="text-gray-600">{selectedUser.birth}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                                            <span className="font-bold text-gray-800">성별</span>
                                                            <span className="text-gray-600">{selectedUser.gender}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                                            <span className="font-bold text-gray-800">전화번호</span>
                                                            <span className="text-gray-600">{selectedUser.phone}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                                            <span className="font-bold text-gray-800">이메일</span>
                                                            <span className="text-gray-600">{selectedUser.email}</span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-8">
                                                        <button
                                                            onClick={() => handleDeleteUser(selectedUser.id)}
                                                            className="w-full py-3 bg-red-50 text-red-500 rounded-xl font-bold hover:bg-red-100 transition-colors flex justify-center items-center gap-2"
                                                        >
                                                            <Trash2 size={18} /> 회원 삭제
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            /* (2-2) 사용자 리스트 뷰 */
                                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                {/* 검색창 */}
                                                <div className="relative mb-4 sticky top-0 z-10">
                                                    <Search className="absolute left-3 top-3 text-gray-400 z-20" size={18} />
                                                    <input
                                                        type="text"
                                                        placeholder="이름, 아이디, 이메일 검색..."
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all text-sm shadow-sm bg-white"
                                                    />
                                                    {searchTerm && (
                                                        <button onClick={() => setSearchTerm("")} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 z-20"><X size={16} /></button>
                                                    )}
                                                </div>

                                                {/* 리스트 */}
                                                <div className="flex flex-col gap-3 pb-4">
                                                    {filteredUsers.length > 0 ? (
                                                        filteredUsers.map(user => (
                                                            <div
                                                                key={user.id}
                                                                onClick={() => setSelectedUser(user)} // 클릭 시 상세 정보 보기
                                                                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center hover:shadow-md hover:border-red-200 transition-all cursor-pointer active:scale-[0.98]"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm bg-gray-400">
                                                                        {user.name[0]}
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-bold text-gray-800 text-sm flex items-center gap-1">
                                                                            {user.name}
                                                                            <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded ml-1">#{user.id}</span>
                                                                        </h4>
                                                                        <p className="text-xs text-gray-400">{user.email}</p>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation(); // 부모의 onClick(상세보기) 막기
                                                                        handleDeleteUser(user.id);
                                                                    }}
                                                                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                                                >
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
                                                            <Search size={32} className="opacity-20" />
                                                            <p className="text-sm">검색 결과가 없습니다.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* VIEW 3: 커뮤니티 관리 */}
                                {currentView === "community" && (
                                    <div className="p-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75 h-full flex flex-col">
                                        <div className="relative mb-3 shrink-0">
                                            <Search className="absolute left-3 top-3 text-gray-400 z-20" size={18} />
                                            <input type="text" placeholder="제목 또는 작성자 검색..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all text-sm shadow-sm bg-white" />
                                            {searchTerm && <button onClick={() => setSearchTerm("")} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 z-20"><X size={16} /></button>}
                                        </div>

                                        <div className="flex gap-2 mb-4 shrink-0">
                                            {['all', 'post', 'review'].map(tab => (
                                                <button key={tab} onClick={() => setCommunityTab(tab)} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors border ${communityTab === tab ? (tab === 'review' ? 'bg-yellow-500 text-white border-yellow-500' : (tab === 'post' ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-800 text-white border-gray-800')) : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>
                                                    {tab === 'all' ? '전체' : (tab === 'post' ? '게시글' : '리뷰')}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="flex flex-col gap-3 pb-4">
                                            {filteredPosts.length > 0 ? (
                                                filteredPosts.map(post => {
                                                    const isReview = post.rating > 0;
                                                    return (
                                                        <div key={post.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
                                                            <div className="flex items-center gap-3 overflow-hidden">
                                                                <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-bold shadow-sm ${isReview ? 'bg-yellow-100 text-yellow-500' : 'bg-blue-100 text-blue-500'}`}>
                                                                    {isReview ? <Star size={18} className="fill-current" /> : <FileText size={18} />}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <h4 className="font-bold text-gray-800 text-sm truncate">{post.title}</h4>
                                                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                                                        <span>{post.nickname || "익명"}</span>
                                                                        <span className="w-0.5 h-2 bg-gray-300"></span>
                                                                        <span>{isReview ? `★ ${post.rating}` : "일반글"}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <button onClick={() => handleDeletePost(post.id)} className="p-2 ml-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all shrink-0"><Trash2 size={18} /></button>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2"><MessageSquareText size={32} className="opacity-20" /><p className="text-sm">게시글이 없습니다.</p></div>
                                            )}
                                        </div>
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