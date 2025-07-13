import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, ArrowLeft, Search, FileQuestion, Compass } from 'lucide-react'

function NotFound() {
  const handleGoHome = () => {
    window.location.href = '/'
  }

  const handleGoBack = () => {
    window.history.back()
  }

  const handleGoToDashboard = () => {
    window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl border-0">
        <CardContent className="p-8 md:p-12 text-center">
          {/* Animated 404 Icon */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-pulse"></div>
            </div>
            <div className="relative">
              <FileQuestion className="w-20 h-20 text-blue-600 mx-auto mb-4 animate-bounce" />
              <div className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 tracking-wider">
                404
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8 space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Oops! Page Not Found
            </h1>
            <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
              The page you're looking for seems to have wandered off. 
              Don't worry, even the best explorers sometimes take a wrong turn!
            </p>
          </div>

          {/* Helpful Suggestions */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg border">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center justify-center gap-2">
              <Compass className="w-5 h-5" />
              Here's what you can do:
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Check the URL for any typos</li>
              <li>• Use the navigation menu to find what you're looking for</li>
              <li>• Go back to the previous page</li>
              <li>• Start fresh from the homepage</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleGoHome}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              <Home className="w-4 h-4" />
              Go to Homepage
            </Button>
            
            <Button 
              onClick={handleGoBack}
              variant="outline"
              className="flex items-center gap-2 border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
            
            <Button 
              onClick={handleGoToDashboard}
              variant="outline"
              className="flex items-center gap-2 border-purple-300 text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-lg transition-all duration-200"
            >
              <Search className="w-4 h-4" />
              Dashboard
            </Button>
          </div>

          {/* Footer Message */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help? <span className="text-blue-600 hover:text-blue-700 cursor-pointer underline">Contact support</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default NotFound