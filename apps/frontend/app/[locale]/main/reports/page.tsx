'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, TrendingUp, Zap, DollarSign, PiggyBank } from "lucide-react";
import { useTranslations } from 'next-intl';

// 固定數據
const STATIC_DATA = {
  monthlyUsage: 60000,
  averagePrice: 3.3,
  savings: {
    amount: 15000,
    percentage: 6.1
  },
  monthlyTotalCost: 245000
};

export default function ReportsPage() {
  const t = useTranslations('main.report');

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              {t('monthlyUsage')}
            </CardTitle>
            <CardDescription>
              {t('totalUsage')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{STATIC_DATA.monthlyUsage.toLocaleString()} kWh</p>
                <p className="text-sm text-muted-foreground">
                  {t('comparedToLastYear')} -7.7%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              {t('averagePrice')}
            </CardTitle>
            <CardDescription>
              {t('pricePerUnit')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">${STATIC_DATA.averagePrice}</p>
                <p className="text-sm text-muted-foreground">
                  {t('comparedToLastYear')} 0%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-blue-500" />
              {t('savings')}
            </CardTitle>
            <CardDescription>
              {t('comparedToLastYear')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">${STATIC_DATA.savings.amount.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">
                  {t('comparedToLastYear')} {STATIC_DATA.savings.percentage}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-red-500" />
              {t('monthlyExpense')}
            </CardTitle>
            <CardDescription>
              {t('totalExpense')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">${STATIC_DATA.monthlyTotalCost.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">
                  {t('comparedToLastYear')} -6.1%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('quarterlyReports')}</CardTitle>
          <CardDescription>{t('quarterlyReports2024')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { quarter: 'q1Report', date: '2024/03/31' },
              { quarter: 'q2Report', date: '2024/06/30' },
              { quarter: 'q3Report', date: '2024/09/30' },
              { quarter: 'q4Report', date: '2024/12/31' }
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{t(report.quarter)}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('generatedOn')} {report.date}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            {t('aiSuggestions')}
          </CardTitle>
          <CardDescription>
            {t('basedOnAnalysis')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-lg">
              {t('peakHours')}
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>{t('suggestions.ac')}</li>
              <li>{t('suggestions.charging')}</li>
              <li>{t('suggestions.solar')}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
