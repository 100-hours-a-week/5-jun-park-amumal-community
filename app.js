const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3030;

// 정적 파일 설정
app.use(express.static(path.join(__dirname, "public")));

// HTML 파일 제공을 위한 기본 설정
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 라우터 모듈을 app에 연결
const indexRouter = require("./routes/index");
app.use("/", indexRouter);

// 서버 시작
app.listen(port, () => {
  console.log(`아무 말 대잔치 FE SERVER ON http://localhost:${port}`);
});
