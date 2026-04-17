/**
 * ============================================================
 *  WETÉ — ملف الوظائف التفاعلية (لا تحتاج للتعديل عادةً)
 * ============================================================
 */

// حالة التطبيق
let currentUser = null;
let currentOrder = {
  station: null,
  fuel: null,
  quantity: 20,
  bank: null
};
let pendingOrderStation = null;
let activeFilter = 'all';

// ============================================================
//  تهيئة الموقع عند التحميل
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  renderStations(stations);
  renderBanks();
  loadUserFromStorage();
  updateProfileUI();
  updateStationCount(stations.length);
});

// ============================================================
//  رسم بطاقات المحطات
// ============================================================
function renderStations(list) {
  const grid = document.getElementById('stationsGrid');
  grid.innerHTML = '';

  if (list.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:60px 20px; color:var(--text-muted)">
        <div style="font-size:3rem; margin-bottom:12px">🔍</div>
        <p>لا توجد محطات مطابقة للبحث</p>
      </div>`;
    updateStationCount(0);
    return;
  }

  list.forEach(station => {
    const card = document.createElement('div');
    card.className = 'station-card';
    card.dataset.id = station.id;

    // بناء عناصر أنواع الوقود
    const fuelsHTML = station.fuels.map(fuel => {
      const unavail = !fuel.available;
      return `
        <div class="fuel-item ${unavail ? 'fuel-unavailable' : ''}">
          <div class="fuel-label">
            <span>${fuel.icon}</span>
            <span>${fuel.name}</span>
            ${!unavail ? `<span class="fuel-stock">${formatStock(fuel.stock)}</span>` : '<span class="fuel-stock">غير متوفر</span>'}
          </div>
          <span class="fuel-price">${unavail ? '—' : fuel.price + ' أوقية/L'}</span>
        </div>`;
    }).join('');

    // صورة أو placeholder
    const imgHTML = station.image
      ? `<img src="${station.image}" alt="${station.name}" class="station-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
      : '';
    const placeholderHTML = `<div class="station-img-placeholder" ${station.image ? 'style="display:none"' : ''}>${station.emoji}</div>`;

    const canOrder = station.isOpen && station.fuels.some(f => f.available);

    card.innerHTML = `
      ${imgHTML}
      ${placeholderHTML}
      <div class="station-badge ${station.isOpen ? 'open' : 'closed'}">
        ${station.isOpen ? '● مفتوح' : '● مغلق'}
      </div>
      <div class="station-body">
        <div class="station-name">${station.name}</div>
        <div class="station-location">📍 ${station.location}</div>
        <div class="fuel-types">${fuelsHTML}</div>
        <div class="station-footer">
          <span class="station-rating">${station.rating}</span>
          <button class="order-btn" onclick="openOrderModal(${station.id})" ${canOrder ? '' : 'disabled'}>
            ${canOrder ? '🛒 اطلب الآن' : '⛔ غير متاح'}
          </button>
        </div>
      </div>`;

    grid.appendChild(card);
  });

  updateStationCount(list.length);
}

function formatStock(n) {
  if (n >= 1000) return `${(n/1000).toFixed(1)}K L`;
  return `${n} L`;
}

function updateStationCount(n) {
  document.getElementById('stationCount').textContent = `(${n})`;
}

// ============================================================
//  البحث والتصفية
// ============================================================
function filterStations() {
  applyFilters();
}

function clearSearch() {
  document.getElementById('searchInput').value = '';
  applyFilters();
}

function filterByType(type, btn) {
  activeFilter = type;
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  applyFilters();
}

function applyFilters() {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();

  let filtered = stations.filter(s => {
    const matchSearch = !query || s.name.includes(query) || s.location.includes(query);

    let matchType = true;
    if (activeFilter === 'gasoil') {
      matchType = s.fuels.some(f => f.id === 'gasoil' && f.available);
    } else if (activeFilter === 'essence') {
      matchType = s.fuels.some(f => f.id === 'essence' && f.available);
    } else if (activeFilter === 'both') {
      matchType = s.fuels.every(f => f.available);
    }

    return matchSearch && matchType;
  });

  renderStations(filtered);
}

// ============================================================
//  رسم خيارات البنوك
// ============================================================
function renderBanks() {
  const grid = document.getElementById('banksGrid');
  grid.innerHTML = banks.map(b => `
    <div class="bank-opt" onclick="selectBank('${b.id}', this)" data-bank-id="${b.id}">
      <div class="bank-logo">${b.logo}</div>
      <div class="bank-name">${b.name}</div>
      <div class="bank-tag">${b.tag}</div>
    </div>`).join('');
}

function selectBank(id, el) {
  document.querySelectorAll('.bank-opt').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  currentOrder.bank = id;
}

// ============================================================
//  نافذة الطلب
// ============================================================
function openOrderModal(stationId) {
  if (!currentUser) {
    pendingOrderStation = stationId;
    openModal('loginModal');
    return;
  }
  _openOrderModal(stationId);
}

function _openOrderModal(stationId) {
  const station = stations.find(s => s.id === stationId);
  if (!station) return;

  currentOrder.station = station;
  currentOrder.fuel = null;
  currentOrder.bank = null;

  document.getElementById('modalStationName').textContent = station.name;
  document.getElementById('modalStationLocation').textContent = '📍 ' + station.location;

  // رسم خيارات الوقود
  const sel = document.getElementById('fuelSelector');
  sel.innerHTML = station.fuels.map(fuel => {
    if (!fuel.available) return '';
    return `
      <div class="fuel-opt" onclick="selectFuel('${fuel.id}', this, ${fuel.price})" data-fuel-id="${fuel.id}">
        <div class="opt-icon">${fuel.icon}</div>
        <div class="opt-name">${fuel.name}</div>
        <div class="opt-price">${fuel.price} أوقية/L</div>
        <div class="opt-stock">متوفر: ${formatStock(fuel.stock)}</div>
      </div>`;
  }).join('');

  // إعادة تعيين الكمية
  document.getElementById('qtyInput').value = 20;
  document.getElementById('totalAmount').textContent = '0 أوقية';

  // إعادة تعيين البنوك
  document.querySelectorAll('.bank-opt').forEach(b => b.classList.remove('selected'));
  currentOrder.bank = null;

  openModal('orderModal');
}

function selectFuel(id, el, price) {
  document.querySelectorAll('.fuel-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  currentOrder.fuel = { id, price };
  updateTotal();
}

function changeQty(delta) {
  const input = document.getElementById('qtyInput');
  let val = parseInt(input.value) || 0;
  val = Math.max(5, val + delta);
  input.value = val;
  updateTotal();
}

function setQty(val) {
  document.getElementById('qtyInput').value = val;
  updateTotal();
}

function updateTotal() {
  if (!currentOrder.fuel) {
    document.getElementById('totalAmount').textContent = '0 أوقية';
    return;
  }
  const qty = parseInt(document.getElementById('qtyInput').value) || 0;
  const total = qty * currentOrder.fuel.price;
  document.getElementById('totalAmount').textContent = formatNumber(total) + ' أوقية';
  currentOrder.quantity = qty;
}

function formatNumber(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function submitOrder() {
  if (!currentOrder.fuel) {
    alert('⚠️ الرجاء اختيار نوع الوقود');
    return;
  }
  const qty = parseInt(document.getElementById('qtyInput').value) || 0;
  if (qty < 5) {
    alert('⚠️ الكمية الدنيا 5 لترات');
    return;
  }
  if (!currentOrder.bank) {
    alert('⚠️ الرجاء اختيار طريقة الدفع');
    return;
  }

  const bank = banks.find(b => b.id === currentOrder.bank);
  const fuel = currentOrder.station.fuels.find(f => f.id === currentOrder.fuel.id);
  const total = qty * currentOrder.fuel.price;

  closeModal('orderModal');

  document.getElementById('successMsg').innerHTML = `
    <strong>${currentUser.name}</strong>، تم استلام طلبك بنجاح!<br><br>
    📍 <strong>${currentOrder.station.name}</strong><br>
    ⛽ ${fuel.name} — ${qty} لتر<br>
    💰 المبلغ: <strong>${formatNumber(total)} أوقية</strong><br>
    🏦 الدفع عبر: ${bank.fullName}<br><br>
    سيتم تأكيد الطلب على واتساب رقم:<br>
    <strong dir="ltr">${currentUser.phone}</strong>
  `;
  openModal('successModal');
}

// ============================================================
//  تسجيل الدخول
// ============================================================
function doLogin() {
  const name = document.getElementById('loginName').value.trim();
  const phone = document.getElementById('loginPhone').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!name) { alert('⚠️ الرجاء إدخال الاسم'); return; }
  if (!phone || phone.length < 8) { alert('⚠️ الرجاء إدخال رقم هاتف صحيح'); return; }
  if (!password || password.length < 4) { alert('⚠️ كلمة السر قصيرة جداً (4 أحرف على الأقل)'); return; }

  currentUser = { name, phone };
  saveUserToStorage(currentUser);
  updateProfileUI();
  closeModal('loginModal');

  if (pendingOrderStation) {
    const sid = pendingOrderStation;
    pendingOrderStation = null;
    setTimeout(() => _openOrderModal(sid), 300);
  }
}

function showRegister() {
  alert('سيتم إضافة خاصية إنشاء الحساب قريباً 🚀');
}

function doLogout() {
  currentUser = null;
  localStorage.removeItem('wete_user');
  updateProfileUI();
  closeProfileMenu();
}

// ============================================================
//  الملف الشخصي
// ============================================================
function updateProfileUI() {
  const nameEl = document.getElementById('profileName');
  const avatarEl = document.getElementById('avatarDisplay');
  const menuContent = document.getElementById('profileMenuContent');

  if (currentUser) {
    nameEl.textContent = currentUser.name.split(' ')[0];
    avatarEl.textContent = currentUser.name.charAt(0).toUpperCase();
    avatarEl.style.fontSize = '1rem';
    menuContent.innerHTML = `
      <div class="profile-info-card">
        <div class="pname">${currentUser.name}</div>
        <div class="pphone" dir="ltr">${currentUser.phone}</div>
      </div>
      <button class="logout-btn" onclick="doLogout()">🚪 تسجيل الخروج</button>`;
  } else {
    nameEl.textContent = 'دخول';
    avatarEl.textContent = '👤';
    avatarEl.style.fontSize = '1.1rem';
    menuContent.innerHTML = `
      <div style="padding:12px; text-align:center">
        <p style="color:var(--text-muted); font-size:0.88rem; margin-bottom:12px">سجّل الدخول للطلب</p>
        <button class="order-submit-btn" style="font-size:0.9rem; padding:10px" onclick="closeProfileMenu(); openModal('loginModal')">
          تسجيل الدخول
        </button>
      </div>`;
  }
}

function toggleProfileMenu() {
  const menu = document.getElementById('profileMenu');
  menu.classList.toggle('open');
}

function closeProfileMenu() {
  document.getElementById('profileMenu').classList.remove('open');
}

// إغلاق القائمة عند النقر خارجها
document.addEventListener('click', (e) => {
  const area = document.getElementById('profileArea');
  if (!area.contains(e.target)) closeProfileMenu();
});

// ============================================================
//  القائمة الجانبية
// ============================================================
function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebarOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

// ============================================================
//  النوافذ المنبثقة (Modals)
// ============================================================
function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

function closeOrderModal(e) {
  if (e.target.classList.contains('modal-overlay')) {
    closeModal(e.target.id);
  }
}

// ============================================================
//  التخزين المحلي
// ============================================================
function saveUserToStorage(user) {
  try { localStorage.setItem('wete_user', JSON.stringify(user)); } catch(e) {}
}

function loadUserFromStorage() {
  try {
    const u = localStorage.getItem('wete_user');
    if (u) currentUser = JSON.parse(u);
  } catch(e) {}
}