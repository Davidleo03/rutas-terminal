
import { API_BASE } from '../config.js';

export async function forgotPassword(email) {
  const res = await fetch(`${API_BASE.replace(/\/$/, '')}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al enviar correo');
  return data;
}

export async function resetPassword(email, token, newPassword) {
  const res = await fetch(`${API_BASE.replace(/\/$/, '')}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, token, newPassword }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al restablecer contraseña');
  return data;
}
