import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Power, Settings, Zap, Thermometer } from "lucide-react"

export default function ControllerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Controller</h1>
        <p className="text-muted-foreground">Manage system controls and configurations.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Power className="h-5 w-5" />
              System Power
            </CardTitle>
            <CardDescription>Control main system power state</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="system-power">Main Power</Label>
              <Switch id="system-power" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="backup-power">Backup Power</Label>
              <Switch id="backup-power" />
            </div>
            <Button className="w-full" variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Advanced Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5" />
              Temperature Control
            </CardTitle>
            <CardDescription>Adjust system temperature settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Target Temperature: 22°C</Label>
              <Slider defaultValue={[22]} max={30} min={15} step={1} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-temp">Auto Adjust</Label>
              <Switch id="auto-temp" defaultChecked />
            </div>
            <div className="text-sm text-muted-foreground">Current: 21°C | Humidity: 45%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Performance
            </CardTitle>
            <CardDescription>System performance controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>CPU Usage: 65%</Label>
              <Slider defaultValue={[65]} max={100} min={0} step={1} disabled />
            </div>
            <div className="space-y-2">
              <Label>Memory Usage: 42%</Label>
              <Slider defaultValue={[42]} max={100} min={0} step={1} disabled />
            </div>
            <Button className="w-full" variant="outline">
              Optimize Performance
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common system operations</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button className="w-full justify-start">Restart System</Button>
            <Button className="w-full justify-start" variant="outline">
              Run Diagnostics
            </Button>
            <Button className="w-full justify-start" variant="outline">
              Clear Cache
            </Button>
            <Button className="w-full justify-start" variant="outline">
              Update Firmware
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system health and status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">System Health</span>
              <span className="text-sm font-medium text-green-600">Excellent</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Last Maintenance</span>
              <span className="text-sm text-muted-foreground">2 days ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Uptime</span>
              <span className="text-sm text-muted-foreground">15 days, 4 hours</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Next Scheduled Maintenance</span>
              <span className="text-sm text-muted-foreground">In 5 days</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
