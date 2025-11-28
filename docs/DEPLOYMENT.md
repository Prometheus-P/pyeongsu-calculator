# Cloudflare Pages 배포 가이드

## 1. Cloudflare Pages 프로젝트 생성

### GitHub 연동 방식 (권장)

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) 접속
2. Workers & Pages > Create application > Pages 탭 선택
3. Connect to Git > GitHub 연결
4. 저장소 선택: `pyeongsu-calculator`
5. 빌드 설정:
   - Framework preset: `Astro`
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/` (기본값)

### 빌드 설정 확인

| 항목 | 값 |
|------|-----|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js version | 18+ |

## 2. 환경 변수 설정

Cloudflare Pages > Settings > Environment variables에서 다음 변수를 설정:

### Production 환경

| 변수명 | 값 | 설명 |
|--------|-----|------|
| `PUBLIC_GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` | Google Analytics 4 측정 ID |
| `NODE_VERSION` | `18` | Node.js 버전 |

### Preview 환경 (선택)

Preview 환경에서는 Analytics를 비활성화하거나 별도 ID 사용 가능

## 3. 커스텀 도메인 설정

### DNS 설정 (Cloudflare DNS 사용 시)

1. Pages > 프로젝트 선택 > Custom domains
2. `pyeongsu-calculator.kr` 추가
3. Cloudflare DNS에서 자동으로 CNAME 레코드 생성됨

### 외부 DNS 사용 시

DNS 제공업체에서 CNAME 레코드 추가:
```
CNAME @ pyeongsu-calculator.pages.dev
CNAME www pyeongsu-calculator.pages.dev
```

## 4. Google Search Console 연동

### 사이트 등록

1. [Search Console](https://search.google.com/search-console) 접속
2. 속성 추가 > URL 접두어: `https://pyeongsu-calculator.kr`
3. 확인 방법: HTML 태그 선택
4. `content="..."` 부분의 코드 복사
5. `src/components/seo/SEOHead.astro`의 `GOOGLE_CODE_HERE` 교체

### 사이트맵 제출

1. Search Console > 색인 > Sitemaps
2. 새 사이트맵 추가: `sitemap-index.xml`
3. 제출

## 5. Naver Search Advisor 연동

### 사이트 등록

1. [Search Advisor](https://searchadvisor.naver.com/) 접속
2. 사이트 관리 > 사이트 추가
3. `https://pyeongsu-calculator.kr` 입력
4. HTML 태그 인증 선택
5. 인증 코드 복사
6. `src/components/seo/SEOHead.astro`의 `NAVER_CODE_HERE` 교체

### 사이트맵 제출

1. 요청 > 사이트맵 제출
2. `https://pyeongsu-calculator.kr/sitemap-index.xml` 입력
3. 제출

## 6. Google Analytics 연동

### GA4 속성 생성

1. [Google Analytics](https://analytics.google.com/) 접속
2. 관리 > 속성 만들기
3. 속성 이름: `평수 계산기`
4. 데이터 스트림 > 웹 > URL: `pyeongsu-calculator.kr`
5. 측정 ID 복사 (G-XXXXXXXXXX 형식)

### 환경 변수 설정

Cloudflare Pages > Settings > Environment variables:
- 변수 이름: `PUBLIC_GA_MEASUREMENT_ID`
- 값: `G-XXXXXXXXXX` (복사한 측정 ID)

## 7. AdSense 연동 (선택)

### AdSense 승인 후

1. `src/components/ads/AdSlot.astro` 열기
2. `testMode` prop을 `false`로 변경
3. `data-ad-client`를 실제 Publisher ID로 교체
4. 각 광고 슬롯의 `data-ad-slot`을 실제 슬롯 ID로 설정

## 8. 빌드 및 배포

### 자동 배포

GitHub에 push하면 자동으로 배포됩니다:
- `main` 브랜치 → Production 배포
- 기타 브랜치 → Preview 배포

### 수동 배포 (로컬에서)

```bash
# 빌드
npm run build

# Wrangler로 배포 (Cloudflare CLI)
npx wrangler pages deploy dist
```

## 9. 배포 후 체크리스트

- [ ] 사이트 접속 확인
- [ ] 모든 페이지 정상 렌더링 확인
- [ ] 다크모드 동작 확인
- [ ] 평수 계산 기능 테스트
- [ ] 모바일 반응형 확인
- [ ] Search Console 인증 확인
- [ ] Analytics 데이터 수집 확인 (24시간 후)
- [ ] 사이트맵 색인 요청

## 10. 문제 해결

### 빌드 실패 시

1. 로컬에서 `npm run build` 실행하여 에러 확인
2. Node.js 버전 확인 (18+ 필요)
3. 의존성 설치: `npm ci`

### 페이지 404 시

1. `dist` 폴더에 해당 HTML 파일 존재 확인
2. `_redirects` 파일의 리다이렉트 규칙 확인
3. Astro의 trailingSlash 설정 확인

### Analytics 미동작 시

1. 환경 변수 `PUBLIC_GA_MEASUREMENT_ID` 설정 확인
2. 브라우저 개발자 도구 > Network에서 gtag 요청 확인
3. 광고 차단 확장 프로그램 비활성화 후 테스트
