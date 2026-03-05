import { supabase } from './supabase'

interface UploadOptions {
  bucket: string
  folder?: string
  fileName?: string
}

export const storage = {
  /**
   * Upload a file to Supabase storage
   */
  async uploadFile(file: File, options: UploadOptions) {
    const { bucket, folder = '', fileName } = options
    const fileExt = file.name.split('.').pop()
    const timestamp = Date.now()
    const finalFileName = fileName || `${timestamp}.${fileExt}`
    const filePath = folder ? `${folder}/${finalFileName}` : finalFileName

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) throw error

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return {
      path: data.path,
      url: urlData.publicUrl,
      fileName: finalFileName,
    }
  },

  /**
   * Upload multiple files
   */
  async uploadMultiple(files: File[], options: UploadOptions) {
    const uploads = files.map((file) => this.uploadFile(file, options))
    return Promise.all(uploads)
  },

  /**
   * Delete a file from storage
   */
  async deleteFile(bucket: string, filePath: string) {
    const { error } = await supabase.storage.from(bucket).remove([filePath])
    if (error) throw error
  },

  /**
   * Get a signed URL for private files
   */
  async getSignedUrl(bucket: string, filePath: string, expiresIn: number = 3600) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, expiresIn)

    if (error) throw error
    return data.signedUrl
  },

  /**
   * Upload incident photo
   */
  async uploadIncidentPhoto(file: File, incidentId: string, organizationId: string) {
    return this.uploadFile(file, {
      bucket: 'incident-photos',
      folder: `${organizationId}/${incidentId}`,
    })
  },

  /**
   * Upload avatar
   */
  async uploadAvatar(file: File, userId: string) {
    return this.uploadFile(file, {
      bucket: 'avatars',
      folder: userId,
      fileName: `avatar.${file.name.split('.').pop()}`,
    })
  },

  /**
   * Upload report attachment
   */
  async uploadReportAttachment(file: File, reportId: string, organizationId: string) {
    return this.uploadFile(file, {
      bucket: 'report-attachments',
      folder: `${organizationId}/${reportId}`,
    })
  },

  /**
   * Validate file before upload
   */
  validateFile(file: File, options: {
    maxSize?: number // in bytes
    allowedTypes?: string[]
  }) {
    const { maxSize = 5 * 1024 * 1024, allowedTypes } = options // Default 5MB

    if (file.size > maxSize) {
      throw new Error(`File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`)
    }

    if (allowedTypes && !allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed`)
    }

    return true
  },
}

// Common validation presets
export const VALIDATION_PRESETS = {
  image: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
  document: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ],
  },
  avatar: {
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
}
