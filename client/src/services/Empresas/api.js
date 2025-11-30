import { API_BASE } from '../config.js';

export async function getEmpresas() {
    const url = `${API_BASE.replace(/\/$/, '')}/empresas`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            let msg = 'Error al obtener las empresas';
            try {
                const err = await response.json();
                if (err && err.message) msg = String(err.message);
            } catch (e) {}
            throw new Error(msg);
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
            let msg = 'Error al crear la empresa';
            try {
                const err = await response.json();
                if (err && err.message) msg = String(err.message);
            } catch (e) {}
            throw new Error(msg);
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
            let msg = 'Error al actualizar la empresa';
            try {
                const err = await response.json();
                if (err && err.message) msg = String(err.message);
            } catch (e) {}
            throw new Error(msg);
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
            let msg = 'Error al eliminar la empresa';
            try {
                const err = await response.json();
                if (err && err.message) msg = String(err.message);
            } catch (e) {}
            throw new Error(msg);
        }
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
}