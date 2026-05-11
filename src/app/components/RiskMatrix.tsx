// updated

import { useState, useEffect, useMemo } from "react";
import { Card } from "./ui/card";

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
  // --- 1. LOGIKA BACK-END & 2. PENYIMPANAN LOKAL ---
  // Memulai dengan array kosong sebagai initial state
  const [risks, setRisks] = useState<any[]>([]);

  useEffect(() => {
    // Mengambil data dari localStorage yang digunakan oleh RiskManagement
    const saved = localStorage.getItem("richeese_critical_risks");
    if (saved) {
      try {
        setRisks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse risks", e);
        setRisks([]);
      }
    } else {
      // Jika localStorage kosong, pastikan state benar-benar kosong
      setRisks([]);
    }
  }, []);

  // Menghitung distribusi matriks secara dinamis berdasarkan data risks
  const matrixData = useMemo(() => {
    // Inisialisasi matriks 5x5 dengan nilai 0
    const matrix = Array(5).fill(0).map(() => Array(5).fill(0));
    
    risks.forEach((risk) => {
      // Validasi agar data yang tidak lengkap tidak merusak rendering
      if (risk.likelihood && risk.impact) {
        const lIdx = Math.min(Math.max(risk.likelihood - 1, 0), 4);
        const iIdx = Math.min(Math.max(risk.impact - 1, 0), 4);
        matrix[iIdx][lIdx] += 1;
      }
    });
    
    return matrix;
  }, [risks]);

  // --- 3. FRONT-END INTEGRITY ---
  return (
    <Card className="p-6">
      <div className="mb-6 text-center md:text-left">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          University Risk Posture
        </h2>
        <p className="text-sm text-gray-600">
          5×5 Risk Matrix - Visual distribution of identified risks
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Matrix Container */}
          <div className="flex gap-4">
            {/* Y-Axis Label */}
            <div className="flex flex-col justify-center items-center w-12">
              <div
                className="text-sm font-bold text-gray-500 -rotate-90 uppercase tracking-widest"
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
                    <span className="text-xs font-bold text-gray-400">
                      L-{label}
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
                        <span className="text-xs font-bold text-gray-400">
                          I-{actualImpact}
                        </span>
                      </div>

                      {/* Row Cells */}
                      {row.map((count, colIndex) => {
                        const likelihood = colIndex + 1;
                        return (
                          <div
                            key={colIndex}
                            className={`flex-1 h-20 rounded-lg ${getRiskColor(
                              likelihood,
                              actualImpact
                            )} transition-all border-2 border-transparent hover:border-gray-800 flex items-center justify-center`}
                          >
                            <div
                              className={`flex flex-col items-center justify-center ${getTextColor(
                                likelihood,
                                actualImpact
                              )} ${count === 0 ? "opacity-20" : "opacity-100"}`}
                            >
                              <span className="text-2xl font-black">{count}</span>
                              <span className="text-[10px] font-bold uppercase">Risks</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* X-Axis Label */}
              <div className="text-center mt-4">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                  Likelihood
                </span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 rounded-sm"></div>
              <span className="text-xs font-medium text-gray-600">Low</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-300 rounded-sm"></div>
              <span className="text-xs font-medium text-gray-600">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-400 rounded-sm"></div>
              <span className="text-xs font-medium text-gray-600">High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
              <span className="text-xs font-medium text-gray-600">Critical</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
