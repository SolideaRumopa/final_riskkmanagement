import { useState, useEffect } from "react";
import { Eye, ChevronUp, ChevronDown } from "lucide-react";
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
const RISK_STORAGE_KEY = "richeese_risk_management_data";
const ASSET_STORAGE_KEY = "richeese_assets";
const CONTROL_STORAGE_KEY = "richeese_control_data";

interface TopRisksTableProps {
  onRiskSelect: (risk: any) => void;
}

export function TopRisksTable({ onRiskSelect }: TopRisksTableProps) {
  const [risks, setRisks] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [controls, setControls] = useState<any[]>([]);
  
  // State untuk Sorting
  const [sortConfig, setSortConfig] = useState<{ key: 'value' | 'level', direction: 'asc' | 'desc' }>({
    key: 'value',
    direction: 'desc'
  });

  useEffect(() => {
    const fetchData = () => {
      const savedRisks = localStorage.getItem(RISK_STORAGE_KEY);
      const savedAssets = localStorage.getItem(ASSET_STORAGE_KEY);
      const savedControls = localStorage.getItem(CONTROL_STORAGE_KEY);
      
      const assetData = savedAssets ? JSON.parse(savedAssets) : [];
      const controlData = savedControls ? JSON.parse(savedControls) : [];
      
      setAssets(assetData);
      setControls(controlData);

      if (savedRisks) {
        try {
          const riskData = JSON.parse(savedRisks);
          // Filter risiko kritis (Likelihood * Impact >= 6)
          const criticalData = riskData.filter((r: any) => (Number(r.likelihood) * Number(r.impact)) >= 6);
          setRisks(criticalData);
        } catch (e) {
          console.error("Gagal memuat data risiko", e);
        }
      }
    };

    fetchData();
    window.addEventListener('storage', fetchData);
    return () => window.removeEventListener('storage', fetchData);
  }, []);

  // Fungsi Helper untuk menghitung Calculated Value: L * I * AssetValue
  const getCalculatedValue = (risk: any) => {
    const asset = assets.find(a => a.name === risk.asset || a.id === risk.asset);
    const assetValue = asset ? Number(asset.value || 0) : 0;
    return Number(risk.likelihood) * Number(risk.impact) * assetValue;
  };

  const handleSort = (key: 'value' | 'level') => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const sortedRisks = [...risks].sort((a, b) => {
    const valA = getCalculatedValue(a);
    const valB = getCalculatedValue(b);

    if (sortConfig.key === 'value') {
      return sortConfig.direction === 'desc' ? valB - valA : valA - valB;
    }
    // Level sort (menggunakan dasar Likelihood * Impact)
    return sortConfig.direction === 'desc' ? (b.likelihood * b.impact) - (a.likelihood * a.impact) : (a.likelihood * a.impact) - (b.likelihood * b.impact);
  });

  return (
    <Card className="border-none shadow-sm overflow-hidden bg-white">
      <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
        <div>
          <h3 className="font-bold text-gray-900">Top Critical Risks</h3>
          <p className="text-xs text-gray-500">Berdasarkan Likelihood × Impact × Asset Value</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" size="sm" 
            onClick={() => handleSort('value')}
            className={`text-[10px] font-bold h-8 ${sortConfig.key === 'value' ? 'border-[#EB1D29] text-[#EB1D29] bg-red-50' : ''}`}
          >
            Sort by Calculated Value {sortConfig.key === 'value' && (sortConfig.direction === 'desc' ? <ChevronDown className="w-3 h-3 ml-1" /> : <ChevronUp className="w-3 h-3 ml-1" />)}
          </Button>
          <Button 
            variant="outline" size="sm" 
            onClick={() => handleSort('level')}
            className={`text-[10px] font-bold h-8 ${sortConfig.key === 'level' ? 'border-[#EB1D29] text-[#EB1D29] bg-red-50' : ''}`}
          >
            Sort by Level {sortConfig.key === 'level' && (sortConfig.direction === 'desc' ? <ChevronDown className="w-3 h-3 ml-1" /> : <ChevronUp className="w-3 h-3 ml-1" />)}
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="text-[10px] font-bold">ID</TableHead>
              <TableHead className="text-[10px] font-bold">Name</TableHead>
              <TableHead className="text-[10px] font-bold">Category</TableHead>
              <TableHead className="text-[10px] font-bold text-center">Score (L×I)</TableHead>
              <TableHead className="text-[10px] font-bold text-center">Calculated Value</TableHead>
              <TableHead className="text-[10px] font-bold">Level</TableHead>
              <TableHead className="text-[10px] font-bold">Status</TableHead>
              <TableHead className="text-[10px] font-bold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRisks.length > 0 ? (
              sortedRisks.map((risk) => {
                const scoreValue = Number(risk.likelihood) * Number(risk.impact);
                const finalCalcValue = getCalculatedValue(risk);
                const riskControl = controls.find((c: any) => c.riskId === risk.id);
                const currentStatus = riskControl ? riskControl.status : "Pending";

                return (
                  <TableRow key={risk.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-mono text-[10px] text-gray-400">{risk.id}</TableCell>
                    <TableCell className="font-bold text-gray-900 text-sm">{risk.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 text-[10px]">
                        {risk.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-[11px] font-medium text-gray-500">
                      {risk.likelihood} × {risk.impact}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-[#EB1D29] text-white text-xs font-bold shadow-sm">
                        {finalCalcValue.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-700 border-0 font-bold text-[10px]">High</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`font-bold text-[10px] ${
                          currentStatus === "Completed" ? "border-green-200 text-green-700" : 
                          currentStatus === "In Progress" ? "border-yellow-200 text-yellow-700" : "border-red-200 text-red-700"
                        }`}
                      >
                        {currentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm" onClick={() => onRiskSelect(risk)} className="hover:bg-red-50 text-[#EB1D29]">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-gray-400 italic text-sm">
                  Tidak ada risiko kritis yang ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
