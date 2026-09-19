import React from 'react';

/**
 * lazyWithRetry — wraps React.lazy with automatic retry logic.
 * If a dynamic chunk fails to download due to a network glitch (common on mobile 3G/4G),
 * it waits 1 second and retries up to 2 times before throwing, preventing white screen crashes.
 */
export function lazyWithRetry<T extends React.ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>,
  retriesLeft = 2,
  interval = 1000
): React.LazyExoticComponent<T> {
  return React.lazy(() =>
    new Promise<{ default: T }>((resolve, reject) => {
      const attempt = (remaining: number) => {
        componentImport()
          .then(resolve)
          .catch((error) => {
            if (remaining === 0) {
              // Check if page was already reloaded once to clear stale cache
              const hasRefreshed = sessionStorage.getItem('chunk_retry_refreshed');
              if (!hasRefreshed) {
                sessionStorage.setItem('chunk_retry_refreshed', 'true');
                window.location.reload();
                return;
              }
              reject(error);
              return;
            }
            setTimeout(() => {
              attempt(remaining - 1);
            }, interval);
          });
      };
      attempt(retriesLeft);
    })
  );
}
