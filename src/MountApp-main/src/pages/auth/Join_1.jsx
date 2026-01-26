import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { EyeIcon, EyeSlashIcon, CheckCircleIcon, XCircleIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { Loader2 } from "lucide-react";

    export default function Join_1() {
    const navigate = useNavigate();

    // 1. 상태 관리
    const [formData, setFormData] = useState({
        nickname: '',
        userid: '',
        password: '',
        passwordConfirm: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // 중복 확인 상태
    const [nickStatus, setNickStatus] = useState({ loading: false, result: null });
    const [idStatus, setIdStatus] = useState({ loading: false, result: null });

    // 2. 입력 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // 값을 수정하면 중복 확인 결과를 초기화
        if (name === "nickname") setNickStatus({ loading: false, result: null });
        if (name === "userid") setIdStatus({ loading: false, result: null });
    };

    // 3. 닉네임 중복 확인
    const handleCheckNickname = async () => {
        if (!formData.nickname.trim()) return alert("활동명을 입력해주세요.");
        setNickStatus(prev => ({ ...prev, loading: true }));
        try {
            const res = await axios.get(`/api/auth/check-nickname`, { params: { nickname: formData.nickname } });
            setNickStatus({ loading: false, result: res.data });
        } catch (e) {
            setNickStatus({ loading: false, result: false });
            alert("중복 확인 중 오류가 발생했습니다.");
        }
    };

    // 4. 아이디 중복 확인
    const handleCheckID = async () => {
        if (!formData.userid.trim()) return alert("아이디를 입력해주세요.");
        setIdStatus(prev => ({ ...prev, loading: true }));
        try {
            const res = await axios.get(`/api/auth/check-userid`, { params: { userid: formData.userid } });
            setIdStatus({ loading: false, result: res.data });
        } catch (e) {
            setIdStatus({ loading: false, result: false });
            alert("중복 확인 중 오류가 발생했습니다.");
        }
    };

    // 5. 전체 유효성 검사 (버튼 활성화 조건)
    const isFormValid =
        nickStatus.result === true &&
        idStatus.result === true &&
        formData.password.length >= 8 &&
        formData.password === formData.passwordConfirm;

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-[450px] bg-white flex flex-col">

                {/* 상단 헤더 */}
                <div className="relative py-5 px-5 flex items-center border-b border-gray-50">
                    <button onClick={() => navigate(-1)} className="absolute left-6">
                        <ChevronLeftIcon className="w-6 h-6 text-gray-800 stroke-[2.5px]" />
                    </button>
                    <h2 className="w-full text-center text-2xl font-bold text-gray-800">계정 정보</h2>
                </div>

                {/* 진행 바 */}
                <div className="px-8 mt-8">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-indigo-500 font-bold text-base">Step 1/2</span>
                        <span className="text-gray-400 text-sm font-medium">계정 설정</span>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1 h-[5px] bg-indigo-500 rounded-full"></div>
                        <div className="flex-1 h-[6px] bg-gray-100 rounded-full"></div>
                    </div>
                </div>

                {/* 메인 타이틀 */}
                <div className="px-8 mt-10">
                    <h1 className="text-3xl font-black text-gray-900 leading-tight">환영합니다! 👋</h1>
                    <p className="text-gray-400 mt-3 text-base">서비스 이용을 위해 기본 계정 정보를 설정해주세요.</p>
                </div>

                {/* 입력 폼 영역 */}
                <div className="px-8 mt-8 space-y-7">

                    {/* 활동명 */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            활동명(별칭) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                name="nickname"
                                value={formData.nickname}
                                onChange={handleChange}
                                type="text"
                                placeholder="예: 홍길동"
                                className="w-full h-14 px-5 bg-[#f9fafb] border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 transition-all"
                            />
                            <button
                                type="button"
                                onClick={handleCheckNickname}
                                className="absolute right-3 top-2.5 px-4 py-2 bg-[#e5e7eb] text-gray-500 text-xs font-bold rounded-xl hover:bg-gray-300 transition-colors"
                            >
                                {nickStatus.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "중복확인"}
                            </button>
                        </div>
                        {nickStatus.result === true && (
                            <p className="text-xs text-green-600 mt-2 ml-1 flex items-center gap-1">
                                <CheckCircleIcon className="w-3.5 h-3.5" /> 사용 가능한 활동명입니다.
                            </p>
                        )}
                        {nickStatus.result === false && (
                            <p className="text-xs text-red-500 mt-2 ml-1 flex items-center gap-1">
                                <XCircleIcon className="w-3.5 h-3.5" /> 이미 사용 중인 활동명입니다.
                            </p>
                        )}
                        {nickStatus.result === null && (
                            <p className="text-xs text-gray-400 mt-2 ml-1">다른 사용자에게 보여질 이름입니다.</p>
                        )}
                    </div>

                    {/* 아이디 */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            아이디 <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                name="userid"
                                value={formData.userid}
                                onChange={handleChange}
                                type="text"
                                placeholder="영문, 숫자 포함 6-20자"
                                className="w-full h-14 px-5 bg-[#f9fafb] border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 transition-all"
                            />
                            <button
                                type="button"
                                onClick={handleCheckID}
                                className="absolute right-3 top-2.5 px-4 py-2 bg-[#e5e7eb] text-gray-500 text-xs font-bold rounded-xl hover:bg-gray-300 transition-colors"
                            >
                                {idStatus.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "중복확인"}
                            </button>
                        </div>
                        {idStatus.result === true && (
                            <p className="text-xs text-green-600 mt-2 ml-1 flex items-center gap-1">
                                <CheckCircleIcon className="w-3.5 h-3.5" /> 사용 가능한 아이디입니다.
                            </p>
                        )}
                        {idStatus.result === false && (
                            <p className="text-xs text-red-500 mt-2 ml-1 flex items-center gap-1">
                                <XCircleIcon className="w-3.5 h-3.5" /> 이미 사용 중인 아이디입니다.
                            </p>
                        )}
                    </div>

                    {/* 비밀번호 */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            비밀번호 <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                type={showPassword ? "text" : "password"}
                                placeholder="비밀번호를 입력해주세요"
                                className="w-full h-14 px-5 bg-[#f9fafb] border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-4 text-gray-400 hover:text-gray-600 transition-colors">
                                {showPassword ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
                            </button>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-2 ml-1">ⓘ 영문, 숫자, 특수문자를 포함하여 8자 이상 입력해주세요.</p>
                    </div>

                    {/* 비밀번호 확인 */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            비밀번호 확인 <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                name="passwordConfirm"
                                value={formData.passwordConfirm}
                                onChange={handleChange}
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="비밀번호를 다시 한번 입력해주세요"
                                className={`w-full h-14 px-5 bg-[#f9fafb] border rounded-2xl focus:outline-none focus:ring-2 transition-all ${
                                    formData.passwordConfirm && formData.password !== formData.passwordConfirm
                                        ? 'border-red-400 focus:ring-red-400' : 'border-gray-100 focus:ring-indigo-500'
                                }`}
                            />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-5 top-4 text-gray-400 hover:text-gray-600 transition-colors">
                                {showConfirmPassword ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
                            </button>
                        </div>
                        {formData.passwordConfirm && formData.password !== formData.passwordConfirm && (
                            <p className="text-xs text-red-500 mt-2 ml-1 font-medium">비밀번호가 일치하지 않습니다.</p>
                        )}
                    </div>
                </div>

                <div className="border-b border-gray-100 py-3"></div>

                {/* 하단 다음 버튼 */}
                <div className="px-8 py-10">
                    <button
                        type="button"
                        disabled={!isFormValid}
                        onClick={() => {
                            navigate('/join_2', {
                                state: {
                                    userid: formData.userid,
                                    password: formData.password,
                                    nickname: formData.nickname
                                }
                            });
                        }}
                        className={`w-full py-5 text-xl font-bold rounded-2xl transition-all ${
                            isFormValid
                                ? "bg-indigo-600 text-white cursor-pointer hover:bg-indigo-700 active:scale-[0.98]"
                                : "bg-[#f8f9fa] text-gray-300 cursor-not-allowed"
                        }`}
                    >
                        다음
                    </button>
                </div>
            </div>
        </div>
    );
}