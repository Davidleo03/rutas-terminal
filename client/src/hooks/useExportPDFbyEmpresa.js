import { useState, useCallback } from 'react';
import { API_BASE } from '../services/config';

export default function useExportPDFByEmpresa(id_empresa) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  const download = useCallback(async (filters = {}, opts = {}) => {
    const { endpoint = '/reportes/pdf', filenamePrefix = 'reporte_viajes' } = opts;
    setError(null);
    setDownloading(true);

    try {
      const url = `${API_BASE}${endpoint}`;

      // Agregar id_empresa automáticamente a los filtros
      const filtersWithEmpresa = {
        ...filters,
        id_empresa: id_empresa
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filtersWithEmpresa)
      });

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
      console.error('useExportPDFByEmpresa error:', err);
      setError(err);
      setDownloading(false);
      throw err;
    }
  }, [id_empresa]);

  return { download, downloading, error };
}
