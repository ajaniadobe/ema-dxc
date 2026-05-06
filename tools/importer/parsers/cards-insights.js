/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-insights
 * Base block: cards
 * Source: https://dxc.com/
 * Selector: .v25-promocards
 * Generated: 2026-05-06
 *
 * Extracts insight/article cards from the "Latest Insights" section.
 * Each card has an image, headline, and CTA link ("Read the story").
 * Maps to a 2-column Cards table: [image | heading + CTA]
 */
export default function parse(element, { document }) {
  // Extract all insight cards from the grid
  const cards = element.querySelectorAll('article.insight-card, .insight-card');

  const cells = [];

  cards.forEach((card) => {
    // Column 1: Card image
    const image = card.querySelector('.insight-image-wrapper img, .insight-image, picture img');

    // Column 2: Text content (headline + optional category + CTA)
    const contentCell = [];

    // Optional category text
    const category = card.querySelector('.insight-category');
    if (category && category.textContent.trim()) {
      contentCell.push(category);
    }

    // Card headline (h3)
    const headline = card.querySelector('h3.insight-headline, .insight-headline, h3');
    if (headline) {
      contentCell.push(headline);
    }

    // CTA button/link
    const cta = card.querySelector('a.insight-cta-button, .insight-cta-button');
    if (cta) {
      // Clean up: remove the arrow icon img from the CTA, keep only the link text
      const ctaClone = cta.cloneNode(true);
      const arrowIcon = ctaClone.querySelector('img');
      if (arrowIcon) {
        arrowIcon.remove();
      }
      contentCell.push(ctaClone);
    }

    // Build the row: [image cell, content cell]
    if (image || contentCell.length > 0) {
      cells.push([image || '', contentCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-insights', cells });
  element.replaceWith(block);
}
