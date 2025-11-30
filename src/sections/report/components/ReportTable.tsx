import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Tooltip,
  Chip,
} from '@mui/material';

import { Report } from 'src/models/Report';

interface Props {
  reports: Report[];
  table: { page: number; rowsPerPage: number };
  loading?: boolean;
  onViewDetail: (report: Report) => void;
  onChangeStatus: (report: Report) => void;
}

function renderStatusChip(status: Report['status']) {
  switch (status) {
    case 'OPEN':
      return <Chip label="OPEN" size="small" color="warning" variant="outlined" />;
    case 'IN_PROGRESS':
      return <Chip label="IN_PROGRESS" size="small" color="info" variant="outlined" />;
    case 'RESOLVED':
      return <Chip label="RESOLVED" size="small" color="success" variant="outlined" />;
    case 'DISMISSED':
      return <Chip label="DISMISSED" size="small" color="default" variant="outlined" />;
    default:
      return <Chip label={status} size="small" variant="outlined" />;
  }
}

export default function ReportTable({
  reports,
  table,
  loading = false,
  onViewDetail,
  onChangeStatus,
}: Props) {
  return (
    <TableContainer sx={{ display: 'flex', justifyContent: 'center' }}>
      <Table sx={{ minWidth: 1000 }}>
        <TableHead>
          <TableRow>
            <TableCell>
              <b>ID</b>
            </TableCell>
            <TableCell>
              <b>Reporter ID</b>
            </TableCell>
            <TableCell>
              <b>Handler ID</b>
            </TableCell>
            <TableCell>
              <b>Target Type</b>
            </TableCell>
            <TableCell>
              <b>Target ID</b>
            </TableCell>
            <TableCell>
              <b>Reason</b>
            </TableCell>
            <TableCell>
              <b>Status</b>
            </TableCell>
            <TableCell>
              <b>Created At</b>
            </TableCell>
            <TableCell>
              <b>Updated At</b>
            </TableCell>
            <TableCell>
              <b>Actions</b>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {/* Row loading */}
          {loading && (
            <TableRow>
              <TableCell colSpan={10} align="center">
                Loading...
              </TableCell>
            </TableRow>
          )}

          {/* Data rows */}
          {!loading &&
            reports.map((report) => (
              <TableRow key={report.id} hover>
                <TableCell>{report.id}</TableCell>
                <TableCell>{report.reporterId ?? '-'}</TableCell>
                <TableCell>{report.handleBy ?? '-'}</TableCell>
                <TableCell>{report.targetType}</TableCell>
                <TableCell>{report.targetId}</TableCell>

                {/* Reason: giới hạn chiều rộng + tooltip full text */}
                <TableCell sx={{ maxWidth: 250 }}>
                  <Tooltip title={report.reason} arrow>
                    <span
                      style={{
                        display: 'inline-block',
                        maxWidth: '240px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {report.reason}
                    </span>
                  </Tooltip>
                </TableCell>

                <TableCell>{renderStatusChip(report.status)}</TableCell>

                <TableCell>
                  {report.createdAt ? new Date(report.createdAt).toLocaleString('vi-VN') : '-'}
                </TableCell>
                <TableCell>
                  {report.updatedAt ? new Date(report.updatedAt).toLocaleString('vi-VN') : '-'}
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <Tooltip title="View / handle report">
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={{ mr: 1, minWidth: '90px', textTransform: 'none' }}
                      onClick={() => onViewDetail(report)}
                    >
                      Detail
                    </Button>
                  </Tooltip>
                  <Tooltip title="Change status">
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ minWidth: '110px', textTransform: 'none' }}
                      onClick={() => onChangeStatus(report)}
                    >
                      Update status
                    </Button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

          {/* Empty state */}
          {!loading && reports.length === 0 && (
            <TableRow>
              <TableCell colSpan={10} align="center">
                No reports found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
