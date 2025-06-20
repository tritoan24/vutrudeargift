const ORIGINAL_PRICE = 20000; // 20.000 VNĐ
let finalPrice = ORIGINAL_PRICE;

// Dữ liệu boards
let boardsData = {};

// Khởi tạo dữ liệu mặc định
function initializeBoards() {
  const defaultBoards = [
    { "id": 1, "type": "info", "title": "Tiêu đề 1", "author": "A", "describe": "desc1", "img": "https://res.cloudinary.com/doxjecoz9/image/upload/v1750180582/507075854_2829760993892440_5498859949028365776_n_uev2as.jpg" },
    { "id": 2, "type": "info", "title": "Tiêu đề 2", "author": "A", "describe": "desc2", "img": "https://res.cloudinary.com/doxjecoz9/image/upload/v1750180582/507075854_2829760993892440_5498859949028365776_n_uev2as.jpg" },
    { "id": 3, "type": "info", "title": "Tiêu đề 3", "author": "A", "describe": "desc3", "img": "https://res.cloudinary.com/doxjecoz9/image/upload/v1750180582/507075854_2829760993892440_5498859949028365776_n_uev2as.jpg" },
    { "id": 4, "type": "info", "title": "Tiêu đề 4", "author": "A", "describe": "desc4", "img": "https://res.cloudinary.com/doxjecoz9/image/upload/v1750180582/507075854_2829760993892440_5498859949028365776_n_uev2as.jpg" },
    { "id": 5, "type": "info", "title": "Tiêu đề 5", "author": "A", "describe": "desc5", "img": "https://res.cloudinary.com/doxjecoz9/image/upload/v1750180582/507075854_2829760993892440_5498859949028365776_n_uev2as.jpg" },
    { "id": 6, "type": "info", "title": "Tiêu đề 6", "author": "A", "describe": "desc6", "img": "https://res.cloudinary.com/doxjecoz9/image/upload/v1750180582/506721829_2572655879735450_7494319516091871888_n_ig5x6r.jpg" },
    { "id": 7, "type": "info", "title": "Tiêu đề 7", "author": "A", "describe": "desc7", "img": "https://res.cloudinary.com/doxjecoz9/image/upload/v1750180582/506721829_2572655879735450_7494319516091871888_n_ig5x6r.jpg" },
    { "id": 8, "type": "info", "title": "Tiêu đề 8", "author": "A", "describe": "desc8", "img": "https://res.cloudinary.com/doxjecoz9/image/upload/v1750180582/506706216_1856356138274659_389963989426953356_n_n3dnw0.jpg" },
    { "id": 9, "type": "info", "title": "Tiêu đề 9", "author": "A", "describe": "desc9", "img": "https://res.cloudinary.com/doxjecoz9/image/upload/v1750180582/506706216_1856356138274659_389963989426953356_n_n3dnw0.jpg" },
    { "id": 10, "type": "info", "title": "Tiêu đề 10", "author": "A", "describe": "desc10", "img": "https://res.cloudinary.com/doxjecoz9/image/upload/v1750180582/506706216_1856356138274659_389963989426953356_n_n3dnw0.jpg" },
    { "id": "big", "type": "info", "title": "Big Board", "author": "A", "describe": "descBig", "img": "https://res.cloudinary.com/doxjecoz9/image/upload/v1750180582/507075854_2829760993892440_5498859949028365776_n_uev2as.jpg" }
  ];
  boardsData = {};
  defaultBoards.forEach(b => boardsData[b.id] = b);
}

// Render boards grid
function renderBoardsGrid() {
  const grid = document.getElementById('boardsGrid');
  grid.innerHTML = '';

  Object.values(boardsData).forEach(board => {
    const card = document.createElement('div');
    card.className = `board-card ${board.id === 'big' ? 'big-board' : ''}`;
    card.dataset.boardId = board.id;

    if (board.id === 'big') {
      card.innerHTML = `
            <div class="board-id">BIG</div>
            <img src="${board.img}" alt="Board image" class="board-preview-img">
          `;
    } else if (board.type === 'question') {
      card.innerHTML = `
            <div class="board-id">${board.id}</div>
            <img src="${board.img}" alt="Board image" class="board-preview-img">
            <div class="board-question" style="font-weight:bold;margin-top:8px;">${board.question || ''}</div>
            <ul class="board-options" style="margin:8px 0 0 0;padding-left:18px;">
              ${Array.isArray(board.options) ? board.options.map(opt => `
                <li${opt.isCorrect ? ' style="color:green;font-weight:bold;"' : ''}>${opt.text}</li>
              `).join('') : ''}
            </ul>
          `;
    } else {
      card.innerHTML = `
            <div class="board-id">${board.id}</div>
            <img src="${board.img}" alt="Board image" class="board-preview-img">
            <div class="board-title">${board.title}</div>
            <div class="board-desc">${board.describe}</div>
          `;
    }

    card.addEventListener('click', () => openBoardModal(board.id));
    grid.appendChild(card);
  });
}

// Mở modal chỉnh sửa board
function openBoardModal(boardId) {
  const board = boardsData[boardId];
  const modal = document.getElementById('boardModal');

  document.getElementById('modalTitle').textContent = `Chỉnh sửa Board ${boardId === 'big' ? 'Big' : boardId}`;
  document.getElementById('editingBoardId').value = boardId;
  // document.getElementById('boardImg').value = board.img;
  document.getElementById('boardImgFile').value = "";
  const img = document.getElementById('modalPreviewImg');
  img.src = board.img || "";
  img.classList.toggle('show', !!board.img);
  img.dataset.local = ""; // reset

  const titleInput = document.getElementById('boardTitle');
  const descInput = document.getElementById('boardDesc');

  // Nếu là big, chỉ show ảnh, ẩn các trường khác
  if (boardId === 'big') {
    document.getElementById('boardTypeLabel').style.display = 'none';
    document.getElementById('infoFields').style.display = 'none';
    document.getElementById('questionFields').style.display = 'none';
    // BỎ required khi mở modal cho big
    titleInput.required = false;
    descInput.required = false;
  } else {
    document.getElementById('boardTypeLabel').style.display = '';
    document.getElementById('infoFields').style.display = board.type === 'question' ? 'none' : '';
    document.getElementById('questionFields').style.display = board.type === 'question' ? '' : 'none';
    document.getElementById('boardType').value = board.type || 'info';
    document.getElementById('boardTitle').value = board.title;
    document.getElementById('boardDesc').value = board.describe;
    document.getElementById('boardQuestion').value = board.question || '';
    renderOptionsList(board.options || []);
    // Đặt lại required cho trường info nếu cần
    titleInput.required = board.type !== 'question';
    descInput.required = false; // hoặc true nếu bạn muốn
  }

  modal.classList.add('show');
}

// Đóng modal
function closeModal() {
  document.getElementById('boardModal').classList.remove('show');
}

// Toast notification
function showToast(message, type) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => {
    toast.className = `toast ${type}`;
  }, 3000);
}

// Quản lý danh sách đáp án
function renderOptionsList(options) {
  const list = document.getElementById('optionsList');
  list.innerHTML = '';
  options.forEach((opt, idx) => {
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.marginBottom = '4px';
    div.innerHTML = `
          <input type="text" value="${opt.text}" data-idx="${idx}" style="flex:1;margin-right:8px;" placeholder="Đáp án">
          <label style="margin-right:8px;">
            <input type="radio" name="isCorrect" value="${idx}" ${opt.isCorrect ? 'checked' : ''}> Đúng
          </label>
          <button type="button" data-remove="${idx}">X</button>
        `;
    list.appendChild(div);
  });
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  initializeBoards();
  renderBoardsGrid();
});

// Modal controls
document.querySelector('#boardModal .close').addEventListener('click', closeModal);
document.getElementById('cancelEdit').addEventListener('click', closeModal);

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === document.getElementById('boardModal')) {
    closeModal();
  }
});

// Preview image in modal (dùng file thay vì URL)
document.getElementById('boardImgFile').addEventListener('change', (e) => {
  const img = document.getElementById('modalPreviewImg');
  const file = e.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) { // 5MB
      showToast('Ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 5MB.', 'error');
      e.target.value = "";
      img.src = "";
      img.classList.remove('show');
      img.dataset.local = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = function (evt) {
      img.src = evt.target.result;
      img.classList.add('show');
      img.dataset.local = "1"; // Đánh dấu là ảnh local
    };
    reader.readAsDataURL(file);
  } else {
    img.src = "";
    img.classList.remove('show');
    img.dataset.local = "";
  }
});

// Thêm đáp án mới
document.getElementById('addOptionBtn').addEventListener('click', () => {
  const options = getCurrentOptions();
  options.push({ text: '', isCorrect: false });
  renderOptionsList(options);
});

// Lấy danh sách đáp án hiện tại từ DOM
function getCurrentOptions() {
  const list = document.getElementById('optionsList');
  const inputs = list.querySelectorAll('input[type="text"]');
  const radios = list.querySelectorAll('input[type="radio"][name="isCorrect"]');
  let options = [];
  inputs.forEach((input, idx) => {
    options.push({
      text: input.value,
      isCorrect: radios[idx] && radios[idx].checked
    });
  });
  // Đánh dấu đúng đáp án được chọn
  const checkedRadio = list.querySelector('input[type="radio"][name="isCorrect"]:checked');
  if (checkedRadio) {
    const idx = parseInt(checkedRadio.value);
    options = options.map((opt, i) => ({ ...opt, isCorrect: i === idx }));
  }
  return options;
}

// Xóa đáp án
document.getElementById('optionsList').addEventListener('click', function (e) {
  if (e.target.tagName === 'BUTTON' && e.target.dataset.remove !== undefined) {
    const idx = parseInt(e.target.dataset.remove);
    const options = getCurrentOptions();
    options.splice(idx, 1);
    renderOptionsList(options);
  }
});

// Save board changes
document.getElementById('boardEditForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const boardId = document.getElementById('editingBoardId').value;

  // const imgUrl = document.getElementById('boardImg').value;

  // Validate image URL
  const imgPreview = document.getElementById('modalPreviewImg');
  let imgUrl = boardsData[boardId]?.img || "";
  if (imgPreview.dataset.local === "1" && imgPreview.src) {
    imgUrl = imgPreview.src; // base64
  }

  if (!imgUrl.match(/^data:image\/|^https?:\/\/.*\.(?:png|jpg|jpeg|gif)$/)) {
    showToast('Ảnh không hợp lệ!', 'error');
    return;
  }

  if (boardId === 'big') {
    // Set mặc định cho big
    boardsData[boardId] = {
      ...boardsData[boardId],
      title: "Board Big",
      author: "",
      describe: "Đây là board lớn đặc biệt.",
      img: imgUrl,
      type: "info",
      question: undefined,
      options: []
    };
  } else {
    const type = document.getElementById('boardType').value;
    let question = '';
    let options = [];
    if (type === 'question') {
      question = document.getElementById('boardQuestion').value;
      options = getCurrentOptions();
      if (!question.trim()) {
        showToast('Câu hỏi không được để trống!', 'error');
        return;
      }
      if (options.length < 2) {
        showToast('Phải có ít nhất 2 đáp án!', 'error');
        return;
      }
      if (!options.some(opt => opt.isCorrect)) {
        showToast('Phải chọn một đáp án đúng!', 'error');
        return;
      }
      if (options.some(opt => !opt.text.trim())) {
        showToast('Không được để trống đáp án!', 'error');
        return;
      }
    }

    boardsData[boardId] = {
      ...boardsData[boardId],
      title: type === 'question' ? "" : document.getElementById('boardTitle').value,
      author: "",
      describe: type === 'question' ? "" : document.getElementById('boardDesc').value,
      img: imgUrl,
      type,
      question: type === 'question' ? question : undefined,
      options: type === 'question' ? options : []
    };
  }

  renderBoardsGrid();
  closeModal();
  showToast('Đã cập nhật board thành công!', 'success');
});

// Reset form
document.getElementById('resetForm').addEventListener('click', () => {
  document.getElementById('roomForm').reset();
  initializeBoards();
  renderBoardsGrid();
  showToast('Đã đặt lại form!', 'success');
});

// Submit form
document.getElementById('roomForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!firebase.auth().currentUser) {
    showToast('Bạn cần đăng nhập để tạo!', 'error');
    return;
  }
  const loading = document.querySelector('.loading');
  const resultDiv = document.getElementById('result');

  // --- Áp dụng voucher nếu có ---
  if (typeof selectedVoucher === 'object' && selectedVoucher && selectedVoucher.code) {
    try {
      showToast('Đang áp dụng voucher...', 'info');
      const uid = localStorage.getItem('user_uid');
      const res = await fetch('https://dearlove-backend.onrender.com/api/vouchers/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, code: selectedVoucher.code })
      });
      const data = await res.json();
      if (!data.success) {
        showToast(data.message || 'Áp dụng voucher thất bại!', 'error');
        return;
      }
    } catch (err) {
      showToast('Lỗi khi áp dụng voucher!', 'error');
      return;
    }
  }

  // Validate boards data
  const boards = Object.values(boardsData);
  if (boards.length < 11) {
    showToast('Phải có ít nhất 10 board và 1 board big!', 'error');
    return;
  }
  if (boards.some(board => !board.img || !board.img.trim())) {
    showToast('Tất cả các board phải có ảnh!', 'error');
    return;
  }

  // Lấy màu phòng
  const roomColorHex = document.getElementById('boardColor').value;

  // Nếu tổng tiền = 0 thì bỏ qua thanh toán, chạy luôn các bước tiếp theo
  if (finalPrice === 0) {
    showToast('Miễn phí! Đang tạo phòng...', 'success');
    await createRoomAndProduct({ boards, roomColorHex, loading, resultDiv });
    return;
  }

  // Kiểm tra số tiền tối thiểu
  if (finalPrice <= 2000) {
    showToast('Số tiền thanh toán phải lớn hơn 2.000 VNĐ!', 'error');
    return;
  }

  // --- BẮT ĐẦU: Thanh toán trước ---
  try {
    showToast('Đang chuyển đến trang thanh toán...', 'info');
    // Chuẩn bị dữ liệu thanh toán
    const paymentData = {
      amount: finalPrice,
      description: "Thanh toán room",
      orderCode: Math.floor(100000 + Math.random() * 900000),
      uid: localStorage.getItem('user_uid'),
    };

    console.log(">> Gửi yêu cầu thanh toán...");
    const res = await fetch('https://dearlove-backend.onrender.com/api/payment/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });

    const resultData = await res.json();
    console.log(">> Kết quả từ server:", resultData);

    if (resultData.data && resultData.data.checkoutUrl) {
      console.log(">> Link thanh toán:", resultData.data && resultData.data.checkoutUrl);

      document.getElementById('paymentIframe').src = resultData.data.checkoutUrl;
      document.getElementById('paymentModal').style.display = 'block';

      // Lắng nghe message từ iframe
      await new Promise((resolve, reject) => {
        function handlePaymentMessage(event) {
          // Có thể kiểm tra event.origin nếu cần bảo mật hơn
          if (event.data && event.data.type === 'paymentSuccess') {
            console.log('Thanh toán thành công:', event.data);
            document.getElementById('paymentModal').style.display = 'none';
            if (loading) loading.style.display = 'block';
            window.removeEventListener('message', handlePaymentMessage);
            resolve();
          }
          if (event.data && event.data.type === 'paymentCancel') {
            console.log('Thanh toán bị hủy:', event.data);
            document.getElementById('paymentModal').style.display = 'none';
            window.removeEventListener('message', handlePaymentMessage);
            reject(new Error('Thanh toán bị hủy!'));
          }
        }
        window.addEventListener('message', handlePaymentMessage);
      });
      showToast('Thanh toán thành công! Đang tạo phòng...', 'success');
    } else {
      console.error('Không lấy được link thanh toán! paymentResult:', resultData);
      showToast('Không lấy được link thanh toán!', 'error');
      return;
    }
  } catch (err) {
    console.error('Lỗi khi gọi API thanh toán:', err);
    showToast('Thanh toán thất bại hoặc bị hủy!', 'error');
    return;
  }
  // --- KẾT THÚC: Thanh toán, tiếp tục upload và tạo phòng ---
  await createRoomAndProduct({ boards, roomColorHex, loading, resultDiv });
});

// --- Tách phần upload và tạo phòng thành hàm riêng ---
async function createRoomAndProduct({ boards, roomColorHex, loading, resultDiv }) {
  // --- Upload các ảnh base64 lên Cloudinary ---
  async function uploadImageToR2(base64) {
    // base64 là data:image/...;base64,...
    // Chuyển base64 thành file Blob
    function dataURLtoFile(dataurl, filename) {
      const arr = dataurl.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    }

    const file = dataURLtoFile(base64, 'upload.png');
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('https://dearlove-backend.onrender.com/api/r2/upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.success && data.data && data.data.url) {
      console.log('Ảnh đã upload:', data.data.url);
      return data.data.url;
    }
    throw new Error('Upload ảnh thất bại');
  }

  // Upload nhạc nền nếu có
  let audioUrl = null;
  const bgMusicInput = document.getElementById('bgMusic');
  if (bgMusicInput && bgMusicInput.files && bgMusicInput.files[0]) {
    const audioFile = bgMusicInput.files[0];
    if (audioFile.size > 8 * 1024 * 1024) { // 8MB
      showToast('File âm thanh quá lớn! Vui lòng chọn file nhỏ hơn 8MB.', 'error');
      return;
    }
    try {
      audioUrl = await uploadAudioToR2(bgMusicInput.files[0]);
    } catch (err) {
      showToast('Lỗi upload file nhạc nền!', 'error');
      return;
    }
  }

  // Lặp qua các board, nếu img là base64 thì upload lên Cloudinary
  for (let board of boards) {
    if (board.img && board.img.startsWith('data:image/')) {
      try {
        showToast(`Đang upload ảnh board ${board.id}...`, 'success');
        const url = await uploadImageToR2(board.img);
        board.img = url;
        boardsData[board.id].img = url; // cập nhật lại vào boardsData
      } catch (err) {
        showToast(`Lỗi upload ảnh board ${board.id}`, 'error');
        return;
      }
    }
  }
  // --- KẾT THÚC: Upload các ảnh base64 lên Cloudinary ---

  // Đảm bảo các trường required luôn tồn tại (dù là "")
  const boardsFixed = boards.map(board => ({
    ...board,
    author: board.author !== undefined && board.author !== null ? board.author : "",
    title: board.title !== undefined && board.title !== null ? board.title : "",
    describe: board.describe !== undefined && board.describe !== null ? board.describe : ""
  }));

  const data = {
    owner: "",
    title: roomColorHex || "",
    description: audioUrl || "",
    boards: boardsFixed,
    audioUrl
  };

  resultDiv.innerText = 'Đang gửi...';
  try {
    const res = await fetch('https://dearlove-backend.onrender.com/api/boards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (res.ok) {
      showToast('Tạo phòng thành công!', 'success');
      console.log('Kết quả tạo phòng:', result);

      // Lấy id đúng từ kết quả trả về
      const roomId = result._id || (result.data && result.data._id) || "";
      const productLink = window.location.origin + "/index.html?room=" + roomId;
      const productImg = "https://res.cloudinary.com/dtcyfyauk/image/upload/v1750322790/cover_yvkf6s.jpg";
      const productName = "Room " + roomId;
      const priceText = `<span style="color:#6c63ff;font-weight:bold;">${finalPrice.toLocaleString()} VNĐ</span>`;

      resultDiv.innerHTML = `
    <div class="product-card">
      <div class="product-img-wrap">
        <img src="${productImg}" alt="Ảnh sản phẩm" class="product-img">
      </div>
      <div class="product-info">
        <div class="product-title">${productName}</div>
        <div class="product-price">Giá: ${priceText}</div>
        <div class="product-link">
          <a href="${productLink}" target="_blank" id="productLink">${productLink}</a>
          <button id="copyProductLink" class="copy-btn" title="Copy link">📋</button>
        </div>
      </div>
    </div>
  `;

      // Xử lý nút copy
      const copyBtn = document.getElementById('copyProductLink');
      copyBtn.onclick = function () {
        navigator.clipboard.writeText(productLink).then(() => {
          showToast('Đã copy link sản phẩm!', 'success');
        });
      };

      // Gọi API lưu sản phẩm
      const user_uid = localStorage.getItem('user_uid');
      const product = {
        uid: user_uid,
        name: "Room 3D " + roomId,
        type: "Room3d",
        price: finalPrice,
        images: productImg,
        linkproduct: productLink
      };
      createProduct(product);
    } else {
      resultDiv.innerHTML = '<div class="error">Lỗi: ' + (result.message || 'Có lỗi xảy ra!') + '</div>';
      showToast('Lỗi khi tạo phòng!', 'error');
    }
  } catch (err) {
    resultDiv.innerHTML = '<div class="error">Lỗi gửi request!</div>';
    showToast('Lỗi gửi request!', 'error');
  }
}

// Hiển thị/ẩn trường câu hỏi khi chọn type
document.getElementById('boardType').addEventListener('change', function () {
  const isQuestion = this.value === 'question';
  document.getElementById('questionFields').style.display = isQuestion ? '' : 'none';
  document.getElementById('infoFields').style.display = isQuestion ? 'none' : '';

  const titleInput = document.getElementById('boardTitle');
  const descInput = document.getElementById('boardDesc');
  // Khi cần ẩn trường (ví dụ type là question hoặc board big)
  titleInput.required = false;
  descInput.required = false;
  titleInput.value = "";
  descInput.value = "";

  // Khi hiện trường (ví dụ type là info)
  if (this.value === 'info') {
    titleInput.required = true;
    // descInput.required = true; // nếu bạn muốn
  }
});

document.getElementById('previewDemo').addEventListener('click', async () => {
  // Lấy dữ liệu boards
  const boards = Object.values(boardsData);

  // Không truyền file âm thanh khi xem demo
  let audioUrl = null;

  // Lấy màu phòng
  const roomColorHex = document.getElementById('boardColor').value;

  // Đóng gói dữ liệu
  const demoData = {
    boards,
    audioUrl,
    roomColorHex
  };
  // Lưu vào sessionStorage
  sessionStorage.setItem('galleryDemoData', JSON.stringify(demoData));
  // Mở trang xem demo (index.html)
  window.open('index.html?demo=1', '_blank');
});


// Hiển thị hộp thoại hướng dẫn khi click dấu hỏi
document.querySelector('.help').addEventListener('click', function () {
  document.querySelector('.operating-intro').classList.remove('display-none');
});

// Đóng hộp thoại hướng dẫn khi click nút đóng
document.querySelector('.operating-intro-close').addEventListener('click', function () {
  document.querySelector('.operating-intro').classList.add('display-none');
});

// Đóng hộp thoại hướng dẫn khi click ra ngoài vùng nội dung
document.querySelector('.operating-intro').addEventListener('click', function (e) {
  if (e.target === this) {
    this.classList.add('display-none');
  }
});

async function uploadAudioToR2(file) {
  const formData = new FormData();
  formData.append('audio', file);

  const res = await fetch('https://dearlove-backend.onrender.com/api/r2/upload-audio', {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  if (data.success && data.data && data.data.url) {
    console.log('Âm thanh đã upload:', data.data.url);
    return data.data.url;
  }
  throw new Error('Upload âm thanh thất bại');
}

async function createProduct(product) {
  const res = await fetch('https://dearlove-backend.onrender.com/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });
  const data = await res.json();
  if (data.success) {
    console.log(data.data); // sản phẩm vừa tạo
  } else {
    alert('Lỗi: ' + data.message);
  }
}



