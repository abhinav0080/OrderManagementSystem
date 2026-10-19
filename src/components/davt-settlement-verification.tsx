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
  Calendar,
  Timer,
  IndianRupee,
  Info,
  Calculator,
  Camera
} from 'lucide-react';

interface DAVTSettlementVerificationProps {
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

interface ComputedDataTile {
  label: string;
  value: string;
  source: string;
  confidence: number;
  hasInfo?: boolean;
}

export function DAVTSettlementVerification({ orderId, onBack }: DAVTSettlementVerificationProps) {
  const [decision, setDecision] = useState<'approve' | 'reject' | 'recalculate' | null>(null);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [remarks, setRemarks] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showInfoTooltip, setShowInfoTooltip] = useState<string | null>(null);

  const documents: DocumentCard[] = [
    {
      id: '1',
      name: 'POD (Proof of Delivery)',
      fileName: 'POD_10Dec2024.pdf',
      uploaded: '10-Dec-2024 | 18:50',
      aiVerification: 'verified',
      confidence: 98,
      icon: FileText,
    },
    {
      id: '2',
      name: 'GRN (Goods Receipt Note)',
      fileName: 'GRN_2024-12345.pdf',
      uploaded: '10-Dec-2024 | 18:51',
      aiVerification: 'verified',
      confidence: 96,
      icon: Package,
    },
    {
      id: '3',
      name: 'Damage Proof',
      fileName: 'DamagePhoto_IMG2024.jpg',
      uploaded: '10-Dec-2024 | 18:52',
      aiVerification: 'flagged',
      confidence: 73,
      icon: Camera,
      issue: 'Low image quality - damage not clearly visible',
    },
    {
      id: '4',
      name: 'Shortage Proof',
      fileName: 'ShortageDoc_SH2024.pdf',
      uploaded: '10-Dec-2024 | 18:53',
      aiVerification: 'verified',
      confidence: 94,
      icon: FileText,
    },
    {
      id: '5',
      name: 'Loading Detention Proof',
      fileName: 'LoadingGateEntry.pdf',
      uploaded: '10-Dec-2024 | 18:54',
      aiVerification: 'verified',
      confidence: 95,
      icon: Timer,
    },
    {
      id: '6',
      name: 'Unloading Detention Proof',
      fileName: 'UnloadingGateEntry.pdf',
      uploaded: '10-Dec-2024 | 18:55',
      aiVerification: 'verified',
      confidence: 93,
      icon: Timer,
    },
  ];

  const computedData: ComputedDataTile[] = [
    { label: 'Actual Delivery Date & Time', value: '10-Dec-2024 | 18:45', source: 'POD', confidence: 98 },
    { label: 'Transit TAT', value: '48h planned / 52h actual (+4h delay)', source: 'POD + LR', confidence: 96 },
    { label: 'Shortage (Qty + Value)', value: '50 units | ₹12,500', source: 'GRN', confidence: 94, hasInfo: true },
    { label: 'Damage (Qty + Value)', value: '25 units | ₹8,750', source: 'Damage Proof', confidence: 87, hasInfo: true },
    { label: 'Loading Detention', value: '2 days | ₹2,000', source: 'Gate Entry', confidence: 95, hasInfo: true },
    { label: 'Unloading Detention', value: '1 day | ₹1,500', source: 'POD', confidence: 93, hasInfo: true },
  ];

  const rejectionReasons = [
    'POD Missing',
    'GRN Not Verified',
    'Damage Value Incorrect',
    'Shortage Calculation Wrong',
    'Detention Days Mismatch',
    'Contract Clause Not Applied',
    'Low Quality Proof',
    'Timestamp Manipulation Suspected',
    'Unauthorized Deductions',
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
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-2xl">
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
                <h1 className="text-3xl text-white">Settlement Document Verification</h1>
                {orderId && (
                  <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm border border-white/30">
                    {orderId}
                  </div>
                )}
              </div>
              <p className="text-lg text-white/90">Final settlement verification with vendor payable & customer billable calculation</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                <p className="text-sm text-white/80 mb-1">Vehicle</p>
                <p className="text-white">MH-14-KL-2345</p>
              </div>
              <div className="px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                <p className="text-sm text-white/80 mb-1">Customer</p>
                <p className="text-white">Asian Paints</p>
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
            <p className="text-white">Final Settlement Approved</p>
            <p className="text-sm text-white/80">Vendor Payable & Customer Billable Updated</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-6">
          {/* Left Panel - Settlement Documents */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-gray-900 mb-4">Settlement Documents</h2>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <SettlementDocumentCard key={doc.id} document={doc} />
                ))}
              </div>
            </div>
          </div>

          {/* Middle Panel - AI Computed Data */}
          <div className="space-y-4">
            {/* Computed Data Tiles */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-indigo-600" />
                <h2 className="text-gray-900">AI Settlement Computed Data</h2>
              </div>
              <div className="space-y-3">
                {computedData.map((tile, index) => (
                  <ComputedTile 
                    key={index} 
                    tile={tile} 
                    showInfoTooltip={showInfoTooltip}
                    setShowInfoTooltip={setShowInfoTooltip}
                  />
                ))}
              </div>
            </div>

            {/* Vendor Payable Summary */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border-2 border-red-200 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <IndianRupee className="w-5 h-5 text-red-600" />
                <h3 className="text-red-900">Vendor Payable Summary</h3>
              </div>

              <div className="space-y-2 text-sm mb-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Base Freight:</span>
                  <span className="text-gray-900">₹95,000</span>
                </div>
                <div className="flex justify-between text-red-700">
                  <span>(-) Shortage:</span>
                  <span>₹12,500</span>
                </div>
                <div className="flex justify-between text-red-700">
                  <span>(-) Damage:</span>
                  <span>₹8,750</span>
                </div>
                <div className="flex justify-between text-red-700">
                  <span>(-) Delay Penalty:</span>
                  <span>₹2,000</span>
                </div>
                <div className="flex justify-between text-green-700">
                  <span>(+) Detention:</span>
                  <span>₹2,000</span>
                </div>
              </div>

              <div className="pt-3 border-t-2 border-red-300 flex justify-between">
                <span className="text-red-900">Final Vendor Payable:</span>
                <span className="text-2xl text-red-900">₹73,750</span>
              </div>
            </div>

            {/* Customer Billable Summary */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <IndianRupee className="w-5 h-5 text-green-600" />
                <h3 className="text-green-900">Customer Billable Summary</h3>
              </div>

              <div className="space-y-2 text-sm mb-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Base Freight:</span>
                  <span className="text-gray-900">₹95,000</span>
                </div>
                <div className="flex justify-between text-green-700">
                  <span>(+) Loading Detention:</span>
                  <span>₹2,000</span>
                </div>
                <div className="flex justify-between text-green-700">
                  <span>(+) Unloading Detention:</span>
                  <span>₹2,500</span>
                </div>
                <div className="flex justify-between text-green-700">
                  <span>(+) Challans:</span>
                  <span>₹1,000</span>
                </div>
              </div>

              <div className="pt-2 border-t border-green-200 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-green-900">Gross Payable:</span>
                  <span className="text-green-900">₹100,500</span>
                </div>
              </div>

              <div className="space-y-1.5 text-sm mb-3 pb-3 border-b border-green-200">
                <p className="text-xs text-red-800 mb-1">Expected Debits:</p>
                <div className="flex justify-between text-red-700">
                  <span>(-) Shortage:</span>
                  <span>₹12,500</span>
                </div>
                <div className="flex justify-between text-red-700">
                  <span>(-) Damage:</span>
                  <span>₹8,750</span>
                </div>
                <div className="flex justify-between text-red-700">
                  <span>(-) Delay:</span>
                  <span>₹3,200</span>
                </div>
              </div>

              <div className="pt-3 border-t-2 border-green-300 flex justify-between">
                <span className="text-green-900">Final Net Payable:</span>
                <span className="text-2xl text-green-900">₹76,050</span>
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
                  Approve Settlement
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
                  Reject Settlement
                </button>

                <button
                  onClick={() => setDecision('recalculate')}
                  className={`w-full px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                    decision === 'recalculate'
                      ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-500/30'
                      : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  }`}
                >
                  <Calculator className="w-5 h-5" />
                  Recalculate Settlement
                </button>
              </div>

              {/* Rejection Reasons */}
              {(decision === 'reject' || decision === 'recalculate') && (
                <div className="mb-6">
                  <h4 className="text-sm text-gray-700 mb-3">Select Rejection Reasons</h4>
                  <div className="space-y-2">
                    {rejectionReasons.map((reason) => (
                      <label key={reason} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedReasons.includes(reason)}
                          onChange={() => toggleReason(reason)}
                          className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">{reason}</span>
                      </label>
                    ))}
                  </div>

                  {selectedReasons.includes('Other') && (
                    <textarea
                      placeholder="Please specify other reason..."
                      className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={4}
                />
              </div>

              {/* Upload Supporting Evidence */}
              <div className="mb-6">
                <h4 className="text-sm text-gray-700 mb-2">Upload Evidence</h4>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors cursor-pointer">
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
                    ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-500/30'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
                Submit Decision
              </button>
            </div>

            {/* AI Insights */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-green-600" />
                <h3 className="text-green-900">AI Insights</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>Damage proof image quality 73% - manual verification recommended</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>Vendor has 3 similar shortage cases in last 30 days</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>All settlement calculations verified against contract clauses</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Detention calculations match gate entry timestamps</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Settlement Document Card Component
function SettlementDocumentCard({ document }: { document: DocumentCard }) {
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

// Computed Tile Component
interface ComputedTileProps {
  tile: ComputedDataTile;
  showInfoTooltip: string | null;
  setShowInfoTooltip: (value: string | null) => void;
}

function ComputedTile({ tile, showInfoTooltip, setShowInfoTooltip }: ComputedTileProps) {
  return (
    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm text-gray-900">{tile.label}</p>
        {tile.hasInfo && (
          <button
            onClick={() => setShowInfoTooltip(showInfoTooltip === tile.label ? null : tile.label)}
            className="p-0.5 hover:bg-gray-200 rounded transition-colors"
          >
            <Info className="w-3.5 h-3.5 text-gray-600" />
          </button>
        )}
      </div>

      {showInfoTooltip === tile.label && (
        <div className="mb-2 p-2 bg-blue-50 border border-blue-300 rounded text-xs text-blue-900">
          <p className="mb-1"><strong>Contract Clause Reference:</strong></p>
          <p>This calculation is based on contract clause 4.2 with tolerance limits applied.</p>
        </div>
      )}

      <p className="text-lg text-gray-900 mb-2">{tile.value}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <FileText className="w-3 h-3" />
          <span>{tile.source}</span>
        </div>
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs border ${
          tile.confidence >= 90
            ? 'bg-green-100 text-green-700 border-green-300'
            : tile.confidence >= 80
            ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
            : 'bg-red-100 text-red-700 border-red-300'
        }`}>
          <Brain className="w-3 h-3" />
          <span>{tile.confidence}%</span>
        </div>
      </div>
    </div>
  );
}
