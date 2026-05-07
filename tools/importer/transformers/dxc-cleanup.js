/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: DXC Technology site-wide cleanup.
 * Removes non-authorable content (header, footer, cookie consent, navigation).
 * Selectors validated against migration-work/cleaned.html.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Cookie consent banner (OneTrust) - blocks parsing overlay
    // Found in DOM: <div id="onetrust-consent-sdk">
    WebImporter.DOMUtils.remove(element, ['#onetrust-consent-sdk']);
  }

  if (hookName === H.after) {
    WebImporter.DOMUtils.remove(element, [
      '.cmp-experiencefragment--header',
      '.cmp-experiencefragment--footer',
      '#skip-to-content',
      'header#site-header',
      '.contact-cta-section',
      '#sfFloatBtn',
      '#formModal',
      '.modal-25',
      '.modal',
      '.mktoForm',
      'iframe',
      'link',
      'noscript',
      'img[src*="cdn.bizible"]',
      'img[src*="cdn.bizibly"]',
      'img[src*="clarity.ms"]',
      'img[src*="google.com/pagead"]',
    ]);
  }
}
