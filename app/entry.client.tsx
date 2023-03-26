import { hydrateRoot } from 'react-dom/client';
import { RemixBrowser } from '@remix-run/react';

import { reportWebVitals, sendToVercelAnalytics } from './web-vitals';

hydrateRoot(document, <RemixBrowser />);

reportWebVitals(sendToVercelAnalytics);
