import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if environment variables are set
    if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
      return NextResponse.json(
        {
          error: "Notion API key or database ID is not set",
          apiKeySet: !!process.env.NOTION_API_KEY,
          databaseIdSet: !!process.env.NOTION_DATABASE_ID,
        },
        { status: 500 },
      )
    }

    // Test the Notion API connection
    try {
      const response = await fetch(`https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
          "Notion-Version": "2022-06-28",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        return NextResponse.json(
          {
            error: "Failed to connect to Notion API",
            details: errorData,
            apiKeySet: true,
            databaseIdSet: true,
          },
          { status: 500 },
        )
      }

      const data = await response.json()

      return NextResponse.json({
        success: true,
        apiKeySet: true,
        apiKeyPrefix: process.env.NOTION_API_KEY.substring(0, 4) + "...",
        databaseId: process.env.NOTION_DATABASE_ID,
        databaseTitle: data.title?.[0]?.plain_text || "Unknown Database",
      })
    } catch (apiError) {
      return NextResponse.json(
        {
          error: "Error testing Notion API connection",
          message: apiError instanceof Error ? apiError.message : "Unknown error",
          apiKeySet: true,
          databaseIdSet: true,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error testing Notion connection",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

