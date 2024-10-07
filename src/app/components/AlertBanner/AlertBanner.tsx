import React from 'react'
import { Alert, AlertDescription, AlertTitle } from '@components/ui/alert'
import { AlertCircle } from 'lucide-react'

interface AlertBannerProps {
  title: string
  description: string
}

const AlertBanner: React.FC<AlertBannerProps> = ({ title, description }) => {
  return (
    <div className="container mx-auto px-4 py-4 md:py-6">
      <Alert variant="default" className="border-red-500 bg-red-950 text-red-100">
        <AlertCircle className="h-4 w-4 !text-red-500" />
        <AlertTitle className="text-lg font-semibold mb-2">{title}</AlertTitle>
        <AlertDescription className="text-sm">{description}</AlertDescription>
      </Alert>
    </div>
  )
}

export default AlertBanner
