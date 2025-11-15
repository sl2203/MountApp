import { motion } from "framer-motion";

export default function JoinPage() {
  return (
    <div className="flex flex-col items-center justify-center  bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      <motion.div className="bg-white rounded-2xl shadow-xl p-4 w-[310px]" >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">회원가입</h2>
        <form className="space-y-4">

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">아이디</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="아이디 입력"
                className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                className="bg-blue-500 text-white px-3 whitespace-nowrap rounded-lg hover:bg-blue-600 transition font-semibold"
              >
                중복
              </button>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호 입력"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">비밀번호 확인</label>
            <input
              type="password"
              placeholder="비밀번호 재입력"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">전화번호</label>
            <div className="flex gap-2">
              <input
                type="tel"
                placeholder="전화번호 입력"
                className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                className="bg-sky-500 text-white px-3 py-2 whitespace-nowrap rounded-lg hover:bg-sky-600 transition font-semibold"
              >
                인증
              </button>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">인증번호</label>
            <input
              type="text"
              placeholder="인증번호 입력"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">이메일</label>
            <input
              type="email"
              placeholder="이메일 입력"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">이름</label>
            <input
              type="text"
              placeholder="이름 입력"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">생년월일</label>
            <input
              type="date"
              className="p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">성별</label>
            <select className="p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">선택</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
            </select>
          </div>

          <button
            type="button"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-semibold"
          >
            확인
          </button>
        </form>
      </motion.div>
    </div>
  );
}
