import { CONFIG } from 'src/config-global';
import AdvertView from 'src/sections/advert/view/advert-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Adverts - ${CONFIG.appName}`}</title>

      <AdvertView />
    </>
  );
}
