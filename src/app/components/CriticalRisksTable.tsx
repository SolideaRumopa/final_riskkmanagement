// updated

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

// Key untuk Local Storage
const STORAGE_KEY = "critical_risks_data";

export function CriticalRisksTable() {
  // --- 1. LOGIKA BACK-END & 2. PENYIMPANAN LOKAL ---
  // Inisialisasi langsung dengan array kosong
  const [risks, setRisks] = useState<any[]>([]);

  useEffect(() => {
    // Mengambil data dari localStorage saat komponen dimuat
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        setRisks(JSON.parse(savedData));
      } catch (e) {
        console.error("Gagal memuat data", e);
        setRisks([]); // Fallback ke kosong jika JSON corrupt
      }
    }
    // Tidak ada lagi inisialisasi initial data di sini
  }, []);

  const handleViewDetails = (id: string) => {
    console.log("Viewing risk details for:", id);
  };

  // --- 3. FRONT-END ---
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Top Critical Risks
          </h2>
          <p className="text-sm text-gray-600">
            Highest priority risks requiring immediate attention
          </p>
        </div>
        <Button variant="outline" className="text-[#1e3a8a] border-[#1e3a8a]">
          View All Risks
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Risk ID</TableHead>
              <TableHead className="font-semibold">Asset</TableHead>
              <TableHead className="font-semibold">Vulnerability</TableHead>
              <TableHead className="font-semibold">Threat</TableHead>
              <TableHead className="font-semibold">Risk Score</TableHead>
              <TableHead className="font-semibold">Control Status</TableHead>
              <TableHead className="font-semibold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {risks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                  No critical risks found in storage.
                </TableCell>
              </TableRow>
            ) : (
              risks.map((risk) => (
                <TableRow key={risk.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-[#1e3a8a]">
                    {risk.id}
                  </TableCell>
                  <TableCell>{risk.asset}</TableCell>
                  <TableCell>{risk.vulnerability}</TableCell>
                  <TableCell>{risk.threat}</TableCell>
                  <TableCell>
                    <Badge className="bg-red-600 text-white hover:bg-red-700 border-0">
                      {risk.score}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${risk.statusColor} border-0 hover:${risk.statusColor}`}
                    >
                      {risk.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-gray-100"
                      onClick={() => handleViewDetails(risk.id)}
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
