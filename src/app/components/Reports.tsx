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
    low: 0,
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
          high: parsedRisks.filter((r: any) => r.level === "High").length,
          medium: parsedRisks.filter((r: any) => r.level === "Medium").length,
          low: parsedRisks.filter((r: any) => r.level === "Low").length,
        });
      } else {
        setStats({ total: 0, high: 0, medium: 0, low: 0 });
      }

      if (savedAssets) setAssets(JSON.parse(savedAssets));
      if (savedVulns) setVulnerabilities(JSON.parse(savedVulns));
      if (savedThreats) setThreats(JSON.parse(savedThreats));
      if (savedControls) setControls(JSON.parse(savedControls));
    };

    loadData();
    window.addEventListener("richeese:data-updated", loadData);
    window.addEventListener("storage", loadData);
    return () => {
      window.removeEventListener("richeese:data-updated", loadData);
      window.removeEventListener("storage", loadData);
    };
  }, []);

  const scoreLookup: Record<string, number> = {
    "Not Relevant": 0,
    Low: 1,
    Medium: 2,
    High: 3,
    Pending: 1,
    "In Progress": 2,
    Completed: 3,
  };

  const getScore = (value: string | number) => {
    if (typeof value === "number") return value;
    return scoreLookup[value] ?? 0;
  };

  const getAssetById = (id: string) => assets.find((a) => a.id === id);
  const getRiskById = (id: string) => risks.find((r) => r.id === id);
  const getThreatById = (id: string) => threats.find((t) => t.id === id);
  const getVulnerabilityById = (id: string) => vulnerabilities.find((v) => v.id === id);

  const getAssetTotalValue = (asset: any) => {
    const qty = Number(asset.quantity || 1);
    const val = Number(asset.value || 0);
    return qty * val;
  };

  const getAssetNames = (ids: string[]) => {
    return (ids || [])
      .map((id) => getAssetById(id))
      .filter(Boolean)
      .map((asset) => asset.name)
      .join(", ");
  };

  const getVulnerabilityNames = (ids: string[]) => {
    return (ids || [])
      .map((id) => getVulnerabilityById(id))
      .filter(Boolean)
      .map((vuln) => vuln.description)
      .join(", ");
  };

  const getRiskNames = (ids: string[]) => {
    return (ids || [])
      .map((id) => getRiskById(id))
      .filter(Boolean)
      .map((risk) => risk.name)
      .join(", ");
  };

  const getAssetNameForRisk = (risk: any) => {
    return getAssetById(risk.assetId)?.name || "Unlinked Asset";
  };

  const getRiskThreatNames = (risk: any) => {
    return (risk.threatIds || [])
      .map((id) => getThreatById(id))
      .filter(Boolean)
      .map((threat) => threat.name)
      .join(", ");
  };

  const getVulnerabilityImpact = (vuln: any) => {
    const assetValues = (vuln.assetIds || [])
      .map((id: string) => getAssetById(id))
      .filter(Boolean)
      .map((asset) => getAssetTotalValue(asset));
    const assetTotal = assetValues.reduce((sum, value) => sum + value, 0);
    return assetTotal * getScore(vuln.severity);
  };

  const getThreatImpact = (threat: any) => {
    const vulnValues = (threat.vulnerabilityIds || [])
      .map((id: string) => getVulnerabilityById(id))
      .filter(Boolean)
      .map((vuln) => getVulnerabilityImpact(vuln));
    const vulnTotal = vulnValues.reduce((sum, value) => sum + value, 0);
    return vulnTotal * getScore(threat.probability);
  };

  const getControlRiskNames = (control: any) => {
    return (control.riskIds || [])
      .map((id: string) => getRiskById(id))
      .filter(Boolean)
      .map((risk) => risk.name)
      .join(", ");
  };

  const getControlImpact = (control: any) => {
    const linkedRisks = (control.riskIds || [])
      .map((id: string) => getRiskById(id))
      .filter(Boolean);

    const priorityFactor = getScore(control.priority) || 1;
    return linkedRisks.reduce((sum, risk) => {
      const riskScore = risk.score || Number(risk.likelihood || 0) * Number(risk.impact || 0);
      return sum + riskScore * priorityFactor;
    }, 0);
  };

  const getMitigatingControls = (riskId: string) => {
    return controls.filter((control) => (control.riskIds || []).includes(riskId));
  };

  const handleExportPDF = () => {
    const assets = JSON.parse(localStorage.getItem("richeese_assets") || "[]");
    const vulns = JSON.parse(
      localStorage.getItem("richeese_vulnerabilities") || "[]",
    );
    const threats = JSON.parse(
      localStorage.getItem("richeese_threat_catalog") || "[]",
    );
    const controls = JSON.parse(
      localStorage.getItem("richeese_control_data") || "[]",
    );
    const risksData = JSON.parse(
      localStorage.getItem(RISK_STORAGE_KEY) || "[]",
    );

    if (
      assets.length === 0 &&
      risksData.length === 0 &&
      vulns.length === 0 &&
      threats.length === 0 &&
      controls.length === 0
    ) {
      return alert("Tidak ada data untuk diekspor.");
    }

    const doc = new jsPDF("p", "mm", "a4");
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

    const generateSection = (
      title: string,
      head: string[][],
      data: any[][],
    ) => {
      if (currentY > 240) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFontSize(11);
      doc.setTextColor(0);
      doc.setFont("helvetica", "bold");
      doc.text(title, 14, currentY);

      autoTable(doc, {
        startY: currentY + 4,
        head: head,
        body: data,
        theme: "grid",
        headStyles: {
          fillColor: [30, 58, 138],
          textColor: [255, 255, 255],
          fontSize: 8,
          fontStyle: "bold",
          halign: "center",
        },
        styles: { fontSize: 7, cellPadding: 2 },
        margin: { left: 14, right: 14 },
        didDrawPage: (data) => {
          currentY = data.cursor ? data.cursor.y : currentY;
        },
      });

      currentY = (doc as any).lastAutoTable.finalY + 12;
    };

    generateSection(
      "1. ASSETS",
      [["ID", "Name", "Category", "Type", "Quantity", "Total Value"]],
      assets.map((a: any) => [
        a.id || "-",
        a.name,
        a.category,
        a.type,
        a.quantity,
        a.value,
      ]),
    );

    generateSection(
      "2. VULNERABILITIES",
      [["ID", "Description", "Related Assets", "Severity", "Status"]],
      vulns.map((v: any) => [
        v.id || "-",
        v.description,
        Array.isArray(v.assetIds) ? getAssetNames(v.assetIds) : "",
        v.severity,
        v.status || "",
      ]),
    );

    generateSection(
      "3. THREATS",
      [["ID", "Name", "Related Vulnerabilities", "Category", "Probability"]],
      threats.map((t: any) => [
        t.id || "-",
        t.name,
        Array.isArray(t.vulnerabilityIds) ? getVulnerabilityNames(t.vulnerabilityIds) : "",
        t.category,
        t.probability,
      ]),
    );

    generateSection(
      "4. CONTROLS",
      [["ID", "Name", "Type", "Related Risks", "Priority", "Status"]],
      controls.map((c: any) => [
        c.id || "-",
        c.name,
        c.type,
        Array.isArray(c.riskIds) ? getRiskNames(c.riskIds) : "",
        c.priority,
        c.status,
      ]),
    );

    generateSection(
      "5. RISKS",
      [[
        "ID",
        "Name",
        "Asset",
        "Threats",
        "Score",
        "Level",
        "Treatment",
      ]],
      risksData.map((r: any) => [
        r.id || "-",
        r.name,
        getAssetById(r.assetId)?.name || "Unlinked Asset",
        Array.isArray(r.threatIds) ? r.threatIds.map((id: string) => getThreatById(id)?.name || id).join(", ") : "",
        r.score || Number(r.likelihood || 0) * Number(r.impact || 0),
        r.level || "",
        r.treatment || "",
      ]),
    );

    doc.save("Richeese_Risk_Report.pdf");
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            REPORTS
          </h1>
          <p className="text-gray-500 font-medium">
            Risk Matrix & Integrated Data Analysis
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleExportPDF}
            className="bg-[#EB1D29] hover:bg-[#c11721] text-white flex items-center gap-2 shadow-lg"
          >
            <FileDown className="w-4 h-4" /> Export Comprehensive PDF
          </Button>
        </div>
      </div>

      {/* Stats Summary Footer */}
      <div className="grid grid-cols-5 gap-4 mt-6">
        <div className="p-4 bg-gray-100 rounded-xl text-center border">
          <p className="text-[10px] text-gray-500 font-bold mb-1 tracking-tighter uppercase">
            Total Assets
          </p>
          <p className="text-2xl font-black text-gray-900">{assets.length}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-xl text-center border">
          <p className="text-[10px] text-gray-500 font-bold mb-1 tracking-tighter uppercase">
            Total Vulnerabilities
          </p>
          <p className="text-2xl font-black text-gray-900">
            {vulnerabilities.length}
          </p>
        </div>
        <div className="p-4 bg-gray-100 rounded-xl text-center border">
          <p className="text-[10px] text-gray-500 font-bold mb-1 tracking-tighter uppercase">
            Total Threats
          </p>
          <p className="text-2xl font-black text-gray-900">{threats.length}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-xl text-center border">
          <p className="text-[10px] text-gray-500 font-bold mb-1 tracking-tighter uppercase">
            Total Controls
          </p>
          <p className="text-2xl font-black text-gray-900">{controls.length}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-xl text-center border">
          <p className="text-[10px] text-gray-500 font-bold mb-1 tracking-tighter uppercase">
            Total Risks
          </p>
          <p className="text-2xl font-black text-gray-900">{risks.length}</p>
        </div>
      </div>

      {/* --- INTEGRATED DATA MATRICES --- */}
      <div className="space-y-6 pt-6">
        {/* 1. Asset / Vulnerability Matrix */}
        <Card className="p-6 border-none shadow-xl bg-white rounded-2xl">
          <div className="flex items-center gap-2 mb-4 border-b pb-2">
            <Database className="w-5 h-5 text-blue-600" />
            <h3 className="font-black text-sm text-gray-800 uppercase">
              Asset / Vulnerability Matrix
            </h3>
          </div>
          <div className="overflow-x-auto max-h-[420px]">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-2 text-[10px] font-black text-gray-500 uppercase">
                    Vulnerability
                  </th>
                  {assets.map((asset) => (
                    <th
                      key={asset.id}
                      className="p-2 text-[10px] font-black text-gray-500 uppercase"
                    >
                      {asset.name}
                    </th>
                  ))}
                  <th className="p-2 text-[10px] font-black text-gray-500 uppercase">
                    Aggregate
                  </th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {vulnerabilities.length > 0 ? (
                  Array.from(
                    new Map(
                      vulnerabilities.map((v) => [v.description, v]),
                    ).values(),
                  ).map((vuln, idx) => {
                    const relatedVulns = vulnerabilities.filter(
                      (v) => v.description === vuln.description,
                    );
                    const totalImpact = relatedVulns.reduce((sum, v) => {
                      return sum + getVulnerabilityImpact(v);
                    }, 0);

                    return (
                      <tr
                        key={idx}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-2 font-bold text-gray-700">
                          {vuln.description}
                        </td>
                        {assets.map((asset) => {
                          const relatedVuln = relatedVulns.find(
                            (v) => Array.isArray(v.assetIds) && v.assetIds.includes(asset.id),
                          );
                          const score = relatedVuln
                            ? getScore(relatedVuln.severity)
                            : 0;
                          return (
                            <td
                              key={asset.id}
                              className="p-2 font-semibold text-center text-gray-700"
                            >
                              {score}
                            </td>
                          );
                        })}
                        <td className="p-2 font-bold text-right text-[#EB1D29]">
                          Rp {totalImpact.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={assets.length + 2}
                      className="p-4 text-center text-gray-400 italic"
                    >
                      No vulnerabilities found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* 2. Vulnerability / Threat Matrix */}
        <Card className="p-6 border-none shadow-xl bg-white rounded-2xl">
          <div className="flex items-center gap-2 mb-4 border-b pb-2">
            <ShieldAlert className="w-5 h-5 text-orange-600" />
            <h3 className="font-black text-sm text-gray-800 uppercase">
              Vulnerability / Threat Matrix
            </h3>
          </div>
          <div className="overflow-x-auto max-h-[420px]">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-2 text-[10px] font-black text-gray-500 uppercase">
                    Threat
                  </th>
                  {vulnerabilities.map((vuln) => (
                    <th
                      key={vuln.description}
                      className="p-2 text-[10px] font-black text-gray-500 uppercase"
                    >
                      {vuln.description}
                    </th>
                  ))}
                  <th className="p-2 text-[10px] font-black text-gray-500 uppercase">
                    Aggregate
                  </th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {threats.length > 0 ? (
                  threats.map((threat, idx) => (
                    <tr
                      key={idx}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-2 font-bold text-gray-700">
                        {threat.name}
                      </td>
                      {vulnerabilities.map((vuln) => {
                        const score =
                          Array.isArray(threat.vulnerabilityIds) && threat.vulnerabilityIds.includes(vuln.id)
                            ? getScore(threat.probability)
                            : 0;
                        return (
                          <td
                            key={`${threat.id}-${vuln.description}`}
                            className="p-2 font-semibold text-center text-gray-700"
                          >
                            {score}
                          </td>
                        );
                      })}
                      <td className="p-2 font-bold text-right text-[#EB1D29]">
                        Rp {getThreatImpact(threat).toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={vulnerabilities.length + 2}
                      className="p-4 text-center text-gray-400 italic"
                    >
                      No threats found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* 3. Risk / Control Matrix */}
        <Card className="p-6 border-none shadow-xl bg-white rounded-2xl">
          <div className="flex items-center gap-2 mb-4 border-b pb-2">
            <Zap className="w-5 h-5 text-green-600" />
            <h3 className="font-black text-sm text-gray-800 uppercase">
              Risk / Control Matrix
            </h3>
          </div>
          <div className="overflow-x-auto max-h-[420px]">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-2 text-[10px] font-black text-gray-500 uppercase">
                    Control / Risk
                  </th>
                  {risks.map((risk) => (
                    <th
                      key={risk.id}
                      className="p-2 text-[10px] font-black text-gray-500 uppercase"
                    >
                      {risk.name}
                    </th>
                  ))}
                  <th className="p-2 text-[10px] font-black text-gray-500 uppercase">
                    Aggregate
                  </th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {controls.length > 0 ? (
                  controls.map((control, idx) => (
                    <tr
                      key={idx}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-2 font-bold text-gray-700 align-top">
                        <div className="leading-tight">{control.name}</div>
                        <div className="text-[10px] font-medium text-gray-500 leading-tight mt-1">
                          {getControlRiskNames(control) || "No linked risks"}
                        </div>
                      </td>
                      {risks.map((risk) => {
                        const score = (control.riskIds || []).includes(risk.id)
                          ? getScore(control.priority)
                          : 0;
                        return (
                          <td
                            key={`${control.id}-${risk.id}`}
                            className="p-2 font-semibold text-center text-gray-700"
                          >
                            {score}
                          </td>
                        );
                      })}
                      <td className="p-2 font-bold text-right text-[#EB1D29]">
                        Rp {getControlImpact(control).toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={risks.length + 2}
                      className="p-4 text-center text-gray-400 italic"
                    >
                      No controls found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
