import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Header() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);


    useEffect(() => {

        const token = localStorage.getItem("jwtToken");
        setIsLoggedIn(!!token);
    }, []);


    const handleLogout = () => {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("role");
        setIsLoggedIn(false);
        alert("로그아웃 되었습니다.");
        navigate("/");
        window.location.reload();
        window.location.href = "/login";
    };

    return (
        <header className="flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-50">

            <div
                onClick={() => navigate("/")}
                className="text-2xl font-bold text-blue-600 cursor-pointer flex items-center gap-2"
            >
                🏔️ MountApp
            </div>


            <nav className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/community")}
                    className="font-medium text-gray-600 hover:text-blue-500 transition"
                >
                    커뮤니티
                </button>

                {isLoggedIn ? (

                    <div className="flex gap-3 items-center">
                        <button className="font-medium text-gray-600 hover:text-blue-500">
                            마이페이지
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition font-semibold text-sm"
                        >
                            로그아웃
                        </button>
                    </div>
                ) : (

                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate("/login")}
                            className="font-medium text-gray-600 hover:text-blue-500 transition"
                        >
                            로그인
                        </button>
                        <button
                            onClick={() => navigate("/join")}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition font-semibold text-sm"
                        >
                            회원가입
                        </button>
                    </div>
                )}
            </nav>
        </header>
    );
}