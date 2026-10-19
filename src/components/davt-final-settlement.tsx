import { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  FileText,
  Sparkles,
  Clock,
  Shield,
  AlertTriangle,
  CheckCheck,
  ThumbsUp,
  ThumbsDown,
  Brain,
  IndianRupee,
  Calendar,
  TrendingDown,
  Package,
  Scale,
  Percent,
  ArrowUpCircle,
  Calculator,
  FileCheck,
  User,
  Truck,
  Info,
  Target,
  Zap
} from 'lucide-react';

interface DAVTFinalSettlementProps {
  orderId: string | null;
  onBack: () => void;
}

interface CrossValidation {
  field: string;
  documents: { doc: string; value: string; status: 'match' | 'mismatch' }[];
  status: 'match' | 'mismatch' | 'partial';
}

interface Deduction {
  type: 'delay' | 'damage' | 'shortage' | 'penalty';
  description: string;
  calculation: string;
  amount: number;
  severity: 'high' | 'medium' | 'low';
  aiExplanation: string;
}

interface PayoutSummary {
  baseFreight: number;
  totalDeductions: number;
  finalPayout: number;
  deductions: Deduction[];
  timeline: {
    expectedDelivery: string;
    actualDelivery: string;
    delayDays: number;
  };
}

interface AIRecommendation {
  decision: 'approve' | 'reject' | 'escalate';
  confidence: number;
  reasons: string[];
  financialRisk: 'low' | 'medium' | 'high';
}

export function DAVTFinalSettlement({ orderId, onBack }: DAVTFinalSettlementProps) {
  const [crossValidations] = useState<CrossValidation[]>([
    {
      field: 'Total Packages',
      documents: [
        { doc: 'LR', value: '150', status: 'match' },
        { doc: 'POD', value: '148', status: 'mismatch' },
        { doc: 'GRN', value: '148', status: 'mismatch' },
      ],
      status: 'mismatch',
    },
    {
      field: 'Delivery Date',
      documents: [
        { doc: 'LR (Expected)', value: '10-Dec-2024', status: 'mismatch' },
        { doc: 'POD (Actual)', value: '12-Dec-2024', status: 'mismatch' },
      ],
      status: 'mismatch',
    },
    {
      field: 'Accepted Quantity',
      documents: [
        { doc: 'POD', value: '148 Units', status: 'match' },
        { doc: 'GRN (Accepted)', value: '145 Units', status: 'mismatch' },
      ],
      status: 'mismatch',
    },
    {
      field: 'Vehicle Number',
      documents: [
        { doc: 'LR', value: 'MH-12-AB-1234', status: 'match' },
        { doc: 'POD', value: 'MH-12-AB-1234', status: 'match' },
      ],
      status: 'match',
    },
    {
      field: 'Consignee Signature',
      documents: [
        { doc: 'POD', value: 'Verified ✓', status: 'match' },
        { doc: 'GRN', value: 'Verified ✓', status: 'match' },
      ],
      status: 'match',
    },
  ]);

  const payoutSummary: PayoutSummary = {
    baseFreight: 35000,
    totalDeductions: 21000,
    finalPayout: 14000,
    timeline: {
      expectedDelivery: '10-Dec-2024',
      actualDelivery: '12-Dec-2024',
      delayDays: 2,
    },
    deductions: [
      {
        type: 'delay',
        description: 'Delivery Delay Penalty',
        calculation: '2 days × ₹500/day',
        amount: 1000,
        severity: 'low',
        aiExplanation: 'Delivery delayed by 2 days. Expected: 10-Dec-2024, Actual: 12-Dec-2024. Contract clause 4.2 specifies ₹500 per day penalty for delays beyond grace period.',
      },
      {
        type: 'damage',
        description: 'Damaged Goods Compensation',
        calculation: '3 units × ₹5,000/unit',
        amount: 15000,
        severity: 'high',
        aiExplanation: 'POD reports 3 packages with external damage. GRN confirms 3 units rejected due to damage. AI vision detected packaging damage in uploaded photos. Standard compensation of ₹5,000 per damaged unit as per contract.',
      },
      {
        type: 'shortage',
        description: 'Shortage Penalty',
        calculation: '2 units × ₹2,500/unit',
        amount: 5000,
        severity: 'medium',
        aiExplanation: 'Shipped 150 units but only 148 received per POD. 2 units shortage detected. Contract specifies ₹2,500 penalty per missing unit for accountability.',
      },
    ],
  };

  const aiRecommendation: AIRecommendation = {
    decision: 'approve',
    confidence: 89,
    reasons: [
      'All document signatures verified and authentic',
      'Damage claim supported by photographic evidence',
      'Shortage confirmed across POD and GRN',
      'Delay penalty calculation verified against contract terms',
      'Final payout calculation mathematically correct',
      'Deduction percentages within acceptable range (60% of base)',
    ],
    financialRisk: 'low',
  };

  const [rejectReason, setRejectReason] = useState('');
  const [escalationNote, setEscalationNote] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Final Settlement APPROVED for Order ${orderId}\nVendor Payout: ₹${payoutSummary.finalPayout.toLocaleString()}\nPayment initiated to vendor account.`);
      onBack();
    }, 1500);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Final Settlement REJECTED for Order ${orderId}\nReason: ${rejectReason}\nCase sent back to Ops for review.`);
      setShowRejectModal(false);
      onBack();
    }, 1500);
  };

  const handleEscalate = () => {
    if (!escalationNote.trim()) {
      alert('Please provide escalation details');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Order ${orderId} ESCALATED to Senior Management\nNote: ${escalationNote}`);
      setShowEscalateModal(false);
      onBack();
    }, 1500);
  };

  const matchedCount = crossValidations.filter(v => v.status === 'match').length;
  const mismatchedCount = crossValidations.filter(v => v.status === 'mismatch').length;
  const deductionPercentage = ((payoutSummary.totalDeductions / payoutSummary.baseFreight) * 100).toFixed(1);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm px-8 py-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to DAVT Queue
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-gray-900">DAVT Final Settlement - Payout Verification</h1>
              <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5" />
                AI Payout Engine
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Order {orderId || 'ORD-2024-001'} • Review POD, validate deductions & approve vendor payment
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowEscalateModal(true)}
              disabled={isSubmitting}
              className="px-4 py-2.5 border-2 border-yellow-600 text-yellow-700 rounded-lg hover:bg-yellow-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ArrowUpCircle className="w-4 h-4" />
              Escalate
            </button>
            <button 
              onClick={() => setShowRejectModal(true)}
              disabled={isSubmitting}
              className="px-4 py-2.5 border-2 border-red-600 text-red-700 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ThumbsDown className="w-4 h-4" />
              Reject
            </button>
            <button 
              onClick={handleApprove}
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-green-500/30"
            >
              {isSubmitting ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ThumbsUp className="w-4 h-4" />
                  Final Approve
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-6 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 mb-1">Base Freight</p>
                <p className="text-2xl text-blue-900">₹{(payoutSummary.baseFreight / 1000).toFixed(0)}K</p>
              </div>
              <IndianRupee className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 mb-1">Deductions</p>
                <p className="text-2xl text-red-900">₹{(payoutSummary.totalDeductions / 1000).toFixed(0)}K</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 mb-1">Final Payout</p>
                <p className="text-2xl text-green-900">₹{(payoutSummary.finalPayout / 1000).toFixed(0)}K</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 mb-1">Delay</p>
                <p className="text-2xl text-purple-900">{payoutSummary.timeline.delayDays}d</p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 mb-1">Deduction %</p>
                <p className="text-2xl text-yellow-900">{deductionPercentage}%</p>
              </div>
              <Percent className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-indigo-700 mb-1">AI Confidence</p>
                <p className="text-2xl text-indigo-900">{aiRecommendation.confidence}%</p>
              </div>
              <Sparkles className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-12 gap-6 p-8">
          {/* LEFT PANEL - Cross Document Validation */}
          <div className="col-span-4 space-y-4 overflow-auto pr-2">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <h2 className="text-gray-900">POD vs LR vs GRN</h2>
              </div>
              <p className="text-sm text-gray-500">Cross-document validation</p>
            </div>

            {/* Validation Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-700">Validation Summary</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-xs text-green-700 mb-1">Matched</p>
                  <p className="text-xl text-green-900">{matchedCount}</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-xs text-red-700 mb-1">Mismatched</p>
                  <p className="text-xl text-red-900">{mismatchedCount}</p>
                </div>
              </div>
            </div>

            {/* Cross Validations */}
            <div className="space-y-3">
              {crossValidations.map((validation, idx) => (
                <CrossValidationCard key={idx} validation={validation} />
              ))}
            </div>

            {/* Timeline */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 p-5 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-purple-600" />
                <h3 className="text-sm text-gray-900">Delivery Timeline</h3>
              </div>

              <div className="space-y-3">
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Expected Delivery</p>
                  <p className="text-sm text-gray-900">{payoutSummary.timeline.expectedDelivery}</p>
                </div>

                <div className="flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <Clock className="w-5 h-5 text-purple-600 mb-1" />
                    <span className="text-xs text-purple-700">{payoutSummary.timeline.delayDays} days late</span>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-xs text-red-700 mb-1">Actual Delivery</p>
                  <p className="text-sm text-red-900">{payoutSummary.timeline.actualDelivery}</p>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER PANEL - AI Deduction Breakdown */}
          <div className="col-span-4 space-y-4 overflow-auto px-2">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="w-5 h-5 text-red-600" />
                <h2 className="text-gray-900">AI Deduction Breakdown</h2>
              </div>
              <p className="text-sm text-gray-500">Automated penalty calculation</p>
            </div>

            {/* Deductions */}
            <div className="space-y-3">
              {payoutSummary.deductions.map((deduction, idx) => (
                <DeductionCard key={idx} deduction={deduction} />
              ))}
            </div>

            {/* Total Summary */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border-2 border-gray-700 p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <IndianRupee className="w-6 h-6 text-white" />
                <h3 className="text-white text-lg">Payment Summary</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/20">
                  <span className="text-sm text-gray-300">Base Freight Amount</span>
                  <span className="text-lg text-white">₹{payoutSummary.baseFreight.toLocaleString()}</span>
                </div>

                <div className="border-t border-white/20 pt-3 space-y-2">
                  {payoutSummary.deductions.map((deduction, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{deduction.description}</span>
                      <span className="text-red-400">-₹{deduction.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 border-white/40 pt-3">
                  <div className="flex items-center justify-between p-4 bg-green-500/20 rounded-lg border-2 border-green-500">
                    <span className="text-white">Final Vendor Payout</span>
                    <span className="text-2xl text-green-400">₹{payoutSummary.finalPayout.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-lg p-3 mt-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    <div>
                      <p className="text-xs text-yellow-200">Total Deduction: {deductionPercentage}% of base</p>
                      <p className="text-xs text-yellow-300 mt-0.5">
                        ₹{payoutSummary.totalDeductions.toLocaleString()} deducted from ₹{payoutSummary.baseFreight.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL - AI Recommendation & Vendor Summary */}
          <div className="col-span-4 space-y-4 overflow-auto pl-2">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-indigo-600" />
                <h2 className="text-gray-900">AI Recommendation</h2>
              </div>
              <p className="text-sm text-gray-500">Final settlement decision</p>
            </div>

            {/* AI Decision */}
            <AISettlementDecision recommendation={aiRecommendation} />

            {/* Vendor Payout Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 shadow-lg">
              <div className="p-5 border-b border-blue-200">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm text-gray-900">Vendor Payment Details</h3>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Vendor Name</p>
                  <p className="text-sm text-gray-900">Transport Solutions Pvt Ltd</p>
                </div>

                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Vehicle Number</p>
                  <p className="text-sm text-gray-900">MH-12-AB-1234</p>
                </div>

                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Route</p>
                  <p className="text-sm text-gray-900">Mumbai → Delhi</p>
                </div>

                <div className="bg-green-100 border-2 border-green-300 rounded-lg p-3">
                  <p className="text-xs text-green-700 mb-1">Payout Amount</p>
                  <p className="text-2xl text-green-900">₹{payoutSummary.finalPayout.toLocaleString()}</p>
                </div>

                <div className={`border-2 rounded-lg p-3 ${
                  aiRecommendation.financialRisk === 'low'
                    ? 'bg-green-50 border-green-200'
                    : aiRecommendation.financialRisk === 'high'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <Shield className={`w-4 h-4 ${
                      aiRecommendation.financialRisk === 'low'
                        ? 'text-green-600'
                        : aiRecommendation.financialRisk === 'high'
                        ? 'text-red-600'
                        : 'text-yellow-600'
                    }`} />
                    <div>
                      <p className="text-xs text-gray-600">Financial Risk</p>
                      <p className={`text-sm ${
                        aiRecommendation.financialRisk === 'low'
                          ? 'text-green-900'
                          : aiRecommendation.financialRisk === 'high'
                          ? 'text-red-900'
                          : 'text-yellow-900'
                      }`}>
                        {aiRecommendation.financialRisk.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm text-gray-900">AI Processing Insights</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/60 rounded-lg p-2">
                  <p className="text-xs text-gray-600">Documents Verified</p>
                  <p className="text-sm text-purple-900">3/3</p>
                </div>
                <div className="bg-white/60 rounded-lg p-2">
                  <p className="text-xs text-gray-600">Signatures Valid</p>
                  <p className="text-sm text-purple-900">✓ Yes</p>
                </div>
                <div className="bg-white/60 rounded-lg p-2">
                  <p className="text-xs text-gray-600">Calculation Time</p>
                  <p className="text-sm text-purple-900">1.4s</p>
                </div>
                <div className="bg-white/60 rounded-lg p-2">
                  <p className="text-xs text-gray-600">Model Version</p>
                  <p className="text-sm text-purple-900">v4.1</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg text-gray-900 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                Reject Final Settlement
              </h3>
            </div>
            <div className="p-6">
              <label className="block text-sm text-gray-700 mb-2">
                Rejection Reason <span className="text-red-600">*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter detailed reason for rejection..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              />
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={isSubmitting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    Confirm Rejection
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Escalate Modal */}
      {showEscalateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg text-gray-900 flex items-center gap-2">
                <ArrowUpCircle className="w-5 h-5 text-yellow-600" />
                Escalate to Management
              </h3>
            </div>
            <div className="p-6">
              <label className="block text-sm text-gray-700 mb-2">
                Escalation Note <span className="text-red-600">*</span>
              </label>
              <textarea
                value={escalationNote}
                onChange={(e) => setEscalationNote(e.target.value)}
                placeholder="Enter reason for escalation and concerns..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
              />
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowEscalateModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEscalate}
                disabled={isSubmitting}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    Escalating...
                  </>
                ) : (
                  <>
                    <ArrowUpCircle className="w-4 h-4" />
                    Confirm Escalation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Cross Validation Card Component
interface CrossValidationCardProps {
  validation: CrossValidation;
}

function CrossValidationCard({ validation }: CrossValidationCardProps) {
  const getStatusIcon = () => {
    switch (validation.status) {
      case 'match':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'mismatch':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusStyles = () => {
    switch (validation.status) {
      case 'match':
        return 'bg-green-50 border-green-200';
      case 'mismatch':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <div className={`border-2 rounded-lg p-3 shadow-sm ${getStatusStyles()}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-sm text-gray-900">{validation.field}</span>
        </div>
        <span className={`px-2 py-0.5 rounded text-xs ${
          validation.status === 'match'
            ? 'bg-green-100 text-green-700'
            : validation.status === 'mismatch'
            ? 'bg-red-100 text-red-700'
            : 'bg-yellow-100 text-yellow-700'
        }`}>
          {validation.status === 'match' ? 'Match' : 'Mismatch'}
        </span>
      </div>

      <div className="space-y-2">
        {validation.documents.map((doc, idx) => (
          <div key={idx} className={`bg-white/60 rounded px-3 py-2 flex items-center justify-between ${
            doc.status === 'mismatch' ? 'border-l-4 border-red-400' : ''
          }`}>
            <span className="text-xs text-gray-600">{doc.doc}:</span>
            <span className="text-xs text-gray-900">{doc.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Deduction Card Component
interface DeductionCardProps {
  deduction: Deduction;
}

function DeductionCard({ deduction }: DeductionCardProps) {
  const getTypeConfig = () => {
    switch (deduction.type) {
      case 'delay':
        return { icon: Clock, color: 'purple', label: 'Delay Penalty' };
      case 'damage':
        return { icon: AlertTriangle, color: 'red', label: 'Damage' };
      case 'shortage':
        return { icon: Package, color: 'orange', label: 'Shortage' };
      default:
        return { icon: Scale, color: 'gray', label: 'Penalty' };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  return (
    <div className={`bg-${config.color}-50 border-2 border-${config.color}-200 rounded-xl p-4 shadow-lg`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 bg-${config.color}-600 rounded-lg flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm text-gray-900">{deduction.description}</h4>
            <span className={`px-2 py-0.5 rounded text-xs ${
              deduction.severity === 'high'
                ? 'bg-red-100 text-red-700'
                : deduction.severity === 'medium'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {deduction.severity.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-gray-600">{deduction.calculation}</p>
        </div>
      </div>

      <div className={`bg-${config.color}-100 border border-${config.color}-300 rounded-lg p-3 mb-3`}>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Deduction Amount</span>
          <span className={`text-xl text-${config.color}-900`}>-₹{deduction.amount.toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-white/60 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <Sparkles className={`w-4 h-4 text-${config.color}-600 flex-shrink-0 mt-0.5`} />
          <div>
            <p className="text-xs text-gray-600 mb-1">AI Explanation:</p>
            <p className="text-xs text-gray-700 leading-relaxed">{deduction.aiExplanation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// AI Settlement Decision Component
interface AISettlementDecisionProps {
  recommendation: AIRecommendation;
}

function AISettlementDecision({ recommendation }: AISettlementDecisionProps) {
  const getConfig = () => {
    switch (recommendation.decision) {
      case 'approve':
        return {
          icon: CheckCheck,
          bg: 'from-green-50 to-emerald-50',
          border: 'border-green-300',
          iconBg: 'bg-green-600',
          title: '✅ RECOMMEND APPROVAL',
          titleColor: 'text-green-900',
        };
      case 'reject':
        return {
          icon: XCircle,
          bg: 'from-red-50 to-rose-50',
          border: 'border-red-300',
          iconBg: 'bg-red-600',
          title: '❌ RECOMMEND REJECTION',
          titleColor: 'text-red-900',
        };
      case 'escalate':
        return {
          icon: ArrowUpCircle,
          bg: 'from-yellow-50 to-amber-50',
          border: 'border-yellow-300',
          iconBg: 'bg-yellow-600',
          title: '🧠 RECOMMEND ESCALATION',
          titleColor: 'text-yellow-900',
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <div className={`rounded-xl border-2 ${config.border} bg-gradient-to-br ${config.bg} shadow-lg p-5`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 ${config.iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className={`${config.titleColor} mb-1`}>{config.title}</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Confidence:</span>
            <div className="flex-1 h-1.5 bg-white/50 rounded-full overflow-hidden max-w-[100px]">
              <div 
                className={`h-full ${
                  recommendation.decision === 'approve' ? 'bg-green-600' :
                  recommendation.decision === 'reject' ? 'bg-red-600' :
                  'bg-yellow-600'
                }`}
                style={{ width: `${recommendation.confidence}%` }}
              />
            </div>
            <span className="text-xs text-gray-700">{recommendation.confidence}%</span>
          </div>
        </div>
      </div>

      {recommendation.reasons.length > 0 && (
        <div className="bg-white/60 rounded-lg p-3">
          <p className="text-xs text-gray-700 mb-2">AI Analysis:</p>
          <ul className="space-y-1.5">
            {recommendation.reasons.map((reason, idx) => (
              <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
