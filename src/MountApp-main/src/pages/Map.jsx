import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function Map() {
  const mapRef = useRef(null);

  useEffect(() => {
    const loadKakaoMap = () => {
      if (!window.kakao || !mapRef.current) return;

      const options = {
        center: new window.kakao.maps.LatLng(36.5, 127.5), // 지도 중심 좌표
        level: 7, // 지도 확대 레벨
      };

      new window.kakao.maps.Map(mapRef.current, options);
    };

    // SDK가 이미 로드되어 있으면 바로 지도 생성
    if (window.kakao) {
      loadKakaoMap();
    } else {
      // SDK 스크립트 동적 로드
      const script = document.createElement("script");
      script.src =
        "//dapi.kakao.com/v2/maps/sdk.js?appkey=663f3771ba6c6a72fab06353a11a1c23";
      script.async = true;
      script.onload = loadKakaoMap;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <motion.section className="p-4">
      <motion.header className="flex flex-col items-center py-3">
        <h2 className="text-2xl font-bold">재난 지도</h2>
      </motion.header>

      <motion.section
        ref={mapRef}
        className="bg-gray-200 rounded-lg w-full"
        style={{ width: "100%", height: "700px" }}
      >
        {/* 지도 표시 영역 */}
      </motion.section>
    </motion.section>
  );
}
