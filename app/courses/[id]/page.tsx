import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Clock, DollarSign, ArrowLeft, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { PurchaseForm } from "@/components/purchase-form"
import { getCourseById, getCourses } from "@/lib/notion"
import type { Metadata } from "next"

export const revalidate = 3600 // Revalidate every hour

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const course = await getCourseById(params.id)

    if (!course) {
      return {
        title: "Course Not Found - Hackers & Painters",
      }
    }

    return {
      title: `${course.title} - Hackers & Painters`,
      description: course.description,
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Course Details - Hackers & Painters",
    }
  }
}

// Generate static params for known course IDs
export async function generateStaticParams() {
  try {
    const courses = await getCourses()
    return courses.map((course) => ({
      id: course.id,
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

export default async function CoursePage({ params }: { params: { id: string } }) {
  let course
  let error = null

  try {
    course = await getCourseById(params.id)

    if (!course) {
      notFound()
    }
  } catch (err) {
    console.error("Error in course page:", err)
    error = err instanceof Error ? err.message : "Unknown error"
    notFound()
  }

  const isFinished = course.status === "Finished"

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <div className="relative h-[40vh] min-h-[300px] w-full">
          <Image src={course.image || "/placeholder.svg"} alt={course.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="container">
              <Badge className="mb-2">{course.duration}</Badge>
              <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">{course.title}</h1>
            </div>
          </div>
        </div>

        <section className="container py-8 md:py-12">
          {error && (
            <div className="mb-8 rounded-md bg-destructive/10 p-4 text-destructive">
              <p className="font-medium">Error loading course details</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold">About this Course</h2>
                <div className="mt-4 space-y-4 text-muted-foreground">
                  {course.longDescription.split("\n\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold">What You'll Learn</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {course.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="mt-1 rounded-full bg-primary/10 p-1">
                        <svg
                          className="h-4 w-4 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="md:sticky md:top-24 h-fit">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-xl font-bold">${course.price}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant={isFinished ? "destructive" : "default"}>{course.status}</Badge>
                  </div>

                  {isFinished ? (
                    <div className="rounded-md bg-destructive/10 p-4 text-center text-destructive">
                      <AlertCircle className="mx-auto h-6 w-6 mb-2" />
                      <p className="font-medium">This course has ended</p>
                      <p className="text-sm mt-1">No longer accepting new students</p>
                    </div>
                  ) : (
                    <PurchaseForm courseId={course.id} price={course.price} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} Hackers & Painters. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

