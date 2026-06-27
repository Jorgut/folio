figma.showUI(__html__, { width: 420, height: 320 });

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
  };
}

async function resolveFont(family) {
  if (!family) return { family: 'Inter', style: 'Regular' };
  var fl = family.toLowerCase();
  const available = await figma.listAvailableFontsAsync();
  for (var fi = 0; fi < available.length; fi++) {
    var f = available[fi];
    if (f.fontFamily && f.fontFamily.toLowerCase() === fl) {
      return { family: f.fontFamily, style: 'Regular' };
    }
  }
  for (var fi = 0; fi < available.length; fi++) {
    var f = available[fi];
    if (f.fontFamily && (f.fontFamily.toLowerCase().indexOf(fl) >= 0 || fl.indexOf(f.fontFamily.toLowerCase()) >= 0)) {
      return { family: f.fontFamily, style: 'Regular' };
    }
  }
  return { family: 'Inter', style: 'Regular' };
}

function fontWeightToStyle(weight) {
  var w = parseInt(weight, 10);
  if (w >= 900) return 'Black';
  if (w >= 800) return 'ExtraBold';
  if (w >= 700) return 'Bold';
  if (w >= 600) return 'SemiBold';
  if (w >= 500) return 'Medium';
  if (w >= 400) return 'Regular';
  if (w >= 300) return 'Light';
  if (w >= 200) return 'ExtraLight';
  return 'Thin';
}

figma.ui.onmessage = async function(msg) {
  if (msg.type === 'import') {
    try {
      var data = msg.data;
      var total = data.slides.length;
      var textOk = 0;
      var textFail = 0;
      var imgOk = 0;
      var imgFail = 0;

      for (var si = 0; si < data.slides.length; si++) {
        var slide = data.slides[si];
        var slideNum = slide.index + 1;

        figma.ui.postMessage({
          type: 'progress',
          current: slideNum,
          total: total,
        });

        var page = figma.createPage();
        page.name = 'Slide ' + slideNum;
        figma.root.appendChild(page);

        var frame = figma.createFrame();
        frame.name = 'Slide ' + slideNum + ' BG';
        frame.x = 0;
        frame.y = 0;
        frame.resize(data.slideWidth || 1280, data.slideHeight || 720);
        frame.clipsContent = false;
        frame.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];

        if (slide.bgColor && slide.bgColor !== 'FFFFFF') {
          var rgb = hexToRgb(slide.bgColor);
          frame.fills = [{ type: 'SOLID', color: { r: rgb.r, g: rgb.g, b: rgb.b } }];
        }

        page.appendChild(frame);

        for (var ii = 0; ii < (slide.images || []).length; ii++) {
          var img = slide.images[ii];
          if (!img.data) continue;
          try {
            var binary = atob(img.data.split(',')[1]);
            var bytes = new Uint8Array(binary.length);
            for (var bi = 0; bi < binary.length; bi++) {
              bytes[bi] = binary.charCodeAt(bi);
            }
            var image = figma.createImage(bytes);
            var rect = figma.createRectangle();
            rect.x = img.rect.x;
            rect.y = img.rect.y;
            rect.resize(Math.max(img.rect.width, 1), Math.max(img.rect.height, 1));
            rect.fills = [{
              type: 'IMAGE',
              scaleMode: 'FILL',
              imageHash: image.hash,
            }];
            frame.appendChild(rect);
            imgOk++;
          } catch (err) {
            imgFail++;
            figma.notify('Image error: ' + err.message);
          }
        }

        for (var ti = 0; ti < slide.texts.length; ti++) {
          var t = slide.texts[ti];
          try {
            var fontInfo = await resolveFont(t.style.fontFamily);
            try {
              await figma.loadFontAsync({ family: fontInfo.family, style: fontInfo.style });
            } catch (e) {
              try {
                await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
                fontInfo = { family: 'Inter', style: 'Regular' };
              } catch (e2) {
                figma.notify('Font load fail: ' + t.style.fontFamily);
                textFail++;
                continue;
              }
            }

            var text = figma.createText();
            text.characters = ' ';
            text.fontName = { family: fontInfo.family, style: fontInfo.style };
            text.characters = t.text;
            text.fontSize = t.style.fontSize;
            text.x = t.rect.x;
            text.y = t.rect.y;
            text.resize(Math.max(t.rect.width, 1), Math.max(t.rect.height, 1));

            if (t.style.lineHeight) {
              text.lineHeight = { value: t.style.lineHeight, unit: 'PIXELS' };
            }

            var tc = hexToRgb(t.style.color);
            text.fills = [{ type: 'SOLID', color: { r: tc.r, g: tc.g, b: tc.b } }];

            var align = t.style.textAlign || 'LEFT';
            text.textAlignHorizontal = align.toUpperCase();

            frame.appendChild(text);
            textOk++;
          } catch (err) {
            textFail++;
            figma.notify('Text error: ' + err.message);
          }
        }
      }

      if (figma.root.children.length > 0) {
        figma.currentPage = figma.root.children[0];
      }

      figma.ui.postMessage({
        type: 'done',
        message: 'Done. Texts: ' + textOk + ' ok, ' + textFail + ' fail. Images: ' + imgOk + ' ok, ' + imgFail + ' fail.',
      });

    } catch (err) {
      figma.ui.postMessage({
        type: 'error',
        message: 'Error: ' + err.message,
      });
      figma.notify('Error: ' + err.message);
    }
  }

  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};
