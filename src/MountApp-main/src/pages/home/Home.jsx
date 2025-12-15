import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Siren, Mountain } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

import logo from "/src/assets/logo.png";
import SearchBar from "/src/layouts/SearchBar.jsx";
import DisasterBanner from "/src/components/DisasterBanner";

export default function Home() {
    const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

    const [mountains, setMountains] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [disasterAlerts, setDisasterAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    const FIRE_KEY = "17G3U9FEL969IHBS"; // 산불
    const LAND_KEY = "46LDU080J8RP7ISF"; // 산사태

    useEffect(() => {
        // 산 정보 가져오기
        axios.get("/api/mountains")
            .then(res => setMountains(res.data))
            .catch(err => console.error("산 데이터 로딩 실패:", err));

        const fetchDisasters = async () => {
            try {
                const [fireRes, landRes] = await Promise.all([
                    axios.get("/public-api/V2/api/DSSP-IF-10348", { params: { serviceKey: FIRE_KEY, _type: "json", numOfRows: 5, pageNo: 1 } }),
                    axios.get("/public-api/V2/api/DSSP-IF-00735", { params: { serviceKey: LAND_KEY, _type: "json", numOfRows: 5, pageNo: 1 } }),
                ]);

                const newAlerts = [];

                // 산불
                fireRes.data?.items?.forEach((item, i) => {
                    newAlerts.push({
                        id: `fire-${i}`,
                        type: "FIRE",
                        message: `${item.locNm} 인근 산불 발생`,
                        time: item.stDate,
                    });
                });

                // 산사태
                landRes.data?.items?.forEach((item, i) => {
                    newAlerts.push({
                        id: `land-${i}`,
                        type: "LANDSLIDE",
                        message: `${item.areaName} 산사태 ${item.step} 발령`,
                        time: item.createTime,
                    });
                });

                // 테스트 데이터
                newAlerts.push({
                    id: "test-fire",
                    type: "FIRE",
                    message: "[테스트] 설악산 인근 대형 산불 발생",
                    time: "2025-12-10 14:30",
                });
                newAlerts.push({
                    id: "test-land",
                    type: "LANDSLIDE",
                    message: "[테스트] 강원도 평창군 산사태 경보",
                    time: "2025-12-10 14:35",
                });

                setDisasterAlerts(newAlerts.length ? newAlerts : [{
                    id: 999,
                    type: "INFO",
                    message: "현재 발효된 특보가 없습니다.",
                    time: new Date().toLocaleTimeString(),
                }]);

            } catch (error) {
                console.error("재난 API 호출 실패:", error);
                setDisasterAlerts([{
                    id: 0,
                    type: "INFO",
                    message: "재난 정보를 불러오지 못했습니다.",
                    time: "",
                }]);
            } finally {
                setLoading(false);
            }
        };

        fetchDisasters();
    }, []);

    const filteredMountains = mountains.filter((mt) => !searchTerm || mt.name.includes(searchTerm));

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center">
            <motion.section
                initial="hidden"
                animate="visible"
                transition={{ staggerChildren: 0.1 }}
                className="flex flex-col p-4 space-y-6 w-full max-w-[450px] bg-white shadow-2xl min-h-screen"
            >
                {/* 헤더 */}
                <motion.header variants={fadeIn} className="flex items-center gap-2 py-3">
                    <img src={logo} alt="MountApp 로고" className="w-8 h-8 object-contain" />
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm">
                        MountApp
                    </h1>
                </motion.header>

                {/* 검색 */}
                <motion.div variants={fadeIn}>
                    <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </motion.div>

                {/* 산 목록 */}
                <motion.div variants={fadeIn} className="flex flex-col">
                    <h5 className="text-xl font-bold mb-2 border-b-2 border-gray-400">
                        {searchTerm ? `'${searchTerm}' 검색 결과` : "산악 가이드 정보"}
                    </h5>
                    <div className="flex space-x-4 overflow-x-auto py-2 scrollbar-hide">
                        {filteredMountains.length === 0 ? (
                            <div className="p-4 text-gray-500 w-full text-center">
                                {searchTerm ? "검색된 산이 없습니다." : "등록된 산 정보가 없습니다."}
                            </div>
                        ) : (
                            filteredMountains.map((mt) => (
                                <motion.div key={mt.name} variants={fadeIn} className="min-w-[200px] max-w-[200px] bg-white rounded-lg shadow-md overflow-hidden flex-shrink-0 border border-gray-100">
                                    <Link to={`/mountain/${mt.name}`}>
                                        <img
                                            src={mt.imageUrl?.split(",")[0] || "https://via.placeholder.com/200"}
                                            alt={mt.name}
                                            className="w-full h-32 object-cover"
                                            onError={(e) => e.target.src = "https://via.placeholder.com/300?text=No+Image"}
                                        />
                                        <div className="p-3 flex flex-col space-y-1">
                                            <div className="flex items-center space-x-1">
                                                <Mountain className="w-5 h-5 text-green-600" />
                                                <h3 className="text-lg font-bold">{mt.name}</h3>
                                            </div>
                                            <p className="text-sm text-gray-500 line-clamp-2 h-10">{mt.description}</p>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))
                        )}
                    </div>
                </motion.div>

                {/* 재난 알림 */}
                <motion.div variants={fadeIn}>
                    <div className="flex items-center space-x-2 pb-1 mb-2 border-b-2 border-red-400">
                        <Siren className="w-7 h-7 text-red-700 animate-pulse -translate-y-[3px]" />
                        <h2 className="text-xl font-bold text-red-600">실시간 재난 알림</h2>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg">
                        {loading ? (
                            <p className="text-gray-400 text-center py-2">정보를 불러오는 중...</p>
                        ) : (
                            <DisasterBanner alerts={disasterAlerts} />
                        )}
                    </div>
                </motion.div>

                {/* 유의사항 */}
                <motion.footer variants={fadeIn} className="mt-6 bg-gray-100 border-l-4 border-gray-500 p-4 rounded-lg text-sm text-gray-700">
                    <h4 className="font-bold text-gray-700 mb-1">☑️ 유의사항</h4>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>등산 전 반드시 기상청, 산림청 등 정보를 확인하세요.</li>
                        <li>비상 상황 발생 시 즉시 119에 신고하세요.</li>
                        <li>모든 산행은 본인의 책임하에 이루어집니다.</li>
                    </ul>
                </motion.footer>
            </motion.section>
        </div>
    );
}
