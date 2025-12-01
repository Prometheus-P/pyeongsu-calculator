# 🚀 Cloudflare Pages 배포 가이드

**대상**: 처음 사용자
**예상 소요 시간**: 30분
**비용**: 무료

---

## 📋 준비사항 체크

- ✅ GitHub 저장소: `Prometheus-P/pyeongsu-calculator`
- ✅ 빌드 검증 완료 (CI/CD 통과)
- ⏳ Cloudflare 계정 (아래에서 생성)
- ⏳ 도메인 (선택사항, 나중에 추가 가능)

---

## Step 1: Cloudflare 계정 생성

### 1.1 회원가입

1. **Cloudflare 접속**: https://dash.cloudflare.com/sign-up
2. **이메일 입력** 및 비밀번호 설정
3. **이메일 인증** 완료
4. 로그인

### 1.2 요금제 선택

- **Free 플랜** 선택 (무료)
- Cloudflare Pages는 Free 플랜에서도 무제한 요청/대역폭 제공 ✨

---

## Step 2: Cloudflare Pages 프로젝트 생성

### 2.1 Pages 접속

1. Cloudflare 대시보드 로그인
2. 왼쪽 사이드바에서 **"Workers & Pages"** 클릭
3. **"Create application"** 버튼 클릭
4. **"Pages"** 탭 선택
5. **"Connect to Git"** 클릭

### 2.2 GitHub 연동

1. **"Connect GitHub"** 버튼 클릭
2. GitHub 로그인 (이미 로그인 시 건너뛰기)
3. **권한 승인** 화면에서:
   - "All repositories" 또는
   - "Only select repositories" 선택 후 `pyeongsu-calculator` 선택
4. **"Install & Authorize"** 클릭

### 2.3 저장소 선택

1. 연동된 저장소 목록에서 **`Prometheus-P/pyeongsu-calculator`** 선택
2. **"Begin setup"** 클릭

---

## Step 3: 빌드 설정

### 3.1 프로젝트 설정

**Configuration** 페이지에서 다음 값을 정확히 입력하세요:

```
Project name: pyeongsu-calculator
Production branch: main
```

### 3.2 빌드 명령어 설정

**Build settings**에서 **"Framework preset"** 선택:
- **"Astro"** 선택 (자동으로 값 채워짐)

자동 채워진 값 확인:
```
Build command: npm run build
Build output directory: dist
```

### 3.3 Node.js 버전 설정 (중요!)

**Environment variables (advanced)** 섹션 펼치기:

1. **"Add variable"** 클릭
2. 변수 추가:
   ```
   Variable name: NODE_VERSION
   Value: 20
   ```

### 3.4 배포 시작

- **"Save and Deploy"** 버튼 클릭
- 빌드 로그가 실시간으로 표시됨 (약 2-3분 소요)

---

## Step 4: 배포 확인

### 4.1 빌드 성공 확인

빌드 로그 마지막에 다음과 같은 메시지가 표시되어야 함:

```
✅ Success! Uploaded 16 files
🌐 Deploying...
✨ Success! Your site is live at:
   https://pyeongsu-calculator-xxx.pages.dev
```

### 4.2 사이트 접속 테스트

1. 제공된 URL 클릭 (예: `https://pyeongsu-calculator-xxx.pages.dev`)
2. 평수 계산기가 정상 작동하는지 확인:
   - ✅ 제곱미터 → 평 변환
   - ✅ 평 → 제곱미터 변환
   - ✅ 빠른 평형 버튼 동작
   - ✅ 모바일 반응형 확인

### 4.3 자동 배포 확인

이제부터 **`main` 브랜치에 push하면 자동 배포**됩니다! 🎉

```bash
git push origin main
# → Cloudflare Pages가 자동으로 빌드 및 배포
```

---

## Step 5: 도메인 설정 (선택사항)

### 5.1 커스텀 도메인 없이 사용

- 현재 상태로도 완전히 사용 가능
- 기본 도메인: `https://pyeongsu-calculator-xxx.pages.dev`
- SEO, Analytics 모두 정상 작동

### 5.2 나중에 도메인 추가하기

도메인을 구매한 후:

1. Cloudflare Pages 프로젝트 페이지
2. **"Custom domains"** 탭 클릭
3. **"Set up a custom domain"** 버튼 클릭
4. 도메인 입력: `pyeongsu-calculator.kr`
5. DNS 레코드 안내에 따라 설정

**권장 도메인 구매처**:
- Cloudflare Registrar (가장 저렴, 수수료 없음)
- 가비아 (국내, 한글 지원)
- Namecheap (해외, 저렴)

---

## Step 6: 환경 변수 설정 (선택사항)

Google Analytics 등을 나중에 추가하려면:

1. Cloudflare Pages 프로젝트 페이지
2. **"Settings"** 탭 클릭
3. **"Environment variables"** 섹션 찾기
4. **"Add variable"** 클릭
5. 변수 추가 (예시):
   ```
   Variable name: PUBLIC_GA_MEASUREMENT_ID
   Value: G-XXXXXXXXXX
   ```
6. **"Production"** 환경 선택
7. **"Save"** 클릭
8. **재배포 필요** (자동으로 안 됨):
   - "Deployments" 탭 → 최신 배포 → "Retry deployment"

---

## 🎯 배포 완료!

### ✅ 완료된 항목

- [x] Cloudflare 계정 생성
- [x] Cloudflare Pages 프로젝트 생성
- [x] GitHub 연동
- [x] 자동 배포 설정
- [x] 사이트 배포 완료

### 🌐 배포된 사이트

- **Production URL**: `https://pyeongsu-calculator-xxx.pages.dev`
- **자동 배포**: `main` 브랜치 push 시 자동
- **Preview 배포**: PR 생성 시 자동 생성

---

## 📝 다음 단계 (선택사항)

배포가 완료되었으므로 이제 다음을 진행할 수 있습니다:

### 단기 (배포 후 1주일)

1. **도메인 구매 및 연결** (선택)
   - `pyeongsu-calculator.kr` 구매
   - Cloudflare에 도메인 연결

2. **Google Analytics 4 설정**
   - GA4 속성 생성
   - 측정 ID 발급
   - 환경 변수 추가

3. **Google Search Console 등록**
   - 사이트 소유권 확인
   - sitemap.xml 제출

4. **Naver Search Advisor 등록**
   - 사이트 소유권 확인
   - 사이트맵 제출

### 중기 (배포 후 1개월)

5. **보안 헤더 설정**
   - `_headers` 파일 추가
   - CSP, X-Frame-Options 등 설정

6. **성능 최적화**
   - Cloudflare Analytics 활성화
   - Core Web Vitals 모니터링

7. **에러 모니터링**
   - Sentry 또는 Cloudflare Web Analytics 설정

---

## 🆘 문제 해결

### 빌드 실패 시

**"Command failed with exit code 1"**
```bash
# 로컬에서 빌드 테스트
npm ci
npm run build

# 성공하면 package.json 확인
# 실패하면 에러 메시지 확인
```

**"Node version mismatch"**
- 환경 변수에 `NODE_VERSION=20` 추가 확인

### 사이트 접속 안 됨

1. 빌드가 성공했는지 확인
2. "Deployments" 탭에서 상태 확인
3. 브라우저 캐시 삭제 후 재시도

### 자동 배포 안 됨

1. GitHub Apps 권한 확인
2. Cloudflare Pages 설정에서 브랜치 확인
3. Webhooks 재연결 시도

---

## 📚 참고 자료

- [Cloudflare Pages 공식 문서](https://developers.cloudflare.com/pages/)
- [Astro Cloudflare 배포 가이드](https://docs.astro.build/en/guides/deploy/cloudflare/)
- [Cloudflare Pages 요금제](https://pages.cloudflare.com/) (Free: 무제한!)

---

## ✨ 축하합니다!

평수 계산기가 성공적으로 배포되었습니다! 🎉

이제 전 세계 어디서든 접속 가능합니다.

**다음 단계가 필요하면 언제든 요청하세요.**
