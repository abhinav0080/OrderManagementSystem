import { useState } from 'react';
import { 
  ArrowLeft,
  Upload,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Package,
  FileCheck,
  Camera,
  AlertCircle,
  Brain,
  RefreshCw,
  Eye,
  Bell,
  Send,
  IndianRupee,
  Calendar,
  TrendingDown,
  TrendingUp,
  Scale,
  Timer,
  Edit3,
  Sparkles,
  Paperclip,
  Info,
  Download
} from 'lucide-react';

interface OpsSettlementUploadProps {
  orderId: string | null;
  onBack: () => void;
  onProceedToResult: () => void;
}

interface SettlementDocument {
  id: string;
  name: string;
  description: string;
  icon: any;
  mandatory: boolean;
  status: 'pending' | 'uploaded' | 'verified' | 'failed';
  file?: string;
  aiConfidence?: number;
  issue?: string;
  issueReason?: string;
}

interface ExtractedData {
  label: string;
  value: string;
  source: string;
  confidence: number;
  editable: boolean;
  type?: 'date' | 'money' | 'number' | 'text';
}

export function OpsSettlementUpload({ orderId, onBack, onProceedToResult }: OpsSettlementUploadProps) {
  const initialDocuments: SettlementDocument[] = [
    {
      id: '1',
      name: 'POD (Proof of Delivery)',
      description: 'Customer signed delivery proof',
      icon: FileCheck,
      mandatory: true,
      status: 'pending',
    },
    {
      id: '2',
      name: 'GRN (Goods Receipt Note)',
      description: 'Warehouse goods receipt note',
      icon: Package,
      mandatory: true,
      status: 'pending',
    },
    {
      id: '3',
      name: 'Challan / Gate Entry Slip',
      description: 'Entry checkpoint timestamp',
      icon: FileText,
      mandatory: false,
      status: 'pending',
    },
    {
      id: '4',
      name: 'Damage Proof',
      description: 'Photo/PDF of damaged goods',
      icon: Camera,
      mandatory: false,
      status: 'pending',
    },
    {
      id: '5',
      name: 'Shortage Proof',
      description: 'Photo/PDF of shortage evidence',
      icon: AlertCircle,
      mandatory: false,
      status: 'pending',
    },
    {
      id: '6',
      name: 'Detention Proof',
      description: 'Timestamp / Email / Gate Entry',
      icon: Timer,
      mandatory: false,
      status: 'pending',
    },
  ];

  const [documents, setDocuments] = useState<SettlementDocument[]>(initialDocuments);
  const [extracting, setExtracting] = useState(false);
  const [vendorNotifyTime, setVendorNotifyTime] = useState('');
  const [showApprovalRequest, setShowApprovalRequest] = useState(false);
  const [approvalComment, setApprovalComment] = useState('');
  const [approvalSent, setApprovalSent] = useState(false);
  const [davtStatus, setDavtStatus] = useState<'idle' | 'submitted'>('idle');
  const [showInfoTooltip, setShowInfoTooltip] = useState<string | null>(null);

  const [extractedData, setExtractedData] = useState<ExtractedData[]>([
    { label: 'Actual Delivery Date & Time', value: '10-Dec-2024 | 18:45', source: 'POD', confidence: 98, editable: true, type: 'date' },
    { label: 'Transit TAT (Planned vs Actual)', value: '48h planned / 52h actual (+4h delay)', source: 'POD + LR', confidence: 96, editable: false },
    { label: 'Shortage Quantity', value: '50 units (from 1000 units)', source: 'GRN', confidence: 94, editable: true, type: 'number' },
    { label: 'Shortage Value', value: '₹12,500', source: 'Contract Clause 4.2', confidence: 92, editable: true, type: 'money' },
    { label: 'Damage Quantity', value: '25 units', source: 'Damage Proof', confidence: 89, editable: true, type: 'number' },
    { label: 'Damage Value', value: '₹8,750', source: 'Contract + DAVT Guidelines', confidence: 87, editable: true, type: 'money' },
    { label: 'Detention Days', value: '3 days', source: 'Gate Entry + POD', confidence: 95, editable: true, type: 'number' },
    { label: 'Detention Penalty', value: '₹3,500 (Rs 1000×2 + Rs 1500×1)', source: 'Contract Clause 6.1', confidence: 93, editable: true, type: 'money' },
    { label: 'Vendor Payable – Final', value: '₹72,250', source: 'AI Auto-Computed', confidence: 91, editable: false, type: 'money' },
    { label: 'Customer Billable – Final', value: '₹88,500', source: 'AI Auto-Computed', confidence: 91, editable: false, type: 'money' },
  ]);

  const handleUpload = (docId: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId ? { ...doc, status: 'uploaded' as const, file: `${doc.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf` } : doc
    ));

    setExtracting(true);
    setTimeout(() => {
      setDocuments(prev => prev.map(doc => 
        doc.id === docId ? { 
          ...doc, 
          status: docId === '4' ? 'failed' as const : 'verified' as const,
          aiConfidence: docId === '4' ? 73 : Math.floor(Math.random() * 10) + 90,
          issue: docId === '4' ? 'Low Quality Image' : undefined,
          issueReason: docId === '4' ? 'Damage not clearly visible - better angle needed' : undefined,
        } : doc
      ));
      setExtracting(false);
    }, 2000);
  };

  const uploadedCount = documents.filter(d => d.status !== 'pending').length;
  const verifiedCount = documents.filter(d => d.status === 'verified').length;
  const failedCount = documents.filter(d => d.status === 'failed').length;
  const mandatoryDocs = documents.filter(d => d.mandatory);
  const mandatoryUploaded = mandatoryDocs.filter(d => d.status !== 'pending').length;
  const allMandatoryDone = mandatoryUploaded === mandatoryDocs.length;
  const needsManualReview = failedCount > 0 || verifiedCount < uploadedCount;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-2xl">
        <div className="px-8 py-6">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Advance Docs
          </button>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl text-white">OPS Stage 3: Settlement Document Upload</h1>
                {orderId && (
                  <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm border border-white/30">
                    {orderId}
                  </div>
                )}
              </div>
              <p className="text-lg text-white/90">Upload final unloading & settlement documents for vendor payment calculation</p>
            </div>

            {extracting && (
              <div className="flex items-center gap-3 px-6 py-4 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                <div className="animate-spin">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm mb-0.5">AI Processing...</p>
                  <p className="text-xs text-white/80">Extracting settlement data</p>
                </div>
              </div>
            )}
          </div>

          {/* Progress Steps */}
          <div className="mt-6 flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/30 backdrop-blur-sm rounded-lg border border-green-400/50">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm">Vehicle & Driver KYC</span>
            </div>
            <div className="w-8 h-0.5 bg-white/30" />
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/30 backdrop-blur-sm rounded-lg border border-green-400/50">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm">Advance Docs Uploaded</span>
            </div>
            <div className="w-8 h-0.5 bg-white/30" />
            <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/30 backdrop-blur-sm rounded-lg border border-yellow-400/50">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Settlement Docs Upload</span>
            </div>
            <div className="w-8 h-0.5 bg-white/20" />
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <Clock className="w-4 h-4" />
              <span className="text-sm text-white/60">DAVT Final Verification</span>
            </div>
            <div className="w-8 h-0.5 bg-white/20" />
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <Clock className="w-4 h-4" />
              <span className="text-sm text-white/60">Final Settlement Approved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-6">
          {/* Left Panel - Document Upload */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-900">Settlement Documents</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="w-4 h-4" />
                  <span>{uploadedCount}/{documents.length}</span>
                </div>
              </div>

              <div className="space-y-3">
                {documents.map((doc) => (
                  <SettlementDocCard
                    key={doc.id}
                    document={doc}
                    onUpload={() => handleUpload(doc.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Center Panel - AI Extracted Data */}
          <div className="space-y-4">
            {/* Delivery Date/Time */}
            <SimpleDataCard
              label="Actual Delivery Date & Time"
              value="10-Dec-2024 | 18:45"
              source="POD"
              confidence={98}
              editable
            />

            {/* Transit TAT - Enhanced */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm text-gray-900">Transit TAT (Planned vs Actual)</h3>
                <button
                  onClick={() => setShowInfoTooltip(showInfoTooltip === 'tat' ? null : 'tat')}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <Info className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {showInfoTooltip === 'tat' && (
                <div className="mb-3 p-3 bg-blue-50 border border-blue-300 rounded text-xs text-blue-900">
                  <p className="mb-1"><strong>Contract Clause 5.3:</strong></p>
                  <p>Standard TAT: 48 hours for Mumbai-Delhi route. Delay beyond 4 hours: ₹500/hr for vendor, ₹800/hr for customer</p>
                </div>
              )}

              <div className="space-y-2 text-sm mb-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Planned:</span>
                  <span className="text-gray-900">48 hrs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Actual:</span>
                  <span className="text-gray-900">52 hrs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delay:</span>
                  <span className="text-red-700">4 hrs</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Vendor Penalty:</span>
                  <span className="text-red-700">₹2,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer Penalty:</span>
                  <span className="text-green-700">₹3,200</span>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
                <Brain className="w-3 h-3" />
                <span>96% confidence • POD + LR</span>
              </div>
            </div>

            {/* Shortage - Combined */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm text-gray-900">Shortage (Qty + Value)</h3>
                <button
                  onClick={() => setShowInfoTooltip(showInfoTooltip === 'shortage' ? null : 'shortage')}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <Info className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {showInfoTooltip === 'shortage' && (
                <div className="mb-3 p-3 bg-blue-50 border border-blue-300 rounded text-xs text-blue-900">
                  <p className="mb-1"><strong>Contract Clause 4.2:</strong></p>
                  <p>Shortage tolerance: 1% of total quantity. Beyond tolerance: ₹250 per unit deduction for vendor and customer recovery.</p>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shortage Quantity:</span>
                  <span className="text-gray-900">50 units (from 1000)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shortage Value:</span>
                  <span className="text-red-700">₹12,500</span>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
                <Brain className="w-3 h-3" />
                <span>94% confidence • GRN</span>
              </div>
            </div>

            {/* Damage - Combined */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm text-gray-900">Damage (Qty + Value)</h3>
                <button
                  onClick={() => setShowInfoTooltip(showInfoTooltip === 'damage' ? null : 'damage')}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <Info className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {showInfoTooltip === 'damage' && (
                <div className="mb-3 p-3 bg-blue-50 border border-blue-300 rounded text-xs text-blue-900">
                  <p className="mb-1"><strong>Contract Clause 4.5 + DAVT Guidelines:</strong></p>
                  <p>Damage valuation: ₹350 per unit. Vendor liability: 80% of damage value. Customer recovery: 90% of damage value.</p>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Damage Qty:</span>
                  <span className="text-gray-900">25 units</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Damage Value:</span>
                  <span className="text-red-700">₹8,750</span>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
                <Brain className="w-3 h-3" />
                <span>89% confidence • Damage Proof</span>
              </div>
            </div>

            {/* Detention - Enhanced */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm text-gray-900">Detention Summary</h3>
                <button
                  onClick={() => setShowInfoTooltip(showInfoTooltip === 'detention' ? null : 'detention')}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <Info className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {showInfoTooltip === 'detention' && (
                <div className="mb-3 p-3 bg-blue-50 border border-blue-300 rounded text-xs text-blue-900">
                  <p className="mb-1"><strong>Contract Clause 6.1:</strong></p>
                  <p>Loading: First 2 days free, ₹1000/day after. Unloading: First 1 day free, ₹1500/day after. Vendor payable rate: ₹1000/day. Customer billable rate: ₹1500/day.</p>
                </div>
              )}

              <div className="space-y-2 text-sm mb-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Loading Detention:</span>
                  <span className="text-gray-900">2 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Unloading Detention:</span>
                  <span className="text-gray-900">1 day</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Vendor Detention Payable:</span>
                  <span className="text-green-700">₹2,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer Detention Billable:</span>
                  <span className="text-green-700">₹4,500</span>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
                <Brain className="w-3 h-3" />
                <span>95% confidence • Gate Entry + POD</span>
              </div>
            </div>

            {/* Vendor Payable Summary */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border-2 border-red-200 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm text-red-900">Vendor Payable – Final Amount</h3>
                <button className="p-1 hover:bg-red-100 rounded transition-colors">
                  <Download className="w-4 h-4 text-red-700" />
                </button>
              </div>

              <div className="space-y-2 text-sm mb-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Base Freight:</span>
                  <span className="text-gray-900">₹95,000</span>
                </div>
                <div className="flex justify-between text-red-700">
                  <span>(-) Shortage Deduction:</span>
                  <span>₹12,500</span>
                </div>
                <div className="flex justify-between text-red-700">
                  <span>(-) Damage Deduction:</span>
                  <span>₹8,750</span>
                </div>
                <div className="flex justify-between text-red-700">
                  <span>(-) Delay Penalty:</span>
                  <span>₹2,000</span>
                </div>
                <div className="flex justify-between text-green-700">
                  <span>(+) Detention Payable:</span>
                  <span>₹2,000</span>
                </div>
              </div>

              <div className="pt-3 border-t-2 border-red-300">
                <div className="flex justify-between items-center">
                  <span className="text-red-900">Final Vendor Payable:</span>
                  <span className="text-2xl text-red-900">₹73,750</span>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
                <Brain className="w-3 h-3" />
                <span>91% confidence • AI Auto-Computed</span>
              </div>
            </div>

            {/* Customer Billable Summary */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm text-green-900">Final Customer Net Payable</h3>
                <button className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700 transition-colors">
                  Generate Invoice
                </button>
              </div>

              {/* Section 1: Customer Payable (Gross) */}
              <div className="mb-3 pb-3 border-b border-green-300">
                <h4 className="text-xs text-green-800 mb-2">✅ Customer Payable (Gross)</h4>
                <div className="space-y-1.5 text-sm">
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
                  <div className="flex justify-between text-gray-600">
                    <span>(+) Other Charges:</span>
                    <span>₹0</span>
                  </div>
                </div>
                <div className="pt-2 mt-2 border-t border-green-200 flex justify-between text-sm">
                  <span className="text-green-900">Gross Customer Payable:</span>
                  <span className="text-green-900">₹100,500</span>
                </div>
              </div>

              {/* Section 2: Expected Debits & Penalties */}
              <div className="mb-3 pb-3 border-b border-green-300">
                <h4 className="text-xs text-red-800 mb-2">❌ Expected Debits & Penalties from Customer</h4>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between items-center text-red-700">
                    <div className="flex items-center gap-1">
                      <span>(-) Shortage:</span>
                      <button
                        onClick={() => setShowInfoTooltip(showInfoTooltip === 'cust-shortage' ? null : 'cust-shortage')}
                        className="p-0.5 hover:bg-red-100 rounded transition-colors"
                      >
                        <Info className="w-3 h-3 text-red-600" />
                      </button>
                    </div>
                    <span>₹12,500</span>
                  </div>
                  {showInfoTooltip === 'cust-shortage' && (
                    <div className="mb-2 p-2 bg-blue-50 border border-blue-300 rounded text-xs text-blue-900">
                      <p className="mb-1"><strong>Customer Contract Clause 4.2:</strong></p>
                      <p>This amount will be debited by the customer as per contract for shortage recovery.</p>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-red-700">
                    <div className="flex items-center gap-1">
                      <span>(-) Damage:</span>
                      <button
                        onClick={() => setShowInfoTooltip(showInfoTooltip === 'cust-damage' ? null : 'cust-damage')}
                        className="p-0.5 hover:bg-red-100 rounded transition-colors"
                      >
                        <Info className="w-3 h-3 text-red-600" />
                      </button>
                    </div>
                    <span>₹8,750</span>
                  </div>
                  {showInfoTooltip === 'cust-damage' && (
                    <div className="mb-2 p-2 bg-blue-50 border border-blue-300 rounded text-xs text-blue-900">
                      <p className="mb-1"><strong>Customer Contract Clause 4.5:</strong></p>
                      <p>This amount will be debited by the customer as per contract for damage recovery.</p>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-red-700">
                    <div className="flex items-center gap-1">
                      <span>(-) Transit Delay:</span>
                      <button
                        onClick={() => setShowInfoTooltip(showInfoTooltip === 'cust-delay' ? null : 'cust-delay')}
                        className="p-0.5 hover:bg-red-100 rounded transition-colors"
                      >
                        <Info className="w-3 h-3 text-red-600" />
                      </button>
                    </div>
                    <span>₹3,200</span>
                  </div>
                  {showInfoTooltip === 'cust-delay' && (
                    <div className="mb-2 p-2 bg-blue-50 border border-blue-300 rounded text-xs text-blue-900">
                      <p className="mb-1"><strong>Customer Contract Clause 5.3:</strong></p>
                      <p>This amount will be debited by the customer as penalty for transit delay.</p>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-gray-600">
                    <span>(-) Other Penalties:</span>
                    <span>₹0</span>
                  </div>
                </div>
                <div className="pt-2 mt-2 border-t border-red-200 flex justify-between text-sm">
                  <span className="text-red-900">Total Expected Debit:</span>
                  <span className="text-red-900">₹24,450</span>
                </div>
              </div>

              {/* Section 3: Final Customer Net Payable */}
              <div className="pt-3 border-t-2 border-green-300">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-green-900">Final Customer Net Payable:</span>
                  <span className="text-2xl text-green-900">₹76,050</span>
                </div>
                <p className="text-xs text-gray-600 italic">
                  = ₹100,500 (Gross) - ₹24,450 (Debits)
                </p>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
                <Brain className="w-3 h-3" />
                <span>91% confidence • AI Auto-Computed</span>
              </div>
            </div>
          </div>

          {/* Right Panel - Verification Status & Actions */}
          <div className="space-y-6">
            {/* Verification Status */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              {davtStatus === 'submitted' && (
                <div className="mb-4 p-3 bg-blue-50 border-2 border-blue-300 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <Clock className="w-4 h-4" />
                    <span>Under DAVT Final Verification</span>
                  </div>
                </div>
              )}

              {needsManualReview ? (
                <div className="p-4 bg-orange-50 border-2 border-orange-300 rounded-xl mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                    <h3 className="text-orange-900">Settlement Requires DAVT Manual Review</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-orange-700">Failed Checks:</span>
                      <span className="text-orange-900">{failedCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-orange-700">Manual Review Flags:</span>
                      <span className="text-orange-900">{failedCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-orange-700">AI Confidence Drop:</span>
                      <span className="text-orange-900">Low image quality detected</span>
                    </div>
                  </div>
                </div>
              ) : allMandatoryDone ? (
                <div className="p-4 bg-green-50 border-2 border-green-300 rounded-xl mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <h3 className="text-green-900">All Settlement Documents Validated</h3>
                  </div>
                </div>
              ) : null}

              <h3 className="text-sm text-gray-700 mb-4">Verification Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Documents Uploaded</span>
                  <span className="text-gray-900">{uploadedCount}/{documents.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Auto Verified</span>
                  <span className="text-green-700">{verifiedCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Manual Flags</span>
                  <span className="text-orange-700">{failedCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Avg Confidence</span>
                  <span className="text-indigo-700">91.5%</span>
                </div>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-sm text-gray-700 mb-4">Actions</h3>
              
              <div className="space-y-3">
                {/* 1. Notify Vendor / Driver */}
                {!vendorNotifyTime ? (
                  <button
                    onClick={() => {
                      const timestamp = new Date().toLocaleString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      }).replace(',', ' |');
                      setVendorNotifyTime(timestamp);
                    }}
                    className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Bell className="w-4 h-4" />
                    Notify Vendor / Driver
                  </button>
                ) : (
                  <div className="p-3 bg-green-50 border-2 border-green-300 rounded-lg">
                    <div className="flex items-center gap-2 text-xs text-green-700">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="flex-1">
                        Notification Sent to Vendor/Driver – {vendorNotifyTime}
                      </span>
                    </div>
                  </div>
                )}

                {/* 2. Ask for Approval */}
                <button
                  onClick={() => setShowApprovalRequest(!showApprovalRequest)}
                  className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  Ask for Approval
                </button>

                {showApprovalRequest && !approvalSent && (
                  <div className="p-4 bg-gray-50 border-2 border-gray-300 rounded-lg space-y-3">
                    <textarea
                      value={approvalComment}
                      onChange={(e) => setApprovalComment(e.target.value)}
                      placeholder="Describe why approval is required…"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>Optional: Attach email approval / WhatsApp screenshot</span>
                    </div>
                    <button
                      onClick={() => {
                        setApprovalSent(true);
                        setShowApprovalRequest(false);
                      }}
                      disabled={!approvalComment.trim()}
                      className={`w-full px-4 py-2 rounded-lg text-sm transition-colors ${
                        approvalComment.trim()
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Send for Approval
                    </button>
                  </div>
                )}

                {approvalSent && (
                  <div className="p-3 bg-blue-50 border-2 border-blue-300 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-blue-700">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approval Request Sent – Waiting for Response</span>
                    </div>
                  </div>
                )}

                {/* 3. Submit for DAVT Final Verification */}
                <button
                  onClick={() => setDavtStatus('submitted')}
                  disabled={davtStatus === 'submitted' || !allMandatoryDone}
                  className={`w-full px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                    davtStatus === 'submitted'
                      ? 'bg-blue-100 text-blue-700 cursor-not-allowed border-2 border-blue-300'
                      : allMandatoryDone
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5" />
                  <span>{davtStatus === 'submitted' ? 'Under DAVT Final Verification' : 'Submit for DAVT Final Verification'}</span>
                </button>

                {/* 4. View AI Verification Result */}
                <button 
                  onClick={onProceedToResult}
                  className="w-full px-4 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View AI Verification Result
                </button>
              </div>

              {/* DAVT Queue Info */}
              {davtStatus === 'submitted' && (
                <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
                  <h4 className="text-sm text-blue-900 mb-3">DAVT Queue Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700">Queue Position:</span>
                      <span className="text-blue-900">#3</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700">Est. Wait Time:</span>
                      <span className="text-blue-900">8-10 min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700">Priority Level:</span>
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs border border-orange-300">
                        High
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Financial Summary */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <IndianRupee className="w-5 h-5 text-indigo-600" />
                <h3 className="text-indigo-900">Settlement Summary</h3>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-lg border border-indigo-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Vendor Payable</span>
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  </div>
                  <p className="text-2xl text-gray-900">₹72,250</p>
                  <p className="text-xs text-gray-500 mt-1">After deductions</p>
                </div>

                <div className="p-3 bg-white rounded-lg border border-indigo-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Customer Billable</span>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-2xl text-gray-900">₹88,500</p>
                  <p className="text-xs text-gray-500 mt-1">Total invoice amount</p>
                </div>

                <div className="pt-3 border-t border-indigo-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Margin</span>
                    <span className="text-green-700">₹16,250 (18.4%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Settlement Doc Card Component
interface SettlementDocCardProps {
  document: SettlementDocument;
  onUpload: () => void;
}

function SettlementDocCard({ document, onUpload }: SettlementDocCardProps) {
  const [showReupload, setShowReupload] = useState(false);
  const Icon = document.icon;

  const statusConfig = {
    pending: {
      bg: 'bg-gray-50',
      border: 'border-gray-300',
      text: 'text-gray-700',
      icon: Clock,
      label: 'Pending',
    },
    uploaded: {
      bg: 'bg-blue-50',
      border: 'border-blue-300',
      text: 'text-blue-700',
      icon: Clock,
      label: 'Processing',
    },
    verified: {
      bg: 'bg-green-50',
      border: 'border-green-300',
      text: 'text-green-700',
      icon: CheckCircle2,
      label: 'Verified',
    },
    failed: {
      bg: 'bg-red-50',
      border: 'border-red-300',
      text: 'text-red-700',
      icon: XCircle,
      label: 'Rejected',
    },
  };

  const config = statusConfig[document.status];
  const StatusIcon = config.icon;
  const hasIssue = document.issue && document.issueReason;

  return (
    <div className={`p-4 rounded-lg border-2 ${config.border} ${config.bg}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`p-2 rounded-lg ${config.bg} border ${config.border}`}>
          <Icon className={`w-4 h-4 ${config.text}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-1">
            <p className="text-sm text-gray-900">{document.name}</p>
            {document.mandatory && (
              <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded border border-red-300">
                Required
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600 mb-2">{document.description}</p>
          {document.file && (
            <p className="text-xs text-gray-500">{document.file}</p>
          )}
        </div>
      </div>

      {/* AI Issue Label */}
      {hasIssue && (
        <div className="mb-3 p-2 bg-red-50 border border-red-300 rounded-lg">
          <p className="text-xs text-red-700 mb-1">{document.issue}</p>
          <p className="text-xs text-red-600">{document.issueReason}</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md ${config.bg} border ${config.border}`}>
          <StatusIcon className={`w-3.5 h-3.5 ${config.text}`} />
          <span className={`text-xs ${config.text}`}>{config.label}</span>
        </div>

        {document.aiConfidence && (
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Brain className="w-3 h-3" />
            <span>{document.aiConfidence}%</span>
          </div>
        )}
      </div>

      {/* Upload Button for Pending */}
      {document.status === 'pending' && (
        <button
          onClick={onUpload}
          className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload
        </button>
      )}

      {/* Re-upload + Preview for Uploaded/Verified */}
      {(document.status === 'verified' || document.status === 'uploaded') && !showReupload && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowReupload(true)}
            className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Re-upload
          </button>
          <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Inline Re-upload Area */}
      {showReupload && (
        <div className="space-y-2">
          <div className="p-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
            <input
              type="file"
              className="text-xs text-gray-600"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  onUpload();
                  setShowReupload(false);
                }
              }}
            />
            <p className="text-xs text-gray-500 mt-1">Click to select replacement file</p>
          </div>
          <button
            onClick={() => setShowReupload(false)}
            className="w-full px-3 py-1.5 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Re-upload Button for Failed */}
      {document.status === 'failed' && !showReupload && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowReupload(true)}
            className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Re-upload Better Quality
          </button>
          <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// Simple Data Card Component
interface SimpleDataCardProps {
  label: string;
  value: string;
  source: string;
  confidence: number;
  editable: boolean;
}

function SimpleDataCard({ label, value, source, confidence, editable }: SimpleDataCardProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'text-green-700 bg-green-50 border-green-300';
    if (confidence >= 85) return 'text-blue-700 bg-blue-50 border-blue-300';
    if (confidence >= 75) return 'text-yellow-700 bg-yellow-50 border-yellow-300';
    return 'text-red-700 bg-red-50 border-red-300';
  };

  const confidenceColor = getConfidenceColor(confidence);

  return (
    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm text-gray-900">{label}</p>
        {editable && (
          <button className="p-1 hover:bg-gray-200 rounded transition-colors">
            <Edit3 className="w-3.5 h-3.5 text-gray-600" />
          </button>
        )}
      </div>
      
      <p className="text-lg text-gray-900 mb-2">{value}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <FileText className="w-3 h-3" />
          <span>{source}</span>
        </div>
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs border ${confidenceColor}`}>
          <Brain className="w-3 h-3" />
          <span>{confidence}%</span>
        </div>
      </div>
    </div>
  );
}