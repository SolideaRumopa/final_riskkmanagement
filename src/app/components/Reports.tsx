import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { FileDown, FileText, FileSpreadsheet, Printer } from "lucide-react";

export function Reports() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Reports & Export
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Generate comprehensive reports and export data
        </p>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PDF Export */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <FileText className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                Export to PDF
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Generate a comprehensive PDF report with all risk assessments,
                matrix visualization, and control status.
              </p>
              <Button className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white">
                <FileDown className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </Card>

        {/* Excel Export */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileSpreadsheet className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                Export to Excel
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Export all data tables (assets, vulnerabilities, threats, risks,
                controls) to Excel format for further analysis.
              </p>
              <Button className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white">
                <FileDown className="w-4 h-4 mr-2" />
                Download Excel
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Summary Report */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Summary Report
        </h2>

        <div className="space-y-6">
          {/* Top Risks Summary */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Top 5 Risks</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-sm font-medium">R-001 - Ketiadaan Genset Cadangan</span>
                <span className="text-sm font-bold text-red-600">Score: 9 (High)</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-sm font-medium">R-003 - Single Point of Failure</span>
                <span className="text-sm font-bold text-red-600">Score: 9 (High)</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-sm font-medium">R-004 - Kehilangan Data Transaksi</span>
                <span className="text-sm font-bold text-red-600">Score: 9 (High)</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm font-medium">R-002 - Jaringan Internet Buruk</span>
                <span className="text-sm font-bold text-yellow-600">Score: 6 (Medium)</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm font-medium">R-006 - Staff Training Gap</span>
                <span className="text-sm font-bold text-yellow-600">Score: 6 (Medium)</span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Risks</p>
              <p className="text-3xl font-bold text-gray-900">24</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">High Priority</p>
              <p className="text-3xl font-bold text-red-600">6</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Mitigated</p>
              <p className="text-3xl font-bold text-green-600">8</p>
            </div>
          </div>

          {/* Print Button */}
          <div className="pt-4 border-t border-gray-200">
            <Button variant="outline" className="w-full">
              <Printer className="w-4 h-4 mr-2" />
              Print Summary Report
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
