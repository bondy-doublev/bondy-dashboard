import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Tooltip,
  IconButton,
} from '@mui/material';
import { useState } from 'react';
import { FaCopy } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { apiKeyService } from 'src/services/apiKeyService';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateApiKeyDialog({ open, onClose, onCreated }: Props) {
  const [name, setName] = useState('');
  const [prefix, setPrefix] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [rawKey, setRawKey] = useState(crypto.randomUUID());
  const [loading, setLoading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawKey);
    toast.info('Copied key to clipboard');
  };

  const handleGenerate = () => {
    setRawKey(crypto.randomUUID());
  };

  const handleCreate = async () => {
    if (!name.trim()) return toast.warning('Please enter API Key name');
    setLoading(true);
    try {
      await apiKeyService.create({
        name,
        rawKey,
        prefix: prefix || '',
        expiresAt: expiresAt || '',
      });
      toast.success('API Key created successfully');
      onCreated();
      handleClose();
    } catch {
      toast.error('Failed to create API Key');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setPrefix('');
    setExpiresAt('');
    setRawKey(crypto.randomUUID());
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New API Key</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required />

          <TextField
            label="Prefix"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            placeholder="(optional)"
          />

          <TextField
            label="Expires At"
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              label="Generated Raw Key"
              value={rawKey}
              fullWidth
              InputProps={{ readOnly: true }}
            />
            <Tooltip title="Copy Key">
              <IconButton color="primary" onClick={handleCopy}>
                <FaCopy />
              </IconButton>
            </Tooltip>
            <Button onClick={handleGenerate} variant="outlined">
              Regenerate
            </Button>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleCreate} variant="contained" disabled={loading}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
