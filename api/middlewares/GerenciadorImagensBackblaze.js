import BackBlazeB2 from "backblaze-b2";
import multer from "multer";
import ErroCustomizado from "../erros/ErroCustomizado.js";

const b2 = new BackBlazeB2({
  applicationKeyId: process.env.BACKBLAZEB2APPLICATIONKEYID,
  applicationKey: process.env.BACKBLAZEB2APPLICATIONKEY,
});



const multerUploader = multer({
  storage: multer.memoryStorage(),
  fileFilter:  (req, file, callback)=>{
    const extensaoImg = ['image/png', 'image/jpg', 'image/jpeg'].find(formatoAceito => formatoAceito == file.mimetype)
    if(!extensaoImg){
      return callback(new ErroCustomizado('Válido somente imagens em formato png, e jpeg',415), false);
    }
    
    return callback(null, true);
  }
});


async function uploadImagem(nomeArquivo, buffer){
  try {
    await b2.authorize();

    const resposta = await b2.getUploadUrl({
      bucketName: process.env.BUCKETNAME,
      bucketId: process.env.BUCKETID,
    });

    
    
    const uploadResposta = await b2.uploadFile({
      uploadUrl: resposta.data.uploadUrl,
      uploadAuthToken: resposta.data.authorizationToken,
      fileName: nomeArquivo,
      data: buffer, 
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
  return resposta;
}

export { uploadImagem, excluirImagem , multerUploader };


