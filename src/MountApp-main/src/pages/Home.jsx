import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Megaphone } from "lucide-react";
import { Link } from "react-router-dom";

import logo from "../assets/logo.png";  
import hanla from "../assets/hanla.jpeg";
import seorak from "../assets/seorak.jpg";  
import bukhan from "../assets/bukhan.jpeg";
import gyeyang from "../assets/gyeyang.jpeg";

import SearchBar from "../layouts/SearchBar"; 

export default function Home() {
  const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  const guides = [
    { name: "한라산", image: hanla, description: "제주도의 최고봉, 다양한 코스와 풍경을 즐길 수 있습니다." },
    { name: "설악산", image: seorak, description: "바위와 계곡이 많아 등산 난이도가 높은 산입니다." },
    { name: "북한산", image: bukhan, description: "서울·경계 국립공원으로, 백운대와 계곡·숲이 어우러진 산입니다." },
    { name: "계양산", image: gyeyang, description: "인천 등산객에게 인기, 일출·일몰 명소입니다." },
  ];

  const [wildfires, setWildfires] = useState([]);
  const [landslides, setLandslides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 임시 산불 데이터
    const tempWildfires = [
      { SN: 1, PLC_NM: "북한산", MSTN_DT: "2025-11-07 14:00" },
      { SN: 2, PLC_NM: "설악산", MSTN_DT: "2025-11-07 13:30" },
      { SN: 3, PLC_NM: "한라산", MSTN_DT: "2025-11-07 12:50" },
    ];

    // 임시 산사태 데이터
    const tempLandslides = [
      { SN: 1, SGG_NM: "강원도 강릉시", PREDC_ANLS_DT: "2025-11-07 14:10" },
      { SN: 2, SGG_NM: "경기도 양평군", PREDC_ANLS_DT: "2025-11-07 13:45" },
      { SN: 3, SGG_NM: "제주특별자치도 제주시", PREDC_ANLS_DT: "2025-11-07 12:55" },
    ];

    setWildfires(tempWildfires);
    setLandslides(tempLandslides);
    setLoading(false);
  }, []);

  return (
    <motion.section initial="hidden" animate="visible" transition={{ staggerChildren: 0.1 }} className="flex flex-col p-4 space-y-6">
      <motion.header variants={fadeIn} className="flex items-center gap-2 py-3">
        <img src={logo} alt="MountApp 로고" className="w-8 h-8 object-contain" />
        <h1 className="text-2xl font-bold">MountApp</h1>
      </motion.header>

      <motion.div variants={fadeIn}>
        <SearchBar />
      </motion.div>

      {/* 산악 가이드 */}
      <motion.div variants={fadeIn} className="flex flex-col">
        <h5 className="text-xl font-bold mb-2 border-b-2 border-gray-400">산악 가이드 정보</h5>
        <div className="flex space-x-4 overflow-x-auto py-2">
          {guides.map((guide, index) => (
            <motion.div key={index} variants={fadeIn} className="max-w-80 bg-white rounded-lg shadow-md overflow-hidden flex-shrink-0">
              <Link to={`/mountain/${guide.name}`}>
                <img src={guide.image} alt={guide.name} className="w-full h-40 object-cover" />  
                <div className="p-3 flex flex-col space-y-1">
                  <h3 className="text-lg font-bold">{guide.name}</h3>
                  <p className="text-sm text-gray-500">{guide.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <motion.div variants={fadeIn} className="flex items-center space-x-2 py-1 border-b-2 border-gray-400">
        <Megaphone className="w-6 h-6" aria-hidden="true" />
        <h2 className="text-xl font-bold">실시간 재난정보</h2>
      </motion.div>

      <motion.section variants={fadeIn} className="flex flex-col space-y-3 bg-gray-200 p-3 rounded-lg">
        {/* 산사태 정보 */}
        <motion.div className="text-xl font-bold text-gray-600"> 산사태 정보 </motion.div>
        <div className="border-t border-gray-300"></div>
        <div className="bg-white rounded-lg p-3 shadow-sm min-h-[100px]">
          {loading && <p className="text-gray-400">Loading...</p>}
          {!loading && landslides.length === 0 && (
            <p className="text-gray-400">현재 산사태 정보가 없습니다.</p>
          )}
          {!loading && landslides.length > 0 && (
            <ul className="space-y-2">
              {landslides.map((item) => (
                <li key={item.SN} className="text-gray-700 text-sm border-b pb-1">
                  ⚠️ {item.SGG_NM} 산사태 발생
                  <br />
                  ⏱ {item.PREDC_ANLS_DT}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 산불 정보 */}
        <motion.div className="text-xl font-bold text-gray-600 mt-4"> 산불 정보 </motion.div>
        <div className="border-t border-gray-300"></div>
        <div className="bg-white rounded-lg p-3 shadow-sm min-h-[100px]">
          {loading && <p className="text-gray-400">Loading...</p>}
          {!loading && wildfires.length === 0 && (
            <p className="text-gray-400">현재 산불 정보가 없습니다.</p>
          )}
          {!loading && wildfires.length > 0 && (
            <ul className="space-y-2">
              {wildfires.map((item) => (
                <li key={item.SN} className="text-gray-700 text-sm border-b pb-1">
                  🚨 {item.PLC_NM} 산불 발생
                  <br />
                  ⏱ {item.MSTN_DT}
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.section>

        {/*유의사항 섹션 */}
        <motion.footer variants={fadeIn} className="mt-6 bg-gray-100 border-l-4 border-gray-500 p-4 rounded-lg text-sm text-gray-700">
        <h4 className="font-bold text-gray-700 mb-1">☑️ 유의사항</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>등산 전 반드시 기상청, 산림청 등 정보를 확인하세요.</li>
          <li>비상 상황 발생 시 즉시 119에 신고하세요.</li>
          <li>모든 산행은 본인의 책임하에 이루어집니다.</li>
        </ul>
      </motion.footer>
    </motion.section>
  );
}
