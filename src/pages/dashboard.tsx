import { CONFIG } from 'src/config-global';

import { OverviewAnalyticsView as DashboardView } from 'src/sections/overview/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Dashboard - ${CONFIG.appName}`}</title>
      <meta
        name="description"
        content="Bondy Social App – một nền tảng mạng xã hội hiện đại giúp bạn kết nối, chia sẻ và khám phá thế giới xung quanh."
      />
      <meta
        name="keywords"
        content="bondy, social, network, friends, community, chat, dashboard, app"
      />

      <DashboardView />
    </>
  );
}
