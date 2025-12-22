/**
 * src/components/SpaceVisualizer.tsx
 * [Visual Moat]
 * 텍스트 기반 계산기 시장을 파괴하는 '공간 시뮬레이터'
 * 사용자가 숫자가 아닌 '공간감'을 느끼게 함.
 */


interface SpaceVisualizerProps {
  sqm: number;
}

export default function SpaceVisualizer({ sqm }: SpaceVisualizerProps) {
  // 방의 한 변의 길이 (미터) - 정사각형 가정
  // 1평 = 3.3㎡ = 약 1.8m x 1.8m
  const sideLength = Math.sqrt(sqm);

  return (
    <div className="mt-m3-6 p-m3-4 bg-m3-surface-variant rounded-m3-lg border border-m3-outline-variant shadow-m3-1">
      <h3 className="text-m3-on-surface-variant text-body-medium font-semibold mb-m3-4 flex items-center gap-m3-2">
        <span>👁️ 공간 시뮬레이터</span>
        <span className="text-label-small font-normal text-m3-outline">(킹사이즈 침대 1.6m × 2.0m 기준)</span>
      </h3>

      <div className="relative w-full aspect-square bg-m3-surface border-2 border-dashed border-m3-outline rounded-m3-md flex items-end justify-start overflow-hidden">

        {/* 가변형 방 크기 시각화 (sqm에 따라 크기 변화) */}
        <div
          className="relative bg-gradient-to-tr from-m3-secondary-container to-m3-primary-container border-r-2 border-t-2 border-m3-primary transition-all duration-500 ease-out shadow-m3-3"
          style={{ 
            width: `${Math.min(sideLength * 7, 100)}%`, // 시각적 배율 조정
            height: `${Math.min(sideLength * 7, 100)}%` 
          }}
        >
          {/* 킹사이즈 침대 오브젝트 (고정 크기 느낌을 주기 위한 상대적 비율) */}
          <div
            className="absolute bottom-m3-4 left-m3-4 bg-m3-error/80 backdrop-blur-sm flex items-center justify-center text-label-small text-m3-on-error font-bold shadow-m3-2 transform transition-transform hover:scale-105 cursor-help rounded-m3-xs"
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
          <div className="absolute bottom-m3-4 left-[35%] w-m3-4 h-m3-4 bg-m3-tertiary rounded-m3-full shadow-m3-1" title="사람" />

          {/* 치수 표시 */}
          <span className="absolute top-m3-2 right-m3-2 text-m3-primary text-label-small font-mono font-bold bg-m3-surface/70 px-m3-1 rounded-m3-xs">
            {sideLength.toFixed(1)}m
          </span>
          <span className="absolute bottom-m3-1 right-m3-2 text-m3-on-surface-variant text-label-small">
            {Math.round(sqm)}㎡
          </span>
        </div>
      </div>
      
      <p className="text-label-small text-center text-m3-on-surface-variant mt-m3-3">
        * 실제 체감 공간은 전용률 및 구조(베란다 등)에 따라 다를 수 있습니다.
      </p>
    </div>
  );
}