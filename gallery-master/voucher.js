// ...existing code...

const voucherList = document.getElementById('voucherList');
const voucherResult = document.getElementById('voucherResult');
let selectedVoucher = null;
let vouchers = [];

async function loadUserVouchers() {
  voucherList.innerHTML = 'Đang tải voucher...';
  voucherResult.style.display = 'none';
  selectedVoucher = null;
  vouchers = [];
  const uid = localStorage.getItem('user_uid');
  if (!uid) {
    voucherList.innerHTML = '<span style="color:#e53935;">Bạn cần đăng nhập để xem voucher!</span>';
    return;
  }
  try {
    const res = await fetch(`https://dearlove-backend.onrender.com/api/vouchers/saved/${uid}`);
    const data = await res.json();
    if (!data.success) {
      voucherList.innerHTML = `<span style="color:#e53935;">${data.message}</span>`;
      return;
    }
    if (!data.data.length) {
      voucherList.innerHTML = '<span style="color:#888;">Bạn không có voucher nào cả!</span>';
      return;
    }
    vouchers = data.data;
    voucherList.innerHTML = vouchers.map((v, idx) => `
      <div class="voucher-item" data-idx="${idx}">
        <input type="radio" name="voucher" id="voucher_${idx}" ${idx===0?'checked':''}>
        <label for="voucher_${idx}">
          <b>${v.code}</b> - Giảm: ${v.discountValue}% | HSD: ${new Date(v.expiredAt).toLocaleDateString()}
        </label>
      </div>
    `).join('');
    // Mặc định chọn voucher đầu tiên nếu có
    selectedVoucher = vouchers[0];
  } catch (err) {
    voucherList.innerHTML = '<span style="color:#e53935;">Không thể tải voucher!</span>';
  }
}

// Lắng nghe chọn voucher
voucherList.addEventListener('change', (e) => {
  if (e.target.name === 'voucher') {
    const idx = Array.from(voucherList.querySelectorAll('input[name="voucher"]')).findIndex(r => r.checked);
    selectedVoucher = vouchers[idx];
  }
});


// Gọi hàm này khi load trang hoặc sau khi đăng nhập thành công
document.addEventListener('DOMContentLoaded', loadUserVouchers);

// Nếu muốn khi đăng nhập xong thì load lại voucher, bạn có thể gọi loadUserVouchers() trong onAuthStateChanged

// Khi submit form, gửi selectedVoucher.code lên backend nếu cần
document.getElementById('roomForm').addEventListener('submit', async (e) => {
  // ...existing code...
  // const voucherCode = selectedVoucher ? selectedVoucher.code : null;
  // Gửi voucherCode lên backend cùng dữ liệu phòng nếu cần
  // ...existing code...
});

// ...existing code...