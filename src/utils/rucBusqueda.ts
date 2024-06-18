import { RazonSocial } from "../models/RazonSocial";

const puppeteer = require('puppeteer');

export const busquedaCoincidencias = async (razonSocial : string) : Promise<RazonSocial[]>=> {
  let coincidencias = [];
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  
  try{

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
  
    await page.goto('https://e-consultaruc.sunat.gob.pe/cl-ti-itmrconsruc/FrameCriterioBusquedaWeb.jsp', { waitUntil: 'networkidle2' });
  
    await page.waitForSelector('#btnPorRazonSocial');
  
    await page.click('#btnPorRazonSocial');
  
    await page.waitForSelector('#txtNombreRazonSocial');
    await page.type('#txtNombreRazonSocial', razonSocial);
  
    await page.waitForSelector('#txtNombreRazonSocial');
    await page.click('#btnAceptar');
  
  
    await page.waitForSelector(".list-group-item.clearfix.aRucs[data-ruc]");
  
    await page.content();
  
    coincidencias = await page.evaluate(() => {
      const resultadoElement = document.querySelectorAll(".list-group-item.clearfix.aRucs[data-ruc]");
      let results : any[] = [];
      resultadoElement.forEach( (el)  => {
        results.push({
          ruc : el.querySelectorAll<HTMLElement>(".list-group-item-heading")[0].innerText.split(":")[1].trim(),
          razonSocial : el.querySelectorAll<HTMLElement>(".list-group-item-heading")[1].innerText,
          ubicacion : el.querySelectorAll<HTMLElement>(".list-group-item-text")[0].innerText,
          estado : el.querySelector<HTMLElement>(".list-group-item-text strong")?.innerText,
        })
      })
      return results;
    });
  }catch(err){
    console.log(err);
  }
  await browser.close();
  return coincidencias;
}
export const coincidenciasRazonSocial = async (ruc : string) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  try {
    const page = await browser.newPage();
    
    await page.waitForSelector(`a[data-ruc='${ruc}']`);
    await page.click(`a[data-ruc='${ruc}']`);

    await browser.close();
  } catch (error) {
    console.error('Error en el script:', error);
    await browser.close();
  }
};