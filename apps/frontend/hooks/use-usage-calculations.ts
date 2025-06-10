import { useMemo } from "react";
import { useElectricityStore } from "@/stores/electricityStore";

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

    const totalCost = Math.round(
      offPeakSum * 1.58 + midPeakSum * 3.63 + peakSum * 5.8,
    );

    return {
      peakUsage: Math.round(peakSum),
      offPeakUsage: Math.round(offPeakSum),
      midPeakUsage: Math.round(midPeakSum),
      totalCost,
      todayUsage: Math.round(todaySum),
    };
  }, [data, currentTimeIndex]);

  return calculateUsage;
};
