import { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

// KEY STORAGE
const LOCAL_STORAGE_KEY = "richeese_risk_management_data";
const CONTROL_STORAGE_KEY = "richeese_control_data";

interface TopRisksTableProps {
  onRiskSelect: (risk: any) => void;
}

export function TopRisksTable({ onRiskSelect }: TopRisksTableProps) {
  const [risks, setRisks] = useState<any[]>([]);
  const [controls, setControls] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = () => {
      // 1. Ambil Data Risks
      const savedRisks = localStorage.getItem(LOCAL_STORAGE_KEY);
      // 2. Ambil Data Controls untuk mendapatkan Status
      const savedControls = localStorage.getItem(CONTROL_STORAGE_KEY);
      
      const controlData = savedControls ? JSON.parse(savedControls) : [];
      setControls(controlData);

      if (savedRisks) {
        try {
          const data = JSON.parse(savedRisks);
          
          // Logika: Urutkan berdasarkan score tertinggi, lalu ambil top 5
          const sortedCriticalRisks = [...data]
            .sort((a, b) => (Number(b.likelihood) * Number(a.impact)) - (Number(a.likelihood) * Number(a.impact)))
            .slice(0, 5);

          setRisks(sortedCriticalRisks);
        } catch (e) {
          console.error("Failed to parse risks data", e);
          setRisks([]);
        }
      } else {
        setRisks([]);
      }
    };

    fetchData();
    window.addEventListener("storage", fetchData);
    return () => window.removeEventListener("storage", fetchData);
  }, []);

  // Fungsi helper untuk mencari status dari modul control
  const getControlStatus = (riskName: string) => {
    const relatedControl = controls.find(c => c.relatedRisk === riskName);
    return relatedControl ? relatedControl.status : "No Control";
  };

  return (
    <Card className="p-6 overflow-hidden border-none shadow-sm bg-white">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Top Critical Risks
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Prioritas risiko tertinggi yang membutuhkan atensi manajemen
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="font-bold text-gray-700">ID</TableHead>
              <TableHead className="font-bold text-gray-700">Name</TableHead>
              <TableHead className="font-bold text-gray-700">Asset</TableHead>
              <TableHead className="font-bold text-gray-700">Category</TableHead>
              <TableHead className="font-bold text-gray-700 text-center">L x I</TableHead>
              <TableHead className="font-bold text-gray-700 text-center">Score</TableHead>
              <TableHead className="font-bold text-gray-700">Level</TableHead>
              <TableHead className="font-bold text-gray-700">Status</TableHead>
              <TableHead className="font-bold text-center text-gray-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {risks.length > 0 ? (
              risks.map((risk) => {
                const score = risk.likelihood * risk.impact;
                const isHigh = score >= 6;
                const isMedium = score >= 3 && score < 6;
                
                // Ambil status dari modul control berdasarkan nama risiko
                const currentStatus = getControlStatus(risk.name);

                return (
                <TableRow key={risk.id} className="hover:bg-blue-50/30 transition-colors border-b border-gray-100">
                  <TableCell className="font-bold text-[#1e3a8a] whitespace-nowrap">{risk.id}</TableCell>
                  <TableCell className="font-medium text-gray-900 min-w-[180px]">{risk.name}</TableCell>
                  <TableCell className="text-gray-600 text-sm">{risk.asset}</TableCell>
                  <TableCell>
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 bg-gray-100 rounded text-gray-500 border border-gray-200">
                      {risk.category || "General"}
                    </span>
                  </TableCell>
                  <TableCell className="text-center font-mono text-xs text-gray-400">
                    {risk.likelihood || 0} × {risk.impact || 0}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={`shadow-none font-bold min-w-[32px] justify-center ${isHigh ? "bg-red-600 text-white" : isMedium ? "bg-amber-500 text-white" : "bg-green-500 text-white"}`}>
                      {score}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`border-0 font-semibold ${isHigh ? "bg-red-50 text-red-700" : isMedium ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"}`}>
                      {risk.level || (isHigh ? "High" : isMedium ? "Medium" : "Low")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={`border-0 shadow-none font-medium whitespace-nowrap ${
                        currentStatus === "Completed" ? "bg-green-100 text-green-700" : 
                        currentStatus === "In Progress" ? "bg-yellow-100 text-yellow-800" : 
                        currentStatus === "Pending" ? "bg-red-100 text-red-800" :
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {currentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="sm" className="hover:bg-blue-100 hover:text-blue-700 transition-colors" onClick={() => onRiskSelect(risk)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )})
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center text-gray-400 italic">
                  Belum ada data risiko kritis yang tercatat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
