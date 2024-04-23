const BASE_URL = "http://localhost:3000";

function validateLoginForm() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let helperText = document.getElementById("login-helper");

  // 이메일과 비밀번호의 기본 유효성 검사
  if (email.length === 0 || !email.includes("@")) {
    helperText.innerText = "올바른 이메일 주소를 입력하세요.";
    return false;
  } else if (password.length === 0) {
    helperText.innerText = "비밀번호를 입력하세요.";
    return false;
  } else {
    helperText.innerText = "";
    return true;
  }
}

document.getElementById("login-button").addEventListener("click", function () {
  if (validateLoginForm()) {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Login failed");
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("auth_token", data.token);

        const decoded = jwt_decode(data.token);

        localStorage.setItem("user_id", decoded.userId);
        localStorage.setItem("user_email", decoded.email);
        localStorage.setItem("user_nickname", decoded.nickname);
        localStorage.setItem("user_profileImage", decoded.profileImage);

        window.location.href = "/posts";
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
});

document.getElementById("signup-button").addEventListener("click", function () {
  window.location.href = "/signup"; // 회원가입 페이지로 리디렉션
});

// 입력 변경 시 유효성 검사
document.getElementById("email").addEventListener("input", validateLoginForm);
document
  .getElementById("password")
  .addEventListener("input", validateLoginForm);
