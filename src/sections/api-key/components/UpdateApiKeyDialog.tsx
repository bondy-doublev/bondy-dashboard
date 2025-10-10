import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { apiKeyService } from 'src/services/apiKeyService';

interface EditApiKeyDialogProps {
  open: boolean;
  onClose: () => void;
  apiKey: any | null;
  onUpdated: () => void;
}

export default function EditApiKeyDialog({
  open,
  onClose,
  apiKey,
  onUpdated,
}: EditApiKeyDialogProps) {
  const [form, setForm] = useState({
    name: '',
    expiresAt: '',
    active: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (apiKey) {
      setForm({
        name: apiKey.name || '',
        expiresAt: apiKey.expiresAt ? apiKey.expiresAt.slice(0, 10) : '',
        active: apiKey.active ?? true,
      });
    }
  }, [apiKey]);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!apiKey?.id) return;
    setIsSaving(true);
    try {
      await apiKeyService.update(apiKey.id, {
        name: form.name,
        expiresAt: form.expiresAt ? `${form.expiresAt}T00:00:00` : undefined,
        active: form.active,
      });
      toast.success('API Key updated successfully');
      onUpdated();
      onClose();
    } catch {
      toast.error('Failed to update API Key');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit API Key</DialogTitle>
      <DialogContent>
        <TextField
          sx={{ mt: 2 }}
          label="Name"
          fullWidth
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />

        <TextField
          sx={{ mt: 2 }}
          type="date"
          label="Expires At"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={form.expiresAt}
          onChange={(e) => handleChange('expiresAt', e.target.value)}
        />

        <FormControlLabel
          sx={{ mt: 2 }}
          control={
            <Switch
              checked={form.active}
              onChange={(e) => handleChange('active', e.target.checked)}
            />
          }
          label="Active"
        />
      </DialogContent>

      <DialogActions sx={{ marginRight: '16px' }}>
        <Button onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
