import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function Map() {
    const mapRef = useRef(null);
    // 지도가 로드되었는지 상태 관리 (깜빡임 방지용)
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    useEffect(() => {
        const apiKey = import.meta.env.VITE_KAKAO_MAP_KEY;



        const scriptId = "kakao-map-script";
        const existingScript = document.getElementById(scriptId);

        // 지도 그리기 함수
        const initMap = () => {
            if (!window.kakao || !window.kakao.maps) {
                console.error("Kakao 객체를 찾을 수 없습니다.");
                return;
            }

            window.kakao.maps.load(() => {
                if (!mapRef.current) return;

                const options = {
                    center: new window.kakao.maps.LatLng(36.5, 127.5),
                    level: 7,
                };
                new window.kakao.maps.Map(mapRef.current, options);
                setIsMapLoaded(true); // 로딩 완료
            });
        };

        // 2. 스크립트 로드 로직
        if (!existingScript) {
            // 스크립트가 없으면 새로 생성
            const script = document.createElement("script");
            script.id = scriptId;
            script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false&libraries=services`;
            script.async = true;

            document.head.appendChild(script);
        } else {
            // 스크립트가 이미 존재하면 (페이지 이동 후 돌아왔을 때 등)
            if (window.kakao && window.kakao.maps) {
                initMap();
            } else {
                // 스크립트 태그는 있는데 아직 로딩 중인 희귀한 케이스 처리
                existingScript.onload = () => initMap();
            }
        }
    }, []);

    return (
        <motion.section className="p-4">
            <motion.header className="flex flex-col items-center py-3">
                <h2 className="text-2xl font-bold">지도</h2>
            </motion.header>

            <motion.section
                ref={mapRef}
                className="bg-gray-200 rounded-lg w-full relative"
                style={{ width: "100%", height: "700px" }}
            >
                {/* 지도가 뜨기 전 로딩 메시지 */}
                {!isMapLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                        지도를 불러오는 중입니다...
                    </div>
                )}
            </motion.section>
        </motion.section>
    );
}