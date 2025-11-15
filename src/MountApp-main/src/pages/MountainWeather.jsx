export default function MountainWeather() {
    return (
      <div className="w-full max-w-md mx-auto bg-blue-100 rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
        <h3 className="font-bold text-lg mb-2">🌤 산 날씨</h3>
        <p className="text-gray-700">
          현재 날씨 정보를 표시하려면 <strong>기상청 API</strong>를 호출해야 합니다.
        </p>
      </div>
    );
  }
  