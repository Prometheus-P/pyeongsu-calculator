/**
 * src/components/SizeRecommendationCard.tsx
 * [Confidence System]
 * 사용자의 평수 선택에 대한 "확신"을 제공하는 컴포넌트
 * - 가족 구성 기반 적합성 평가
 * - 사회적 증거 (비슷한 가족 구성의 선택 비율)
 * - 대안 평수 제안
 */

import type { FamilyType } from '../utils/insightGenerator';

interface SizeRecommendationCardProps {
  pyeong: number;
  familyType: FamilyType;
}

// 가족 구성별 추천 평수 범위
const RECOMMENDATIONS = {
  single: { min: 7, optimal: 10, comfort: 15 },
  couple: { min: 13, optimal: 18, comfort: 25 },
  family_3: { min: 20, optimal: 25, comfort: 32 },
  family_4: { min: 25, optimal: 32, comfort: 40 },
} as const;

// 사회적 증거 데이터 (실제 서비스에서는 API로 대체)
const SOCIAL_PROOF = {
  single: { popular: 10, percentage: 67, sampleSize: 892 },
  couple: { popular: 18, percentage: 74, sampleSize: 1247 },
  family_3: { popular: 25, percentage: 71, sampleSize: 983 },
  family_4: { popular: 32, percentage: 82, sampleSize: 1156 },
} as const;

const FAMILY_LABELS: Record<FamilyType, string> = {
  single: '1인 가구',
  couple: '2인 가구',
  family_3: '3인 가족',
  family_4: '4인+ 가족',
};

type RecommendationLevel = 'too_small' | 'minimal' | 'optimal' | 'spacious' | 'luxury';

function getRecommendationLevel(pyeong: number, familyType: FamilyType): RecommendationLevel {
  const rec = RECOMMENDATIONS[familyType];

  if (pyeong < rec.min) return 'too_small';
  if (pyeong < rec.optimal) return 'minimal';
  if (pyeong < rec.comfort) return 'optimal';
  if (pyeong < rec.comfort + 10) return 'spacious';
  return 'luxury';
}

const LEVEL_CONFIG: Record<RecommendationLevel, {
  icon: string;
  title: string;
  message: (familyLabel: string, pyeong: number) => string;
  bgClass: string;
  borderClass: string;
  textClass: string;
}> = {
  too_small: {
    icon: '⚠️',
    title: '공간이 부족해요',
    message: (family, pyeong) => `${pyeong}평은 ${family} 기준 최소 권장 면적보다 작습니다`,
    bgClass: 'bg-red-50 dark:bg-red-950/30',
    borderClass: 'border-red-200 dark:border-red-800',
    textClass: 'text-red-800 dark:text-red-200',
  },
  minimal: {
    icon: '🤔',
    title: '가능하지만 효율적 배치 필요',
    message: (family, pyeong) => `${pyeong}평에서 ${family}이 생활하려면 미니멀한 라이프스타일이 필요합니다`,
    bgClass: 'bg-amber-50 dark:bg-amber-950/30',
    borderClass: 'border-amber-200 dark:border-amber-800',
    textClass: 'text-amber-800 dark:text-amber-200',
  },
  optimal: {
    icon: '✅',
    title: '적합한 선택입니다',
    message: (family, pyeong) => `${pyeong}평은 ${family}에게 가장 합리적인 선택입니다`,
    bgClass: 'bg-green-50 dark:bg-green-950/30',
    borderClass: 'border-green-200 dark:border-green-800',
    textClass: 'text-green-800 dark:text-green-200',
  },
  spacious: {
    icon: '🏠',
    title: '넉넉한 공간이에요',
    message: (family, pyeong) => `${pyeong}평은 ${family}에게 여유로운 생활을 보장합니다`,
    bgClass: 'bg-blue-50 dark:bg-blue-950/30',
    borderClass: 'border-blue-200 dark:border-blue-800',
    textClass: 'text-blue-800 dark:text-blue-200',
  },
  luxury: {
    icon: '🏰',
    title: '프리미엄 공간',
    message: (_family, pyeong) => `${pyeong}평이면 공간의 자유를 마음껏 누릴 수 있습니다`,
    bgClass: 'bg-purple-50 dark:bg-purple-950/30',
    borderClass: 'border-purple-200 dark:border-purple-800',
    textClass: 'text-purple-800 dark:text-purple-200',
  },
};

export default function SizeRecommendationCard({ pyeong, familyType }: SizeRecommendationCardProps) {
  const level = getRecommendationLevel(pyeong, familyType);
  const config = LEVEL_CONFIG[level];
  const familyLabel = FAMILY_LABELS[familyType];
  const socialProof = SOCIAL_PROOF[familyType];
  const rec = RECOMMENDATIONS[familyType];

  // 추천 평수 계산
  const suggestedPyeong = level === 'too_small' || level === 'minimal'
    ? rec.optimal
    : null;

  return (
    <div className={`mt-m3-6 p-m3-4 rounded-m3-lg border ${config.bgClass} ${config.borderClass} animate-fade-in`}>
      {/* 헤더 */}
      <div className="flex items-center gap-m3-2 mb-m3-3">
        <span className="text-xl">{config.icon}</span>
        <h3 className={`text-title-medium font-semibold ${config.textClass}`}>
          {config.title}
        </h3>
      </div>

      {/* 메인 메시지 */}
      <p className={`text-body-medium mb-m3-4 ${config.textClass}`}>
        {config.message(familyLabel, pyeong)}
      </p>

      {/* 사회적 증거 */}
      <div className="flex items-center gap-m3-2 p-m3-3 bg-white/50 dark:bg-black/20 rounded-m3-md mb-m3-3">
        <span className="text-lg">📊</span>
        <div>
          <p className="text-body-medium text-m3-on-surface">
            비슷한 {familyLabel}의 <span className="font-bold text-m3-primary">{socialProof.percentage}%</span>가{' '}
            <span className="font-medium">{socialProof.popular}평</span>을 선택했습니다
          </p>
          <p className="text-label-small text-m3-on-surface-variant">
            (N={socialProof.sampleSize.toLocaleString()} 기준)
          </p>
        </div>
      </div>

      {/* 대안 제안 (공간이 부족하거나 미니멀일 때만) */}
      {suggestedPyeong && (
        <div className="flex items-center gap-m3-2 p-m3-3 bg-m3-primary/10 rounded-m3-md">
          <span className="text-lg">💡</span>
          <p className="text-body-medium text-m3-on-surface">
            여유 공간이 필요하시면{' '}
            <span className="font-bold text-m3-primary">{suggestedPyeong}평</span> 이상을 고려해보세요
          </p>
        </div>
      )}

      {/* 적합한 경우 추가 확신 메시지 */}
      {(level === 'optimal' || level === 'spacious') && (
        <div className="flex items-center gap-m3-2 p-m3-3 bg-m3-primary/10 rounded-m3-md">
          <span className="text-lg">🎯</span>
          <p className="text-body-medium text-m3-on-surface">
            당신의 선택은 <span className="font-bold text-m3-primary">상위 {100 - socialProof.percentage}%</span>의 현명한 결정입니다
          </p>
        </div>
      )}
    </div>
  );
}
