import type { CLSReportCallback } from 'web-vitals';

import { sendToVercelAnalytics } from './vitals';

export { sendToVercelAnalytics };

export const reportWebVitals = (onPerfEntry: CLSReportCallback) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};
