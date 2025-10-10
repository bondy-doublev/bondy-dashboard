import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Tooltip,
} from '@mui/material';
import { useState } from 'react';

interface Props {
  apiKeys: any[];
  table: { page: number; rowsPerPage: number };
  handleOpenEditForm: (key: any) => void;
  handleDelete: (key: any) => void;
}

export default function ApiKeyTable({ apiKeys, table, handleOpenEditForm, handleDelete }: Props) {
  const [showKeyId, setShowKeyId] = useState<number | null>(null);

  return (
    <TableContainer sx={{ display: 'flex', justifyContent: 'center' }}>
      <Table sx={{ minWidth: 1000 }}>
        <TableHead>
          <TableRow>
            <TableCell>
              <b>ID</b>
            </TableCell>
            <TableCell>
              <b>Name</b>
            </TableCell>
            <TableCell>
              <b>Prefix</b>
            </TableCell>
            <TableCell>
              <b>Key (hidden)</b>
            </TableCell>
            <TableCell>
              <b>Created At</b>
            </TableCell>
            <TableCell>
              <b>Expires At</b>
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
          {apiKeys
            ?.slice(
              table.page * table.rowsPerPage,
              table.page * table.rowsPerPage + table.rowsPerPage
            )
            ?.map((key) => (
              <TableRow key={key.id}>
                <TableCell>{key.id}</TableCell>
                <TableCell>{key.name}</TableCell>
                <TableCell>{key.prefix || '-'}</TableCell>

                {/* Ẩn / hiện key hash */}
                <TableCell>
                  {showKeyId === key.id ? (
                    <span style={{ fontFamily: 'monospace' }}>{key.keyHash}</span>
                  ) : (
                    '••••••••••••••'
                  )}
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ ml: 1, textTransform: 'none' }}
                    onClick={() => setShowKeyId(showKeyId === key.id ? null : key.id)}
                  >
                    {showKeyId === key.id ? 'Hide' : 'Show'}
                  </Button>
                </TableCell>

                {/* Ngày tạo và hết hạn */}
                <TableCell>
                  {key.createdAt ? new Date(key.createdAt).toLocaleString('vi-VN') : '-'}
                </TableCell>
                <TableCell>
                  {key.expiresAt ? new Date(key.expiresAt).toLocaleString('vi-VN') : 'No limit'}
                </TableCell>

                {/* Trạng thái */}
                <TableCell>
                  <span
                    style={{
                      color: key.active ? 'green' : 'red',
                      fontWeight: 600,
                    }}
                  >
                    {key.active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>

                {/* Nút hành động */}
                <TableCell>
                  <Tooltip title="Edit API Key">
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mr: 1, minWidth: '80px' }}
                      onClick={() => handleOpenEditForm(key)}
                    >
                      Edit
                    </Button>
                  </Tooltip>
                  <Tooltip title="Delete API Key">
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ minWidth: '80px' }}
                      onClick={() => handleDelete(key)}
                    >
                      Delete
                    </Button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
