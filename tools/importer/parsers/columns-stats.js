/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-stats
 * Base block: columns
 * Source selector: .v25-statistics
 * Description: 3-column statistics section on dark background showing stat numbers
 *   with icons and labels (e.g., "70+ countries", "115,000+ employees", "60+ years of innovation")
 * Generated: 2026-05-06
 */
export default function parse(element, { document }) {
  // Extract all stat items from the container
  const statItems = element.querySelectorAll('.stats-content');

  // Build one row with N columns (one per stat item)
  const row = [];

  statItems.forEach((item) => {
    const cellContent = [];

    // Extract icon image
    const icon = item.querySelector('.stats-icon img');
    if (icon) {
      cellContent.push(icon);
    }

    // Extract stat number (e.g., "70+", "115,000+", "60+")
    const number = item.querySelector('.stats-number');
    if (number) {
      cellContent.push(number);
    }

    // Extract stat label (e.g., "countries", "employees", "years of innovation")
    const label = item.querySelector('.stats-label');
    if (label) {
      cellContent.push(label);
    }

    row.push(cellContent);
  });

  const cells = [row];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-stats', cells });
  element.replaceWith(block);
}
