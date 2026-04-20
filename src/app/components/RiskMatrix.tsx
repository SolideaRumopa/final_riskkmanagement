import { Card } from "./ui/card";

// Risk matrix data: [likelihood][impact] = count
const matrixData = [
  [2, 3, 5, 8, 12], // Impact 1 (Very Low)
  [4, 6, 9, 14, 18], // Impact 2 (Low)
  [7, 11, 15, 22, 28], // Impact 3 (Medium)
  [10, 16, 24, 32, 38], // Impact 4 (High)
  [13, 19, 29, 35, 42], // Impact 5 (Critical)
];

// Get color based on risk score (likelihood * impact)
const getRiskColor = (likelihood: number, impact: number) => {
  const score = likelihood * impact;
  if (score <= 3) return "bg-green-400 hover:bg-green-500";
  if (score <= 8) return "bg-yellow-300 hover:bg-yellow-400";
  if (score <= 12) return "bg-orange-400 hover:bg-orange-500";
  if (score <= 16) return "bg-red-400 hover:bg-red-500";
  return "bg-red-600 hover:bg-red-700";
};

const getTextColor = (likelihood: number, impact: number) => {
  const score = likelihood * impact;
  return score >= 16 ? "text-white" : "text-gray-900";
};

export function RiskMatrix() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          University Risk Posture
        </h2>
        <p className="text-sm text-gray-600">
          5×5 Risk Matrix - Click on any cell to view detailed risks
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Matrix Container */}
          <div className="flex gap-4">
            {/* Y-Axis Label */}
            <div className="flex flex-col justify-center items-center w-12">
              <div
                className="text-sm font-medium text-gray-700 -rotate-90"
                style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
              >
                Impact
              </div>
            </div>

            {/* Matrix */}
            <div className="flex-1">
              {/* Column Headers */}
              <div className="flex mb-2 ml-12">
                {["1", "2", "3", "4", "5"].map((label) => (
                  <div key={label} className="flex-1 text-center">
                    <span className="text-sm font-medium text-gray-700">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Matrix Rows (reversed to show Impact 5 at top) */}
              <div className="space-y-2">
                {[...matrixData].reverse().map((row, rowIndex) => {
                  const actualImpact = 5 - rowIndex;
                  return (
                    <div key={rowIndex} className="flex gap-2">
                      {/* Row Label */}
                      <div className="w-10 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {actualImpact}
                        </span>
                      </div>

                      {/* Row Cells */}
                      {row.map((count, colIndex) => {
                        const likelihood = colIndex + 1;
                        return (
                          <button
                            key={colIndex}
                            className={`flex-1 h-20 rounded-lg ${getRiskColor(
                              likelihood,
                              actualImpact
                            )} transition-all border-2 border-transparent hover:border-gray-800 cursor-pointer`}
                          >
                            <div
                              className={`flex flex-col items-center justify-center h-full ${getTextColor(
                                likelihood,
                                actualImpact
                              )}`}
                            >
                              <span className="text-2xl font-bold">{count}</span>
                              <span className="text-xs opacity-80">risks</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* X-Axis Label */}
              <div className="text-center mt-4">
                <span className="text-sm font-medium text-gray-700">
                  Likelihood
                </span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-400 rounded"></div>
              <span className="text-sm text-gray-700">Low (1-3)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-yellow-300 rounded"></div>
              <span className="text-sm text-gray-700">Medium (4-8)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-orange-400 rounded"></div>
              <span className="text-sm text-gray-700">High (9-12)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-700">Critical (13+)</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
