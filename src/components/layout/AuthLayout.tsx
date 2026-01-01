import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4">
              <span className="text-primary-foreground font-bold text-2xl">RR</span>
            </div>
            <h1 className="text-3xl font-bold">Rec Reports</h1>
            <p className="text-muted-foreground mt-2">
              Recreation Facility Operations Management
            </p>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
