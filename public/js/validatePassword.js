document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const passwordHelper = document.getElementById("password-helper");
  const confirmPasswordHelper = document.getElementById(
    "confirm-password-helper"
  );
  const button = document.querySelector(".signup-butoton");
  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("auth_token");

  passwordInput.addEventListener("input", function () {
    validatePassword();
    updateButtonState();
  });

  confirmPasswordInput.addEventListener("input", function () {
    validatePassword();
    updateButtonState();
  });

  function validatePassword() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

    passwordHelper.textContent = "";
    confirmPasswordHelper.textContent = "";

    if (!password) {
      passwordHelper.textContent = "*비밀번호를 입력해주세요";
      return false;
    } else if (!regex.test(password)) {
      passwordHelper.textContent =
        "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
      return false;
    }

    if (!confirmPassword) {
      confirmPasswordHelper.textContent = "*비밀번호를 한번 더 입력해주세요";
      return false;
    } else if (password !== confirmPassword) {
      confirmPasswordHelper.textContent = "*비밀번호 확인과 다릅니다.";
      return false;
    }

    return true;
  }

  function updateButtonState() {
    if (validatePassword()) {
      button.disabled = false;
      button.style.backgroundColor = "#7F6AEE";
    } else {
      button.disabled = true;
      button.style.backgroundColor = "#ACA0EB";
    }
  }

  button.addEventListener("click", function () {
    if (!validatePassword()) {
      alert("비밀번호 유효성 검사를 통과하지 못했습니다.");
      return;
    }

    const newPassword = passwordInput.value;

    fetch(`http://localhost:3000/users/${userId}/password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ new_password: newPassword }),
    })
      .then((response) => {
        if (response.ok) {
          alert("비밀번호가 성공적으로 변경되었습니다.");
          window.location.href = "/";
        } else {
          alert("비밀번호 변경에 실패했습니다.");
          return response.json();
        }
      })
      .then((data) => {
        if (data && data.message) {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error("비밀번호 변경 중 오류 발생:", error);
      });
  });

  updateButtonState();
});
