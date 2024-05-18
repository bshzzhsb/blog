import { v2 as cloudinary } from 'cloudinary';

import { CLOUDINARY_APP_ID } from '~/constants';

cloudinary.config({
  cloud_name: CLOUDINARY_APP_ID,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file: string, type: string) {
  try {
    const { url } = await cloudinary.uploader.upload(`data:${type};base64,${file}`, {
      unique_filename: true,
      use_filename: true,
    });
    return url;
  } catch (e) {
    console.error('upload image error', e);
  }
}
