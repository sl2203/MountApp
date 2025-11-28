import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function Map() {
  const mapRef = useRef(null);

  useEffect(() => {
    const loadKakaoMap = () => {
      if (!window.kakao || !mapRef.current) return;

      window.kakao.maps.load(() => {
        const options = {
          center: new window.kakao.maps.LatLng(36.5, 127.5),
          level: 7,
        };
        new window.kakao.maps.Map(mapRef.current, options);
      });
    };

    if (window.kakao && window.kakao.maps) {
      loadKakaoMap();
    } else {
      const script = document.createElement("script");
      script.src =
        "https://dapi.kakao.com/v2/maps/sdk.js?appkey=663f3771ba6c6a72fab06353a11a1c23&autoload=false&libraries=services";
      script.async = true;
      script.onload = loadKakaoMap;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <motion.section className="p-4">
      <motion.header className="flex flex-col items-center py-3">
        <h2 className="text-2xl font-bold">지도</h2>
      </motion.header>

      <motion.section
        ref={mapRef}
        className="bg-gray-200 rounded-lg w-full"
        style={{ width: "100%", height: "700px" }}
      />
    </motion.section>
  );
}
