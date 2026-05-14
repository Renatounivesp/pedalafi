export const mockUser = {
  id: "PLT-000-X",
  name: "Operador",
  city: "São Paulo, SP",
  vehicle: "Equipamento",
  level: "Recruta",
  dailyGoalKm: 60,
  isPremium: false,
  avatar: "https://i.pravatar.cc/150?u=placeholder",
};

export const mockTodayStats = {
  km: 32.5,
  timeOnline: "04:15:00",
  currentSpeed: 0,
  avgSpeed: 28.4,
  calories: 1240,
  deliveries: 12,
};

// Simplified path coordinates for SP area
const path1: [number, number][] = [
  [-23.5505, -46.6333],
  [-23.5515, -46.6343],
  [-23.5525, -46.6353],
  [-23.5535, -46.6343],
  [-23.5545, -46.6333],
];

const path2: [number, number][] = [
  [-23.5600, -46.6500],
  [-23.5610, -46.6510],
  [-23.5620, -46.6520],
  [-23.5630, -46.6530],
];

export const mockHistory = [
  {
    id: "LOG-A92J",
    date: "2026-05-13",
    km: 4.2,
    time: "00:30:00",
    earnings: 0,
    path: path1,
  },
  {
    id: "LOG-B12K",
    date: "2026-05-12",
    km: 3.1,
    time: "00:25:00",
    earnings: 0,
    path: path2,
  },
];
