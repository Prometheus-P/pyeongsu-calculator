# 🔍 Google Search Console & Naver 설정 가이드

**예상 소요 시간**: 20분
**비용**: 무료

---

## Part 1: Google Search Console

### 📋 준비사항

- ✅ Google 계정
- ✅ 배포된 사이트 URL
- ✅ Cloudflare Pages 접근 권한

---

## Step 1: Google Search Console 등록

### 1.1 Search Console 접속

1. https://search.google.com/search-console 접속
2. Google 계정으로 로그인
3. **"시작하기"** 클릭

### 1.2 속성 추가

**URL 접두어** 방식 선택 (권장):

```
https://pyeongsu-calculator-xxx.pages.dev
(또는 커스텀 도메인: https://pyeongsu-calculator.kr)
```

**"계속"** 클릭

---

## Step 2: 소유권 확인

### 2.1 HTML 태그 방식 선택

**소유권 확인** 화면에서:
1. **"HTML 태그"** 방식 선택
2. 다음과 같은 코드가 표시됨:
   ```html
   <meta name="google-site-verification" content="xxxxxxxxxxxxxxxxx" />
   ```
3. **`content` 값만 복사**: `xxxxxxxxxxxxxxxxx`

**확인 버튼을 누르지 마세요!** (나중에 누름)

### 2.2 Cloudflare 환경 변수 추가

1. Cloudflare 대시보드 → 프로젝트 → **Settings** → **Environment variables**
2. **Add variable** 클릭:
   ```
   Variable name: GOOGLE_SITE_VERIFICATION
   Value: xxxxxxxxxxxxxxxxx (위에서 복사한 값)
   ```
3. **Production** 환경 선택
4. **Save** 클릭

### 2.3 메타 태그 추가 (프로젝트에 코드 추가 필요)

**Option A: Layout 파일에 직접 추가**

`src/layouts/BaseLayout.astro` 또는 공통 레이아웃:

```astro
---
const googleVerification = import.meta.env.GOOGLE_SITE_VERIFICATION;
---

<head>
  <!-- Google Search Console 인증 -->
  {googleVerification && (
    <meta name="google-site-verification" content={googleVerification} />
  )}
</head>
```

**Option B: Astro config에서 자동 추가**

`astro.config.mjs`:

```javascript
export default defineConfig({
  // ... 기존 설정

  site: 'https://pyeongsu-calculator.kr',

  integrations: [
    // ... 기존 integrations
  ],

  head: [
    {
      tag: 'meta',
      attrs: {
        name: 'google-site-verification',
        content: import.meta.env.GOOGLE_SITE_VERIFICATION || '',
      },
    },
  ],
});
```

### 2.4 재배포 및 확인

1. 코드 변경 후 커밋:
   ```bash
   git add .
   git commit -m "feat: add Google Search Console verification"
   git push origin main
   ```

2. Cloudflare Pages 자동 배포 대기 (2-3분)

3. 사이트 접속 → 우클릭 → **"페이지 소스 보기"**
4. `google-site-verification` 메타 태그 확인

### 2.5 소유권 확인 완료

1. Google Search Console 창으로 돌아가기
2. **"확인"** 버튼 클릭
3. ✅ "소유권이 확인됨" 메시지 표시

**실패 시**:
- 메타 태그가 제대로 추가되었는지 확인
- 재배포 완료되었는지 확인
- 5분 정도 대기 후 재시도

---

## Step 3: Sitemap 제출

### 3.1 Sitemap 확인

브라우저에서 접속하여 확인:
```
https://your-site.pages.dev/sitemap-index.xml
```

정상 표시되면 OK! (Astro sitemap 플러그인이 자동 생성)

### 3.2 Search Console에 Sitemap 제출

1. Search Console 왼쪽 사이드바 → **"Sitemaps"** 클릭
2. **"새 사이트맵 추가"** 입력란에 입력:
   ```
   sitemap-index.xml
   ```
3. **"제출"** 클릭
4. 상태: **"성공"** 표시 확인

### 3.3 robots.txt 확인

```
https://your-site.pages.dev/robots.txt
```

내용 확인:
```txt
User-agent: *
Allow: /

Sitemap: https://pyeongsu-calculator.kr/sitemap-index.xml
```

---

## Step 4: 크롤링 요청

### 4.1 URL 검사

1. Search Console 상단 검색바에 URL 입력:
   ```
   https://your-site.pages.dev
   ```
2. **"색인 생성 요청"** 클릭
3. 1-2분 대기 → "색인 생성을 요청함" 메시지 표시

### 4.2 주요 페이지 크롤링 요청

다음 URL들도 동일하게 요청:
- `/` (홈페이지)
- `/guide/pyeong-sqm-guide` (주요 가이드 페이지)
- 기타 중요 페이지

---

## Step 5: 성능 모니터링

### 5.1 대시보드 확인

**보통 2-7일 후** 데이터 수집 시작:

- **실적** 탭: 검색 노출, 클릭 수, CTR, 평균 게재 순위
- **URL 검사**: 페이지별 색인 상태
- **커버리지**: 색인된 페이지 수

### 5.2 검색어 분석

**검색어 확인**:
1. **실적** 탭 → **쿼리** 확인
2. 어떤 검색어로 사이트가 노출되는지 확인
3. 높은 노출 수 대비 낮은 CTR → 메타 태그 개선 필요

---

## Part 2: Naver Search Advisor

### 📋 준비사항

- ✅ Naver 계정
- ✅ 배포된 사이트 URL

---

## Step 1: Naver Search Advisor 등록

### 1.1 Search Advisor 접속

1. https://searchadvisor.naver.com/ 접속
2. Naver 계정으로 로그인
3. **"웹마스터 도구 사용하기"** 클릭

### 1.2 사이트 등록

1. **"사이트 등록"** 버튼 클릭
2. URL 입력:
   ```
   https://pyeongsu-calculator-xxx.pages.dev
   ```
3. **"확인"** 클릭

---

## Step 2: 소유권 확인

### 2.1 HTML 태그 방식 선택

1. **"HTML 태그"** 선택
2. 다음과 같은 코드 표시:
   ```html
   <meta name="naver-site-verification" content="yyyyyyyyyyyyy" />
   ```
3. **`content` 값만 복사**: `yyyyyyyyyyyyy`

### 2.2 Cloudflare 환경 변수 추가

1. Cloudflare 대시보드 → **Environment variables**
2. **Add variable**:
   ```
   Variable name: NAVER_SITE_VERIFICATION
   Value: yyyyyyyyyyyyy
   ```
3. **Save** 클릭

### 2.3 메타 태그 추가

`src/layouts/BaseLayout.astro`:

```astro
---
const naverVerification = import.meta.env.NAVER_SITE_VERIFICATION;
---

<head>
  <!-- Naver Search Advisor 인증 -->
  {naverVerification && (
    <meta name="naver-site-verification" content={naverVerification} />
  )}
</head>
```

### 2.4 재배포 및 확인

```bash
git add .
git commit -m "feat: add Naver Search Advisor verification"
git push origin main
```

배포 완료 후 Search Advisor에서 **"소유 확인"** 클릭

---

## Step 3: 사이트 간단 체크

### 3.1 사이트 간단 체크 실행

1. Search Advisor → **"사이트 간단 체크"** 메뉴
2. **"체크 시작"** 클릭
3. 결과 확인:
   - 로봇 룰 체크
   - 사이트맵 체크
   - RSS 체크
   - Open Graph 체크

### 3.2 개선사항 적용

체크 결과에 따라 개선

---

## Step 4: 사이트맵 제출

### 4.1 사이트맵 제출

1. **"요청"** → **"사이트맵 제출"** 클릭
2. URL 입력:
   ```
   https://your-site.pages.dev/sitemap-index.xml
   ```
3. **"확인"** 클릭

### 4.2 RSS 제출 (선택사항)

블로그/뉴스 사이트가 아니면 스킵

---

## Step 5: 수집 요청

### 5.1 수집 요청

1. **"요청"** → **"웹 페이지 수집"** 클릭
2. URL 입력:
   ```
   https://your-site.pages.dev
   ```
3. **"확인"** 클릭
4. 하루 최대 10개 URL 요청 가능

---

## 🎯 설정 완료!

### ✅ 완료된 항목

**Google Search Console**:
- [x] 소유권 확인
- [x] Sitemap 제출
- [x] 크롤링 요청

**Naver Search Advisor**:
- [x] 소유권 확인
- [x] 사이트맵 제출
- [x] 수집 요청

### 📊 이제 확인할 수 있는 데이터

**Google**:
- 검색 노출 수
- 클릭 수 및 CTR
- 평균 게재 순위
- 검색어 분석

**Naver**:
- 수집 현황
- 검색 반영 현황
- 유입 키워드

---

## 📝 다음 단계

### 1주일 후:
- 색인 상태 확인
- 검색 노출 확인

### 1개월 후:
- 검색어 성과 분석
- 메타 태그 최적화
- 콘텐츠 개선

---

## 🆘 문제 해결

### Google: 소유권 확인 실패

1. 메타 태그 확인 (페이지 소스 보기)
2. 환경 변수 재확인
3. 5분 대기 후 재시도
4. 다른 확인 방법 시도 (DNS, 파일 업로드)

### Naver: 수집 안 됨

1. robots.txt 확인 (`Allow: /` 설정)
2. 사이트맵 정상 확인
3. 1-2주 대기 (Naver는 느림)
4. 수집 요청 재시도

### 색인 생성 안 됨

- **정상**: 신규 사이트는 1-4주 소요
- **조치**: 고품질 콘텐츠 추가
- **외부 링크**: 다른 사이트에서 링크 확보

---

## 📚 참고 자료

- [Google Search Console 고객센터](https://support.google.com/webmasters/)
- [Naver Search Advisor 가이드](https://searchadvisor.naver.com/guide)
- [SEO 초보자 가이드](https://developers.google.com/search/docs/beginner/seo-starter-guide)

---

**검색엔진 등록 완료! 이제 검색 결과에 나타나기를 기다리세요.** 🔍
