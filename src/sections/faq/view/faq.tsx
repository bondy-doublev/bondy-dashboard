/* eslint-disable react/jsx-boolean-value */
import { useState, useEffect } from 'react';
import { Box, Card, Button, Typography, TablePagination, TextField } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { Scrollbar } from 'src/components/scrollbar';
import { toast } from 'react-toastify';
import { faqService, FaqResponse } from 'src/services/faqService';
import { useTable } from 'src/hooks/useTable';
import ConfirmModal from 'src/components/modal/ConfirmModal';
import { useDebounce } from 'src/hooks/useDebounce';
import FaqTable from '../components/FaqTable';
import CreateFaqDialog from '../components/CreateFaqDialog';

export function FaqView() {
  const table = useTable();
  const [faqs, setFaqs] = useState<FaqResponse[]>([]);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const [openCreate, setOpenCreate] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<FaqResponse | null>(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState<FaqResponse | null>(null);

  const loadFaqs = async () => {
    const data = await faqService.getAll();
    let filtered = data;

    if (debouncedSearch) {
      filtered = data.filter((x) =>
        x.question.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    setFaqs(filtered);
  };

  useEffect(() => {
    loadFaqs();
  }, [debouncedSearch]);

  const handleDelete = async () => {
    if (!selectedDelete) return;
    await faqService.delete(selectedDelete.id);
    toast.success('FAQ deleted');
    setConfirmDeleteOpen(false);
    loadFaqs();
  };

  return (
    <DashboardContent>
      {/* Confirm delete */}
      <ConfirmModal
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleDelete}
        type="error"
        title="Delete FAQ"
        message={`Delete question: "${selectedDelete?.question}"?`}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Dialogs */}
      <CreateFaqDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={loadFaqs}
      />

      {/* Header */}
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          FAQs
        </Typography>

        <TextField
          size="small"
          label="Search question"
          sx={{ mr: 2 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          + New FAQ
        </Button>
      </Box>

      {/* Table */}
      <Card>
        <Scrollbar>
          <FaqTable
            faqs={faqs}
            table={table}
            onDelete={(faq) => {
              setSelectedDelete(faq);
              setConfirmDeleteOpen(true);
            }}
          />
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={faqs.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}
