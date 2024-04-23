document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("post-form");
  const titleInput = document.getElementById("post-title");
  const contentTextarea = document.getElementById("post-content");
  const imageInput = document.getElementById("post-image");
  const submitButton = document.querySelector(".submit-button");
  const helperText = document.getElementById("create-helper");
  const profilePicture = document.querySelector(".profile-picture");

  const token = localStorage.getItem("auth_token"); // Bearer Token 가져오기
  const profileImagePath = localStorage.getItem("user_profileImage");
  profilePicture.src = `http://localhost:3000/images/profile/${profileImagePath}`;
  function updateUI() {
    const title = titleInput.value;
    const content = contentTextarea.value;
    const bothFilled = title && content;

    submitButton.style.backgroundColor = bothFilled ? "#7F6AEE" : "#ACAOEB";
    submitButton.disabled = !bothFilled;
    helperText.textContent = bothFilled
      ? ""
      : "*제목, 내용을 모두 작성해주세요";
  }

  function uploadImage(file) {
    const formData = new FormData();
    formData.append("image", file);

    return fetch("http://localhost:3000/upload/post", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => data.filename)
      .catch((error) => {
        console.error("Image upload failed:", error);
        throw error;
      });
  }

  function submitPost(title, content, filename) {
    const author = {
      email: localStorage.getItem("user_email"),
      nickname: localStorage.getItem("user_nickname"),
      profileImage_path: localStorage.getItem("user_profileImage"),
    };

    const postData = {
      title,
      content,
      post_image: filename,
      author,
    };

    return fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create post");
        }
        return response.json();
      })
      .then((data) => {
        alert("게시글 작성 완료");
        window.location.href = "/posts";
      })
      .catch((error) => {
        console.error("Error creating post:", error);
        helperText.textContent =
          "*게시글 작성에 실패했습니다. 다시 시도해주세요.";
      });
  }

  titleInput.addEventListener("input", function () {
    if (titleInput.value.length > 26) {
      titleInput.value = titleInput.value.substr(0, 26);
    }
    updateUI();
  });

  contentTextarea.addEventListener("input", updateUI);

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    updateUI();

    if (!submitButton.disabled) {
      const file = imageInput.files[0]; // 이미지 파일 가져오기
      if (file) {
        uploadImage(file)
          .then((filename) => {
            submitPost(titleInput.value, contentTextarea.value, filename);
          })
          .catch((error) => {
            helperText.textContent = "*이미지 업로드 실패. 다시 시도해주세요.";
          });
      } else {
        submitPost(titleInput.value, contentTextarea.value, ""); // 이미지 없이 게시글 작성
      }
    } else {
      helperText.textContent = "*제목, 내용을 모두 작성해주세요";
    }
  });
});
