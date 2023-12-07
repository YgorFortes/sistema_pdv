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

    const fileId = uploadResposta.data.fileId;

    if(uploadResposta.status !== 200){
      throw new ErroCustomizado('Serviço de upload indisponível.', 502);
    }

    const url  = `${process.env.URLBACKBLAZE}?fileId=${fileId}`;
    return url;
  
  } catch (erro) {
    throw erro;
  }
}

async function excluirImagem(fileId){
  await b2.authorize();

  const respostaNomeArquivo = await b2.getFileInfo({
    fileId: fileId,
  });
  

  const nomeArquivo = respostaNomeArquivo.data.fileName;



  const resposta = await b2.deleteFileVersion({
    fileId: fileId,
    fileName: nomeArquivo,
  });


  if(resposta.status !== 200){
    throw new ErroCustomizado('Não foi possivel excluir imagem do servidor.', 502);
  }

}

export { uploadImagem, excluirImagem , multerUploader };


