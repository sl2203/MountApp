    import { motion } from "framer-motion";

    export default function FindAccountPage() {
    return (
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 space-y-10 p-6">

        {/* 아이디 찾기 */}
        <motion.div className="bg-white rounded-2xl shadow-xl p-6 w-72">
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">아이디 찾기</h2>
            <form className="space-y-4">
            <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">이름</label>
                <input
                type="text"
                placeholder="이름 입력"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>
            <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">전화번호</label>
                <input
                type="tel"  
                placeholder="전화번호 입력"
                className="p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>
            <button type="button" className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-semibold">
                아이디 찾기
            </button>
            </form>
        </motion.div>

        {/* 비밀번호 찾기 */}
        <motion.div className="bg-white rounded-2xl shadow-xl p-6 w-72">
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">비밀번호 찾기</h2>
            <form className="space-y-4">
            <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">아이디</label>
                <input
                type="text"
                placeholder="아이디 입력"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>
            <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">전화번호</label>
                <input
                type="tel"
                placeholder="전화번호 입력"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>
            <button type="button" className="w-full bg-sky-500 text-white py-3 rounded-lg hover:bg-sky-600 transition font-semibold">
                본인 인증
            </button>    
            <button type="button" className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-semibold">
                비밀번호 재설정
            </button>
            </form>
        </motion.div>

        </div>
    );
    }
