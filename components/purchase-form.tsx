"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

interface PurchaseFormProps {
  courseId: string
  price: number
}

export function PurchaseForm({ courseId, price }: PurchaseFormProps) {
  const [step, setStep] = useState<"phone" | "verification" | "payment" | "success">("phone")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call to send verification code
    setTimeout(() => {
      setIsLoading(false)
      setStep("verification")
      toast({
        title: "Verification code sent",
        description: "Please check your phone for the verification code.",
      })
    }, 1500)
  }

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call to verify code
    setTimeout(() => {
      setIsLoading(false)
      setStep("payment")
    }, 1500)
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false)
      setStep("success")
    }, 2000)
  }

  const resetForm = () => {
    setStep("phone")
    setPhoneNumber("")
    setVerificationCode("")
    setIsDialogOpen(false)
  }

  return (
    <>
      <Button className="w-full" size="lg" onClick={() => setIsDialogOpen(true)}>
        Enroll Now
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{step === "success" ? "Enrollment Successful!" : "Enroll in Course"}</DialogTitle>
            <DialogDescription>
              {step === "phone" && "Enter your phone number to receive a verification code."}
              {step === "verification" && "Enter the verification code sent to your phone."}
              {step === "payment" && "Complete your payment to enroll in the course."}
              {step === "success" && "You have successfully enrolled in the course."}
            </DialogDescription>
          </DialogHeader>

          {step === "phone" && (
            <form onSubmit={handlePhoneSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Verification Code"}
                </Button>
              </DialogFooter>
            </form>
          )}

          {step === "verification" && (
            <form onSubmit={handleVerificationSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setStep("phone")} disabled={isLoading}>
                  Back
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>
              </DialogFooter>
            </form>
          )}

          {step === "payment" && (
            <form onSubmit={handlePaymentSubmit}>
              <div className="grid gap-4 py-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between">
                      <span>Course Fee</span>
                      <span>${price.toFixed(2)}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">${price.toFixed(2)}</span>
                  </CardFooter>
                </Card>

                <div className="grid gap-2">
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input id="cardName" placeholder="John Doe" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="4242 4242 4242 4242" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" required />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setStep("verification")} disabled={isLoading}>
                  Back
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Processing..." : `Pay $${price.toFixed(2)}`}
                </Button>
              </DialogFooter>
            </form>
          )}

          {step === "success" && (
            <div className="grid gap-4 py-4">
              <div className="rounded-lg bg-primary/10 p-6 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium">Payment Successful</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  You have successfully enrolled in the course. Check your email for access details.
                </p>
              </div>
              <DialogFooter>
                <Button onClick={resetForm}>Close</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

