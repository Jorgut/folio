/**
 * 响应式截图测试
 * 在三种视口下拍摄模板的各个 slide 截图
 */
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.resolve(__dirname, '../index.html');

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'tablet',  width: 834,  height: 1194 },
  { name: 'mobile',  width: 390,  height: 844 },
];

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
    // 等待第一页动画
    await page.waitForTimeout(800);

    const outDir = `/Users/aj/Desktop/folio-responsive-test/${vp.name}`;
    await import('fs').then(fs => fs.promises.mkdir(outDir, { recursive: true }));

    // 遍历 8 页截屏
    const totalSlides = await page.evaluate(() => document.querySelectorAll('.slide').length);
    for (let i = 0; i < totalSlides; i++) {
      await page.evaluate((idx) => {
        const slides = document.querySelectorAll('.slide');
        const deck = document.getElementById('deck');
        deck.style.transform = `translateX(-${idx * 100}%)`;
        slides.forEach((s, j) => s.classList.toggle('active', j === idx));
      }, i);
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `${outDir}/slide-${i + 1}.png`,
        fullPage: false,
      });
      console.log(`  [${vp.name}] slide ${i + 1}/${totalSlides} ✓`);
    }
  }

  await browser.close();
  console.log('\n✅ Done! Screenshots at ~/Desktop/folio-responsive-test/');
}

run().catch(console.error);
