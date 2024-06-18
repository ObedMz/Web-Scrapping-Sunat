const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    await page.goto('https://e-consultaruc.sunat.gob.pe/cl-ti-itmrconsruc/FrameCriterioBusquedaWeb.jsp', { waitUntil: 'networkidle2' });

    await page.waitForSelector('#txtRuc');

    const ruc = '10101666692'; 
    await page.type('#txtRuc', ruc);

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('#btnAceptar'),
    ]);

    await page.waitForSelector('.col-sm-7 .list-group-item-heading');

    const content = await page.content();

    const result = await page.evaluate(() => {
      const resultadoElement = document.querySelector('.col-sm-7 .list-group-item-heading');
      return resultadoElement ? (resultadoElement.textContent as string).trim() : 'No se encontraron resultados';
    });

    console.log(`Resultado para RUC ${ruc}: ${result}`);

    await browser.close();
  } catch (error) {
    console.error('Error en el script:', error);
  }
})();
