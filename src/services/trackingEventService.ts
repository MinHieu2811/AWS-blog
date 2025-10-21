import { checkIsClient } from '@/utils/checkIsClient';
import axiosInstance from '@/lib/axios';

export interface TrackingEventData {
  sessionId?: string;
  slug?: string;
  eventName?: string;
  data?: Record<string, any>;
}

const SESSION_ID_KEY = 'sessionId';
const MAX_RETRIES = 3;

export const getSessionId = (): string | null => {
  if (!checkIsClient()) {
    return null;
  }
  let storedSessionId = sessionStorage.getItem(SESSION_ID_KEY);
  if (!storedSessionId) {
    storedSessionId = crypto.randomUUID();
    sessionStorage.setItem(SESSION_ID_KEY, storedSessionId);
  }
  return storedSessionId;
};

let eventQueue: TrackingEventData[] = [];
let isProcessing = false;

const processQueue = async () => {
  if (isProcessing || eventQueue.length === 0) return;

  isProcessing = true;
  const eventsToProcess = [...eventQueue];
  eventQueue = [];

  try {
    // Explicitly pass MAX_RETRIES to make the intention clear.
    await Promise.allSettled(eventsToProcess.map((event) => sendSingleEvent(event, MAX_RETRIES)));
  } catch (error) {
    console.error('Failed to process event queue:', error);
  } finally {
    isProcessing = false;
    if (eventQueue.length > 0) {
      setTimeout(processQueue, 100);
    }
  }
};

const sendSingleEvent = async (data: TrackingEventData, retriesLeft = MAX_RETRIES): Promise<void> => {
  try {
    if (!data.eventName) {
      console.error('Missing required field: eventName');
    }
    await axiosInstance.post('/tracking', data);
  } catch (err) {
    if (retriesLeft > 1) {
      const currentAttempt = MAX_RETRIES + 1 - retriesLeft;
      console.error(`Retry ${currentAttempt} failed for event ${data.eventName}. Retrying...`, err);
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, currentAttempt - 1) * 1000));
      await sendSingleEvent(data, retriesLeft - 1);
    } else {
      console.error(`Max retries reached, event dropped: ${data.eventName}`, err);
      storeFailedEvent(data);
    }
  }
};

const storeFailedEvent = (event: TrackingEventData) => {
  if (!checkIsClient()) return;
  try {
    const failedEvents = JSON.parse(localStorage.getItem('failedTrackingEvents') || '[]');
    failedEvents.push({ ...event, timestamp: Date.now() });
    if (failedEvents.length > 50) {
      failedEvents.splice(0, failedEvents.length - 50);
    }
    localStorage.setItem('failedTrackingEvents', JSON.stringify(failedEvents));
  } catch (error) {
    console.error('Failed to store failed event:', error);
  }
};

export const sendTrackingEvent = (data: Omit<TrackingEventData, 'sessionId'>) => {
  if (!checkIsClient()) return;

  const sessionId = getSessionId();
  eventQueue.push({ ...data, sessionId: sessionId ?? undefined });
  setTimeout(processQueue, 100);
};

export const sendBeaconEvent = (data: Omit<TrackingEventData, 'sessionId'>) => {
  if (!checkIsClient() || !navigator.sendBeacon) return;

  const sessionId = getSessionId();
  const eventData = { ...data, sessionId: sessionId ?? undefined };
  const blob = new Blob([JSON.stringify(eventData)], { type: 'application/json' });
  navigator.sendBeacon('/api/tracking', blob);
};

export const retryFailedEvents = async () => {
  if (!checkIsClient()) return;
  try {
    const failedEvents = JSON.parse(localStorage.getItem('failedTrackingEvents') || '[]');
    if (failedEvents.length > 0) {
      console.log(`Retrying ${failedEvents.length} failed tracking events`);
      for (const event of failedEvents) {
        await sendSingleEvent(event, 1);
      }
      localStorage.removeItem('failedTrackingEvents');
    }
  } catch (error) {
    console.error('Failed to retry failed events:', error);
  }
};
