import React from 'react';

interface GTagProps {
  gaTrackingId: string;
}

export const GTag: React.FC<GTagProps> = React.memo(({ gaTrackingId }) => {
  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`} />
      <script
        async
        id="gtag-init"
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaTrackingId}', {
  page_path: window.location.pathname,
});
`,
        }}
      />
    </>
  );
});
