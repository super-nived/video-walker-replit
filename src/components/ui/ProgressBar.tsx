import { FC } from "react";

interface ProgressBarProps {
  currentAmount: number;
  goalAmount: number;
}

const levels = [
  1, 2, 5, 10, 20, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 600, 700,
  800, 900, 1000, 1200, 1400, 1600, 1800, 2000, 2500, 3000, 3500, 4000, 4500,
  5000, 6000, 7000, 8000, 9000, 10000, 12000, 14000, 16000, 18000, 20000,
  25000, 30000, 35000, 40000, 45000, 50000, 60000, 70000, 80000, 90000,
  100000, 120000, 140000, 160000, 180000, 200000, 250000, 300000, 350000,
  400000, 450000, 500000, 550000, 600000, 650000, 700000, 750000, 800000,
  850000, 900000, 950000, 1000000, 1050000, 1100000, 1150000, 1200000,
  1250000, 1300000, 1350000, 1400000, 1450000, 1500000, 1600000, 1700000,
  1800000, 1900000, 2000000, 2200000, 2400000, 2600000, 2800000, 3000000,
  3500000, 4000000, 4500000, 5000000, 6000000, 7000000, 10000000,
];

const ProgressBar: FC<ProgressBarProps> = ({ currentAmount, goalAmount }) => {
  return (
    <div className="bg-card p-6 rounded-2xl border border-border mb-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-primary">
          <span role="img" aria-label="chart">
            📊
          </span>{" "}
          Progress to ₹1,00,00,000
        </h2>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-primary font-bold">
            ₹{currentAmount.toLocaleString()} Raised
          </span>
          <span className="text-muted-foreground">
            ₹{goalAmount.toLocaleString()} Goal
          </span>
        </div>
      </div>

      <div className="relative w-full h-64 overflow-x-auto overflow-y-hidden whitespace-nowrap">
        <div className="flex items-end h-full gap-1 w-max px-2">
          {levels.map((amount, index) => {
            const heightPercent = 8 + (index / levels.length) * 92;
            const isCompleted = currentAmount >= amount;
            const isActive = !isCompleted && currentAmount < amount && (levels[index - 1] || 0) <= currentAmount;

            return (
              <div key={index} className="flex flex-col items-center h-full justify-end w-12 relative">
                {isActive && (
                  <div className="absolute -top-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg whitespace-nowrap">
                    Next Goal
                  </div>
                )}
                <div
                  className={`w-full rounded-t-lg transition-all duration-500 ${isCompleted ? "bg-green-500" : "bg-primary/30"} ${isActive ? "bg-primary animate-pulse" : ""}`}
                  style={{ height: `${heightPercent}%` }}
                ></div>
                <div className={`text-xs mt-2 ${isActive ? "text-primary font-bold" : "text-muted-foreground"}`}>
                  {amount >= 100000
                    ? `₹${(amount / 100000).toFixed(0)}L`
                    : `₹${(amount / 1000).toFixed(0)}K`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="text-center text-muted-foreground text-sm mt-2">
        👈 Swipe to see all levels 👉
      </div>
    </div>
  );
};

export default ProgressBar;
