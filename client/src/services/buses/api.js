import { API_BASE } from '../config.js';

const base = API_BASE || '';

export const fetchBuses = async () => {
  const res = await fetch(`${base}/buses`);
  if (!res.ok) {
    try {
      const err = await res.json();
      const error = new Error(err?.message || JSON.stringify(err) || 'Error fetching buses');
      if (err && err.errors) error.errors = err.errors;
      throw error;
    } catch (e) {
      const text = await res.text();
      throw new Error(text || 'Error fetching buses');
    }
  }
  return res.json();
};

export const createBus = async (busData) => {
  const res = await fetch(`${base}/buses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(busData),
  });
  if (!res.ok) {
    try {
      const err = await res.json();
      const error = new Error(err?.message || JSON.stringify(err) || 'Error creating bus');
      if (err && err.errors) error.errors = err.errors;
      throw error;
    } catch (e) {
      const text = await res.text();
      throw new Error(text || 'Error creating bus');
    }
  }
  return res.json();
};

export const updateBus = async (busId, busData) => {
  const res = await fetch(`${base}/buses/${busId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(busData),
  });
  if (!res.ok) {
    try {
      const err = await res.json();
      const error = new Error(err?.message || JSON.stringify(err) || 'Error updating bus');
      if (err && err.errors) error.errors = err.errors;
      throw error;
    } catch (e) {
      const text = await res.text();
      throw new Error(text || 'Error updating bus');
    }
  }
  return res.json();
};

export const deleteBus = async (busId) => {
  const res = await fetch(`${base}/buses/${busId}`, { method: 'DELETE' });
  if (!res.ok) {
    try {
      const err = await res.json();
      const error = new Error(err?.message || JSON.stringify(err) || 'Error deleting bus');
      if (err && err.errors) error.errors = err.errors;
      throw error;
    } catch (e) {
      const text = await res.text();
      throw new Error(text || 'Error deleting bus');
    }
  }
  return res.json();
};


export const fetchBusesByEmpresa = async (empresaId) => {
  const res = await fetch(`${base}/buses/empresa/${empresaId}`);
  if (!res.ok) {
    try {
      const err = await res.json();
      const error = new Error(err?.message || JSON.stringify(err) || 'Error fetching buses by empresa');
      if (err && err.errors) error.errors = err.errors;
      throw error;
    } catch (e) {
      const text = await res.text();
      throw new Error(text || 'Error fetching buses by empresa');
    }
  }
  return res.json();
};

export default null;

