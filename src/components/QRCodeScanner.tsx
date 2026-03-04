import { useState, useRef, useCallback, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { QrCode, Camera, X, Search } from 'lucide-react'

interface QRCodeScannerProps {
  onScan?: (code: string) => void
  onManualEntry?: (code: string) => void
}

export function QRCodeScanner({ onScan, onManualEntry }: QRCodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedCode, setScannedCode] = useState<string | null>(null)
  const [manualCode, setManualCode] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setIsScanning(true)
    } catch {
      alert('Camera access is required for QR scanning. Please allow camera access.')
    }
  }

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
  }

  const handleManualEntry = () => {
    if (manualCode.trim()) {
      setScannedCode(manualCode.trim())
      onManualEntry?.(manualCode.trim())
      setManualCode('')
    }
  }

  // Simulate QR scan (in real implementation, use a QR library)
  const simulateScan = () => {
    const demoCode = `EQ-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    setScannedCode(demoCode)
    onScan?.(demoCode)
    stopScanning()
  }

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          QR Code Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scanner View */}
        {isScanning ? (
          <div className="space-y-4">
            <div className="relative aspect-square max-w-sm mx-auto bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              {/* Scan overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-white/80 rounded-lg">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg" />
                </div>
              </div>
              <p className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
                Point camera at QR code
              </p>
            </div>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={stopScanning}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={simulateScan}>
                Simulate Scan (Demo)
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Button onClick={startScanning} className="w-full" size="lg">
              <Camera className="mr-2 h-5 w-5" />
              Scan QR Code
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  or enter manually
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Enter equipment ID..."
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleManualEntry()}
              />
              <Button variant="outline" onClick={handleManualEntry}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Scanned Result */}
        {scannedCode && (
          <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <QrCode className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <p className="text-sm font-medium">Equipment Found</p>
              <p className="text-xs text-muted-foreground font-mono">{scannedCode}</p>
            </div>
            <Badge variant="success">Scanned</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
