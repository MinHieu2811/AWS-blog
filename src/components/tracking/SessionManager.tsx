'use client';

import { useEffect } from 'react';
import { getSessionId, sendBeaconEvent } from '@/services/trackingEventService';
import { TrackingEvent } from '@/utils/constants';
import { usePathname } from 'next/navigation';
import useBlogTracking from '@/hooks/useTrackingEvent';

const SessionManager = () => {
  const pathname = usePathname();

  const { lastElementRef } = useBlogTracking({slug: pathname.split('/').pop() as string});
  useEffect(() => {
    getSessionId();

    const handlePageHide = () => {
      sendBeaconEvent({
        eventName: TrackingEvent.SESSION_END,
        data: {
          timestamp: new Date().toISOString(),
        },  
      });
    };

    window.addEventListener('pagehide', handlePageHide);

    return () => {
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, []);

  return <span ref={lastElementRef}></span>;
};

export default SessionManager;
