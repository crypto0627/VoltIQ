import { create } from "zustand";

interface EnergyData {
  time: string;
  soc: number;
  batteryUsage: number;
  powerUsage: number;
}

interface ElectricityState {
  data: EnergyData[];
  currentTimeIndex: number;
  timeLabel: string[];
  simulationTimer: number | undefined;
  startSimulation: () => void;
  stopSimulation: () => void;
}

const simulatePowerData = [
  1800, 1750, 1750, 1900, 2000, 1900, 1800, 1700, 1600, 500, 600, 750, 900,
  1000, 1250, 1400, 1450, 1500, 1550, 1500, 1500, 1550, 1500, 1450, 1500, 1600,
  1650, 1600, 1650, 1750, 1500, 1600, 100, 100, 300, 500, 400, 300, 200, 100, 0,
  0, 0, 1500, 1500, 1700, 1800, 1250,
];

const simulationBatteryUsageData = [
  1300, 1300, 1300, 1300, 1300, 1300, 1300, 1300, 1300, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1300, -1300, -1300, -1300,
  -1300, -1300, -1300, -1300, -1300, -1300, -1300, 0, 0, 0, 0, 0,
];

const simulateSocData = [
  20, 30, 40, 50, 60, 70, 80, 90, 100, 100, 100, 100, 100, 100, 100, 100, 100,
  100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 90,
  80, 70, 60, 50, 40, 30, 20, 15, 10, 10, 10, 10, 10, 10, 10,
];

const timeLabel = [
  "00:00",
  "00:30",
  "01:00",
  "01:30",
  "02:00",
  "02:30",
  "03:00",
  "03:30",
  "04:00",
  "04:30",
  "05:00",
  "05:30",
  "06:00",
  "06:30",
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
  "23:00",
  "23:30",
];

// 修改為1秒更新一次
const simulationInterval = 1000;

export const useElectricityStore = create<ElectricityState>((set, get) => ({
  data: [],
  currentTimeIndex: 0,
  timeLabel,
  simulationTimer: undefined,

  startSimulation: () => {
    const { timeLabel } = get();

    // 初始化資料
    const initialData = timeLabel.map((time, index) => ({
      time,
      soc: simulateSocData[index],
      batteryUsage: simulationBatteryUsageData[index],
      powerUsage: simulatePowerData[index],
    }));
    set({ data: initialData, currentTimeIndex: 0 });

    const timer = window.setInterval(() => {
      const { currentTimeIndex } = get();

      if (currentTimeIndex >= timeLabel.length - 1) {
        // Reset to beginning of data
        set({ currentTimeIndex: 0 });
      } else {
        set({ currentTimeIndex: currentTimeIndex + 1 });
      }
    }, simulationInterval);

    set({ simulationTimer: timer });
  },

  stopSimulation: () => {
    const { simulationTimer } = get();
    if (simulationTimer) {
      clearInterval(simulationTimer);
      set({ simulationTimer: undefined });
    }
  },
}));
