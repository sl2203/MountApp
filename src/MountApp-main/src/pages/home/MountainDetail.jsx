import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion"; // 슬라이더 애니메이션용 추가
import { Plus, MapPin, ArrowLeft, ChevronLeft, ChevronRight, Mountain as MountainIcon } from "lucide-react"; // 아이콘 추가

import MountainWeather from "./MountainWeather";

export default function MountainDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [mountain, setMountain] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("home");

    // 슬라이더용 상태 (현재 몇 번째 사진인지)
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

    // 1. 쉼표(,)로 이어진 이미지 주소를 잘라서 배열로 만듦
    const images = mountain.imageUrl
        ? mountain.imageUrl.split(",")
        : ["https://via.placeholder.com/400x300"];

    // 다음 사진 보기
    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    // 이전 사진 보기
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

                {/* 📸 [기능 1] 이미지 슬라이더 섹션 */}
                <div className="relative w-full h-64 bg-gray-100 overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentImageIndex} // 키가 바뀌면 애니메이션 다시 실행
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

                    {/* 좌우 화살표 버튼 (사진이 2장 이상일 때만 보임) */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full hover:bg-black/50 transition"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full hover:bg-black/50 transition"
                            >
                                <ChevronRight size={24} />
                            </button>

                            {/* 하단 점(Indicator) */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                {images.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                                    />
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
                <motion.div key={tab} className="mt-3 px-4 pb-10">

                    {/* 홈 탭 */}
                    {tab === "home" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="border border-gray-300 h-40 grid grid-rows-2 grid-cols-2 rounded-lg bg-white">
                                <div className="flex flex-col items-center justify-center border-b border-r border-gray-200">
                                    <span className="text-sm text-gray-500 mb-1">🏔️ 높이</span>
                                    <span className="font-bold text-lg">{mountain.height}m</span>
                                </div>
                                <div className="flex flex-col items-center justify-center border-b border-gray-200">
                                    <span className="text-sm text-gray-500 mb-1">📍 위치</span>
                                    <span className="font-bold text-sm text-center px-1">{mountain.location}</span>
                                </div>
                                {/* 난이도 표시 (DB에 추가했으므로 표시 가능) */}
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

                    {/* [기능 2] 코스 정보 탭 */}
                    {tab === "course" && (
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-blue-500" /> 추천 코스
                            </h4>
                            <div className="text-gray-700 text-sm leading-relaxed">
                                {mountain.trails ? (
                                    // 1. \n (글자) 또는 실제 줄바꿈 문자를 기준으로 자릅니다.
                                    mountain.trails.split(/\\n|\n/).map((line, index) => (
                                        <p key={index} className="mb-2">
                                            {/* 2. 잘린 문장들을 각각의 p 태그로 감싸서 보여줍니다. */}
                                            {line}
                                        </p>
                                    ))
                                ) : (
                                    "등록된 코스 정보가 없습니다."
                                )}
                            </div>
                        </div>
                    )}

                    {/* 날씨 정보 */}
                    {tab === "weather" && <MountainWeather mountain={mountain} />}

                    {/* [기능 3] 유의사항 탭 */}
                    {tab === "notice" && (
                        <motion.footer className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-sm text-gray-700 shadow-sm">
                            <h4 className="font-bold text-yellow-800 mb-2">⚠️ 안전 산행 유의사항</h4>
                            <ul className="list-disc pl-5 space-y-2">
                                {/* DB의 notices 문자열을 파이프(|)로 잘라서 보여줌 */}
                                {mountain.notices ? (
                                    mountain.notices.split("|").map((note, idx) => (
                                        <li key={idx}>{note}</li>
                                    ))
                                ) : (
                                    <li>등록된 유의사항이 없습니다.</li>
                                )}
                            </ul>
                        </motion.footer>
                    )}
                </motion.div>
            </motion.section>
        </div>
    );
}