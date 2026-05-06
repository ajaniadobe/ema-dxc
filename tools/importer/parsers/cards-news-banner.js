/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-news-banner
 * Base block: cards
 * Source: https://dxc.com/ (.newsbannerv3)
 * Description: News banner block showing a single news item with a "news" label,
 * headline text, and "read" CTA link in a card-based layout.
 * Generated: 2026-05-06
 */
export default function parse(element, { document }) {
  // Extract the news label (e.g., "news")
  const newsLabel = element.querySelector('.news-label');

  // Extract the headline text
  const headline = element.querySelector('.news-headline, p.news-headline');

  // Extract the main link (wraps the entire news pill)
  const link = element.querySelector('a.news-bar-pill, .news-bar-container a');

  // Extract the read text/CTA
  const readText = element.querySelector('.read-text');

  // Build the content for cells following the Cards block structure:
  // Each row has 2 columns: [identifier/image cell, content cell]
  const cells = [];

  // Cell 1: News label as the identifier (replaces image in standard cards)
  const labelCell = [];
  if (newsLabel) {
    const labelEl = document.createElement('strong');
    labelEl.textContent = newsLabel.textContent.trim();
    labelCell.push(labelEl);
  }

  // Cell 2: Headline + CTA link
  const contentCell = [];
  if (headline) {
    const headingEl = document.createElement('p');
    headingEl.textContent = headline.textContent.trim();
    contentCell.push(headingEl);
  }

  // Create the CTA link preserving the href
  if (link) {
    const ctaLink = document.createElement('a');
    ctaLink.href = link.href || link.getAttribute('href');
    ctaLink.textContent = readText ? readText.textContent.trim() : 'read';
    contentCell.push(ctaLink);
  }

  // Build the row: [label cell, content cell]
  if (labelCell.length > 0 || contentCell.length > 0) {
    cells.push([labelCell, contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-news-banner', cells });
  element.replaceWith(block);
}
