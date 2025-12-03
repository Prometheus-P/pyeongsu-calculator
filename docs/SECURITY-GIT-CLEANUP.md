# Git 히스토리 보안 정리 가이드

## 개요

GitHub에 민감한 정보(API 키, 비밀번호, 개인정보 등)가 실수로 커밋된 경우, 단순히 파일을 삭제하는 것만으로는 히스토리에서 제거되지 않습니다. 이 문서는 Git 히스토리에서 민감한 파일을 완전히 제거하는 방법을 설명합니다.

## 긴급 대응 체크리스트

1. [ ] 노출된 자격 증명 즉시 무효화 (API 키 재생성, 비밀번호 변경)
2. [ ] GitHub에서 해당 시크릿 스캔 알림 확인
3. [ ] 히스토리에서 민감 파일 제거
4. [ ] 협력자에게 알림 및 `git pull --rebase` 요청
5. [ ] 보안 감사 수행

---

## 방법 1: git filter-repo (권장)

### 설치

```bash
# macOS
brew install git-filter-repo

# pip
pip install git-filter-repo
```

### 특정 파일 히스토리에서 완전 제거

```bash
# 백업 생성 (필수!)
git clone --mirror https://github.com/USERNAME/REPO.git backup-repo

# 원본 레포에서 실행
git filter-repo --path .env --invert-paths

# 또는 여러 파일
git filter-repo --path .env --path secrets.json --path api-key.txt --invert-paths
```

### 특정 패턴 제거

```bash
# 모든 .env 파일
git filter-repo --path-glob '*.env' --invert-paths

# 특정 디렉토리
git filter-repo --path secrets/ --invert-paths
```

### 민감한 텍스트 치환

```bash
# expressions.txt 파일 생성
echo 'AKIA1234567890EXAMPLE==>REDACTED' > expressions.txt
echo 'password123==>REDACTED' >> expressions.txt

# 실행
git filter-repo --replace-text expressions.txt
```

### 강제 푸시

```bash
git push origin --force --all
git push origin --force --tags
```

---

## 방법 2: BFG Repo-Cleaner (대용량 레포 추천)

### 설치

```bash
# macOS
brew install bfg
```

### 사용법

```bash
# 미러 클론
git clone --mirror https://github.com/USERNAME/REPO.git

# 특정 파일 제거
bfg --delete-files .env repo.git

# 특정 텍스트 치환
echo 'YOUR_API_KEY' > passwords.txt
bfg --replace-text passwords.txt repo.git

# 정리 및 푸시
cd repo.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

---

## 방법 3: GitHub 지원팀 요청

캐시된 뷰(포크, PR, 이슈 코멘트)에서도 완전히 제거하려면:

1. [GitHub Support](https://support.github.com/contact) 연락
2. "Security" 카테고리 선택
3. 제거할 커밋 SHA 제공
4. 민감 정보 유형 설명

---

## 사후 조치

### 1. 협력자 알림

```bash
# 팀원에게 전달
git fetch origin
git reset --hard origin/main
# 또는
git pull --rebase
```

### 2. GitHub 캐시 무효화

```bash
# GitHub에 캐시 퍼지 요청 (Support 통해)
# 또는 레포를 비공개로 변경 후 다시 공개
```

### 3. 보호 브랜치 재설정

```bash
# GitHub Settings > Branches > Branch protection rules 재설정
```

---

## 예방 조치

### 1. pre-commit 훅 설정

```bash
# .git/hooks/pre-commit
#!/bin/sh
if git diff --cached --name-only | grep -E '\.env$|\.key$|\.pem$|secret'; then
    echo "ERROR: Attempting to commit sensitive file!"
    exit 1
fi
```

### 2. GitHub Secret Scanning 활성화

Repository Settings > Security > Secret scanning

### 3. .gitignore 검증

```bash
# 민감 파일이 추적되지 않는지 확인
git ls-files | grep -E '\.env|secret|key|credential'
```

### 4. git-secrets 설치

```bash
brew install git-secrets
cd your-repo
git secrets --install
git secrets --register-aws  # AWS 키 패턴 등록
```

---

## 참고 자료

- [GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [git-filter-repo](https://github.com/newren/git-filter-repo)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [git-secrets](https://github.com/awslabs/git-secrets)

---

## 긴급 연락처

- GitHub Security: security@github.com
- GitHub Support: https://support.github.com/contact
