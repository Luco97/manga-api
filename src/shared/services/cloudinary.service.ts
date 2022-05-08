import { Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private _cloudinary = v2;

  constructor() {
    this._cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }

  async upload(
    filePath: string,
    folderParth: string,
    fileName: string
  ): Promise<{ result?: any; error?: any }> {
    const post = await this._cloudinary.uploader.upload(filePath, {
      folder: folderParth,
      public_id: fileName
    });
    if (post?.error) return { error: post.error };
    return { result: post };
  }
}
