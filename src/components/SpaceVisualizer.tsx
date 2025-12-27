/**
 * src/components/SpaceVisualizer.tsx
 * [Visual Moat]
 * 텍스트 기반 계산기 시장을 파괴하는 '공간 시뮬레이터'
 * 사용자가 숫자가 아닌 '공간감'을 느끼게 함.
 */

import { useState } from 'react';

interface SpaceVisualizerProps {
  sqm: number;
}

/** 킹사이즈 침대 SVG (1.6m x 2.0m) */
const BedIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 40 50" className={className} fill="currentColor">
    {/* 헤드보드 */}
    <rect x="2" y="0" width="36" height="8" rx="2" opacity="0.9" />
    {/* 매트리스 */}
    <rect x="0" y="10" width="40" height="35" rx="3" opacity="0.7" />
    {/* 베개 2개 */}
    <rect x="4" y="13" width="14" height="8" rx="2" opacity="0.5" />
    <rect x="22" y="13" width="14" height="8" rx="2" opacity="0.5" />
    {/* 다리 */}
    <rect x="2" y="46" width="4" height="4" rx="1" opacity="0.8" />
    <rect x="34" y="46" width="4" height="4" rx="1" opacity="0.8" />
  </svg>
);

/** 3인 소파 SVG (2.0m x 0.9m) */
const SofaIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 60 28" className={className} fill="currentColor">
    {/* 등받이 */}
    <rect x="0" y="0" width="60" height="10" rx="3" opacity="0.9" />
    {/* 좌석 */}
    <rect x="3" y="10" width="54" height="12" rx="2" opacity="0.7" />
    {/* 팔걸이 */}
    <rect x="0" y="8" width="6" height="16" rx="2" opacity="0.8" />
    <rect x="54" y="8" width="6" height="16" rx="2" opacity="0.8" />
    {/* 다리 */}
    <rect x="6" y="24" width="4" height="4" rx="1" opacity="0.6" />
    <rect x="50" y="24" width="4" height="4" rx="1" opacity="0.6" />
  </svg>
);

/** 책상 SVG (1.4m x 0.7m) */
const DeskIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 42 24" className={className} fill="currentColor">
    {/* 상판 */}
    <rect x="0" y="0" width="42" height="4" rx="1" opacity="0.85" />
    {/* 다리 */}
    <rect x="2" y="4" width="3" height="20" rx="1" opacity="0.7" />
    <rect x="37" y="4" width="3" height="20" rx="1" opacity="0.7" />
    {/* 서랍 */}
    <rect x="28" y="6" width="10" height="14" rx="1" opacity="0.5" />
  </svg>
);

/** 사람 실루엣 SVG (높이 1.7m 기준) */
const PersonIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 12 34" className={className} fill="currentColor">
    {/* 머리 */}
    <circle cx="6" cy="4" r="4" opacity="0.9" />
    {/* 몸통 */}
    <ellipse cx="6" cy="16" rx="5" ry="8" opacity="0.7" />
    {/* 다리 */}
    <rect x="2" y="23" width="3" height="11" rx="1" opacity="0.6" />
    <rect x="7" y="23" width="3" height="11" rx="1" opacity="0.6" />
  </svg>
);

export default function SpaceVisualizer({ sqm }: SpaceVisualizerProps) {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const sideLength = Math.sqrt(sqm);

  // 방 크기에 따른 스케일 계산 (더 큰 방 = 가구가 상대적으로 작게 보임)
  const roomScale = Math.min(sideLength * 7, 100);
  // 가구 크기는 방이 커질수록 상대적으로 작아짐
  const furnitureScale = Math.max(100 / roomScale, 0.4);

  const handleSaveLayout = () => {
    setShowEmailForm(true);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Fake Door: 실제 저장은 하지 않고 이메일만 수집
    console.log('[Data Dam] Layout save request:', { sqm, email });
    setSubmitted(true);
  };

  return (
    <div className="mt-m3-6 p-m3-4 bg-m3-surface-variant rounded-m3-lg border border-m3-outline-variant shadow-m3-1">
      <h3 className="text-m3-on-surface-variant text-body-medium font-semibold mb-m3-3 flex items-center gap-m3-2">
        <span>👁️ 공간 시뮬레이터</span>
      </h3>

      {/* 범례 */}
      <div className="flex flex-wrap gap-m3-3 mb-m3-3 text-label-small">
        <div className="flex items-center gap-m3-1">
          <div className="w-3 h-4 bg-m3-error rounded-sm" />
          <span className="text-m3-on-surface-variant">침대 1.6×2.0m</span>
        </div>
        <div className="flex items-center gap-m3-1">
          <div className="w-4 h-2 bg-m3-tertiary rounded-sm" />
          <span className="text-m3-on-surface-variant">소파 2.0×0.9m</span>
        </div>
        <div className="flex items-center gap-m3-1">
          <div className="w-3 h-2 bg-m3-secondary rounded-sm" />
          <span className="text-m3-on-surface-variant">책상 1.4×0.7m</span>
        </div>
        <div className="flex items-center gap-m3-1">
          <div className="w-2 h-3 bg-m3-primary rounded-full" />
          <span className="text-m3-on-surface-variant">사람 1.7m</span>
        </div>
      </div>

      <div className="relative w-full aspect-square bg-m3-surface border-2 border-dashed border-m3-outline rounded-m3-md flex items-end justify-start overflow-hidden">
        {/* 방 영역 */}
        <div
          className="relative bg-gradient-to-tr from-m3-secondary-container to-m3-primary-container border-r-2 border-t-2 border-m3-primary transition-all duration-500 ease-out shadow-m3-3"
          style={{
            width: `${roomScale}%`,
            height: `${roomScale}%`
          }}
        >
          {/* 킹사이즈 침대 */}
          <div
            className="absolute bottom-3 left-3 text-m3-error drop-shadow-md transition-transform hover:scale-110 cursor-help"
            style={{
              width: `${32 * furnitureScale}px`,
              height: `${40 * furnitureScale}px`,
            }}
            title="킹사이즈 침대 (1.6m × 2.0m)"
          >
            <BedIcon className="w-full h-full" />
          </div>

          {/* 3인 소파 */}
          <div
            className="absolute bottom-3 right-3 text-m3-tertiary drop-shadow-md transition-transform hover:scale-110 cursor-help"
            style={{
              width: `${48 * furnitureScale}px`,
              height: `${22 * furnitureScale}px`,
            }}
            title="3인 소파 (2.0m × 0.9m)"
          >
            <SofaIcon className="w-full h-full" />
          </div>

          {/* 책상 */}
          <div
            className="absolute top-3 left-3 text-m3-secondary drop-shadow-md transition-transform hover:scale-110 cursor-help"
            style={{
              width: `${36 * furnitureScale}px`,
              height: `${18 * furnitureScale}px`,
            }}
            title="책상 (1.4m × 0.7m)"
          >
            <DeskIcon className="w-full h-full" />
          </div>

          {/* 사람 */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-m3-primary drop-shadow-md"
            style={{
              width: `${12 * furnitureScale}px`,
              height: `${28 * furnitureScale}px`,
            }}
            title="사람 (높이 1.7m)"
          >
            <PersonIcon className="w-full h-full" />
          </div>

          {/* 치수 표시 */}
          <span className="absolute top-m3-1 right-m3-2 text-m3-primary text-label-small font-mono font-bold bg-m3-surface/80 px-m3-1 rounded-m3-xs shadow-sm">
            {sideLength.toFixed(1)}m × {sideLength.toFixed(1)}m
          </span>
          <span className="absolute bottom-m3-1 left-1/2 -translate-x-1/2 text-m3-on-surface-variant text-label-medium font-bold bg-m3-surface/80 px-m3-2 py-m3-1 rounded-m3-xs shadow-sm">
            {Math.round(sqm)}㎡
          </span>
        </div>
      </div>

      <p className="text-label-small text-center text-m3-on-surface-variant mt-m3-3">
        * 가구 위에 마우스를 올리면 크기를 확인할 수 있습니다
      </p>

      {/* Fake Door: 데이터 수집 훅 */}
      {!showEmailForm && !submitted && (
        <button
          onClick={handleSaveLayout}
          className="w-full mt-m3-4 py-m3-3 text-m3-primary text-label-large font-medium rounded-m3-md hover:bg-m3-primary/10 active:bg-m3-primary/20 transition-all"
        >
          💾 내 배치 저장하고 비교하기
        </button>
      )}

      {showEmailForm && !submitted && (
        <form onSubmit={handleEmailSubmit} className="mt-m3-4 p-m3-3 bg-m3-surface rounded-m3-md border border-m3-outline-variant animate-fade-in">
          <p className="text-body-medium text-m3-on-surface mb-m3-2">
            🚧 이 기능은 곧 출시됩니다!
          </p>
          <p className="text-label-small text-m3-on-surface-variant mb-m3-3">
            비슷한 평형대 사람들의 배치와 비교할 수 있는 기능을 준비 중입니다. 알림을 받으시겠습니까?
          </p>
          <div className="flex gap-m3-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 주소"
              required
              className="flex-1 px-m3-3 py-m3-2 text-body-medium bg-m3-surface-variant text-m3-on-surface rounded-m3-sm border border-m3-outline focus:border-m3-primary focus:ring-1 focus:ring-m3-primary outline-none"
            />
            <button
              type="submit"
              className="px-m3-4 py-m3-2 bg-m3-primary text-m3-on-primary rounded-m3-sm text-label-medium font-medium m3-state-layer"
            >
              알림받기
            </button>
          </div>
        </form>
      )}

      {submitted && (
        <div className="mt-m3-4 p-m3-3 bg-green-50 dark:bg-green-950/30 rounded-m3-md text-center animate-fade-in">
          <p className="text-body-medium text-green-800 dark:text-green-200">
            ✅ 등록되었습니다! 기능이 출시되면 알려드릴게요.
          </p>
        </div>
      )}
    </div>
  );
}