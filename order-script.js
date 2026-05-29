/* ═══════════════════════════════════════════════════════════
   QUERA WATER — Secure Order Portal Script (E-commerce Redesign)
   ═══════════════════════════════════════════════════════════ */

// 1. Inject Floating Premium Water Particles
(function initParticles() {
  const wrap = document.createElement('div');
  wrap.className = 'particles-wrap';
  document.body.appendChild(wrap);

  const colors = [
    'rgba(0, 210, 255, 0.45)', // Vivid neon blue
    'rgba(139, 187, 232, 0.35)', // Soft glacier blue
    'rgba(0, 210, 255, 0.25)', 
    'rgba(255, 255, 255, 0.22)',  // Purity white
    'rgba(244, 249, 252, 0.18)'
  ];

  const particleCount = 28;

  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 1.5; // 1.5px to 5.5px particles
    p.style.cssText = [
      `width: ${size}px`,
      `height: ${size}px`,
      `left: ${Math.random() * 100}%`,
      `background: ${colors[Math.floor(Math.random() * colors.length)]}`,
      `animation-duration: ${8 + Math.random() * 18}s`,
      `animation-delay: ${-Math.random() * 18}s`,
      `--drift: ${(Math.random() - 0.5) * 150}px`
    ].join(';');
    wrap.appendChild(p);
  }
})();

// 2. Global State for Products & Cart
const products = {
  'qty-200ml': {
    name: 'Quera Premium 200ml',
    price: 180,
    pack: 'Case of 48',
    img: 'bottle-200ml.png'
  },
  'qty-500ml': {
    name: 'Quera Premium 500ml',
    price: 240,
    pack: 'Case of 24',
    img: 'bottle-750ml.png'
  },
  'qty-1l': {
    name: 'Quera Premium 1L',
    price: 200,
    pack: 'Case of 12',
    img: 'bottle-1l.png'
  },
  'qty-premium-1l': {
    name: 'Quera Premium 1L (Pedestal)',
    price: 350,
    pack: 'Case of 12',
    img: 'gallery-pedestal.jpg'
  }
};

let cart = {
  'qty-200ml': 0,
  'qty-500ml': 0,
  'qty-1l': 0,
  'qty-premium-1l': 0
};

// Toggle Cart Drawer
window.toggleCartDrawer = function(isOpen) {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (isOpen) {
    drawer.classList.add('open');
    overlay.classList.add('open');
  } else {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
  }
}

// Toggle Mobile Menu Drawer
window.toggleMobileMenu = function(isOpen) {
  const menu = document.getElementById('mobileMenu');
  const btn = document.getElementById('mobileMenuBtn');
  if (menu && btn) {
    if (isOpen === undefined) {
      menu.classList.toggle('open');
      btn.classList.toggle('active');
    } else if (isOpen) {
      menu.classList.add('open');
      btn.classList.add('active');
    } else {
      menu.classList.remove('open');
      btn.classList.remove('active');
    }
  }
}

// Add Click listener to Mobile Menu Button
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('mobileMenuBtn');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }
  
  // Close mobile menu if clicked outside
  document.addEventListener('click', (e) => {
    const menu = document.getElementById('mobileMenu');
    const btn = document.getElementById('mobileMenuBtn');
    if (menu && menu.classList.contains('open') && !menu.contains(e.target) && e.target !== btn) {
      toggleMobileMenu(false);
    }
  });
});

// Add Item to Cart
window.addToCart = function(productId) {
  cart[productId] = (cart[productId] || 0) + 1;
  
  // Update UI and Open Drawer
  updateCartUI();
  toggleCartDrawer(true);
  
  // Highlight inline card action momentarily
  const btn = document.querySelector(`#action-${productId} .add-to-cart-btn`);
  if (btn) {
    const originalText = btn.innerHTML;
    btn.innerHTML = '✓ Added to Cart!';
    btn.style.background = 'linear-gradient(135deg, #00b0ff, #00e5ff)';
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
    }, 1500);
  }
}

// Modify Quantities Inside Cart Drawer
window.changeCartQty = function(productId, delta) {
  let val = cart[productId] || 0;
  val = Math.max(0, val + delta);
  cart[productId] = val;
  updateCartUI();
}

// Set Quantity via direct input
window.setCartQty = function(productId, value) {
  let val = parseInt(value, 10);
  if (isNaN(val) || val < 0) {
    val = 0;
  }
  cart[productId] = val;
  updateCartUI();
}

// Update Cart Badge Count & Subtotal Invoice
window.updateCartUI = function() {
  let totalItems = 0;
  let subtotal = 0;
  const itemsContainer = document.getElementById('cartItemsList');
  itemsContainer.innerHTML = '';

  Object.keys(cart).forEach(id => {
    const qty = cart[id];
    if (qty > 0) {
      totalItems += qty;
      const prod = products[id];
      const cost = qty * prod.price;
      subtotal += cost;

      // Render Item row in Drawer
      const row = document.createElement('div');
      row.className = 'cart-item-row';
      row.innerHTML = `
        <div class="cart-item-info">
          <img src="${prod.img}" alt="${prod.name}">
          <div>
            <h5>${prod.name}</h5>
            <p>₹${prod.price} <small>/ ${prod.pack}</small></p>
          </div>
        </div>
        <div class="cart-item-actions">
          <div class="cart-qty-selector">
            <button onclick="changeCartQty('${id}', -1)">-</button>
            <input type="number" min="0" value="${qty}" onchange="setCartQty('${id}', this.value)">
            <button onclick="changeCartQty('${id}', 1)">+</button>
          </div>
          <span class="cart-item-subtotal">₹${cost.toLocaleString('en-IN')}</span>
        </div>
      `;
      itemsContainer.appendChild(row);
    }
  });

  // Update Badge Count
  const badge = document.getElementById('cartCountBadge');
  if (badge) {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'inline-block' : 'none';
  }
  const mobileBadge = document.getElementById('mobileCartBadge');
  if (mobileBadge) {
    mobileBadge.textContent = totalItems;
  }

  // Handle Empty State
  if (totalItems === 0) {
    itemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty. Add premium water to get started!</p>';
  }

  // Calculate Grand Total
  calculateTotal(subtotal);
}

// Grand Total Calculation
window.calculateTotal = function(subtotalVal) {
  // If subtotal is not passed, calculate it fresh
  if (subtotalVal === undefined) {
    subtotalVal = 0;
    Object.keys(cart).forEach(id => {
      subtotalVal += (cart[id] || 0) * products[id].price;
    });
  }

  const hasCustomLabels = document.getElementById('custom-labels-check').checked;
  const plateFee = hasCustomLabels ? 7000 : 0;
  const grandTotal = subtotalVal + plateFee;

  // Render Prices
  const subtotalEl = document.getElementById('summary-subtotal');
  const labelsRow = document.getElementById('summary-labels-row');
  const grandTotalEl = document.getElementById('grand-total');

  if (subtotalEl) subtotalEl.textContent = '₹' + subtotalVal.toLocaleString('en-IN');
  if (labelsRow) labelsRow.style.display = hasCustomLabels ? 'flex' : 'none';
  if (grandTotalEl) grandTotalEl.textContent = '₹' + grandTotal.toLocaleString('en-IN');
}

// WhatsApp Checkout Order
window.submitWaOrder = function() {
  let totalItems = 0;
  Object.keys(cart).forEach(id => { totalItems += cart[id]; });

  if (totalItems === 0) {
    alert("Please add at least 1 item to your cart to checkout.");
    return;
  }

  const name = document.getElementById('order-name').value.trim();
  const address = document.getElementById('order-address').value.trim();

  if (!name || !address) {
    alert("Please fill in your Name/Company Name and Shipping Address to proceed.");
    return;
  }

  const hasCustomLabels = document.getElementById('custom-labels-check').checked;
  const plateFee = hasCustomLabels ? 7000 : 0;
  let subtotal = 0;

  let msg = 'Hello QUERA WATER! 👋\n';
  msg += 'I would like to place a premium bulk order:\n\n';
  msg += '--- INVOICE CHECKOUT ---\n';

  Object.keys(cart).forEach(id => {
    const qty = cart[id];
    if (qty > 0) {
      const prod = products[id];
      const cost = qty * prod.price;
      subtotal += cost;
      msg += `• ${prod.name}: ${qty} Cases (₹${cost.toLocaleString('en-IN')})\n`;
    }
  });

  if (hasCustomLabels) {
    msg += `• Custom Branded Label Plate Fee: (₹7,000)\n`;
  }
  
  const grandTotal = subtotal + plateFee;
  msg += `Total Amount: ₹${grandTotal.toLocaleString('en-IN')}\n\n`;
  msg += '--- SHIPPING DETAILS ---\n';
  msg += `• Name/Company: ${name}\n`;
  msg += `• Address: ${address}\n\n`;
  msg += 'Please confirm availability and dispatch schedule. Thank you!';

  const waUrl = 'https://wa.me/918436103417?text=' + encodeURIComponent(msg);
  window.open(waUrl, '_blank');
}

// Initial Cart Setup
updateCartUI();
