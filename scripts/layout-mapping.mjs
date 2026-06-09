export const LAYOUTS = ['cover', 'split-4-8', 'overlap-right', 'bleed-quote', 'editorial', 'stats', 'gallery', 'closing', 'timeline', 'spread', 'compare', 'list'];

function sortTexts(texts = []) {
  return [...texts].sort((left, right) => {
    if (Math.abs((left?.rect?.y || 0) - (right?.rect?.y || 0)) > 1) {
      return (left?.rect?.y || 0) - (right?.rect?.y || 0);
    }
    return (left?.rect?.x || 0) - (right?.rect?.x || 0);
  });
}

function cloneTextRect(textElement, rect, styleOverrides = {}) {
  return {
    ...textElement,
    rect,
    style: {
      ...(textElement?.style || {}),
      ...styleOverrides,
    },
  };
}

function toInchesRect(rect, helpers) {
  return {
    x: helpers.pxToInches(rect.x),
    y: helpers.pxToInches(rect.y),
    w: helpers.pxToInches(rect.width),
    h: helpers.pxToInches(rect.height),
  };
}

function addRect(pptx, slide, rect, helpers, options = {}) {
  const { fill = {}, line = {}, radius = 0 } = options;
  const box = toInchesRect(rect, helpers);
  slide.addShape(pptx.ShapeType.rect, {
    ...box,
    rectRadius: radius,
    fill,
    line,
  });
}

function addLine(pptx, slide, from, to, helpers, options = {}) {
  slide.addShape(pptx.ShapeType.line, {
    x: helpers.pxToInches(from.x),
    y: helpers.pxToInches(from.y),
    w: helpers.pxToInches(to.x - from.x),
    h: helpers.pxToInches(to.y - from.y),
    line: options.line || { color: '000000', width: 1 },
  });
}

function addCircle(pptx, slide, centerX, centerY, diameter, helpers, options = {}) {
  slide.addShape(pptx.ShapeType.ellipse, {
    x: helpers.pxToInches(centerX - (diameter / 2)),
    y: helpers.pxToInches(centerY - (diameter / 2)),
    w: helpers.pxToInches(diameter),
    h: helpers.pxToInches(diameter),
    fill: options.fill || { color: '000000' },
    line: options.line || { color: '000000', transparency: 100 },
  });
}

function addImageAsset(slide, assetPath, rect, helpers) {
  if (!assetPath) {
    return;
  }
  const box = toInchesRect(rect, helpers);
  slide.addImage({
    path: assetPath,
    ...box,
  });
}

function pickVisual(slideData, kind) {
  return (slideData.visuals || []).find((visual) => visual.kind === kind && visual.assetPath);
}

function pickImage(slideData, kind) {
  return (slideData.images || []).find((image) => image.kind === kind && image.assetPath);
}

function filterTextsInRect(texts, rect) {
  return texts.filter((text) => {
    const textRect = text?.rect;
    if (!textRect) {
      return false;
    }
    const centerX = textRect.x + (textRect.width / 2);
    const centerY = textRect.y + (textRect.height / 2);
    return centerX >= rect.x
      && centerX <= rect.x + rect.width
      && centerY >= rect.y
      && centerY <= rect.y + rect.height;
  });
}

function groupByRows(texts, threshold = 28) {
  const rows = [];
  for (const text of sortTexts(texts)) {
    const lastRow = rows.at(-1);
    if (!lastRow) {
      rows.push([text]);
      continue;
    }
    const lastY = lastRow[0]?.rect?.y || 0;
    if (Math.abs((text?.rect?.y || 0) - lastY) <= threshold) {
      lastRow.push(text);
    } else {
      rows.push([text]);
    }
  }
  return rows.map((row) => row.sort((left, right) => left.rect.x - right.rect.x));
}

function splitIntoColumns(texts, splitX) {
  const left = [];
  const right = [];
  for (const text of texts) {
    const centerX = text.rect.x + (text.rect.width / 2);
    if (centerX < splitX) {
      left.push(text);
    } else {
      right.push(text);
    }
  }
  return [sortTexts(left), sortTexts(right)];
}

function distributeVertically(texts, startY, maxHeight, gap = 18) {
  const heights = texts.map((text) => Math.max(text?.rect?.height || 0, text?.style?.fontSize || 24));
  const totalHeight = heights.reduce((sum, height) => sum + height, 0) + (Math.max(texts.length - 1, 0) * gap);
  const top = startY + Math.max((maxHeight - totalHeight) / 2, 0);
  const positions = [];
  let currentY = top;
  for (let index = 0; index < texts.length; index += 1) {
    positions.push(currentY);
    currentY += heights[index] + gap;
  }
  return positions;
}

function addMappedText(helpers, slide, textElement, rect, accentColor, styleOverrides = {}) {
  helpers.addTextBox(slide, cloneTextRect(textElement, rect, styleOverrides), accentColor);
}

function addAllTextsInRects(helpers, slide, texts, rects, accentColor, styleOverrides = {}) {
  const mappedTexts = sortTexts(texts).slice(0, rects.length);
  for (let index = 0; index < mappedTexts.length; index += 1) {
    addMappedText(helpers, slide, mappedTexts[index], rects[index], accentColor, styleOverrides);
  }
}

function normalizeBackgroundColor(slideData, helpers, fallback = 'F7F4EF') {
  return helpers.toHexColor(slideData.slideBgColor, fallback);
}

function normalizeAccentColor(slideData, helpers, fallback = '94352B') {
  return helpers.toHexColor(slideData.accentColor, fallback);
}

function mapCover(pptx, slide, slideData, helpers) {
  const bgColor = normalizeBackgroundColor(slideData, helpers, '1A1814');
  addRect(pptx, slide, { x: 0, y: 0, width: helpers.SLIDE_W, height: helpers.SLIDE_H }, helpers, {
    fill: { color: bgColor },
    line: { color: bgColor, transparency: 100 },
  });

  const coverBackground = pickVisual(slideData, 'cover-background');
  if (coverBackground) {
    addImageAsset(slide, coverBackground.assetPath, { x: 0, y: 0, width: helpers.SLIDE_W, height: helpers.SLIDE_H }, helpers);
  }

  const texts = sortTexts(slideData.texts || []);
  const textWidth = helpers.SLIDE_W - (helpers.SAFE_X * 2);
  const region = { x: helpers.SAFE_X, y: 88, width: textWidth, height: 280 };
  const positions = distributeVertically(texts, region.y, region.height, 16);
  const rects = texts.map((text, index) => ({
    x: region.x,
    y: positions[index],
    width: region.width,
    height: Math.max(text.rect.height, text.style.fontSize * 1.35),
  }));
  addAllTextsInRects(helpers, slide, texts, rects, slideData.accentColor, { textAlign: 'center' });
}

function mapSplit48(pptx, slide, slideData, helpers) {
  const leftWidth = helpers.SLIDE_W * (4 / 12);
  const rightX = leftWidth;
  const rightWidth = helpers.SLIDE_W - rightX;
  const image = pickImage(slideData, 'background');

  if (image) {
    addImageAsset(slide, image.assetPath, { x: 0, y: 0, width: leftWidth, height: helpers.SLIDE_H }, helpers);
  } else {
    addLine(pptx, slide, { x: leftWidth, y: 92 }, { x: leftWidth, y: helpers.SLIDE_H - 92 }, helpers, {
      line: { color: 'D8D1C7', width: 1 },
    });
  }

  const texts = sortTexts(slideData.texts || []);
  const textX = rightX + 56;
  const textWidth = rightWidth - 96;
  const top = 96;
  let currentY = top;
  for (const text of texts) {
    const height = Math.max(text.rect.height, text.style.fontSize * 1.35);
    addMappedText(helpers, slide, text, {
      x: textX,
      y: currentY,
      width: textWidth,
      height,
    }, slideData.accentColor);
    currentY += height + 18;
  }
}

function mapOverlapRight(pptx, slide, slideData, helpers) {
  const background = pickImage(slideData, 'background') || pickVisual(slideData, 'slide-background');
  if (background) {
    addImageAsset(slide, background.assetPath, { x: 0, y: 0, width: helpers.SLIDE_W, height: helpers.SLIDE_H }, helpers);
  }

  const panelVisual = pickVisual(slideData, 'overlay-panel');
  const panelRect = panelVisual?.rect || { x: helpers.SLIDE_W * 0.58, y: 96, width: helpers.SLIDE_W * 0.32, height: helpers.SLIDE_H - 192 };
  addRect(pptx, slide, {
    x: panelRect.x + 12,
    y: panelRect.y + 12,
    width: panelRect.width,
    height: panelRect.height,
  }, helpers, {
    fill: { color: '1A1814', transparency: 55 },
    line: { color: '1A1814', transparency: 100 },
  });
  addRect(pptx, slide, panelRect, helpers, {
    fill: { color: 'F7F4EF' },
    line: { color: 'E8DFD3', width: 1 },
  });

  const panelTexts = panelVisual
    ? filterTextsInRect(sortTexts(slideData.texts || []), panelRect)
    : sortTexts(slideData.texts || []);
  const innerX = panelRect.x + 36;
  const innerWidth = panelRect.width - 72;
  let currentY = panelRect.y + 34;
  for (const text of panelTexts) {
    const height = Math.max(text.rect.height, text.style.fontSize * 1.35);
    addMappedText(helpers, slide, text, {
      x: innerX,
      y: currentY,
      width: innerWidth,
      height,
    }, slideData.accentColor);
    currentY += height + 16;
  }
}

function mapBleedQuote(pptx, slide, slideData, helpers) {
  const background = pickImage(slideData, 'background') || pickVisual(slideData, 'slide-background');
  if (background) {
    addImageAsset(slide, background.assetPath, { x: 0, y: 0, width: helpers.SLIDE_W, height: helpers.SLIDE_H }, helpers);
  }

  const texts = sortTexts(slideData.texts || []);
  const quote = texts[0];
  const attribution = texts[1];
  if (quote) {
    addMappedText(helpers, slide, quote, {
      x: helpers.SAFE_X,
      y: helpers.SLIDE_H - 250,
      width: helpers.SLIDE_W * 0.62,
      height: 150,
    }, slideData.accentColor, { color: slideData.accentColor, fontStyle: 'italic' });
  }
  if (attribution) {
    addMappedText(helpers, slide, attribution, {
      x: helpers.SAFE_X,
      y: helpers.SLIDE_H - 88,
      width: helpers.SLIDE_W * 0.4,
      height: 34,
    }, slideData.accentColor);
  }
}

function mapEditorial(pptx, slide, slideData, helpers) {
  const texts = sortTexts(slideData.texts || []);
  const titleRegion = { x: helpers.SAFE_X, y: 56, width: Math.round(helpers.SLIDE_W * 0.55), height: 150 };
  const headerTexts = texts.slice(0, Math.min(2, texts.length));
  const bodyTexts = texts.slice(headerTexts.length);
  const headerPositions = distributeVertically(headerTexts, titleRegion.y, titleRegion.height, 8);
  const headerRects = headerTexts.map((text, index) => ({
    x: titleRegion.x,
    y: headerPositions[index],
    width: titleRegion.width,
    height: Math.max(text.rect.height, text.style.fontSize * 1.3),
  }));
  addAllTextsInRects(helpers, slide, headerTexts, headerRects, slideData.accentColor);

  const bodyTop = 232;
  const bodyBottom = helpers.SLIDE_H - 72;
  const gutter = 52;
  const bodyWidth = helpers.SLIDE_W - (helpers.SAFE_X * 2);
  const columnWidth = (bodyWidth - gutter) / 2;
  const centerX = helpers.SAFE_X + columnWidth + (gutter / 2);
  addLine(pptx, slide, { x: centerX, y: bodyTop }, { x: centerX, y: bodyBottom }, helpers, {
    line: { color: 'D8D1C7', width: 1 },
  });

  const [leftColumnTexts, rightColumnTexts] = splitIntoColumns(bodyTexts, centerX);
  let currentLeftY = bodyTop;
  for (const text of leftColumnTexts) {
    const height = Math.max(text.rect.height, text.style.fontSize * 1.45);
    addMappedText(helpers, slide, text, {
      x: helpers.SAFE_X,
      y: currentLeftY,
      width: columnWidth,
      height,
    }, slideData.accentColor);
    currentLeftY += height + 14;
  }

  let currentRightY = bodyTop;
  for (const text of rightColumnTexts) {
    const height = Math.max(text.rect.height, text.style.fontSize * 1.45);
    addMappedText(helpers, slide, text, {
      x: centerX + (gutter / 2),
      y: currentRightY,
      width: columnWidth,
      height,
    }, slideData.accentColor);
    currentRightY += height + 14;
  }
}

function mapStats(pptx, slide, slideData, helpers) {
  const bgColor = normalizeBackgroundColor(slideData, helpers, '1A1814');
  const accentColor = normalizeAccentColor(slideData, helpers, '94352B');
  addRect(pptx, slide, { x: 0, y: 0, width: helpers.SLIDE_W, height: helpers.SLIDE_H }, helpers, {
    fill: { color: bgColor },
    line: { color: bgColor, transparency: 100 },
  });

  const texts = sortTexts(slideData.texts || []);
  const columns = 3;
  const contentX = helpers.SAFE_X;
  const contentWidth = helpers.SLIDE_W - (helpers.SAFE_X * 2);
  const columnWidth = contentWidth / columns;
  for (let index = 0; index < columns; index += 1) {
    const numberText = texts[index * 2];
    const labelText = texts[(index * 2) + 1];
    const x = contentX + (columnWidth * index);
    if (numberText) {
      addMappedText(helpers, slide, numberText, {
        x,
        y: 230,
        width: columnWidth,
        height: 100,
      }, slideData.accentColor, { color: slideData.accentColor, textAlign: 'center' });
    }
    if (labelText) {
      addMappedText(helpers, slide, labelText, {
        x: x + 14,
        y: 346,
        width: columnWidth - 28,
        height: 56,
      }, slideData.accentColor, { textAlign: 'center', color: accentColor === bgColor ? 'F7F4EF' : labelText.style.color });
    }
  }
}

function mapGallery(pptx, slide, slideData, helpers) {
  const texts = sortTexts(slideData.texts || []);
  const title = texts[0];
  const titleHeight = title ? 54 : 0;
  if (title) {
    addMappedText(helpers, slide, title, {
      x: helpers.SAFE_X,
      y: 44,
      width: helpers.SLIDE_W - (helpers.SAFE_X * 2),
      height: titleHeight,
    }, slideData.accentColor);
  }

  const images = (slideData.images || []).filter((image) => image.assetPath).slice(0, 6);
  const columns = 3;
  const rows = 2;
  const gap = 18;
  const gridX = helpers.SAFE_X;
  const gridY = title ? 122 : 74;
  const gridWidth = helpers.SLIDE_W - (helpers.SAFE_X * 2);
  const gridHeight = helpers.SLIDE_H - gridY - 56;
  const cellWidth = (gridWidth - (gap * (columns - 1))) / columns;
  const cellHeight = (gridHeight - (gap * (rows - 1))) / rows;
  for (let index = 0; index < images.length; index += 1) {
    const column = index % columns;
    const row = Math.floor(index / columns);
    addImageAsset(slide, images[index].assetPath, {
      x: gridX + (column * (cellWidth + gap)),
      y: gridY + (row * (cellHeight + gap)),
      width: cellWidth,
      height: cellHeight,
    }, helpers);
  }
}

function mapClosing(pptx, slide, slideData, helpers) {
  const texts = sortTexts(slideData.texts || []);
  const quote = texts[0];
  const attribution = texts[1];
  const blockHeight = attribution ? 196 : 140;
  const startY = Math.round((helpers.SLIDE_H - blockHeight) / 2);
  if (quote) {
    addMappedText(helpers, slide, quote, {
      x: helpers.SAFE_X + 64,
      y: startY,
      width: helpers.SLIDE_W - ((helpers.SAFE_X + 64) * 2),
      height: 120,
    }, slideData.accentColor, { textAlign: 'center', fontStyle: 'italic' });
  }
  if (attribution) {
    addMappedText(helpers, slide, attribution, {
      x: helpers.SAFE_X + 120,
      y: startY + 138,
      width: helpers.SLIDE_W - ((helpers.SAFE_X + 120) * 2),
      height: 34,
    }, slideData.accentColor, { textAlign: 'center' });
  }
}

function mapTimeline(pptx, slide, slideData, helpers) {
  const accentColor = normalizeAccentColor(slideData, helpers, '94352B');
  const texts = sortTexts(slideData.texts || []);
  const leftWidth = 140;
  const introTexts = texts.filter((text) => (text.rect.x + (text.rect.width / 2)) <= helpers.SAFE_X + leftWidth + 32).slice(0, 2);
  const eventTexts = texts.filter((text) => !introTexts.includes(text));
  let introY = 92;
  for (const text of introTexts) {
    const height = Math.max(text.rect.height, text.style.fontSize * 1.35);
    addMappedText(helpers, slide, text, {
      x: helpers.SAFE_X,
      y: introY,
      width: leftWidth,
      height,
    }, slideData.accentColor);
    introY += height + 14;
  }

  const eventsX = helpers.SAFE_X + leftWidth + 54;
  const eventsWidth = helpers.SLIDE_W - eventsX - helpers.SAFE_X;
  const lineX = eventsX + 18;
  const eventRows = groupByRows(eventTexts, 34);
  const count = Math.max(eventRows.length, 1);
  const top = 110;
  const bottom = helpers.SLIDE_H - 90;
  addLine(pptx, slide, { x: lineX, y: top }, { x: lineX, y: bottom }, helpers, {
    line: { color: accentColor, width: 2.25 },
  });

  const step = count > 1 ? (bottom - top) / (count - 1) : 0;
  for (let index = 0; index < eventRows.length; index += 1) {
    const row = eventRows[index];
    const dotY = top + (step * index);
    addCircle(pptx, slide, lineX, dotY, 14, helpers, {
      fill: { color: accentColor },
      line: { color: accentColor, transparency: 100 },
    });

    const dateText = row[0];
    const titleText = row[1];
    const bodyTexts = row.slice(2);
    if (dateText) {
      addMappedText(helpers, slide, dateText, {
        x: lineX + 28,
        y: dotY - 12,
        width: 110,
        height: 24,
      }, slideData.accentColor, { color: slideData.accentColor });
    }
    if (titleText) {
      addMappedText(helpers, slide, titleText, {
        x: lineX + 150,
        y: dotY - 18,
        width: eventsWidth - 168,
        height: 34,
      }, slideData.accentColor);
    }
    let bodyY = dotY + 14;
    for (const bodyText of bodyTexts) {
      const height = Math.max(bodyText.rect.height, bodyText.style.fontSize * 1.35);
      addMappedText(helpers, slide, bodyText, {
        x: lineX + 150,
        y: bodyY,
        width: eventsWidth - 168,
        height,
      }, slideData.accentColor);
      bodyY += height + 8;
    }
  }
}

function mapSpread(pptx, slide, slideData, helpers) {
  const background = pickImage(slideData, 'background') || pickVisual(slideData, 'slide-background');
  if (background) {
    addImageAsset(slide, background.assetPath, { x: 0, y: 0, width: helpers.SLIDE_W, height: helpers.SLIDE_H }, helpers);
  }

  addRect(pptx, slide, {
    x: 0,
    y: helpers.SLIDE_H - 210,
    width: helpers.SLIDE_W,
    height: 210,
  }, helpers, {
    fill: { color: '111111', transparency: 35 },
    line: { color: '111111', transparency: 100 },
  });

  const texts = sortTexts(slideData.texts || []);
  const blockX = helpers.SAFE_X;
  let currentY = helpers.SLIDE_H - 170;
  for (const text of texts) {
    const height = Math.max(text.rect.height, text.style.fontSize * 1.35);
    addMappedText(helpers, slide, text, {
      x: blockX,
      y: currentY,
      width: helpers.SLIDE_W * 0.52,
      height,
    }, slideData.accentColor);
    currentY += height + 10;
  }
}

function mapCompare(pptx, slide, slideData, helpers) {
  const columns = 3;
  const gap = 24;
  const contentX = helpers.SAFE_X;
  const contentY = 84;
  const contentWidth = helpers.SLIDE_W - (helpers.SAFE_X * 2);
  const contentHeight = helpers.SLIDE_H - 168;
  const columnWidth = contentWidth / columns;
  addLine(pptx, slide, { x: contentX, y: contentY }, { x: contentX + contentWidth, y: contentY }, helpers, {
    line: { color: 'D8D1C7', width: 1 },
  });
  addLine(pptx, slide, { x: contentX, y: contentY + contentHeight }, { x: contentX + contentWidth, y: contentY + contentHeight }, helpers, {
    line: { color: 'D8D1C7', width: 1 },
  });
  for (let divider = 1; divider < columns; divider += 1) {
    const x = contentX + (columnWidth * divider);
    addLine(pptx, slide, { x, y: contentY }, { x, y: contentY + contentHeight }, helpers, {
      line: { color: 'D8D1C7', width: 1 },
    });
  }

  const images = (slideData.images || []).filter((image) => image.assetPath).slice(0, 3);
  const texts = sortTexts(slideData.texts || []);
  const columnCenters = Array.from({ length: columns }, (_, index) => contentX + (columnWidth * index) + (columnWidth / 2));
  const textColumns = Array.from({ length: columns }, () => []);
  for (const text of texts) {
    const centerX = text.rect.x + (text.rect.width / 2);
    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;
    for (let index = 0; index < columnCenters.length; index += 1) {
      const distance = Math.abs(centerX - columnCenters[index]);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    }
    textColumns[bestIndex].push(text);
  }

  for (let index = 0; index < columns; index += 1) {
    const x = contentX + (columnWidth * index) + 18;
    const width = columnWidth - 36;
    if (images[index]) {
      addImageAsset(slide, images[index].assetPath, {
        x,
        y: contentY + 22,
        width,
        height: 170,
      }, helpers);
    }

    const columnTexts = sortTexts(textColumns[index]);
    const caption = columnTexts[0];
    const title = columnTexts[1];
    const description = columnTexts.slice(2);
    let currentY = contentY + (images[index] ? 212 : 32);
    if (caption) {
      addMappedText(helpers, slide, caption, { x, y: currentY, width, height: 22 }, slideData.accentColor);
      currentY += 28;
    }
    if (title) {
      addMappedText(helpers, slide, title, { x, y: currentY, width, height: 42 }, slideData.accentColor);
      currentY += 50;
    }
    for (const text of description) {
      const height = Math.max(text.rect.height, text.style.fontSize * 1.35);
      addMappedText(helpers, slide, text, { x, y: currentY, width, height }, slideData.accentColor);
      currentY += height + 10;
    }
  }
}

function mapList(pptx, slide, slideData, helpers) {
  const bgColor = normalizeBackgroundColor(slideData, helpers, '1A1814');
  addRect(pptx, slide, { x: 0, y: 0, width: helpers.SLIDE_W, height: helpers.SLIDE_H }, helpers, {
    fill: { color: bgColor },
    line: { color: bgColor, transparency: 100 },
  });

  const rows = groupByRows(slideData.texts || [], 28);
  const contentX = helpers.SAFE_X;
  const contentWidth = helpers.SLIDE_W - (helpers.SAFE_X * 2);
  const rowHeight = Math.min(112, Math.floor((helpers.SLIDE_H - 120) / Math.max(rows.length, 1)));
  let currentY = 70;
  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    const numberText = row[0];
    const titleParts = row.slice(1);
    if (numberText) {
      addMappedText(helpers, slide, numberText, {
        x: contentX,
        y: currentY,
        width: 96,
        height: rowHeight - 16,
      }, slideData.accentColor, { color: slideData.accentColor, textAlign: 'left' });
    }
    if (titleParts.length > 0) {
      const mergedTitle = {
        ...titleParts[0],
        text: titleParts.map((part) => part.text).join('\n'),
      };
      addMappedText(helpers, slide, mergedTitle, {
        x: contentX + 116,
        y: currentY + 8,
        width: contentWidth - 116,
        height: rowHeight - 20,
      }, slideData.accentColor);
    }
    if (index < rows.length - 1) {
      addLine(pptx, slide, { x: contentX, y: currentY + rowHeight }, { x: contentX + contentWidth, y: currentY + rowHeight }, helpers, {
        line: { color: '4B443B', width: 1 },
      });
    }
    currentY += rowHeight;
  }
}

function mapFallback(pptx, slide, slideData, helpers) {
  const bgColor = normalizeBackgroundColor(slideData, helpers, 'F7F4EF');
  addRect(pptx, slide, { x: 0, y: 0, width: helpers.SLIDE_W, height: helpers.SLIDE_H }, helpers, {
    fill: { color: bgColor },
    line: { color: bgColor, transparency: 100 },
  });

  for (const visual of slideData.visuals || []) {
    addImageAsset(slide, visual.assetPath, visual.rect, helpers);
  }
  for (const image of slideData.images || []) {
    addImageAsset(slide, image.assetPath, image.rect, helpers);
  }
  for (const text of sortTexts(slideData.texts || [])) {
    helpers.addTextBox(slide, text, slideData.accentColor);
  }
}

export function getLayoutMapper(layout) {
  const map = {
    cover: mapCover,
    'split-4-8': mapSplit48,
    'overlap-right': mapOverlapRight,
    'bleed-quote': mapBleedQuote,
    editorial: mapEditorial,
    stats: mapStats,
    gallery: mapGallery,
    closing: mapClosing,
    timeline: mapTimeline,
    spread: mapSpread,
    compare: mapCompare,
    list: mapList,
  };
  return map[layout] || mapFallback;
}

export function applyLayoutMapping(pptx, slide, slideData, helpers) {
  const mapper = getLayoutMapper(slideData.layout);
  mapper(pptx, slide, slideData, helpers);
}
