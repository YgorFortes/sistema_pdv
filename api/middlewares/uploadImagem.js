import BackBlazeB2 from "backblaze-b2";
import multer from "multer";
import path from 'path'
import ErroCustomizado from "../erros/ErroCustomizado.js";
import fs from 'fs';

const b2 = new BackBlazeB2({
  applicationKeyId: process.env.BACKBLAZEB2APPLICATIONKEYID,
  applicationKey: process.env.BACKBLAZEB2APPLICATIONKEY,
});

const pathFile = './public/uploads/imagem_produtos';
const armazenamento = multer.diskStorage({
  destination: (req, file, callback)=>{
    callback(null, path.resolve(pathFile))
  },
  filename: (req, file , callback)=>{
    const data = new Date().getTime();
    callback(null, `${data}_${file.originalname}`);
  },
})


const multerUploader = multer({
  storage: armazenamento,
  fileFilter:  (req, file, callback)=>{
    const extensaoImg = ['image/png', 'image/jpg', 'image/jpeg'].find(formatoAceito => formatoAceito == file.mimetype)
    if(!extensaoImg){
      return callback(new ErroCustomizado('Válido somente imagens em formato png, e jpeg',415), false);
    }
    
    return callback(null, true);
  }
});

async function uploadImagem(nomeArquivo){
  try {
    await b2.authorize();

    const resposta = await b2.getUploadUrl({
      bucketName: process.env.BUCKETNAME,
      bucketId: process.env.BUCKETID,
    });

    
    
    const caminhoArquivo = path.resolve(pathFile, nomeArquivo);
    const arquivoBuffer = fs.readFileSync(caminhoArquivo);
    
    const uploadResposta = await b2.uploadFile({
      uploadUrl: resposta.data.uploadUrl,
      uploadAuthToken: resposta.data.authorizationToken,
      fileName: nomeArquivo,
      data: arquivoBuffer, 
    });

    if(!uploadResposta.status === 200){
      throw new ErroCustomizado('Serviço de upload indisponível.', 502);
    }

    const url  = `${process.env.URLBACKBLAZE}?fileId=${uploadResposta.data.fileId}`
    return url;
  
  } catch (erro) {
    throw erro;
  }
}

export {uploadImagem, multerUploader};

// multerUploader.single('image')(req, res, async (erro) => {
//     if (erro instanceof multer.MulterError) {
//       throw erro;
//     } else if (erro) {
//       throw erro;
//     }
    
//     // const uploadUrlResposta = await b2.getUploadUrl({
//     //   bucketId: resposta.data.buckets[0].bucketId,
//     // })

//     // const uploadResposta = await b2.uploadFile({
//     //   uploadUrl: uploadUrlResposta.data.uploadUrl,
//     //   uploadAuthToken: uploadUrlResposta.data.authorizationToken,
//     //   fileName: req.file.filename,
//     //   data: fs.readFileSync(req.file.path),
//     //   onUploadProgress: null
//     // })
//     // req.filePath = uploadResposta.data.contentUrl;
//     // next();
// });


// async function uploadImagem(req, res, next){
//   try {
//     

//     await b2.authorize();

//     const resposta = await b2.getBucket({
//       bucketName: "bucketName"
//     });

//     const armazenamento = multer.diskStorage({
//       destination: (req, file, callback)=>{
//         callback(null, './public/uploads/imagens-produtos')
//       },

//     });



//     return multerUploader;
//     // 

//   } catch (erro) {
//     next(erro);
//   }
// }

// export default uploadImagem;

