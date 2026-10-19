import { useState } from 'react';
import { 
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Brain,
  AlertTriangle,
  FileText,
  Truck,
  Scale,
  Calendar,
  User,
  Shield,
  QrCode,
  Sparkles,
  RefreshCw,
  Bell,
  Eye,
  Download,
  Clock,
  TrendingUp,
  Activity,
  Target,
  Send,
  FileCheck
} from 'lucide-react';

interface OpsAdvanceResultProps {
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

export function OpsAdvanceResult({ orderId, onBack, onReupload }: OpsAdvanceResultProps) {
  // Change this to test different outcomes: 'approved' | 'failed' | 'manual-review'
  const [resultStatus, setResultStatus] = useState<ResultStatus>('manual-review');
  const [supervisorNotifyTime, setSupervisorNotifyTime] = useState('');
  const [showReuploadSection, setShowReuploadSection] = useState(false);
  const [flaggedDocsResolved, setFlaggedDocsResolved] = useState(false);

  const passedChecks: CheckResult[] = [
    {
      id: '1',
      category: 'passed',
      title: 'Invoice matched with E-Way Bill',
      description: 'Invoice number INV-2024-001 verified against E-Way Bill 341234567890. All party details match.',
      confidence: 99,
      icon: CheckCircle2,
    },
    {
      id: '2',
      category: 'passed',
      title: 'Vehicle Number Consistency',
      description: 'Vehicle MH-12-AB-1234 matches across LR, Invoice, and E-Way Bill documents.',
      confidence: 98,
    },
    {
      id: '3',
      category: 'passed',
      title: 'E-Way Bill QR Validated',
      description: 'QR code scanned successfully. E-Way Bill is valid until 15-Dec-2024.',
      confidence: 100,
      icon: QrCode,
    },
    {
      id: '4',
      category: 'passed',
      title: 'Consignor/Consignee Verified',
      description: 'Party names match: Reliance Industries Ltd. → ABC Distributors Pvt. Ltd.',
      confidence: 98,
      icon: User,
    },
    {
      id: '5',
      category: 'passed',
      title: 'Loading Date Extracted',
      description: 'Loading completed on 10-Dec-2024 at 14:30. Within expected timeline.',
      confidence: 96,
      icon: Calendar,
    },
  ];

  const failedChecks: CheckResult[] = [
    {
      id: '1',
      category: 'failed',
      title: 'Weight Mismatch Detected',
      description: 'LR shows 12,500 kg but Weighment Slip indicates 12,750 kg. Variance: 250 kg (2%).',
      confidence: 96,
      icon: Scale,
    },
  ];

  const manualChecks: CheckResult[] = [
    {
      id: '1',
      category: 'manual',
      title: 'Handwritten LR Requires Manual Review',
      description: 'OCR confidence 73% is below threshold (80%). Handwriting quality affects data extraction accuracy.',
      confidence: 73,
      icon: Brain,
    },
    {
      id: '2',
      category: 'manual',
      title: 'Invoice Signature Verification',
      description: 'Digital signature on invoice needs manual validation by authorized personnel.',
      confidence: 85,
      icon: FileText,
    },
  ];

  const getStatusConfig = (status: ResultStatus) => {
    const configs = {
      approved: {
        bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
        icon: CheckCircle2,
        label: 'All Checks Passed',
        subtitle: 'Advance documents verified - Ready for vehicle dispatch',
      },
      failed: {
        bg: 'bg-gradient-to-r from-red-500 to-rose-500',
        icon: XCircle,
        label: 'Verification Failed',
        subtitle: 'Critical issues found - Action required',
      },
      'manual-review': {
        bg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
        icon: Brain,
        label: 'Manual Review Required',
        subtitle: 'Some checks flagged for DAVT verification',
      },
    };
    return configs[status];
  };

  const statusConfig = getStatusConfig(resultStatus);
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
            Back to Document Upload
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                <StatusIcon className="w-10 h-10" />
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl text-white">{statusConfig.label}</h1>
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
                    <span>Processing Time: 1.8 seconds</span>
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

          {/* Center Column - Failed Checks */}
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
                  <span className="text-gray-900">5/5</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Cross-Checks Run</span>
                  <span className="text-gray-900">{totalChecks}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Avg AI Confidence</span>
                  <span className="text-indigo-700">92.4%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Processing Time</span>
                  <span className="text-gray-900">1.8s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Actions & Recommendations */}
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
                    Submit for DAVT Verification
                  </button>
                ) : null}
              </div>

              {/* Inline Re-upload Section for Flagged Docs */}
              {showReuploadSection && !flaggedDocsResolved && (
                <div className="mt-4 p-4 bg-gray-50 border-2 border-gray-300 rounded-lg space-y-4">
                  <h4 className="text-sm text-gray-900 mb-3">AI-Flagged Documents</h4>
                  
                  {/* Flagged Doc 1: Handwritten LR */}
                  <div className="p-3 bg-yellow-50 border border-yellow-300 rounded-lg space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-yellow-700" />
                        <span className="text-sm text-yellow-900">Handwritten LR</span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs border border-yellow-300">
                        <Brain className="w-3 h-3" />
                        <span>73%</span>
                      </div>
                    </div>
                    <p className="text-xs text-yellow-700 mb-2">OCR confidence below threshold</p>
                    
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

                  {/* Flagged Doc 2: Invoice Signature */}
                  <div className="p-3 bg-yellow-50 border border-yellow-300 rounded-lg space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-yellow-700" />
                        <span className="text-sm text-yellow-900">Invoice</span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs border border-yellow-300">
                        <Brain className="w-3 h-3" />
                        <span>85%</span>
                      </div>
                    </div>
                    <p className="text-xs text-yellow-700 mb-2">Signature verification needed</p>
                    
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

            {/* DAVT Queue Info (Manual Review) */}
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
                        Your request has been forwarded to DAVT team for manual verification.
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-yellow-700">Queue Position:</span>
                          <span className="text-yellow-900 font-medium">#5</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-yellow-700">Est. Wait Time:</span>
                          <span className="text-yellow-900 font-medium">12-15 min</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-yellow-700">Priority:</span>
                          <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs border border-orange-300">
                            Medium
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
                {resultStatus === 'approved' && (
                  <>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>All verifications complete - safe to proceed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Vehicle can be dispatched immediately</span>
                    </li>
                  </>
                )}

                {resultStatus === 'failed' && (
                  <>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Resolve weight mismatch before dispatch</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>Re-weigh vehicle and update documents</span>
                    </li>
                  </>
                )}

                {resultStatus === 'manual-review' && (
                  <>
                    <li className="flex items-start gap-2">
                      <Brain className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <span>Re-upload clearer LR image for better OCR</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Brain className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <span>Manual review typically takes 10-15 minutes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Brain className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <span>Supervisor can expedite if urgent</span>
                    </li>
                  </>
                )}
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