'use client';

import { useEffect } from 'react';
import { getSessionId, sendBeaconEvent } from '@/services/trackingEventService';
import { TrackingEvent } from '@/utils/constants';

const SessionManager = () => {
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

  return <></>;
};

export default SessionManager;
