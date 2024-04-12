import { File } from '@koa/multer';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadPublic = async (fileName: string, file: File) => {
  return new Promise((resolve, reject) => {
    if (file) {
      // console.log(req.file.processedImage.toString('base64'));
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: 'image',
            folder: 'Shopy',
            filename_override: fileName,
            public_id: fileName,
          },
          (err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          },
        )
        .end(file.buffer);
    }
  });
};
// upload file.buffer to cloudinary as image
//   return cloudinary.uploader
//     .upload_stream(
//       {
//         resource_type: "image",
//       },
//       (error, result) => {
//         console.log("cloudinary photo upload result", result, error);
//       }
//     )
//     .end(file.buffer);
// };

export default {
  uploadPublic,
};
