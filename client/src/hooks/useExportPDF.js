import { useState, useCallback } from 'react';
import { API_BASE } from '../services/config';

function buildQuery(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== null && typeof v !== 'undefined' && String(v).trim() !== '') {
      params.append(k, v);
    }
  });
  return params.toString();
}

export default function useExportPDF() {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  const download = useCallback(async (filters = {}, opts = {}) => {
    const { endpoint = '/rutas_tiempo_real/report/pdf', filenamePrefix = 'reporte_viajes' } = opts;
    setError(null);
    setDownloading(true);

    try {
      const qs = buildQuery(filters);
      const url = `${API_BASE}${endpoint}${qs ? `?${qs}` : ''}`;

      const res = await fetch(url, { method: 'GET' });
      if (!res.ok) {
        const text = await res.text().catch(() => null);
        throw new Error(text || `Error ${res.status}`);
      }

      const blob = await res.blob();
      const filename = `${filenamePrefix}_${new Date().toISOString().slice(0,10)}.pdf`;

      const link = document.createElement('a');
      const blobUrl = window.URL.createObjectURL(blob);
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);

      setDownloading(false);
      return true;
    } catch (err) {
      console.error('useExportPDF error:', err);
      setError(err);
      setDownloading(false);
      throw err;
    }
  }, []);

  return { download, downloading, error };
}
