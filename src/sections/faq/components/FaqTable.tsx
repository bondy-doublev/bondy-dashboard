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
import { FaqResponse } from 'src/services/faqService';

interface Props {
  faqs: FaqResponse[];
  table: { page: number; rowsPerPage: number };
  onDelete: (faq: FaqResponse) => void;
}

export default function FaqTable({ faqs, table, onDelete }: Props) {
  return (
    <TableContainer>
      <Table sx={{ minWidth: 900 }}>
        <TableHead>
          <TableRow>
            <TableCell>
              <b>Question</b>
            </TableCell>
            <TableCell>
              <b>Answer</b>
            </TableCell>
            <TableCell>
              <b>Actions</b>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {faqs
            .slice(
              table.page * table.rowsPerPage,
              table.page * table.rowsPerPage + table.rowsPerPage
            )
            .map((faq) => (
              <TableRow key={faq.id}>
                <TableCell>{faq.question}</TableCell>
                <TableCell sx={{ maxWidth: 400 }}>{faq.answer}</TableCell>
                <TableCell>
                  <Tooltip title="Delete FAQ">
                    <Button variant="contained" color="error" onClick={() => onDelete(faq)}>
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
