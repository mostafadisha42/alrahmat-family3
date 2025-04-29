const firebaseConfig = {
  apiKey: "AIzaSyChKZqWjOhqHLqJFnAXZBX2OTWDV-RC3Hc",
  authDomain: "rhomat-a162e.firebaseapp.com",
  databaseURL: "https://rhomat-a162e-default-rtdb.firebaseio.com",
  projectId: "rhomat-a162e",
  storageBucket: "rhomat-a162e.appspot.com",
  messagingSenderId: "102046726910",
  appId: "1:102046726910:web:d9c417c7f93a533d8b03af",
  measurementId: "G-YC1LRYF549"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const storage = firebase.storage();

const ADMIN_PASS = "rahomat2025";

function login() {
  const pass = document.getElementById('password').value;
  if (pass === ADMIN_PASS) {
    document.getElementById('login-panel').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    loadPosts();
  } else {
    alert("كلمة مرور خاطئة!");
  }
}

function addPost() {
  const title = document.getElementById('postTitle').value;
  const content = document.getElementById('postContent').value;
  const file = document.getElementById('postImage').files[0];

  if (!title || !content) {
    alert("اكمل البيانات!");
    return;
  }

  const postId = Date.now();
  if (file) {
    const storageRef = storage.ref('posts/' + postId + "_" + file.name);
    storageRef.put(file).then(snapshot => {
      snapshot.ref.getDownloadURL().then(url => {
        db.ref('posts/' + postId).set({
          title,
          content,
          media: url,
          mediaType: file.type.startsWith('image') ? 'image' : 'video'
        });
        alert("تم نشر البوست!");
        location.reload();
      });
    });
  } else {
    db.ref('posts/' + postId).set({ title, content });
    alert("تم نشر البوست بدون صورة/فيديو!");
    location.reload();
  }
}

function loadPosts() {
  db.ref('posts').on('value', snapshot => {
    const postsDiv = document.getElementById('posts');
    if (postsDiv) postsDiv.innerHTML = '';

    snapshot.forEach(child => {
      const post = child.val();
      const id = child.key;

      const div = document.createElement('div');
      div.className = 'post';

      div.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.content}</p>
        ${post.media ? (post.mediaType === 'image' ? `<img src="${post.media}" class="post-image">` : `<video src="${post.media}" controls class="post-video"></video>`) : ''}
        <button onclick="deletePost('${id}')">حذف</button>
      `;

      postsDiv.appendChild(div);
    });
  });
}

function deletePost(id) {
  if (confirm("متأكد من الحذف؟")) {
    db.ref('posts/' + id).remove();
    alert("تم حذف البوست!");
    location.reload();
  }
}

function changeLogo() {
  const file = document.getElementById('logoInput').files[0];
  if (!file) {
    alert("اختر صورة جديدة!");
    return;
  }
  const storageRef = storage.ref('logo/logo.png');
  storageRef.put(file).then(() => {
    alert("تم تغيير اللوجو بنجاح!");
    location.reload();
  });
}

window.onload = () => {
  const audio = document.getElementById('welcomeAudio');
  if (audio) {
    setTimeout(() => {
      audio.pause();
    }, 60000);
  }
};