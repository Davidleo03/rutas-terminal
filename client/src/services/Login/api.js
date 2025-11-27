/* Simple API helpers for the client app. */

import { API_BASE } from '../config.js';

export async function loginUser({ email, password } = {}) {
  if (!email || !password) throw new Error('Email y contraseña son requeridos');

  const url = `${API_BASE.replace(/\/$/, '')}/auth/login`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  let payload;
  try {
    payload = await res.json();
  } catch (e) {
    throw new Error('Respuesta inválida del servidor');
  }

  if (!res.ok) {
    // try to surface a useful message from the response body
    const message = payload?.error || payload?.message || 'Error al iniciar sesión';
    throw new Error(message);
  }

  return payload;
}

export default {
  loginUser,
};
