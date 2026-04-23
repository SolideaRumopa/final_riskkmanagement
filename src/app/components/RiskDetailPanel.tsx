import { useState, useEffect } from "react";
import { X, AlertTriangle, Shield, TrendingUp, Info } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface RiskDetailPanelProps {
  risk: any;
  onClose: () => void;
}

// KEY STORAGE
const RISK_STORAGE_KEY = "richeese_risk_management_data";
const CONTROL_STORAGE_KEY = "richeese_control_data";

export function RiskDetailPanel({ risk: initialRisk, onClose }: RiskDetailPanelProps) {
  // --- 1. BACK-END LOGIC & 2. PENYIMPANAN LOKAL ---
  const [risk, setRisk] = useState(initialRisk);
  const [relatedControls, setRelatedControls] = useState<any[]>([]);

  useEffect(() => {
    const loadRealTimeData = () => {
      const savedRisks = localStorage.getItem(RISK_STORAGE_KEY);
      if (savedRisks) {
        try {
          const parsedRisks = JSON.parse(savedRisks);
          const currentRisk = parsedRisks.find((r: any) => r.id === initialRisk.id);
          if (currentRisk) {
            setRisk(currentRisk);
          }
        } catch (e) {
          console.error("Error parsing risks", e);
        }
      }

      const savedControls = localStorage.getItem(CONTROL_STORAGE_KEY);
      if (savedControls) {
        try {
          const allControls = JSON.parse(savedControls);
          const filtered = allControls.filter((c: any) => c.relatedRisk === initialRisk.name);
          setRelatedControls(filtered);
        } catch (e) {
          console.error("Error parsing controls", e);
        }
      }
    };

    loadRealTimeData();
    window.addEventListener("storage", loadRealTimeData);
    return () => window.removeEventListener("storage", loadRealTimeData);
  }, [initialRisk]);

  // LOGIKA NAVIGASI KE RISK MANAGEMENT
  const handleUpdateStatus = () => {
    // Mengarahkan user ke halaman Risk Management
    // Gunakan rute '/risk' atau rute yang sesuai dengan setup navigasi Anda
    window.location.href = "/risks"; 
  };

  const score = (risk.likelihood || 0) * (risk.impact || 0);
  const isHigh = score >= 6;
  const isMedium = score >= 3 && score < 6;

  // --- 3. FRONT-END INTEGRITY (TETAP SAMA) ---
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-end z-[100] backdrop-blur-sm">
      <Card className="w-full max-w-2xl h-full overflow-y-auto animate-in slide-in-from-right duration-300 shadow-2xl rounded-l-2xl border-none">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <div className="bg-red-50 p-2 rounded-lg">
              <Info className="w-5 h-5 text-[#EB1D29]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Risk Analysis Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Header Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-red-50 text-[#EB1D29] text-xs font-bold rounded-full border border-red-100">
                {risk.id}
              </span>
              <Badge
                className={`shadow-none border-0 font-bold px-4 py-1 ${
                  isHigh ? "bg-red-500 text-white" : isMedium ? "bg-amber-500 text-white" : "bg-green-500 text-white"
                }`}
              >
                {isHigh ? "HIGH" : isMedium ? "MEDIUM" : "LOW"}
              </Badge>
            </div>
            <h3 className="text-3xl font-extrabold text-gray-900 leading-tight mb-3">
              {risk.name}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Badge variant="outline" className="text-[10px] uppercase">{risk.category || "General"}</Badge>
              </span>
              <span>•</span>
              <span>Updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Score Cards */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Likelihood", value: risk.likelihood, color: "text-gray-900" },
              { label: "Impact", value: risk.impact, color: "text-gray-900" },
              { label: "Score", value: score, color: isHigh ? "text-red-600" : isMedium ? "text-amber-600" : "text-green-600" }
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 p-5 rounded-2xl border border-gray-100 text-center shadow-sm">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-2">{item.label}</p>
                <p className={`text-4xl font-black ${item.color}`}>{item.value || 0}</p>
              </div>
            ))}
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-[#EB1D29]" />
              <h4 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Environment Context</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 mb-1">Asset</p>
                <p className="font-bold text-gray-800">{risk.asset || "N/A"}</p>
              </div>
              <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 mb-1">Threat</p>
                <p className="font-bold text-gray-800">{risk.threat || "N/A"}</p>
              </div>
              <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm md:col-span-2">
                <p className="text-[10px] font-bold text-gray-400 mb-1">Vulnerability</p>
                <p className="font-bold text-gray-800">{risk.vulnerability || "No detailed vulnerability data."}</p>
              </div>
            </div>
          </div>

          {/* Mitigation Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#EB1D29]" />
                <h4 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Mitigation Status</h4>
              </div>
            </div>
            
            <div className="space-y-3">
              {relatedControls.length > 0 ? (
                relatedControls.map((control: any, idx: number) => (
                  <div key={idx} className="group p-4 bg-white border border-gray-100 rounded-xl flex items-center justify-between shadow-sm">
                    <div>
                      <p className="font-bold text-gray-900">{control.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Priority: {control.priority}</p>
                    </div>
                    <Badge 
                      className={`shadow-none border-0 ${
                        control.status === "Completed" ? "bg-green-100 text-green-700" :
                        control.status === "In Progress" ? "bg-amber-100 text-amber-700" :
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {control.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="p-8 border-2 border-dashed border-gray-100 rounded-2xl text-center">
                  <p className="text-sm text-gray-400 italic">No mitigation controls linked.</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex gap-4 pt-6 border-t border-gray-100">
            <Button 
              onClick={handleUpdateStatus}
              className="flex-1 bg-[#EB1D29] hover:bg-red-800 text-white font-bold h-12 rounded-xl shadow-md transition-all active:scale-95"
            >
              Update Risk
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 border-gray-200 text-gray-600 font-bold h-12 rounded-xl hover:bg-gray-50"
              onClick={() => window.location.href = '/controls'}
            >
              Manage Control
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
