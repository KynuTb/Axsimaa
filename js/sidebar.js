import { getAuthState, supabase } from './auth.js';
import { renderUserMenu } from './user-ui.js';

const sidebar = document.querySelector('#sidebar');
const userArea = document.querySelector('#userArea');
const toggle = document.querySelector('#sidebarToggle');
const newChat = document.querySelector('#newChat');
const history = document.querySelector('#chatHistory');

toggle?.addEventListener('click', () => sidebar.classList.toggle('open'));
newChat?.addEventListener('click', () => location.reload());
document.addEventListener('keydown', (event) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); location.reload(); } });

function renderChats(chats) {
  if (!history) return;
  history.replaceChildren();
  if (!chats.length) {
    const empty = document.createElement('p');
    empty.className = 'history-empty';
    empty.textContent = 'No chats yet.';
    history.append(empty);
    return;
  }
  const heading = document.createElement('p');
  heading.textContent = 'CHATS';
  history.append(heading);
  chats.forEach((chat) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'history-item';
    item.textContent = chat.title || 'New chat';
    item.dataset.chatId = chat.id;
    history.append(item);
  });
}

async function loadChats(userId) {
  if (!supabase || !history) return;
  const { data, error } = await supabase.from('chats').select('id, title, updated_at').eq('user_id', userId).order('updated_at', { ascending: false });
  if (error) throw error;
  renderChats(data || []);
}

async function syncSidebar() {
  try {
    const state = await getAuthState();
    if (state?.user && !state.profile?.profile_completed) { window.location.replace('profile.html?setup=1'); return; }
    window.axsimaAuthState = state;
    document.body.classList.toggle('is-guest', !state);
    document.body.classList.toggle('is-authenticated', Boolean(state));
    document.querySelectorAll('[data-auth-only]').forEach((element) => { element.hidden = !state; });
    const greeting = document.querySelector('.intro-message h1');
    if (greeting) greeting.textContent = state?.profile?.first_name ? `Р”РѕР±СЂС‹Р№ РІРµС‡РµСЂ, ${state.profile.first_name}.` : 'Р”РѕР±СЂС‹Р№ РІРµС‡РµСЂ.';
    renderUserMenu(userArea, state);
    if (state?.user) await loadChats(state.user.id);
  } catch (error) {
    console.error('Sidebar initialization failed:', error);
    renderUserMenu(userArea, null);
  }
}

document.addEventListener('profile:updated', syncSidebar);
syncSidebar();
