const BASE_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", function () {
  const profilePicture = document.querySelector(".profile-picture");
  const menu = document.querySelector(".menu");
  let menuTimeout;

  const auth_token = localStorage.getItem("auth_token");
  const user_id = localStorage.getItem("user_id");
  const userNickname = localStorage.getItem("userNickname");
  const user_profileImage = localStorage.getItem("user_profileImage");
  const user_email = localStorage.getItem("user_email");

  if (user_profileImage) {
    profilePicture.src = `${BASE_URL}/images/profile/${user_profileImage}`;
  }

  profilePicture.addEventListener("mouseenter", function () {
    clearTimeout(menuTimeout);
    menu.style.display = "block";
  });

  profilePicture.addEventListener("mouseleave", function () {
    menuTimeout = setTimeout(function () {
      menu.style.display = "none";
    }, 3000);
  });

  let isLoading = false;
  let page = 0;

  function fetchPosts() {
    if (isLoading) return;
    isLoading = true;

    // 서버에서 데이터를 가져오는 fetch 요청
    fetch(`${BASE_URL}/posts`, {
      method: "GET", // HTTP GET 요청
      headers: {
        // Bearer 토큰을 사용한 인증 헤더
        Authorization: `Bearer ${auth_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        data.forEach((post) => createPostElement(post));
        page++;
        isLoading = false;
      })
      .catch((error) => {
        console.error("Error loading posts:", error);
        isLoading = false;
      });
  }

  window.addEventListener("scroll", () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5 && !isLoading) {
      fetchPosts();
    }
  });

  fetchPosts();

  function createPostElement(post) {
    const postDiv = document.createElement("div");
    postDiv.className = "post";
    postDiv.innerHTML = `
        <h3 class="post-title">${post.title}</h3>
        <div class="post-meta">
          <span class="likes">좋아요 ${formatCount(post.likes)}</span>
          <span class="comments">댓글수 ${formatCount(
            post.commentsCount
          )}</span>
          <span class="views">조회수 ${formatCount(post.views)}</span>
          <time class="post-date">${new Date(post.date).toLocaleString()}</time>
        </div>
        <div class="author-info">
          <img src="${BASE_URL}/images/profile/${
      post.author.profileImage_path
    }" alt="${
      post.author.nickname
    }의 프로필 이미지" class="author-profile-picture">
          <span class="author-name">${post.author.nickname}</span>
        </div>
      `;

    postDiv.addEventListener("click", () => {
      location.href = `/posts/${post.id}`;
    });

    document.getElementById("postsContainer").appendChild(postDiv);
  }

  function formatCount(num) {
    if (num >= 100000) return (num / 1000).toFixed(0) + "k";
    if (num >= 10000) return (num / 1000).toFixed(0) + "k";
    if (num >= 1000) return (num / 1000).toFixed(0) + "k";
    return num;
  }
});
