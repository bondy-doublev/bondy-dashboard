import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import React from 'react';
import User from 'src/models/User';

interface Props {
  users: User[];
  table: { page: number; rowsPerPage: number };
  handleOpenEditForm: (user: User) => void;
  handleToggleActive: (user: User) => void;
  handleDelete: (user: User) => void; // ✅ thêm dòng này
}

export default function UserTable({
  users,
  table,
  handleOpenEditForm,
  handleToggleActive,
  handleDelete,
}: Props) {
  return (
    <TableContainer sx={{ display: 'flex', justifyContent: 'center' }}>
      <Table sx={{ minWidth: 900 }}>
        <TableHead>
          <TableRow>
            <TableCell>
              <b>ID</b>
            </TableCell>
            <TableCell>
              <b>Avatar</b>
            </TableCell>
            <TableCell>
              <b>Email</b>
            </TableCell>
            <TableCell>
              <b>Full Name</b>
            </TableCell>
            <TableCell>
              <b>Gender</b>
            </TableCell>
            <TableCell>
              <b>Created At</b>
            </TableCell>
            <TableCell>
              <b>Status</b>
            </TableCell>
            <TableCell>
              <b>Actions</b>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {users
            ?.slice(
              table.page * table.rowsPerPage,
              table.page * table.rowsPerPage + table.rowsPerPage
            )
            ?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="avatar"
                      width={40}
                      height={40}
                      style={{ borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    'No Avatar'
                  )}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {[user.firstName, user.middleName, user.lastName].filter(Boolean).join(' ') ||
                    '-'}
                </TableCell>
                <TableCell>{user.gender ? 'Male' : 'Female'}</TableCell>

                <TableCell>{new Date(user.createdAt).toLocaleString('vi-VN')}</TableCell>
                <TableCell>
                  <span
                    style={{
                      color: user.active ? 'green' : 'red',
                      fontWeight: 600,
                    }}
                  >
                    {user.active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    sx={{ marginRight: '8px', minWidth: '80px' }}
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenEditForm(user)}
                  >
                    Edit
                  </Button>
                  <Button
                    sx={{ minWidth: '80px', marginRight: '8px', marginTop: '4px' }}
                    variant="contained"
                    color={user.active ? 'error' : 'success'}
                    onClick={() => handleToggleActive(user)}
                  >
                    {user.active ? 'Disable' : 'Activate'}
                  </Button>
                  <Button
                    sx={{ minWidth: '80px', marginTop: '4px' }}
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(user)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
