// Define the Course interface
export interface Course {
  id: string
  title: string
  description: string
  longDescription: string
  image: string
  duration: string
  status: "Active" | "Finished"
  price: number
  highlights: string[]
}

// Create a function to get mock courses (fallback)
export function getMockCourses(): Course[] {
  return [
    {
      id: "vibe-coding",
      title: "Vibe Coding",
      description: "Learn to code with the right aesthetic and mindset. Blend programming with artistic expression.",
      longDescription:
        "A comprehensive course on coding with style and purpose. Learn to create beautiful, functional code that expresses your unique perspective.",
      image: "/placeholder.svg?height=400&width=600",
      duration: "8 weeks",
      status: "Active",
      price: 199,
      highlights: [
        "Aesthetic-driven development",
        "Creative coding principles",
        "Building beautiful interfaces",
        "Finding your coding style",
      ],
    },
    {
      id: "stable-diffusion",
      title: "Stable Diffusion Mastery",
      description: "Create stunning AI-generated art with stable diffusion. From prompts to fine-tuning models.",
      longDescription:
        "Master the art of AI image generation with Stable Diffusion. Learn prompt engineering, model fine-tuning, and how to create consistent styles.",
      image: "/placeholder.svg?height=400&width=600",
      duration: "6 weeks",
      status: "Active",
      price: 249,
      highlights: [
        "Prompt engineering",
        "Model fine-tuning",
        "Creating consistent styles",
        "Building an AI art portfolio",
      ],
    },
    {
      id: "tech-entrepreneurship",
      title: "Technology-Based Entrepreneurship",
      description: "Build and launch your tech startup. From idea validation to market entry strategies.",
      longDescription:
        "Learn how to turn your tech skills into a successful business. This course covers everything from idea validation to market entry strategies.",
      image: "/placeholder.svg?height=400&width=600",
      duration: "12 weeks",
      status: "Finished",
      price: 349,
      highlights: ["Idea validation", "MVP development", "Market strategies", "Fundraising techniques"],
    },
  ]
}

// Function to get courses from Notion using direct API calls
export async function getCourses(): Promise<Course[]> {
  // Check if environment variables are set
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
    console.log("Notion API key or database ID is not set, returning mock courses")
    return getMockCourses()
  }

  try {
    // Use direct fetch instead of the Notion SDK
    const response = await fetch(`https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Notion API error:", errorData)
      return getMockCourses()
    }

    const data = await response.json()

    if (!data.results || data.results.length === 0) {
      console.log("No results found in Notion database, returning mock courses")
      return getMockCourses()
    }

    // Map the results to our Course interface
    const courses = data.results.map((page: any) => {
      try {
        // Extract properties safely with fallbacks
        const properties = page.properties || {}

        // Extract title
        let title = "Untitled Course"
        try {
          if (properties.Title?.title?.length > 0) {
            title = properties.Title.title[0].plain_text
          } else if (properties.Name?.title?.length > 0) {
            title = properties.Name.title[0].plain_text
          }
        } catch (e) {
          console.error("Error extracting title:", e)
        }

        // Extract description
        let description = "No description available"
        try {
          if (properties.Description?.rich_text?.length > 0) {
            description = properties.Description.rich_text[0].plain_text
          }
        } catch (e) {
          console.error("Error extracting description:", e)
        }

        // Extract image
        let imageUrl = "/placeholder.svg?height=600&width=1200"
        try {
          if (properties.Image?.files?.length > 0) {
            const file = properties.Image.files[0]
            if (file.file?.url) {
              imageUrl = file.file.url
            } else if (file.external?.url) {
              imageUrl = file.external.url
            }
          } else if (properties.Image?.url) {
            imageUrl = properties.Image.url
          }
        } catch (e) {
          console.error("Error extracting image:", e)
        }

        // Extract duration
        let duration = "8 weeks"
        try {
          if (properties.Duration?.rich_text?.length > 0) {
            duration = properties.Duration.rich_text[0].plain_text
          } else if (properties.Duration?.select?.name) {
            duration = properties.Duration.select.name
          }
        } catch (e) {
          console.error("Error extracting duration:", e)
        }

        // Extract status
        let status: "Active" | "Finished" = "Active"
        try {
          if (properties.Status?.select?.name === "Finished") {
            status = "Finished"
          }
        } catch (e) {
          console.error("Error extracting status:", e)
        }

        // Extract price
        let price = 199
        try {
          if (properties.Price?.number !== undefined && properties.Price.number !== null) {
            price = properties.Price.number
          }
        } catch (e) {
          console.error("Error extracting price:", e)
        }

        // Extract highlights
        let highlights: string[] = [
          "Learn from industry experts",
          "Hands-on practical exercises",
          "Certificate of completion",
          "Access to exclusive community",
        ]
        try {
          if (properties.Highlights?.multi_select?.length > 0) {
            highlights = properties.Highlights.multi_select.map((item: any) => item.name)
          } else if (properties.Highlights?.rich_text?.length > 0) {
            const highlightsText = properties.Highlights.rich_text[0].plain_text
            if (highlightsText) {
              highlights = highlightsText.split("\n").filter(Boolean)
            }
          }
        } catch (e) {
          console.error("Error extracting highlights:", e)
        }

        return {
          id: page.id,
          title,
          description,
          longDescription: description,
          image: imageUrl,
          duration,
          status,
          price,
          highlights,
        }
      } catch (error) {
        console.error("Error processing Notion page:", error)
        // Return a default course if there's an error processing a specific page
        return {
          id: page.id || "error-course",
          title: "Error Loading Course",
          description: "There was an error loading this course.",
          longDescription: "There was an error loading this course.",
          image: "/placeholder.svg?height=400&width=600",
          duration: "Unknown",
          status: "Active",
          price: 0,
          highlights: ["Course information unavailable"],
        }
      }
    })

    console.log("Successfully processed", courses.length, "courses from Notion")
    return courses
  } catch (error) {
    console.error("Error fetching courses from Notion:", error)
    // Return mock courses if there's an error
    return getMockCourses()
  }
}

// Function to get a course by ID
export async function getCourseById(id: string): Promise<Course | null> {
  // Check if it's one of our mock course IDs
  const mockCourses = getMockCourses()
  const mockCourse = mockCourses.find((course) => course.id === id)

  // If it's a mock course ID or if environment variables aren't set, return the mock course
  if (mockCourse || !process.env.NOTION_API_KEY) {
    return mockCourse || null
  }

  try {
    // Use direct fetch instead of the Notion SDK
    const response = await fetch(`https://api.notion.com/v1/pages/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Notion API error:", errorData)
      return null
    }

    const page = await response.json()

    // Extract properties safely with fallbacks
    const properties = page.properties || {}

    // Extract title
    let title = "Untitled Course"
    try {
      if (properties.Title?.title?.length > 0) {
        title = properties.Title.title[0].plain_text
      } else if (properties.Name?.title?.length > 0) {
        title = properties.Name.title[0].plain_text
      }
    } catch (e) {
      console.error("Error extracting title:", e)
    }

    // Extract description
    let description = "No description available"
    try {
      if (properties.Description?.rich_text?.length > 0) {
        description = properties.Description.rich_text[0].plain_text
      }
    } catch (e) {
      console.error("Error extracting description:", e)
    }

    // Extract image
    let imageUrl = "/placeholder.svg?height=600&width=1200"
    try {
      if (properties.Image?.files?.length > 0) {
        const file = properties.Image.files[0]
        if (file.file?.url) {
          imageUrl = file.file.url
        } else if (file.external?.url) {
          imageUrl = file.external.url
        }
      } else if (properties.Image?.url) {
        imageUrl = properties.Image.url
      }
    } catch (e) {
      console.error("Error extracting image:", e)
    }

    // Extract duration
    let duration = "8 weeks"
    try {
      if (properties.Duration?.rich_text?.length > 0) {
        duration = properties.Duration.rich_text[0].plain_text
      } else if (properties.Duration?.select?.name) {
        duration = properties.Duration.select.name
      }
    } catch (e) {
      console.error("Error extracting duration:", e)
    }

    // Extract status
    let status: "Active" | "Finished" = "Active"
    try {
      if (properties.Status?.select?.name === "Finished") {
        status = "Finished"
      }
    } catch (e) {
      console.error("Error extracting status:", e)
    }

    // Extract price
    let price = 199
    try {
      if (properties.Price?.number !== undefined && properties.Price.number !== null) {
        price = properties.Price.number
      }
    } catch (e) {
      console.error("Error extracting price:", e)
    }

    // Extract highlights
    let highlights: string[] = [
      "Learn from industry experts",
      "Hands-on practical exercises",
      "Certificate of completion",
      "Access to exclusive community",
    ]
    try {
      if (properties.Highlights?.multi_select?.length > 0) {
        highlights = properties.Highlights.multi_select.map((item: any) => item.name)
      } else if (properties.Highlights?.rich_text?.length > 0) {
        const highlightsText = properties.Highlights.rich_text[0].plain_text
        if (highlightsText) {
          highlights = highlightsText.split("\n").filter(Boolean)
        }
      }
    } catch (e) {
      console.error("Error extracting highlights:", e)
    }

    // Get page content for long description
    let longDescription = description
    try {
      const blocksResponse = await fetch(`https://api.notion.com/v1/blocks/${id}/children`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
          "Notion-Version": "2022-06-28",
        },
      })

      if (blocksResponse.ok) {
        const blocksData = await blocksResponse.json()
        if (blocksData.results && blocksData.results.length > 0) {
          // Extract text from paragraph blocks
          const paragraphs = blocksData.results
            .filter((block: any) => block.type === "paragraph")
            .map((block: any) => {
              try {
                return block.paragraph.rich_text.map((text: any) => text.plain_text).join("")
              } catch (e) {
                return ""
              }
            })
            .filter(Boolean)

          if (paragraphs.length > 0) {
            longDescription = paragraphs.join("\n\n")
          }
        }
      }
    } catch (e) {
      console.error("Error fetching page content:", e)
    }

    return {
      id: page.id,
      title,
      description,
      longDescription,
      image: imageUrl,
      duration,
      status,
      price,
      highlights,
    }
  } catch (error) {
    console.error(`Error fetching course with ID ${id} from Notion:`, error)

    // If direct retrieval fails, try to find it in all courses
    try {
      const courses = await getCourses()
      return courses.find((course) => course.id === id) || null
    } catch (fallbackError) {
      console.error("Fallback error:", fallbackError)
      return null
    }
  }
}

