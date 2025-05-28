# MCP Marketplace

Model Context Protocol 서버를 발견하고 탐색할 수 있는 한국어 마켓플레이스입니다.

## 프로젝트 개요

MCP Marketplace는 다양한 Model Context Protocol 서버들을 쉽게 찾고, 비교하고, 설치할 수 있도록 도와주는 웹 애플리케이션입니다. 한국어 인터페이스로 제공되며, 12개의 다양한 카테고리 MCP 서버들을 포함하고 있습니다.

## 주요 기능

- 🔍 **실시간 검색**: MCP 이름, 설명, 태그로 즉시 검색
- 📂 **카테고리 필터**: 11개 카테고리별 분류 (파일시스템, 데이터베이스, API 통합 등)
- 🏷️ **태그 필터**: 다중 태그 선택으로 정밀한 필터링
- 📊 **다양한 정렬**: 인기도, 평점, 최신순, 이름순 정렬
- 📱 **반응형 디자인**: 데스크톱과 모바일 완벽 지원
- 🎯 **상세 모달**: 각 MCP의 설치 방법, 기능, 저장소 링크 제공
- 🇰🇷 **한국어 UI**: 완전한 한국어 인터페이스

## 기술 스택

- **Frontend**: Vanilla JavaScript, HTML5, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Data**: JSON 기반 정적 데이터 (12개 MCP 샘플)
- **Styling**: Tailwind CSS (CDN)

## 프로젝트 구조

```
mcp-marketplace/
├── data/
│   └── mcps.json              # 12개 MCP 서버 데이터
├── public/
│   ├── index.html             # 메인 HTML (한국어 UI)
│   └── app.js                 # 프론트엔드 로직
├── simple-server.js           # Express 서버 (API 포함)
├── package.json               # Node.js 의존성
├── .gitignore                 # Git 제외 파일
└── README.md                  # 프로젝트 문서
```

## 빠른 시작

### 1. 필수 요구사항
- Node.js (v14 이상)
- npm

### 2. 설치 및 실행

```bash
# 의존성 설치 (Express만 필요)
npm install express

# 서버 실행
node simple-server.js

# 또는 package.json의 dev 스크립트 사용 시
npm run dev
```

### 3. 브라우저에서 접속
```
http://localhost:5000
```

## API 엔드포인트

| 엔드포인트 | 메서드 | 설명 | 파라미터 |
|------------|--------|------|-----------|
| `/api/mcps` | GET | 모든 MCP 목록 | `search`, `category`, `tag`, `sort` |
| `/api/mcps/:id` | GET | 특정 MCP 상세 정보 | - |
| `/api/categories` | GET | 사용 가능한 카테고리 목록 | - |
| `/api/tags` | GET | 사용 가능한 태그 목록 | - |

### API 사용 예시
```bash
# 모든 MCP 조회
curl http://localhost:5000/api/mcps

# 검색으로 MCP 조회
curl "http://localhost:5000/api/mcps?search=database&sort=popularity"

# 특정 MCP 상세 정보
curl http://localhost:5000/api/mcps/filesystem-mcp
```

## 포함된 MCP 서버들

현재 12개의 다양한 카테고리의 MCP 서버가 포함되어 있습니다:

### 파일 시스템
- **Filesystem MCP**: 파일 시스템 작업을 위한 핵심 MCP

### 데이터베이스
- **Database MCP**: PostgreSQL, MySQL, SQLite, MongoDB 지원

### 웹 스크래핑
- **Web Scraper MCP**: JavaScript 렌더링과 봇 탐지 방지 기능

### API 통합
- **REST API Client MCP**: 인증, 재시도, 캐싱 기능이 포함된 범용 API 클라이언트

### 커뮤니케이션
- **Email MCP**: SMTP, IMAP 지원과 템플릿 기능

### 생산성
- **Calendar Integration MCP**: Google Calendar, Outlook, CalDAV 통합

### AI 비전
- **Image Processing MCP**: AI 기반 객체 탐지와 이미지 처리

### 문서 처리
- **Document Parser MCP**: PDF, Word, Excel 등 다양한 문서 형식 지원

### 암호화폐
- **Cryptocurrency MCP**: 실시간 시장 데이터와 포트폴리오 추적

### 소셜 미디어
- **Social Media Integration MCP**: Twitter, Facebook, Instagram, LinkedIn 통합

### 클라우드 스토리지
- **Cloud Storage MCP**: AWS S3, Google Cloud, Azure, Dropbox 지원

### 자동화
- **Workflow Automation MCP**: 시각적 워크플로우 빌더와 외부 서비스 통합

## API 엔드포인트

- `GET /api/mcps` - 모든 MCP 목록 조회 (검색, 필터링, 정렬 지원)
- `GET /api/mcps/:id` - 특정 MCP 상세 정보
- `GET /api/categories` - 사용 가능한 카테고리 목록
- `GET /api/tags` - 사용 가능한 태그 목록

## 향후 개선 사항

- [ ] 사용자 리뷰 및 평점 시스템
- [ ] MCP 제출 기능
- [ ] 사용자 즐겨찾기
- [ ] 고급 검색 필터
- [ ] MCP 사용 통계
- [ ] 다국어 지원

## 라이선스

MIT License

## 기여하기

프로젝트에 기여하고 싶으시다면 이슈를 등록하거나 풀 리퀘스트를 보내주세요.