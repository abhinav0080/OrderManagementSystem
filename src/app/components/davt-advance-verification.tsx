import { useState } from 'react';
import { 
  ArrowLeft,
  CheckCircle2,
  XCircle,
  FileText,
  Brain,
  Upload,
  Eye,
  AlertTriangle,
  Send,
  RefreshCw,
  Package,
  Scale,
  Calendar,
  QrCode
} from 'lucide-react';

interface DAVTAdvanceVerificationProps {
  orderId: string | null;
  onBack: () => void;
}

interface DocumentCard {
  id: string;
  name: string;
  fileName: string;
  uploaded: string;
  aiVerification: 'verified' | 'rejected' | 'flagged';
  confidence: number;
  icon: any;
  issue?: string;
}

interface CrossCheckResult {
  label: string;
  status: 'match' | 'mismatch' | 'pending';
  confidence: number;
  details: string;
}

export function DAVTAdvanceVerification({ orderId, onBack }: DAVTAdvanceVerificationProps) {
  const [decision, setDecision] = useState<'approve' | 'reject' | 'partial' | null>(null);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [remarks, setRemarks] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const documents: DocumentCard[] = [
    {
      id: '1',
      name: 'LR (Lorry Receipt)',
      fileName: 'LR_12345.pdf',
      uploaded: '10-Dec-2024 | 16:20',
      aiVerification: 'verified',
      confidence: 96,
      icon: FileText,
    },
    {
      id: '2',
      name: 'Invoice',
      fileName: 'Invoice_INV-2024-5678.pdf',
      uploaded: '10-Dec-2024 | 16:21',
      aiVerification: 'verified',
      confidence: 94,
      icon: FileText,
    },
    {
      id: '3',
      name: 'E-Way Bill (QR-enabled)',
      fileName: 'EWB_123456789012.pdf',
      uploaded: '10-Dec-2024 | 16:22',
      aiVerification: 'flagged',
      confidence: 82,
      icon: QrCode,
      issue: 'QR validation pending - GST portal slow response',
    },
    {
      id: '4',
      name: 'Weighment Slip',
      fileName: 'WeighmentSlip_WS2024-1234.pdf',
      uploaded: '10-Dec-2024 | 16:23',
      aiVerification: 'verified',
      confidence: 91,
      icon: Scale,
    },
    {
      id: '5',
      name: 'Packing List',
      fileName: 'PackingList_PL-5678.pdf',
      uploaded: '10-Dec-2024 | 16:24',
      aiVerification: 'flagged',
      confidence: 76,
      icon: Package,
      issue: 'Quantity mismatch with invoice - 5 units difference',
    },
  ];

  const crossChecks: CrossCheckResult[] = [
    {
      label: 'LR vs Invoice Match',
      status: 'match',
      confidence: 96,
      details: 'Consignor, Consignee, Quantity all match',
    },
    {
      label: 'Invoice vs E-Way Bill Match',
      status: 'match',
      confidence: 94,
      details: 'Invoice number and date verified',
    },
    {
      label: 'Weight Match',
      status: 'mismatch',
      confidence: 78,
      details: 'Invoice: 5000 kg | Weighment: 5050 kg (50 kg variance)',
    },
    {
      label: 'Consignor/Consignee Match',
      status: 'match',
      confidence: 98,
      details: 'All documents show consistent party details',
    },
    {
      label: 'QR Scan Validity',
      status: 'pending',
      confidence: 82,
      details: 'E-Way Bill QR validated against GST portal',
    },
    {
      label: 'Loading Date Validation',
      status: 'match',
      confidence: 93,
      details: 'Loading date: 09-Dec-2024 (within valid window)',
    },
  ];

  const rejectionReasons = [
    'Missing Document',
    'Expired E-Way Bill',
    'Invalid QR Code',
    'Weight Mismatch',
    'Quantity Mismatch',
    'Date Mismatch',
    'Party Name Mismatch',
    'Invoice Details Incorrect',
    'Low Quality Scan',
    'Other',
  ];

  const toggleReason = (reason: string) => {
    if (selectedReasons.includes(reason)) {
      setSelectedReasons(selectedReasons.filter(r => r !== reason));
    } else {
      setSelectedReasons([...selectedReasons, reason]);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      onBack();
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl">
        <div className="px-8 py-6">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to DAVT Queue
          </button>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl text-white">Advance Document Verification</h1>
                {orderId && (
                  <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm border border-white/30">
                    {orderId}
                  </div>
                )}
              </div>
              <p className="text-lg text-white/90">Manual cross-verification of advance shipping documents</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                <p className="text-sm text-white/80 mb-1">Vehicle</p>
                <p className="text-white">KA-05-GH-3456</p>
              </div>
              <div className="px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                <p className="text-sm text-white/80 mb-1">Route</p>
                <p className="text-white">Bangalore → Chennai</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {submitted && (
        <div className="fixed top-8 right-8 z-50 px-6 py-4 bg-green-600 text-white rounded-lg shadow-2xl flex items-center gap-3 animate-slide-in">
          <CheckCircle2 className="w-6 h-6" />
          <div>
            <p className="text-white">Advance Docs Verification Completed</p>
            <p className="text-sm text-white/80">Order moved to Settlement Verification Queue</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-6">
          {/* Left Panel - Uploaded Documents */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-gray-900 mb-4">Uploaded Documents</h2>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <AdvanceDocumentCard key={doc.id} document={doc} />
                ))}
              </div>
            </div>
          </div>

          {/* Middle Panel - AI Cross Verification */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-indigo-600" />
                <h2 className="text-gray-900">AI Cross Verification</h2>
              </div>
              <div className="space-y-3">
                {crossChecks.map((check, index) => (
                  <CrossCheckCard key={index} check={check} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - DAVT Actions */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-gray-900 mb-4">Manual Verification Panel</h3>

              {/* Decision Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setDecision('approve')}
                  className={`w-full px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                    decision === 'approve'
                      ? 'bg-green-600 text-white shadow-lg shadow-green-500/30'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Approve Advance Docs
                </button>

                <button
                  onClick={() => setDecision('reject')}
                  className={`w-full px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                    decision === 'reject'
                      ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  <XCircle className="w-5 h-5" />
                  Reject Docs
                </button>

                <button
                  onClick={() => setDecision('partial')}
                  className={`w-full px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                    decision === 'partial'
                      ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-500/30'
                      : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  }`}
                >
                  <AlertTriangle className="w-5 h-5" />
                  Partial Approval
                </button>
              </div>

              {/* Rejection Reasons */}
              {(decision === 'reject' || decision === 'partial') && (
                <div className="mb-6">
                  <h4 className="text-sm text-gray-700 mb-3">Select Rejection Reasons</h4>
                  <div className="space-y-2">
                    {rejectionReasons.map((reason) => (
                      <label key={reason} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedReasons.includes(reason)}
                          onChange={() => toggleReason(reason)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{reason}</span>
                      </label>
                    ))}
                  </div>

                  {selectedReasons.includes('Other') && (
                    <textarea
                      placeholder="Please specify other reason..."
                      className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                    />
                  )}
                </div>
              )}

              {/* Remarks */}
              <div className="mb-6">
                <h4 className="text-sm text-gray-700 mb-2">Remarks</h4>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Add your verification notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>

              {/* Upload Supporting Evidence */}
              <div className="mb-6">
                <h4 className="text-sm text-gray-700 mb-2">Attach Evidence</h4>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB</p>
                </div>
              </div>

              {/* Submit Decision */}
              <button
                onClick={handleSubmit}
                disabled={!decision}
                className={`w-full px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                  decision
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
                Submit Decision
              </button>
            </div>

            {/* AI Insights */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-blue-600" />
                <h3 className="text-blue-900">AI Insights</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>Weight variance of 50 kg detected - within acceptable 1% tolerance</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>E-Way Bill expiry: 2 days remaining</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>All mandatory documents uploaded</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Cross-checks completed in 2.1 seconds</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Advance Document Card Component
function AdvanceDocumentCard({ document }: { document: DocumentCard }) {
  const Icon = document.icon;
  const statusConfig = {
    verified: {
      bg: 'bg-green-50',
      border: 'border-green-300',
      chip: 'bg-green-100 text-green-700 border-green-300',
      icon: CheckCircle2,
      label: 'Verified',
    },
    rejected: {
      bg: 'bg-red-50',
      border: 'border-red-300',
      chip: 'bg-red-100 text-red-700 border-red-300',
      icon: XCircle,
      label: 'Rejected',
    },
    flagged: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-300',
      chip: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      icon: AlertTriangle,
      label: 'Flagged',
    },
  };

  const config = statusConfig[document.aiVerification];
  const StatusIcon = config.icon;

  return (
    <div className={`p-4 rounded-lg border-2 ${config.border} ${config.bg}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`p-2 rounded-lg ${config.bg} border ${config.border}`}>
          <Icon className="w-4 h-4 text-gray-700" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-900 mb-1">{document.name}</p>
          <p className="text-xs text-gray-600 mb-1">{document.fileName}</p>
          <p className="text-xs text-gray-500">{document.uploaded}</p>
        </div>
      </div>

      {document.issue && (
        <div className="mb-3 p-2 bg-yellow-50 border border-yellow-300 rounded">
          <p className="text-xs text-yellow-800">{document.issue}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded ${config.chip} border text-xs`}>
          <StatusIcon className="w-3.5 h-3.5" />
          <span>{config.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Brain className="w-3 h-3" />
            <span>{document.confidence}%</span>
          </div>
          <button className="p-1.5 hover:bg-gray-200 rounded transition-colors">
            <RefreshCw className="w-3.5 h-3.5 text-gray-600" />
          </button>
          <button className="p-1 hover:bg-gray-200 rounded transition-colors">
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Cross Check Card Component
function CrossCheckCard({ check }: { check: CrossCheckResult }) {
  const statusConfig = {
    match: {
      bg: 'bg-green-50',
      border: 'border-green-300',
      chip: 'bg-green-100 text-green-700 border-green-300',
      icon: CheckCircle2,
    },
    mismatch: {
      bg: 'bg-red-50',
      border: 'border-red-300',
      chip: 'bg-red-100 text-red-700 border-red-300',
      icon: XCircle,
    },
    pending: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-300',
      chip: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      icon: AlertTriangle,
    },
  };

  const config = statusConfig[check.status];
  const StatusIcon = config.icon;

  return (
    <div className={`p-4 rounded-lg border-2 ${config.border} ${config.bg}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-900">{check.label}</p>
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs border ${config.chip}`}>
          <StatusIcon className="w-3 h-3" />
          <span className="capitalize">{check.status}</span>
        </div>
      </div>
      <p className="text-xs text-gray-700 mb-2">{check.details}</p>
      <div className="flex items-center gap-1 text-xs text-gray-600">
        <Brain className="w-3 h-3" />
        <span>{check.confidence}% confidence</span>
      </div>
    </div>
  );
}
