  import { Routes, Route } from "react-router-dom";
  import MainLayout from "./layouts/MainLayout.jsx";
  import Home from "./pages/Home.jsx";
  import Mountain from "./pages/Mountain.jsx";
  import Map from "./pages/Map.jsx";
  import Community from "./pages/Community.jsx";
  import MyPage from "./pages/MyPage.jsx";
  import DetailPage from "./pages/DetailPage.jsx";
  import LoginPage from "./pages/LoginPage.jsx";
  import FindAccountPage from "./pages/FindAccountPage.jsx";
  import JoinPage from "./pages/JoinPage.jsx";

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
          <Route path="/community/post/:id" element={<DetailPage dataType="post" />} />
          <Route path="/community/review/:id" element={<DetailPage dataType="review" />} />
          <Route path="/mypage" element={<MyPage />} />
        </Route>
      </Routes>
    );
  }

  export default App;
