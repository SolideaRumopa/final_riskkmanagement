import { useState, useEffect, useMemo } from "react";
import { Card } from "./ui/card";
import { X } from "lucide-react";

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
  const [allRisks, setAllRisks] = useState<any[]>([]);

  useEffect(() => {
    const loadMatrixData = () => {
      // 1. UBAH KEY: Mengambil data aktual dari RiskManagement
      const saved = localStorage.getItem("richeese_risk_management_data");
      if (saved) {
        try {
          setAllRisks(JSON.parse(saved));
        } catch (e) {
          console.error("Error parsing risks", e);
          setAllRisks([]);
        }
      } else {
        setAllRisks([]);
      }
    };

    loadMatrixData();
    window.addEventListener("storage", loadMatrixData);
    return () => window.removeEventListener("storage", loadMatrixData);
  }, []);

  const risksData = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    
    allRisks.forEach((risk) => {
      const l = Math.min(Math.max(risk.likelihood, 1), 3);
      const i = Math.min(Math.max(risk.impact, 1), 3);
      
      const key = `${l}-${i}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(risk);
    });
    
    return grouped;
  }, [allRisks]);

  const handleCellClick = (likelihood: number, impact: number) => {
    const cellKey = `${likelihood}-${impact}`;
    const risksInCell = risksData[cellKey] || [];
    
    if (risksInCell.length > 0) {
      setSelectedCell(cellKey);
    }
  };

  const closeModal = () => setSelectedCell(null);
  const selectedRisks = selectedCell ? (risksData[selectedCell] || []) : [];

  return (
    <>
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Risk Matrix Dashboard
          </h2>
          <p className="text-sm text-gray-600">
            Klik pada angka dalam sel untuk melihat detail risiko
          </p>
        </div>

        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="flex gap-4">
              <div className="flex flex-col justify-center items-center w-12">
                <div className="text-xs font-bold text-gray-400 -rotate-90 uppercase tracking-widest" style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>
                  Impact
                </div>
              </div>

              <div className="flex-1">
                <div className="flex mb-2 ml-16">
                  {["Low", "Medium", "High"].map((label) => (
                    <div key={label} className="flex-1 text-center">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">{label}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  {[3, 2, 1].map((impact) => (
                    <div key={impact} className="flex gap-2">
                      <div className="w-14 flex items-center justify-end pr-3">
                        <span className="text-[10px] font-bold text-gray-400 uppercase text-right leading-tight">
                          {impact === 3 ? "High" : impact === 2 ? "Med" : "Low"}
                        </span>
                      </div>

                      {[1, 2, 3].map((likelihood) => {
                        const cellKey = `${likelihood}-${impact}`;
                        const risksInCell = risksData[cellKey] || [];
                        const count = risksInCell.length;

                        return (
                          <button
                            key={likelihood}
                            disabled={count === 0}
                            onClick={() => handleCellClick(likelihood, impact)}
                            className={`flex-1 h-24 rounded-lg ${getRiskColor(likelihood, impact)} transition-all border-2 border-transparent ${count > 0 ? "hover:border-gray-800 shadow-sm" : "opacity-30 grayscale-[0.5]"}`}
                          >
                            <div className={`flex flex-col items-center justify-center h-full ${getTextColor(likelihood, impact)}`}>
                              <span className="text-3xl font-black">{count}</span>
                              <span className="text-[10px] font-bold uppercase tracking-tighter opacity-70">Risks</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>

                <div className="text-center mt-6">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Likelihood</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {selectedCell && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-full max-w-lg p-6 m-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6 border-b pb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Risk Details <span className="text-gray-400 font-normal">({selectedRisks.length})</span>
              </h3>
              <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {selectedRisks.map((risk) => (
                <div
                  key={risk.id}
                  onClick={() => {
                    onRiskSelect(risk);
                    closeModal();
                  }}
                  className="p-4 border-l-4 border-l-[#EB1D29] bg-gray-50 rounded-r-lg hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <p className="text-xs font-bold text-[#EB1D29] mb-1">{risk.id}</p>
                  <p className="font-semibold text-gray-900 leading-tight mb-2">{risk.name}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-gray-500">{risk.category}</span>
                    <span className="text-xs font-black px-2 py-0.5 bg-white rounded border border-gray-200">
                      SCORE: {risk.likelihood * risk.impact}
                    </span>
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
