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
import { mailService } from 'src/services/mailService';

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
  running: { label: 'Running', color: 'success' },
  done: { label: 'Done', color: 'default' },
  rejected: { label: 'Rejected', color: 'error' },
  cancelled: { label: 'Cancelled', color: 'secondary' },
  accepted: { label: 'Accepted', color: 'primary' },
};

const ALL_STATUSES = Object.values(AdvertRequestStatus);

/* =========================
 * MAPPING STATUS TRANSITIONS
 * ========================= */
const ALLOWED_TRANSITIONS: Record<AdvertRequestStatus, AdvertRequestStatus[]> = {
  pending: [AdvertRequestStatus.ACCEPTED, AdvertRequestStatus.REJECTED],
  accepted: [], // can't change manually, only via other logic
  running: [AdvertRequestStatus.DONE, AdvertRequestStatus.CANCELLED],
  done: [],
  cancelled: [],
  rejected: [],
};

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

  const handleChangeStatus = async (status: AdvertRequestStatus) => {
    if (!selectedAd) return;

    // Nếu đang pending và admin chọn accept -> gửi mail payment request
    if (
      selectedAd.status === AdvertRequestStatus.PENDING &&
      status === AdvertRequestStatus.ACCEPTED
    ) {
      try {
        // gọi backend update status
        await onUpdateStatus(selectedAd, status);

        // gửi mail payment request
        await mailService.sendPaymentRequest({
          to: selectedAd.userEmail, // cần có email user
          userName: selectedAd.accountName,
          advertTitle: selectedAd.title,
          amount: selectedAd.totalPrice,
          dueDate: selectedAd.endDate,
        });
      } catch (err) {
        console.error('Failed to accept advert or send mail', err);
      }
    } else {
      // những trường hợp khác update status bình thường
      await onUpdateStatus(selectedAd, status);
    }

    handleCloseMenu();
  };

  // Lọc danh sách status có thể chuyển cho menu
  const getAllowedStatuses = (ad: any) => {
    return ALLOWED_TRANSITIONS[ad.status as AdvertRequestStatus] || [];
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
          {adverts?.map((ad) => {
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
        {selectedAd &&
          getAllowedStatuses(selectedAd)?.map((s) => (
            <MenuItem
              key={s}
              disabled={s === selectedAd.status}
              onClick={() => handleChangeStatus(s)}
            >
              {STATUS_CONFIG[s].label}
            </MenuItem>
          ))}
      </Menu>
    </TableContainer>
  );
}
