    import React, { useState, useEffect, useRef } from "react";
    import { motion } from "framer-motion";
    import BackButton from "../../layouts/BackButton";
    import { useNavigate } from "react-router-dom";
    import { ChevronDown, Camera } from "lucide-react";
    import axios from "axios";

    export default function ProfileChange() {
        const navigate = useNavigate();

        // 상태 관리
        const [loading, setLoading] = useState(true);
        const [name, setName] = useState("");
        const [birth, setBirth] = useState("");
        const [gender, setGender] = useState("");
        const [phone, setPhone] = useState("");
        const [emailId, setEmailId] = useState("");
        const [emailDomain, setEmailDomain] = useState("");

        // 이미지 관련 상태
        const [previewImage, setPreviewImage] = useState(null);
        const [imageFile, setImageFile] = useState(null);
        const fileInputRef = useRef(null);

        // 1. 초기 데이터 로드
        useEffect(() => {
            const fetchUserData = async () => {
                const token = localStorage.getItem("jwtToken");
                if (!token) {
                    alert("로그인이 필요합니다.");
                    navigate("/login");
                    return;
                }

                try {
                    const res = await axios.get("/api/auth/me", {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    const user = res.data;
                    setName(user.name || "");
                    setBirth(user.birthdate || "");
                    setGender(user.gender || "");
                    setPhone(user.phone || "");

                    // 이메일 분리
                    if (user.email && user.email.includes("@")) {
                        const [id, domain] = user.email.split("@");
                        setEmailId(id);
                        setEmailDomain(domain);
                    }

                    // --- 이미지 경로 처리 (중요) ---
                    if (user.profileImage) {
                        // http로 시작하면 그대로 쓰고, 아니면 백엔드 주소(예: localhost:8080)를 붙임
                        if (user.profileImage.startsWith("http")) {
                            setPreviewImage(user.profileImage);
                        } else {
                            // 백엔드 포트가 8080이라고 가정할 때의 예시입니다. 본인 환경에 맞게 수정하세요.
                            // 혹은 package.json의 proxy 설정이 되어 있다면 슬래시(/) 처리만 확인하세요.
                            setPreviewImage(`http://localhost:8082${user.profileImage}`);
                        }
                    }

                    setLoading(false);
                } catch (err) {
                    console.error("정보 로드 실패", err);
                    alert("회원 정보를 불러오지 못했습니다.");
                    navigate(-1);
                }
            };
            fetchUserData();
        }, [navigate]);

        // 2. 이미지 선택 시 미리보기 처리
        const handleImageChange = (e) => {
            const file = e.target.files[0];
            if (file) {
                setImageFile(file); // 전송할 파일 상태 저장
                setPreviewImage(URL.createObjectURL(file)); // 화면 표시용 Blob URL 생성
            }
        };

        // 3. 저장 버튼 클릭 시 전송
        const handleConfirm = async () => {
            const token = localStorage.getItem("jwtToken");
            const fullEmail = emailId && emailDomain ? `${emailId}@${emailDomain}` : "";

            // 1) 텍스트 데이터 (JSON)
            const userData = {
                name,
                birthdate: birth,
                gender,
                phone,
                email: fullEmail,
            };

            // 2) FormData 생성
            const formData = new FormData();

            // JSON 데이터를 Blob으로 변환하여 'data' 키에 추가 (application/json 타입 명시 필수)
            formData.append(
                "data",
                new Blob([JSON.stringify(userData)], { type: "application/json" })
            );

            // 파일이 선택된 경우에만 'file' 키에 추가
            if (imageFile) {
                formData.append("file", imageFile);
            }

            try {
                await axios.put("/api/auth/me", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                alert("회원 정보가 수정되었습니다.");
                navigate(-1);
            } catch (err) {
                console.error("수정 실패:", err);
                alert("정보 수정 중 오류가 발생했습니다.");
            }
        };

        const inputClass = "w-full px-4 py-3.5 rounded-xl border border-gray-300 text-gray-900 focus:outline-none focus:border-gray-500 placeholder-gray-400";

        if (loading) return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;

        return (
            <motion.div
                className="flex flex-col h-screen bg-white absolute inset-0 z-20"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <header className="flex items-center h-14 px-4 bg-white sticky top-0 z-10 border-b border-gray-100 justify-center">
                    <BackButton onClick={() => navigate(-1)} />
                    <h1 className="text-lg font-bold text-gray-900 ml-2 ">내 정보 변경</h1>
                </header>

                <div className="flex-1 overflow-y-auto px-5 pt-6 pb-32 space-y-6">

                    {/* 프로필 이미지 UI */}
                    <div className="flex justify-center mb-4">
                        <div className="relative group">
                            <div
                                className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border border-gray-300 cursor-pointer flex items-center justify-center"
                                onClick={() => fileInputRef.current.click()}
                            >
                                {previewImage ? (
                                    <img
                                        src={previewImage}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                        onError={() => setPreviewImage(null)}
                                    />
                                ) : (
                                    <span className="text-4xl">👤</span>
                                )}
                            </div>

                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="absolute bottom-0 right-0 p-2 bg-gray-900 rounded-full text-white border-2 border-white shadow-md hover:bg-gray-700 transition"
                            >
                                <Camera size={16} />
                            </button>

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                    </div>

                    {/* 이름 입력 */}
                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">
                            이름 <span className="text-orange-500">*</span>
                        </label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                    </div>

                    {/* 생년월일 */}
                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">생년월일</label>
                        <input type="date" value={birth} onChange={(e) => setBirth(e.target.value)} className={inputClass} />
                    </div>

                    {/* 성별 선택 */}
                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">성별</label>
                        <div className="flex gap-3">
                            {[
                                { label: "남성", value: "MALE" },
                                { label: "여성", value: "FEMALE" }
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    type="button" // form 내부라면 submit 방지용
                                    onClick={() => setGender(option.value)} // 클릭 시 MALE 또는 FEMALE 저장
                                    className={`flex-1 py-3.5 rounded-full border text-sm font-medium transition-colors ${
                                        gender === option.value // 현재 state(MALE/FEMALE)와 비교
                                            ? "bg-blue-100 border-blue-700 text-blue-700"
                                            : "bg-white border-gray-300 text-gray-400 hover:bg-gray-50"
                                    }`}
                                >
                                    {option.label} {/* 화면엔 '남성', '여성' 출력 */}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 전화번호 */}
                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">전화번호</label>
                        <div className="flex gap-2">
                            <div className="flex items-center px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200">
                                <span className="text-gray-500">+82</span>
                            </div>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="flex-1 px-4 py-3.5 rounded-xl border border-gray-300 text-gray-900 focus:outline-none focus:border-gray-500 placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* 이메일 */}
                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">이메일 주소</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={emailId}
                                onChange={(e) => setEmailId(e.target.value)}
                                className={`flex-1 ${inputClass}`}
                            />
                            <div className="relative w-[45%]">
                                <select
                                    value={emailDomain}
                                    onChange={(e) => setEmailDomain(e.target.value)}
                                    className={`w-full appearance-none ${inputClass} pr-8 truncate`}
                                >
                                    <option value="">선택</option>
                                    <option value="naver.com">naver.com</option>
                                    <option value="gmail.com">gmail.com</option>
                                    <option value="daum.net">daum.net</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                </div>

                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 max-w-md mx-auto w-full z-30">
                    <button
                        onClick={handleConfirm}
                        className="w-full py-4 bg-[#0F172A] text-white font-bold rounded-xl active:scale-[0.98] transition-transform shadow-lg shadow-gray-200 text-base"
                    >
                        확인
                    </button>
                </div>
            </motion.div>
        );
    }