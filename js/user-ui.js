import { profileDisplayName, signOut } from './auth.js';
import { avatarMarkup } from './avatar.js';

export function renderUserMenu(container, state) {
  if (!state?.user || !state.profile) {
    container.innerHTML = '<a class="guest-auth-link" href="auth.html">Войти / Регистрация <span>→</span></a>';
    return;
  }
  const { user, profile } = state; const name = profileDisplayName(profile, user.email);
  container.innerHTML = `<div class="user-menu"><button class="profile" id="profileMenu" type="button" aria-expanded="false" aria-haspopup="menu">${avatarMarkup({ name, email: user.email, src: profile.avatar_url, className: 'avatar--small' })}<span class="profile-copy"><strong title="${name}">${name}</strong><small title="${user.email}">${user.email}</small></span><i>⌄</i></button><div class="profile-dropdown" id="profileDropdown" role="menu"><a href="settings.html#profile" role="menuitem"><span>◉</span> Профиль</a><a href="settings.html" role="menuitem"><span>⚙</span> Настройки</a><button type="button" data-sign-out role="menuitem"><span>↪</span> Выйти из аккаунта</button></div></div>`;
  const button = container.querySelector('#profileMenu'); const dropdown = container.querySelector('#profileDropdown');
  button.addEventListener('click', (event) => { event.stopPropagation(); const open = dropdown.classList.toggle('is-open'); button.setAttribute('aria-expanded', String(open)); });
  document.addEventListener('click', () => { dropdown.classList.remove('is-open'); button.setAttribute('aria-expanded', 'false'); });
  container.querySelector('[data-sign-out]').addEventListener('click', () => signOut());
}
