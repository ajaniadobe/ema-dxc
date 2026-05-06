/* eslint-disable */
/* global WebImporter */

/**
 * Parser for form variant.
 * Base block: form
 * Source selector: .v25-optin
 * Generated: 2026-05-06
 *
 * Source HTML structure:
 * - div.v25-optin > form#optin_form
 *   - h2.optin-heading ("Want to stay connected?")
 *   - div.optin-description > p (description text)
 *   - Multi-step form with fields: FirstName, LastName, Email, Country, etc.
 *
 * Target block structure (from library):
 * +------+
 * | Form |
 * +------+
 * | URL to form JSON definition |
 * +------+
 *
 * The Form block uses a JSON-based form definition.
 * Row 1: block name "Form"
 * Row 2: link to form JSON definition URL
 */
export default function parse(element, { document }) {
  // The Form block requires a link to the form JSON definition.
  // Since the source is a multi-step HTML form that will be recreated as a
  // JSON-based AEM form definition, we use the placeholder form definition URL.
  const formDefinitionUrl = 'https://main--ema-dxc--aemsites.aem.live/newsletter-form.json';

  // Create an anchor element pointing to the form JSON definition
  const link = document.createElement('a');
  link.href = formDefinitionUrl;
  link.textContent = formDefinitionUrl;

  // Build cells array matching the library example:
  // Single row containing the link to the form JSON definition
  const cells = [
    [link],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'form', cells });
  element.replaceWith(block);
}
