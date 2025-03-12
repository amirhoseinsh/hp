"use client"

import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function EnvStatus() {
  const [showStatus, setShowStatus] = useState(false)
  const [apiKeySet, setApiKeySet] = useState(false)
  const [databaseIdSet, setDatabaseIdSet] = useState(false)

  useEffect(() => {
    // Check if environment variables are set
    const checkEnv = async () => {
      try {
        const response = await fetch("/api/notion-test")
        const data = await response.json()
        setApiKeySet(data.apiKeySet)
        setDatabaseIdSet(data.databaseIdSet)
        setShowStatus(true)
      } catch (error) {
        console.error("Error checking environment variables:", error)
      }
    }

    checkEnv()
  }, [])

  if (!showStatus) {
    return null
  }

  if (apiKeySet && databaseIdSet) {
    return null // Don't show anything if both are set
  }

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Environment Variables Missing</AlertTitle>
      <AlertDescription>
        <div className="mt-2">
          <p className="flex items-center gap-2">
            {apiKeySet ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4" />}
            NOTION_API_KEY: {apiKeySet ? "Set" : "Not set"}
          </p>
          <p className="flex items-center gap-2 mt-1">
            {databaseIdSet ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4" />}
            NOTION_DATABASE_ID: {databaseIdSet ? "Set" : "Not set"}
          </p>
          <p className="mt-2 text-sm">Please make sure both environment variables are set correctly.</p>
        </div>
      </AlertDescription>
    </Alert>
  )
}

