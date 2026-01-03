/* eslint-disable react/jsx-boolean-value */
'use client';

import { useState, useEffect } from 'react';
import { Box, Card, Typography, TablePagination, TextField, MenuItem } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { Scrollbar } from 'src/components/scrollbar';
import { toast } from 'react-toastify';
import { advertService } from 'src/services/advertService';
import { useTable } from 'src/hooks/useTable';
import ConfirmModal from 'src/components/modal/ConfirmModal';
import { useDebounce } from 'src/hooks/useDebounce';
import AdvertTable from '../components/AdvertTable';
import AdPreviewDialog from '../components/AdCard';
import { AdvertRequestStatus } from 'src/enums';

const STATUS_OPTIONS: AdvertRequestStatus[] = [
  AdvertRequestStatus.PENDING,
  AdvertRequestStatus.RUNNING,
  AdvertRequestStatus.DONE,
  AdvertRequestStatus.REJECTED,
  AdvertRequestStatus.CANCELLED,
  AdvertRequestStatus.ACCEPTED,
];

export const ADVERT_STATUS_LABEL: Record<AdvertRequestStatus, string> = {
  [AdvertRequestStatus.PENDING]: 'Pending approval',
  [AdvertRequestStatus.RUNNING]: 'Running',
  [AdvertRequestStatus.DONE]: 'Completed',
  [AdvertRequestStatus.REJECTED]: 'Rejected',
  [AdvertRequestStatus.CANCELLED]: 'Cancelled',
  [AdvertRequestStatus.ACCEPTED]: 'Accepted',
};

export default function AdvertView() {
  const table = useTable();

  const [adverts, setAdverts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [status, setStatus] = useState<AdvertRequestStatus | ''>('');
  const [nextStatus, setNextStatus] = useState<AdvertRequestStatus | null>(null);
  const [totalItems, setTotalItems] = useState(0);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedAdvert, setSelectedAdvert] = useState<any | null>(null);

  const [previewAdvert, setPreviewAdvert] = useState<any | null>(null);

  const handleGetAll = async () => {
    try {
      const params: any = {
        page: table.page + 1,
        limit: table.rowsPerPage,
      };
      if (status) params.status = status;

      const res = await advertService.getAllForAdmin(params);
      setAdverts(res?.items || []);
      setTotalItems(res?.pagination?.total || 0); // <-- đây
    } catch {
      toast.error('Failed to load adverts');
    }
  };

  useEffect(() => {
    handleGetAll();
  }, [debouncedSearch, status, table.page, table.rowsPerPage]);

  const handleAskUpdateStatus = (advert: any, status: AdvertRequestStatus) => {
    setSelectedAdvert(advert);
    setNextStatus(status);
    setConfirmOpen(true);
  };

  const handleConfirmUpdate = async () => {
    if (!selectedAdvert || !nextStatus) return;

    try {
      await advertService.updateStatus(selectedAdvert.id, nextStatus);
      toast.success('Advert status updated');
      handleGetAll();
    } catch {
      toast.error('Failed to update advert');
    } finally {
      setConfirmOpen(false);
      setSelectedAdvert(null);
      setNextStatus(null);
    }
  };

  return (
    <DashboardContent>
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmUpdate}
        type="warning"
        title="Confirm Status Change"
        message={`Change advert "${selectedAdvert?.title}" to "${nextStatus}"?`}
        confirmText="Confirm"
        cancelText="Cancel"
      />

      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Adverts
        </Typography>

        <TextField
          select
          size="small"
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as AdvertRequestStatus | '')}
          sx={{ mr: 2, minWidth: 180 }}
        >
          <MenuItem value="">All</MenuItem>

          {STATUS_OPTIONS.map((s) => (
            <MenuItem key={s} value={s}>
              {ADVERT_STATUS_LABEL[s]}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Search title"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      <Card>
        <Scrollbar>
          <AdvertTable
            adverts={adverts}
            table={table}
            onUpdateStatus={handleAskUpdateStatus}
            onPreview={setPreviewAdvert}
          />
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={totalItems}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      {previewAdvert && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            bgcolor: 'rgba(0,0,0,0.6)',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
          }}
          onClick={() => setPreviewAdvert(null)}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 900,
              maxHeight: '90vh',
              bgcolor: '#fff',
              borderRadius: 2,
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <AdPreviewDialog
              open={Boolean(previewAdvert)}
              advert={previewAdvert}
              onClose={() => setPreviewAdvert(null)}
            />
          </Box>
        </Box>
      )}
    </DashboardContent>
  );
}
