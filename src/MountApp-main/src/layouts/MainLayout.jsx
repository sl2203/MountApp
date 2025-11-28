import { Outlet, Link, useLocation } from "react-router-dom";
import { House, Map, CircleUserRound, MessageSquareText } from "lucide-react";

function MainLayout() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;  

  return (
    <div className="min-h-screen pb-16">
      <Outlet />

      <footer className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex justify-around items-center">
        <Link to="/" className={`flex flex-col items-center gap-1 ${isActive("/") ? "text-blue-500" : "text-gray-500"}`}>
          <House size={20} />
          <span className="text-xs font-extrabold">홈</span>
        </Link>

        <Link to="/map" className={`flex flex-col items-center gap-1 ${isActive("/map") ? "text-blue-500" : "text-gray-500"}`}>
          <Map size={24} />
          <span className="text-xs font-extrabold">지도</span>
        </Link>

        <Link to="/community" className={`flex flex-col items-center gap-1 ${isActive("/community") ? "text-blue-500" : "text-gray-500"}`}>
          <MessageSquareText size={24} />
          <span className="text-xs font-extrabold">커뮤니티</span>
        </Link>

        <Link to="/mypage" className={`flex flex-col items-center gap-1 ${isActive("/mypage") ? "text-blue-500" : "text-gray-500"}`}>
          <CircleUserRound size={24} />
          <span className="text-xs font-extrabold">마이페이지</span>
        </Link>
      </footer>
    </div>
  );
}

export default MainLayout;
