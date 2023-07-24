const fsp = require('fs/promises');

const { uploadFile } = require('../helpers/handleUpload');

const removeFileFromDisk = fsp.unlink;

async function createGenericUpload(request, response) {
  const { fileValidationError, file } = request;

  if (request.fileValidationError) {
    return response.status(400).json(fileValidationError);
  }

  if (!file) {
    return response.status(400).json('Select a file to upload');
  }

  const { filename: fileName, path } = file;

  const readFile = await fsp.readFile(`uploads/${fileName}`, (err, data) => {
    if (err) {
      throw err;
    }

    return data;
  });

  const upload = await uploadFile(fileName, readFile);

  await removeFileFromDisk(path);

  return response.status(200).json({ url: upload });
}

module.exports = {
  createGenericUpload,
};
