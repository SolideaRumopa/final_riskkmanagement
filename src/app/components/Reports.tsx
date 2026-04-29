import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { FileDown, Database, ShieldAlert, Zap } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function Reports() {
  const [risks, setRisks] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<any[]>([]);
  const [threats, setThreats] = useState<any[]>([]);
  const [controls, setControls] = useState<any[]>([]);

  const [, setStats] = useState({
    total: 0,
    high: 0,
    medium: 0,
    low: 0
  });

  const RISK_STORAGE_KEY = "richeese_risk_management_data";
  const ASSET_STORAGE_KEY = "richeese_assets";
  const VULN_STORAGE_KEY = "richeese_vulnerabilities";
  const THREAT_STORAGE_KEY = "richeese_threat_catalog";
  const CONTROL_STORAGE_KEY = "richeese_control_data";

  useEffect(() => {
    const loadData = () => {
      const savedRisks = localStorage.getItem(RISK_STORAGE_KEY);
      const savedAssets = localStorage.getItem(ASSET_STORAGE_KEY);
      const savedVulns = localStorage.getItem(VULN_STORAGE_KEY);
      const savedThreats = localStorage.getItem(THREAT_STORAGE_KEY);
      const savedControls = localStorage.getItem(CONTROL_STORAGE_KEY);

      if (savedRisks) {
        const parsedRisks = JSON.parse(savedRisks);
        setRisks(parsedRisks);
        setStats({
          total: parsedRisks.length,
          high: parsedRisks.filter((r: any) => (r.likelihood * r.impact) >= 6).length,
          medium: parsedRisks.filter((r: any) => {
            const score = r.likelihood * r.impact;
            return score >= 3 && score < 6;
          }).length,
          low: parsedRisks.filter((r: any) => (r.likelihood * r.impact) < 3).length,
        });
      }

      if (savedAssets) setAssets(JSON.parse(savedAssets));
      if (savedVulns) setVulnerabilities(JSON.parse(savedVulns));
      if (savedThreats) setThreats(JSON.parse(savedThreats));
      if (savedControls) setControls(JSON.parse(savedControls));
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
      [["ID", "Name", "Category", "Type", "Quantity", "Total Value"]],
      assets.map((a: any) => [a.id || '-', a.name, a.category, a.type, a.quantity, a.value])
    );

    generateSection("2. VULNERABILITIES", 
      [["ID", "Description", "Related Asset", "Severity"]],
      vulns.map((v: any) => [v.id || '-', v.description, v.asset, v.severity])
    );

    generateSection("3. THREATS", 
      [["ID", "Name", "Related Vulnerability", "Category", "Probability"]],
      threats.map((t: any) => [t.id || '-', t.name, t.vulnerability, t.category, t.probability])
    );

    doc.save("Richeese_Risk_Report.pdf");
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">REPORTS</h1>
          <p className="text-gray-500 font-medium">Risk Matrix & Integrated Data Analysis</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleExportPDF} className="bg-[#EB1D29] hover:bg-[#c11721] text-white flex items-center gap-2 shadow-lg">
            <FileDown className="w-4 h-4" /> Export Comprehensive PDF
          </Button>
        </div>
      </div>

      {/* Stats Summary Footer */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="p-4 bg-gray-100 rounded-xl text-center border">
          <p className="text-[10px] text-gray-500 font-bold mb-1 tracking-tighter uppercase">Total Assets</p>
          <p className="text-2xl font-black text-gray-900">{assets.length}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-xl text-center border">
          <p className="text-[10px] text-gray-500 font-bold mb-1 tracking-tighter uppercase">Total Vulns</p>
          <p className="text-2xl font-black text-gray-900">{vulnerabilities.length}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-xl text-center border">
          <p className="text-[10px] text-gray-500 font-bold mb-1 tracking-tighter uppercase">Total Threats</p>
          <p className="text-2xl font-black text-gray-900">{threats.length}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-xl text-center border">
          <p className="text-[10px] text-gray-500 font-bold mb-1 tracking-tighter uppercase">Total Controls</p>
          <p className="text-2xl font-black text-gray-900">{controls.length}</p>
        </div>
      </div>

      {/* --- INTEGRATED DATA MATRICES --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pt-6">
        
        {/* 1. Asset / Vulnerability Matrix */}
        <Card className="p-6 border-none shadow-xl bg-white rounded-2xl">
          <div className="flex items-center gap-2 mb-4 border-b pb-2">
            <Database className="w-5 h-5 text-blue-600" />
            <h3 className="font-black text-sm text-gray-800 uppercase">Asset / Vulnerability Matrix</h3>
          </div>
          <div className="overflow-auto max-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-2 text-[10px] font-black text-gray-500 uppercase">Asset Name</th>
                  <th className="p-2 text-[10px] font-black text-gray-500 uppercase">Vulnerabilities</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {assets.length > 0 ? assets.map(asset => {
                  const linkedVulns = vulnerabilities.filter(v => v.asset === asset.name || v.asset === asset.id);
                  return (
                    <tr key={asset.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-2 font-bold text-gray-700">{asset.name}</td>
                      <td className="p-2">
                        {linkedVulns.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {linkedVulns.map((v, i) => (
                              <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md border border-blue-100 font-medium">
                                {v.description}
                              </span>
                            ))}
                          </div>
                        ) : <span className="text-gray-300 italic">No vulnerability linked</span>}
                      </td>
                    </tr>
                  )
                }) : <tr><td colSpan={2} className="p-4 text-center text-gray-400 italic">No assets found</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>

        {/* 2. Vulnerability / Threat Matrix */}
        <Card className="p-6 border-none shadow-xl bg-white rounded-2xl">
          <div className="flex items-center gap-2 mb-4 border-b pb-2">
            <ShieldAlert className="w-5 h-5 text-orange-600" />
            <h3 className="font-black text-sm text-gray-800 uppercase">Vulnerability / Threat Matrix</h3>
          </div>
          <div className="overflow-auto max-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-2 text-[10px] font-black text-gray-500 uppercase">Vulnerability</th>
                  <th className="p-2 text-[10px] font-black text-gray-500 uppercase">Exploited By Threats</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {vulnerabilities.length > 0 ? vulnerabilities.map((vuln, idx) => {
                  const matchingRisks = risks.filter(r => r.vulnerabilityName === vuln.description);
                  const uniqueThreats = Array.from(new Set(matchingRisks.map(r => r.threatName)));

                  return (
                    <tr key={idx} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-2 font-bold text-gray-700">{vuln.description}</td>
                      <td className="p-2">
                        {uniqueThreats.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {uniqueThreats.map((t, i) => (
                              <span key={i} className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded-md border border-orange-100 font-medium">
                                {t}
                              </span>
                            ))}
                          </div>
                        ) : <span className="text-gray-300 italic">No threats identified</span>}
                      </td>
                    </tr>
                  )
                }) : <tr><td colSpan={2} className="p-4 text-center text-gray-400 italic">No vulnerabilities found</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>

        {/* 3. Threat / Control Matrix */}
        <Card className="p-6 border-none shadow-xl bg-white rounded-2xl">
          <div className="flex items-center gap-2 mb-4 border-b pb-2">
            <Zap className="w-5 h-5 text-green-600" />
            <h3 className="font-black text-sm text-gray-800 uppercase">Threat / Control Matrix</h3>
          </div>
          <div className="overflow-auto max-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-2 text-[10px] font-black text-gray-500 uppercase">Threat Name</th>
                  <th className="p-2 text-[10px] font-black text-gray-500 uppercase">Mitigation Controls</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {threats.length > 0 ? threats.map((threat, idx) => {
                  const relatedRisks = risks.filter(r => r.threatName === threat.name);
                  const mitigatingControls = controls.filter(c => 
                    relatedRisks.some(r => r.name === c.relatedRisk || `${r.id} - ${r.name}` === c.relatedRisk)
                  );

                  return (
                    <tr key={idx} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-2 font-bold text-gray-700">{threat.name}</td>
                      <td className="p-2">
                        {mitigatingControls.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {mitigatingControls.map((c, i) => (
                              <span key={i} className="px-2 py-0.5 bg-green-50 text-green-600 rounded-md border border-green-100 font-medium">
                                {c.name} ({c.status})
                              </span>
                            ))}
                          </div>
                        ) : <span className="text-gray-300 italic">No controls applied</span>}
                      </td>
                    </tr>
                  )
                }) : <tr><td colSpan={2} className="p-4 text-center text-gray-400 italic">No threats found</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

    </div>
  );
}
