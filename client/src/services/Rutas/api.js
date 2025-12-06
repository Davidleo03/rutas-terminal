import { API_BASE } from "../config";

const RUTAS_API = `${API_BASE}/rutas`;

export const fetchRutas = async () => {
  const response = await fetch(RUTAS_API);
  if (!response.ok) {
    throw new Error('Error fetching rutas');
  }
  return response.json();
}

export const createRuta = async (rutaData) => {
  const response = await fetch(RUTAS_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rutaData),
  });
  if (!response.ok) {
    throw new Error('Error creating ruta');
  }
  return response.json();
}

export const updateRuta = async (id, rutaData) => {
  const response = await fetch(`${RUTAS_API}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rutaData),
  });
    if (!response.ok) {
    throw new Error('Error updating ruta');
    }
    return response.json();
}

export const deleteRuta = async (id) => {
  const response = await fetch(`${RUTAS_API}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Error deleting ruta');
  }
  // Some APIs return 204 No Content on delete -> no JSON to parse.
  // Only parse JSON when there is a body.
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;
  return JSON.parse(text);
}
