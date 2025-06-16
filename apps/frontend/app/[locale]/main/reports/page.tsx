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
import { memo } from 'react';

// 固定數據
const STATIC_DATA = {
  monthlyUsage: 60000,
  averagePrice: 3.3,
  savings: {
    amount: 15000,
    percentage: 6.1
  },
  monthlyTotalCost: 245000
} as const;

// 抽離卡片組件以提高可重用性
const StatCard = memo(({ 
  icon: Icon, 
  title, 
  description, 
  value, 
  comparison, 
  iconColor 
}: {
  icon: any;
  title: string;
  description: string;
  value: string | number;
  comparison: string;
  iconColor: string;
}) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center gap-2">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        {title}
      </CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{comparison}</p>
        </div>
      </div>
    </CardContent>
  </Card>
));

StatCard.displayName = 'StatCard';

// 抽離季度報告組件
const QuarterlyReports = memo(({ t }: { t: (key: string) => string }) => {
  const reports = [
    { quarter: 'q1Report', date: '2024/03/31' },
    { quarter: 'q2Report', date: '2024/06/30' },
    { quarter: 'q3Report', date: '2024/09/30' },
    { quarter: 'q4Report', date: '2024/12/31' }
  ] as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('quarterlyReports')}</CardTitle>
        <CardDescription>{t('quarterlyReports2024')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reports.map((report, index) => (
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
  );
});

QuarterlyReports.displayName = 'QuarterlyReports';

// 抽離AI建議組件
const AISuggestions = memo(({ t }: { t: (key: string) => string }) => (
  <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-blue-500" />
        {t('aiSuggestions')}
      </CardTitle>
      <CardDescription>{t('basedOnAnalysis')}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <p className="text-lg">{t('peakHours')}</p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>{t('suggestions.ac')}</li>
          <li>{t('suggestions.charging')}</li>
          <li>{t('suggestions.solar')}</li>
        </ul>
      </div>
    </CardContent>
  </Card>
));

AISuggestions.displayName = 'AISuggestions';

export default function ReportsPage() {
  const t = useTranslations('main.report');

  return (
    <div className="space-y-1">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Zap}
          title={t('monthlyUsage')}
          description={t('totalUsage')}
          value={`${STATIC_DATA.monthlyUsage.toLocaleString()} kWh`}
          comparison={`${t('comparedToLastYear')} -7.7%`}
          iconColor="text-yellow-500"
        />
        <StatCard
          icon={PiggyBank}
          title={t('savings')}
          description={t('comparedToLastYear')}
          value={`$${STATIC_DATA.savings.amount.toLocaleString()}`}
          comparison={`${t('comparedToLastYear')} ${STATIC_DATA.savings.percentage}%`}
          iconColor="text-blue-500"
        />
        <StatCard
          icon={FileText}
          title={t('monthlyExpense')}
          description={t('totalExpense')}
          value={`$${STATIC_DATA.monthlyTotalCost.toLocaleString()}`}
          comparison={`${t('comparedToLastYear')} -6.1%`}
          iconColor="text-red-500"
        />
        <StatCard
          icon={DollarSign}
          title={t('averagePrice')}
          description={t('pricePerUnit')}
          value={`$${STATIC_DATA.averagePrice}`}
          comparison={`${t('comparedToLastYear')} 0%`}
          iconColor="text-green-500"
      />
      </div>

      <QuarterlyReports t={t} />
      <AISuggestions t={t} />
    </div>
  );
}
