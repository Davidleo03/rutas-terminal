import { API_BASE } from '../config.js';

export async function getEmpresas() {
    const url = `${API_BASE.replace(/\/$/, '')}/empresas`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error al obtener las empresas');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function createEmpresa(empresa) {
    const url = `${API_BASE.replace(/\/$/, '')}/empresas`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(empresa),
        });
        if (!response.ok) {
            throw new Error('Error al crear la empresa');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function updateEmpresa(id, empresa) {
    const url = `${API_BASE.replace(/\/$/, '')}/empresas/${id}`;
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(empresa),
        });
        if (!response.ok) {
            throw new Error('Error al actualizar la empresa');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function deleteEmpresa(id) {
    const url = `${API_BASE.replace(/\/$/, '')}/empresas/${id}`;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Error al eliminar la empresa');
        }
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
}