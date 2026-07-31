import { profileDisplayName, saveProfile } from './auth.js';
import { renderAvatar } from './avatar.js';

export function initProfileForm({ user, profile, redirectOnSave }) {
  const form = document.querySelector('#profileForm'); const error = document.querySelector('[data-profile-error]'); const success = document.querySelector('[data-profile-success]'); const input = document.querySelector('#avatarInput'); const preview = document.querySelector('#avatarPreview'); let current = profile; let selectedFile;
  form.firstName.value = profile?.first_name || ''; form.lastName.value = profile?.last_name || ''; form.age.value = profile?.age || '';
  const drawAvatar = (avatarUrl = current?.avatar_url) => renderAvatar(preview, { name: form.firstName.value || current?.first_name || '', email: user.email, src: avatarUrl });
  drawAvatar();
  input.addEventListener('change', () => { selectedFile = input.files[0]; if (!selectedFile) return; if (selectedFile.size > 2 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(selectedFile.type)) { error.textContent = 'Выберите PNG, JPG или WebP размером до 2 МБ.'; error.hidden = false; input.value = ''; return; } error.hidden = true; drawAvatar(URL.createObjectURL(selectedFile)); });
  form.addEventListener('submit', async (event) => { event.preventDefault(); const button = form.querySelector('button[type="submit"]'); button.disabled = true; error.hidden = true; success.hidden = true; try { current = await saveProfile(user, { firstName: form.firstName.value, lastName: form.lastName.value, age: form.age.value }, selectedFile, current); selectedFile = null; drawAvatar(); if (redirectOnSave) window.location.replace('chat.html'); else { success.textContent = `Профиль ${profileDisplayName(current, user.email)} сохранён.`; success.hidden = false; button.disabled = false; } } catch (saveError) { error.textContent = saveError.message || 'Не удалось сохранить изменения.'; error.hidden = false; button.disabled = false; } });
}
