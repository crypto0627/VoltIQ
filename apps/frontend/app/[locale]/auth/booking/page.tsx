"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function BookingPage() {
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [otherInterest, setOtherInterest] = useState("");
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Create mailto link with form data
      const mailtoLink = `mailto:jake.kuo@fortune.com.tw?subject=New Demo Booking Request from 表後系統&body=Company Name: ${companyName}%0D%0AJob Title: ${jobTitle}%0D%0AName: ${name}%0D%0AEmail: ${email}%0D%0AInterest: ${interest === "other" ? otherInterest : interest}`;
      
      // Open default email client
      window.location.href = mailtoLink;
      
      // Show success modal
      setShowSuccessModal(true);
      
      // Reset form
      setCompanyName("");
      setJobTitle("");
      setName("");
      setEmail("");
      setInterest("");
      setOtherInterest("");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Book a Demo</CardTitle>
            <CardDescription>
              Fill out the form below to schedule a demo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="Enter your company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  placeholder="Enter your job title"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interest">Interest</Label>
                <Select
                  value={interest}
                  onValueChange={setInterest}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your interest" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">Interested in Technology</SelectItem>
                    <SelectItem value="product">Interested in Product</SelectItem>
                    <SelectItem value="demo">Just Want to See the Product</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {interest === "other" && (
                <div className="space-y-2">
                  <Label htmlFor="otherInterest">Please specify</Label>
                  <Input
                    id="otherInterest"
                    placeholder="Enter your interest"
                    value={otherInterest}
                    onChange={(e) => setOtherInterest(e.target.value)}
                    required
                  />
                </div>
              )}
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
            <div className="text-center">
              <Button asChild variant="link">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right side - Logo and Background */}
      <div className="flex-1 bg-gradient-to-br from-primary/20 via-primary/10 to-background flex items-center justify-center p-8">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center">
            <Image src="/logo.png" alt="Logo" width={400} height={100} />
          </div>
          <p className="text-xl text-muted-foreground max-w-md">
            Next-Gen Energy Intelligence Platform
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-md text-sm">
            <div className="p-4 rounded-lg bg-card/50 backdrop-blur-sm">
              <div className="font-semibold">Predictive Analytics</div>
              <div className="text-muted-foreground">
                Forecast energy usage with 95% accuracy
              </div>
            </div>
            <div className="p-4 rounded-lg bg-card/50 backdrop-blur-sm">
              <div className="font-semibold">Carbon Footprint Tracking</div>
              <div className="text-muted-foreground">
                Monitor and optimize your environmental impact
              </div>
            </div>
            <div className="p-4 rounded-lg bg-card/50 backdrop-blur-sm">
              <div className="font-semibold">Smart Grid Integration</div>
              <div className="text-muted-foreground">
                Seamless connection with IoT devices
              </div>
            </div>
            <div className="p-4 rounded-lg bg-card/50 backdrop-blur-sm">
              <div className="font-semibold">Energy Optimization</div>
              <div className="text-muted-foreground">
                AI-driven cost and efficiency improvements
              </div>
            </div>
          </div>
        </div>
      </div>

      <ThemeToggle />

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Successful!</DialogTitle>
          </DialogHeader>
          <p>Your demo request has been sent successfully. We will contact you shortly.</p>
          <Button onClick={() => setShowSuccessModal(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
