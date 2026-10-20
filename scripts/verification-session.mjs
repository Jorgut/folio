import {pathToFileURL} from 'node:url';
import path from 'node:path';

export async function withVerificationPage(chromium,htmlPath,verify) {
  const browser=await chromium.launch({headless:true});
  try {
    const page=await browser.newPage({viewport:{width:1280,height:720}});
    const consoleErrors=[];
    page.on('console',message=>{if(message.type()==='error') consoleErrors.push(message.text());});
    await page.goto(pathToFileURL(path.resolve(htmlPath)).href,{waitUntil:'networkidle',timeout:30000});
    await page.waitForSelector('.slide',{timeout:5000});
    return await verify(page,consoleErrors);
  } finally {
    await browser.close();
  }
}
