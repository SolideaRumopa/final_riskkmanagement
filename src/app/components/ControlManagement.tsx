import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, X, ShieldCheck } from "lucide-react";
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

const STORAGE_KEY = "richeese_control_data";
const RISK_STORAGE_KEY = "richeese_risk_management_data";

export function ControlManagement() {
  const [controls, setControls] = useState<any[]>([]);
  const [availableRisks, setAvailableRisks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // LOGIKA BARU: riskIds dalam bentuk array (Many-to-Many)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    riskIds: [] as string[],
    priority: "",
    status: "Pending",
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setControls(JSON.parse(saved));

    const savedRisks = localStorage.getItem(RISK_STORAGE_KEY);
    if (savedRisks) setAvailableRisks(JSON.parse(savedRisks));
  }, [showAddModal]);

  const handleSave = () => {
    if (!formData.name || !formData.type || formData.riskIds.length === 0) {
      alert("Harap lengkapi nama, tipe, dan pilih minimal satu risiko terkait.");
      return;
    }

    let updatedControls;
    if (editingId) {
      updatedControls = controls.map((c) =>
        c.id === editingId ? { ...formData, id: c.id } : c
      );
    } else {
      let nextNumber = 1;
      if (controls.length > 0) {
        const currentIds = controls.map(c => {
            const parts = c.id.split("-");
            return parts.length > 1 ? parseInt(parts[1]) : 0;
        });
        nextNumber = Math.max(...currentIds, 0) + 1;
      }
      const newId = `C-${nextNumber.toString().padStart(3, "0")}`;
      updatedControls = [...controls, { ...formData, id: newId }];
    }

    setControls(updatedControls);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedControls));
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus kontrol ini?")) {
      const filtered = controls.filter((c) => c.id !== id);
      setControls(filtered);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
  };

  const handleEdit = (control: any) => {
    setEditingId(control.id);
    setFormData({
      name: control.name,
      type: control.type,
      riskIds: control.riskIds || (control.relatedRisk ? [control.relatedRisk] : []),
      priority: control.priority,
      status: control.status,
    });
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingId(null);
    setFormData({ name: "", type: "", riskIds: [], priority: "", status: "Pending" });
  };

  const toggleRiskSelection = (riskId: string) => {
    setFormData(prev => {
        const isSelected = prev.riskIds.includes(riskId);
        if (isSelected) {
            return { ...prev, riskIds: prev.riskIds.filter(id => id !== riskId) };
        } else {
            return { ...prev, riskIds: [...prev.riskIds, riskId] };
        }
    });
  };

  const getRiskNames = (ids: string[]) => {
    return (ids || []).map(id => {
        const risk = availableRisks.find(r => r.id === id);
        return risk ? risk.name : "Unknown Risk";
    });
  };

  const filteredControls = controls.filter((c) => {
    const riskNames = getRiskNames(c.riskIds || []);
    const matchesSearch = 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        riskNames.some(n => n.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === "" || c.type === typeFilter;
    const matchesStatus = statusFilter === "" || c.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Control Management</h1>
          <p className="text-sm text-gray-500 mt-1">Daftar kontrol keamanan untuk mitigasi risiko</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-[#EB1D29] hover:bg-[#c11721] text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Control
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
              placeholder="Search controls or related risks..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#EB1D29]/10"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-sm"
          >
            <option value="">All Types</option>
            <option value="Preventive">Preventive</option>
            <option value="Detective">Detective</option>
            <option value="Corrective">Corrective</option>
          </select>
        </div>
      </Card>

      <Card className="overflow-hidden border-none shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-bold">ID</TableHead>
              <TableHead className="font-bold">Control Name</TableHead>
              <TableHead className="font-bold">Type</TableHead>
              <TableHead className="font-bold">Related Risks</TableHead>
              <TableHead className="font-bold text-center">Status</TableHead>
              <TableHead className="font-bold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredControls.length > 0 ? (
              filteredControls.map((control) => (
                <TableRow key={control.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-bold text-[#EB1D29]">{control.id}</TableCell>
                  <TableCell className="font-medium text-gray-900">{control.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-gray-600">{control.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[250px]">
                        {getRiskNames(control.riskIds || []).map((name, i) => (
                            <Badge key={i} variant="secondary" className="bg-orange-50 text-orange-700 text-[10px] border-none">
                                {name}
                            </Badge>
                        ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={
                      control.status === "Completed" ? "bg-green-100 text-green-700" :
                      control.status === "In Progress" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                    }>
                      {control.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(control)}><Edit className="w-4 h-4 text-red-600" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(control.id)}><Trash2 className="w-4 h-4 text-red-600" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-gray-400">No data found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">{editingId ? "Update Control" : "New Control"}</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1 uppercase">Control Name</label>
                <input
                  type="text" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Implementasi Firewall"
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[#EB1D29]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1 uppercase">Control Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg bg-white outline-none focus:border-[#EB1D29]"
                >
                  <option value="">Select Type</option>
                  <option value="Preventive">Preventive</option>
                  <option value="Detective">Detective</option>
                  <option value="Corrective">Corrective</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1 uppercase">Related Risks (Select Multiple)</label>
                <div className="border rounded-lg p-2 max-h-[150px] overflow-y-auto bg-gray-50 space-y-1">
                    {availableRisks.length > 0 ? (
                        availableRisks.map((risk) => (
                            <label key={risk.id} className="flex items-center gap-2 px-2 py-1.5 hover:bg-white rounded cursor-pointer transition-colors">
                                <input 
                                    type="checkbox" 
                                    checked={formData.riskIds.includes(risk.id)}
                                    onChange={() => toggleRiskSelection(risk.id)}
                                    className="accent-[#EB1D29]"
                                />
                                <span className="text-sm text-gray-700">{risk.id} - {risk.name}</span>
                            </label>
                        ))
                    ) : (
                        <p className="text-xs text-gray-400 p-2 text-center">No risks available</p>
                    )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1 uppercase">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t mt-4">
                <Button onClick={handleSave} className="flex-1 bg-[#EB1D29] hover:bg-[#c11721] text-white font-bold py-6 shadow-lg">
                  {editingId ? "Update Control" : "Confirm Control"}
                </Button>
                <Button variant="outline" onClick={handleCloseModal} className="flex-1 py-6">Cancel</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
