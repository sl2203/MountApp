  import { useParams } from "react-router-dom";
  import { motion } from "framer-motion";
  import { Plus, Clock, MapPin } from "lucide-react";
  import { useState } from "react";
  import BackButton from "../layouts/BackButton";
  import { guides } from "./guidesData";
  import { trailsData } from "./trailsData";
  import MountainWeather from "./MountainWeather";

  export default function Mountain() {
    const { name } = useParams();
    const mountain = guides.find((g) => g.name === name);
    const [tab, setTab] = useState("home"); 

    return (
      <motion.section className="space-y-4">
        <motion.header className="relative flex items-center justify-center m-4">
          <BackButton />
          <h2 className="text-2xl font-bold">{mountain.name}</h2>
        </motion.header>

        {/* 이미지 */}
        <motion.div className="space-y-3 pt-0 px-4 pb-4 border-b-4">
          <div className="flex overflow-x-auto space-x-4 py-2 -mx-4 px-4">
            {mountain.image.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${mountain.name}-${index}`}
                className="h-56  w-auto rounded-lg flex-shrink-0 object-cover shadow-md"
              />
            ))}
          </div>
          <p className="text-gray-700 leading-relaxed">{mountain.description}</p>
        </motion.div>

        {/* 탭 메뉴 */}
        <div className="flex justify-around border-b pb-2 text-sm font-bold text-gray-600">
          <button
            onClick={() => setTab("home")}
            className={`${tab === "home" ? "text-blue-600 border-b-2 border-blue-600" : ""}`}
          >
            홈
          </button>
          <button
            onClick={() => setTab("course")}
            className={`${tab === "course" ? "text-blue-600 border-b-2 border-blue-600" : ""}`}
          >
            추천코스
          </button>
          <button
            onClick={() => setTab("weather")}
            className={`${tab === "weather" ? "text-blue-600 border-b-2 border-blue-600" : ""}`}
          >
            날씨
          </button>
          <button
            onClick={() => setTab("notice")}
            className={`${tab === "notice" ? "text-blue-600 border-b-2 border-blue-600" : ""}`}
          >
            유의사항
          </button>
        </div>

        {/* 탭 내용 */}
        <motion.div
          key={tab}
          className="mt-3"
        >
          {tab === "home" && (
           <motion.div className="p-4">
              <div className="border border-gray-300 h-40 grid grid-rows-2 grid-cols-2 rounded-lg">
                <div className="flex flex-col items-center justify-center border-b border-gray-200">
                  🏔️ 최고난도
                  <span className="font-bold">1,948m</span>
                </div>
                <div className="flex flex-col items-center justify-center border-b border-gray-200">
                  🏆 난이도
                  <span className="font-bold">보통</span>
                </div>
                <div className="flex flex-row items-center justify-between px-6 border-gray-200 col-span-2">
                  <span className="text-gray-700 text-sm">✉️ 리뷰</span>
                  <button className="flex items-center justify-center rounded-full border border-gray-5 00 p-1">
                    <Plus className="w-4 h-4 text-gray-500"/>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          {/* 코스정보 */}
           {tab === "course" && (
            <div className="p-3 space-y-3">
              {trailsData[mountain.name]?.map((trail, index) => (
                <div
                  key={index}
                  className="bg-white p-3 rounded-lg shadow-md flex justify-between items-center transition-all"
                >
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-md">
                      {trail.name} <span className="text-xs">🏴</span>
                    </h4>
                    <p className="text-xs text-gray-500">{trail.description}</p>
          
                    <div className="flex space-x-2 pt-1">
                      {trail.tags
                        ?.filter(tag => tag !== "탐방예약")
                        .map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-800"
                          >
                            {tag}
                          </span>
                        ))}
          
                      {trail.difficulty && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">
                          {trail.difficulty}
                        </span>
                      )}
                    </div>
                  </div>
          
                  <div className="flex items-center space-x-3 flex-shrink-0 ml-4  ">
                    <div className="text-sm space-y-1.5 text-gray-700">
                      <div className="flex items-center justify-end space-x-2">
                        <span className="text-base" title="예상 시간"><Clock className="w-5 h-5" /></span>
                        <span>{trail.time}</span>
                      </div>
                      <div className="flex items-center justify-end space-x-2">
                        <span className="text-base" title="거리"><MapPin className="w-5 h-5" /></span>
                        <span>{trail.distance}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        {/* 날씨 정보 */}
         {tab === "weather" && <MountainWeather mountain={mountain} />}

          {tab === "notice" && (
            <div className="bg-yellow-100 p-4 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-2">⚠️ 유의사항</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                <li>등산 전 반드시 날씨를 확인하세요.</li>
                <li>비상 시 119에 즉시 신고하세요.</li>
                <li>야간 산행은 가급적 피하세요.</li>
                <li>쓰레기는 되가져갑시다.</li>
              </ul>
            </div>
          )}
        </motion.div>
      </motion.section>
    );
  }
