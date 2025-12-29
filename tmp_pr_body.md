## 변경사항
- fix: 프론트엔드 업로드 Content-Type 제거 (브라우저가 boundary 설정)
- fix: `RegistrationModule`을 `AppModule`에 등록하여 /registrations 라우트를 노출
- chore: `docker-compose.yml`에서 프론트엔드 빌드 ARG 수정(브라우저 환경을 위한 localhost)

## 테스트
- docker-compose로 스택을 띄우고 프론트엔드에서 업로드 및 등록 성공 확인
- 업로드된 파일은 `backend/uploads`에 저장됨

## 추가 작업(권장)
- dev/prod docker-compose 프로필 분리
- CI(타입스크립트 빌드 + lint) 확인
