// updated
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, DollarSign } from "lucide-react";
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
  const [controls, setControls] = useState<any[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [availableRisks, setAvailableRisks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    relatedRisk: "",
    priority: "",
    status: "Pending",
    estimatedCost: "", // Field baru
  });

  useEffect(() => {
    const savedRisks = localStorage.getItem(RISK_STORAGE_KEY);
    if (savedRisks) {
      setAvailableRisks(JSON.parse(savedRisks));
    }
  }, [showAddModal]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(controls));
  }, [controls]);

  const saveToStore = (data: any[]) => {
    setControls(data);
  };

  const handleSave = () => {
    if (!formData.name || !formData.type || !formData.relatedRisk) {
      alert("Please fill all required fields");
      return;
    }

    let autoProgress = 0;
    if (formData.status === "Completed") autoProgress = 100;
    else if (formData.status === "In Progress") autoProgress = 50;

    const finalFormData = {
      ...formData,
      progress: autoProgress
    };

    if (editingId) {
      const updated = controls.map((c) =>
        c.id === editingId ? { ...finalFormData, id: c.id } : c
      );
      saveToStore(updated);
    } else {
      const lastIdNum = controls.length > 0 
        ? parseInt(controls[controls.length - 1].id.split("-")[1]) 
        : 0;
      const newId = `C-${(lastIdNum + 1).toString().padStart(3, "0")}`;
      saveToStore([...controls, { ...finalFormData, id: newId }]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda ingin menghapus kontrol ini?")) {
      const filtered = controls.filter((c) => c.id !== id);
      saveToStore(filtered);
    }
  };

  const handleEdit = (control: any) => {
    setEditingId(control.id);
    setFormData({
      name: control.name,
      type: control.type,
      relatedRisk: control.relatedRisk,
      priority: control.priority,
      status: control.status,
      estimatedCost: control.estimatedCost || "", // Load data cost
    });
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingId(null);
    setFormData({ 
      name: "", 
      type: "", 
      relatedRisk: "", 
      priority: "", 
      status: "Pending",
      estimatedCost: "" 
    });
  };

  const filteredControls = controls.filter((control) => {
    const matchesSearch = control.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          control.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "" || control.type === typeFilter;
    const matchesStatus = statusFilter === "" || control.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Helper untuk format mata uang
  const formatCurrency = (value: string) => {
    if (!value) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(parseInt(value));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Control Management</h1>
          <p className="text-sm text-gray-600 mt-1">Menentukan dan melacak kontrol mitigasi untuk risiko yang teridentifikasi</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-[#EB1D29] hover:bg-[#EB1D29] text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Control
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search controls..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB1D29]"
            />
          </div>
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none bg-white"
          >
            <option value="">All Types</option>
            <option value="Prevent">Prevent</option>
            <option value="Detect">Detect</option>
            <option value="Recover">Recover</option>
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none bg-white"
          >
            <option value="">All Status</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </Card>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">ID</TableHead>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Related Risk</TableHead>
                <TableHead className="font-semibold">Cost Estimation</TableHead> {/* Kolom Baru */}
                <TableHead className="font-semibold">Priority</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredControls.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No controls found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredControls.map((control) => (
                  <TableRow key={control.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-[#EB1D29]">{control.id}</TableCell>
                    <TableCell className="font-medium">{control.name}</TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-0">
                        {control.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{control.relatedRisk}</TableCell>
                    <TableCell className="font-medium text-gray-700">
                      {formatCurrency(control.estimatedCost)}
                    </TableCell>
                    <TableCell>
                      <Badge className={`border-0 ${control.priority === "High" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>
                        {control.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`border-0 ${control.status === "Completed" ? "bg-green-100 text-green-800" : control.status === "In Progress" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}>
                        {control.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(control)}>
                          <Edit className="w-4 h-4 text-[#EB1D29]" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(control.id)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl p-6 m-4">
            <h3 className="text-xl font-bold mb-6 text-gray-900 border-b pb-4">
              {editingId ? "Edit Control" : "Add New Control"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#EB1D29]"
                  placeholder="Password policy"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white"
                  >
                    <option value="">Select Type</option>
                    <option value="Prevent">Prevent</option>
                    <option value="Detect">Detect</option>
                    <option value="Recover">Recover</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select 
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white"
                  >
                    <option value="">Select Priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              {/* Field Estimasi Biaya Baru */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">
                    Rp
                  </div>
                  <input
                    type="number"
                    value={formData.estimatedCost}
                    onChange={(e) => setFormData({...formData, estimatedCost: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#EB1D29]"
                    placeholder="500000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Related Risk</label>
                <select 
                  value={formData.relatedRisk}
                  onChange={(e) => setFormData({...formData, relatedRisk: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white"
                >
                  <option value="">Select Risk</option>
                  {availableRisks.map((risk) => (
                    <option key={risk.id} value={risk.name}>
                      {risk.id} - {risk.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} className="flex-1 bg-[#EB1D29] hover:bg-[#EB1D29] text-white">
                  {editingId ? "Update Control" : "Confirm Control"}
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleCloseModal}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
