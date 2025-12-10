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

    // 1. 데이터 상태
    const [mountains, setMountains] = useState([]);

    // 2. [추가] 검색어 상태 관리
    const [searchTerm, setSearchTerm] = useState("");

    const [disasterAlerts, setDisasterAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_KEY = "D4HOdxG7MU6ChcZPPl6q2mG2In/DM+wjAVif6pJFHS91I52JjltPYQOl5b26uQ1EBE7FuXWljJOodT1Ge4iLHA==";

    const parseXML = (xmlText) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        return xmlDoc;
    };

    useEffect(() => {
        // 백엔드에서 산 정보 가져오기
        axios.get("/api/mountains")
            .then((res) => setMountains(res.data))
            .catch((err) => console.error("산 데이터 로딩 실패:", err));

        // 재난 정보 가져오기
        const fetchDisasters = async () => {
            try {
                const fireRes = await axios.get(`/public/1400000/forestStusService/getForestStusInfo`, {
                    params: { serviceKey: API_KEY, numOfRows: 5, pageNo: 1 }
                });

                const landRes = await axios.get(`/public/1400000/forestLandslideService/getLandslideInfo`, {
                    params: { serviceKey: API_KEY, numOfRows: 5, pageNo: 1 }
                });

                const newAlerts = [];

                // 산불 데이터 파싱
                const fireDoc = parseXML(fireRes.data);
                const fireItems = fireDoc.getElementsByTagName("item");
                for (let i = 0; i < fireItems.length; i++) {
                    const item = fireItems[i];
                    const loc = item.getElementsByTagName("locNm")[0]?.textContent || "위치 미상";
                    const time = item.getElementsByTagName("stDate")[0]?.textContent || "시간 미상";
                    newAlerts.push({
                        id: `fire-${i}`,
                        type: "FIRE",
                        message: `${loc} 인근 산불 발생`,
                        time: time
                    });
                }

                // 산사태 데이터 파싱
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

                // [테스트 데이터 유지]
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

                if (newAlerts.length === 0) {
                    setDisasterAlerts([{ id: 999, type: "INFO", message: "현재 발효된 특보가 없습니다.", time: new Date().toLocaleTimeString() }]);
                } else {
                    setDisasterAlerts(newAlerts);
                }

            } catch (error) {
                console.error("공공데이터 호출 에러:", error);
                setDisasterAlerts([{ id: 0, type: "INFO", message: "재난 정보를 불러오지 못했습니다.", time: "" }]);
            } finally {
                setLoading(false);
            }
        };

        fetchDisasters();
    }, []);

    // 3. [추가] 검색 필터링 로직 (이름에 검색어가 포함된 산만 남김)
    const filteredMountains = mountains.filter((mt) => {
        if (searchTerm === "") return true;
        return mt.name.includes(searchTerm);
    });

    return (
        // [디자인 수정] pb-20 제거 (흰색 공백 문제 해결)
        <div className="min-h-screen bg-gray-100 flex justify-center">
            <motion.section
                initial="hidden"
                animate="visible"
                transition={{ staggerChildren: 0.1 }}
                // min-h-screen 추가하여 배경 끊김 방지
                className="flex flex-col p-4 space-y-6 w-full max-w-[450px] bg-white shadow-2xl min-h-screen"
            >
                <motion.header variants={fadeIn} className="flex items-center gap-2 py-3">
                    <img src={logo} alt="MountApp 로고" className="w-8 h-8 object-contain" />
                    <h1 className="text-2xl font-bold">MountApp</h1>
                </motion.header>

                {/* 4. [수정] SearchBar에 상태 전달 */}
                <motion.div variants={fadeIn}>
                    <SearchBar
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </motion.div>

                <motion.div variants={fadeIn} className="flex flex-col">
                    {/* 검색어 유무에 따라 제목 변경 */}
                    <h5 className="text-xl font-bold mb-2 border-b-2 border-gray-400">
                        {searchTerm ? `'${searchTerm}' 검색 결과` : "산악 가이드 정보"}
                    </h5>

                    <div className="flex space-x-4 overflow-x-auto py-2 scrollbar-hide">
                        {/* 5. [수정] filteredMountains 사용 */}
                        {filteredMountains.length === 0 ? (
                            <div className="p-4 text-gray-500 w-full text-center">
                                {searchTerm ? "검색된 산이 없습니다." : "등록된 산 정보가 없습니다."}
                            </div>
                        ) : (
                            filteredMountains.map((mt) => (
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

                {/* [디자인 수정] 하단 여백 및 스타일 조정 */}
                <motion.footer
                    variants={fadeIn}
                    className="mt-6 bg-gray-100 border-t border-gray-200 p-6 pb-24 -mx-4 -mb-4 text-sm text-gray-700"
                >
                    <h4 className="font-bold text-gray-700 mb-2 text-base">☑️ 유의사항</h4>
                    <ul className="list-disc pl-5 space-y-1.5">
                        <li>등산 전 반드시 기상청, 산림청 등 정보를 확인하세요.</li>
                        <li>비상 상황 발생 시 즉시 119에 신고하세요.</li>
                        <li>모든 산행은 본인의 책임하에 이루어집니다.</li>
                    </ul>
                </motion.footer>
            </motion.section>
        </div>
    );
}