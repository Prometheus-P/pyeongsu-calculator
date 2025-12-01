# 📊 Google Analytics 4 설정 가이드

**예상 소요 시간**: 15분
**비용**: 무료

---

## 📋 준비사항

- ✅ Google 계정
- ✅ 배포된 사이트 URL
- ⏳ Google Analytics 4 속성 (아래에서 생성)

---

## Step 1: Google Analytics 4 계정 생성

### 1.1 Google Analytics 접속

1. https://analytics.google.com/ 접속
2. Google 계정으로 로그인
3. **"측정 시작"** 버튼 클릭

### 1.2 계정 만들기

**계정 이름** 입력:
```
계정 이름: 평수 계산기 또는 원하는 이름
```

**계정 데이터 공유 설정**:
- 체크박스는 기본값 유지 (선택사항)
- **"다음"** 클릭

### 1.3 속성 만들기

**속성 이름** 및 설정:
```
속성 이름: 평수 계산기 웹사이트
보고 시간대: 대한민국 (GMT+09:00)
통화: 대한민국 원 (₩)
```

**"다음"** 클릭

### 1.4 비즈니스 정보

다음 정보 입력 (선택사항, 스킵 가능):
```
업종: 기타
비즈니스 규모: 소규모
사용 목적: 사이트/앱 사용 측정
```

**"만들기"** 클릭

### 1.5 약관 동의

- **대한민국** 선택
- 약관 동의 체크
- **"동의함"** 클릭

---

## Step 2: 데이터 스트림 설정

### 2.1 웹 스트림 생성

1. **"웹"** 플랫폼 선택 (모바일 앱 아님)
2. 정보 입력:
   ```
   웹사이트 URL: https://pyeongsu-calculator-xxx.pages.dev
   (또는 커스텀 도메인이 있으면: https://pyeongsu-calculator.kr)

   스트림 이름: 평수 계산기 웹사이트
   ```
3. **"스트림 만들기"** 클릭

### 2.2 측정 ID 확인

화면 오른쪽 상단에 **측정 ID** 표시:
```
G-XXXXXXXXXX
```

**이 ID를 복사**하세요! (Cloudflare 환경 변수에 사용)

---

## Step 3: Cloudflare Pages 환경 변수 설정

### 3.1 환경 변수 추가

1. Cloudflare 대시보드 접속
2. **Workers & Pages** → 프로젝트 선택
3. **Settings** 탭 → **Environment variables** 섹션
4. **Add variable** 클릭
5. 변수 추가:
   ```
   Variable name: PUBLIC_GA_MEASUREMENT_ID
   Value: G-XXXXXXXXXX (위에서 복사한 측정 ID)
   ```
6. **Production** 환경 선택
7. **Save** 클릭

### 3.2 재배포

환경 변수 변경 시 **자동 재배포 안 됨**:

1. **Deployments** 탭 클릭
2. 최신 배포 찾기
3. **···** (점 3개) 클릭 → **Retry deployment** 선택
4. 재배포 완료 대기 (1-2분)

---

## Step 4: Analytics 코드 추가 (선택사항)

### 4.1 코드 확인

프로젝트에 이미 Google Analytics 코드가 포함되어 있는지 확인:

```bash
# 프로젝트 디렉토리에서
grep -r "gtag" src/
```

### 4.2 코드 추가 (없는 경우)

**`src/layouts/BaseLayout.astro`** 또는 공통 레이아웃에 추가:

```astro
---
const gaId = import.meta.env.PUBLIC_GA_MEASUREMENT_ID;
---

<head>
  <!-- Google Analytics -->
  {gaId && (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '{gaId}');
      </script>
    </>
  )}
</head>
```

**주의**: 현재 프로젝트에 이미 포함되어 있을 수 있으니 중복 추가하지 마세요!

---

## Step 5: 데이터 수집 확인

### 5.1 실시간 보고서 확인

1. Google Analytics 대시보드
2. 왼쪽 사이드바 → **보고서** → **실시간**
3. 새 창에서 본인 사이트 접속
4. **1-2분 내**에 실시간 사용자 1명 표시되어야 함

### 5.2 테스트

사이트에서 다음 액션 수행:
- ✅ 페이지 이동
- ✅ 계산기 사용
- ✅ 빠른 버튼 클릭

실시간 보고서에서 이벤트 확인

---

## Step 6: 고급 설정 (선택사항)

### 6.1 이벤트 추가 (추천)

사용자 행동을 더 자세히 추적:

```typescript
// src/utils/analytics.ts
export const trackCalculation = (type: 'sqm_to_pyeong' | 'pyeong_to_sqm', value: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'calculation', {
      calculation_type: type,
      value: value,
    });
  }
};

export const trackQuickButton = (pyeong: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'quick_button_click', {
      pyeong_value: pyeong,
    });
  }
};
```

**사용 예시**:
```typescript
import { trackCalculation } from '../utils/analytics';

// 계산 완료 시
trackCalculation('sqm_to_pyeong', sqmValue);
```

### 6.2 전환 이벤트 설정

중요한 이벤트를 전환으로 표시:

1. Google Analytics → **관리** → **이벤트**
2. **전환으로 표시할 이벤트** 선택
3. 전환으로 표시 토글 활성화

### 6.3 맞춤 측정기준

사용자 속성 추가:

1. **관리** → **맞춤 정의** → **맞춤 측정기준**
2. **맞춤 측정기준 만들기** 클릭
3. 예시:
   ```
   측정기준 이름: 계산 유형
   범위: 이벤트
   이벤트 매개변수: calculation_type
   ```

---

## 🎯 설정 완료!

### ✅ 완료된 항목

- [x] Google Analytics 4 계정 생성
- [x] 웹 데이터 스트림 생성
- [x] 측정 ID 발급 및 설정
- [x] Cloudflare 환경 변수 추가
- [x] 데이터 수집 확인

### 📊 이제 확인할 수 있는 데이터

- 방문자 수 (일별, 주별, 월별)
- 페이지별 조회수
- 사용자 위치 (국가, 도시)
- 디바이스 정보 (모바일, 데스크톱)
- 트래픽 소스 (검색, 직접 방문, 소셜)
- 실시간 사용자 수

---

## 📝 다음 단계

1. **Google Search Console 연동**
   - Analytics와 연동하면 검색 성능 데이터 확인 가능
   - `docs/google-search-console-setup.md` 참고

2. **보고서 대시보드 설정**
   - 자주 보는 보고서 북마크
   - 맞춤 보고서 생성

3. **알림 설정**
   - 트래픽 급증/급락 알림
   - 주간 요약 이메일 수신

---

## 🆘 문제 해결

### 실시간 데이터가 표시되지 않음

1. **브라우저 확인**:
   - 광고 차단기 비활성화
   - 시크릿 모드에서 테스트

2. **환경 변수 확인**:
   ```bash
   # 브라우저 개발자 도구 Console에서
   console.log(import.meta.env.PUBLIC_GA_MEASUREMENT_ID)
   # G-XXXXXXXXXX 형식으로 표시되어야 함
   ```

3. **재배포 확인**:
   - Cloudflare에서 재배포 완료했는지 확인
   - 브라우저 캐시 삭제

### 측정 ID를 잊어버렸을 때

1. Google Analytics → **관리** 클릭
2. **속성** 열 → **데이터 스트림** 클릭
3. 웹 스트림 클릭 → 측정 ID 확인

---

## 📚 참고 자료

- [Google Analytics 4 공식 문서](https://support.google.com/analytics/answer/9304153)
- [GA4 이벤트 추적 가이드](https://developers.google.com/analytics/devguides/collection/gtagjs/events)
- [Astro Analytics 통합](https://docs.astro.build/en/guides/integrations-guide/analytics/)

---

**축하합니다! 이제 사이트 트래픽을 추적할 수 있습니다.** 📊
