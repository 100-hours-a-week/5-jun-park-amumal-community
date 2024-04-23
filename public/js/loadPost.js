document.addEventListener("DOMContentLoaded", function () {
  // 초기 설정: 토큰 및 사용자 프로필 이미지 불러오기
  const token = localStorage.getItem("auth_token");
  const login_profile = localStorage.getItem("user_profileImage");
  const profilePicture = document.querySelector(".profile-picture");
  profilePicture.src = `http://localhost:3000/images/profile/${login_profile}`;
  const commentTextarea = document.querySelector(".comment-textarea");
  const commentButton = document.querySelector(".comments-register-button");

  const commentButtonContainer = document.querySelector(
    ".comments-register-button-container"
  );
  // 댓글 수정을 위한 버튼 동적 추가
  if (!document.querySelector("#update-comment-button")) {
    const updateButton = document.createElement("button");
    updateButton.textContent = "수정하기";
    updateButton.id = "update-comment-button";
    updateButton.style.display = "none"; // Initially hidden
    commentButtonContainer.appendChild(updateButton);

    // 댓글 수정 이벤트 리스너
    updateButton.addEventListener("click", function () {
      const commentId = updateButton.getAttribute("data-comment-id");
      console.log("Updating comment with ID:", commentId); // 로그 추가하여 commentId 확인
      const updatedContent = commentTextarea.value.trim();
      if (updatedContent) {
        fetch(`http://localhost:3000/posts/${postId}/comments/${commentId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: updatedContent }),
        })
          .then((response) => {
            if (response.ok) {
              alert("댓글이 수정되었습니다.");
              location.reload();
            } else {
              alert("댓글 수정에 실패했습니다.");
            }
          })
          .catch((error) => console.error("댓글 수정 오류:", error));
      } else {
        alert("댓글 내용을 입력하세요.");
      }
    });
  }

  // 댓글 수정 버튼 설정
  document.addEventListener("click", function (event) {
    const editButton = event.target.closest(".edit-comment-btn");
    if (editButton) {
      const commentId = editButton.dataset.commentId;
      const commentContent = editButton
        .closest(".comment-container")
        .querySelector(".comment-text").textContent;
      commentTextarea.value = commentContent;
      commentButton.style.display = "none";
      const updateButton = document.querySelector("#update-comment-button");
      updateButton.style.display = "block";
      updateButton.setAttribute("data-comment-id", commentId);
    }
  });
  // 현재 페이지의 게시글 ID 추출
  const postId = window.location.pathname.split("/").pop();
  // 댓글 등록 버튼 이벤트 리스너 설정
  setupCommentPosting(postId, token);
  // 게시글 수정 페이지로 리다이렉션하는 이벤트 리스너
  const editButton = document.querySelector(".edit-post-btn");
  editButton &&
    editButton.addEventListener("click", function () {
      window.location.href = `/posts/${postId}/edit`;
    });

  // 서버에서 게시글 상세 정보를 불러오는 함수
  function fetchPostDetails(postId) {
    fetch(`http://localhost:3000/posts/${postId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((post) => {
        if (post) {
          updatePostDetails(post); // 게시글 상세 정보 업데이트
          updateComments(post.comments); // 댓글 정보 업데이트
        } else {
          document.getElementById("postContainer").innerHTML =
            "<p>해당 게시글을 찾을 수 없습니다.</p>";
        }
      })
      .catch((error) => {
        console.error("게시글을 로드하는 중 에러가 발생했습니다:", error);
        document.getElementById("postContainer").innerHTML =
          "<p>게시글을 로드할 수 없습니다.</p>";
      });
  }

  // 게시글 상세 정보를 화면에 표시하는 함수
  function updatePostDetails(post) {
    document.querySelector(".post-title").textContent = post.title;
    document.querySelector(
      ".post-profile-picture"
    ).src = `http://localhost:3000/images/profile/${post.author.profileImage_path}`;
    document.querySelector(".author-name").textContent = post.author.nickname;
    document.querySelector(".post-date").textContent = post.date;
    document.querySelector(".post-text").innerHTML = post.content;
    document.querySelector(
      ".view-count-btn"
    ).innerHTML = `${post.views}<br>조회수`;
    document.querySelector(
      ".comment-count-btn"
    ).innerHTML = `${post.commentsCount}<br>댓글수`;

    if (post.post_image) {
      const imgBox = document.querySelector(".img-box img");
      imgBox.src = `http://localhost:3000/images/posts/${post.post_image}`;
      imgBox.alt = "게시글 이미지";
    }
  }

  // 댓글 정보를 화면에 표시하는 함수
  function updateComments(comments) {
    const commentsContainer = document.querySelector(".comment");
    commentsContainer.innerHTML = comments
      .map(
        (comment) => `
    <div class="comment-container">
      <img src="http://localhost:3000/images/profile/${comment.author.profileImage}" alt="댓글 작성자 프로필 사진" class="comment-profile-picture">
      <div class="comment-content">
        <div class="comment-top-row">
          <span class="comment-author-name">${comment.author.nickname}</span>
          <span class="comment-date">${comment.date}</span>
          <div class="comment-btn-container">
            <button class="edit-comment-btn" data-comment-id="${comment.id}">수정</button>
            <button class="delete-comment-btn" data-comment-id="${comment.id}">삭제</button>
          </div>
        </div>
        <div class="comment-text-container">
          <p class="comment-text">${comment.content}</p>
        </div>
      </div>
    </div>
  `
      )
      .join("");
  }

  // 게시글 삭제 모달과 관련된 이벤트 리스너 설정
  setupPostDeletionModal(postId, token);
  // 댓글 삭제 모달과 관련된 이벤트 리스너 설정
  setupCommentDeletionModal();

  // 페이지 로드 시 게시글 정보 요청
  postId
    ? fetchPostDetails(postId)
    : (document.getElementById("postContainer").innerHTML =
        "<p>게시글 ID가 제공되지 않았습니다.</p>");
});

// 댓글 등록 기능 설정
function setupCommentPosting(postId, token) {
  const commentButton = document.querySelector(".comments-register-button");
  const commentTextarea = document.querySelector(".comment-textarea");

  commentButton.addEventListener("click", function () {
    const commentContent = commentTextarea.value.trim();
    if (commentContent) {
      fetch(`http://localhost:3000/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: commentContent }),
      })
        .then((response) => {
          if (response.ok) {
            alert("댓글이 성공적으로 등록되었습니다.");
            location.reload(); // 성공 시 페이지 리로드
          } else {
            response
              .json()
              .then((data) =>
                alert(data.message || "댓글 등록에 실패했습니다.")
              );
          }
        })
        .catch((error) => {
          console.error("댓글 등록 중 오류 발생:", error);
          alert("네트워크 오류로 댓글을 등록할 수 없습니다.");
        });
    } else {
      alert("댓글 내용을 입력해주세요.");
    }
  });
}
// 게시글 삭제 모달 관련 이벤트 리스너 설정
function setupPostDeletionModal(postId, token) {
  const postDeletionModal = document.getElementById("postDeletionModal");
  document
    .querySelector(".delete-post-btn")
    .addEventListener(
      "click",
      () => (postDeletionModal.style.display = "block")
    );

  postDeletionModal.querySelector(".confirm").addEventListener("click", () => {
    fetch(`http://localhost:3000/posts/${postId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      response.ok
        ? (window.location.href = "/posts")
        : alert("게시글을 삭제할 수 없습니다.");
    });
    postDeletionModal.style.display = "none";
  });
}

// 댓글 삭제 모달 관련 이벤트 리스너 설정
function setupCommentDeletionModal() {
  const commentDeletionModal = document.getElementById("commentDeletionModal");
  document.addEventListener("click", (event) => {
    const deleteButton = event.target.closest(".delete-comment-btn");
    if (deleteButton) {
      const commentId = deleteButton.dataset.commentId;
      commentDeletionModal.style.display = "block";
      commentDeletionModal.querySelector(".confirm").dataset.commentId =
        commentId;
    }
  });
  const token = localStorage.getItem("auth_token");
  commentDeletionModal
    .querySelector(".confirm")
    .addEventListener("click", function () {
      const commentId = this.dataset.commentId;
      const postId = window.location.pathname.split("/").pop();
      fetch(`http://localhost:3000/posts/${postId}/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).then((response) => {
        response.ok ? location.reload() : alert("댓글을 삭제할 수 없습니다.");
      });
      commentDeletionModal.style.display = "none";
    });
}
