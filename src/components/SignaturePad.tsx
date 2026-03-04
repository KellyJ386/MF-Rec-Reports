import { useRef, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, RotateCcw } from 'lucide-react'

interface SignaturePadProps {
  value?: string
  onChange?: (dataUrl: string | null) => void
  label?: string
  required?: boolean
}

export function SignaturePad({
  value,
  onChange,
  label = 'Signature',
  required = false,
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(!!value)
  const [confirmed, setConfirmed] = useState(!!value)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    // Background
    ctx.fillStyle = '#fafafa'
    ctx.fillRect(0, 0, rect.width, rect.height)

    // Signature line
    ctx.strokeStyle = '#d1d5db'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(20, rect.height - 30)
    ctx.lineTo(rect.width - 20, rect.height - 30)
    ctx.stroke()
    ctx.fillStyle = '#9ca3af'
    ctx.font = '11px sans-serif'
    ctx.fillText('Sign here', 20, rect.height - 14)
    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = 2

    if (value) {
      const img = new Image()
      img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height)
      img.src = value
    }
  }, [])

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    setIsDrawing(true)
    setHasDrawn(true)
    setConfirmed(false)
    const { x, y } = getPos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (!isDrawing) return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const { x, y } = getPos(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDraw = () => setIsDrawing(false)

  const clear = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)
    ctx.fillStyle = '#fafafa'
    ctx.fillRect(0, 0, rect.width, rect.height)
    ctx.strokeStyle = '#d1d5db'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(20, rect.height - 30)
    ctx.lineTo(rect.width - 20, rect.height - 30)
    ctx.stroke()
    ctx.fillStyle = '#9ca3af'
    ctx.font = '11px sans-serif'
    ctx.fillText('Sign here', 20, rect.height - 14)
    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = 2
    setHasDrawn(false)
    setConfirmed(false)
    onChange?.(null)
  }

  const confirm = () => {
    const dataUrl = canvasRef.current?.toDataURL('image/png')
    setConfirmed(true)
    onChange?.(dataUrl || null)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            {label}{required && <span className="text-destructive ml-1">*</span>}
          </CardTitle>
          {confirmed && (
            <span className="text-xs text-green-600 font-medium flex items-center gap-1">
              <Check className="h-3 w-3" /> Signed
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="border-2 rounded-lg overflow-hidden touch-none">
          <canvas
            ref={canvasRef}
            style={{ width: '100%', height: 150, cursor: 'crosshair', display: 'block' }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={stopDraw}
          />
        </div>
        <div className="flex gap-2 mt-3">
          <Button type="button" variant="outline" size="sm" onClick={clear} disabled={!hasDrawn}>
            <RotateCcw className="mr-2 h-4 w-4" /> Clear
          </Button>
          <Button type="button" size="sm" onClick={confirm} disabled={!hasDrawn || confirmed}>
            <Check className="mr-2 h-4 w-4" /> Confirm Signature
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
