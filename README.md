# 서버리스 블로그

서버 비용 없이 블로그를 만들고 싶다. 서버가 없다 -> serverless -> AWS Lambda를 활용해보자!

## 기본 구조
- AWS Lambda + EJS + Node.js + MongoDB (Atlas 500MB free)

### AWS Lambda
AWS Lambda는 이벤트에 반응하여 코드를 자동으로 실행해주는 컴퓨팅 서비스입니다. 서버리스 아키텍처에서 핵심적인 역할을 합니다.

### EJS
EJS는 JavaScript 템플릿 엔진입니다. 서버측에서 데이터를 HTML 템플릿에 바인딩하는데 사용됩니다.

### Node.js
Node.js는 서버측에서 실행되는 JavaScript 런타임입니다. 비동기 이벤트 주도 JavaScript 런타임으로 효율적이고 확장 가능한 네트워크 애플리케이션을 만들 수 있습니다.

### MongoDB Atlas
MongoDB Atlas는 클라우드에서 제공되는 MongoDB 데이터베이스 서비스입니다. 500MB 무료 티어를 제공하여 초기 프로젝트에 적합합니다.

## 서버리스 블로그 만들기

1. **AWS 설정**: AWS CLI와 Serverless Framework를 설정하고 필요한 권한을 가진 IAM 사용자를 생성하세요.

2. **Serverless 프로젝트 초기화**: `serverless create --template aws-nodejs` 명령어로 초기 프로젝트를 생성하세요.

3. **Express 및 EJS 설정**: `npm install express ejs` 명령어로 필요한 패키지를 설치하세요.

4. **MongoDB Atlas 연결**: Mongoose 라이브러리를 사용하여 MongoDB Atlas와 연결하세요.

5. **서버리스 플러그인 설치**: `serverless-express`와 `serverless-offline` 플러그인을 설치하여 로컬 개발 및 배포를 용이하게 합니다.

6. **Lambda 함수 작성**: Express 앱을 AWS Lambda에서 호스팅할 수 있도록 함수를 작성하세요.

7. **배포**: `serverless deploy` 명령어로 프로젝트를 AWS Lambda에 배포하세요.

8. **테스트**: 배포 후 제공되는 URL로 블로그가 잘 작동하는지 확인하세요.

## 통합 테스트
- `serverless offline`

## 단위 테스트
- `npm run test`


## 도메인 달기 ( 주소에 프리픽스 제거하기 )

1. AWS Management Console에서 API Gateway 서비스로 이동합니다.

2. 왼쪽 사이드바에서 'Custom domain names'를 선택합니다.

3. 'Create' 버튼을 클릭하고 원하는 도메인 이름을 입력합니다.

4. 'Create domain name' 버튼을 클릭하여 도메인 이름을 생성합니다.

5. 생성한 도메인 이름으로 이동하고, 'Configure API mappings' 섹션에서 'Add new mapping'을 클릭합니다.

6. API와 stage를 선택하고, '/'를 Base Path로 입력하고 'Save'를 클릭합니다.