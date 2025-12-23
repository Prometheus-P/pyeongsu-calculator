/**
 * 도발적 트리거 메시지 생성기
 * "Data Dam" 전략의 핵심 - 사용자의 공간적 불안을 자극
 */

export type FamilyType = 'single' | 'couple' | 'family_3' | 'family_4';

interface TriggerResult {
  message: string;
  level: 'danger' | 'warning' | 'success' | 'luxury';
  icon: string;
}

// 제1원칙: 인간답게 살기 위한 최소 1인당 평수(약 7~8평)를 기준
const THRESHOLDS = {
  single: { min: 7, comfort: 12 },
  couple: { min: 13, comfort: 20 },
  family_3: { min: 20, comfort: 28 },
  family_4: { min: 25, comfort: 34 },
} as const;

const FAMILY_NAMES: Record<FamilyType, string> = {
  single: '1인 가구',
  couple: '신혼부부',
  family_3: '3인 가족',
  family_4: '4인 가족',
};

export const getProvocativeMessage = (pyeong: number, familyType: FamilyType): TriggerResult => {
  const limit = THRESHOLDS[familyType];
  const familyName = FAMILY_NAMES[familyType];

  if (pyeong < limit.min) {
    return {
      message: `이 평수는 ${familyName}에게 '주거'가 아니라 '생존'입니다. 수납공간이 전쟁터가 될 것입니다.`,
      level: 'danger',
      icon: '⚠️',
    };
  }

  if (pyeong < limit.comfort) {
    return {
      message: `${familyName}이 살 수 있지만, 미니멀리스트가 되어야 합니다. 짐을 30% 줄일 각오가 되셨습니까?`,
      level: 'warning',
      icon: '🤔',
    };
  }

  if (pyeong < limit.comfort + 10) {
    return {
      message: `${familyName}에게 가장 합리적인 선택입니다. 하지만 가구 배치는 신중해야 합니다.`,
      level: 'success',
      icon: '✅',
    };
  }

  return {
    message: `축하합니다. 공간의 자유를 누릴 수 있습니다. 인테리어 견적이 꽤 나오겠군요.`,
    level: 'luxury',
    icon: '🏰',
  };
};

/**
 * 공유용 도발적 텍스트 생성
 */
export const getShareableText = (pyeong: number, familyType: FamilyType): string => {
  const result = getProvocativeMessage(pyeong, familyType);
  const familyName = FAMILY_NAMES[familyType];

  if (result.level === 'danger') {
    return `${pyeong}평에 ${familyName}이 산다고? 숨 쉴 공간이 없을 것 같은데... 너도 한번 체크해봐 👉`;
  }

  if (result.level === 'warning') {
    return `${pyeong}평, ${familyName} 기준으로 '미니멀리스트 강제 전환' 필요하대 😅 너희 집은 어때?`;
  }

  if (result.level === 'success') {
    return `${pyeong}평이면 ${familyName}에게 딱 적당하대! 우리 집 진단 결과 확인해봐 👉`;
  }

  return `${pyeong}평... 부럽다 진짜. ${familyName} 기준 '공간 자유' 등급이래 🏰`;
};
