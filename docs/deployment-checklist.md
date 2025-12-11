# 🚀 배포 설정 체크리스트

## 개요
평수 계산기(pyeongsu-calculator) 프로젝트를 프로덕션 환경에 배포하기 위해 필요한 설정 항목들입니다.

---

## 1. Cloudflare Pages 설정

### 1.1 프로젝트 생성 및 연동
- [ ] Cloudflare Pages에서 새 프로젝트 생성
- [ ] GitHub 저장소 연동 (Prometheus-P/pyeongsu-calculator)
- [ ] 프로덕션 브랜치 설정: `main`

### 1.2 빌드 설정
- [ ] **빌드 명령어**: `npm run build`
- [ ] **빌드 출력 디렉토리**: `dist`
- [ ] **Node.js 버전**: `20`
- [ ] **설치 명령어**: `npm ci`

### 1.3 환경 변수 설정
Cloudflare Pages > Settings > Environment Variables에서 다음 환경 변수 추가:

```bash
# Google Analytics 4
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Search Console 인증
GOOGLE_SITE_VERIFICATION=your_verification_code

# Naver Search Advisor 인증
NAVER_SITE_VERIFICATION=your_verification_code

# AdSense (선택사항)
ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXXXX
```

---

## 2. 도메인 및 DNS 설정

### 2.1 도메인 연결
- [ ] Cloudflare Pages에서 커스텀 도메인 추가: `pyeongsu-calculator.kr`
- [ ] DNS 레코드 확인 (CNAME 또는 A 레코드)
- [ ] www 서브도메인 리디렉션 설정 (선택사항)

### 2.2 SSL/TLS 설정
- [ ] SSL/TLS 인증서 자동 발급 확인
- [ ] HTTPS 강제 리디렉션 활성화
- [ ] TLS 1.3 활성화 권장

---

## 3. SEO 및 검색엔진 등록

### 3.1 Google Search Console
- [ ] Google Search Console에 사이트 등록
- [ ] HTML 태그 방식으로 소유권 확인 (GOOGLE_SITE_VERIFICATION 사용)
- [ ] sitemap.xml 제출: `https://pyeongsu-calculator.kr/sitemap-index.xml`
- [ ] robots.txt 확인 및 제출

### 3.2 Naver Search Advisor
- [ ] Naver Search Advisor에 사이트 등록
- [ ] HTML 태그 방식으로 소유권 확인 (NAVER_SITE_VERIFICATION 사용)
- [ ] 사이트맵 제출

### 3.3 SEO 최적화 파일
- [ ] `robots.txt` 파일 생성 및 배포
  ```txt
  User-agent: *
  Allow: /
  Sitemap: https://pyeongsu-calculator.kr/sitemap-index.xml
  ```
- [ ] sitemap.xml 자동 생성 확인 (Astro sitemap 플러그인 활성화됨)
- [ ] Open Graph 메타 태그 확인
- [ ] 구조화된 데이터 (JSON-LD) 추가 검토

---

## 4. 분석 및 모니터링

### 4.1 Google Analytics 4
- [ ] GA4 속성 생성
- [ ] 측정 ID 발급 (G-XXXXXXXXXX)
- [ ] PUBLIC_GA_MEASUREMENT_ID 환경 변수에 설정
- [ ] 데이터 수집 확인

### 4.2 에러 모니터링 (선택사항)
- [ ] Sentry 또는 Cloudflare Web Analytics 설정
- [ ] 에러 알림 설정
- [ ] 소스맵 업로드 설정

### 4.3 성능 모니터링
- [ ] Lighthouse CI 성능 기준 설정
- [ ] Core Web Vitals 모니터링
- [ ] Cloudflare Analytics 활성화

---

## 5. GitHub 시크릿 설정

현재 CI/CD 파이프라인에서 필요한 시크릿:

### 5.1 코드 커버리지
- [ ] `CODECOV_TOKEN`: Codecov 토큰 (codecov.io에서 발급)

### 5.2 배포 관련 (현재 주석 처리됨)
Preview 배포를 활성화하려면:
- [ ] Vercel/Netlify 토큰 설정 (선택사항)

---

## 6. 배포 전 검증

### 6.1 CI/CD 파이프라인 확인
- [ ] Lint 및 Type Check 통과
- [ ] Unit & Integration Tests 통과
- [ ] Security Tests 통과
- [ ] E2E Tests (Chromium, Firefox, WebKit) 통과
- [ ] Build 성공 확인

### 6.2 로컬 프로덕션 빌드 테스트
```bash
npm run build
npm run preview
```
- [ ] 빌드 에러 없음
- [ ] 프리뷰 서버에서 정상 작동
- [ ] 모든 기능 테스트 (계산기, 빠른 버튼 등)

### 6.3 성능 확인
```bash
npm install -g @lhci/cli
lhci autorun --collect.url=http://localhost:4173
```
- [ ] Performance > 90
- [ ] Accessibility > 90
- [ ] Best Practices > 90
- [ ] SEO > 90

---

## 7. 배포 후 확인사항

### 7.1 기능 검증
- [ ] 메인 페이지 로드 확인
- [ ] 제곱미터 → 평 변환 동작
- [ ] 평 → 제곱미터 변환 동작
- [ ] 빠른 평형 버튼 동작
- [ ] 모바일 반응형 디자인 확인

### 7.2 SEO 검증
- [ ] 메타 태그 정상 표시
- [ ] Open Graph 이미지 로드 확인
- [ ] sitemap.xml 접근 가능
- [ ] robots.txt 접근 가능

### 7.3 분석 도구 확인
- [ ] Google Analytics 실시간 데이터 수집 확인
- [ ] Search Console 크롤링 요청
- [ ] Naver Search Advisor 크롤링 요청

---

## 8. 보안 및 최적화

### 8.1 보안 헤더 설정
Cloudflare Pages > Settings > Security Headers:
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] Referrer-Policy: strict-origin-when-cross-origin
- [ ] Permissions-Policy 설정

### 8.2 캐싱 정책
- [ ] 정적 자산 캐싱 설정 (CSS, JS, 이미지)
- [ ] HTML 캐싱 정책 확인
- [ ] CDN 캐시 purge 방법 확인

### 8.3 성능 최적화
- [ ] 이미지 최적화 (WebP, AVIF 포맷)
- [ ] CSS/JS 번들 사이즈 확인
- [ ] Tree-shaking 적용 확인
- [ ] Code splitting 적용 검토

---

## 9. 문서화

- [ ] 배포 프로세스 문서화
- [ ] 환경 변수 관리 가이드 작성
- [ ] 롤백 프로세스 문서화
- [ ] 장애 대응 가이드 작성

---

## 10. AdSense 설정 (선택사항)

### 10.1 AdSense 계정 설정
- [ ] Google AdSense 계정 생성
- [ ] 사이트 등록 및 승인 대기
- [ ] 게시자 ID 발급 (ca-pub-XXXXXXXXXXXXXXXX)
- [ ] ADSENSE_PUBLISHER_ID 환경 변수 설정

### 10.2 광고 단위 생성
- [ ] 자동 광고 또는 수동 광고 단위 선택
- [ ] 광고 배치 최적화
- [ ] 광고 정책 준수 확인

---

## 참고 링크

- [Cloudflare Pages 문서](https://developers.cloudflare.com/pages/)
- [Astro 배포 가이드](https://docs.astro.build/en/guides/deploy/cloudflare/)
- [Google Search Console](https://search.google.com/search-console)
- [Naver Search Advisor](https://searchadvisor.naver.com/)
- [Google Analytics 4](https://analytics.google.com/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

## 우선순위

### 🔴 필수 (배포 전 완료)
1. Cloudflare Pages 설정 (1.1, 1.2)
2. 도메인 연결 및 SSL (2.1, 2.2)
3. CI/CD 파이프라인 통과 (6.1)
4. 로컬 프로덕션 빌드 테스트 (6.2)
5. 배포 후 기능 검증 (7.1)

### 🟡 중요 (배포 후 1주일 내)
1. 환경 변수 설정 (1.3)
2. SEO 및 검색엔진 등록 (3.1, 3.2, 3.3)
3. Google Analytics 설정 (4.1)
4. 보안 헤더 설정 (8.1)
5. 배포 후 SEO 검증 (7.2)

### 🟢 권장 (배포 후 1개월 내)
1. 에러 모니터링 설정 (4.2)
2. 성능 모니터링 설정 (4.3)
3. 성능 최적화 (8.3)
4. 문서화 (9)
5. AdSense 설정 (10) - 선택사항
