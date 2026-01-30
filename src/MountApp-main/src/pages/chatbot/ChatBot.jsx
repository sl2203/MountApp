import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Calendar, Plus, ChevronDown, MapPin, Gauge, Copy, Edit3, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import neogulImg from "../../assets/neogulGuide.jpeg";



const ChatBot = ({ onClose }) => {
    const regions = ["전국", "서울", "경기", "강원", "충청", "경상", "전라", "제주"];
    const levels = ["초보자", "중급자", "상급자"];
    // --- 상태 관리 ---
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedRegion, setSelectedRegion] = useState("지역");
    const [selectedLevel, setSelectedLevel] = useState("난이도");

    const [inputText, setInputText] = useState("");
    const [messages, setMessages] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editInputText, setEditInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const scrollRef = useRef(null);

    // --- 상수: 시스템 프롬프트 (사용자에게는 안 보임) ---
    const SYSTEM_PROMPT = " (지정한 날짜와 지역 정보를 토대로 추천 산행 정보를 300자 이내로 설명해 줘.)";

    const getCurrentTime = () => {
        const now = new Date();
        return now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages, isLoading]);

    // 텍스트 조합 (날짜/지역/난이도 필터 + 입력 텍스트)
    const getCombinedText = (pureText) => {
        const datePart = selectedDate ? `${parseInt(selectedDate.split('-')[1])}월 ${parseInt(selectedDate.split('-')[2])}일 ` : "";
        const regionPart = (selectedRegion !== "지역" && selectedRegion !== "전국") ? `${selectedRegion} 지역의 ` : "";
        const levelPart = selectedLevel !== "난이도" ? `${selectedLevel} 난이도 ` : "";
        return `${datePart}${regionPart}${levelPart}${pureText}`;
    };

    // ✅ 기능 1: 메시지 전송
    const handleSendMessage = async () => {
        if (!inputText.trim() || isLoading) return;

        const combinedText = getCombinedText(inputText);

        // 화면 표시용 (사용자 입력 그대로)
        const userMsg = {
            role: 'user',
            text: combinedText,
            time: getCurrentTime(),
            isEdited: false
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText("");
        setIsLoading(true);

        try {
            // API 전송용
            const promptToSend = combinedText + SYSTEM_PROMPT;

            const response = await fetch('http://localhost:8082/api/gemini/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: promptToSend }),
            });

            if (!response.ok) throw new Error('Network error');
            const data = await response.json();

            const aiMsg = {
                role: 'bot',
                text: data.result,
                time: getCurrentTime()
            };
            setMessages(prev => [...prev, aiMsg]);

        } catch (error) {
            console.error(error);
            const errorMsg = { role: 'bot', text: "오류가 발생했습니다. 다시 시도해주세요.", time: getCurrentTime() };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    // 수정 모드 진입
    const startEdit = (index, fullText) => {
        setEditingId(index);
        setEditInputText(fullText);
    };

    // ✅ 기능 2: 메시지 수정 시 재요청 (핵심 로직 변경)
    const handleUpdateMessage = async (index) => {
        if (!editInputText.trim()) return;

        // 1. UI 먼저 업데이트 (사용자 메시지 수정됨 표시)
        setMessages(prev => {
            const newMsgs = [...prev];
            newMsgs[index] = { ...newMsgs[index], text: editInputText, isEdited: true };

            // 바로 다음 메시지가 봇이라면 "수정 중..." 표시로 변경
            if (newMsgs[index + 1] && newMsgs[index + 1].role === 'bot') {
                newMsgs[index + 1].text = "답변을 새로 고치고 있어요... 🔄";
            }
            return newMsgs;
        });

        setEditingId(null);
        setIsLoading(true); // 로딩 시작

        try {
            const promptToSend = editInputText + SYSTEM_PROMPT;

            const response = await fetch('http://localhost:8082/api/gemini/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: promptToSend }),
            });

            if (!response.ok) throw new Error('Network error');
            const data = await response.json();

            // 3. 기존 답변 메시지를 새로운 답변으로 교체
            setMessages(prev => {
                const newMsgs = [...prev];
                // 사용자가 수정한 메시지의 다음 메시지가 봇의 답변인지 확인
                const botMsgIndex = index + 1;

                if (newMsgs[botMsgIndex] && newMsgs[botMsgIndex].role === 'bot') {
                    newMsgs[botMsgIndex] = {
                        ...newMsgs[botMsgIndex],
                        text: data.result, // 새로운 답변 적용
                        time: getCurrentTime()
                    };
                } else {
                    // 혹시 봇 메시지가 없으면 새로 추가 (예외 처리)
                    newMsgs.push({ role: 'bot', text: data.result, time: getCurrentTime() });
                }
                return newMsgs;
            });

        } catch (error) {
            console.error(error);
            // 에러 시 봇 메시지에 에러 표시
            setMessages(prev => {
                const newMsgs = [...prev];
                if (newMsgs[index + 1]) newMsgs[index + 1].text = "수정된 답변을 가져오지 못했어요.";
                return newMsgs;
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = (text) => navigator.clipboard.writeText(text);

    return (
        <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full h-[800px] rounded-[20px] bg-[#F8F9F8] flex flex-col relative shadow-2xl overflow-hidden font-sans"
        >
            {/* 헤더 */}
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
                {/* 소개글 */}
                <div className="flex gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex-shrink-0 shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden">
                        <img src={neogulImg} alt="너굴" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-50 max-w-[85%]">
                        <h2 className="text-lg font-bold text-gray-900 leading-tight">
                            안녕하세요! <span className="text-[#58b36e]">'너굴 AI'</span> 입니다.
                        </h2>
                        <p className="mt-2 text-gray-500 text-sm font-medium leading-relaxed">
                            산행 정보를 핵심만 콕 집어서 알려드릴게요!
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
                                <div className={`p-4 rounded-[20px] max-w-[280px] text-[15px] font-medium shadow-sm transition-all whitespace-pre-wrap ${
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
                                                <button onClick={() => handleUpdateMessage(index)} className="bg-white text-[#70E092] px-3 py-1 rounded-full text-[12px] font-bold">수정완료</button>
                                            </div>
                                        </div>
                                    ) : (
                                        msg.text
                                    )}
                                </div>

                                {/* 툴팁 영역 */}
                                {msg.role === 'user' && editingId !== index && (
                                    <div className="absolute top-full right-0 pt-2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <div className="flex items-center gap-0.5 bg-white border border-gray-100 p-1 rounded-full shadow-md">
                                            <button onClick={() => handleCopy(msg.text)} className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-[#70E092]"><Copy size={14} /></button>
                                            <div className="w-[1px] h-3 bg-gray-100 mx-0.5" />
                                            <button onClick={() => startEdit(index, msg.text)} className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-[#70E092]"><Edit3 size={14} /></button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {msg.role === 'bot' && <span className="text-[10px] text-gray-400 mb-1">{msg.time}</span>}
                        </motion.div>
                    ))}

                    {/* 로딩 표시 */}
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-start items-end gap-2"
                        >
                            <div className="w-10 h-10 bg-white rounded-xl flex-shrink-0 shadow-sm border border-gray-100 overflow-hidden">
                                <img src={neogulImg} alt="너굴" className="w-full h-full object-cover" />
                            </div>
                            <div className="bg-white p-4 rounded-[20px] rounded-tl-none shadow-sm border border-gray-50 flex items-center gap-3">
                                <Loader2 className="animate-spin text-[#70E092]" size={18} />
                                <span className="text-gray-400 text-sm font-medium animate-pulse">
                                    {editingId === null && messages.length > 0 && messages[messages.length - 1].role === 'user'
                                        ? "답변을 작성하고 있어요..."
                                        : "답변을 수정하고 있어요..."}
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 입력창 (기존 코드 유지) */}
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

                <div className={`relative flex items-end gap-3 bg-gray-50 rounded-[28px] p-3 border transition-all ${isLoading ? 'opacity-70 cursor-not-allowed border-gray-100' : 'border-gray-100 focus-within:border-[#70E092]'}`}>
                    <button className="p-2 mb-1 text-gray-400" disabled={isLoading}><Plus size={22} /></button>
                    <div className="flex-1 flex flex-col mb-1">
                        <label className="text-[9px] text-gray-400 font-black uppercase tracking-widest ml-1 mb-0.5">무엇을 도와 드릴까요?</label>
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                            placeholder={isLoading ? "답변을 작성중입니다..." : "너굴 AI에게 질문하기..."}
                            className="w-full bg-transparent outline-none text-[15px] text-gray-700 font-medium disabled:text-gray-400"
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputText.trim() || isLoading}
                        className={`p-3 rounded-full shadow-md transition-all ${inputText.trim() && !isLoading ? 'bg-[#70E092]' : 'bg-gray-300'}`}
                    >
                        {isLoading ? <Loader2 size={18} className="animate-spin text-white" /> : <Send size={18} className="text-white fill-white ml-0.5" />}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ChatBot;