import { useState, useRef, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Camera, Upload, X, ImageIcon, ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PhotoUploadProps {
  value?: UploadedPhoto[]
  onChange?: (photos: UploadedPhoto[]) => void
  maxFiles?: number
  maxSizeKB?: number
  required?: boolean
  label?: string
}

export interface UploadedPhoto {
  id: string
  url: string
  name: string
  size: number
  timestamp: Date
  caption?: string
}

export function PhotoUpload({
  value = [],
  onChange,
  maxFiles = 10,
  maxSizeKB = 500,
  required = false,
  label = 'Upload Photos',
}: PhotoUploadProps) {
  const [photos, setPhotos] = useState<UploadedPhoto[]>(value)
  const [isDragOver, setIsDragOver] = useState(false)
  const [previewPhoto, setPreviewPhoto] = useState<UploadedPhoto | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const compressImage = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height

          // Scale down if too large
          const maxDimension = 1200
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension
              width = maxDimension
            } else {
              width = (width / height) * maxDimension
              height = maxDimension
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')!
          ctx.drawImage(img, 0, 0, width, height)

          // Compress to target size
          let quality = 0.9
          let result = canvas.toDataURL('image/jpeg', quality)
          while (result.length > maxSizeKB * 1024 * 1.37 && quality > 0.1) {
            quality -= 0.1
            result = canvas.toDataURL('image/jpeg', quality)
          }

          resolve(result)
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    })
  }

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files)
      const remaining = maxFiles - photos.length
      const toProcess = fileArray.slice(0, remaining)

      const newPhotos: UploadedPhoto[] = []

      for (const file of toProcess) {
        if (!file.type.startsWith('image/')) continue

        const compressed = await compressImage(file)
        newPhotos.push({
          id: `photo-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          url: compressed,
          name: file.name,
          size: compressed.length,
          timestamp: new Date(),
        })
      }

      const updated = [...photos, ...newPhotos]
      setPhotos(updated)
      onChange?.(updated)
    },
    [photos, maxFiles, onChange, maxSizeKB]
  )

  const removePhoto = (id: string) => {
    const updated = photos.filter((p) => p.id !== id)
    setPhotos(updated)
    onChange?.(updated)
  }

  const updateCaption = (id: string, caption: string) => {
    const updated = photos.map((p) => (p.id === id ? { ...p, caption } : p))
    setPhotos(updated)
    onChange?.(updated)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
        <span className="text-xs text-muted-foreground">
          {photos.length}/{maxFiles} photos
        </span>
      </div>

      {/* Upload Zone */}
      {photos.length < maxFiles && (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragOver(true)
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
            isDragOver
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          )}
        >
          <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground mb-3">
            Drag photos here or use the buttons below
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Browse Files
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => cameraInputRef.current?.click()}
            >
              <Camera className="mr-2 h-4 w-4" />
              Take Photo
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Max {maxSizeKB}KB per image, JPEG/PNG
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted border">
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Overlay buttons */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8"
                  onClick={() => setPreviewPhoto(photo)}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8"
                  onClick={() => removePhoto(photo.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Caption */}
              <input
                type="text"
                placeholder="Add caption..."
                value={photo.caption || ''}
                onChange={(e) => updateCaption(photo.id, e.target.value)}
                className="w-full mt-1 text-xs px-2 py-1 border rounded bg-background"
              />
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewPhoto(null)}
        >
          <div className="max-w-3xl max-h-[90vh] relative">
            <img
              src={previewPhoto.url}
              alt={previewPhoto.name}
              className="max-w-full max-h-[85vh] rounded-lg object-contain"
            />
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-2 right-2"
              onClick={() => setPreviewPhoto(null)}
            >
              <X className="h-4 w-4" />
            </Button>
            {previewPhoto.caption && (
              <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3 rounded-b-lg text-sm">
                {previewPhoto.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
