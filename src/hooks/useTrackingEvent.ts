import { useEffect, useRef, useCallback } from 'react';
import {
  sendTrackingEvent,
  sendBeaconEvent,
  TrackingEventData,
  getSessionId,
} from '@/services/trackingEventService';
import { checkIsClient } from '@/utils/checkIsClient';
import { TrackingEvent } from '@/utils/constants';

interface PayloadTrackingEventData extends Omit<TrackingEventData, 'sessionId'> {
  [key: string]: any;
}

const useBlogTracking = ({ slug }: { slug: string }) => {
  const lastElementRef = useRef<HTMLDivElement | null>(null);
  const scrollMilestones = useRef(new Set());
  const startTimeRef = useRef<number | null>(null);
  const isTrackingEnabled = useRef(true);
  const widthClientRef = useRef(typeof window !== 'undefined' ? window.innerWidth : 0);
  const heightClientRef = useRef(typeof window !== 'undefined' ? window.innerHeight : 0);

  const trackEvent = useCallback(
    (eventName: TrackingEvent, data: Omit<PayloadTrackingEventData, 'eventName' | 'slug'>) => {
      if (!isTrackingEnabled.current) return;

      sendTrackingEvent({
        slug,
        eventName,
        data,
      });
    },
    [slug]
  );
  
  const trackBeaconEvent = useCallback(
    (eventName: TrackingEvent, data: Omit<PayloadTrackingEventData, 'eventName' | 'slug'>) => {
      if (!isTrackingEnabled.current) return;

      sendBeaconEvent({
        slug,
        eventName,
        data,
      });
    },
    [slug]
  );

  useEffect(() => {
    if (!checkIsClient()) return;

    getSessionId();

    const trackingDisabled = localStorage.getItem('trackingDisabled') === 'true';
    isTrackingEnabled.current = !trackingDisabled;

    trackEvent(TrackingEvent.PAGE_VIEW, {
      url: window.location.href,
      referrer: document.referrer,
      width: widthClientRef.current,
      height: heightClientRef.current,
    });
  }, [trackEvent]);

  useEffect(() => {
    if (!checkIsClient()) return;

    startTimeRef.current = performance.now();

    return () => {
      if (!isTrackingEnabled.current) return;

      const timeSpent = (performance.now() - (startTimeRef.current ?? 0)) / 1000;
      trackBeaconEvent(TrackingEvent.TIME_ON_PAGE, { timeSpent });

      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage =
        documentHeight > windowHeight
          ? (scrollPosition / (documentHeight - windowHeight)) * 100
          : 0;

      trackBeaconEvent(TrackingEvent.DROP_POSITION, { scrollPercentage });
    };
  }, [slug, trackBeaconEvent]);

  useEffect(() => {
    const trackScroll = () => {
      if (!checkIsClient() || !isTrackingEnabled.current) return;

      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage = (scrollPosition / (documentHeight - windowHeight)) * 100;
      const milestones = [25, 50, 75, 100];

      milestones.forEach((milestone) => {
        if (scrollPercentage >= milestone && !scrollMilestones.current.has(milestone)) {
          scrollMilestones.current.add(milestone);
          trackEvent(TrackingEvent.SCROLL_DEPTH, { milestone, scrollPercentage });
        }
      });
    };

    window.addEventListener('scroll', trackScroll, { passive: true });
    return () => window.removeEventListener('scroll', trackScroll);
  }, [trackEvent]);

  useEffect(() => {
    if (!checkIsClient() || !isTrackingEnabled.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackEvent(TrackingEvent.BLOG_COMPLETED, {
            completedAt: new Date().toISOString(),
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (lastElementRef.current) {
      observer.observe(lastElementRef.current);
    }

    return () => observer.disconnect();
  }, [trackEvent]);

  return { lastElementRef };
};

export default useBlogTracking;
