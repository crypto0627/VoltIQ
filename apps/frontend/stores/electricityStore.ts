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

// 生成48筆30分鐘間隔的時間標籤
const timeLabel = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = (i % 2) * 30;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
});

// 模擬用電量數據
const simulatePowerData = [
  1800, 1750, 1750, 1900, 2000, 1900, 1800, 1700, 1600, 500, 600, 750, 900,
  1000, 1250, 1400, 1450, 1500, 1550, 1500, 1500, 1550, 1500, 1450, 1500,
  1600, 1650, 1600, 1650, 1750, 1500, 1600, 100, 100, 300, 500, 400, 300, 200,
  100, 0, 0, 0, 1500, 1500, 1700, 1800, 1250,
];

// 模擬電池使用量
const simulationBatteryUsageData = [
  1300, 1300, 1300, 1300, 1300, 1300, 1300, 1300, 1300, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1300, -1300, -1300, -1300,
  -1300, -1300, -1300, -1300, -1300, -1300, -1300, 0, 0, 0, 0, 0,
];

// 模擬電池電量
const simulateSocData = [
  20, 30, 40, 50, 60, 70, 80, 90, 100, 100, 100, 100, 100, 100, 100, 100, 100,
  100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
  90, 80, 70, 60, 50, 40, 30, 20, 15, 10, 10, 10, 10, 10, 10, 10,
];

// 設定為1秒更新一次
const simulationInterval = 1000;
// 最後一個時間點停留時間
const lastPointDelay = 2000;

export const useElectricityStore = create<ElectricityState>((set, get) => ({
  data: [],
  currentTimeIndex: 0,
  timeLabel,
  simulationTimer: undefined,

  startSimulation: () => {
    // 先停止現有的模擬
    const { stopSimulation } = get();
    stopSimulation();

    const { timeLabel } = get();
    let lastUpdateTime = Date.now();

    // 初始化資料
    const initialData = timeLabel.map((time, index) => ({
      time,
      soc: simulateSocData[index],
      batteryUsage: simulationBatteryUsageData[index],
      powerUsage: simulatePowerData[index],
    }));
    set({ data: initialData, currentTimeIndex: 0 });

    const updateSimulation = () => {
      const now = Date.now();
      const elapsed = now - lastUpdateTime;
      
      if (elapsed >= simulationInterval) {
        const { currentTimeIndex } = get();
        
        if (currentTimeIndex === timeLabel.length - 1) {
          // 在最後一個時間點停留
          stopSimulation();
          setTimeout(() => {
            set({ currentTimeIndex: 0 });
            lastUpdateTime = Date.now();
            const newTimer = window.setInterval(updateSimulation, simulationInterval);
            set({ simulationTimer: newTimer });
          }, lastPointDelay);
        } else {
          set({ currentTimeIndex: currentTimeIndex + 1 });
          lastUpdateTime = now;
        }
      }
    };

    const timer = window.setInterval(updateSimulation, simulationInterval);
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
