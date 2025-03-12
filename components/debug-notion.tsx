"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface DebugNotionProps {
  apiKey?: string
  databaseId?: string
}

export function DebugNotion({ apiKey, databaseId }: DebugNotionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testConnection = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/notion-test")
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({ error: "Failed to test connection" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button variant="outline" size="sm" onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? "Hide Debug" : "Debug Notion"}
      </Button>

      {isVisible && (
        <Card className="mt-2 w-80">
          <CardHeader>
            <CardTitle>Notion API Debug</CardTitle>
            <CardDescription>Check your Notion API configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <p className="font-medium">API Key:</p>
              <p className="font-mono break-all">{apiKey ? `${apiKey.substring(0, 8)}...` : "Not set"}</p>
            </div>
            <div>
              <p className="font-medium">Database ID:</p>
              <p className="font-mono break-all">{databaseId || "Not set"}</p>
            </div>

            {testResult && (
              <div className="mt-4 p-2 rounded bg-muted">
                <p className="font-medium">Test Result:</p>
                <pre className="text-xs overflow-auto max-h-40">{JSON.stringify(testResult, null, 2)}</pre>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-xs text-muted-foreground">Make sure both values are set correctly.</p>
            <Button variant="secondary" size="sm" onClick={testConnection} disabled={isLoading}>
              {isLoading ? "Testing..." : "Test Connection"}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

