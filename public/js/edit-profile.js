document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("auth_token");
  const profileImg = document.getElementById("profileImg");
  const helperText = document.getElementById("helper-text");
  const nicknameInput = document.getElementById("nickname");
  const updateButton = document.querySelector(".signup-butoton");
  const userId = localStorage.getItem("user_id"); // 사용자 ID를 로컬스토리지에서 가져옴
  const user_profileImage = localStorage.getItem("user_profileImage");
  const userEmail = localStorage.getItem("user_email");
  document.querySelector("#email").innerText = userEmail;

  const bannerprofileimg = document.querySelector(".profile-picture");
  bannerprofileimg.src = `http://localhost:3000/images/profile/${user_profileImage}`;
  profileImg.src = `http://localhost:3000/images/profile/${user_profileImage}`;
  nicknameInput.addEventListener("input", validateNickname);

  profileImg.addEventListener("click", function () {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = function (e) {
      const file = e.target.files[0];
      uploadProfileImage(file);
    };
    fileInput.click();
  });

  updateButton.addEventListener("click", function () {
    submitProfileUpdate();
  });

  // 프로필 이미지 업로드
  function uploadProfileImage(file) {
    const formData = new FormData();
    formData.append("image", file);

    fetch("http://localhost:3000/upload/profile", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.filename) {
          profileImg.src = `http://localhost:3000/images/profile/${data.filename}`;
          localStorage.setItem("user_profileImage", data.filename); // 업로드된 파일 이름 저장
        }
      })
      .catch((error) => console.error("프로필 이미지 업로드 실패:", error));
  }

  // 사용자 정보 수정 제출
  function submitProfileUpdate() {
    const profileImage = localStorage.getItem("user_profileImage");
    const updatedNickname = nicknameInput.value;

    fetch(`http://localhost:3000/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nickname: updatedNickname,
        profile_image: profileImage,
      }),
    })
      .then((response) => {
        if (response.ok) {
          alert("프로필이 성공적으로 업데이트되었습니다.");
          window.location.href = "/posts";
        } else {
          alert("프로필 업데이트에 실패했습니다.");
        }
      })
      .catch((error) => console.error("프로필 업데이트 중 오류 발생:", error));
  }

  // 닉네임 유효성 검사 및 중복 체크
  function validateNickname() {
    const newNickname = nicknameInput.value;
    helperText.textContent = "";

    if (!newNickname) {
      helperText.textContent = "닉네임을 입력해주세요.";
      updateButton.disabled = true;
      return;
    }

    fetch(
      `http://localhost:3000/users/check-nickname?nickname=${newNickname}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then((data) => {
            throw new Error(data.message);
          });
        }
      })
      .then((data) => {
        helperText.textContent = data.message;
        updateButton.disabled = false;
      })
      .catch((error) => {
        helperText.textContent = error.message;
        updateButton.disabled = true;
      });
  }
  const modal = document.getElementById("myModal");
  const modalOpenLink = document.querySelector(".go-to-login");
  const modalCloseButton = modal.querySelector(".cancel");
  const modalConfirmButton = modal.querySelector(".confirm");

  // 모달 열기
  modalOpenLink.addEventListener("click", function (event) {
    event.preventDefault(); // 기본 동작 방지
    modal.style.display = "block";
  });

  // 모달 닫기
  modalCloseButton.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // 모달 내 '확인' 버튼 클릭 이벤트
  modalConfirmButton.addEventListener("click", function () {
    deleteUserAccount();
  });

  function deleteUserAccount() {
    const userId = localStorage.getItem("user_id"); // 사용자 ID 가져오기
    fetch(`http://localhost:3000/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // 토큰을 헤더에 추가
      },
    })
      .then((response) => {
        if (response.ok) {
          alert("회원 탈퇴가 완료되었습니다.");
          localStorage.clear(); // 로컬 스토리지 클리어
          window.location.href = "/"; // 홈으로 리다이렉트
        } else {
          alert("회원 탈퇴에 실패했습니다.");
        }
      })
      .catch((error) => {
        console.error("회원 탈퇴 중 오류 발생:", error);
        alert("네트워크 오류로 회원 탈퇴를 진행할 수 없습니다.");
      })
      .finally(() => {
        modal.style.display = "none"; // 모달 닫기
      });
  }
});
