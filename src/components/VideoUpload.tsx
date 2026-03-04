import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X, Film } from 'lucide-react'

interface VideoUploadProps {
  value?: UploadedVideo[]
  onChange?: (videos: UploadedVideo[]) => void
  maxFiles?: number
  maxSizeMB?: number
}

export interface UploadedVideo {
  id: string
  url: string
  name: string
  size: number
  duration?: number
  timestamp: Date
}

export function VideoUpload({
  value = [],
  onChange,
  maxFiles = 3,
  maxSizeMB = 50,
}: VideoUploadProps) {
  const [videos, setVideos] = useState<UploadedVideo[]>(value)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files)
      const remaining = maxFiles - videos.length
      const toProcess = fileArray.slice(0, remaining)

      const newVideos: UploadedVideo[] = []

      for (const file of toProcess) {
        if (!file.type.startsWith('video/')) continue
        if (file.size > maxSizeMB * 1024 * 1024) {
          alert(`File ${file.name} exceeds ${maxSizeMB}MB limit`)
          continue
        }

        const id = `video-${Date.now()}-${Math.random().toString(36).slice(2)}`

        // Simulate upload progress
        setUploadProgress((prev) => ({ ...prev, [id]: 0 }))
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            const current = prev[id] || 0
            if (current >= 100) {
              clearInterval(progressInterval)
              const { [id]: _, ...rest } = prev
              return rest
            }
            return { ...prev, [id]: Math.min(current + 10, 100) }
          })
        }, 200)

        const url = URL.createObjectURL(file)
        newVideos.push({
          id,
          url,
          name: file.name,
          size: file.size,
          timestamp: new Date(),
        })
      }

      const updated = [...videos, ...newVideos]
      setVideos(updated)
      onChange?.(updated)
    },
    [videos, maxFiles, maxSizeMB, onChange]
  )

  const removeVideo = (id: string) => {
    const updated = videos.filter((v) => v.id !== id)
    setVideos(updated)
    onChange?.(updated)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Upload Video Evidence</label>
        <span className="text-xs text-muted-foreground">
          {videos.length}/{maxFiles} videos (max {maxSizeMB}MB each)
        </span>
      </div>

      {videos.length < maxFiles && (
        <div
          className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Film className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground mb-2">
            Click to upload video files
          </p>
          <p className="text-xs text-muted-foreground">
            MP4, MOV supported. Max {maxSizeMB}MB per file.
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />

      {/* Upload Progress */}
      {Object.entries(uploadProgress).map(([id, progress]) => (
        <div key={id} className="flex items-center gap-3 p-3 border rounded-lg">
          <Film className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{progress}% uploaded</span>
          </div>
        </div>
      ))}

      {/* Video List */}
      {videos.map((video) => (
        <div key={video.id} className="flex items-center gap-3 p-3 border rounded-lg">
          <div className="w-24 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
            <video
              src={video.url}
              className="w-full h-full object-cover"
              preload="metadata"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{video.name}</p>
            <p className="text-xs text-muted-foreground">{formatSize(video.size)}</p>
          </div>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => removeVideo(video.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}
