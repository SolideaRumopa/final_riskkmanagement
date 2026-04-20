import { useState } from "react";
import { Plus, Edit, Trash2, Search, Calculator, X, AlertTriangle, AlertCircle, CheckCircle, Copy } from "lucide-react";
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
import { toast } from "sonner";

const initialRisks = [
  {
    id: "R-001",
    name: "Ketiadaan Genset Cadangan",
    asset: "Power System",
    vulnerability: "No backup power",
    threat: "Power outage >4 hours",
    category: "Power",
    likelihood: 3,
    impact: 3,
    score: 9,
    level: "High",
    status: "In Progress",
  },
  {
    id: "R-002",
    name: "Jaringan Internet Buruk",
    asset: "Network Infrastructure",
    vulnerability: "Single ISP, weak signal",
    threat: "Connection loss",
    category: "Network",
    likelihood: 3,
    impact: 2,
    score: 6,
    level: "Medium",
    status: "Mitigated",
  },
  {
    id: "R-003",
    name: "Single Point of Failure - Server",
    asset: "Main Server",
    vulnerability: "No redundancy",
    threat: "Server crash",
    category: "Network",
    likelihood: 3,
    impact: 3,
    score: 9,
    level: "High",
    status: "Not Started",
  },
];

export function RiskManagement() {
  const [risks, setRisks] = useState(initialRisks);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRisk, setEditingRisk] = useState<any>(null);
  const [likelihood, setLikelihood] = useState(1);
  const [impact, setImpact] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    asset: "",
    vulnerability: "",
    threat: "",
    category: "",
    name: "",
  });

  const calculateRiskScore = () => likelihood * impact;
  const getRiskLevel = (score: number) => {
    if (score <= 2) return "Low";
    if (score <= 4) return "Medium";
    return "High";
  };

  const filteredRisks = risks.filter((risk) => {
    const matchesSearch =
      risk.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      risk.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "" || risk.category === categoryFilter;
    const matchesLevel = levelFilter === "" || risk.level === levelFilter;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const handleAddRisk = () => {
    if (!formData.asset || !formData.vulnerability || !formData.threat || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newRisk = {
      id: `R-${String(risks.length + 1).padStart(3, "0")}`,
      name: formData.name || `${formData.asset} - ${formData.vulnerability}`,
      asset: formData.asset,
      vulnerability: formData.vulnerability,
      threat: formData.threat,
      category: formData.category,
      likelihood,
      impact,
      score: calculateRiskScore(),
      level: getRiskLevel(calculateRiskScore()),
      status: "Not Started",
    };

    setRisks([...risks, newRisk]);
    toast.success("Risk added successfully!");
    resetForm();
    setShowAddModal(false);
  };

  const handleEditRisk = (risk: any) => {
    setEditingRisk(risk);
    setFormData({
      asset: risk.asset,
      vulnerability: risk.vulnerability,
      threat: risk.threat,
      category: risk.category,
      name: risk.name,
    });
    setLikelihood(risk.likelihood);
    setImpact(risk.impact);
    setShowEditModal(true);
  };

  const handleUpdateRisk = () => {
    if (!formData.asset || !formData.vulnerability || !formData.threat || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    const updatedRisks = risks.map((risk) =>
      risk.id === editingRisk.id
        ? {
            ...risk,
            name: formData.name || `${formData.asset} - ${formData.vulnerability}`,
            asset: formData.asset,
            vulnerability: formData.vulnerability,
            threat: formData.threat,
            category: formData.category,
            likelihood,
            impact,
            score: calculateRiskScore(),
            level: getRiskLevel(calculateRiskScore()),
            status: editingRisk.status,
          }
        : risk
    );

    setRisks(updatedRisks);
    toast.success("Risk updated successfully!");
    resetForm();
    setShowEditModal(false);
    setEditingRisk(null);
  };

  const handleDeleteRisk = (riskId: string) => {
    setRisks(risks.filter((risk) => risk.id !== riskId));
    toast.success("Risk deleted successfully!");
  };

  const handleDuplicateRisk = (risk: any) => {
    const newRisk = {
      ...risk,
      id: `R-${String(risks.length + 1).padStart(3, "0")}`,
      name: `${risk.name} (Copy)`,
      status: "Not Started",
    };
    setRisks([...risks, newRisk]);
    toast.success("Risk duplicated successfully!");
  };

  const resetForm = () => {
    setFormData({
      asset: "",
      vulnerability: "",
      threat: "",
      category: "",
      name: "",
    });
    setLikelihood(1);
    setImpact(1);
  };

  const highRisks = risks.filter((r) => r.level === "High").length;
  const mediumRisks = risks.filter((r) => r.level === "Medium").length;
  const lowRisks = risks.filter((r) => r.level === "Low").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Risk Management - Interactive
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Complete end-to-end risk assessment and tracking with real-time notifications
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
            toast.info("Fill in the form to add a new risk");
          }}
          className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add Risk
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          className={`p-4 cursor-pointer hover:shadow-lg transition-all hover:scale-105 active:scale-95 ${
            levelFilter === "High" ? "ring-4 ring-red-300 shadow-lg" : ""
          }`}
          onClick={() => {
            if (levelFilter === "High") {
              setLevelFilter("");
              toast.info("Showing all risks");
            } else {
              setLevelFilter("High");
              toast.info("Showing High risk items");
            }
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Risk</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{highRisks}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card
          className={`p-4 cursor-pointer hover:shadow-lg transition-all hover:scale-105 active:scale-95 ${
            levelFilter === "Medium" ? "ring-4 ring-yellow-300 shadow-lg" : ""
          }`}
          onClick={() => {
            if (levelFilter === "Medium") {
              setLevelFilter("");
              toast.info("Showing all risks");
            } else {
              setLevelFilter("Medium");
              toast.info("Showing Medium risk items");
            }
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Medium Risk</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">{mediumRisks}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card
          className={`p-4 cursor-pointer hover:shadow-lg transition-all hover:scale-105 active:scale-95 ${
            levelFilter === "Low" ? "ring-4 ring-green-300 shadow-lg" : ""
          }`}
          onClick={() => {
            if (levelFilter === "Low") {
              setLevelFilter("");
              toast.info("Showing all risks");
            } else {
              setLevelFilter("Low");
              toast.info("Showing Low risk items");
            }
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Risk</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{lowRisks}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              placeholder="Search risks by name or category..."
              className="w-full pl-10 pr-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              toast.info(
                e.target.value
                  ? `Filtered by category: ${e.target.value}`
                  : "Showing all categories"
              );
            }}
            className="px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Categories</option>
            <option value="Power">Power</option>
            <option value="Network">Network</option>
            <option value="Human Error">Human Error</option>
          </select>
          <select
            value={levelFilter}
            onChange={(e) => {
              setLevelFilter(e.target.value);
              toast.info(
                e.target.value
                  ? `Filtered by level: ${e.target.value}`
                  : "Showing all risk levels"
              );
            }}
            className="px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Risk Levels</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          {(searchTerm || categoryFilter || levelFilter) && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("");
                setLevelFilter("");
                toast.success("All filters cleared");
              }}
              className="border-primary text-primary hover:bg-rose-50"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </Card>

      {/* Risks Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredRisks.length}</span> of{" "}
            <span className="font-semibold text-gray-900">{risks.length}</span> risks
          </p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Risk ID</TableHead>
                <TableHead className="font-semibold">Risk Name</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">L × I</TableHead>
                <TableHead className="font-semibold">Score</TableHead>
                <TableHead className="font-semibold">Level</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRisks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No risks found. Try adjusting your filters or add a new risk.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRisks.map((risk) => (
                <TableRow key={risk.id} className="hover:bg-rose-50">
                  <TableCell
                    className="font-medium text-primary cursor-pointer hover:underline"
                    onClick={() => {
                      toast.info(
                        `${risk.id}: ${risk.name} | Asset: ${risk.asset} | Status: ${risk.status}`
                      );
                    }}
                  >
                    {risk.id}
                  </TableCell>
                  <TableCell className="font-medium">{risk.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-accent transition-all hover:scale-110"
                      onClick={() => {
                        setCategoryFilter(risk.category);
                        toast.info(`Filtered by category: ${risk.category}`);
                      }}
                      title="Click to filter by this category"
                    >
                      {risk.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {risk.likelihood} × {risk.impact}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        risk.level === "High"
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : risk.level === "Medium"
                          ? "bg-yellow-600 text-white hover:bg-yellow-700"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {risk.score}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`border-0 cursor-pointer transition-all hover:scale-110 ${
                        risk.level === "High"
                          ? "bg-red-100 text-red-800 hover:bg-red-200"
                          : risk.level === "Medium"
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                          : "bg-green-100 text-green-800 hover:bg-green-200"
                      }`}
                      onClick={() => {
                        toast.info(`Risk Level: ${risk.level} (Score: ${risk.score})`);
                      }}
                      title="Click to see risk details"
                    >
                      {risk.level}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`border-0 cursor-pointer transition-all ${
                        risk.status === "Mitigated"
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : risk.status === "In Progress"
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }`}
                      onClick={() => {
                        const newStatus =
                          risk.status === "Not Started"
                            ? "In Progress"
                            : risk.status === "In Progress"
                            ? "Mitigated"
                            : "Not Started";
                        setRisks(
                          risks.map((r) =>
                            r.id === risk.id ? { ...r, status: newStatus } : r
                          )
                        );
                        toast.success(`Status changed to: ${newStatus}`);
                      }}
                    >
                      {risk.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-accent hover:scale-110 transition-transform active:scale-95"
                        onClick={() => {
                          handleEditRisk(risk);
                          toast.info("Opening edit form...");
                        }}
                        title="Edit risk"
                      >
                        <Edit className="w-4 h-4 text-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-accent hover:scale-110 transition-transform active:scale-95"
                        onClick={() => {
                          handleDuplicateRisk(risk);
                        }}
                        title="Duplicate risk"
                      >
                        <Copy className="w-4 h-4 text-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-red-50 hover:scale-110 transition-transform active:scale-95"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${risk.name}?`)) {
                            handleDeleteRisk(risk.id);
                          } else {
                            toast.info("Delete cancelled");
                          }
                        }}
                        title="Delete risk"
                      >
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

      {/* Add Risk Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto animate-in fade-in duration-200">
          <Card className="w-full max-w-3xl p-6 m-4 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setShowAddModal(false);
                resetForm();
                toast.info("Add risk cancelled");
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-primary hover:bg-accent rounded-full p-1 transition-all hover:scale-110 active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add New Risk Assessment
            </h3>
            <div className="space-y-4">
              {/* Risk Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Risk Name (Optional)
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Auto-generated if left empty"
                  className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Asset Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asset *
                </label>
                <select
                  value={formData.asset}
                  onChange={(e) =>
                    setFormData({ ...formData, asset: e.target.value })
                  }
                  className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select asset</option>
                  <option value="Power System">Power System</option>
                  <option value="Main Server">Main Server</option>
                  <option value="POS System">POS System</option>
                  <option value="Network Infrastructure">Network Infrastructure</option>
                </select>
              </div>

              {/* Vulnerability Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vulnerability *
                </label>
                <select
                  value={formData.vulnerability}
                  onChange={(e) =>
                    setFormData({ ...formData, vulnerability: e.target.value })
                  }
                  className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select vulnerability</option>
                  <option value="No backup power">No backup power source</option>
                  <option value="No redundancy">No server redundancy</option>
                  <option value="Single ISP">Single ISP connection</option>
                  <option value="Outdated software">Outdated software</option>
                </select>
              </div>

              {/* Threat Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Threat *
                </label>
                <select
                  value={formData.threat}
                  onChange={(e) =>
                    setFormData({ ...formData, threat: e.target.value })
                  }
                  className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select threat</option>
                  <option value="Power outage >4 hours">Power outage &gt;4 hours</option>
                  <option value="Server crash">Server crash</option>
                  <option value="Network failure">Network failure</option>
                  <option value="Data breach">Data breach</option>
                </select>
              </div>

              {/* Risk Calculation Section */}
              <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold text-gray-900">Risk Calculation</h4>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Likelihood (1-3) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="3"
                      value={likelihood}
                      onChange={(e) => setLikelihood(Number(e.target.value))}
                      className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      1=Low, 2=Medium, 3=High
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Impact (1-3) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="3"
                      value={impact}
                      onChange={(e) => setImpact(Number(e.target.value))}
                      className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      1=Low, 2=Medium, 3=High
                    </p>
                  </div>
                </div>

                {/* Auto-calculated Results */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-rose-200">
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Risk Score</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {calculateRiskScore()}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Risk Level</p>
                    <Badge
                      className={`text-lg px-4 py-2 ${
                        getRiskLevel(calculateRiskScore()) === "High"
                          ? "bg-red-100 text-red-800"
                          : getRiskLevel(calculateRiskScore()) === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {getRiskLevel(calculateRiskScore())}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select category</option>
                  <option value="Power">Power</option>
                  <option value="Network">Network</option>
                  <option value="Human Error">Human Error</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleAddRisk}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                  Save Risk
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 hover:bg-accent hover:scale-105 active:scale-95 transition-all"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                    toast.info("Add risk cancelled");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Edit Risk Modal */}
      {showEditModal && editingRisk && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto animate-in fade-in duration-200">
          <Card className="w-full max-w-3xl p-6 m-4 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setShowEditModal(false);
                setEditingRisk(null);
                resetForm();
                toast.info("Edit cancelled");
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-primary hover:bg-accent rounded-full p-1 transition-all hover:scale-110 active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Edit Risk Assessment - {editingRisk.id}
            </h3>
            <div className="space-y-4">
              {/* Risk Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Risk Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Asset Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asset *
                </label>
                <select
                  value={formData.asset}
                  onChange={(e) =>
                    setFormData({ ...formData, asset: e.target.value })
                  }
                  className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select asset</option>
                  <option value="Power System">Power System</option>
                  <option value="Main Server">Main Server</option>
                  <option value="POS System">POS System</option>
                  <option value="Network Infrastructure">Network Infrastructure</option>
                </select>
              </div>

              {/* Vulnerability Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vulnerability *
                </label>
                <select
                  value={formData.vulnerability}
                  onChange={(e) =>
                    setFormData({ ...formData, vulnerability: e.target.value })
                  }
                  className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select vulnerability</option>
                  <option value="No backup power">No backup power source</option>
                  <option value="No redundancy">No server redundancy</option>
                  <option value="Single ISP">Single ISP connection</option>
                  <option value="Outdated software">Outdated software</option>
                </select>
              </div>

              {/* Threat Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Threat *
                </label>
                <select
                  value={formData.threat}
                  onChange={(e) =>
                    setFormData({ ...formData, threat: e.target.value })
                  }
                  className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select threat</option>
                  <option value="Power outage >4 hours">Power outage &gt;4 hours</option>
                  <option value="Server crash">Server crash</option>
                  <option value="Network failure">Network failure</option>
                  <option value="Data breach">Data breach</option>
                </select>
              </div>

              {/* Risk Calculation Section */}
              <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold text-gray-900">Risk Calculation</h4>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Likelihood (1-3) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="3"
                      value={likelihood}
                      onChange={(e) => setLikelihood(Number(e.target.value))}
                      className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      1=Low, 2=Medium, 3=High
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Impact (1-3) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="3"
                      value={impact}
                      onChange={(e) => setImpact(Number(e.target.value))}
                      className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      1=Low, 2=Medium, 3=High
                    </p>
                  </div>
                </div>

                {/* Auto-calculated Results */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-rose-200">
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Risk Score</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {calculateRiskScore()}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Risk Level</p>
                    <Badge
                      className={`text-lg px-4 py-2 ${
                        getRiskLevel(calculateRiskScore()) === "High"
                          ? "bg-red-100 text-red-800"
                          : getRiskLevel(calculateRiskScore()) === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {getRiskLevel(calculateRiskScore())}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select category</option>
                  <option value="Power">Power</option>
                  <option value="Network">Network</option>
                  <option value="Human Error">Human Error</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={editingRisk.status}
                  onChange={(e) =>
                    setEditingRisk({ ...editingRisk, status: e.target.value })
                  }
                  className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Mitigated">Mitigated</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleUpdateRisk}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                  Update Risk
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 hover:bg-accent hover:scale-105 active:scale-95 transition-all"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingRisk(null);
                    resetForm();
                    toast.info("Edit cancelled");
                  }}
                >
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
