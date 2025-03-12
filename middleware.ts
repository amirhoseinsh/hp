import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Only log in development
  if (process.env.NODE_ENV === "development") {
    // Log environment variables status
    console.log("Environment variables check:")
    console.log("- NOTION_API_KEY:", process.env.NOTION_API_KEY ? "Set" : "Not set")
    console.log("- NOTION_DATABASE_ID:", process.env.NOTION_DATABASE_ID ? "Set" : "Not set")
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/"],
}

