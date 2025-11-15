import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();


  const handleSearch = (e) => {
    e.preventDefault(); 
    if (query.trim() !== "") {
      navigate(`/mountain/${query}`); 
      setQuery(""); 
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <input
        type="text"
        placeholder="어떤 산을 찾으시나요?"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 pl-10 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <Search
        size={20}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
        onClick={handleSearch} 
      />
    </form>
  );
}
