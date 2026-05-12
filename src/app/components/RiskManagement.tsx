import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Calculator, ShieldCheck, X } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const STORAGE_KEY = "richeese_risk_management_data";
const ASSET_KEY = "richeese_assets";
const THREAT_KEY = "richeese_threat_catalog";
const VULN_KEY = "richeese_vulnerabilities";
const CONTROL_KEY = "richeese_control_data";

export function RiskManagement() {
  const [risks, setRisks] = useState<any[]>([]);
  const [availableAssets, setAvailableAssets] = useState<any[]>([]);
  const [availableThreats, setAvailableThreats] = useState<any[]>([]);
  const [availableVulns, setAvailableVulns] = useState<any[]>([]);
  const [availableControls, setAvailableControls] = useState<any[]>([]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // LOGIKA: assetId dihapus dari formData karena akan diambil otomatis dari Threat
  const [formData, setFormData] = useState({
    name: "",
    threatIds: [] as string[],
    category: "Operational",
    likelihood: 1,
    impact: 1,
    treatment: "Mitigate",
  });

  useEffect(() => {
    const loadData = () => {
      const r = localStorage.getItem(STORAGE_KEY);
      const a = localStorage.getItem(ASSET_KEY);
      const t = localStorage.getItem(THREAT_KEY);
      const v = localStorage.getItem(VULN_KEY);
      const c = localStorage.getItem(CONTROL_KEY);

      if (r) setRisks(JSON.parse(r));
      if (a) setAvailableAssets(JSON.parse(a));
      if (t) setAvailableThreats(JSON.parse(t));
      if (v) setAvailableVulns(JSON.parse(v));
      if (c) setAvailableControls(JSON.parse(c));
    };

    loadData();
    window.addEventListener("richeese:data-updated", loadData);
    window.addEventListener("storage", loadData);
    return () => {
      window.removeEventListener("richeese:data-updated", loadData);
      window.removeEventListener("storage", loadData);
    };
  }, []);

  // Mendapatkan assetId berdasarkan threat yang dipilih secara otomatis
  const autoResolveAssetId = (threatIds: string[]) => {
    if (threatIds.length === 0) return "";
    const firstThreat = availableThreats.find(t => t.id === threatIds[0]);
    if (!firstThreat) return "";
    
    const linkedVuln = availableVulns.find(v => (firstThreat.vulnerabilityIds || []).includes(v.id));
    if (!linkedVuln) return "";

    return (linkedVuln.assetIds && linkedVuln.assetIds.length > 0) ? linkedVuln.assetIds[0] : "";
  };

  const handleSave = () => {
    if (!formData.name || formData.threatIds.length === 0) {
      alert("Harap lengkapi nama risiko dan pilih minimal satu ancaman.");
      return;
    }

    const score = formData.likelihood * formData.impact;
    let level = score >= 6 ? "High" : score >= 3 ? "Medium" : "Low";
    
    // Simpan assetId yang didapat dari threat secara otomatis
    const resolvedAssetId = autoResolveAssetId(formData.threatIds);

    let updatedRisks;
    if (editingId) {
      updatedRisks = risks.map((r) => r.id === editingId ? { ...formData, assetId: resolvedAssetId, id: r.id, score, level } : r);
    } else {
      let nextNumber = 1;
      if (risks.length > 0) {
        const currentIds = risks.map(r => {
            const parts = r.id.split("-");
            return parts.length > 1 ? parseInt(parts[1]) : 0;
        });
        nextNumber = Math.max(...currentIds, 0) + 1;
      }
      const newId = `R-${nextNumber.toString().padStart(3, "0")}`;
      updatedRisks = [...risks, { ...formData, assetId: resolvedAssetId, id: newId, score, level }];
    }

    setRisks(updatedRisks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRisks));
    window.dispatchEvent(new Event("richeese:data-updated"));
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: "", threatIds: [], category: "Operational", likelihood: 1, impact: 1, treatment: "Mitigate" });
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus risiko ini?")) {
      const filtered = risks.filter((r) => r.id !== id);
      setRisks(filtered);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      window.dispatchEvent(new Event("richeese:data-updated"));
    }
  };

  const getAssetName = (id: string) => availableAssets.find(a => a.id === id)?.name || "Auto-detected";
  
  const getMitigatingControls = (riskId: string) => {
    return availableControls.filter(control => (control.riskIds || []).includes(riskId));
  };

  const toggleThreatSelection = (id: string) => {
    setFormData(prev => {
        const isSelected = prev.threatIds.includes(id);
        if (isSelected) {
            return { ...prev, threatIds: prev.threatIds.filter(tid => tid !== id) };
        } else {
            return { ...prev, threatIds: [...prev.threatIds, id] };
        }
    });
  };

  const getThreatConnections = (threat: any) => {
    const linkedVulns = availableVulns.filter(v => (threat.vulnerabilityIds || []).includes(v.id));
    const linkedAssets = availableAssets.filter(a => 
      linkedVulns.some(v => (v.assetIds || []).includes(a.id))
    );
    
    return {
      vulns: linkedVulns.map(v => v.description).join(", "),
      assets: linkedAssets.map(a => a.name).join(", ")
    };
  };

  const filteredRisks = risks.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === "" || r.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Risk Management</h1>
          <p className="text-sm text-gray-500 mt-1">Analisis risiko berdasarkan ancaman dan kerentanan aset</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="bg-[#EB1D29] hover:bg-[#c11721] text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Risk
        </Button>
      </div>

      <Card className="p-4 bg-white border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search risk name..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#EB1D29]/10 outline-none"
            />
          </div>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-sm"
          >
            <option value="">All Risk Levels</option>
            <option value="High">High Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="Low">Low Risk</option>
          </select>
        </div>
      </Card>

      <Card className="overflow-x-auto border-none shadow-sm bg-white">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-bold">ID</TableHead>
              <TableHead className="font-bold">Risk Name</TableHead>
              <TableHead className="font-bold">Asset</TableHead>
              <TableHead className="font-bold">Mitigating Controls</TableHead>
              <TableHead className="font-bold text-center">Score</TableHead>
              <TableHead className="font-bold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRisks.length > 0 ? (
              filteredRisks.map((risk) => (
                <TableRow key={risk.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-bold text-[#EB1D29]">{risk.id}</TableCell>
                  <TableCell className="font-medium text-gray-900">{risk.name}</TableCell>
                  <TableCell className="text-sm text-gray-500">{getAssetName(risk.assetId)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {getMitigatingControls(risk.id).map((c, i) => (
                        <Badge key={i} className="bg-green-50 text-green-700 border-green-100 text-[10px]">
                          <ShieldCheck className="w-2.5 h-2.5 mr-1" /> {c.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={
                        risk.level === "High" ? "bg-red-500 text-white" :
                        risk.level === "Medium" ? "bg-amber-500 text-white" : "bg-green-500 text-white"
                    }>
                        {risk.score} ({risk.level})
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => { setEditingId(risk.id); setFormData(risk); setShowModal(true); }}><Edit className="w-4 h-4 text-[#EB1D29]" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(risk.id)}><Trash2 className="w-4 h-4 text-red-600" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
                <TableRow><TableCell colSpan={6} className="text-center py-10 text-gray-400">No data found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">{editingId ? "Update Risk Assessment" : "New Risk Assessment"}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1 uppercase">Risk Name</label>
                  <input
                    type="text" value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Contoh: Kebocoran database"
                    className="w-full px-4 py-2 border rounded-lg focus:border-[#EB1D29] outline-none"
                  />
                </div>
                
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1 uppercase tracking-wider">Related Threats (Select Multiple)</label>
                  <div className="border rounded-lg p-2 max-h-[220px] overflow-y-auto bg-gray-50 space-y-1">
                    {availableThreats.length > 0 ? (
                        availableThreats.map((t) => {
                            const connections = getThreatConnections(t);
                            return (
                                <label key={t.id} className="flex items-start gap-2 px-2 py-2 hover:bg-white rounded cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.threatIds.includes(t.id)}
                                        onChange={() => toggleThreatSelection(t.id)}
                                        className="mt-1 accent-[#EB1D29]"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-700">{t.name}</span>
                                        <div className="flex flex-col gap-0.5 mt-1">
                                            <div className="flex items-center gap-1">
                                                <Badge variant="outline" className="px-1 py-0 text-[9px] bg-red-50 text-red-600 border-red-100">Vuln</Badge>
                                                <span className="text-[10px] text-gray-500 truncate max-w-[180px]">{connections.vulns || "No linked vulnerability"}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Badge variant="outline" className="px-1 py-0 text-[9px] bg-blue-50 text-blue-600 border-blue-100">Asset</Badge>
                                                <span className="text-[10px] text-gray-500 truncate max-w-[180px]">{connections.assets || "No linked asset"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </label>
                            );
                        })
                    ) : (
                        <p className="text-xs text-gray-400 p-2 text-center">No threats found</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100 h-fit">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Risk Score Calculation</div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase">
                        <span>Likelihood (1-3)</span>
                        <span className="text-[#EB1D29] text-sm">{formData.likelihood}</span>
                    </div>
                    <input type="range" min="1" max="3" step="1" value={formData.likelihood} onChange={(e) => setFormData({...formData, likelihood: Number(e.target.value)})} className="w-full accent-[#EB1D29]" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase">
                        <span>Impact (1-3)</span>
                        <span className="text-[#EB1D29] text-sm">{formData.impact}</span>
                    </div>
                    <input type="range" min="1" max="3" step="1" value={formData.impact} onChange={(e) => setFormData({...formData, impact: Number(e.target.value)})} className="w-full accent-[#EB1D29]" />
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Total Score</p>
                        <p className="text-3xl font-black text-gray-900">{formData.likelihood * formData.impact}</p>
                    </div>
                    <Badge className={`h-8 px-4 text-xs font-bold ${
                        (formData.likelihood * formData.impact) >= 6 ? "bg-red-500 text-white" :
                        (formData.likelihood * formData.impact) >= 3 ? "bg-amber-500 text-white" : "bg-green-500 text-white"
                    }`}>
                        {(formData.likelihood * formData.impact) >= 6 ? "High" : (formData.likelihood * formData.impact) >= 3 ? "Medium" : "Low"}
                    </Badge>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6 mt-8 border-t">
              <Button onClick={handleSave} className="flex-1 bg-[#EB1D29] hover:bg-[#c11721] text-white font-bold h-12 shadow-lg transition-all">
                {editingId ? "Update Risk" : "Confirm Risk"}
              </Button>
              <Button variant="outline" onClick={closeModal} className="flex-1 font-bold h-12">Cancel</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
