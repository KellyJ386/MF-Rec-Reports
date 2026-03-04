import { useState, useEffect, useRef, useCallback } from 'react'
import { Badge } from '@/components/ui/badge'
import { Loader2, Check, WifiOff } from 'lucide-react'

interface AutoSaveIndicatorProps {
  lastSaved: Date | null
  isSaving: boolean
  isOffline?: boolean
}

export function AutoSaveIndicator({
  lastSaved,
  isSaving,
  isOffline = false,
}: AutoSaveIndicatorProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  if (isOffline) {
    return (
      <Badge variant="outline" className="text-yellow-600 border-yellow-300">
        <WifiOff className="h-3 w-3 mr-1" />
        Offline - Will sync later
      </Badge>
    )
  }

  if (isSaving) {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
        Saving...
      </Badge>
    )
  }

  if (lastSaved) {
    return (
      <Badge variant="outline" className="text-green-600 border-green-300">
        <Check className="h-3 w-3 mr-1" />
        Saved at {formatTime(lastSaved)}
      </Badge>
    )
  }

  return null
}

// Hook for auto-save functionality
export function useAutoSave<T>(
  data: T,
  saveFn: (data: T) => Promise<void>,
  intervalMs: number = 30000,
  enabled: boolean = true
) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const dataRef = useRef(data)
  const lastSavedDataRef = useRef<string>('')

  useEffect(() => {
    dataRef.current = data
  }, [data])

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    const timer = setInterval(async () => {
      const currentData = JSON.stringify(dataRef.current)
      if (currentData === lastSavedDataRef.current) return // No changes

      try {
        setIsSaving(true)
        await saveFn(dataRef.current)
        lastSavedDataRef.current = currentData
        setLastSaved(new Date())
      } catch (error) {
        console.error('Auto-save failed:', error)
      } finally {
        setIsSaving(false)
      }
    }, intervalMs)

    return () => clearInterval(timer)
  }, [saveFn, intervalMs, enabled])

  const manualSave = useCallback(async () => {
    try {
      setIsSaving(true)
      await saveFn(dataRef.current)
      lastSavedDataRef.current = JSON.stringify(dataRef.current)
      setLastSaved(new Date())
    } catch (error) {
      console.error('Manual save failed:', error)
    } finally {
      setIsSaving(false)
    }
  }, [saveFn])

  return { lastSaved, isSaving, isOffline, manualSave }
}
