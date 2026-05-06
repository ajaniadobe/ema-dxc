/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroCarouselParser from './parsers/hero-carousel.js';
import cardsNewsBannerParser from './parsers/cards-news-banner.js';
import columnsStoryParser from './parsers/columns-story.js';
import columnsStatsParser from './parsers/columns-stats.js';
import formParser from './parsers/form.js';
import cardsInsightsParser from './parsers/cards-insights.js';

// TRANSFORMER IMPORTS
import dxcCleanupTransformer from './transformers/dxc-cleanup.js';
import dxcSectionsTransformer from './transformers/dxc-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-carousel': heroCarouselParser,
  'cards-news-banner': cardsNewsBannerParser,
  'columns-story': columnsStoryParser,
  'columns-stats': columnsStatsParser,
  'form': formParser,
  'cards-insights': cardsInsightsParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  dxcCleanupTransformer,
  dxcSectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'DXC Technology corporate homepage with hero, services overview, and company highlights',
  urls: [
    'https://dxc.com/'
  ],
  blocks: [
    {
      name: 'hero-carousel',
      instances: ['.herocarouselv3']
    },
    {
      name: 'cards-news-banner',
      instances: ['.newsbannerv3']
    },
    {
      name: 'columns-story',
      instances: ['.storycardv3']
    },
    {
      name: 'columns-stats',
      instances: ['.v25-statistics']
    },
    {
      name: 'form',
      instances: ['.v25-optin']
    },
    {
      name: 'cards-insights',
      instances: ['.v25-promocards']
    }
  ],
  sections: [
    {
      id: 'section-1-hero',
      name: 'Hero Carousel',
      selector: '.herocarouselv3',
      style: 'dark',
      blocks: ['hero-carousel'],
      defaultContent: []
    },
    {
      id: 'section-2-news-banner',
      name: 'News Banner',
      selector: '.newsbannerv3',
      style: null,
      blocks: ['cards-news-banner'],
      defaultContent: []
    },
    {
      id: 'section-3-story',
      name: 'Story Card',
      selector: '.storycardv3',
      style: null,
      blocks: ['columns-story'],
      defaultContent: []
    },
    {
      id: 'section-4-statistics',
      name: 'Statistics',
      selector: '.v25-statistics',
      style: 'dark',
      blocks: ['columns-stats'],
      defaultContent: []
    },
    {
      id: 'section-5-optin',
      name: 'Newsletter Opt-in',
      selector: '.v25-optin',
      style: null,
      blocks: ['form'],
      defaultContent: []
    },
    {
      id: 'section-6-promo-cards',
      name: 'Latest Insights',
      selector: '.v25-promocards',
      style: null,
      blocks: ['cards-insights'],
      defaultContent: []
    }
  ]
};

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      }
    }];
  }
};
