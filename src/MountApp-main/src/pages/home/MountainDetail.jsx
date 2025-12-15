import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
// [변경] Clock, Flag 아이콘 추가
import { Plus, MapPin, ArrowLeft, ChevronLeft, ChevronRight, Mountain as MountainIcon, Clock, Flag } from "lucide-react";

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

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center">
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4 min-h-screen w-full max-w-[450px] bg-white shadow-xl"
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
                <div className="flex justify-around border-b pb-2 text-sm font-bold text-gray-600">
                    <button onClick={() => setTab("home")} className={`pb-1 ${tab === "home" ? "text-blue-600 border-b-2 border-blue-600" : ""}`}>홈</button>
                    <button onClick={() => setTab("course")} className={`pb-1 ${tab === "course" ? "text-blue-600 border-b-2 border-blue-600" : ""}`}>추천코스</button>
                    <button onClick={() => setTab("weather")} className={`pb-1 ${tab === "weather" ? "text-blue-600 border-b-2 border-blue-600" : ""}`}>날씨</button>
                    <button onClick={() => setTab("notice")} className={`pb-1 ${tab === "notice" ? "text-blue-600 border-b-2 border-blue-600" : ""}`}>유의사항</button>
                </div>

                {/* 탭 내용 */}
                <motion.div key={tab} className="mt-0 pb-10"> {/* 패딩 제거 (배경색 적용을 위해) */}

                    {/* 홈 탭 */}
                    {tab === "home" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 mt-3">
                            <div className="border border-gray-300 h-40 grid grid-rows-2 grid-cols-2 rounded-lg bg-white">
                                <div className="flex flex-col items-center justify-center border-b border-r border-gray-200">
                                    <span className="text-sm text-gray-500 mb-1">🏔️ 높이</span>
                                    <span className="font-bold text-lg">{mountain.height}m</span>
                                </div>
                                <div className="flex flex-col items-center justify-center border-b border-gray-200">
                                    <span className="text-sm text-gray-500 mb-1">📍 위치</span>
                                    <span className="font-bold text-sm text-center px-1">{mountain.location}</span>
                                </div>
                                {mountain.difficulty && (
                                    <div className="col-span-2 flex items-center justify-center py-2 bg-gray-50 border-b border-gray-200 text-sm">
                                        <span className="font-bold text-gray-600 mr-2">난이도:</span>
                                        <span className="text-blue-600 font-bold">{mountain.difficulty}</span>
                                    </div>
                                )}
                                <div className="flex flex-row items-center justify-between px-6 py-3 border-gray-200 col-span-2 hover:bg-gray-50 cursor-pointer transition">
                                    <span className="text-gray-700 text-sm font-bold">✉️ 등산 후기</span>
                                    <button className="flex items-center justify-center rounded-full border border-gray-300 p-1 bg-white">
                                        <Plus className="w-4 h-4 text-gray-500"/>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* [기능 2] 코스 정보 탭 (카드 UI 적용) */}
                    {tab === "course" && (
                        <motion.div
                            className="px-4 py-4 bg-gray-50 min-h-[400px]" // 배경색 추가
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="space-y-4">
                                {mountain.trails ? (
                                    mountain.trails.split(/\\n|\n/).map((line, index) => {
                                        if (!line.trim()) return null;

                                        // UI를 위한 임시 데이터 생성 (DB 업데이트 전까지 사용)
                                        const isPopular = index === 0; // 첫 번째 코스만 인기
                                        const difficulty = index % 2 === 0 ? "보통" : "어려움";
                                        const time = index === 0 ? "4시간 30분" : "3시간";
                                        const distance = index === 0 ? "9.6km" : "5.8km";

                                        return (
                                            <div key={index} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                                                {/* 상단: 코스 이름 + 깃발 */}
                                                <div className="flex items-start justify-between mb-2">
                                                    <h4 className="font-bold text-lg text-gray-800 flex items-center gap-1">
                                                        {line.length > 20 ? `${mountain.name} ${index + 1}코스` : line}
                                                        <Flag className="w-4 h-4 text-gray-400 ml-1 fill-gray-100" />
                                                    </h4>
                                                </div>

                                                {/* 설명 (긴 줄글일 경우 자르기) */}
                                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                                    {line}
                                                </p>

                                                {/* 태그 (인기, 난이도) */}
                                                <div className="flex gap-2 mb-6">
                                                    {isPopular && (
                                                        <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-md">
                                                            인기
                                                        </span>
                                                    )}
                                                    <span className={`px-2 py-1 text-xs font-bold rounded-md ${
                                                        difficulty === "보통" ? "bg-gray-100 text-gray-600" : "bg-red-50 text-red-600"
                                                    }`}>
                                                        {difficulty}
                                                    </span>
                                                </div>

                                                {/* 하단: 시간 및 거리 */}
                                                <div className="flex justify-end items-center gap-4 text-sm text-gray-500 font-medium">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4 text-gray-400" />
                                                        <span>{time}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="w-4 h-4 text-gray-400" />
                                                        <span>{distance}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-10 text-gray-400 bg-white rounded-2xl shadow-sm">
                                        <MapPin className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                        <p>등록된 코스 정보가 없습니다.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* 날씨 정보 */}
                    {tab === "weather" && (
                        <div className="px-4 mt-3">
                            <MountainWeather mountain={mountain} />
                        </div>
                    )}

                    {/* [기능 3] 유의사항 탭 */}
                    {tab === "notice" && (
                        <motion.div className="px-4 mt-3">
                            <footer className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-sm text-gray-700 shadow-sm">
                                <h4 className="font-bold text-yellow-800 mb-2">⚠️ 안전 산행 유의사항</h4>
                                <ul className="list-disc pl-5 space-y-2">
                                    {mountain.notices ? (
                                        mountain.notices.split("|").map((note, idx) => (
                                            <li key={idx}>{note}</li>
                                        ))
                                    ) : (
                                        <li>등록된 유의사항이 없습니다.</li>
                                    )}
                                </ul>
                            </footer>
                        </motion.div>
                    )}
                </motion.div>
            </motion.section>
        </div>
    );
}