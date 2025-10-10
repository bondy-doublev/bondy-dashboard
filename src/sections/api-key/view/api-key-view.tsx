/* eslint-disable react/jsx-boolean-value */
import { useState, useEffect } from 'react';
import { Box, Card, Button, Typography, TablePagination, TextField } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { Scrollbar } from 'src/components/scrollbar';
import { toast } from 'react-toastify';
import { apiKeyService } from 'src/services/apiKeyService';
import { useTable } from 'src/hooks/useTable';
import ConfirmModal from 'src/components/modal/ConfirmModal';
import { useDebounce } from 'src/hooks/useDebounce';
import EditApiKeyDialog from '../components/UpdateApiKeyDialog';
import ApiKeyTable from '../components/ApiKeyTable';
import CreateApiKeyDialog from '../components/CreateApiKeyDialog';

export function ApiKeyView() {
  const table = useTable();
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [selectedKey, setSelectedKey] = useState<any>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedKeyToDelete, setSelectedKeyToDelete] = useState<any>(null);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [openCreateForm, setOpenCreateForm] = useState(false);

  const handleGetAll = async () => {
    try {
      const res = await apiKeyService.getAll();
      let data = res?.data || res;
      if (debouncedSearch) {
        data = data.filter((x: any) =>
          x.name.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
      }
      setApiKeys(data);
    } catch {
      toast.error('Failed to load API keys');
    }
  };

  useEffect(() => {
    handleGetAll();
  }, [debouncedSearch]);

  const handleAskDelete = (key: any) => {
    setSelectedKeyToDelete(key);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedKeyToDelete) return;
    try {
      await apiKeyService.delete(selectedKeyToDelete.id);
      toast.success('API Key deleted successfully');
      handleGetAll();
    } catch {
      toast.error('Failed to delete API key');
    } finally {
      setConfirmDeleteOpen(false);
      setSelectedKeyToDelete(null);
    }
  };

  const handleOpenEditForm = (key: any) => {
    setSelectedKey(key);
    setOpenEditForm(true);
  };

  const handleCloseEditForm = () => {
    setOpenEditForm(false);
    setSelectedKey(null);
  };

  const handleCreate = async () => {
    const name = prompt('Enter API Key name:');
    if (!name) return;
    try {
      const newKey = {
        name,
        rawKey: crypto.randomUUID(), // auto generate key
      };
      await apiKeyService.create(newKey);
      toast.success('API Key created successfully');
      handleGetAll();
    } catch {
      toast.error('Failed to create API Key');
    }
  };

  return (
    <DashboardContent>
      {/* Xác nhận xóa */}
      <ConfirmModal
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        type="error"
        title="Confirm Delete"
        message={`Are you sure you want to delete "${selectedKeyToDelete?.name}"?`}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Form edit */}
      <EditApiKeyDialog
        open={openEditForm}
        onClose={handleCloseEditForm}
        apiKey={selectedKey}
        onUpdated={handleGetAll}
      />

      <CreateApiKeyDialog
        open={openCreateForm}
        onClose={() => setOpenCreateForm(false)}
        onCreated={handleGetAll}
      />

      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          API Keys
        </Typography>

        <TextField
          label="Search by Name"
          size="small"
          sx={{ mr: 2 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button variant="contained" color="primary" onClick={() => setOpenCreateForm(true)}>
          + New Key
        </Button>
      </Box>

      <Card>
        <Scrollbar>
          <ApiKeyTable
            apiKeys={apiKeys}
            table={table}
            handleOpenEditForm={handleOpenEditForm}
            handleDelete={handleAskDelete}
          />
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={apiKeys.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}
