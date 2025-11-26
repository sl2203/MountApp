import { Outlet, Link, useLocation } from "react-router-dom";

import { House, Map, CircleUserRound, MessageSquareText, LogIn } from "lucide-react";
import { useState, useEffect } from "react";

function MainLayout() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    // 1. 로그인 상태 관리
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 2. 경로가 바뀔 때마다(로그인 직후 등) 토큰 확인
    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        setIsLoggedIn(!!token);
    }, [location.pathname]);

    return (
        <div className="min-h-screen pb-16">
            <Outlet />

            <footer className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex justify-around items-center z-50">
                {/* 홈 */}
                <Link to="/" className={`flex flex-col items-center gap-1 ${isActive("/") ? "text-blue-500" : "text-gray-500"}`}>
                    <House size={20} />
                    <span className="text-xs font-extrabold">홈</span>
                </Link>

                {/* 지도 */}
                <Link to="/map" className={`flex flex-col items-center gap-1 ${isActive("/map") ? "text-blue-500" : "text-gray-500"}`}>
                    <Map size={24} />
                    <span className="text-xs font-extrabold">지도</span>
                </Link>

                {/* 커뮤니티 */}
                <Link to="/community" className={`flex flex-col items-center gap-1 ${isActive("/community") ? "text-blue-500" : "text-gray-500"}`}>
                    <MessageSquareText size={24} />
                    <span className="text-xs font-extrabold">커뮤니티</span>
                </Link>

                {/* 3. 로그인 여부에 따라 버튼 변경 */}
                {isLoggedIn ? (
                    // 로그인 상태 -> 마이페이지 버튼
                    <Link to="/mypage" className={`flex flex-col items-center gap-1 ${isActive("/mypage") ? "text-blue-500" : "text-gray-500"}`}>
                        <CircleUserRound size={24} />
                        <span className="text-xs font-extrabold">마이페이지</span>
                    </Link>
                ) : (
                    // 로그아웃 상태 -> 로그인 버튼
                    <Link to="/login" className={`flex flex-col items-center gap-1 ${isActive("/login") ? "text-blue-500" : "text-gray-500"}`}>
                        <LogIn size={24} />
                        <span className="text-xs font-extrabold">로그인</span>
                    </Link>
                )}
            </footer>
        </div>
    );
}

export default MainLayout;