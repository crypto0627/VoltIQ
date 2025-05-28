import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Plus } from "lucide-react"

export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
          <p className="text-muted-foreground">Manage your appointments and events.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Event
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Schedule
            </CardTitle>
            <CardDescription>Your appointments for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                9:00 AM
              </div>
              <div className="flex-1">
                <p className="font-medium">Team Meeting</p>
                <p className="text-sm text-muted-foreground">Conference Room A</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                2:00 PM
              </div>
              <div className="flex-1">
                <p className="font-medium">Client Presentation</p>
                <p className="text-sm text-muted-foreground">Meeting Room B</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                4:30 PM
              </div>
              <div className="flex-1">
                <p className="font-medium">Project Review</p>
                <p className="text-sm text-muted-foreground">Virtual Meeting</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Events scheduled for this week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="text-center">
                <p className="text-sm font-medium">Dec</p>
                <p className="text-lg font-bold">28</p>
              </div>
              <div className="flex-1">
                <p className="font-medium">Year-end Review</p>
                <p className="text-sm text-muted-foreground">All day event</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="text-center">
                <p className="text-sm font-medium">Dec</p>
                <p className="text-lg font-bold">30</p>
              </div>
              <div className="flex-1">
                <p className="font-medium">Holiday Party</p>
                <p className="text-sm text-muted-foreground">6:00 PM - 10:00 PM</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="text-center">
                <p className="text-sm font-medium">Jan</p>
                <p className="text-lg font-bold">2</p>
              </div>
              <div className="flex-1">
                <p className="font-medium">Q1 Planning</p>
                <p className="text-sm text-muted-foreground">9:00 AM - 12:00 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calendar View</CardTitle>
          <CardDescription>Monthly calendar overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center text-muted-foreground border rounded-lg">
            Calendar component placeholder - Integrate with your preferred calendar library
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
