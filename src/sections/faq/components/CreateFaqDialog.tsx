import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
} from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { faqService } from 'src/services/faqService';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateFaqDialog({ open, onClose, onCreated }: Props) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!question.trim() || !answer.trim()) {
      return toast.warning('Please enter both question and answer');
    }

    if (loading) return;

    setLoading(true);
    try {
      await faqService.create({ question, answer });
      toast.success('FAQ created successfully');
      setQuestion('');
      setAnswer('');
      onCreated();
      onClose();
    } catch (error) {
      toast.error('Failed to create FAQ');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setQuestion('');
    setAnswer('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Create FAQ</DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={loading}
            autoFocus
          />

          <TextField
            label="Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            multiline
            minRows={4}
            disabled={loading}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleCreate}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={18} /> : null}
        >
          {loading ? 'Creating...' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
