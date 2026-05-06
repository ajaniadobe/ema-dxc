/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-carousel
 * Base block: hero
 * Source: https://dxc.com/
 * Selector: .herocarouselv3
 * Generated: 2026-05-06
 *
 * Source structure:
 * - Desktop section (.hero-desktop) with gradient bg, headline, tag, description, CTA, carousel images
 * - Mobile section (.hero-mobile) duplicates content for responsive layout
 * - 3 carousel card images in .carousel-card-stack
 *
 * Target block table (from library):
 * - Row 1: Background/carousel images
 * - Row 2: Heading + subheading/tag + description + CTA
 */
export default function parse(element, { document }) {
  // Use desktop section for content extraction (avoid duplicates from mobile)
  const desktopSection = element.querySelector('.hero-desktop') || element;

  // Extract headline (h1 in desktop, h2 in mobile fallback)
  const heading = desktopSection.querySelector('h1.hero-headline-primary, h2.hero-headline-primary-mobile, h1, h2');

  // Extract tag text (e.g. "DXC OASIS")
  const tagText = desktopSection.querySelector('.carousel-tag-text, .carousel-tag p');

  // Extract description
  const description = desktopSection.querySelector('p.carousel-description, .carousel-text-area p');

  // Extract CTA link
  const ctaLink = desktopSection.querySelector('a.hero-cta-button, .carousel-controls-row a');

  // Extract carousel images (from the card stack - 3 cards: back, middle, front)
  const carouselImages = Array.from(
    desktopSection.querySelectorAll('.carousel-card-stack .carousel-card picture, .carousel-card-stack .carousel-card img.carousel-card-image')
  );

  // Prefer picture elements; fall back to img elements directly
  const imageElements = [];
  const seenSrcs = new Set();
  carouselImages.forEach((el) => {
    if (el.tagName === 'PICTURE') {
      const img = el.querySelector('img');
      if (img && !seenSrcs.has(img.src)) {
        seenSrcs.add(img.src);
        imageElements.push(el);
      }
    } else if (el.tagName === 'IMG' && !seenSrcs.has(el.src)) {
      seenSrcs.add(el.src);
      imageElements.push(el);
    }
  });

  // Build cells array matching block library structure
  const cells = [];

  // Row 1: Carousel images (background/decorative row)
  if (imageElements.length > 0) {
    cells.push([imageElements]);
  }

  // Row 2: Content cell - heading, tag/subheading, description, CTA
  const contentCell = [];

  if (heading) {
    contentCell.push(heading);
  }

  // Add tag as a subheading element
  if (tagText) {
    contentCell.push(tagText);
  }

  if (description) {
    contentCell.push(description);
  }

  // CTA - clone without the inline SVG icon img to keep clean link
  if (ctaLink) {
    const cleanLink = ctaLink.cloneNode(true);
    const iconImg = cleanLink.querySelector('img[src^="data:"]');
    if (iconImg) {
      iconImg.remove();
    }
    contentCell.push(cleanLink);
  }

  if (contentCell.length > 0) {
    cells.push([contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-carousel', cells });
  element.replaceWith(block);
}
