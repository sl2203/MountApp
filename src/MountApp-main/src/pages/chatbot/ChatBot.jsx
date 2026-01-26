    import React, { useState, useEffect, useRef } from 'react';
    import { X, Send, Calendar, Plus, ChevronDown, MapPin, Gauge, Copy, Edit3 } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import neogulImg from "../../assets/neogulGuide.jpeg";

    const ChatBot = ({ onClose }) => {
        // 필터 상태
        const [selectedDate, setSelectedDate] = useState("");
        const [selectedRegion, setSelectedRegion] = useState("지역");
        const [selectedLevel, setSelectedLevel] = useState("난이도");

        const regions = ["전국", "서울", "경기", "강원", "충청", "경상", "전라", "제주"];
        const levels = ["초보자", "중급자", "상급자"];

        // 채팅 관련 상태
        const [inputText, setInputText] = useState("");
        const [messages, setMessages] = useState([]);
        const [editingId, setEditingId] = useState(null);
        const [editInputText, setEditInputText] = useState("");
        const scrollRef = useRef(null);

        const getCurrentTime = () => {
            const now = new Date();
            return now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true });
        };

        useEffect(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        }, [messages]);

        // 텍스트 조합 함수
        const getCombinedText = (pureText) => {
            const datePart = selectedDate ? `${parseInt(selectedDate.split('-')[1])}월 ${parseInt(selectedDate.split('-')[2])}일 ` : "";
            const regionPart = (selectedRegion !== "지역" && selectedRegion !== "전국") ? `${selectedRegion} 지역의 ` : "";
            const levelPart = selectedLevel !== "난이도" ? `${selectedLevel} 난이도 ` : "";
            return `${datePart}${regionPart}${levelPart}${pureText}`;
        };

        const handleSendMessage = () => {
            if (!inputText.trim()) return;

            const combinedText = getCombinedText(inputText);
            const newUserMsg = {
                role: 'user',
                text: combinedText,
                time: getCurrentTime(),
                isEdited: false
            };

            setMessages(prev => [...prev, newUserMsg]);
            setInputText("");

            setTimeout(() => {
                const aiMsg = {
                    role: 'bot',
                    text: `${combinedText}에 대해 안내해 드릴게요!`,
                    time: getCurrentTime()
                };
                setMessages(prev => [...prev, aiMsg]);
            }, 800);
        };

        // 수정 시작 시 말풍선에 보이는 전체 텍스트(날짜/지역 포함)를 가져옴
        const startEdit = (index, fullText) => {
            setEditingId(index);
            setEditInputText(fullText);
        };

        const handleUpdateMessage = (index) => {
            if (!editInputText.trim()) return;

            setMessages(prev => {
                const newMsgs = [...prev];
                newMsgs[index] = {
                    ...newMsgs[index],
                    text: editInputText,
                    isEdited: true
                };
                return newMsgs;
            });

            setEditingId(null);

            // AI 재응답
            setTimeout(() => {
                setMessages(prev => {
                    const updated = [...prev];
                    const nextIdx = index + 1;
                    if (updated[nextIdx] && updated[nextIdx].role === 'bot') {
                        updated[nextIdx] = {
                            ...updated[nextIdx],
                            text: `${editInputText} 에 다시 안내해 드릴게요!`,
                            time: getCurrentTime()
                        };
                    }
                    return updated;
                });
            }, 600);
        };

        const handleCopy = (text) => {
            navigator.clipboard.writeText(text);
        };

        return (
            <motion.div
                initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-full h-[800px] rounded-[20px] bg-[#F8F9F8] flex flex-col relative shadow-2xl overflow-hidden font-sans"
            >
                {/* 헤더 섹션 */}
                <div className="bg-[#D1F386] p-6 flex justify-between items-start z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-white overflow-hidden">
                            <img src={neogulImg} alt="너굴" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">너굴 AI</h1>
                            <div className="flex items-center text-xs text-gray-600 mt-1 font-medium bg-white/30 px-2 py-0.5 rounded-full">
                                <Calendar size={12} className="mr-1" />
                                <span>실시간 산행 가이드</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-600 hover:bg-black/5 p-1 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* 채팅 영역 */}
                <div ref={scrollRef} className="flex-1 p-6 space-y-6 overflow-y-auto bg-gradient-to-b from-[#D1F386]/10 to-transparent scroll-smooth">

                    {/* [복구된 너굴 AI 소개글] */}
                    <div className="flex gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex-shrink-0 shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden">
                            <img src={neogulImg} alt="너굴" className="w-full h-full object-cover" />
                        </div>
                        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-50 max-w-[85%]">
                            <h2 className="text-lg font-bold text-gray-900 leading-tight">
                                안녕하세요!<br />
                                저는 당신의 산행 안전을 책임지는<br /> 인공지능 가이드, <span className="text-[#58b36e]">'너굴 AI'</span> 입니다.
                            </h2>
                            <p className="mt-2 text-gray-500 text-sm font-medium leading-relaxed">
                                복잡한 등산로 데이터와 실시간 기상을
                                분석해서, 당신의 체력과 취향에 딱
                                맞는 최적의 코스를 찾아드려요.
                                잃을 걱정 없는 안전한 산행,
                                이제 저와 함께 시작해 보세요!
                            </p>
                        </div>
                    </div>

                    {/* 메시지 리스트 */}
                    <AnimatePresence>
                        {messages.map((msg, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2 group relative`}
                            >
                                {msg.role === 'user' && (
                                    <div className="flex flex-col items-end">
                                        {msg.isEdited && <span className="text-[9px] text-gray-400 mb-0.5">수정됨</span>}
                                        <span className="text-[10px] text-gray-400 mb-1">{msg.time}</span>
                                    </div>
                                )}

                                {msg.role === 'bot' && (
                                    <div className="w-10 h-10 bg-white rounded-xl flex-shrink-0 shadow-sm border border-gray-100 overflow-hidden">
                                        <img src={neogulImg} alt="너굴" className="w-full h-full object-cover" />
                                    </div>
                                )}

                                <div className="relative flex flex-col items-end group">
                                    <div className={`p-4 rounded-[20px] max-w-[280px] text-[15px] font-medium shadow-sm transition-all ${
                                        msg.role === 'user' ? 'bg-[#70E092] text-white' : 'bg-white text-gray-700 border border-gray-50'
                                    }`}>
                                        {editingId === index ? (
                                            <div className="flex flex-col gap-3 min-w-[220px]">
                                                <textarea
                                                    value={editInputText}
                                                    onChange={(e) => setEditInputText(e.target.value)}
                                                    className="bg-black/10 text-white outline-none p-2 rounded-lg w-full resize-none"
                                                    rows={3}
                                                    autoFocus
                                                />
                                                <div className="flex justify-end gap-3">
                                                    <button onClick={() => setEditingId(null)} className="text-[12px] text-white/70 hover:text-white">취소</button>
                                                    <button onClick={() => handleUpdateMessage(index)} className="bg-white text-[#70E092] px-3 py-1 rounded-full text-[12px] font-bold">보내기</button>
                                                </div>
                                            </div>
                                        ) : (
                                            msg.text
                                        )}
                                    </div>

                                    {msg.role === 'user' && editingId !== index && (
                                        <div className="absolute top-full right-0 pt-2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <div className="flex items-center gap-0.5 bg-white border border-gray-100 p-1 rounded-full shadow-md">

                                                {/* 1. 복사 버튼 영역 */}
                                                <div className="relative group/copy">
                                                    <button
                                                        onClick={() => handleCopy(msg.text)}
                                                        className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-[#70E092]"
                                                    >
                                                        <Copy size={14} />
                                                    </button>

                                                    {/* 복사 툴팁 */}
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3.5 px-3 py-1.5 bg-black text-white text-[12px] rounded-lg whitespace-nowrap opacity-0 group-hover/copy:opacity-100 transition-all duration-200 pointer-events-none z-20">
                                                        복사
                                                    </div>
                                                </div>

                                                <div className="w-[1px] h-3 bg-gray-100 mx-0.5" />

                                                {/* 2. 수정 버튼 영역 */}
                                                <div className="relative group/edit">
                                                    <button
                                                        onClick={() => startEdit(index, msg.text)}
                                                        className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-[#70E092]"
                                                    >
                                                        <Edit3 size={14} />
                                                    </button>

                                                    {/* 편집 툴팁 */}
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3.5 px-3 py-1.5 bg-black text-white text-[12px] rounded-lg whitespace-nowrap opacity-0 group-hover/edit:opacity-100 transition-all duration-200 pointer-events-none z-20">
                                                        메시지 편집
                                                        </div>
                                                </div>

                                            </div>
                                        </div>
                                    )}
                                </div>

                                {msg.role === 'bot' && <span className="text-[10px] text-gray-400 mb-1">{msg.time}</span>}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* 하단 입력 영역 */}
                <div className="p-6 bg-white border-t border-gray-100 pb-10">
                    <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
                        <div className="relative">
                            <input type="date" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => setSelectedDate(e.target.value)} />
                            <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-full text-[12px] font-bold text-gray-600 bg-white min-w-max">
                                <Calendar size={12} className="text-[#70E092]" /> {selectedDate || "날짜 선택"} <ChevronDown size={12} />
                            </button>
                        </div>
                        <div className="relative">
                            <select className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => setSelectedRegion(e.target.value)} value={selectedRegion}>
                                {regions.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                            <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-full text-[12px] font-bold text-gray-600 bg-white min-w-max">
                                <MapPin size={12} className="text-[#70E092]" /> {selectedRegion} <ChevronDown size={12} />
                            </button>
                        </div>
                        <div className="relative">
                            <select className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => setSelectedLevel(e.target.value)} value={selectedLevel}>
                                <option disabled value="난이도">난이도</option>
                                {levels.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                            <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-full text-[12px] font-bold text-gray-600 bg-white min-w-max">
                                <Gauge size={12} className="text-[#70E092]" /> {selectedLevel} <ChevronDown size={12} />
                            </button>
                        </div>
                    </div>

                    <div className="relative flex items-end gap-3 bg-gray-50 rounded-[28px] p-3 border border-gray-100 focus-within:border-[#70E092] transition-all">
                        <button className="p-2 mb-1 text-gray-400"><Plus size={22} /></button>
                        <div className="flex-1 flex flex-col mb-1">
                            <label className="text-[9px] text-gray-400 font-black uppercase tracking-widest ml-1 mb-0.5">무엇을 도와 드릴까요?</label>
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="너굴 AI에게 질문하기..."
                                className="w-full bg-transparent outline-none text-[15px] text-gray-700 font-medium"
                            />
                        </div>
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputText.trim()}
                            className={`p-3 rounded-full shadow-md transition-all ${inputText.trim() ? 'bg-[#70E092]' : 'bg-gray-300'}`}
                        >
                            <Send size={18} className="text-white fill-white ml-0.5" />
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    };

    export default ChatBot;