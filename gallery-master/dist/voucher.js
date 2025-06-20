// ...existing code...

const voucherList = document.getElementById('voucherList');
const voucherResult = document.getElementById('voucherResult');
const totalPriceDiv = document.getElementById('totalPrice');
let selectedVoucher = null;
let vouchers = [];

function updateTotalPrice() {
  if (selectedVoucher) {
    finalPrice = ORIGINAL_PRICE - Math.round(ORIGINAL_PRICE * selectedVoucher.discountValue / 100);
    totalPriceDiv.innerHTML = `Tổng tiền thanh toán: <span style="color:#6c63ff;">${finalPrice.toLocaleString()} VNĐ</span> <span style="font-size:14px;color:#6c63ff;">(đã áp dụng voucher)</span>`;
  } else {
    finalPrice = ORIGINAL_PRICE;
    totalPriceDiv.innerHTML = `Tổng tiền thanh toán: <span style="color:#6c63ff;">${finalPrice.toLocaleString()} VNĐ</span>`;
  }
}

async function loadUserVouchers() {
  if (!voucherList) return;
  voucherList.innerHTML = 'Đang tải voucher...';
  voucherResult.style.display = 'none';
  selectedVoucher = null;
  vouchers = [];
  updateTotalPrice();
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
        <input class= "checkbox" type="checkbox" name="voucher" id="voucher_${idx}">
        <label for="voucher_${idx}">
          <b>${v.code}</b> - Giảm: ${v.discountValue}% | HSD: ${new Date(v.expiredAt).toLocaleDateString()}
        </label>
      </div>
    `).join('');
    selectedVoucher = null; // Không chọn mặc định
    updateTotalPrice();
  } catch (err) {
    voucherList.innerHTML = '<span style="color:#e53935;">Không thể tải voucher!</span>';
  }
}

// Lắng nghe chọn/hủy voucher
if (voucherList) {
  voucherList.addEventListener('change', (e) => {
    if (e.target.name === 'voucher') {
      const checkboxes = voucherList.querySelectorAll('input[name="voucher"]');
      const idx = Array.from(checkboxes).findIndex(cb => cb === e.target);

      if (e.target.checked) {
        // Bỏ chọn tất cả, chỉ chọn cái vừa click
        checkboxes.forEach((cb, i) => cb.checked = i === idx);
        selectedVoucher = vouchers[idx];
      } else {
        // Nếu click vào cái đang chọn thì hủy chọn hết
        selectedVoucher = null;
      }
      updateTotalPrice();
    }
  });
}


function updateTotalPrice() {
  const tipInput = document.getElementById('tipAmount');
  const tip = tipInput ? parseInt(tipInput.value, 10) || 0 : 0;
  let price = ORIGINAL_PRICE;
  if (selectedVoucher) {
    price = price - Math.round(price * selectedVoucher.discountValue / 100);
  }
  finalPrice = price + tip;
  if (selectedVoucher) {
    totalPriceDiv.innerHTML = `Tổng tiền: <span style="color:#e53935;">${finalPrice.toLocaleString()} VNĐ</span> <span style="font-size:14px;color:#888;">(đã áp dụng voucher${tip > 0 ? `, tip ${tip.toLocaleString()} VNĐ` : ''})</span>`;
  } else {
    totalPriceDiv.innerHTML = `Tổng tiền: <span style="color:#6c63ff;">${finalPrice.toLocaleString()} VNĐ</span>${tip > 0 ? ` <span style="font-size:14px;color:#888;">(tip ${tip.toLocaleString()} VNĐ)</span>` : ''}`;
  }
}

const tipInput = document.getElementById('tipAmount');
if (tipInput) {
  tipInput.addEventListener('input', updateTotalPrice);
}

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