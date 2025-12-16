import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/home/Home";
import MountainDetail from "./pages/home/MountainDetail.jsx";
import Map from "./pages/map/Map";
import Community from "./pages/community/Community";
import MyPage from "./pages/mypage/MyPage";
import DetailPage from "./pages/community/DetailPage";
import LoginPage from "./pages/auth/LoginPage";
import FindAccountPage from "./pages/auth/FindAccountPage";
import JoinPage from "./pages/auth/JoinPage";
import NewPost from "./pages/community/NewPost";
import Profile from "./pages/mypage/Profile";
import ProfileChange from "./pages/mypage/ProfileChange";
import AdminMode from "./components/AdminMode.jsx";

function App() {
    return (
        <AdminMode>
            <Routes>
                <Route path="/join" element={<JoinPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/find" element={<FindAccountPage />} />
                <Route path="/mypage/detail" element={<Profile />} />
                <Route path="/mypage/change" element={<ProfileChange />} />
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/map" element={<Map />} />
                    <Route path="/mountain/:id" element={<MountainDetail />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/community/new-post" element={<NewPost type="post"   />} />
                    <Route path="/community/new-review" element={<NewPost type="review" />} />
                    <Route path="/community/post/:id" element={<DetailPage dataType="post" />} />
                    <Route path="/community/review/:id" element={<DetailPage dataType="review" />} />
                    <Route path="/mypage" element={<MyPage />} />
                    <Route path="/community/DetailPage/:id" element={<DetailPage />} />
                </Route>
            </Routes>
        </AdminMode>
    );
}

export default App;
