import { CONFIG } from 'src/config-global';
import ReportView from 'src/sections/report/report-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Reports - ${CONFIG.appName}`}</title>

      <ReportView />
    </>
  );
}
