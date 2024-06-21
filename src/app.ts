import express, { NextFunction, Request, Response } from 'express';
import { RucResult } from './models/RucResult';
import { CustomResponse, ErrorResponseRazonSocial, ErrorResponseRucResult } from './models/Responses';
import { RazonSocial } from './models/RazonSocial';
import { coincidenciasRazonSocial, razonSocialBusqueda } from './utils/razonSocialBusqueda';
import { rucBusqueda } from './utils/rucBusqueda';
import { documentoBusqueda } from './utils/documentoBusqueda';
import { exportData } from './utils/exportar';
// import { busquedaCoincidencias } from './utils/rucBusqueda';

const app = express();
const cors = require('cors');
const port = 3000;

app.use(cors());

app.get("/busqueda", (req : Request, res : CustomResponse<RucResult>) => {

  const tipoBusqueda : string | undefined = req.get("tipo_busqueda");
  const tipoDocumento : string | undefined = req.get("tipoDocumento");
  const value : string | undefined = req.get("value");

  
  // const result : RucResult = coincidenciasRazonSocial(value);
  // res.json(result);
});


app.get("/documento/:tipo_documento/:n_documento", async (req: Request, res: Response<ErrorResponseRazonSocial>) => {
  try{
    //opciones: dni, carnet, pasaporte, cedula
    let documentoParam: string = req.params.tipo_documento;
    let tipoDocumento : string | undefined;
    //convertir a valor usado en SUNAT
    switch ( documentoParam ) {
      case "dni":
        tipoDocumento = "1";
        break;
      case "carnet":
        tipoDocumento = "4";
        break;
      case "pasaporte" : 
        tipoDocumento = "7";
        break;
      case "cedula" : 
        tipoDocumento = "A";
        break;
      default: 
        tipoDocumento = "0";
        break;
  }
    const nDocumento : string | undefined = req.params.n_documento;
    const result : RazonSocial[] = await documentoBusqueda(tipoDocumento, nDocumento);
    res.json({ data: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/ruc/:ruc", async (req : Request, res : Response<ErrorResponseRucResult>) => {
  try{
    const value = req.params.ruc ?? "";
    console.log(value);
    const result : RucResult = await rucBusqueda(value);
    res.json({ data: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/razon_social/:razon_social", async(req : Request, res: Response<ErrorResponseRazonSocial>) => {
  try{
    const value = req.params.razon_social ?? "";
    const coincidencias = await razonSocialBusqueda(value);
    res.json({ data: coincidencias });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
})

app.use(express.json());
app.post("/download", async (req: Request, res: CustomResponse<any>) => {
  try{
    const data = req.body.data;
    const fileName = req.body.fileName;
    const path = await exportData(data,fileName);
    res.download(path);
  }catch(error : any){
    res.status(500).json({ error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
