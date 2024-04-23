const express = require("express");
const router = express.Router();
const path = require("path");

// 메인 페이지 (로그인 필요? 구현 못하겠다 그냥 하자)
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "login.html"));
});

// 회원가입 페이지
router.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "signup.html"));
});

// 게시글 목록 페이지
router.get("/posts", (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "posts.html"));
});

// 게시글 작성 페이지
router.get("/posts/new", (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "create-post.html")); // 게시글 작성과 수정을 같은 페이지에서 처리할 수 있도록 설정
});

// 게시글 상세 조회 페이지
router.get("/posts/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "post-detail.html"));
});

// 게시글 수정 페이지
router.get("/posts/:id/edit", (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "edit-post.html"));
});

// 프로필 수정 페이지
router.get("/profile/edit", (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "edit-profile.html"));
});

// 비밀번호 변경 페이지
router.get("/password/change", (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "change-password.html"));
});

module.exports = router;
