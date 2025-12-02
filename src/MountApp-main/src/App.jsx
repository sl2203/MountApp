import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Mountain from "./pages/Mountain";
import Map from "./pages/Map";
import Community from "./pages/Community";
import MyPage from "./pages/MyPage";
import DetailPage from "./pages/DetailPage";
import LoginPage from "./pages/LoginPage";
import FindAccountPage from "./pages/FindAccountPage";
import JoinPage from "./pages/JoinPage";
import NewPost from "./pages/NewPost";
import Profile from "./pages/Profile";


function App() {
  return (
    <Routes>
      <Route path="/join" element={<JoinPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/find" element={<FindAccountPage />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/mountain/:name" element={<Mountain />} />
        <Route path="/map" element={<Map />} />
        <Route path="/community" element={<Community />} />
        <Route path="/community/new-post" element={<NewPost type="post" />} />
        <Route path="/community/new-review" element={<NewPost type="review" />} />
        <Route path="/community/post/:id" element={<DetailPage dataType="post" />} />
        <Route path="/community/review/:id" element={<DetailPage dataType="review" />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/detail" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;
