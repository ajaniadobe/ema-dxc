/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-story
 * Base block: columns
 * Source selector: .storycardv3
 * Description: Two-column story/value proposition section with text blocks (headline,
 * description, CTA) paired with carousel card images. Extracts from desktop layout only.
 * Generated: 2026-05-06
 */
export default function parse(element, { document }) {
  // Use the desktop layout to avoid duplicating mobile content
  const desktopLayout = element.querySelector('.story-container.desktop-layout');
  if (!desktopLayout) return;

  // Extract text blocks from the desktop layout
  const textBlocks = Array.from(
    desktopLayout.querySelectorAll(':scope > .story-text-blocks > .story-text-block')
  );

  // Extract carousel card images from the desktop layout
  const carouselCards = Array.from(
    desktopLayout.querySelectorAll(':scope > .story-carousel > .carousel-card')
  );

  const cells = [];

  // Build one row per story block: [text content | image]
  textBlocks.forEach((textBlock, index) => {
    // Extract heading
    const headline = textBlock.querySelector('h2.story-headline');

    // Extract description paragraph
    const description = textBlock.querySelector('p.story-description');

    // Extract CTA link - recreate as clean anchor without inline SVG icon
    const ctaLink = textBlock.querySelector('a.story-cta-button');

    // Build left cell (text content)
    const leftCell = [];
    if (headline) leftCell.push(headline);
    if (description) leftCell.push(description);
    if (ctaLink) {
      // Create a clean link element without the SVG icon image
      const cleanLink = document.createElement('a');
      cleanLink.href = ctaLink.href;
      const buttonText = ctaLink.querySelector('.button-text');
      cleanLink.textContent = buttonText ? buttonText.textContent : ctaLink.textContent.trim();
      leftCell.push(cleanLink);
    }

    // Build right cell (image from corresponding carousel card)
    const rightCell = [];
    if (carouselCards[index]) {
      const img = carouselCards[index].querySelector('img.card-image');
      if (img) {
        rightCell.push(img);
      }
    }

    cells.push([leftCell, rightCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-story', cells });
  element.replaceWith(block);
}
