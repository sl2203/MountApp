import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // axios 추가
import { ChevronLeftIcon, UserIcon, PhoneIcon, EnvelopeIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function Join_2() {
    const navigate = useNavigate();
    const location = useLocation();

    // Step 1에서 넘어온 데이터가 있다고 가정 (userid, password, nickname 등)
    // 만약 Step 1 데이터를 context나 전역 상태로 관리한다면 그곳에서 가져오시면 됩니다.
    const prevData = location.state || {};

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        emailId: '',
        emailDomain: 'naver.com',
        birthdate: '',
        gender: '' // '남성' 또는 '여성' 저장
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 모든 필드 입력 여부 확인
    const isFormValid = formData.name && formData.phone && formData.emailId && formData.birthdate && formData.gender;

    // 최종 회원가입 요청 함수
    const handleSubmit = async () => {
        if (!isFormValid) return;

        try {
            setLoading(true);

            // 성별 값을 백엔드 규격(MALE/FEMALE)으로 변환
            const genderValue = formData.gender === "남성" ? "MALE" : "FEMALE";
            // 이메일 합치기
            const fullEmail = `${formData.emailId}@${formData.emailDomain}`;

            const response = await axios.post('/api/auth/join', {
                ...prevData, // Step 1에서 입력한 userid, password, nickname 포함
                name: formData.name,
                phone: formData.phone,
                email: fullEmail,
                birthdate: formData.birthdate,
                gender: genderValue
            });

            if (response.status === 200) {
                alert("회원가입 성공! 로그인 페이지로 이동합니다.");
                navigate('/');
            }
        } catch (error) {
            console.error("회원가입 에러:", error);
            alert(error.response?.data || "회원가입에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-[450px] bg-white flex flex-col">
                {/* 1. 헤더 */}
                <div className="relative py-5 px-5 flex items-center border-b border-gray-50">
                    <button onClick={() => navigate(-1)} className="absolute left-6">
                        <ChevronLeftIcon className="w-6 h-6 text-gray-800 stroke-[2.5px]" />
                    </button>
                    <h2 className="w-full text-center text-2xl font-bold text-gray-800">계정 정보</h2>
                </div>

                {/* 2. 진행 바 */}
                <div className="px-8 mt-8">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-indigo-500 font-bold text-base">Step 2/2</span>
                        <span className="text-gray-400 text-sm font-medium">계정 정보</span>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1 h-[5px] bg-indigo-500 rounded-full"></div>
                        <div className="flex-1 h-[5px] bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.3)]"></div>
                    </div>
                </div>

                {/* 3. 입력 폼 영역 */}
                <div className="px-8 mt-10 space-y-8">
                    {/* 이름 */}
                    <div>
                        <label className="block text-base font-bold text-gray-800 mb-3">
                            이름 <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <UserIcon className="absolute left-4 top-4 w-6 h-6 text-gray-300" />
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="실명을 입력해주세요"
                                className="w-full h-14 pl-12 pr-5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-700 placeholder:text-gray-300 transition-all"
                            />
                        </div>
                    </div>

                    {/* 휴대전화 */}
                    <div>
                        <label className="block text-base font-bold text-gray-800 mb-3">
                            휴대전화 <span className="text-red-400">*</span>
                        </label>
                        <div className="flex gap-2">
                            <div className="relative w-32">
                                <select className="w-full h-14 pl-4 pr-10 appearance-none bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400">
                                    <option>🇰🇷 +82</option>
                                </select>
                                <div className="absolute right-3 top-5 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="번호 입력 ('-' 제외)"
                                className="flex-1 h-14 px-5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-700 placeholder:text-gray-300 transition-all"
                            />
                        </div>
                    </div>

                    {/* 이메일 */}
                    <div>
                        <label className="block text-base font-bold text-gray-800 mb-3">
                            이메일 <span className="text-red-400">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <EnvelopeIcon className="absolute left-4 top-4 w-6 h-6 text-gray-300" />
                                <input
                                    name="emailId"
                                    value={formData.emailId}
                                    onChange={handleChange}
                                    placeholder="이메일 앞자리"
                                    className="w-full h-14 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-700 placeholder:text-gray-300 transition-all"
                                />
                            </div>
                            <span className="text-gray-400 font-medium">@</span>
                            <div className="relative flex-1">
                                <select
                                    name="emailDomain"
                                    value={formData.emailDomain}
                                    onChange={handleChange}
                                    className="w-full h-14 px-4 appearance-none bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                >
                                    <option value="naver.com">naver.com</option>
                                    <option value="gmail.com">gmail.com</option>
                                    <option value="daum.net">daum.net</option>
                                </select>
                                <div className="absolute right-3 top-5 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 생년월일 */}
                    <div>
                        <label className="block text-base font-bold text-gray-800 mb-3">
                            생년월일 <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <CalendarIcon className="absolute left-4 top-4 w-6 h-6 text-gray-300" />
                            <input
                                name="birthdate"
                                type="text"
                                onFocus={(e) => e.target.type = 'date'}
                                onBlur={(e) => { if(!e.target.value) e.target.type = 'text' }}
                                value={formData.birthdate}
                                onChange={handleChange}
                                placeholder="생년월일을 선택해주세요"
                                className="w-full h-14 pl-12 pr-5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-700 placeholder:text-gray-300 transition-all cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* 성별 */}
                    <div>
                        <label className="block text-base font-bold text-gray-800 mb-3">
                            성별 <span className="text-red-400">*</span>
                        </label>
                        <div className="flex gap-3">
                            {['남성', '여성'].map((gender) => (
                                <button
                                    key={gender}
                                    type="button"
                                    onClick={() => setFormData({...formData, gender})}
                                    className={`flex-1 h-16 rounded-xl border text-base font-medium transition-all ${
                                        formData.gender === gender
                                            ? 'bg-white border-indigo-400 text-indigo-500 ring-1 ring-indigo-400'
                                            : 'bg-white border-gray-200 text-gray-400'
                                    }`}
                                >
                                    {gender}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={" border-b border-gray-100 py-3"}> </div>

                {/* 4. 하단 완료 버튼 */}
                <div className="mt-auto px-8 py-10">
                    <button
                        type="button"
                        disabled={!isFormValid || loading}
                        onClick={handleSubmit} // 클릭 이벤트 추가
                        className={`w-full h-16 text-xl font-bold rounded-2xl transition-all shadow-lg ${
                            isFormValid && !loading
                                ? 'bg-indigo-500 text-white shadow-indigo-100 hover:bg-indigo-600 active:scale-[0.98]'
                                : 'bg-indigo-400/60 text-white cursor-not-allowed opacity-80'
                        }`}
                    >
                        {loading ? "처리 중..." : "완료"}
                    </button>
                </div>
            </div>
        </div>
    );
}