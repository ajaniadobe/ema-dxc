/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: DXC Technology section breaks and section metadata.
 * Inserts <hr> between sections and adds Section Metadata blocks for styled sections.
 * Selectors validated against migration-work/cleaned.html.
 *
 * Sections from page-templates.json:
 *   1. .herocarouselv3 (style: dark)
 *   2. .newsbannerv3 (style: null)
 *   3. .storycardv3 (style: null)
 *   4. .v25-statistics (style: dark)
 *   5. .v25-optin (style: null)
 *   6. .v25-promocards (style: null)
 */
export default function transform(hookName, element, payload) {
  if (hookName === 'afterTransform') {
    const { document } = payload;
    const sections = payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    // Process sections in reverse order to preserve DOM positions
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue;

      // Add Section Metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(sectionMetadata);
      }

      // Insert <hr> before each section except the first
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
