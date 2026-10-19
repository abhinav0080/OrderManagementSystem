import { useState } from 'react';
import { 
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Brain,
  AlertTriangle,
  FileText,
  Scale,
  Calendar,
  Clock,
  Sparkles,
  RefreshCw,
  Bell,
  Send,
  IndianRupee,
  TrendingDown,
  Target,
  Activity,
  Package,
  FileCheck,
  Camera,
  Timer,
  Info,
  TrendingUp,
  ExternalLink
} from 'lucide-react';

interface OpsSettlementResultProps {
  orderId: string | null;
  onBack: () => void;
  onReupload: () => void;
}

type ResultStatus = 'approved' | 'failed' | 'manual-review';

interface CheckResult {
  id: string;
  category: 'passed' | 'failed' | 'manual';
  title: string;
  description: string;
  confidence: number;
  icon: any;
}

export function OpsSettlementResult({ orderId, onBack, onReupload }: OpsSettlementResultProps) {
  const [resultStatus] = useState<ResultStatus>('manual-review');
  const [supervisorNotifyTime, setSupervisorNotifyTime] = useState('');
  const [showReuploadSection, setShowReuploadSection] = useState(false);
  const [flaggedDocsResolved, setFlaggedDocsResolved] = useState(false);
  const [showInfoTooltip, setShowInfoTooltip] = useState<string | null>(null);

  const passedChecks: CheckResult[] = [
    {
      id: '1',
      category: 'passed',
      title: 'POD Date Verified',
      description: 'Delivery date 10-Dec-2024 extracted from POD. Within expected TAT window.',
      confidence: 98,
      icon: Calendar,
    },
    {
      id: '2',
      category: 'passed',
      title: 'GRN Quantity Cross-Check',
      description: 'GRN quantity 950 units matches expected delivery (1000 - 50 shortage).',
      confidence: 96,
      icon: Package,
    },
    {
      id: '3',
      category: 'passed',
      title: 'Transit TAT Calculated',
      description: 'Planned: 48h | Actual: 52h | Delay: 4 hours. Within acceptable margin.',
      confidence: 97,
      icon: Clock,
    },
    {
      id: '4',
      category: 'passed',
      title: 'Detention Period Extracted',
      description: 'Vehicle detained for 3 days at unloading point. Extracted from gate entry timestamps.',
      confidence: 95,
      icon: Timer,
    },
    {
      id: '5',
      category: 'passed',
      title: 'Contract Clause Applied',
      description: 'Detention penalty: ₹3,500 (Rs 1000×2 days + Rs 1500×1 day) as per Clause 6.1.',
      confidence: 93,
      icon: FileText,
    },
  ];

  const failedChecks: CheckResult[] = [
    {
      id: '1',
      category: 'failed',
      title: 'Damage Value Mismatch',
      description: 'AI calculated ₹8,750 damage but contract clause suggests ₹9,200. Needs manual verification.',
      confidence: 87,
      icon: IndianRupee,
    },
  ];

  const manualChecks: CheckResult[] = [
    {
      id: '1',
      category: 'manual',
      title: 'Damage Proof Quality Issue',
      description: 'Image quality 73% - damage not clearly visible. Better angle or lighting needed for accurate assessment.',
      confidence: 73,
      icon: Camera,
    },
    {
      id: '2',
      category: 'manual',
      title: 'Shortage Calculation Review',
      description: 'Shortage quantity 50 units detected but needs DAVT confirmation for value calculation.',
      confidence: 85,
      icon: Scale,
    },
  ];

  const statusConfig = {
    bg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    icon: Brain,
    label: 'Manual Review Required',
    subtitle: 'Settlement calculations flagged for DAVT final verification',
  };

  const StatusIcon = statusConfig.icon;
  const totalChecks = passedChecks.length + failedChecks.length + manualChecks.length;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Status Banner */}
      <div className={`${statusConfig.bg} text-white shadow-2xl`}>
        <div className="px-8 py-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Settlement Upload
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                <StatusIcon className="w-10 h-10" />
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl text-white">Settlement AI Verification Summary</h1>
                  {orderId && (
                    <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm border border-white/30">
                      {orderId}
                    </div>
                  )}
                </div>
                <p className="text-lg text-white/90">{statusConfig.subtitle}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <Clock className="w-4 h-4" />
                    <span>Verified: {new Date().toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <Activity className="w-4 h-4" />
                    <span>Processing Time: 2.3 seconds</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="flex items-center gap-6">
              <div className="text-center px-6 py-4 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                <p className="text-3xl mb-1">{passedChecks.length}/{totalChecks}</p>
                <p className="text-sm text-white/80">Checks Passed</p>
              </div>
              {failedChecks.length > 0 && (
                <div className="text-center px-6 py-4 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                  <p className="text-3xl mb-1">{failedChecks.length}</p>
                  <p className="text-sm text-white/80">Failed</p>
                </div>
              )}
              {manualChecks.length > 0 && (
                <div className="text-center px-6 py-4 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                  <p className="text-3xl mb-1">{manualChecks.length}</p>
                  <p className="text-sm text-white/80">Manual Review</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-6">
          {/* Left Column - Passed Checks */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <h2 className="text-gray-900">Passed Checks</h2>
                <span className="ml-auto px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm border border-green-300">
                  {passedChecks.length} Verified
                </span>
              </div>

              <div className="space-y-4">
                {passedChecks.map((check) => (
                  <CheckCard key={check.id} check={check} />
                ))}
              </div>
            </div>
          </div>

          {/* Center Column - Failed & Manual Checks */}
          <div className="space-y-6">
            {failedChecks.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <h2 className="text-gray-900">Failed Checks</h2>
                  <span className="ml-auto px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm border border-red-300">
                    {failedChecks.length} Issues
                  </span>
                </div>

                <div className="space-y-4">
                  {failedChecks.map((check) => (
                    <CheckCard key={check.id} check={check} />
                  ))}
                </div>
              </div>
            )}

            {/* Manual Review Checks */}
            {manualChecks.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Brain className="w-5 h-5 text-yellow-600" />
                  <h2 className="text-gray-900">Pending Manual Review</h2>
                  <span className="ml-auto px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm border border-yellow-300">
                    {manualChecks.length} Flagged
                  </span>
                </div>

                <div className="space-y-4">
                  {manualChecks.map((check) => (
                    <CheckCard key={check.id} check={check} />
                  ))}
                </div>
              </div>
            )}

            {/* AI Processing Summary */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm text-gray-900">AI Processing Summary</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Documents Verified</span>
                  <span className="text-gray-900">6/6</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Cross-Checks Run</span>
                  <span className="text-gray-900">{totalChecks}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Avg AI Confidence</span>
                  <span className="text-indigo-700">91.5%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Processing Time</span>
                  <span className="text-gray-900">2.3s</span>
                </div>
              </div>
            </div>

            {/* Enhanced Financial Summary with Info Buttons */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <IndianRupee className="w-5 h-5 text-indigo-600" />
                <h3 className="text-indigo-900">Settlement Breakdown</h3>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Base Amount:</span>
                  <span className="text-gray-900">₹95,000</span>
                </div>

                {/* Shortage with Info Button */}
                <div>
                  <div className="flex items-center justify-between text-red-700">
                    <div className="flex items-center gap-2">
                      <span>Shortage (50 units):</span>
                      <button
                        onClick={() => setShowInfoTooltip(showInfoTooltip === 'shortage' ? null : 'shortage')}
                        className="p-0.5 hover:bg-red-100 rounded transition-colors"
                      >
                        <Info className="w-3.5 h-3.5 text-red-600" />
                      </button>
                    </div>
                    <span>- ₹12,500</span>
                  </div>
                  {showInfoTooltip === 'shortage' && (
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-300 rounded text-xs text-blue-900">
                      <p className="mb-1"><strong>Contract Clause 4.2:</strong></p>
                      <p>Shortage tolerance: 1% of total quantity. Beyond tolerance: ₹250 per unit deduction.</p>
                    </div>
                  )}
                </div>

                {/* Damage with Info Button */}
                <div>
                  <div className="flex items-center justify-between text-red-700">
                    <div className="flex items-center gap-2">
                      <span>Damage (25 units):</span>
                      <button
                        onClick={() => setShowInfoTooltip(showInfoTooltip === 'damage' ? null : 'damage')}
                        className="p-0.5 hover:bg-red-100 rounded transition-colors"
                      >
                        <Info className="w-3.5 h-3.5 text-red-600" />
                      </button>
                    </div>
                    <span>- ₹8,750</span>
                  </div>
                  {showInfoTooltip === 'damage' && (
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-300 rounded text-xs text-blue-900">
                      <p className="mb-1"><strong>Contract Clause 4.5:</strong></p>
                      <p>Damage valuation: ₹350 per unit. Vendor liability: 80%. Customer recovery: 90%.</p>
                    </div>
                  )}
                </div>

                {/* Detention with Loading/Unloading breakdown and Info Button */}
                <div>
                  <div className="flex items-center justify-between text-orange-700">
                    <div className="flex items-center gap-2">
                      <span>Detention:</span>
                      <button
                        onClick={() => setShowInfoTooltip(showInfoTooltip === 'detention' ? null : 'detention')}
                        className="p-0.5 hover:bg-orange-100 rounded transition-colors"
                      >
                        <Info className="w-3.5 h-3.5 text-orange-600" />
                      </button>
                    </div>
                  </div>
                  <div className="ml-4 mt-1 space-y-1 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Loading Detention: 2 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Unloading Detention: 1 day</span>
                    </div>
                    <div className="flex justify-between text-orange-700">
                      <span>Vendor Rate: ₹1,000/day</span>
                      <span>₹2,000</span>
                    </div>
                    <div className="flex justify-between text-green-700">
                      <span>Customer Rate: ₹1,500/day</span>
                      <span>₹4,500</span>
                    </div>
                  </div>
                  {showInfoTooltip === 'detention' && (
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-300 rounded text-xs text-blue-900">
                      <p className="mb-1"><strong>Contract Clause 6.1:</strong></p>
                      <p>Loading: First 2 days free, ₹1000/day after. Unloading: First 1 day free, ₹1500/day after.</p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t-2 border-indigo-300 flex items-center justify-between">
                  <span className="text-gray-900">Vendor Payable:</span>
                  <span className="text-xl text-indigo-900">₹73,750</span>
                </div>
              </div>
            </div>

            {/* Customer Net Payable Breakdown */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <IndianRupee className="w-5 h-5 text-green-600" />
                <h3 className="text-green-900">Customer Net Payable</h3>
              </div>
              
              {/* Section 1: Gross Payable */}
              <div className="mb-3 pb-3 border-b border-green-300">
                <h4 className="text-xs text-green-800 mb-2">✅ Gross Payable</h4>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Freight:</span>
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
                <div className="pt-2 mt-2 border-t border-green-200 flex justify-between text-sm">
                  <span className="text-green-900">Gross Total:</span>
                  <span className="text-green-900">₹100,500</span>
                </div>
              </div>

              {/* Section 2: Expected Debits */}
              <div className="mb-3 pb-3 border-b border-green-300">
                <h4 className="text-xs text-red-800 mb-2">❌ Expected Debits from Customer</h4>
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
                      <p>This amount will be debited by the customer for shortage recovery.</p>
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
                      <p>This amount will be debited by the customer for damage recovery.</p>
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
                      <p>This amount will be debited by the customer as penalty for transit delay.</p>
                    </div>
                  )}
                </div>
                <div className="pt-2 mt-2 border-t border-red-200 flex justify-between text-sm">
                  <span className="text-red-900">Total Debits:</span>
                  <span className="text-red-900">₹24,450</span>
                </div>
              </div>

              {/* Section 3: Net Payable */}
              <div className="pt-3 border-t-2 border-green-300">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-green-900">Final Net Payable:</span>
                  <span className="text-2xl text-green-900">₹76,050</span>
                </div>
                <p className="text-xs text-gray-600 italic">
                  = ₹100,500 - ₹24,450
                </p>
              </div>
            </div>

            {/* Behavioral Patterns Detected */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-purple-600" />
                <h3 className="text-sm text-gray-900">📊 Behavioural Patterns Detected</h3>
              </div>
              
              <div className="space-y-4">
                {/* Loading Plant Behaviour */}
                <div className="p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm text-yellow-900">Loading Plant Behaviour</h4>
                    <div className="flex items-center gap-1 text-xs text-red-700">
                      <TrendingUp className="w-3 h-3" />
                      <span>↑ High</span>
                    </div>
                  </div>
                  <p className="text-xs text-yellow-800 mb-2">
                    "10 shortage cases in the last 30 days from this plant."
                  </p>
                  <button className="flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 transition-colors">
                    <ExternalLink className="w-3 h-3" />
                    <span>View past incidents</span>
                  </button>
                </div>

                {/* Driver Behaviour */}
                <div className="p-3 bg-orange-50 border border-orange-300 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm text-orange-900">Driver Behaviour</h4>
                    <div className="flex items-center gap-1 text-xs text-orange-700">
                      <TrendingUp className="w-3 h-3" />
                      <span>↑ Concern</span>
                    </div>
                  </div>
                  <p className="text-xs text-orange-800 mb-2">
                    "7 out of last 10 trips with this driver had delays."
                  </p>
                  <button className="flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 transition-colors">
                    <ExternalLink className="w-3 h-3" />
                    <span>View driver history</span>
                  </button>
                </div>

                {/* Lane Behaviour */}
                <div className="p-3 bg-red-50 border border-red-300 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm text-red-900">Lane Behaviour</h4>
                    <div className="flex items-center gap-1 text-xs text-red-700">
                      <TrendingUp className="w-3 h-3" />
                      <span>↑ Critical</span>
                    </div>
                  </div>
                  <p className="text-xs text-red-800 mb-2">
                    "6 out of 20 shipments on Mumbai → Delhi lane had damage incidents (last 45 days)."
                  </p>
                  <button className="flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 transition-colors">
                    <ExternalLink className="w-3 h-3" />
                    <span>View lane analytics</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-sm text-gray-700 mb-4">Actions</h3>
              
              <div className="space-y-3">
                {/* 1. Wait for DAVT Verification */}
                <button 
                  onClick={onBack}
                  className="w-full px-4 py-3 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors flex items-center justify-center gap-2 border border-yellow-300"
                >
                  <Clock className="w-5 h-5" />
                  <span>Wait for DAVT Verification</span>
                </button>

                {/* 2. Notify Supervisor */}
                {!supervisorNotifyTime ? (
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
                      setSupervisorNotifyTime(timestamp);
                    }}
                    className="w-full px-4 py-3 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors flex items-center justify-center gap-2 border border-orange-300"
                  >
                    <Bell className="w-4 h-4" />
                    Notify Supervisor
                  </button>
                ) : (
                  <div className="p-3 bg-orange-50 border-2 border-orange-300 rounded-lg">
                    <div className="flex items-center gap-2 text-xs text-orange-700">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="flex-1">
                        Notification Sent to Supervisor – {supervisorNotifyTime}
                      </span>
                    </div>
                  </div>
                )}

                {/* 3. Re-upload Better Quality */}
                {!showReuploadSection ? (
                  <button
                    onClick={() => setShowReuploadSection(true)}
                    className="w-full px-4 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2 border border-blue-300"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Re-upload Better Quality
                  </button>
                ) : flaggedDocsResolved ? (
                  <button
                    onClick={onBack}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
                  >
                    <Send className="w-5 h-5" />
                    Submit for DAVT Final Verification
                  </button>
                ) : null}
              </div>

              {/* Inline Re-upload Section for Flagged Docs */}
              {showReuploadSection && !flaggedDocsResolved && (
                <div className="mt-4 p-4 bg-gray-50 border-2 border-gray-300 rounded-lg space-y-4">
                  <h4 className="text-sm text-gray-900 mb-3">AI-Flagged Documents</h4>
                  
                  {/* Flagged Doc 1: Damage Proof */}
                  <div className="p-3 bg-yellow-50 border border-yellow-300 rounded-lg space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-yellow-700" />
                        <span className="text-sm text-yellow-900">Damage Proof</span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs border border-yellow-300">
                        <Brain className="w-3 h-3" />
                        <span>73%</span>
                      </div>
                    </div>
                    <p className="text-xs text-yellow-700 mb-2">Image quality insufficient - damage not clearly visible</p>
                    
                    <div className="p-2 bg-white border-2 border-dashed border-gray-300 rounded">
                      <input
                        type="file"
                        className="text-xs text-gray-600 w-full"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setTimeout(() => setFlaggedDocsResolved(true), 1500);
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Flagged Doc 2: Shortage Proof */}
                  <div className="p-3 bg-yellow-50 border border-yellow-300 rounded-lg space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-yellow-700" />
                        <span className="text-sm text-yellow-900">Shortage Proof</span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs border border-yellow-300">
                        <Brain className="w-3 h-3" />
                        <span>85%</span>
                      </div>
                    </div>
                    <p className="text-xs text-yellow-700 mb-2">Needs DAVT confirmation for value calculation</p>
                    
                    <div className="p-2 bg-white border-2 border-dashed border-gray-300 rounded">
                      <input
                        type="file"
                        className="text-xs text-gray-600 w-full"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setShowReuploadSection(false)}
                    className="w-full px-3 py-2 bg-gray-100 text-gray-600 rounded text-sm hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Success Banner After Issues Resolved */}
              {flaggedDocsResolved && (
                <div className="mt-4 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="text-green-900 mb-1">All issues resolved!</h4>
                      <p className="text-sm text-green-700">
                        You may now submit for DAVT Verification.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* DAVT Queue Info */}
            {resultStatus === 'manual-review' && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-xl">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="animate-pulse">
                      <Brain className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-yellow-900 mb-1">DAVT Queue Status</h3>
                      <p className="text-sm text-yellow-700 mb-3">
                        Settlement calculations forwarded to DAVT team for final verification.
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-yellow-700">Queue Position:</span>
                          <span className="text-yellow-900">#3</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-yellow-700">Est. Wait Time:</span>
                          <span className="text-yellow-900">8-10 min</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-yellow-700">Priority:</span>
                          <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs border border-orange-300">
                            High
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Recommendations */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm text-gray-900">AI Recommendations</h3>
              </div>
              
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <Brain className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>Re-upload damage proof with better lighting and closer angle</span>
                </li>
                <li className="flex items-start gap-2">
                  <Brain className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>Manual verification typically takes 8-12 minutes</span>
                </li>
                <li className="flex items-start gap-2">
                  <Brain className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>Supervisor can expedite settlement approval if needed</span>
                </li>
                <li className="flex items-start gap-2">
                  <Brain className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>Consider contacting vendor about shortage/damage deductions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Check Card Component
interface CheckCardProps {
  check: CheckResult;
}

function CheckCard({ check }: CheckCardProps) {
  const categoryConfig = {
    passed: {
      bg: 'bg-green-50',
      border: 'border-green-300',
      iconColor: 'text-green-600',
      textColor: 'text-green-900',
      icon: CheckCircle2,
      badge: 'bg-green-100 text-green-700 border-green-300',
    },
    failed: {
      bg: 'bg-red-50',
      border: 'border-red-300',
      iconColor: 'text-red-600',
      textColor: 'text-red-900',
      icon: XCircle,
      badge: 'bg-red-100 text-red-700 border-red-300',
    },
    manual: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-300',
      iconColor: 'text-yellow-600',
      textColor: 'text-yellow-900',
      icon: Brain,
      badge: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    },
  };

  const config = categoryConfig[check.category];
  const Icon = config.icon;

  return (
    <div className={`p-4 rounded-lg border-2 ${config.border} ${config.bg}`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h4 className={`text-sm ${config.textColor} pr-2`}>{check.title}</h4>
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs border ${config.badge} flex-shrink-0`}>
              <Brain className="w-3 h-3" />
              <span>{check.confidence}%</span>
            </div>
          </div>
          <p className="text-xs text-gray-700">{check.description}</p>
        </div>
      </div>
    </div>
  );
}