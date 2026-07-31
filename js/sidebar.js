import { getAuthState } from './auth.js';
import { renderUserMenu } from './user-ui.js';

const sidebar = document.querySelector('#sidebar');
const userArea = document.querySelector('#userArea');
const toggle = document.querySelector('#sidebarToggle');
const newChat = document.querySelector('#newChat');

toggle?.addEventListener('click', () => sidebar.classList.toggle('open'));
newChat?.addEventListener('click', () => location.reload());
document.addEventListener('keydown', (event) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); location.reload(); } });

async function syncSidebar() {
  try {
    const state = await getAuthState();
    if (state?.user && !state.profile?.profile_completed) { window.location.replace('profile.html?setup=1'); return; }
    window.axsimaAuthState = state;
    document.body.classList.toggle('is-guest', !state);
    document.body.classList.toggle('is-authenticated', Boolean(state));
    document.querySelectorAll('[data-auth-only]').forEach((element) => { element.hidden = !state; });
    const greeting = document.querySelector('.intro-message h1');
    if (greeting) greeting.textContent = state?.profile?.first_name ? `Добрый вечер, ${state.profile.first_name}.` : 'Добрый вечер.';
    renderUserMenu(userArea, state);
  } catch (error) { console.error('Sidebar initialization failed:', error); renderUserMenu(userArea, null); }
}
document.addEventListener('profile:updated', syncSidebar);
syncSidebar();
