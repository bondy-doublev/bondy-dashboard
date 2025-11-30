import { useState, useEffect } from 'react';
import { Box, Card, Typography, TablePagination, TextField } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { Scrollbar } from 'src/components/scrollbar';
import { toast } from 'react-toastify';
import { useTable } from 'src/hooks/useTable';
import { useDebounce } from 'src/hooks/useDebounce';

import { reportService } from 'src/services/reportService';
import ReportTable from 'src/sections/report/components/ReportTable';
import { Report } from 'src/models/Report';

export default function ReportView() {
  const table = useTable(); // { page, rowsPerPage, onChangePage, onChangeRowsPerPage }
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false); // 👈 flag đang ở trang cuối

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const handleGetReports = async () => {
    try {
      setLoading(true);

      // Gọi BE theo phân trang
      const data = await reportService.getReports({
        page: table.page,
        size: table.rowsPerPage,
      });

      // 👉 Dựa vào số lượng item BE trả về để biết có phải trang cuối không
      // NOTE: dùng length của data (chưa filter) để tránh bị search làm lệch
      setIsLastPage(data.length < table.rowsPerPage);

      let filtered = data;

      // Giữ lại search đơn giản (reason / reporter / target)
      if (debouncedSearch) {
        const keyword = debouncedSearch.toLowerCase();
        filtered = data.filter((r) => {
          const reason = r.reason?.toLowerCase() ?? '';
          const reporterId = r.reporterId?.toString() ?? '';
          const targetId = r.targetId?.toString() ?? '';
          return (
            reason.includes(keyword) || reporterId.includes(keyword) || targetId.includes(keyword)
          );
        });

        // Khi search thay đổi, nên về page 0
        if (table.page !== 0) {
          table.onChangePage(null as any, 0);
        }
      }

      setReports(filtered);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetReports();
  }, [debouncedSearch, table.page, table.rowsPerPage]);

  const handleViewDetail = (report: Report) => {
    toast.info(`View report #${report.id}`);
  };

  const handleChangeStatus = (report: Report) => {
    toast.info(`Change status for report #${report.id}`);
  };

  // 👉 Bọc lại onPageChange để chặn việc nhảy sang trang mới khi đang ở trang cuối
  const handleChangePage = (event: unknown, newPage: number) => {
    // Nếu đang ở trang cuối và user muốn sang trang lớn hơn => ignore
    if (isLastPage && newPage > table.page) {
      return;
    }
    table.onChangePage(event as any, newPage);
  };

  // 👉 Khi đổi rowsPerPage thì reset flag last page
  const handleChangeRowsPerPage = (event: any) => {
    setIsLastPage(false);
    table.onChangeRowsPerPage(event);
  };

  // 👉 Tính count "ảo" để MUI biết khi nào disable nút Next
  // - Nếu chưa phải trang cuối: giả sử luôn còn ít nhất 1 trang nữa -> (page + 2) * rowsPerPage
  // - Nếu đang ở trang cuối: count = số item tới hiện tại (page * size + số item trang này)
  const computedCount = isLastPage
    ? table.page * table.rowsPerPage + reports.length
    : (table.page + 2) * table.rowsPerPage;

  return (
    <DashboardContent>
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Reports
        </Typography>

        <TextField
          label="Search (reason / reporter / target)"
          size="small"
          sx={{ mr: 2, minWidth: 280 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      <Card>
        <Scrollbar>
          <ReportTable
            reports={reports}
            table={table}
            loading={loading}
            onViewDetail={handleViewDetail}
            onChangeStatus={handleChangeStatus}
          />
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={computedCount} // 👈 dùng count ảo để điều khiển nút Next
          rowsPerPage={table.rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          onPageChange={handleChangePage} // 👈 dùng handler bọc
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}
