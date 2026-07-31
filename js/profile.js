import { requireAuth } from './auth.js';
import { initProfileForm } from './profile-form.js';

const state = await requireAuth({ requireProfile: false });
if (state) {
  if (state.profile?.profile_completed) window.location.replace('settings.html#profile');
  else {
    document.querySelector('#profileTitle').textContent = 'Расскажите о себе';
    document.querySelector('#profileSubtitle').textContent = 'Это поможет персонализировать ваш опыт в Axsima.';
    initProfileForm({ ...state, redirectOnSave: true });
  }
}
