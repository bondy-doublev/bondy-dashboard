import { CONFIG } from 'src/config-global';

import { ApiKeyView } from 'src/sections/api-key/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`ApiKeys - ${CONFIG.appName}`}</title>

      <ApiKeyView />
    </>
  );
}
