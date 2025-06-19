// ...existing code...

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDN3YxOpqxqfBQgHOvtFk6JJvztlV3vTH8",
  authDomain: "deargift-e6488.firebaseapp.com",
  projectId: "deargift-e6488",
  storageBucket: "deargift-e6488.appspot.com",
  messagingSenderId: "391379008795",
  appId: "1:391379008795:web:4b1c98f17f824690e2e7be",
  measurementId: "G-VGBLRMQM9L"
};
firebase.initializeApp(firebaseConfig);

// DOM elements
const googleLoginBtn = document.getElementById('googleLoginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userInfo = document.getElementById('userInfo');
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');

// Google Login
googleLoginBtn.addEventListener('click', async () => {
  const originalText = googleLoginBtn.innerHTML;
  googleLoginBtn.innerHTML = '<div class="loading"></div> Đang đăng nhập...';
  googleLoginBtn.disabled = true;

  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('email');
    const result = await firebase.auth().signInWithPopup(provider);
    const idToken = await result.user.getIdToken();

    // Gửi idToken lên backend nếu cần
    await fetch('https://887d-2405-4802-1d77-87c0-d41-8c15-b0fe-b90d.ngrok-free.app/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken })
    });
    // Có thể xử lý thêm nếu backend trả về thông tin
  } catch (error) {
    alert('❌ Đăng nhập thất bại: ' + error.message);
  } finally {
    googleLoginBtn.innerHTML = originalText;
    googleLoginBtn.disabled = false;
  }
});

// Logout
logoutBtn.addEventListener('click', async () => {
  try {
    await firebase.auth().signOut();
  } catch (error) {
    alert('❌ Đăng xuất thất bại: ' + error.message);
  }
});

// Auth State Listener
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // Đăng nhập thành công
    localStorage.setItem('user_uid', user.uid);
    googleLoginBtn.style.display = 'none';
    userInfo.style.display = 'flex';
    userAvatar.src = user.photoURL || 'https://via.placeholder.com/32x32/667eea/ffffff?text=👤';
    userName.textContent = user.displayName || '';
    userEmail.textContent = user.email || '';
    // Gọi loadUserVouchers nếu có
  if (typeof loadUserVouchers === 'function' && document.getElementById('voucherList')) {
  loadUserVouchers();
}
  } else {
    // Đăng xuất
    localStorage.removeItem('user_uid');
    googleLoginBtn.style.display = 'flex';
    userInfo.style.display = 'none';
    userAvatar.src = '';
    userName.textContent = '';
    userEmail.textContent = '';
    // Xóa danh sách voucher nếu muốn
    if (typeof voucherList !== 'undefined') {
      voucherList.innerHTML = '<span style="color:#e53935;">Bạn cần đăng nhập để xem voucher của bạn!</span>';
    }
  }
});

// ...existing code...