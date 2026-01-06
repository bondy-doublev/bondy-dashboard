/* eslint-disable react/jsx-boolean-value */
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { userService } from 'src/services/userService';
import { uploadService } from 'src/services/uploadService';
import { resolveFileUrl } from 'src/utils/fileUrl';

interface EditUserDialogProps {
  open: boolean;
  onClose: () => void;
  user: any | null;
  onUpdated: () => void;
}

export default function EditUserDialog({ open, onClose, user, onUpdated }: EditUserDialogProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    gender: true,
    avatarUrl: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Khi chọn user để edit, load lại form
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        middleName: user.middleName || '',
        lastName: user.lastName || '',
        dob: user.dob ? new Date(user.dob).toISOString().slice(0, 10) : '',
        gender: user.gender ?? true,
        avatarUrl: user.avatarUrl || '',
      });
      setImageFile(null);
    }
  }, [user]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setIsSaving(true); // disable nút

    try {
      let uploadedUrl = formData.avatarUrl;

      if (imageFile) {
        const uploadRes = await uploadService.uploadLocal(imageFile);
        uploadedUrl = uploadRes.data;
      }

      await userService.editUser(user.id, {
        ...formData,
        avatarUrl: uploadedUrl,
        dob: formData.dob ? `${formData.dob}T00:00:00` : '',
      });

      toast.success('User updated successfully!');
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update user');
    } finally {
      setIsSaving(false); // bật lại nút
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        {/* Avatar Preview */}
        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <img
            src={
              imageFile
                ? URL.createObjectURL(imageFile)
                : resolveFileUrl(formData.avatarUrl) || '/assets/avatar_default.jpg'
            }
            alt="avatar"
            width="100"
            height="100"
            style={{ borderRadius: '50%' }}
          />
        </Box>

        {/* Upload new image */}
        <TextField
          sx={{ mt: 2 }}
          type="file"
          fullWidth
          InputLabelProps={{ shrink: true }}
          inputProps={{ accept: 'image/*' }}
          onChange={(e) => {
            const input = e.target as HTMLInputElement;
            const file = input.files?.[0];
            if (file) {
              setImageFile(file);
            }
          }}
        />

        <TextField
          sx={{ mt: 2 }}
          label="First Name"
          fullWidth
          value={formData.firstName}
          onChange={(e) => handleChange('firstName', e.target.value)}
        />
        <TextField
          sx={{ mt: 2 }}
          label="Middle Name"
          fullWidth
          value={formData.middleName}
          onChange={(e) => handleChange('middleName', e.target.value)}
        />
        <TextField
          sx={{ mt: 2 }}
          label="Last Name"
          fullWidth
          value={formData.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
        />
        <TextField
          sx={{ mt: 2 }}
          type="date"
          label="Date of Birth"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={formData.dob}
          onChange={(e) => handleChange('dob', e.target.value)}
        />
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="gender-label">Gender</InputLabel>
          <Select
            labelId="gender-label"
            value={formData.gender ? 'true' : 'false'}
            label="Gender"
            onChange={(e) => handleChange('gender', e.target.value === 'true')}
          >
            <MenuItem value="true">Male</MenuItem>
            <MenuItem value="false">Female</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions sx={{ marginRight: '16px' }}>
        <Button onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
