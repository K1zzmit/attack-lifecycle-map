import type { TimelineEvent } from '@/pages/Index';

export const sortEvents = (eventsToSort: TimelineEvent[]): TimelineEvent[] => {
  const eventMap = new Map(eventsToSort.map(event => [event.id, event]));
  const rootEvents: TimelineEvent[] = [];
  const childEvents: TimelineEvent[] = [];

  // Separate root and child events
  eventsToSort.forEach(event => {
    if (!event.parentId) {
      rootEvents.push(event);
    } else {
      childEvents.push(event);
    }
  });

  // Sort root events by order, fallback to timestamp
  rootEvents.sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    return a.timestamp.localeCompare(b.timestamp);
  });

  // Function to get all children of an event
  const getAllChildren = (parentId: string): TimelineEvent[] => {
    const children = childEvents.filter(event => event.parentId === parentId);
    children.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return a.timestamp.localeCompare(b.timestamp);
    });
    return children.reduce((acc, child) => {
      return [...acc, child, ...getAllChildren(child.id)];
    }, [] as TimelineEvent[]);
  };

  // Build the final sorted array
  return rootEvents.reduce((acc, rootEvent) => {
    return [...acc, rootEvent, ...getAllChildren(rootEvent.id)];
  }, [] as TimelineEvent[]);
};