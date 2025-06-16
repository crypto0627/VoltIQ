import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Battery, Zap, Leaf } from "lucide-react";

// 假數據
const MOCK_DATA = {
  drSavings: {
    amount: 34000,
    percentage: 12.5
  },
  electricity: {
    amount: 5000,
    percentage: 15.2
  },
  batteryArbitrage: {
    amount: 12500,
    percentage: 8.3
  },
  carbonReduction: {
    amount: 2500,
    percentage: 18.7
  }
};

export function SaveMoney() {
  return (
    <div className="flex flex-col">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">總節省金額</CardTitle>
          <div className="relative group">
            <DollarSign className="h-6 w-6 text-gold transition-all duration-1000 animate-mirror group-hover:animate-none hover:text-gold-light" />
            <div className="absolute inset-0 bg-gradient-to-r from-gold-light/20 to-gold-dark/20 blur-sm rounded-full" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$NT {MOCK_DATA.drSavings.amount + MOCK_DATA.batteryArbitrage.amount}</div>
          <p className="text-xs text-muted-foreground">
            {(MOCK_DATA.drSavings.percentage + MOCK_DATA.batteryArbitrage.percentage) / 2}% 相較去年同期
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-0.5">
        <Card className="w-full flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">需量反應 節省金額</CardTitle>
            <div className="relative group">
              <DollarSign className="h-6 w-6 text-gold transition-all duration-1000 animate-mirror group-hover:animate-none hover:text-gold-light" />
              <div className="absolute inset-0 bg-gradient-to-r from-gold-light/20 to-gold-dark/20 blur-sm rounded-full" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$NT {MOCK_DATA.drSavings.amount}</div>
            <p className="text-xs text-muted-foreground">
              {MOCK_DATA.drSavings.percentage}% 相較去年同期
            </p>
          </CardContent>
        </Card>

        <Card className="w-full flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">節省電量</CardTitle>
            <Zap className="h-6 w-6 text-yellow-500 hover:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_DATA.electricity.amount} kWh</div>
            <p className="text-xs text-muted-foreground">
              {MOCK_DATA.electricity.percentage}% 相較去年同期
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-0.5">
        <Card className="w-full flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">儲能套利收益</CardTitle>
            <Battery className="h-6 w-6 text-blue-500 hover:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$NT {MOCK_DATA.batteryArbitrage.amount}</div>
            <p className="text-xs text-muted-foreground">
              {MOCK_DATA.batteryArbitrage.percentage}% 相較去年同期
            </p>
          </CardContent>
        </Card>

        <Card className="w-full flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ESG 碳排減量</CardTitle>
            <Leaf className="h-6 w-6 text-green-500 hover:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_DATA.carbonReduction.amount} kg</div>
            <p className="text-xs text-muted-foreground">
              {MOCK_DATA.carbonReduction.percentage}% 相較去年同期
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
