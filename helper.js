const fs = require('fs');
const parser = require('handlebars');
const pcurrent = __dirname;
const puppeteer = require('puppeteer');

module.exports.compileAll = async function compileAll(array){
    let all = ''
    let temporary = {}
    for(let each of array){
        temporary = await module.exports.compile(each.part)
        if(each.obj){
            all += temporary(each.obj)
        }else{
            all += temporary()
        }
    }

    return all

}

module.exports.compile = async function(file){
   return parser.compile(await module.exports.parseFile(pcurrent+'/src/'+file+'.html'))
}

module.exports.parseFile = function parseFile(caminho){
    return new Promise ((resolve, reject)=>{
        fs.readFile(caminho, function read(err, data){
            resolve(data.toString())
        })
    })
}

module.exports.combinate = async function combinate(imgs, length) {
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

module.exports.randomInt = function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low)
  }


module.exports.deleteRecursive = function(path) {
    if( fs.existsSync(path) ) {
      fs.readdirSync(path).forEach(function(file,index){
        var curPath = path + "/" + file;
        if(fs.lstatSync(curPath).isDirectory()) {
          deleteFolderRecursive(curPath);
        } else { 
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  };
  

module.exports.printBloco =  async function printBloco(url, dir, count) {
  return new Promise (async (resolve, reject) => {
    count--;
    let browsers = count / 50;
    let mod = count % 50;
    const promises = [];

    if (browsers > 1) {
      for (let i = 1; i < browsers; i++) {
        let range = i * 50;
        range++;
        
        
        promises.push(this.printerBrowser(url, dir, count, range));
        
  
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
      if (mod > 0) {
        promises.push(this.printerBrowser(url, dir, count, mod));
        Promise.all(promises).then(() => { resolve(true) })
      } else {  
        Promise.all(promises).then(() => { resolve(true) })
      }
    } else {
      await this.standartPrintBloco(url, dir, count)
      resolve(true);
    }    
  });
}
  
  
module.exports.printerBrowser =  async function printerBrowser(url, dir, count, range) {
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
          await screenshotDOMElement(`#div-${i}`, 0, __dirname + `/src/prints/${dir}/${i}.png`);
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
          await screenshotDOMElement(`#div-${i}`, 0, __dirname + `/src/prints/${dir}/${i}.png`);
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


module.exports.standartPrintBloco =  async function printBloco(url, dir, count) {
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
  await screenshotDOMElement(`#div-${i}`, 0, __dirname + `/src/prints/${dir}/${i}.png`);

  await page.evaluate(i => {
    document.querySelector(`#div-${i}`).remove();
  }, i);
}

await browser.close();
}