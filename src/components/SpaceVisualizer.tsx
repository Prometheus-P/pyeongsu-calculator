interface SpaceVisualizerProps {
  sqm: number;
}

export default function SpaceVisualizer({ sqm }: SpaceVisualizerProps) {
  const sideLength = Math.sqrt(sqm);

  return (
    <div className="p-4 rounded-xl bg-m3-surface-container-low flex flex-col gap-4">
      <div className="flex flex-col">
        <h3 className="md-typescale-title-medium">👁️ 공간 시뮬레이터</h3>
        <p className="md-typescale-body-small text-m3-on-surface-variant">(킹사이즈 침대 1.6m × 2.0m 기준)</p>
      </div>

      <div className="relative w-full aspect-square bg-m3-surface-container rounded-lg flex items-end justify-start overflow-hidden border border-m3-outline-variant">
        {/* Room visualization */}
        <div
          className="relative bg-m3-surface-container-high border-r-2 border-t-2 border-m3-primary transition-all duration-500 ease-out"
          style={{
            width: `${Math.min(sideLength * 7, 100)}%`,
            height: `${Math.min(sideLength * 7, 100)}%`,
          }}
        >
          {/* King-size bed object */}
          <div
            className="absolute bottom-2 left-2 bg-m3-tertiary-container flex items-center justify-center text-m3-on-tertiary-container shadow-sm"
            style={{
              width: '25%',
              height: '30%',
              maxHeight: '80px',
              maxWidth: '60px',
            }}
            title="킹사이즈 침대 (1.6m x 2.0m)"
          >
            <span className="md-typescale-label-small">BED</span>
          </div>
          
          {/* Dimension labels */}
          <span className="absolute top-1 right-1 md-typescale-label-medium text-m3-primary bg-m3-surface-container/80 px-1 rounded">
            {sideLength.toFixed(1)}m
          </span>
          <span className="absolute bottom-0 right-1 md-typescale-label-small text-m3-on-surface-variant">
            {Math.round(sqm)}㎡
          </span>
        </div>
      </div>
      <p className="md-typescale-body-small text-m3-on-surface-variant text-center">
        * 실제 체감 공간은 전용률 및 구조에 따라 다를 수 있습니다.
      </p>
    </div>
  );
}
