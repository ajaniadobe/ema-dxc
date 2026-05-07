/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-carousel.js
  function parse(element, { document }) {
    const desktopSection = element.querySelector(".hero-desktop") || element;
    const heading = desktopSection.querySelector("h1.hero-headline-primary, h2.hero-headline-primary-mobile, h1, h2");
    const tagText = desktopSection.querySelector(".carousel-tag-text, .carousel-tag p");
    const description = desktopSection.querySelector("p.carousel-description, .carousel-text-area p");
    const ctaLink = desktopSection.querySelector("a.hero-cta-button, .carousel-controls-row a");
    const carouselImages = Array.from(
      desktopSection.querySelectorAll(".carousel-card-stack .carousel-card picture, .carousel-card-stack .carousel-card img.carousel-card-image")
    );
    const imageElements = [];
    const seenSrcs = /* @__PURE__ */ new Set();
    carouselImages.forEach((el) => {
      if (el.tagName === "PICTURE") {
        const img = el.querySelector("img");
        if (img && !seenSrcs.has(img.src)) {
          seenSrcs.add(img.src);
          imageElements.push(el);
        }
      } else if (el.tagName === "IMG" && !seenSrcs.has(el.src)) {
        seenSrcs.add(el.src);
        imageElements.push(el);
      }
    });
    const cells = [];
    if (imageElements.length > 0) {
      cells.push([imageElements]);
    }
    const contentCell = [];
    if (heading) {
      contentCell.push(heading);
    }
    if (tagText) {
      contentCell.push(tagText);
    }
    if (description) {
      contentCell.push(description);
    }
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
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-carousel", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-news-banner.js
  function parse2(element, { document }) {
    const newsLabel = element.querySelector(".news-label");
    const headline = element.querySelector(".news-headline, p.news-headline");
    const link = element.querySelector("a.news-bar-pill, .news-bar-container a");
    const readText = element.querySelector(".read-text");
    const cells = [];
    const labelCell = [];
    if (newsLabel) {
      const labelEl = document.createElement("strong");
      labelEl.textContent = newsLabel.textContent.trim();
      labelCell.push(labelEl);
    }
    const contentCell = [];
    if (headline) {
      const headingEl = document.createElement("p");
      headingEl.textContent = headline.textContent.trim();
      contentCell.push(headingEl);
    }
    if (link) {
      const ctaLink = document.createElement("a");
      ctaLink.href = link.href || link.getAttribute("href");
      ctaLink.textContent = readText ? readText.textContent.trim() : "read";
      contentCell.push(ctaLink);
    }
    if (labelCell.length > 0 || contentCell.length > 0) {
      cells.push([labelCell, contentCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-news-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-story.js
  function parse3(element, { document }) {
    const desktopLayout = element.querySelector(".story-container.desktop-layout");
    if (!desktopLayout) return;
    const textBlocks = Array.from(
      desktopLayout.querySelectorAll(":scope > .story-text-blocks > .story-text-block")
    );
    const carouselCards = Array.from(
      desktopLayout.querySelectorAll(":scope > .story-carousel > .carousel-card")
    );
    const cells = [];
    textBlocks.forEach((textBlock, index) => {
      const headline = textBlock.querySelector("h2.story-headline");
      const description = textBlock.querySelector("p.story-description");
      const ctaLink = textBlock.querySelector("a.story-cta-button");
      const leftCell = [];
      if (headline) leftCell.push(headline);
      if (description) leftCell.push(description);
      if (ctaLink) {
        const cleanLink = document.createElement("a");
        cleanLink.href = ctaLink.href;
        const buttonText = ctaLink.querySelector(".button-text");
        cleanLink.textContent = buttonText ? buttonText.textContent : ctaLink.textContent.trim();
        leftCell.push(cleanLink);
      }
      const rightCell = [];
      if (carouselCards[index]) {
        const img = carouselCards[index].querySelector("img.card-image");
        if (img) {
          rightCell.push(img);
        }
      }
      cells.push([leftCell, rightCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-story", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-stats.js
  function parse4(element, { document }) {
    const statItems = element.querySelectorAll(".stats-content");
    const row = [];
    statItems.forEach((item) => {
      const cellContent = [];
      const icon = item.querySelector(".stats-icon img");
      if (icon) {
        cellContent.push(icon);
      }
      const number = item.querySelector(".stats-number");
      if (number) {
        cellContent.push(number);
      }
      const label = item.querySelector(".stats-label");
      if (label) {
        cellContent.push(label);
      }
      row.push(cellContent);
    });
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-stats", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/form.js
  function parse5(element, { document }) {
    const formDefinitionUrl = "https://main--ema-dxc--aemsites.aem.live/newsletter-form.json";
    const link = document.createElement("a");
    link.href = formDefinitionUrl;
    link.textContent = formDefinitionUrl;
    const cells = [
      [link]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "form", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-insights.js
  function parse6(element, { document }) {
    const cards = element.querySelectorAll("article.insight-card, .insight-card");
    const cells = [];
    cards.forEach((card) => {
      const image = card.querySelector(".insight-image-wrapper img, .insight-image, picture img");
      const contentCell = [];
      const category = card.querySelector(".insight-category");
      if (category && category.textContent.trim()) {
        contentCell.push(category);
      }
      const headline = card.querySelector("h3.insight-headline, .insight-headline, h3");
      if (headline) {
        contentCell.push(headline);
      }
      const cta = card.querySelector("a.insight-cta-button, .insight-cta-button");
      if (cta) {
        const ctaClone = cta.cloneNode(true);
        const arrowIcon = ctaClone.querySelector("img");
        if (arrowIcon) {
          arrowIcon.remove();
        }
        contentCell.push(ctaClone);
      }
      if (image || contentCell.length > 0) {
        cells.push([image || "", contentCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-insights", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/dxc-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, ["#onetrust-consent-sdk"]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        ".cmp-experiencefragment--header",
        ".cmp-experiencefragment--footer",
        "#skip-to-content",
        "header#site-header",
        ".contact-cta-section",
        "#sfFloatBtn",
        "#formModal",
        ".modal-25",
        ".modal",
        ".mktoForm",
        "iframe",
        "link",
        "noscript",
        'img[src*="cdn.bizible"]',
        'img[src*="cdn.bizibly"]',
        'img[src*="clarity.ms"]',
        'img[src*="google.com/pagead"]'
      ]);
    }
  }

  // tools/importer/transformers/dxc-sections.js
  function transform2(hookName, element, payload) {
    if (hookName === "afterTransform") {
      const { document } = payload;
      const sections = payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-carousel": parse,
    "cards-news-banner": parse2,
    "columns-story": parse3,
    "columns-stats": parse4,
    "form": parse5,
    "cards-insights": parse6
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "DXC Technology corporate homepage with hero, services overview, and company highlights",
    urls: [
      "https://dxc.com/"
    ],
    blocks: [
      {
        name: "hero-carousel",
        instances: [".herocarouselv3"]
      },
      {
        name: "cards-news-banner",
        instances: [".newsbannerv3"]
      },
      {
        name: "columns-story",
        instances: [".storycardv3"]
      },
      {
        name: "columns-stats",
        instances: [".v25-statistics"]
      },
      {
        name: "form",
        instances: [".v25-optin"]
      },
      {
        name: "cards-insights",
        instances: [".v25-promocards"]
      }
    ],
    sections: [
      {
        id: "section-1-hero",
        name: "Hero Carousel",
        selector: ".herocarouselv3",
        style: "dark",
        blocks: ["hero-carousel"],
        defaultContent: []
      },
      {
        id: "section-2-news-banner",
        name: "News Banner",
        selector: ".newsbannerv3",
        style: null,
        blocks: ["cards-news-banner"],
        defaultContent: []
      },
      {
        id: "section-3-story",
        name: "Story Card",
        selector: ".storycardv3",
        style: null,
        blocks: ["columns-story"],
        defaultContent: []
      },
      {
        id: "section-4-statistics",
        name: "Statistics",
        selector: ".v25-statistics",
        style: "dark",
        blocks: ["columns-stats"],
        defaultContent: []
      },
      {
        id: "section-5-optin",
        name: "Newsletter Opt-in",
        selector: ".v25-optin",
        style: null,
        blocks: ["form"],
        defaultContent: []
      },
      {
        id: "section-6-promo-cards",
        name: "Latest Insights",
        selector: ".v25-promocards",
        style: null,
        blocks: ["cards-insights"],
        defaultContent: []
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
