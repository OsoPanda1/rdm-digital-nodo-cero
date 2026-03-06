import { v4 as uuidv4 } from 'uuid';

export interface UploadResult {
  url: string;
  key: string;
  success: boolean;
  error?: string;
}

export interface UploadService {
  upload(file: Buffer, filename: string, folder: string): Promise<UploadResult>;
  delete(key: string): Promise<boolean>;
}

/**
 * Supabase Storage upload service
 */
export class SupabaseUploadService implements UploadService {
  private bucket: string;
  private supabaseUrl: string;
  private supabaseKey: string;

  constructor() {
    this.bucket = process.env.SUPABASE_BUCKET || 'rdm-digital';
    this.supabaseUrl = process.env.SUPABASE_URL || '';
    this.supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
  }

  async upload(file: Buffer, filename: string, folder: string): Promise<UploadResult> {
    try {
      // Generate unique key
      const ext = filename.split('.').pop() || 'jpg';
      const key = `${folder}/${uuidv4()}.${ext}`;

      // Upload to Supabase Storage using REST API
      const response = await fetch(
        `${this.supabaseUrl}/storage/v1/object/${this.bucket}/${key}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': this.getContentType(ext),
            'Authorization': `Bearer ${this.supabaseKey}`,
            'x-upsert': 'true'
          },
          body: file
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Upload failed: ${error}`);
      }

      const publicUrl = `${this.supabaseUrl}/storage/v1/object/public/${this.bucket}/${key}`;

      return {
        url: publicUrl,
        key,
        success: true
      };
    } catch (error) {
      console.error('Supabase upload error:', error);
      return {
        url: '',
        key: '',
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.supabaseUrl}/storage/v1/object/${this.bucket}/${key}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.supabaseKey}`
          }
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Supabase delete error:', error);
      return false;
    }
  }

  private getContentType(ext: string): string {
    const types: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      svg: 'image/svg+xml',
      pdf: 'application/pdf'
    };
    return types[ext.toLowerCase()] || 'application/octet-stream';
  }
}

/**
 * S3 upload service
 */
export class S3UploadService implements UploadService {
  private bucket: string;
  private region: string;
  private accessKeyId: string;
  private secretAccessKey: string;

  constructor() {
    this.bucket = process.env.AWS_S3_BUCKET || '';
    this.region = process.env.AWS_REGION || 'us-east-1';
    this.accessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
    this.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';
  }

  async upload(file: Buffer, filename: string, folder: string): Promise<UploadResult> {
    try {
      const ext = filename.split('.').pop() || 'jpg';
      const key = `${folder}/${uuidv4()}.${ext}`;

      // Use AWS SDK if available, otherwise return error
      const AWS = await import('aws-sdk');
      
      const s3 = new AWS.S3({
        region: this.region,
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey
      });

      await s3.upload({
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ContentType: this.getContentType(ext),
        ACL: 'public-read'
      }).promise();

      const url = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;

      return {
        url,
        key,
        success: true
      };
    } catch (error) {
      console.error('S3 upload error:', error);
      return {
        url: '',
        key: '',
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const AWS = await import('aws-sdk');
      
      const s3 = new AWS.S3({
        region: this.region,
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey
      });

      await s3.deleteObject({
        Bucket: this.bucket,
        Key: key
      }).promise();

      return true;
    } catch (error) {
      console.error('S3 delete error:', error);
      return false;
    }
  }

  private getContentType(ext: string): string {
    const types: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      svg: 'image/svg+xml',
      pdf: 'application/pdf'
    };
    return types[ext.toLowerCase()] || 'application/octet-stream';
  }
}

/**
 * Local file upload service (for development/testing)
 */
export class LocalUploadService implements UploadService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || './uploads';
  }

  async upload(file: Buffer, filename: string, folder: string): Promise<UploadResult> {
    try {
      const ext = filename.split('.').pop() || 'jpg';
      const key = `${folder}/${uuidv4()}.${ext}`;
      const path = `${this.uploadDir}/${key}`;
      
      // Ensure directory exists
      const fs = await import('fs');
      const pathModule = await import('path');
      const dir = pathModule.dirname(path);
      
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(path, file);

      const url = `/uploads/${key}`;

      return {
        url,
        key,
        success: true
      };
    } catch (error) {
      console.error('Local upload error:', error);
      return {
        url: '',
        key: '',
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const fs = await import('fs');
      const path = `${this.uploadDir}/${key}`;
      
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
      
      return true;
    } catch (error) {
      console.error('Local delete error:', error);
      return false;
    }
  }
}

/**
 * Get the configured upload service
 */
export function getUploadService(): UploadService {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    return new SupabaseUploadService();
  }
  
  if (process.env.AWS_S3_BUCKET && process.env.AWS_ACCESS_KEY_ID) {
    return new S3UploadService();
  }
  
  // Default to local storage for development
  return new LocalUploadService();
}

/**
 * Upload middleware factory
 */
export const handleUpload = (folder: string = 'general') => {
  return async (req: any, res: any, next: any) => {
    try {
      // Check if there's a file in the request
      const file = req.file;
      
      if (!file) {
        // Check for base64 image in body
        const { image } = req.body;
        if (image && image.startsWith('data:')) {
          const service = getUploadService();
          
          // Extract base64 data
          const matches = image.match(/^data:([^;]+);base64,(.+)$/);
          if (matches) {
            const buffer = Buffer.from(matches[2], 'base64');
            const ext = matches[1].split('/')[1] || 'jpg';
            const filename = `image.${ext}`;
            
            const result = await service.upload(buffer, filename, folder);
            
            if (result.success) {
              req.body.imageUrl = result.url;
              req.body.imageKey = result.key;
            }
          }
        }
        return next();
      }

      // Handle multer file
      const service = getUploadService();
      const result = await service.upload(file.buffer, file.originalname, folder);
      
      if (result.success) {
        req.body.imageUrl = result.url;
        req.body.imageKey = result.key;
      } else {
        console.error('Upload failed:', result.error);
      }

      next();
    } catch (error) {
      console.error('Upload middleware error:', error);
      next();
    }
  };
};
