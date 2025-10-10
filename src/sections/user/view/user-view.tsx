/* eslint-disable react/jsx-boolean-value */
/* eslint-disable perfectionist/sort-imports */
import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TablePagination from '@mui/material/TablePagination';
import { TextField } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthStore } from 'src/stores/authStore';
import { userService } from 'src/services/userService';
import UserTable from '../user-table';
import EditUserDialog from '../components/EditUserDialog';
import { useTable } from 'src/hooks/useTable';
import ConfirmModal from 'src/components/modal/ConfirmModal';
import { useDebounce } from 'src/hooks/useDebounce';

export function UserView() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const table = useTable();
  const [users, setUsers] = useState<any[]>([]);
  const [openEditForm, setEditOpenForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchCode, setSearchCode] = useState('');
  const [confirmToggleOpen, setConfirmToggleOpen] = useState(false);
  const [selectedUserToToggle, setSelectedUserToToggle] = useState<any>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedUserToDelete, setSelectedUserToDelete] = useState<any>(null);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const handleAskDelete = (user: any) => {
    setSelectedUserToDelete(user);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUserToDelete) return;
    try {
      await userService.deleteUser(selectedUserToDelete.id);
      toast.success('User deleted successfully');
      handleGetAllUser();
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete user');
    } finally {
      setConfirmDeleteOpen(false);
      setSelectedUserToDelete(null);
    }
  };

  const handleOpenEditForm = (user: any) => {
    setSelectedUser(user);
    setEditOpenForm(true);
  };

  const handleCloseEditForm = () => {
    setEditOpenForm(false);
    setSelectedUser(null);
  };

  const handleGetAllUser = async () => {
    const res = await userService.getAll(search);
    setUsers(res.data);
  };

  const handleToggleActive = async (userId: number) => {
    try {
      await userService.toggleActiveUser(userId);
      toast.success('User status updated');
      handleGetAllUser();
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleAskToggle = (user: any) => {
    setSelectedUserToToggle(user);
    setConfirmToggleOpen(true);
  };

  const handleConfirmToggle = async () => {
    if (!selectedUserToToggle) return;

    try {
      await handleToggleActive(selectedUserToToggle.id);
    } finally {
      setConfirmToggleOpen(false);
      setSelectedUserToToggle(null);
    }
  };

  useEffect(() => {
    handleGetAllUser();
  }, [debouncedSearch]);

  return (
    <DashboardContent>
      <ConfirmModal
        open={confirmToggleOpen}
        onClose={() => setConfirmToggleOpen(false)}
        onConfirm={handleConfirmToggle}
        type="warning"
        title="Confirm Action"
        message={`Are you sure you want to ${selectedUserToToggle?.active ? 'deactivate' : 'activate'} this user?`}
        confirmText="Yes"
        cancelText="Cancel"
      />

      <ConfirmModal
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        type="error"
        title="Confirm Delete"
        message={`Are you sure you want to delete user "${selectedUserToDelete?.email}"?`}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <EditUserDialog
        open={openEditForm}
        onClose={handleCloseEditForm}
        user={selectedUser}
        onUpdated={handleGetAllUser}
      />

      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Users
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            label="Search by Email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
          />
        </Box>
      </Box>

      {/* Table for displaying discounts */}
      <Card>
        <Scrollbar>
          <UserTable
            users={users}
            table={table}
            handleOpenEditForm={handleOpenEditForm}
            handleToggleActive={handleAskToggle}
            handleDelete={handleAskDelete}
          />
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={users.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}
