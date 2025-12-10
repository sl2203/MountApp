import { Search } from "lucide-react";

// 부모(Home)로부터 value(검색어)와 onChange(입력 시 실행할 함수)를 받아옵니다.
export default function SearchBar({ value, onChange }) {

    // 폼 제출(엔터 키 등) 시 새로고침 방지
    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full">
            <input
                type="text"
                placeholder="어떤 산을 찾으시나요?"

                // [핵심] 부모 컴포넌트(Home.jsx)의 상태와 연결됩니다.
                value={value}
                onChange={onChange}

                className="w-full p-2 pl-10 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
        </form>
    );
}