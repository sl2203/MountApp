import { useEffect, useRef, useState } from "react";
import { guides } from "../../data/guidesData";
import { useNavigate } from "react-router-dom";

export default function Map() {
    const mapRef = useRef(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const apiKey = import.meta.env.VITE_KAKAO_MAP_KEY;
        const scriptId = "kakao-map-script";
        const existingScript = document.getElementById(scriptId);

        if (existingScript) {
            if (window.kakao) initMap();
            return;
        }

        const script = document.createElement("script");
        script.id = scriptId;
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
        script.onload = () => window.kakao.maps.load(initMap);
        document.head.appendChild(script);
    }, []);

    const initMap = () => {
        if (!mapRef.current) return;

        const map = new window.kakao.maps.Map(mapRef.current, {
            center: new window.kakao.maps.LatLng(36.5, 127.8),
            level: 12,
            mapTypeId: window.kakao.maps.MapTypeId.ROADMAP,
        });

        // 지도 컨트롤 추가
        map.addControl(new window.kakao.maps.ZoomControl(), window.kakao.maps.ControlPosition.RIGHT);
        map.addControl(new window.kakao.maps.MapTypeControl(), window.kakao.maps.ControlPosition.TOPRIGHT);

        setIsMapLoaded(true);

        guides.forEach((mountain) => {
            const { name, lat, lon, image, difficulty, height } = mountain;

            // 마커 생성 (기존 크기 유지)
            const markerImage = new window.kakao.maps.MarkerImage(
                "https://cdn-icons-png.flaticon.com/512/684/684908.png",
                new window.kakao.maps.Size(35, 35),
                { offset: new window.kakao.maps.Point(17, 35) }
            );

            const marker = new window.kakao.maps.Marker({
                map,
                position: new window.kakao.maps.LatLng(lat, lon),
                image: markerImage,
                title: name,
            });

            // 항상 보이는 산 제목 오버레이
            const titleOverlay = new window.kakao.maps.CustomOverlay({
                map,
                position: new window.kakao.maps.LatLng(lat, lon),
                content: `<div style="
          background: rgba(255,255,255,0.9);
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          white-space: nowrap;
          transform: translateY(-40px);
        ">${name}</div>`,
                yAnchor: 1,
                zIndex: 2,
            });

            // 이미지/세부 정보 오버레이
            const detailOverlayContent = `
        <div style="
          width:180px;
          background:white;
          border-radius:12px;
          box-shadow:0 4px 12px rgba(0,0,0,0.25);
          overflow:hidden;
          font-family:sans-serif;
          cursor:pointer;
        ">
          <div style="width:100%; height:100px; overflow:hidden;">
            <img src="${image[0]}" style="width:100%; height:100%; object-fit:cover;" />
          </div>
          <div style="padding:8px;">
            <div style="font-weight:700; font-size:14px; margin-bottom:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              ${name}
            </div>
            <div style="font-size:12px; color:gray;">
              최고 고도: ${height}m<br/>
              난이도: ${difficulty}
            </div>
          </div>
        </div>
      `;

            const detailOverlayDiv = document.createElement("div");
            detailOverlayDiv.innerHTML = detailOverlayContent;
            detailOverlayDiv.style.display = "none";

            const detailOverlay = new window.kakao.maps.CustomOverlay({
                position: new window.kakao.maps.LatLng(lat, lon),
                content: detailOverlayDiv,
                yAnchor: 1,
                zIndex: 3,
                clickable: true,
            });

            detailOverlay.setMap(map);

            // 🔹 호버 이벤트 (마커 + 오버레이)
            const showOverlay = () => (detailOverlayDiv.style.display = "block");
            const hideOverlay = () => (detailOverlayDiv.style.display = "none");

            // 마커 이벤트
            window.kakao.maps.event.addListener(marker, "mouseover", showOverlay);
            window.kakao.maps.event.addListener(marker, "mouseout", () => {
                setTimeout(() => {
                    if (!detailOverlayDiv.matches(":hover")) hideOverlay();
                }, 50);
            });

            // 오버레이 이벤트
            detailOverlayDiv.addEventListener("mouseover", showOverlay);
            detailOverlayDiv.addEventListener("mouseout", hideOverlay);

            // 클릭 시 상세 페이지 이동
            window.kakao.maps.event.addListener(marker, "click", () => {
                navigate(`/mountain/${mountain.id}`);
            });
        });
    };

    return (
        <div className="w-full h-screen">
            <div
                ref={mapRef}
                className="w-full h-full z-0 rounded-xl overflow-hidden shadow-lg"
            />
        </div>
    );
}
