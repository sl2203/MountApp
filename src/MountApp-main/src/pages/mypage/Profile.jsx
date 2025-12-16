    import React, { useState, useEffect, useRef } from 'react';
    import { motion } from 'framer-motion';
    import { Camera, User, CheckCircle, XCircle, Loader2, ChevronRight } from 'lucide-react';
    import BackButton from "../../layouts/BackButton";
    import { useNavigate } from "react-router-dom";
    import axios from 'axios';

    // 닉네임 중복 확인 API (실제 백엔드 API가 있다면 교체, 현재는 모의 함수)
    async function checkNicknameAPI(nickname) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const takenNames = ["admin", "test", "manager"];
                resolve(!takenNames.includes(nickname.toLowerCase()));
            }, 600);
        });
    }

    export default function Profile() {
        const navigate = useNavigate();
        const fileRef = useRef(null);

        // --- 상태 관리 ---
        const [loading, setLoading] = useState(true);
        const [user, setUser] = useState(null); // 전체 유저 정보

        // 수정 가능한 필드
        const [nickname, setNickname] = useState("");

        // 이미지 관련 상태
        const [avatarFile, setAvatarFile] = useState(null); // 업로드할 파일 객체
        const [avatarPreview, setAvatarPreview] = useState(null); // 화면 표시용 URL
        const [imgError, setImgError] = useState(false); // 이미지 에러 상태

        // 닉네임 검사 상태
        const [checking, setChecking] = useState(false);
        const [checkResult, setCheckResult] = useState(null); // null: 미확인, true: 사용가능, false: 중복

        // [중요] 백엔드 서버 주소 (환경에 맞게 수정: 예: 8080)
        const BACKEND_URL = "http://localhost:8082";

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

                    const userData = res.data;
                    setUser(userData);
                    setNickname(userData.nickname || "");

                    // 기존 프로필 이미지가 있다면 세팅
                    if (userData.profileImage) {
                        setAvatarPreview(getProfileImageUrl(userData.profileImage));
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

        // 이미지 경로 가공 함수
        const getProfileImageUrl = (path) => {
            if (!path) return null;
            if (path.startsWith("blob:")) return path; // 로컬 미리보기용
            if (path.startsWith("http")) return path;  // 소셜 로그인 등 완전한 URL
            return `${BACKEND_URL}${path}`;            // 백엔드 경로
        };

        // 2. 파일 선택 핸들러 (미리보기 생성)
        const handleFileChange = (e) => {
            const file = e.target.files?.[0];
            if (file) {
                setAvatarFile(file);
                // 미리보기용 Blob URL 생성
                const previewUrl = URL.createObjectURL(file);
                setAvatarPreview(previewUrl);
                setImgError(false); // 새 이미지를 올렸으므로 에러 상태 초기화
            }
        };

        // 3. 닉네임 변경 감지
        const handleNicknameChange = (e) => {
            setNickname(e.target.value);
            setCheckResult(null); // 내용이 바뀌면 다시 중복확인 필요
        };

        // 4. 닉네임 중복 확인
        const handleCheckNickname = async () => {
            if (!nickname.trim()) {
                alert("활동명을 입력하세요.");
                return;
            }
            setChecking(true);
            // 실제 API 연동 시: await axios.get(`/api/check-nickname?nickname=${nickname}`)
            const result = await checkNicknameAPI(nickname.trim());
            setChecking(false);
            setCheckResult(result);
        };

        // 5. 저장 버튼 (서버 전송)
        const handleConfirm = async () => {
            if (!nickname.trim()) {
                alert("활동명을 입력해 주세요.");
                return;
            }
            // 닉네임이 변경되었는데 중복확인을 안 했다면 (기존 닉네임과 다를 경우)
            if (user && nickname !== user.nickname && checkResult !== true) {
                alert("활동명 중복 확인이 필요합니다.");
                return;
            }

            const token = localStorage.getItem("jwtToken");
            const formData = new FormData();

            // 텍스트 데이터 (JSON)
            const updateData = { nickname: nickname.trim() };
            formData.append("data", new Blob([JSON.stringify(updateData)], { type: "application/json" }));

            // 이미지 파일 (있을 경우만)
            if (avatarFile) {
                formData.append("file", avatarFile);
            }

            try {
                await axios.put("/api/auth/me", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        // axios가 자동으로 Content-Type: multipart/form-data 설정함
                    },
                });
                alert("프로필이 수정되었습니다.");
                navigate("/mypage");
            } catch (err) {
                console.error("수정 실패:", err);
                alert("프로필 수정 중 오류가 발생했습니다.");
            }
        };

        if (loading) return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;

        return (
            <motion.div
                className="flex flex-col h-screen bg-white absolute inset-0 z-20"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <header className="flex justify-center items-center h-14 px-4 bg-white sticky top-0 z-10 border-b border-gray-100">
                    <BackButton onClick={() => navigate(-1)} />
                    <h1 className="text-lg font-bold text-gray-900 ml-2">프로필 수정</h1>
                </header>

                <div className="flex-1 overflow-y-auto pb-32">

                    {/* --- 프로필 이미지 영역 --- */}
                    <div className="flex justify-center py-8">
                        <div className="relative group">
                            <div
                                className="w-28 h-28 rounded-full bg-gray-50 overflow-hidden border border-gray-200 flex items-center justify-center shadow-sm cursor-pointer"
                                onClick={() => fileRef.current?.click()}
                            >
                                {avatarPreview && !imgError ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                        onError={() => setImgError(true)} // 에러 발생 시 기본 아이콘으로 전환
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                                        <User className="w-12 h-12 text-gray-300" />
                                    </div>
                                )}
                            </div>

                            <button
                                type="button"
                                className="absolute bottom-0 right-0 p-2 bg-white rounded-full border border-gray-300 shadow-lg hover:bg-gray-50 active:scale-95 transition"
                                onClick={() => fileRef.current?.click()}
                            >
                                <Camera className="w-5 h-5 text-gray-600" />
                            </button>

                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    {/* --- 활동명(닉네임) 영역 --- */}
                    <div className="px-5 space-y-3">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            활동명 <span className="text-orange-500">*</span>
                        </label>

                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={nickname}
                                    onChange={handleNicknameChange}
                                    placeholder="활동명을 입력하세요"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all pr-10 outline-none"
                                />

                                {/* 상태 아이콘 */}
                                {checkResult === true && (
                                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
                                )}
                                {checkResult === false && (
                                    <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 w-5 h-5" />
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={handleCheckNickname}
                                disabled={!nickname || (user && nickname === user.nickname)}
                                className={`px-4 py-3 font-bold rounded-xl shadow active:scale-95 transition min-w-[90px] flex items-center justify-center
                                    ${(!nickname || (user && nickname === user.nickname))
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700"}`}
                            >
                                {checking ? <Loader2 className="w-5 h-5 animate-spin" /> : "중복확인"}
                            </button>
                        </div>

                        {checkResult === true && (
                            <p className="text-sm text-green-600 font-medium">사용 가능한 활동명입니다.</p>
                        )}
                        {checkResult === false && (
                            <p className="text-sm text-red-600 font-medium">이미 사용 중인 활동명입니다.</p>
                        )}
                    </div>

                    <div className="h-3 bg-gray-50 my-8"></div>

                    {/* --- 내 정보 (Read Only & Link) --- */}
                    <div className="px-5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">내 정보</h3>
                            <div
                                className="flex items-center cursor-pointer group"
                                onClick={() => navigate("/mypage/change")}
                            >
                                <span className="text-sm text-gray-400 group-hover:text-gray-600 mr-1 transition-colors">수정하기</span>
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm">
                            <InfoRow label="이름" value={user?.name} />
                            <InfoRow label="생년월일" value={user?.birthdate} />
                            <InfoRow label="성별" value={user?.gender === "MALE" ? "남성" : user?.gender === "FEMALE" ? "여성" : "-"} />
                            <InfoRow label="전화번호" value={user?.phone} />
                            <InfoRow label="이메일" value={user?.email} />
                        </div>
                    </div>

                    {/* --- 확인(저장) 버튼 --- */}
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 max-w-md mx-auto w-full z-30">
                        <button
                            onClick={handleConfirm}
                            className="w-full py-4 bg-[#0F172A] text-white font-bold rounded-xl active:scale-[0.98] transition-transform shadow-lg shadow-gray-200"
                        >
                            확인
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }

    // 하위 컴포넌트: 정보 표시 줄
    function InfoRow({ label, value }) {
        return (
            <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-900">{label}</span>
                <span className="text-sm text-gray-600">{value || "-"}</span>
            </div>
        );
    }
