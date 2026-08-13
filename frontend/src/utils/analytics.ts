export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, unknown>,
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, eventParams);
  } else {
    // Para modo de desenvolvimento
    console.debug(`[GA Event]: ${eventName}`, eventParams);
  }
};
