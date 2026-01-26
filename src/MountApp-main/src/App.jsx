import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/home/Home";
import MountainDetail from "./pages/home/MountainDetail.jsx";
import Map from "./pages/map/Map";
import Community from "./pages/community/Community";
import MyPage from "./pages/mypage/MyPage";
import ChatBot from "./pages/chatbot/ChatBot";
import LoginPage from "./pages/auth/LoginPage";
import Find_id from "./pages/auth/Find_id";
import Find_pw from "./pages/auth/Find_pw";
import Profile from "./pages/mypage/Profile";
import ProfileChange from "./pages/mypage/ProfileChange";
import AdminMode from "./components/AdminMode";
import Join_1 from "./pages/auth/./Join_1.jsx";
import Join_2 from "./pages/auth/./Join_2.jsx";

function App() {
    return (
        <AdminMode>
            <Routes>
                {/* 레이아웃이 없는 페이지 */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/Join_1" element={<Join_1 />} />
                <Route path="/Join_2" element={<Join_2 />} />
                <Route path="/Find_id" element={<Find_id />} />
                <Route path="/Find_pw" element={<Find_pw />} />
                <Route path="/mypage/detail" element={<Profile />} />
                <Route path="/mypage/change" element={<ProfileChange />} />

                {/* 레이아웃(하단바+너굴가이드)이 있는 페이지 */}
                <Route element={<MainLayout />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/map" element={<Map />} />
                    <Route path="/mountain/:id" element={<MountainDetail />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/mypage" element={<MyPage />} />
                    {/* 챗봇 페이지 */}
                    <Route path="/chatbot" element={<ChatBot />} />
                </Route>
            </Routes>
        </AdminMode>
    );
}

export default App;