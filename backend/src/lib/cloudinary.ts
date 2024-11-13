import { v2 as cloudinary } from "cloudinary";

const ROOT_DIR_UPLOAD = "/food-ordering-app";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (file: Express.Multer.File, folder: string) => {
  const base64Image = Buffer.from(file.buffer).toString("base64");
  const dataURI = `data:${file.mimetype};base64,${base64Image}`;

  const uploadResponse = await cloudinary.uploader.upload(dataURI, {
    folder: `${ROOT_DIR_UPLOAD}/${folder}`,
  });
  return uploadResponse.url;
};

export { uploadImage };

export default cloudinary;
