import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Calculator, AlertCircle } from "lucide-react";
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
const VULN_KEY = "richeese_vulnerabilities";
const THREAT_KEY = "richeese_threat_catalog";

export function RiskManagement() {
  const [risks, setRisks] = useState<any[]>([]);
  const [availableAssets, setAvailableAssets] = useState<any[]>([]);
  const [availableVulns, setAvailableVulns] = useState<any[]>([]);
  const [availableThreats, setAvailableThreats] = useState<any[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    asset: "",
    vulnerability: "",
    threat: "",
    category: "",
    likelihood: 1,
    impact: 1
  });

  useEffect(() => {
    const savedRisks = localStorage.getItem(STORAGE_KEY);
    if (savedRisks) setRisks(JSON.parse(savedRisks));

    const savedAssets = localStorage.getItem(ASSET_KEY);
    if (savedAssets) setAvailableAssets(JSON.parse(savedAssets));

    const savedVulns = localStorage.getItem(VULN_KEY);
    if (savedVulns) setAvailableVulns(JSON.parse(savedVulns));

    const savedThreats = localStorage.getItem(THREAT_KEY);
    if (savedThreats) setAvailableThreats(JSON.parse(savedThreats));
  }, [showAddModal]);

  const persistData = (newData: any[]) => {
    setRisks(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };

  const calculateRiskScore = (l: number, i: number) => l * i;
  const getRiskLevel = (score: number) => {
    if (score <= 2) return "Low";
    if (score <= 4) return "Medium";
    return "High";
  };

  const handleSave = () => {
    if (!formData.name || !formData.category) return;

    const score = calculateRiskScore(formData.likelihood, formData.impact);
    const level = getRiskLevel(score);

    let updatedRisks;
    if (editingId) {
      updatedRisks = risks.map((r) =>
        r.id === editingId ? { ...formData, id: r.id, score, level } : r
      );
    } else {
      let nextNumber = 1;
      if (risks.length > 0) {
        const lastEntry = risks[risks.length - 1];
        const lastIdParts = lastEntry.id.split("-");
        nextNumber = lastIdParts.length > 1 ? parseInt(lastIdParts[1]) + 1 : risks.length + 1;
      }
      const newId = `R-${nextNumber.toString().padStart(3, "0")}`;
      updatedRisks = [...risks, { ...formData, id: newId, score, level }];
    }

    persistData(updatedRisks);
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus risiko ini?")) {
      persistData(risks.filter((r) => r.id !== id));
    }
  };

  const handleEdit = (risk: any) => {
    setEditingId(risk.id);
    setFormData(risk);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingId(null);
    setFormData({
      name: "", asset: "", vulnerability: "", threat: "",
      category: "", likelihood: 1, impact: 1
    });
  };

  const filteredRisks = risks.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Risk Management</h1>
          <p className="text-sm text-gray-500">Assess and monitor organizational risks</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white flex items-center gap-2 shadow-sm">
          <Plus className="w-4 h-4" /> Add Risk
        </Button>
      </div>

      <Card className="p-4 border-none shadow-sm bg-white/50 backdrop-blur-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search risks..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-[#1e3a8a]/10 transition-all"
          />
        </div>
      </Card>

      <Card className="overflow-hidden border-none shadow-sm bg-white">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="font-bold text-gray-700 w-[80px]">ID</TableHead>
              <TableHead className="font-bold text-gray-700">Name</TableHead>
              <TableHead className="font-bold text-gray-700">Category</TableHead>
              <TableHead className="font-bold text-gray-700 text-center">L x I</TableHead>
              <TableHead className="font-bold text-gray-700 text-center">Score</TableHead>
              <TableHead className="font-bold text-gray-700">Level</TableHead>
              {/* Kolom Status telah dihapus */}
              <TableHead className="font-bold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRisks.length > 0 ? (
              filteredRisks.map((risk) => (
                <TableRow key={risk.id} className="group hover:bg-gray-50/50 transition-colors">
                  <TableCell className="font-bold text-[#1e3a8a]">{risk.id}</TableCell>
                  <TableCell className="font-medium text-gray-900">{risk.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal text-gray-500 border-gray-200">
                      {risk.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center text-gray-400 font-mono text-xs">
                    {risk.likelihood} × {risk.impact}
                  </TableCell>
                  <TableCell className="text-center font-bold text-gray-700">
                    {risk.score}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={`
                        ${risk.level === "High" ? "bg-red-50 text-red-700 border-red-100" : 
                          risk.level === "Medium" ? "bg-yellow-50 text-yellow-700 border-yellow-100" : 
                          "bg-green-50 text-green-700 border-green-100"} 
                        border font-bold shadow-none
                      `}
                    >
                      {risk.level}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-1">
                      <Button 
                        variant="ghost" size="sm" 
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        onClick={() => handleEdit(risk)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" size="sm" 
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        onClick={() => handleDelete(risk.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <AlertCircle className="w-12 h-12 mb-3 opacity-10" />
                    <p className="text-lg font-semibold text-gray-300">No risk assessments found</p>
                    <p className="text-sm opacity-60">Click "Add Risk" to start your first assessment.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl p-6 shadow-2xl border-none">
            <h3 className="text-xl font-bold mb-6 text-gray-900 border-b pb-4">
              {editingId ? "Update Risk Assessment" : "Add New Risk"}
            </h3>
            
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Name</label>
                  <input 
                    type="text" value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#1e3a8a] transition-all" 
                    placeholder="e.g. Data Breach"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Category</label>
                  <select 
                    value={formData.category} 
                    onChange={(e) => setFormData({...formData, category: e.target.value})} 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#1e3a8a] bg-white transition-all"
                  >
                    <option value="">Select Category</option>
                    <option value="Power">Power</option>
                    <option value="Network">Network</option>
                    <option value="Human Error">Human Error</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Asset</label>
                <select value={formData.asset} onChange={(e) => setFormData({...formData, asset: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none bg-white">
                  <option value="">Select Asset</option>
                  {availableAssets.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Vulnerability</label>
                  <select value={formData.vulnerability} onChange={(e) => setFormData({...formData, vulnerability: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none bg-white">
                    <option value="">Select Vulnerability</option>
                    {availableVulns.map(v => <option key={v.id} value={v.description}>{v.description}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Threat</label>
                  <select value={formData.threat} onChange={(e) => setFormData({...formData, threat: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none bg-white">
                    <option value="">Select Threat</option>
                    {availableThreats.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 mb-4 font-bold text-gray-700 text-xs"><Calculator className="w-4 h-4 text-[#1e3a8a]" /> Risk Matrix Selection</div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold text-gray-500">
                       <span>Likelihood</span>
                       <span className="text-[#1e3a8a]">{formData.likelihood}</span>
                    </div>
                    <input type="range" min="1" max="3" step="1" value={formData.likelihood} onChange={(e) => setFormData({...formData, likelihood: Number(e.target.value)})} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1e3a8a]" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold text-gray-500">
                       <span>Impact</span>
                       <span className="text-[#1e3a8a]">{formData.impact}</span>
                    </div>
                    <input type="range" min="1" max="3" step="1" value={formData.impact} onChange={(e) => setFormData({...formData, impact: Number(e.target.value)})} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1e3a8a]" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} className="flex-1 bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-bold h-11 shadow-sm">
                  {editingId ? "Save changes" : "Confirm"}
                </Button>
                <Button variant="outline" className="flex-1 font-bold h-11 border-gray-200 text-gray-500" onClick={handleCloseModal}>Cancel</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
