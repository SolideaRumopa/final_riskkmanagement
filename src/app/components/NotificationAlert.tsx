// updated

import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

interface NotificationAlertProps {
  onClose: () => void;
}

export function NotificationAlert({ onClose }: NotificationAlertProps) {
  // --- 1. BACK-END LOGIC & 2. PENYIMPANAN LOKAL ---
  const [highRiskCount, setHighRiskCount] = useState<number>(0);

  useEffect(() => {
    // Mengambil data dari localStorage
    const savedRisks = localStorage.getItem("richeese_critical_risks");
    
    if (savedRisks) {
      try {
        const risks = JSON.parse(savedRisks);
        // Menghitung risiko dengan score >= 20 (kategori High)
        const count = risks.filter((r: any) => r.score >= 20).length;
        setHighRiskCount(count);
      } catch (e) {
        console.error("Error parsing risks for alert", e);
        setHighRiskCount(0); // Fallback ke kosong jika data corrupt
      }
    } else {
      // Benar-benar kosong jika localStorage tidak ditemukan
      setHighRiskCount(0);
    }
  }, []);

  // Opsional: Jika jumlahnya 0, Anda mungkin ingin menyembunyikan alert sepenuhnya 
  // di level Dashboard, namun di sini kita pastikan datanya akurat 0.
  if (highRiskCount === 0) return null;

  // --- 3. FRONT-END INTEGRITY ---
  return (
    <Card className="p-4 bg-red-50 border-red-200">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-red-100 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-red-900 mb-1">
            ⚠️ High Risk Detected!
          </h3>
          <p className="text-sm text-red-700 mb-3">
            Terdapat {highRiskCount} risiko dengan kategori HIGH yang memerlukan perhatian
            segera. Klik untuk melihat detail.
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              View High Risks
            </Button>
            <Button size="sm" variant="outline" onClick={onClose}>
              Dismiss
            </Button>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-red-100 rounded transition-colors"
        >
          <X className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </Card>
  );
}
