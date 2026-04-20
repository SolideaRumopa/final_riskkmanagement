import { AlertTriangle, X } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

interface NotificationAlertProps {
  onClose: () => void;
}

export function NotificationAlert({ onClose }: NotificationAlertProps) {
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
            Terdapat 6 risiko dengan kategori HIGH yang memerlukan perhatian
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
