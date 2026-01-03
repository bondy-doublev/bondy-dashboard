'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  Chip,
  IconButton,
  ChipProps,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import { AdvertRequestStatus } from 'src/enums';

interface Props {
  open: boolean;
  advert: any | null;
  onClose: () => void;
}

export const ADVERT_STATUS_META: Record<
  AdvertRequestStatus,
  { label: string; color: ChipProps['color'] }
> = {
  pending: { label: 'Pending approval', color: 'warning' },
  waiting_payment: { label: 'Waiting for payment', color: 'info' },
  paid: { label: 'Paid', color: 'primary' },
  running: { label: 'Running', color: 'success' },
  done: { label: 'Completed', color: 'default' },
  rejected: { label: 'Rejected', color: 'error' },
  cancelled: { label: 'Cancelled', color: 'secondary' },
};

const STATUS_COLOR: Record<string, any> = {
  pending: 'warning',
  waiting_payment: 'info',
  paid: 'primary',
  running: 'success',
  done: 'default',
  rejected: 'error',
  cancelled: 'secondary',
};

export default function AdPreviewDialog({ open, advert, onClose }: Props) {
  if (!advert) return null;

  const media = advert.media || [];
  const firstMedia = media[0];
  const statusMeta = ADVERT_STATUS_META[advert.status as AdvertRequestStatus];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6">{advert.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            @{advert.accountName}
          </Typography>
        </Box>

        <Chip
          size="small"
          label={statusMeta?.label ?? advert.status}
          color={statusMeta?.color ?? 'default'}
          sx={{ mr: 2 }}
        />

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* MEDIA */}
        {firstMedia && (
          <Box
            sx={{
              mb: 2,
              borderRadius: 1,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            {firstMedia.type === 'IMAGE' ? (
              <img
                src={firstMedia.url}
                alt={advert.title}
                style={{ width: '100%', maxHeight: 360, objectFit: 'cover' }}
              />
            ) : (
              <video src={firstMedia.url} controls style={{ width: '100%', maxHeight: 360 }} />
            )}
          </Box>
        )}

        {/* INFO */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              Time
            </Typography>
            <Typography variant="body1">
              {dayjs(advert.startDate).format('DD/MM/YYYY')} →{' '}
              {dayjs(advert.endDate).format('DD/MM/YYYY')}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Total price
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {advert.totalPrice?.toLocaleString('vi-VN')} đ
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Media
            </Typography>
            <Typography variant="body1">
              {media.length} file ({media.filter((m: any) => m.type === 'IMAGE').length} img ·{' '}
              {media.filter((m: any) => m.type === 'VIDEO').length} video)
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Created at
            </Typography>
            <Typography variant="body1">
              {dayjs(advert.createdAt).format('DD/MM/YYYY HH:mm')}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
