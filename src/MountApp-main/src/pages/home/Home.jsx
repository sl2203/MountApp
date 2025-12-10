import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Megaphone } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

import logo from "/src/assets/logo.png";
import SearchBar from "/src/layouts/SearchBar.jsx";
import DisasterBanner from "/src/components/DisasterBanner";

export default function Home() {
    const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

    const [mountains, setMountains] = useState([]);
    const [disasterAlerts, setDisasterAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    // ========================================================
    // 🔑 [중요] 여기에 공공데이터포털에서 받은 Decoding 키를 입력하세요
    // ========================================================
    const API_KEY = "D4HOdxG7MU6ChcZPPl6q2mG2In/DM+wjAVif6pJFHS91I52JjltPYQOl5b26uQ1EBE7FuXWljJOodT1Ge4iLHA==";

    // XML 데이터를 JSON처럼 편하게 꺼내기 위한 헬퍼 함수
    const parseXML = (xmlText) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        return xmlDoc;
    };

    useEffect(() => {
        // 1. 우리 서버(백엔드)에서 산 정보 가져오기
        axios.get("/api/mountains")
            .then((res) => setMountains(res.data))
            .catch((err) => console.error("산 데이터 로딩 실패:", err));

        // 2. 공공데이터포털에서 재난 정보 가져오기
        const fetchDisasters = async () => {
            try {
                // (1) 산불 정보 호출 (프록시 경로 /api/public 사용)
                // 실제 서비스 ID나 URL은 신청한 API 상세페이지를 참고해야 합니다.
                // 아래는 예시 URL입니다 (산불 발생 정보)
                const fireRes = await axios.get(`/public/1400000/forestStusService/getForestStusInfo`, {
                    params: {
                        serviceKey: API_KEY,
                        numOfRows: 5,
                        pageNo: 1,
                    }
                });

                // (2) 산사태 정보 호출
                const landRes = await axios.get(`/public/1400000/forestLandslideService/getLandslideInfo`, {
                    params: {
                        serviceKey: API_KEY,
                        numOfRows: 5,
                        pageNo: 1,
                    }
                });

                // (3) 데이터 가공 (XML 파싱)
                const newAlerts = [];

                // --- 산불 데이터 처리 ---
                const fireDoc = parseXML(fireRes.data);
                const fireItems = fireDoc.getElementsByTagName("item"); // XML 태그 이름 확인 필요

                for (let i = 0; i < fireItems.length; i++) {
                    const item = fireItems[i];
                    // 태그 이름은 API 문서에 따라 다를 수 있습니다 (예: locNm, startDt)
                    const loc = item.getElementsByTagName("locNm")[0]?.textContent || "위치 미상";
                    const time = item.getElementsByTagName("stDate")[0]?.textContent || "시간 미상";

                    newAlerts.push({
                        id: `fire-${i}`,
                        type: "FIRE",
                        message: `${loc} 인근 산불 발생`,
                        time: time
                    });
                }

                // --- 산사태 데이터 처리 ---
                const landDoc = parseXML(landRes.data);
                const landItems = landDoc.getElementsByTagName("item");

                for (let i = 0; i < landItems.length; i++) {
                    const item = landItems[i];
                    const area = item.getElementsByTagName("areaName")[0]?.textContent || "지역 미상";
                    const time = item.getElementsByTagName("createTime")[0]?.textContent || "";
                    const level = item.getElementsByTagName("step")[0]?.textContent || "주의보";

                    newAlerts.push({
                        id: `land-${i}`,
                        type: "LANDSLIDE",
                        message: `${area} 산사태 ${level} 발령`,
                        time: time
                    });
                }
                newAlerts.push({
                    id: "test-fire",
                    type: "FIRE",
                    message: "[테스트] 설악산 인근 대형 산불 발생",
                    time: "2025-12-10 14:30"
                });
                newAlerts.push({
                    id: "test-land",
                    type: "LANDSLIDE",
                    message: "[테스트] 강원도 평창군 산사태 경보",
                    time: "2025-12-10 14:35"
                });

                // (4) 데이터가 하나도 없을 경우 더미 데이터 넣어주기 (테스트용)
                if (newAlerts.length === 0) {
                    setDisasterAlerts([
                        { id: 999, type: "INFO", message: "현재 발효된 특보가 없습니다.", time: new Date().toLocaleTimeString() }
                    ]);
                } else {
                    setDisasterAlerts(newAlerts);
                }

            } catch (error) {
                console.error("공공데이터 호출 에러:", error);
                // 에러 발생 시 사용자에게 보여줄 메시지
                setDisasterAlerts([{ id: 0, type: "INFO", message: "재난 정보를 불러오지 못했습니다.", time: "" }]);
            } finally {
                setLoading(false);
            }
        };

        fetchDisasters();

    }, []);

    // ... 아래 return 부분은 기존 코드와 100% 동일합니다 ...
    return (
        <div className="min-h-screen bg-gray-100 flex justify-center">
            {/* 기존 코드 그대로 사용... */}
            <motion.section
                initial="hidden"
                animate="visible"
                transition={{ staggerChildren: 0.1 }}
                className="flex flex-col p-4 space-y-6 w-full max-w-[450px] bg-white shadow-2xl"
            >
                <motion.header variants={fadeIn} className="flex items-center gap-2 py-3">
                    <img src={logo} alt="MountApp 로고" className="w-8 h-8 object-contain" />
                    <h1 className="text-2xl font-bold">MountApp</h1>
                </motion.header>

                <motion.div variants={fadeIn}>
                    <SearchBar />
                </motion.div>

                <motion.div variants={fadeIn} className="flex flex-col">
                    <h5 className="text-xl font-bold mb-2 border-b-2 border-gray-400">산악 가이드 정보</h5>
                    <div className="flex space-x-4 overflow-x-auto py-2 scrollbar-hide">
                        {mountains.length === 0 ? (
                            <div className="p-4 text-gray-500">등록된 산 정보가 없습니다.</div>
                        ) : (
                            mountains.map((mt) => (
                                <motion.div key={mt.id} variants={fadeIn} className="min-w-[200px] max-w-[200px] bg-white rounded-lg shadow-md overflow-hidden flex-shrink-0 border border-gray-100">
                                    <Link to={`/mountain/${mt.id}`}>
                                        <img
                                            src={mt.imageUrl ? mt.imageUrl.split(",")[0] : "https://via.placeholder.com/200"}
                                            alt={mt.name}
                                            className="w-full h-32 object-cover"
                                            onError={(e) => e.target.src = "https://via.placeholder.com/300?text=No+Image"}
                                        />
                                        <div className="p-3 flex flex-col space-y-1">
                                            <h3 className="text-lg font-bold">{mt.name}</h3>
                                            <p className="text-sm text-gray-500 line-clamp-2 h-10">
                                                {mt.description}
                                            </p>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))
                        )}
                    </div>
                </motion.div>

                <motion.div variants={fadeIn}>
                    <div className="flex items-center space-x-2 py-1 mb-2 border-b-2 border-gray-400">
                        <Megaphone className="w-6 h-6 text-red-600" aria-hidden="true" />
                        <h2 className="text-xl font-bold">실시간 재난정보</h2>
                    </div>

                    <div className="bg-gray-50 p-2 rounded-lg">
                        {loading ? (
                            <p className="text-gray-400 text-center py-2">정보를 불러오는 중...</p>
                        ) : (
                            <DisasterBanner alerts={disasterAlerts} />
                        )}
                    </div>
                </motion.div>

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