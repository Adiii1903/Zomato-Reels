// src/services/storage.service.js
const ImageKit = require("imagekit");

let imagekit;

function getImageKit() {
  if (!imagekit) {
    if (
      !process.env.IMAGEKIT_PUBLIC_KEY ||
      !process.env.IMAGEKIT_PRIVATE_KEY ||
      !process.env.IMAGEKIT_URL_ENDPOINT
    ) {
      throw new Error("ImageKit environment variables missing");
    }

    imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
  }
  return imagekit;
}

async function uploadFile(file, fileName) {
  const ik = getImageKit();

  const result = await ik.upload({
    file,
    fileName,
  });

  return result;
}

module.exports = {
  uploadFile,
};
