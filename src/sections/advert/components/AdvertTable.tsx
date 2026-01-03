'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import { AdvertRequestStatus } from 'src/enums';
import type { ChipProps } from '@mui/material';
import { useState } from 'react';

/* =========================
 * TYPES
 * ========================= */
interface Props {
  adverts: any[];
  table: { page: number; rowsPerPage: number };
  onUpdateStatus: (advert: any, status: AdvertRequestStatus) => void;
  onPreview: (advert: any) => void;
}

/* =========================
 * STATUS CONFIG
 * ========================= */
const STATUS_CONFIG: Record<AdvertRequestStatus, { label: string; color: ChipProps['color'] }> = {
  pending: { label: 'Pending', color: 'warning' },
  waiting_payment: { label: 'Waiting payment', color: 'info' },
  paid: { label: 'Paid', color: 'primary' },
  running: { label: 'Running', color: 'success' },
  done: { label: 'Done', color: 'default' },
  rejected: { label: 'Rejected', color: 'error' },
  cancelled: { label: 'Cancelled', color: 'secondary' },
};

const ALL_STATUSES = Object.values(AdvertRequestStatus);

/* =========================
 * COMPONENT
 * ========================= */
export default function AdvertTable({ adverts, table, onUpdateStatus, onPreview }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAd, setSelectedAd] = useState<any | null>(null);

  const open = Boolean(anchorEl);

  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>, ad: any) => {
    setAnchorEl(e.currentTarget);
    setSelectedAd(ad);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedAd(null);
  };

  const handleChangeStatus = (status: AdvertRequestStatus) => {
    if (selectedAd) {
      onUpdateStatus(selectedAd, status);
    }
    handleCloseMenu();
  };

  return (
    <TableContainer sx={{ overflowX: 'auto', maxWidth: '100%' }}>
      <Table sx={{ minWidth: 1100 }}>
        <TableHead>
          <TableRow>
            <TableCell>
              <b>ID</b>
            </TableCell>
            <TableCell>
              <b>User</b>
            </TableCell>
            <TableCell>
              <b>Title</b>
            </TableCell>
            <TableCell>
              <b>Media</b>
            </TableCell>
            <TableCell>
              <b>Time</b>
            </TableCell>
            <TableCell>
              <b>Total Price</b>
            </TableCell>
            <TableCell>
              <b>Status</b>
            </TableCell>
            <TableCell align="right" sx={{ width: 120 }}>
              <b>Actions</b>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {adverts
            ?.slice(
              table.page * table.rowsPerPage,
              table.page * table.rowsPerPage + table.rowsPerPage
            )
            .map((ad) => {
              const status = ad.status as AdvertRequestStatus;

              return (
                <TableRow key={ad.id} hover>
                  <TableCell>{ad.id}</TableCell>

                  <TableCell>
                    <b>{ad.accountName}</b>
                  </TableCell>

                  <TableCell
                    sx={{
                      maxWidth: 240,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {ad.title}
                  </TableCell>

                  <TableCell>
                    <b>{ad.media?.length || 0}</b> file
                  </TableCell>

                  <TableCell>
                    {ad.startDate} → {ad.endDate}
                  </TableCell>

                  <TableCell>{ad.totalPrice?.toLocaleString('vi-VN')} đ</TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      label={STATUS_CONFIG[status].label}
                      color={STATUS_CONFIG[status].color}
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>

                  {/* ACTIONS – COMPACT */}
                  <TableCell align="right">
                    <Tooltip title="Preview">
                      <IconButton size="small" onClick={() => onPreview(ad)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Update status">
                      <IconButton size="small" onClick={(e) => handleOpenMenu(e, ad)}>
                        <SyncAltIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>

      {/* STATUS MENU */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
        {ALL_STATUSES.map((s) => (
          <MenuItem
            key={s}
            disabled={s === selectedAd?.status}
            onClick={() => handleChangeStatus(s)}
          >
            {STATUS_CONFIG[s].label}
          </MenuItem>
        ))}
      </Menu>
    </TableContainer>
  );
}
