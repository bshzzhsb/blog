import type { Metric } from 'web-vitals';

const VITALS_URL = 'https://vitals.vercel-analytics.com/v1/vitals';

type ConnectionType = 'slow-2g' | '2g' | '3g' | '4g';

function getConnectionSpeed() {
  return 'connection' in navigator &&
    navigator['connection'] &&
    typeof navigator['connection'] === 'object' &&
    'effectiveType' in navigator['connection']
    ? (navigator.connection as unknown as { effectiveType: ConnectionType }).effectiveType
    : '';
}

export function sendToVercelAnalytics(metric: Metric) {
  const analyticsId = window.ENV.VERCEL_ANALYTICS_ID;
  if (!analyticsId) return;

  const body = {
    dsn: analyticsId,
    id: metric.id,
    page: window.location.pathname,
    href: window.location.href,
    event_name: metric.name,
    value: metric.value.toString(),
    speed: getConnectionSpeed(),
  };

  const blob = new Blob([new URLSearchParams(body).toString()], {
    // This content type is necessary for `sendBeacon`
    type: 'application/x-www-form-urlencoded',
  });
  if (navigator.sendBeacon) {
    navigator.sendBeacon(VITALS_URL, blob);
  } else
    fetch(VITALS_URL, {
      body: blob,
      method: 'POST',
      credentials: 'omit',
      keepalive: true,
    });
}
