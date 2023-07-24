const B2 = require("backblaze-b2");

const b2 = new B2({
  applicationKeyId: process.env.B2_KEY_ID,
  applicationKey: process.env.B2_KEY,
});

async function uploadFile(fileName, file) {
  await b2.authorize();

  const {
    data: { uploadUrl, authorizationToken },
  } = await b2.getUploadUrl({
    bucketId: process.env.B2_BUCKET_ID,
  });

  await b2.uploadFile({
    uploadUrl,
    uploadAuthToken: authorizationToken,
    fileName,
    data: file,
  });

  const fileNameFormatted = fileName.replace(/ /g, "+");

  const url = `https://f002.backblazeb2.com/file/${process.env.B2_BUCKET_NAME}/${fileNameFormatted}`;

  return url;
}

module.exports = { uploadFile };
