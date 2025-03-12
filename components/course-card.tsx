import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Clock, DollarSign, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Course } from "@/lib/notion"

interface CourseCardProps {
  course: Course & {
    icon?: React.ReactNode
  }
}

export function CourseCard({ course }: CourseCardProps) {
  const isFinished = course.status === "Finished"

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-video relative overflow-hidden">
        <Image
          src={course.image || "/placeholder.svg"}
          alt={course.title}
          fill
          className="object-cover transition-transform hover:scale-105"
        />
        {isFinished && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <Badge variant="destructive" className="text-sm">
              Course Finished
            </Badge>
          </div>
        )}
      </div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {course.icon}
            {course.title}
          </CardTitle>
          <Badge variant={isFinished ? "outline" : "default"}>{course.status}</Badge>
        </div>
        <CardDescription>{course.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span>${course.price}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" disabled={isFinished}>
          <Link href={`/courses/${course.id}`}>
            {isFinished ? (
              <span className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Not Available
              </span>
            ) : (
              "View Course"
            )}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

