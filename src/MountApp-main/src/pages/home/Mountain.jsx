  import { useParams } from "react-router-dom";
  import { motion } from "framer-motion";
  import { Plus, Clock, MapPin } from "lucide-react";
  import { useState } from "react";
  import BackButton from "../../layouts/BackButton";
  import { guides } from "../../data/guidesData";
  import { trailsData } from "../../data/trailsData";
  import MountainWeather from "./MountainWeather";

  export default function Mountain() {
    const { name } = useParams();
    const mountain = guides.find((g) => g.name === name);
    const [tab, setTab] = useState("home"); 

    return (
      <div className="min-h-screen bg-gray-100 flex justify-center">
      <motion.section className="space-y-4 min-h-screen max-w-[450px] bg-white">
        <motion.header className="relative flex items-center justify-center m-4">
          <BackButton />
          <h2 className="text-2xl font-bold">{mountain.name}</h2>
        </motion.header>
        {/* 이미지 */}
        <motion.div className="space-y-3 pt-0 px-4 pb-4 border-b-4 overflow-hidden">
          <motion.div
            className="flex space-x-4"
            style={{ width: "max-content" }}
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              x: { repeat: Infinity, repeatType: "loop", duration: 20, ease: "linear" }
            }}
          >
            {[...mountain.image, ...mountain.image].map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${mountain.name}-${index}`}
                className="h-56 w-auto rounded-lg flex-shrink-0 object-cover shadow-md"
              />
            ))}
          </motion.div>
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
            <motion.div
              className="px-4 py-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="bg-white rounded-2xl shadow-lg p-5 space-y-4">
                
                <div className="flex justify-between">
                  <div className="text-center w-1/2 border-r">
                    <div className="text-gray-500 text-sm">🏔️ 최고 고도</div>
                    <div className="text-xl font-bold mt-1">1,948m</div>
                  </div>
                  <div className="text-center w-1/2">
                    <div className="text-gray-500 text-sm">🏆 난이도</div>
                    <div className="text-xl font-bold mt-1">보통</div>
                  </div>
                </div>

                {/* 리뷰 */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-gray-600 text-sm">✉️ 리뷰</span>
                  <button className="flex items-center justify-center rounded-full border border-gray-400 p-1 hover:bg-gray-100">
                    <Plus className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

{tab === "course" && (
            <motion.div
              className="p-3 space-y-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {trailsData[mountain.name]?.map((trail, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="space-y-2">
                    <h4 className="font-bold text-md flex items-center">
                      {trail.name}
                      <span className="text-xs ml-1">🏴</span>
                    </h4>

                    <p className="text-xs text-gray-500">{trail.description}</p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {trail.tags
                        ?.filter((tag) => tag !== "탐방예약")
                        .map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700"
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

                  <div className="flex items-center justify-end space-x-4 pt-2 text-sm text-gray-700">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{trail.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{trail.distance}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

        {/* 날씨 정보 */}
         {tab === "weather" && <MountainWeather mountain={mountain} />}

         {tab === "notice" && (
          mountain.notices &&
          mountain.notices.length > 0 && (
            <motion.footer
              className="mt-6 bg-gray-100 border-l-4 border-gray-500 p-4 rounded-lg text-sm text-gray-700 mx-4"
            >
              <h4 className="font-bold text-gray-700 mb-2">☑️ 유의사항</h4>
              <ul className="list-disc pl-5 space-y-1">
                {mountain.notices.map((notice, index) => (
                  <li key={index}>{notice}</li>
                ))}
              </ul>
              </motion.footer>
            )
          )}
        </motion.div>
      </motion.section>
      </div> 
    );
  }
