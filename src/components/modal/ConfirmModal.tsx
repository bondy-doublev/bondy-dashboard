/* eslint-disable react/jsx-boolean-value */
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import React from 'react';

type ConfirmType = 'success' | 'error' | 'warning' | 'info';

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  type?: ConfirmType;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  type = 'info',
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: ConfirmModalProps) {
  const typeConfig: Record<ConfirmType, { icon: string; color: string; titleColor: string }> = {
    success: {
      icon: 'mdi:check-circle-outline',
      color: '#4caf50',
      titleColor: 'success.main',
    },
    error: {
      icon: 'mdi:close-circle-outline',
      color: '#f44336',
      titleColor: 'error.main',
    },
    warning: {
      icon: 'mdi:alert-outline',
      color: '#ff9800',
      titleColor: 'warning.main',
    },
    info: {
      icon: 'mdi:information-outline',
      color: '#2196f3',
      titleColor: 'info.main',
    },
  };

  const { icon, color, titleColor } = typeConfig[type];

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <Iconify icon={icon as any} color={color} width={28} height={28} />
          <Typography variant="h6" color={titleColor}>
            {title}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mt: 1 }}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ pr: 2, pb: 2 }}>
        <Button onClick={onClose} color="inherit" variant="outlined">
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={type === 'error' ? 'error' : 'primary'}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
