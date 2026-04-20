import { useState } from "react";
import { Card } from "./ui/card";
import { X } from "lucide-react";

// Sample risks categorized by likelihood and impact
const risksData = {
  "1-1": [
    { id: "R-009", name: "Backup Jarang Dilakukan", category: "Backup", score: 1, level: "Low" },
  ],
  "1-2": [
    { id: "R-010", name: "Minor Equipment Wear", category: "Equipment", score: 2, level: "Low" },
  ],
  "1-3": [
    { id: "R-011", name: "Seasonal Staff Turnover", category: "Human Error", score: 3, level: "Medium" },
  ],
  "2-1": [
    { id: "R-008", name: "Delayed Maintenance", category: "Equipment", score: 2, level: "Low" },
  ],
  "2-2": [
    { id: "R-005", name: "Komunikasi Manual Antar Shift", category: "Human Error", score: 4, level: "Medium" },
    { id: "R-012", name: "Slow POS Response", category: "Network", score: 4, level: "Medium" },
  ],
  "2-3": [
    { id: "R-006", name: "Staff Training Gap", category: "Human Error", score: 6, level: "Medium" },
  ],
  "3-1": [
    { id: "R-007", name: "Supplier Delay Risk", category: "Supply Chain", score: 3, level: "Medium" },
  ],
  "3-2": [
    { id: "R-002", name: "Jaringan Internet Buruk", category: "Network", score: 6, level: "Medium" },
    { id: "R-013", name: "Payment Gateway Issue", category: "Network", score: 6, level: "Medium" },
  ],
  "3-3": [
    { id: "R-001", name: "Ketiadaan Genset Cadangan", category: "Power", score: 9, level: "High" },
    { id: "R-003", name: "Single Point of Failure - Server", category: "Network", score: 9, level: "High" },
    { id: "R-004", name: "Kehilangan Data Transaksi", category: "Data Loss", score: 9, level: "High" },
  ],
};

// Get color based on risk score
const getRiskColor = (likelihood: number, impact: number) => {
  const score = likelihood * impact;
  if (score <= 2) return "bg-green-400 hover:bg-green-500 cursor-pointer";
  if (score <= 4) return "bg-yellow-300 hover:bg-yellow-400 cursor-pointer";
  return "bg-red-500 hover:bg-red-600 cursor-pointer";
};

const getTextColor = (likelihood: number, impact: number) => {
  const score = likelihood * impact;
  return score >= 6 ? "text-white" : "text-gray-900";
};

interface RiskMatrix3x3Props {
  onRiskSelect: (risk: any) => void;
}

export function RiskMatrix3x3({ onRiskSelect }: RiskMatrix3x3Props) {
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  const handleCellClick = (likelihood: number, impact: number, event: React.MouseEvent) => {
    const cellKey = `${likelihood}-${impact}`;
    const risks = risksData[cellKey as keyof typeof risksData] || [];
    
    if (risks.length > 0) {
      setSelectedCell(cellKey);
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      setModalPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
  };

  const closeModal = () => {
    setSelectedCell(null);
  };

  const selectedRisks = selectedCell ? (risksData[selectedCell as keyof typeof risksData] || []) : [];

  return (
    <>
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Risk Matrix Dashboard - Richeese Factory Airmadidi
          </h2>
          <p className="text-sm text-gray-600">
            3×3 Risk Matrix - Klik pada sel untuk melihat detail risiko
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
                  IMPACT (Dampak)
                </div>
              </div>

              {/* Matrix */}
              <div className="flex-1">
                {/* Column Headers */}
                <div className="flex mb-2 ml-16">
                  {["Low (1)", "Medium (2)", "High (3)"].map((label) => (
                    <div key={label} className="flex-1 text-center">
                      <span className="text-xs font-medium text-gray-700">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Matrix Rows (reversed to show High at top) */}
                <div className="space-y-2">
                  {[3, 2, 1].map((impact) => (
                    <div key={impact} className="flex gap-2">
                      {/* Row Label */}
                      <div className="w-14 flex items-center justify-end pr-2">
                        <span className="text-xs font-medium text-gray-700">
                          {impact === 3 ? "High (3)" : impact === 2 ? "Med (2)" : "Low (1)"}
                        </span>
                      </div>

                      {/* Row Cells */}
                      {[1, 2, 3].map((likelihood) => {
                        const cellKey = `${likelihood}-${impact}`;
                        const risks = risksData[cellKey as keyof typeof risksData] || [];
                        const score = likelihood * impact;

                        return (
                          <button
                            key={likelihood}
                            onClick={(e) => handleCellClick(likelihood, impact, e)}
                            className={`flex-1 h-28 rounded-lg ${getRiskColor(
                              likelihood,
                              impact
                            )} transition-all border-2 border-transparent hover:border-gray-800`}
                          >
                            <div
                              className={`flex flex-col items-center justify-center h-full ${getTextColor(
                                likelihood,
                                impact
                              )}`}
                            >
                              <span className="text-3xl font-bold">{risks.length}</span>
                              <span className="text-xs opacity-80 mb-1">risiko</span>
                              <span className="text-xs font-medium px-2 py-1 bg-white/20 rounded">
                                Score: {score}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* X-Axis Label */}
                <div className="text-center mt-4">
                  <span className="text-sm font-medium text-gray-700">
                    LIKELIHOOD (Kemungkinan)
                  </span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-400 rounded"></div>
                <span className="text-sm text-gray-700">Low (1-2)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-yellow-300 rounded"></div>
                <span className="text-sm text-gray-700">Medium (3-4)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-500 rounded"></div>
                <span className="text-sm text-gray-700">High (6-9)</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Modal for showing risks in selected cell */}
      {selectedCell && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl p-6 m-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Risks in this Category
              </h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {selectedRisks.map((risk) => (
                <div
                  key={risk.id}
                  onClick={() => {
                    onRiskSelect(risk);
                    closeModal();
                  }}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-[#1e3a8a]">
                          {risk.id}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            risk.level === "High"
                              ? "bg-red-100 text-red-800"
                              : risk.level === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {risk.level}
                        </span>
                      </div>
                      <p className="font-medium text-gray-900 mb-1">{risk.name}</p>
                      <p className="text-sm text-gray-600">Category: {risk.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Risk Score</p>
                      <p className="text-2xl font-bold text-gray-900">{risk.score}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
