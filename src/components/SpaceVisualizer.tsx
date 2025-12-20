/**
 * src/components/SpaceVisualizer.tsx
 * [Visual Moat]
 * 텍스트 기반 계산기 시장을 파괴하는 '공간 시뮬레이터'
 * 사용자가 숫자가 아닌 '공간감'을 느끼게 함.
 */
import React from 'react';

interface SpaceVisualizerProps {
  sqm: number;
}

export default function SpaceVisualizer({ sqm }: SpaceVisualizerProps) {
  // 방의 한 변의 길이 (미터) - 정사각형 가정
  // 1평 = 3.3㎡ = 약 1.8m x 1.8m
  const sideLength = Math.sqrt(sqm);
  
  // 시각적 스케일 조정을 위한 제한 (너무 작거나 크지 않게)
  const displaySize = Math.min(Math.max(sqm, 10), 200); 
  const scaleRatio = 100 / Math.sqrt(200); // 최대 200sqm 기준

  return (
    <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700 shadow-inner">
      <h3 className="text-gray-400 text-sm font-semibold mb-4 flex items-center gap-2">
        <span>👁️ 공간 시뮬레이터</span>
        <span className="text-xs font-normal text-gray-500">(킹사이즈 침대 1.6m × 2.0m 기준)</span>
      </h3>
      
      <div className="relative w-full aspect-square bg-gray-900 border-2 border-dashed border-gray-600 rounded flex items-end justify-start overflow-hidden">
        
        {/* 가변형 방 크기 시각화 (sqm에 따라 크기 변화) */}
        <div 
          className="relative bg-gradient-to-tr from-gray-700 to-gray-600 border-r-2 border-t-2 border-cyan-500 transition-all duration-500 ease-out shadow-2xl"
          style={{ 
            width: `${Math.min(sideLength * 7, 100)}%`, // 시각적 배율 조정
            height: `${Math.min(sideLength * 7, 100)}%` 
          }}
        >
          {/* 킹사이즈 침대 오브젝트 (고정 크기 느낌을 주기 위한 상대적 비율) */}
          <div 
            className="absolute bottom-4 left-4 bg-red-400/80 backdrop-blur-sm flex items-center justify-center text-[10px] text-white font-bold shadow-lg transform transition-transform hover:scale-105 cursor-help"
            style={{ 
              // 방 크기가 커지면 침대는 상대적으로 작아 보여야 함 (실제로는 방이 커지는 것)
              // 여기서는 UI 편의상 방을 키우는 방식을 택했으므로 침대 크기는 고정 픽셀에 가깝게 유지하거나 비율 조정
              width: '25%', 
              height: '30%',
              maxHeight: '80px',
              maxWidth: '60px'
            }}
            title="킹사이즈 침대 (1.6m x 2.0m)"
          >
            BED
          </div>

          {/* 사람 아이콘 (크기 체감용) */}
          <div className="absolute bottom-4 left-[35%] w-4 h-4 bg-yellow-400 rounded-full shadow-md" title="사람" />

          {/* 치수 표시 */}
          <span className="absolute top-2 right-2 text-cyan-300 text-xs font-mono font-bold bg-black/50 px-1 rounded">
            {sideLength.toFixed(1)}m
          </span>
          <span className="absolute bottom-1 right-2 text-gray-400 text-[10px]">
            {Math.round(sqm)}㎡
          </span>
        </div>
      </div>
      
      <p className="text-xs text-center text-gray-500 mt-3">
        * 실제 체감 공간은 전용률 및 구조(베란다 등)에 따라 다를 수 있습니다.
      </p>
    </div>
  );
}