import { useMemo } from "react";
import { useElectricityStore } from "@/stores/electricityStore";

// 基礎月累積值
const BASE_MONTHLY_VALUES = {
  peakUsage: 25000,
  offPeakUsage: 15000,
  midPeakUsage: 20000,
  totalUsage: 60000,
};

// 固定電價
const ELECTRICITY_RATES = {
  peak: 5.8,      // 尖峰電價
  midPeak: 3.63,  // 半尖峰電價
  offPeak: 1.58,  // 離峰電價
};

// 去年同期數據
const LAST_YEAR_VALUES = {
  peakUsage: 27000,
  offPeakUsage: 16000,
  midPeakUsage: 22000,
  totalUsage: 65000,
  totalCost: 245000,
  averagePrice: 3.3,
};

// 節省金額計算
const calculateSavings = (currentCost: number) => {
  const lastYearCost = LAST_YEAR_VALUES.totalCost;
  const savings = lastYearCost - currentCost;
  const savingsPercentage = ((savings / lastYearCost) * 100).toFixed(1);
  return {
    amount: savings,
    percentage: savingsPercentage,
  };
};

// 平均電價計算
const calculateAveragePrice = (totalCost: number, totalUsage: number) => {
  return totalUsage > 0 ? (totalCost / totalUsage).toFixed(2) : "0.00";
};

export const useUsageCalculations = () => {
  const { data, currentTimeIndex } = useElectricityStore();

  const calculateUsage = useMemo(() => {
    if (!data.length || currentTimeIndex === 0)
      return {
        peakUsage: 0,
        offPeakUsage: 0,
        midPeakUsage: 0,
        totalCost: 0,
        todayUsage: 0,
        monthlyPeakUsage: BASE_MONTHLY_VALUES.peakUsage,
        monthlyOffPeakUsage: BASE_MONTHLY_VALUES.offPeakUsage,
        monthlyMidPeakUsage: BASE_MONTHLY_VALUES.midPeakUsage,
        monthlyTotalCost: Math.round(
          BASE_MONTHLY_VALUES.offPeakUsage * ELECTRICITY_RATES.offPeak +
          BASE_MONTHLY_VALUES.midPeakUsage * ELECTRICITY_RATES.midPeak +
          BASE_MONTHLY_VALUES.peakUsage * ELECTRICITY_RATES.peak
        ),
        monthlyUsage: BASE_MONTHLY_VALUES.totalUsage,
        averagePrice: LAST_YEAR_VALUES.averagePrice,
        savings: calculateSavings(
          Math.round(
            BASE_MONTHLY_VALUES.offPeakUsage * ELECTRICITY_RATES.offPeak +
            BASE_MONTHLY_VALUES.midPeakUsage * ELECTRICITY_RATES.midPeak +
            BASE_MONTHLY_VALUES.peakUsage * ELECTRICITY_RATES.peak
          )
        ),
      };

    let peakSum = 0;
    let offPeakSum = 0;
    let midPeakSum = 0;
    let todaySum = 0;

    for (let i = 1; i <= currentTimeIndex; i++) {
      const prevTime = data[i - 1].time;
      const currTime = data[i].time;

      // Peak hours (16:00-22:00)
      if (prevTime >= "16:00" && currTime <= "22:00") {
        peakSum += ((data[i - 1].powerUsage + data[i].powerUsage) * 0.25) / 2;
      }

      // Off-peak hours (00:00-09:00, 11:00-14:00)
      if (currTime <= "09:00" || (prevTime >= "11:00" && currTime <= "14:00")) {
        offPeakSum +=
          ((data[i - 1].powerUsage + data[i].powerUsage) * 0.25) / 2;
      }

      // Mid-peak hours (09:00-16:00, 22:00-24:00)
      if (
        (prevTime >= "09:00" && currTime <= "16:00") ||
        (prevTime >= "22:00" && currTime <= "23:30")
      ) {
        midPeakSum +=
          ((data[i - 1].powerUsage + data[i].powerUsage) * 0.25) / 2;
      }

      // Today's total usage
      todaySum += data[i].powerUsage;
    }

    // 計算當日用量
    const totalCost = Math.round(
      offPeakSum * ELECTRICITY_RATES.offPeak + 
      midPeakSum * ELECTRICITY_RATES.midPeak + 
      peakSum * ELECTRICITY_RATES.peak
    );

    // 計算月累積用量 (基礎值 + 當日用量)
    const monthlyPeakSum = BASE_MONTHLY_VALUES.peakUsage + Math.round(peakSum);
    const monthlyOffPeakSum = BASE_MONTHLY_VALUES.offPeakUsage + Math.round(offPeakSum);
    const monthlyMidPeakSum = BASE_MONTHLY_VALUES.midPeakUsage + Math.round(midPeakSum);
    const monthlyTotalSum = BASE_MONTHLY_VALUES.totalUsage + Math.round(todaySum);

    const monthlyTotalCost = Math.round(
      monthlyOffPeakSum * ELECTRICITY_RATES.offPeak + 
      monthlyMidPeakSum * ELECTRICITY_RATES.midPeak + 
      monthlyPeakSum * ELECTRICITY_RATES.peak
    );

    // 計算平均電價
    const averagePrice = calculateAveragePrice(monthlyTotalCost, monthlyTotalSum);

    // 計算節省金額
    const savings = calculateSavings(monthlyTotalCost);

    return {
      peakUsage: Math.round(peakSum),
      offPeakUsage: Math.round(offPeakSum),
      midPeakUsage: Math.round(midPeakSum),
      totalCost,
      todayUsage: Math.round(todaySum),
      monthlyPeakUsage: monthlyPeakSum,
      monthlyOffPeakUsage: monthlyOffPeakSum,
      monthlyMidPeakUsage: monthlyMidPeakSum,
      monthlyTotalCost,
      monthlyUsage: monthlyTotalSum,
      averagePrice,
      savings,
    };
  }, [data, currentTimeIndex]);

  return calculateUsage;
};
