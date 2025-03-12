export function getEnvVariable(key: string): string | undefined {
  // Try to get from process.env
  const value = process.env[key]

  if (value) {
    return value
  }

  // For client-side, try to get from window.ENV if it exists
  if (typeof window !== "undefined" && window.__ENV && window.__ENV[key]) {
    return window.__ENV[key]
  }

  return undefined
}

// Add this to global Window interface
declare global {
  interface Window {
    __ENV?: Record<string, string>
  }
}

