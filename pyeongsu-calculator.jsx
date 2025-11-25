import React, { useState } from 'react';

export default function PyeongsuCalculator() {
  const [sqm, setSqm] = useState('');
  const [pyeong, setPyeong] = useState('');
  const [activeInput, setActiveInput] = useState(null);

  const SQM_TO_PYEONG = 0.3025;
  const PYEONG_TO_SQM = 3.3058;

  const handleSqmChange = (e) => {
    const value = e.target.value;
    setSqm(value);
    setActiveInput('sqm');
    
    if (value === '' || value === '.') {
      setPyeong('');
      return;
    }
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setPyeong((numValue * SQM_TO_PYEONG).toFixed(2));
    }
  };

  const handlePyeongChange = (e) => {
    const value = e.target.value;
    setPyeong(value);
    setActiveInput('pyeong');
    
    if (value === '' || value === '.') {
      setSqm('');
      return;
    }
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setSqm((numValue * PYEONG_TO_SQM).toFixed(2));
    }
  };

  const clearAll = () => {
    setSqm('');
    setPyeong('');
    setActiveInput(null);
  };

  const commonSizes = [
    { pyeong: '10평', sqm: '33.06㎡', type: '원룸' },
    { pyeong: '15평', sqm: '49.59㎡', type: '투룸' },
    { pyeong: '20평', sqm: '66.12㎡', type: '소형 아파트' },
    { pyeong: '25평', sqm: '82.64㎡', type: '중소형 아파트' },
    { pyeong: '30평', sqm: '99.17㎡', type: '중형 아파트' },
    { pyeong: '35평', sqm: '115.70㎡', type: '중대형 아파트' },
    { pyeong: '40평', sqm: '132.23㎡', type: '대형 아파트' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              평수 계산기
            </h1>
            <p className="text-gray-600">
              평형과 제곱미터(㎡)를 빠르게 변환하세요
            </p>
          </div>

          {/* 계산기 영역 */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                제곱미터 (㎡)
              </label>
              <input
                type="number"
                value={sqm}
                onChange={handleSqmChange}
                placeholder="숫자 입력"
                className={`w-full px-4 py-3 text-lg border-2 rounded-lg outline-none transition-all ${
                  activeInput === 'sqm'
                    ? 'border-blue-500 ring-4 ring-blue-100'
                    : 'border-gray-300'
                }`}
              />
            </div>

            <div className="flex justify-center my-4">
              <div className="bg-white rounded-full p-3 shadow-md">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                평
              </label>
              <input
                type="number"
                value={pyeong}
                onChange={handlePyeongChange}
                placeholder="숫자 입력"
                className={`w-full px-4 py-3 text-lg border-2 rounded-lg outline-none transition-all ${
                  activeInput === 'pyeong'
                    ? 'border-blue-500 ring-4 ring-blue-100'
                    : 'border-gray-300'
                }`}
              />
            </div>

            <button
              onClick={clearAll}
              className="w-full py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              초기화
            </button>
          </div>

          {/* 변환 공식 */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6 border-l-4 border-blue-500">
            <div className="font-semibold text-gray-800 mb-2">변환 공식</div>
            <div className="text-sm text-gray-700 space-y-1">
              <div>• 1평 = 3.3058㎡</div>
              <div>• 1㎡ = 0.3025평</div>
            </div>
          </div>

          {/* 일반 평형 참고표 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              일반적인 평형 참고표
            </h2>
            <div className="space-y-2">
              {commonSizes.map((size, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <span className="font-bold text-gray-900">{size.pyeong}</span>
                    <span className="text-sm text-gray-600 ml-2">{size.type}</span>
                  </div>
                  <div className="text-blue-600 font-bold">{size.sqm}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 팁 */}
          <div className="mt-8 p-6 bg-amber-50 rounded-lg border-l-4 border-amber-400">
            <div className="font-semibold text-gray-800 mb-3 flex items-center">
              <span className="text-xl mr-2">💡</span>
              평수 계산 팁
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>아파트 분양 광고의 공급면적에는 계단, 복도 등 공용면적이 포함됩니다</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>전용면적은 실제 사용 가능한 실내 공간입니다</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>부동산 계약 시 전용면적과 공급면적을 반드시 확인하세요</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
