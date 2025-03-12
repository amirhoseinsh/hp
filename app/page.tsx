import Link from "next/link"
import { ArrowRight, Palette, Code, Rocket } from "lucide-react"
import { CourseCard } from "@/components/course-card"
import { Button } from "@/components/ui/button"
import { getCourses } from "@/lib/notion"
import { DebugNotion } from "@/components/debug-notion"
import { EnvStatus } from "@/components/env-status"

export const revalidate = 3600 // Revalidate every hour

export default async function LandingPage() {
  // Fetch courses with error handling
  let courses = []
  let error = null

  try {
    console.log("Fetching courses from Notion...")
    courses = await getCourses()
    console.log("Fetched", courses.length, "courses")
  } catch (err) {
    console.error("Error in page component:", err)
    error = err instanceof Error ? err.message : "Unknown error"
  }

  // Fallback icons for courses
  const courseIcons = {
    "Vibe Coding": <Code className="h-5 w-5" />,
    "Stable Diffusion Mastery": <Palette className="h-5 w-5" />,
    "Technology-Based Entrepreneurship": <Rocket className="h-5 w-5" />,
  }

  // Add icons to courses
  const coursesWithIcons = courses.map((course) => ({
    ...course,
    icon: courseIcons[course.title as keyof typeof courseIcons] || <Code className="h-5 w-5" />,
  }))

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Palette className="h-6 w-6" />
            <span className="text-xl font-bold">Hackers & Painters</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#courses" className="text-sm font-medium hover:underline underline-offset-4">
              Courses
            </Link>
            <Link href="#about" className="text-sm font-medium hover:underline underline-offset-4">
              About
            </Link>
            <Link href="#contact" className="text-sm font-medium hover:underline underline-offset-4">
              Contact
            </Link>
          </nav>
          <Button asChild>
            <Link href="#courses">Explore Courses</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        {/* Environment status alert - only visible if env vars are missing */}
        <div className="container mt-4">
          <EnvStatus />
        </div>

        <section className="relative overflow-hidden py-24 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-yellow-950/20" />
          <div className="container relative z-10 grid gap-8 md:grid-cols-2 md:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Where <span className="text-primary">Art</span> Meets <span className="text-primary">Technology</span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Unlock your creative potential with our unique courses that blend artistic vision with technical
                  expertise.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="#courses">
                    Browse Courses <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg">
                  <Link href="#about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute -left-20 top-1/3 h-60 w-60 -translate-y-1/2 rounded-full bg-secondary/20 blur-3xl" />
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold">H&P</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="courses" className="py-16 md:py-24">
          <div className="container space-y-12">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Courses</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Explore our carefully crafted courses designed to blend artistic creativity with technical mastery.
              </p>
              {error && (
                <div className="mx-auto max-w-md rounded-md bg-destructive/10 p-4 text-destructive">
                  <p className="font-medium">Error loading courses from Notion</p>
                  <p className="text-sm mt-1">{error}</p>
                  <p className="text-sm mt-2">Showing fallback courses instead.</p>
                </div>
              )}
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {coursesWithIcons.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="py-16 md:py-24 bg-muted/50">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-2 md:gap-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">About Hackers & Painters</h2>
                <p className="text-muted-foreground md:text-lg">
                  Inspired by Paul Graham's essay, Hackers & Painters bridges the gap between technical expertise and
                  artistic vision. We believe the best creators are those who can blend both worlds.
                </p>
                <p className="text-muted-foreground md:text-lg">
                  Our courses are designed for the curious minds who want to explore the intersection of technology and
                  creativity, taught by experts who live at this intersection.
                </p>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <h3 className="text-2xl font-bold">Our Philosophy</h3>
                  <p className="mt-2 max-w-md text-muted-foreground">
                    "Hackers and painters have a lot in common: both are makers. Along with composers, architects, and
                    writers, what hackers and painters are trying to do is make good things."
                  </p>
                  <p className="mt-4 font-medium">— Paul Graham</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-md space-y-6 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Get in Touch</h2>
              <p className="text-muted-foreground">
                Have questions about our courses? Reach out to us and we'll get back to you as soon as possible.
              </p>
              <div className="space-y-2">
                <Button className="w-full" size="lg" asChild>
                  <Link href="mailto:info@hackersandpainters.com">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} Hackers & Painters. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Privacy
            </Link>
          </div>
        </div>
      </footer>

      {/* Debug component - only visible in development */}
      {process.env.NODE_ENV === "development" && (
        <DebugNotion apiKey={process.env.NOTION_API_KEY} databaseId={process.env.NOTION_DATABASE_ID} />
      )}
    </div>
  )
}

