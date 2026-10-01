import { trackEvent } from "./site.functions";

export const CALENDLY = "https://calendly.com/faytey7";
export const LINKEDIN = "https://linkedin.com/in/faytey7";
export const X_URL = "https://x.com/faytey7";

export function track(event: "book_call_click" | "contact_form_start", location: string) {
  trackEvent({ data: { event, location } }).catch(() => {});
}
