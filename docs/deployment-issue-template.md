---
title: "🚀 프로덕션 배포를 위한 설정 및 체크리스트"
labels: deployment, infrastructure, seo
assignees:
---

## 📋 개요

평수 계산기 v2.0.0을 프로덕션 환경에 배포하기 위한 설정 작업 추적 이슈입니다.

**목표 도메인**: https://pyeongsu-calculator.kr
**배포 플랫폼**: Cloudflare Pages
**현재 상태**: CI/CD 파이프라인 구축 완료, 배포 설정 대기 중

---

## 🎯 배포 전 필수 작업 (Phase 1)

### 1. Cloudflare Pages 초기 설정

- [ ] Cloudflare Pages 프로젝트 생성
- [ ] GitHub 저장소 연동: `Prometheus-P/pyeongsu-calculator`
- [ ] 빌드 설정:
  - 빌드 명령어: `npm run build`
  - 빌드 출력: `dist`
  - Node.js 버전: `20`
  - 프로덕션 브랜치: `main`

### 2. 도메인 및 SSL 설정

- [ ] `pyeongsu-calculator.kr` 도메인 Cloudflare Pages에 연결
- [ ] DNS 레코드 구성 (CNAME/A 레코드)
- [ ] SSL/TLS 인증서 자동 발급 확인
- [ ] HTTPS 강제 리디렉션 활성화

### 3. 빌드 검증

- [ ] 로컬 프로덕션 빌드 테스트
  ```bash
  npm run build
  npm run preview
  ```
- [ ] CI/CD 파이프라인 통과 확인:
  - [x] Lint & Type Check
  - [x] Unit Tests
  - [x] Security Tests
  - [x] E2E Tests (Chromium, Firefox, WebKit)
  - [x] Build

### 4. 배포 후 기능 검증

- [ ] 메인 페이지 로드 확인
- [ ] 계산기 기능 동작 확인:
  - [ ] 제곱미터 → 평 변환
  - [ ] 평 → 제곱미터 변환
  - [ ] 빠른 평형 버튼
- [ ] 모바일 반응형 확인

---

## 🔧 환경 변수 설정 (Phase 2)

Cloudflare Pages > Settings > Environment Variables

### 필수 환경 변수

```bash
# Google Analytics 4
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Search Console 인증
GOOGLE_SITE_VERIFICATION=

# Naver Search Advisor 인증
NAVER_SITE_VERIFICATION=
```

### 선택 환경 변수

```bash
# Google AdSense (선택사항)
ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXXXX
```

**작업 항목**:
- [ ] Google Analytics 4 속성 생성 및 측정 ID 발급
- [ ] Google Search Console 인증 코드 발급
- [ ] Naver Search Advisor 인증 코드 발급
- [ ] Cloudflare Pages에 환경 변수 등록

---

## 📊 SEO 및 검색엔진 등록 (Phase 3)

### Google Search Console

- [ ] 사이트 등록: `https://pyeongsu-calculator.kr`
- [ ] HTML 태그 방식 소유권 확인
- [ ] Sitemap 제출: `/sitemap-index.xml`
- [ ] 크롤링 요청
- [ ] 색인 생성 확인

### Naver Search Advisor

- [ ] 사이트 등록
- [ ] HTML 태그 방식 소유권 확인
- [ ] Sitemap 제출
- [ ] 검색 수집 요청

### SEO 파일 생성

- [ ] `public/robots.txt` 생성:
  ```txt
  User-agent: *
  Allow: /
  Sitemap: https://pyeongsu-calculator.kr/sitemap-index.xml
  ```
- [ ] sitemap.xml 자동 생성 확인 (Astro sitemap 플러그인 활성화됨 ✅)
- [ ] Open Graph 메타 태그 검증
- [ ] 구조화된 데이터 (JSON-LD) 추가 검토

---

## 📈 분석 및 모니터링 설정 (Phase 4)

### Google Analytics 4

- [ ] GA4 데이터 스트림 설정
- [ ] 이벤트 추적 설정 (계산 실행, 버튼 클릭 등)
- [ ] 실시간 데이터 수집 확인
- [ ] 전환 이벤트 설정 (선택사항)

### 성능 모니터링

- [ ] Lighthouse CI 성능 기준 통과:
  - [ ] Performance > 90
  - [ ] Accessibility > 90
  - [ ] Best Practices > 90
  - [ ] SEO > 90
- [ ] Core Web Vitals 모니터링
- [ ] Cloudflare Analytics 활성화

### 에러 모니터링 (선택사항)

- [ ] Sentry 또는 Cloudflare Web Analytics 설정
- [ ] 에러 알림 채널 구성
- [ ] 소스맵 업로드 설정

---

## 🔒 보안 및 최적화 (Phase 5)

### 보안 헤더 설정

Cloudflare Pages > Settings > Security Headers:

- [ ] `X-Frame-Options: DENY`
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Permissions-Policy` 설정
- [ ] `Content-Security-Policy` 검토

### 캐싱 정책

- [ ] 정적 자산 캐싱 설정 (CSS, JS, 이미지)
- [ ] HTML 캐싱 정책 구성
- [ ] CDN 캐시 Purge 방법 확인

### 성능 최적화

- [ ] 이미지 최적화 (WebP, AVIF)
- [ ] CSS/JS 번들 사이즈 확인 및 최적화
- [ ] Tree-shaking 적용 확인
- [ ] Code splitting 적용 검토

---

## 📝 GitHub 시크릿 설정

Repository Settings > Secrets and variables > Actions:

- [ ] `CODECOV_TOKEN`: Codecov 토큰 (코드 커버리지용)

**선택사항** (Preview 배포 활성화 시):
- [ ] Vercel/Netlify 토큰

---

## ✅ 배포 후 검증 체크리스트

### 기능 테스트
- [ ] 모든 계산 기능 정상 동작
- [ ] 빠른 버튼 동작
- [ ] 참고표 표시
- [ ] 입력 검증 동작
- [ ] 키보드 접근성 (Tab, Enter)

### SEO 검증
- [ ] Meta 태그 정상 표시
- [ ] Open Graph 이미지 로드
- [ ] `/sitemap-index.xml` 접근 가능
- [ ] `/robots.txt` 접근 가능
- [ ] 구조화된 데이터 검증 (Google Rich Results Test)

### 분석 도구 확인
- [ ] Google Analytics 실시간 사용자 확인
- [ ] Search Console 크롤링 확인
- [ ] Naver Search Advisor 수집 확인

### 성능 테스트
- [ ] Lighthouse 점수 확인
- [ ] 페이지 로드 시간 < 2초
- [ ] First Contentful Paint < 1.5초
- [ ] Largest Contentful Paint < 2.5초

---

## 📚 문서화 작업

- [ ] 배포 프로세스 문서 작성
- [ ] 환경 변수 관리 가이드
- [ ] 롤백 프로세스 문서
- [ ] 장애 대응 가이드
- [ ] README.md 업데이트 (배포 URL 추가)

---

## 🎁 선택 작업 (AdSense)

### Google AdSense 설정

- [ ] AdSense 계정 생성
- [ ] 사이트 등록 및 승인 신청
- [ ] 게시자 ID 발급
- [ ] 광고 단위 생성 및 배치
- [ ] 광고 정책 준수 검토

---

## 📅 타임라인

| Phase | 작업 | 예상 소요 | 우선순위 |
|-------|------|----------|---------|
| Phase 1 | 배포 전 필수 작업 | 1일 | 🔴 필수 |
| Phase 2 | 환경 변수 설정 | 0.5일 | 🔴 필수 |
| Phase 3 | SEO 및 검색엔진 등록 | 1일 | 🟡 중요 |
| Phase 4 | 분석 및 모니터링 | 1일 | 🟡 중요 |
| Phase 5 | 보안 및 최적화 | 1일 | 🟢 권장 |

**총 예상 소요**: 3~5일

---

## 🔗 참고 링크

- [Cloudflare Pages 문서](https://developers.cloudflare.com/pages/)
- [Astro Cloudflare 배포 가이드](https://docs.astro.build/en/guides/deploy/cloudflare/)
- [Google Search Console](https://search.google.com/search-console)
- [Naver Search Advisor](https://searchadvisor.naver.com/)
- [Google Analytics 4](https://analytics.google.com/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

## 📎 관련 파일

- 상세 체크리스트: [`docs/deployment-checklist.md`](./deployment-checklist.md)
- 환경 변수 예시: [`.env.example`](../.env.example)
- CI/CD 설정: [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)
- Astro 설정: [`astro.config.mjs`](../astro.config.mjs)

---

## 💬 노트

- Cloudflare Pages는 GitHub 연동 시 자동 배포되므로 별도의 배포 스크립트 불필요
- main 브랜치 push 시 자동으로 프로덕션 배포
- PR 생성 시 Preview 배포 자동 생성 (Cloudflare 자체 기능)
- 현재 CI/CD 파이프라인은 모든 테스트 통과 시에만 배포 진행

---

## ✨ 완료 조건

이 이슈는 다음 조건이 모두 충족되면 닫습니다:

1. ✅ Phase 1 (배포 전 필수 작업) 100% 완료
2. ✅ Phase 2 (환경 변수 설정) 100% 완료
3. ✅ Phase 3 (SEO 및 검색엔진 등록) 100% 완료
4. ✅ https://pyeongsu-calculator.kr 정상 접속 및 기능 동작
5. ✅ Google 및 Naver 검색 엔진에 색인 확인
