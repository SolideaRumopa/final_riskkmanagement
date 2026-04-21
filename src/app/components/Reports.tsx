import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { FileDown, FileText } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function Reports() {
  const [risks, setRisks] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    high: 0,
    medium: 0,
    low: 0
  });

  const RISK_STORAGE_KEY = "richeese_risk_management_data";

  useEffect(() => {
    const loadData = () => {
      const savedRisks = localStorage.getItem(RISK_STORAGE_KEY);
      if (savedRisks) {
        try {
          const parsedRisks = JSON.parse(savedRisks);
          setRisks(parsedRisks);
          
          // Hitung statistik berdasarkan score (Likelihood * Impact)
          setStats({
            total: parsedRisks.length,
            high: parsedRisks.filter((r: any) => (r.likelihood * r.impact) >= 6).length,
            medium: parsedRisks.filter((r: any) => {
              const score = r.likelihood * r.impact;
              return score >= 3 && score < 6;
            }).length,
            low: parsedRisks.filter((r: any) => (r.likelihood * r.impact) < 3).length
          });
        } catch (e) {
          console.error("Error parsing risks data", e);
        }
      }
    };
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const handleExportPDF = () => {
    const assets = JSON.parse(localStorage.getItem("richeese_assets") || "[]");
    const vulns = JSON.parse(localStorage.getItem("richeese_vulnerabilities") || "[]");
    const threats = JSON.parse(localStorage.getItem("richeese_threat_catalog") || "[]");
    const controls = JSON.parse(localStorage.getItem("richeese_control_data") || "[]");
    const risksData = JSON.parse(localStorage.getItem(RISK_STORAGE_KEY) || "[]");

    if (assets.length === 0 && risksData.length === 0 && vulns.length === 0) {
      return alert("Tidak ada data untuk diekspor.");
    }

    const doc = new jsPDF('p', 'mm', 'a4');
    const timestamp = new Date().toLocaleString();

    doc.setFontSize(18);
    doc.setTextColor(30, 58, 138); 
    doc.text("RICHEESE FACTORY", 14, 20);
    doc.setFontSize(12);
    doc.text("Risk Management Report", 14, 28);
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Generated: ${timestamp}`, 14, 34);
    doc.line(14, 36, 196, 36);

    let currentY = 45;

    const generateSection = (title: string, head: string[][], data: any[][]) => {
      if (currentY > 240) { doc.addPage(); currentY = 20; }
      
      doc.setFontSize(11);
      doc.setTextColor(0);
      doc.setFont("helvetica", "bold");
      doc.text(title, 14, currentY);
      
      autoTable(doc, {
        startY: currentY + 4,
        head: head,
        body: data,
        theme: 'grid',
        headStyles: { 
          fillColor: [30, 58, 138], 
          textColor: [255, 255, 255],
          fontSize: 8,
          fontStyle: 'bold',
          halign: 'center'
        },
        styles: { fontSize: 7, cellPadding: 2 },
        margin: { left: 14, right: 14 },
        didDrawPage: (data) => {
            currentY = data.cursor ? data.cursor.y : currentY;
        }
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 12;
    };

    generateSection("1. ASSETS", 
      [["ID", "Name", "Value", "Category"]],
      assets.map((a: any) => [a.id || '-', a.name, a.value, a.category])
    );

    generateSection("2. VULNERABILITIES", 
      [["ID", "Description", "Related Asset", "Severity"]],
      vulns.map((v: any) => [v.id || '-', v.description, v.asset, v.severity])
    );

    generateSection("3. THREATS", 
      [["ID", "Name", "Related Vulnerability", "Category", "Probability"]],
      threats.map((t: any) => [t.id || '-', t.name, t.vulnerability, t.category, t.probability])
    );

    generateSection("4. RISKS", 
      [["ID", "Name", "Category", "L x I", "Score", "Level"]],
      risksData.map((r: any) => {
        const score = (r.likelihood || 0) * (r.impact || 0);
        const level = score >= 6 ? "HIGH" : score >= 3 ? "MEDIUM" : "LOW";
        return [r.id || '-', r.name, r.category, `${r.likelihood} x ${r.impact}`, score, level];
      })
    );

    generateSection("5. CONTROLS", 
      [["ID", "Name", "Type", "Related Risk", "Cost Estimation", "Priority", "Status"]],
      controls.map((c: any) => [
        c.id || '-', 
        c.name, 
        c.type, 
        c.relatedRisk, 
        new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(c.estimatedCost || 0),
        c.priority, 
        c.status
      ])
    );

    doc.save(`Richeese_Risk_Report_${Date.now()}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-600 mt-1">Laporan komprehensif sistem manajemen risiko</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6 border-l-4 border-l-blue-900 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-900" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Export Comprehensive PDF</h3>
              <p className="text-sm text-gray-600 mb-4">
                Dokumen PDF berisi data terintegrasi: Aset, Kerentanan, Ancaman, Penilaian Risiko, dan Kontrol Mitigasi.
              </p>
              <Button 
                onClick={handleExportPDF}
                className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-bold"
              >
                <FileDown className="w-4 h-4 mr-2" />
                Download PDF Report
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Summary</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-3">Top 5 Critical Risks</h3>
            <div className="space-y-2">
              {risks.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed rounded-lg text-gray-400">
                  Belum ada data risiko.
                </div>
              ) : (
                risks
                  .sort((a, b) => (b.likelihood * b.impact) - (a.likelihood * a.impact))
                  .slice(0, 5)
                  .map((risk, idx) => {
                    const score = risk.likelihood * risk.impact;
                    return (
                      <div key={idx} className={`flex items-center justify-between p-3 rounded-lg border ${score >= 6 ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200"}`}>
                        <div>
                          <p className="text-sm font-bold text-gray-800">{risk.name}</p>
                          <p className="text-xs text-gray-500">Asset: {risk.asset}</p>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${score >= 6 ? "bg-red-600 text-white" : "bg-yellow-500 text-white"}`}>
                          Score: {score}
                        </span>
                      </div>
                    );
                  })
              )}
            </div>
          </div>

          {/* 4 Kotak Statistik: Total, High, Medium, Low */}
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg text-center border shadow-sm">
              <p className="text-[10px] text-gray-500 font-bold mb-1 uppercase tracking-tighter">Total Risk</p>
              <p className="text-2xl font-black text-gray-900">{stats.total}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center border shadow-sm">
              <p className="text-[10px] text-gray-500 font-bold mb-1 uppercase tracking-tighter">High Risks</p>
              <p className="text-2xl font-black text-red-600">{stats.high}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center border shadow-sm">
              <p className="text-[10px] text-gray-500 font-bold mb-1 uppercase tracking-tighter">Medium Risks</p>
              <p className="text-2xl font-black text-yellow-600">{stats.medium}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center border shadow-sm">
              <p className="text-[10px] text-gray-500 font-bold mb-1 uppercase tracking-tighter">Low Risks</p>
              <p className="text-2xl font-black text-green-600">{stats.low}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
