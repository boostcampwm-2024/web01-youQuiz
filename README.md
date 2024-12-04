<div align="center">
  <h1>YOU QUIZ?</h1>

<br/>

![화면 기록 2024-12-02 오전 3 58 47](https://github.com/user-attachments/assets/d124e56f-b896-41e8-a588-9c17f5685467)

</div>

> **배포 링크**  
> https://www.you-quiz.site/

<br/>

 <p align=center>
  <a href="https://www.notion.so/1498e498b4af815ab62de893deaee0d0?v=1498e498b4af81a4aa01000c9a21f45e&pvs=4">팀 노션</a>
  &nbsp; | &nbsp; 
  <a href="https://github.com/orgs/boostcampwm-2024/projects/19">백로그</a>
  &nbsp; | &nbsp;
  <a href="https://www.notion.so/1498e498b4af81bebad6f2df3c1e065c?pvs=4">기획서</a>   &nbsp;
  <br />
  <a href="https://github.com/boostcampwm-2024/web01-youQuiz/wiki/%EA%B7%B8%EB%9D%BC%EC%9A%B4%EB%93%9C-%EB%A3%B0">그라운드 룰</a>
  &nbsp; | &nbsp; 
  <a href="https://github.com/boostcampwm-2024/web01-youQuiz/wiki">개발 위키</a>

<div align=center>
  <a href="https://hits.seeyoufarm.com">
    <img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fboostcampwm-2024%2Fweb01-youQuiz&count_bg=%238394CF&title_bg=%235A5A5A&icon=&icon_color=%23EDEDED&title=hits&edge_flat=false" alt="Hits">
  </a>
</div>
    
</p>

<br/><br/>

## 📋 목차

- [📋 목차](#-목차)
- [📄 프로젝트 개요](#-프로젝트-개요)
- [🚀 핵심 기능](#-핵심-기능)
  - [실수로 새로고침해도 걱정 없이 이어갈 수 있는 퀴즈 경험!](#실수로-새로고침해도-걱정-없이-이어갈-수-있는-퀴즈-경험)
  - [참여자가 중간에 다시 접속해도 자연스럽게 게임에 합류 가능!](#참여자가-중간에-다시-접속해도-자연스럽게-게임에-합류-가능)
- [💡 기술적 도전](#-기술적-도전)
  - [🩵 FE](#-fe)
  - [💛 BE](#-be)
- [🛠️ 기술 스택](#️-기술-스택)
  - [💻 Common](#-common)
  - [🎨 Frontend](#-frontend)
  - [📡 Backend](#-backend)
  - [💾 Database](#-database)
  - [🌐 Infrastructure](#-infrastructure)
- [🏛️ 시스템 아키텍처](#️-시스템-아키텍처)
- [✋팀원 소개](#팀원-소개)

<br/>

## 📄 프로젝트 개요

YOU QUIZ는 실시간으로 함께 퀴즈를 풀며 소통할 수 있는 참여형 퀴즈 플랫폼입니다. 주최자가 생성한 퀴즈를 여러 참가자들이 동시에 풀면서 서로의 반응을 공유하고, 실시간으로 변화하는 통계를 확인할 수 있습니다.

<br/>

> **서비스 흐름 살펴보기**  
> [서비스 흐름](https://github.com/boostcampwm-2024/web01-youQuiz/wiki/%EC%84%9C%EB%B9%84%EC%8A%A4-%ED%9D%90%EB%A6%84)

<br/>

## 🚀 핵심 기능

**실시간 퀴즈 플랫폼의 핵심은 안정적인 소켓 관리, 그리고 끊김 없는 사용자 경험입니다.**  
새로고침과 재접속 시에도 사용자가 중단 없이 퀴즈를 이어갈 수 있도록 소켓 이벤트 처리 구조를 리팩토링하고, 페어 프로그래밍을 통해 세밀한 디테일까지 완성했습니다.
이를 바탕으로 사용자 중심의 안정적이고 매끄러운 퀴즈 환경을 만들어내려고했습니다.

<br/>

### 실수로 새로고침해도 걱정 없이 이어갈 수 있는 퀴즈 경험!

> 새로고침 후에도 현재 진행 상태에 맞춰서 데이터를 받아볼 수 있어요.

![새로고침2](https://github.com/user-attachments/assets/ff840568-00f4-4581-9693-e766e3739a86)

<br/>

### 참여자가 중간에 다시 접속해도 자연스럽게 게임에 합류 가능!

> 기존에 참여했던 참가자가 탭에서 나간 후 다시 재접속 했을 경우 자연스럽게 퀴즈에 참여할 수 있어요.

![Dec-04-2024 01-52-23](https://github.com/user-attachments/assets/d0897383-d850-46d3-9916-c082db5f4cfe)

<br/>

> **소켓 새로고침 관리에 대해서 더 자세한 이야기가 궁금하다면?**  
> [소켓 새로고침 관리 보러가기](https://github.com/boostcampwm-2024/web01-youQuiz/wiki/%EC%86%8C%EC%BC%93-%EC%83%88%EB%A1%9C%EA%B3%A0%EC%B9%A8-%EA%B4%80%EB%A6%AC%ED%95%98%EA%B8%B0)

<br/>

## 💡 기술적 도전

**기술적 도전의 흔적과 성장을 담다!**  
6주동안 팀원이 맡은 기술 영역에서 직면했던 고민과 해결 과정을 정리하고, 트러블 슈팅을 통해 배운 점과 앞으로의 개선 방향을 기록했습니다.

<br/>

**더 자세한 이야기가 궁금하다면?**  
팀원별 문서를 통해 각 도전과 해결 과정을 확인해보세요!

<br/>

### 🩵 FE

> **< 도훈 >**  
> **소켓 객체 관리**  
> [소켓 객체 관리](https://github.com/boostcampwm-2024/web01-youQuiz/wiki/%EC%86%8C%EC%BC%93-%EA%B0%9D%EC%B2%B4-%EA%B4%80%EB%A6%AC)

> **< 병찬 >**  
> **React‐Query와 Socket과 함께 춤을**  
> [React‐Query와 Socket과 함께 춤을](https://github.com/boostcampwm-2024/web01-youQuiz/wiki/React%E2%80%90Query%EC%99%80-Socket%EA%B3%BC-%ED%95%A8%EA%BB%98-%EC%B6%A4%EC%9D%84)

<br/>

### 💛 BE

> **< 성현 >**  
> **쿼리 효율 극대화, 근데 이제 데이터 유효성을 곁들인**  
> [벌크 삭제: 퀴즈 서비스 삭제 기능 성능 최적화](https://github.com/boostcampwm-2024/web01-youQuiz/wiki/%EB%B2%8C%ED%81%AC-%EC%82%AD%EC%A0%9C:-%ED%80%B4%EC%A6%88-%EC%84%9C%EB%B9%84%EC%8A%A4-%EC%82%AD%EC%A0%9C-%EA%B8%B0%EB%8A%A5-%EC%84%B1%EB%8A%A5-%EC%B5%9C%EC%A0%81%ED%99%94)  
> [연관 행의 빈도 높은 삽입, 삭제가 이뤄지는 시스템일 경우 어떻게 설계해야하나?](https://github.com/boostcampwm-2024/web01-youQuiz/wiki/%EC%97%B0%EA%B4%80-%ED%96%89%EC%9D%98-%EB%B9%88%EB%8F%84-%EB%86%92%EC%9D%80-%EC%82%BD%EC%9E%85,-%EC%82%AD%EC%A0%9C%EA%B0%80-%EC%9D%B4%EB%A4%84%EC%A7%80%EB%8A%94-%EC%8B%9C%EC%8A%A4%ED%85%9C%EC%9D%BC-%EA%B2%BD%EC%9A%B0-%EC%96%B4%EB%96%BB%EA%B2%8C-%EC%84%A4%EA%B3%84%ED%95%B4%EC%95%BC%ED%95%98%EB%82%98%3F)

> **< 채원 >**  
> **우당탕탕 배포 도전기**  
> [nCloud, Docker를 활용해 수동 배포해보기](https://github.com/boostcampwm-2024/web01-youQuiz/wiki/nCloud,-Docker%EB%A5%BC-%ED%99%9C%EC%9A%A9%ED%95%B4-%EC%88%98%EB%8F%99-%EB%B0%B0%ED%8F%AC%ED%95%B4%EB%B3%B4%EA%B8%B0)  
> [github actions를 활용한 CI CD 파이프라인 구축하기](https://github.com/boostcampwm-2024/web01-youQuiz/wiki/github-actions%EB%A5%BC-%ED%99%9C%EC%9A%A9%ED%95%9C-CI-CD-%ED%8C%8C%EC%9D%B4%ED%94%84%EB%9D%BC%EC%9D%B8-%EA%B5%AC%EC%B6%95%ED%95%98%EA%B8%B0)

<br/>

## 🛠️ 기술 스택

### 💻 Common

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=TypeScript&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=flat-square&logo=prettier&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=ESLint&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=Socket.io&logoColor=white)

### 🎨 Frontend

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=Tailwind-CSS&logoColor=white)
![Storybook](https://img.shields.io/badge/Storybook-FF4785?style=flat-square&logo=Storybook&logoColor=white)
![Tanstack Query](https://img.shields.io/badge/Tanstack_Query-FF4154?style=flat-square&logo=ReactQuery&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=Vite&logoColor=white)

### 📡 Backend

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=NestJS&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-E93424?style=flat-square&logo=TypeORM&logoColor=white)

### 💾 Database

![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=MySQL&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=Redis&logoColor=white)

### 🌐 Infrastructure

![NGINX](https://img.shields.io/badge/NGINX-009639?style=flat-square&logo=NGINX&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=GitHub-Actions&logoColor=white)
![Naver Cloud Platform](https://img.shields.io/badge/Naver_Cloud-03C75A?style=flat-square&logo=Naver&logoColor=white)

<br/>

## 🏛️ 시스템 아키텍처

![undefined (1)](https://github.com/user-attachments/assets/d4a74223-0735-4a80-bd98-5ead40bed0f1)

<br/>

## ✋팀원 소개

<div align="center">
  
|[FE] J031_김도훈|[FE] J255_최병찬|[BE] J087_도성현|[BE] J289_이채원|
|--|--|--|--|
|<img src="https://avatars.githubusercontent.com/u/74540646?v=4" width=150>|<img src="https://avatars.githubusercontent.com/u/77400298?v=4" width=150 />|<img src="https://avatars.githubusercontent.com/u/52828205?v=4" width=150 />|<img src="https://avatars.githubusercontent.com/u/99425616?v=4" width=150/>|
|[@dooohun](https://github.com/dooohun)|[@chan-byeong](https://github.com/chan-byeong)|[@glaxyt](https://github.com/glaxyt)|[@nowChae](https://github.com/nowChae)|

</div>
