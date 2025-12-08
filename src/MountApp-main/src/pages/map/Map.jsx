import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function Map() {
    const mapRef = useRef(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    useEffect(() => {
        const apiKey = import.meta.env.VITE_KAKAO_MAP_KEY;
        const scriptId = "kakao-map-script";
        const existingScript = document.getElementById(scriptId);

        const initMap = () => {
            if (!window.kakao || !window.kakao.maps) return;

            window.kakao.maps.load(() => {
                if (!mapRef.current) return;

                const map = new window.kakao.maps.Map(mapRef.current, {
                    center: new window.kakao.maps.LatLng(36.5, 127.5),
                    level: 12,
                });

                setIsMapLoaded(true);

                // ➕ 한국 유명 산 리스트
                const mountains = [
                    { name: "한라산", lat: 33.3617, lng: 126.5292 },
                    { name: "설악산", lat: 38.1194, lng: 128.4656 },
                    { name: "북한산", lat: 37.6583, lng: 126.9770 },
                    { name: "계양산", lat: 37.5436, lng: 126.7363 },

                    // 신규 추가
                    { name: "지리산", lat: 35.3541, lng: 127.7300 },
                    { name: "덕유산", lat: 35.8686, lng: 127.7754 },
                    { name: "태백산", lat: 37.0937, lng: 128.9895 },
                    { name: "속리산", lat: 36.4895, lng: 127.8290 },
                    { name: "오대산", lat: 37.7940, lng: 128.5920 },
                    { name: "주왕산", lat: 36.3507, lng: 129.1724 },
                    { name: "가야산", lat: 35.8022, lng: 128.1108 },
                    { name: "치악산", lat: 37.4232, lng: 128.0374 },
                    { name: "월악산", lat: 36.8493, lng: 128.0755 },
                    { name: "무등산", lat: 35.1462, lng: 126.9990 },
                    { name: "팔공산", lat: 35.9935, lng: 128.6814 },
                    { name: "신불산(영남알프스)", lat: 35.5651, lng: 129.0380 },
                ];

                mountains.forEach((mountain) => {
                    const marker = new window.kakao.maps.Marker({
                        position: new window.kakao.maps.LatLng(
                            mountain.lat,
                            mountain.lng
                        ),
                        map,
                    });

                    const infoWindow = new window.kakao.maps.InfoWindow({
                        content: `
                            <div style="padding:8px;font-size:14px;">
                                <strong>${mountain.name}</strong>
                            </div>
                        `,
                    });

                    window.kakao.maps.event.addListener(marker, "click", () => {
                        infoWindow.open(map, marker);
                    });
                });
            });
        };

        if (!existingScript) {
            const script = document.createElement("script");
            script.id = scriptId;
            script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false&libraries=services`;
            script.async = true;
            script.onload = () => initMap();
            document.head.appendChild(script);
        } else {
            existingScript.onload = () => initMap();
        }
    }, []);

    return (
        <motion.section className="h-screen">
            <motion.header className="flex flex-col items-center px-5 py-4">
                <h2 className="text-2xl font-bold">지도</h2>
            </motion.header>

            <motion.section
                ref={mapRef}
                className="bg-gray-200 rounded-lg w-full relative z-0"
                style={{ width: "100%", height: "700px" }}
            >
                {!isMapLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                        지도를 불러오는 중입니다...
                    </div>
                )}
            </motion.section>
        </motion.section>
    );
}
