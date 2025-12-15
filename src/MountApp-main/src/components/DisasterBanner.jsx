import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, AlertTriangle } from "lucide-react";

// 재난 타입에 따른 아이콘과 색상 설정
const getAlertStyle = (type) => {
    switch (type) {
        case "FIRE": // 산불
            return {
                bg: "bg-red-50",
                border: "border-red-200",
                text: "text-red-700",
                icon: <Flame className="w-5 h-5 text-red-600 animate-pulse" />,
                label: "산불주의",
            };
        case "LANDSLIDE": // 산사태
            return {
                bg: "bg-orange-50",
                border: "border-orange-200",
                text: "text-orange-800",
                icon: <AlertTriangle className="w-5 h-5 text-orange-600" />,
                label: "산사태",
            };
        default:
            return {
                bg: "bg-gray-50",
                border: "border-gray-200",
                text: "text-gray-700",
                icon: <AlertTriangle className="w-5 h-5" />,
                label: "알림",
            };
    }
};

export default function DisasterBanner({ alerts = [] }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (alerts.length <= 1) return;
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % alerts.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [alerts.length]);

    if (!alerts || alerts.length === 0) return null;

    const currentAlert = alerts[index];
    const style = getAlertStyle(currentAlert.type);

    return (
        <div className={`w-full px-4 py-3 mb-2 rounded-lg border flex items-start shadow-sm transition-colors duration-300 ${style.bg} ${style.border}`}>
            <div className="mr-3 mt-0.5 shrink-0">{style.icon}</div>
            <div className="flex-1 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                    >
            <span className={`inline-block font-bold mr-2 text-xs px-1.5 py-0.5 rounded border border-current whitespace-nowrap align-middle ${style.text}`}>
              {style.label}
            </span>
                        <span className={`text-sm font-medium whitespace-normal break-words leading-snug align-middle ${style.text}`}>
              {currentAlert.message}
                            <span className="text-xs opacity-70 ml-1 whitespace-nowrap">
                ({currentAlert.time})
              </span>
            </span>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
