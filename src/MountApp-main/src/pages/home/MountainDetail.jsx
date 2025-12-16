import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus, MapPin, ArrowLeft, ChevronLeft, ChevronRight,
    Mountain as MountainIcon, Clock, Flag,
    Info, Star, Navigation, CheckCircle2, XCircle,
    // [추가] 코스 및 유의사항용 아이콘
    Footprints, TrendingUp, AlertTriangle, ShieldCheck, Timer
} from "lucide-react";

import MountainWeather from "./MountainWeather";

export default function MountainDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [mountain, setMountain] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("home");

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        axios.get(`/api/mountains/${id}`)
            .then((res) => {
                setMountain(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("로딩 실패:", err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-100">로딩 중...</div>;
    if (!mountain) return <div className="min-h-screen flex items-center justify-center bg-gray-100">산 정보를 찾을 수 없습니다.</div>;

    const images = mountain.imageUrl
        ? mountain.imageUrl.split(",")
        : ["https://via.placeholder.com/400x300"];

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    // 난이도에 따른 색상 반환 헬퍼 함수
    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case "쉬움": return "bg-green-100 text-green-700 border-green-200";
            case "어려움": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-yellow-100 text-yellow-700 border-yellow-200"; // 보통
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center">
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4 min-h-screen w-full max-w-[450px] bg-white shadow-xl pb-10"
            >
                {/* 헤더 */}
                <motion.header className="relative flex items-center justify-center m-4 pt-2">
                    <button onClick={() => navigate(-1)} className="absolute left-0 p-2 rounded-full hover:bg-gray-100 transition">
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <h2 className="text-2xl font-bold">{mountain.name}</h2>
                </motion.header>

                {/* 이미지 슬라이더 */}
                <div className="relative w-full h-64 bg-gray-100 overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentImageIndex}
                            src={images[currentImageIndex]}
                            alt={`slide-${currentImageIndex}`}
                            className="w-full h-full object-cover absolute top-0 left-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onError={(e) => e.target.src = "https://via.placeholder.com/400x300?text=No+Image"}
                        />
                    </AnimatePresence>

                    {images.length > 1 && (
                        <>
                            <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full hover:bg-black/50 transition">
                                <ChevronLeft size={24} />
                            </button>
                            <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full hover:bg-black/50 transition">
                                <ChevronRight size={24} />
                            </button>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                {images.map((_, idx) => (
                                    <div key={idx} className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'}`} />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* 설명 */}
                <div className="px-4 pb-4 border-b-4 border-gray-100">
                    <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                        {mountain.description}
                    </p>
                </div>

                {/* 탭 메뉴 */}
                <div className="sticky top-0 z-10 bg-white flex justify-around border-b pb-2 pt-2 text-sm font-bold text-gray-600">
                    <button onClick={() => setTab("home")} className={`pb-1 ${tab === "home" ? "text-blue-600 border-b-2 border-blue-600" : ""}`}>홈</button>
                    <button onClick={() => setTab("course")} className={`pb-1 ${tab === "course" ? "text-blue-600 border-b-2 border-blue-600" : ""}`}>추천코스</button>
                    <button onClick={() => setTab("weather")} className={`pb-1 ${tab === "weather" ? "text-blue-600 border-b-2 border-blue-600" : ""}`}>날씨</button>
                    <button onClick={() => setTab("notice")} className={`pb-1 ${tab === "notice" ? "text-blue-600 border-b-2 border-blue-600" : ""}`}>유의사항</button>
                </div>

                {/* 탭 내용 */}
                <motion.div key={tab} className="mt-0">

                    {/* [홈 탭] */}
                    {tab === "home" && (
                        <motion.div
                            className="px-4 py-1 space-y-4"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {/* 주요 정보 4분할 그리드 */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Info className="w-4 h-4 text-blue-500" />
                                    산행 정보
                                </h3>
                                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                    <div className="flex flex-col items-center">
                                        <span className="text-gray-400 text-xs mb-1">최고 고도</span>
                                        <div className="flex items-center gap-1">
                                            <MountainIcon className="w-5 h-5 text-gray-600" />
                                            <span className="text-lg font-bold text-gray-800">1,948m</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center border-l border-gray-100">
                                        <span className="text-gray-400 text-xs mb-1">난이도</span>
                                        <div className="flex items-center gap-1">
                                            <Flag className="w-5 h-5 text-yellow-500" />
                                            <span className="text-lg font-bold text-gray-800">보통</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center border-t border-gray-100 pt-4">
                                        <span className="text-gray-400 text-xs mb-1">왕복 시간</span>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-5 h-5 text-blue-500" />
                                            <span className="text-lg font-bold text-gray-800">4h 30m</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center border-l border-t border-gray-100 pt-4">
                                        <span className="text-gray-400 text-xs mb-1">총 거리</span>
                                        <div className="flex items-center gap-1">
                                            <Navigation className="w-5 h-5 text-green-500" />
                                            <span className="text-lg font-bold text-gray-800">9.6km</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 위치 정보 */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-gray-800 text-sm mb-1">위치</h3>
                                    <p className="text-gray-500 text-xs">{mountain.address || "제주특별자치도 서귀포시 토평동"}</p>
                                </div>
                                <button
                                    onClick={() => navigate(`/map?lat=${mountain.lat}&lon=${mountain.lon}&name=${mountain.name}`)}
                                    className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition"
                                >
                                    <MapPin className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* [기능 2] 추천코스 탭 (리디자인 적용) */}
                    {tab === "course" && (
                        <motion.div
                            className="px-4 py-4 bg-gray-50 min-h-[400px]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {/* 타이틀 */}
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-gray-900">추천 탐방 코스</h3>
                                <span className="text-xs text-gray-500">
                {mountain.trails?.length || 0}개
            </span>
                            </div>

                            <div className="space-y-3">
                                {mountain.trails && mountain.trails.length > 0 ? (
                                    mountain.trails.map((trail, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.08 }}
                                            whileHover={{ scale: 1.02 }}
                                            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer"
                                        >
                                            {/* 상단 */}
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-bold text-gray-800 text-base">
                                                    {trail.name}
                                                </h4>

                                                {/* 난이도 점 표시 */}
                                                <div className="flex gap-1">
                                                    {[1, 2, 3].map((i) => (
                                                        <span
                                                            key={i}
                                                            className={`w-2 h-2 rounded-full ${
                                                                trail.difficulty === "어려움"
                                                                    ? i <= 3 ? "bg-red-500" : "bg-gray-200"
                                                                    : trail.difficulty === "쉬움"
                                                                        ? i <= 1 ? "bg-green-500" : "bg-gray-200"
                                                                        : i <= 2 ? "bg-yellow-400" : "bg-gray-200"
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* 스펙 */}
                                            <div className="flex gap-4 text-xs text-gray-600 mb-2">
                                                <div className="flex items-center gap-1">
                                                    <Timer className="w-4 h-4 text-blue-500" />
                                                    {trail.uptime || "시간 미정"}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Footprints className="w-4 h-4 text-green-500" />
                                                    {trail.distance || "거리 미정"}
                                                </div>
                                            </div>

                                            {/* 설명 */}
                                            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                                                {trail.description || "코스 설명이 없습니다."}
                                            </p>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-xl border border-dashed">
                                        <Footprints className="w-10 h-10 mb-2 opacity-20" />
                                        <p className="text-sm">등록된 코스 정보가 없습니다.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* 날씨 탭 */}
                    {tab === "weather" && (
                        <div className="px-4 mt-4">
                            <MountainWeather mountain={mountain} />
                        </div>
                    )}

                    {/* [기능 3] 유의사항 탭 (리디자인 적용) */}
                    {tab === "notice" && (
                        <motion.div
                            className="px-4 py-4 bg-gray-50 min-h-[400px] space-y-4"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {/* 상단 안전 배너 */}
                            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-5 text-white shadow-lg shadow-orange-200">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                                            <ShieldCheck className="w-5 h-5" />
                                            안전 제일 산행
                                        </h3>
                                        <p className="text-orange-100 text-xs opacity-90">
                                            산행 전 반드시 유의사항을 숙지하고<br/>
                                            비상 상황에 대비해주세요.
                                        </p>
                                    </div>
                                    <AlertTriangle className="w-12 h-12 text-white opacity-20" />
                                </div>
                            </div>

                            {/* 체크리스트 스타일 목록 */}
                            <div className="space-y-3">
                                {mountain.notices ? (
                                    mountain.notices.split("|").map((note, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start gap-3"
                                        >
                                            <div className="flex-shrink-0 mt-0.5">
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            </div>
                                            <p className="text-sm text-gray-700 font-medium leading-relaxed">
                                                {note.trim()}
                                            </p>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="bg-white p-6 text-center rounded-xl border border-gray-100 text-gray-400">
                                        <ShieldCheck className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                        등록된 유의사항이 없습니다.
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </motion.section>
        </div>
    );
}