const fs = require('fs');
const parser = require('handlebars');
const pcurrent = __dirname;
const puppeteer = require('puppeteer');
const moment = require('moment-timezone');

function combinate(imgs, length) {
    return new Promise (async (resolve, reject) => {
        resolve(crossjoinMany(imgs));
    });
}

function arrayfy(a) {
    return a.map(_ => [_]);
}

function crossjoin(a, b) {
    let c = [];
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < b.length; j++) {
            c.push([...a[i], b[j]]);
        }
    }
    return c;
}
function crossjoinMany(a) {
    let first = arrayfy(a[0]);
    for (let i = 1; i < a.length; i++) {
        first = crossjoin(first, a[i]);
    }
    return first;
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low)
  }


async function printBloco(url, dir, count) {
  return new Promise (async (resolve, reject) => {
    count--;
    let browsers = count / 50;
    let mod = count % 50;
    const promises = [];

    if (browsers > 1) {
      for (let i = 1; i < browsers; i++) {
        let range = i * 50;
        range++;
        
        
        promises.push(printerBrowser(url, dir, count, range));
        
  
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
      if (mod > 0) {
        promises.push(printerBrowser(url, dir, count, mod));
        Promise.all(promises).then(() => { resolve(true) })
      } else {  
        Promise.all(promises).then(() => { resolve(true) })
      }
    } else {
      await standartPrintBloco(url, dir, count)
      resolve(true);
    }    
  });
}
  
async function printerBrowser(url, dir, count, range) {
  return new Promise(async (resolve, reject) => {
      const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: true });
      const page = await browser.newPage();
      await page.goto(url);

          
      await page.setViewport({
          width: 1100,
          height: 10000
      });
      async function screenshotDOMElement(selector, padding = 0, path) {
        const rect = await page.evaluate(selector => {
          const element = document.querySelector(selector);
          const {x, y, width, height} = element.getBoundingClientRect();
          return {left: x, top: y, width, height, id: element.id};
      }, selector);
        return await page.screenshot({
          path: path,
          clip: {
            x: rect.left - padding,
            y: rect.top - padding,
            width: rect.width + padding * 2,
            height: rect.height + padding * 2
        }
    });
    }
    if (range < 51) {
      let mod = count % 50;
      range = (count - mod) + 1;

      for (let i = 1; i <= count; i++) {
        if (i < range) {
          await page.evaluate(i => {
            document.querySelector(`#div-${i}`).remove();
          }, i);
        }
      }

      for (let i = range; i <= count; i++) {
        try {
          await screenshotDOMElement(`#div-${i}`, 0, `${dir}/${i}.png`);
        } catch (err) { }
  
        try {
          await page.evaluate(i => {
            document.querySelector(`#div-${i}`).remove();
          }, i);
        } catch (err) { }
      }


    } else {

      for (let i = 1; i <= count; i++) {
        if (i < (range - 50) || i > range) {
          await page.evaluate(i => {
            document.querySelector(`#div-${i}`).remove();
          }, i);
        }
      }

      for (let i = (range - 50); i < range; i++) {
        try {
          await screenshotDOMElement(`#div-${i}`, 0, `${dir}/${i}.png`);
        } catch (err) { }
  
        try {
          await page.evaluate(i => {
            document.querySelector(`#div-${i}`).remove();
          }, i);
        } catch (err) { }
      }
  
    }

    
    

    await browser.close();
    resolve(true);
  });
}


async function printBloco(url, dir, count) {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: true });
  const page = await browser.newPage();
  await page.goto(url);
  
  await page.setViewport({
      width: 1100,
      height: 10000
  });
  async function screenshotDOMElement(selector, padding = 0, path) {
    const rect = await page.evaluate(selector => {
      const element = document.querySelector(selector);
      const {x, y, width, height} = element.getBoundingClientRect();
      return {left: x, top: y, width, height, id: element.id};
  }, selector);
    return await page.screenshot({
      path: path,
      clip: {
        x: rect.left - padding,
        y: rect.top - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2
    }
});
}

for (let i = 1; i <= count; i++) {
  await screenshotDOMElement(`#div-${i}`, 0, `${dir}/${i}.png`);

  await page.evaluate(i => {
    document.querySelector(`#div-${i}`).remove();
  }, i);
}

await browser.close();
}