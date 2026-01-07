import { CONFIG } from 'src/config-global';

import { FaqView } from 'src/sections/faq/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Faqs - ${CONFIG.appName}`}</title>

      <FaqView />
    </>
  );
}
