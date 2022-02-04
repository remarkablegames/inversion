type EventName =
  | 'level_end'
  | 'level_start'
  | 'level_up'
  | 'post_score'
  | 'share'
  | 'tutorial_begin'
  | 'tutorial_complete'
  | 'unlock_achievement'
  | string;

/**
 * Sends Google Analytics event.
 *
 * @see https://developers.google.com/tag-platform/gtagjs/reference/events
 */
export function sendEvent(
  eventName: EventName,
  eventParams?: Record<string, string | number>
) {
  gtag('event', eventName, eventParams);
}
