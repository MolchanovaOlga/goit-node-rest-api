import Jimp from "jimp";

export default async function changeSizeImg(pathFile) {
  await Jimp.read(pathFile)
    .then((file) => {
      return file.cover(250, 250).write(pathFile);
    })
    .catch((err) => {
      console.log(err);
    });
}
