document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("auth_token");
  const profilePicture = document.querySelector(".profile-picture");
  const user_profileImage = localStorage.getItem("user_profileImage");
  profilePicture.src = `http://localhost:3000/images/profile/${user_profileImage}`;

  const pathArray = window.location.pathname.split("/");
  const postId = pathArray[pathArray.length - 2];
  console.log(postId); // 게시글 ID 확인

  const fileInput = document.getElementById("post-image");
  const fileLabel = document.getElementById("post-image-label");

  // 파일 선택 시 서버에 업로드
  fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      fetch(`http://localhost:3000/upload/post`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data.message === "File uploaded successfully") {
            alert("이미지 업로드 성공!");
            fileLabel.textContent = data.filename; // 업로드된 파일명 표시
          } else {
            alert("이미지 업로드 실패: " + data.message);
          }
        })
        .catch((error) => {
          console.error("이미지 업로드 중 오류 발생", error);
          alert("이미지 업로드 중 오류 발생");
        });
    }
  });

  // 게시글 정보 가져오기
  fetch(`http://localhost:3000/posts/${postId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => response.json())
    .then((post) => {
      if (post) {
        document.getElementById("post-title").value = post.title;
        document.getElementById("post-content").value = post.content;
        document.getElementById("post-image-label").textContent =
          post.post_image;
      } else {
        alert("게시글을 불러오는 데 실패했습니다.");
      }
    })
    .catch((error) => {
      console.error("게시글 정보 로드 중 오류 발생:", error);
    });
});

function submitPost() {
  const token = localStorage.getItem("auth_token");
  const postId = window.location.pathname.split("/").slice(-2, -1)[0]; // 게시글 ID 추출
  const title = document.getElementById("post-title").value;
  const content = document.getElementById("post-content").value;
  const imageName = document.getElementById("post-image-label").textContent;

  const postData = {
    title: title,
    content: content,
    images: imageName ? [imageName] : [],
  };

  fetch(`http://localhost:3000/posts/${postId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  })
    .then((response) => {
      if (response.ok) {
        alert("게시글이 성공적으로 수정되었습니다.");
        window.location.href = "/posts"; // 성공 시 게시글 목록으로 리다이렉션
      } else {
        response.json().then((data) => {
          alert(data.message || "게시글 수정에 실패했습니다.");
        });
      }
    })
    .catch((error) => {
      console.error("게시글 수정 중 오류 발생:", error);
      alert("네트워크 오류로 게시글을 수정할 수 없습니다.");
    });
}
