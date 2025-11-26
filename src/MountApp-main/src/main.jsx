import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import axios from "axios";

const token = localStorage.getItem('jwtToken');
if (token) {
    // 토큰이 있다면, 앞으로 모든 axios 요청 헤더에 'Bearer 토큰'을 붙여서 보낸다.
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
