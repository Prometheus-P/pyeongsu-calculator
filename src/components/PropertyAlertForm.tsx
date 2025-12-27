/**
 * src/components/PropertyAlertForm.tsx
 * [Soft CTA - Data Collection]
 * 낮은 commitment로 이메일을 수집하는 "매물 알림" 폼
 * - 사용자가 부담 없이 이메일을 남길 수 있는 진입점
 * - 추후 마케팅/리타게팅 활용
 */

import { useState } from 'react';
import { TextField } from './m3';

interface PropertyAlertFormProps {
  pyeong: number;
}

export default function PropertyAlertForm({ pyeong }: PropertyAlertFormProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) return;

    setIsSubmitting(true);

    // Fake Door: 실제 저장은 하지 않고 로그만 기록
    console.log('[Data Dam] Property alert signup:', {
      pyeong,
      email,
      timestamp: new Date().toISOString(),
    });

    // 짧은 딜레이로 실제 전송 느낌
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mt-m3-6 p-m3-4 bg-green-50 dark:bg-green-950/30 rounded-m3-lg border border-green-200 dark:border-green-800 animate-fade-in">
        <div className="flex items-center gap-m3-2 mb-m3-2">
          <span className="text-xl">✅</span>
          <p className="text-body-large font-medium text-green-800 dark:text-green-200">
            알림 신청 완료!
          </p>
        </div>
        <p className="text-body-medium text-green-700 dark:text-green-300">
          {Math.round(pyeong)}평 신규 매물이 나오면 가장 먼저 알려드릴게요.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-m3-6 p-m3-4 bg-m3-surface-variant/50 rounded-m3-lg border border-m3-outline-variant">
      {/* 헤더 */}
      <div className="flex items-center gap-m3-2 mb-m3-3">
        <span className="text-xl">📬</span>
        <h3 className="text-title-medium font-semibold text-m3-on-surface">
          {Math.round(pyeong)}평 신규 매물 알림
        </h3>
      </div>

      {/* 설명 */}
      <p className="text-body-medium text-m3-on-surface-variant mb-m3-4">
        원하는 평수의 새 매물이 나오면 이메일로 알려드려요.
      </p>

      {/* 폼 */}
      <form onSubmit={handleSubmit} className="flex gap-m3-2">
        <div className="flex-1">
          <TextField
            type="email"
            label="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            containerClassName="mb-0"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="self-start mt-m3-2 px-m3-4 py-m3-3 bg-m3-primary text-m3-on-primary font-medium text-label-large rounded-m3-md m3-state-layer hover:shadow-m3-1 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {isSubmitting ? '신청 중...' : '알림 신청'}
        </button>
      </form>

      {/* 신뢰 요소 */}
      <p className="text-label-small text-m3-on-surface-variant mt-m3-3 flex items-center gap-m3-1">
        <span>🔒</span>
        스팸 없음 · 언제든 해지 가능
      </p>
    </div>
  );
}
