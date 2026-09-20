'use client';

import { useCallback, useState } from 'react';

import { reportService } from '../services/report-service';
import type { ReportFilters, ReportType } from '../types/report';

const DEFAULT_REPORT_FILTERS: ReportFilters = {
  reportType: 'inventory',
  search: '',
  warehouseId: 'ALL',
  dateRange: 'ALL',
  dateFrom: '',
  dateTo: '',
};

export function useReports() {
  const [filters, setFilters] = useState<ReportFilters>(DEFAULT_REPORT_FILTERS);

  const [refreshKey, setRefreshKey] = useState(0);

  void refreshKey;

  const warehouses = reportService.getWarehouses();

  const reportData = reportService.getReportData(filters);

  const updateFilters = useCallback((patch: Partial<ReportFilters>) => {
    setFilters((current) => ({
      ...current,
      ...patch,
    }));
  }, []);

  const setReportType = useCallback((reportType: ReportType) => {
    setFilters((current) => ({
      ...current,
      reportType,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_REPORT_FILTERS);
  }, []);

  const refresh = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  return {
    filters,
    warehouses,
    reportData,
    updateFilters,
    setReportType,
    resetFilters,
    refresh,
  };
}
