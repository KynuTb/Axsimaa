const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (symbol) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[symbol]));

export function avatarMarkup({ name = '', email = '', src = '', className = '' } = {}) {
  const label = name || email || 'Пользователь';
  const fallback = label.trim().charAt(0).toUpperCase() || '?';
  const image = src ? `<img src="${escapeHtml(src)}" alt="">` : '';
  return `<span class="avatar ${escapeHtml(className)}" aria-label="${escapeHtml(label)}">${image}<span class="avatar-fallback"${image ? ' hidden' : ''}>${escapeHtml(fallback)}</span></span>`;
}

export function renderAvatar(container, options) {
  container.innerHTML = avatarMarkup(options);
}
