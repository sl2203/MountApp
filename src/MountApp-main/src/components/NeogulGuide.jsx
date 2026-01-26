import React from "react";
import { motion } from "framer-motion";
import neogulGuide from "../assets/neogulGuide.jpeg";
import { MessageCircle } from 'lucide-react'; // 아이콘 라이브러리

const NeogulGuide = ({ onOpen }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpen}
            className="fixed bottom-[90px] right-[770px] z-[9999] cursor-pointer"
        >
            <div className="relative group flex flex-col items-center">

                {/* --- MessageCircle 기반 연두색 말풍선 --- */}
                <div className="
                    absolute
                    -top-16
                    -left-[90px]
                    opacity-0
                    group-hover:opacity-100
                    transition-all duration-300
                    transform group-hover:-translate-y-2
                    pointer-events-none
                ">
                    <div className="relative flex items-center justify-center">
                        {/* 1. 배경이 되는 아이콘: 가로세로를 다르게 주어 타원형으로 변형 */}
                        <MessageCircle
                            size={100}
                            strokeWidth={0}   /* 테두리 없이 면으로만 구성 */
                            fill="#C1E8AF"    /* 이미지와 동일한 연두색 스킨 */
                            className="drop-shadow-sm scale-x-[-1] scale-y-[0.8]"  /* 가로로 늘리고 세로로 눌러서 타원형 제작 */
                        />

                        {/* 2. 아이콘 내부 중앙 텍스트 */}
                        <div className="absolute top-[32%] left-[52px] -translate-x-1/2 whitespace-nowrap">
                            <div className="text-[11px] font-bold text-[#2D4B22]">
                                준비됐나요? <br /> 산으로 떠나요!
                            </div>
                        </div>
                    </div>
                </div>
                {/* -------------------------------------- */}

                {/* 너굴 가이드 이미지 (좌우 반전) */}
                <img
                    src={neogulGuide}
                    alt="너굴 가이드"
                    className="w-16 h-16 rounded-full border-4 border-white shadow-md object-cover scale-x-[-1]"
                />
            </div>
        </motion.div>
    );
};

export default NeogulGuide;