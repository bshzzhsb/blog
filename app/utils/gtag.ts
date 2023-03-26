declare global {
  interface Window {
    gtag?: (option: string, arg1: string, options: Record<string, unknown>) => void;
  }
}

type Action = 'pack';
type Options = { category: string; label: string; value?: string };

export namespace gtag {
  // https://developers.google.com/analytics/devguides/collection/gtagjs/pages
  export function pageView(url: string, trackingId: string) {
    if (!window.gtag) return;

    window.gtag('config', trackingId, {
      page_path: url,
    });
  }

  // https://developers.google.com/analytics/devguides/collection/gtagjs/events
  export function event(action: Action, { category, label, value }: Options) {
    if (!window.gtag) return;

    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
}
