import { useState } from 'react';
import { 
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Brain,
  FileText,
  Calendar,
  Shield,
  Truck,
  User,
  Clock,
  Bell,
  RefreshCw,
  ArrowRight,
  Download,
  Eye,
  Sparkles,
  Target,
  Activity,
  TrendingUp,
  Info,
  Upload,
  Send,
  Paperclip,
  CheckCheck
} from 'lucide-react';

interface OpsKYCOutcomeProps {
  orderId: string | null;
  onBack: () => void;
  onProceedToLoading: () => void;
  onKycStatusChange: (status: KYCStatus) => void;
  onDavtSubmit: () => void;
}

type KYCStatus = 'approved' | 'rejected' | 'manual-review';

interface FailedCheck {
  id: string;
  severity: 'critical' | 'warning';
  title: string;
  description: string;
  document: string;
  aiConfidence: number;
}

interface VerificationDetail {
  category: string;
  checks: {
    name: string;
    status: 'passed' | 'failed' | 'warning';
    detail: string;
  }[];
}

export function OpsKYCOutcome({ orderId, onBack, onProceedToLoading, onKycStatusChange, onDavtSubmit }: OpsKYCOutcomeProps) {
  // Change this to test different outcomes: 'approved' | 'rejected' | 'manual-review'
  const [kycStatus, setKycStatus] = useState<KYCStatus>('rejected');
  const [showReuploadSection, setShowReuploadSection] = useState(false);
  const [showApprovalRequest, setShowApprovalRequest] = useState(false);
  const [davtSubmitted, setDavtSubmitted] = useState(false);
  const [vendorNotified, setVendorNotified] = useState(false);
  const [approvalRequestSent, setApprovalRequestSent] = useState(false);
  const [reuploadingDocs, setReuploadingDocs] = useState(false);
  const [approvalComment, setApprovalComment] = useState('');
  const [rejectedDocs, setRejectedDocs] = useState([
    {
      id: 'puc',
      name: 'PUC Certificate',
      issue: 'Expired on 2024-11-15',
      uploaded: false,
    },
    {
      id: 'insurance',
      name: 'Vehicle Insurance',
      issue: 'Coverage ₹8,00,000 is below required ₹10,00,000',
      uploaded: false,
    },
  ]);

  // Failed checks for rejected status
  const failedChecks: FailedCheck[] = [
    {
      id: '1',
      severity: 'critical',
      title: 'PUC Certificate Expired',
      description: 'PUC expired on 2024-11-15 (25 days ago). Vehicle cannot proceed without valid pollution certificate.',
      document: 'PUC Certificate',
      aiConfidence: 98,
    },
    {
      id: '2',
      severity: 'critical',
      title: 'Insurance Coverage Below Threshold',
      description: 'Current coverage ₹8,00,000 is below required minimum ₹10,00,000 for this route.',
      document: 'Vehicle Insurance',
      aiConfidence: 95,
    },
  ];

  // Verification details for approved status
  const verificationDetails: VerificationDetail[] = [
    {
      category: 'Vehicle Documents',
      checks: [
        { name: 'RC Validity', status: 'passed', detail: 'Valid until 2026-03-15 (488 days remaining)' },
        { name: 'National Permit', status: 'passed', detail: 'Valid All-India permit verified' },
        { name: 'PUC Certificate', status: kycStatus === 'rejected' ? 'failed' : 'passed', detail: kycStatus === 'rejected' ? 'Expired on 2024-11-15' : 'Valid until 2025-08-20' },
        { name: 'Insurance Coverage', status: kycStatus === 'rejected' ? 'failed' : 'passed', detail: kycStatus === 'rejected' ? 'Coverage ₹8L below minimum ₹10L' : 'Coverage ₹15L meets requirements' },
        { name: 'Vehicle Photo', status: 'passed', detail: 'Clear image captured, no damage detected' },
      ],
    },
    {
      category: 'Driver Documents',
      checks: [
        { name: 'Driver License', status: 'passed', detail: 'Valid until 2028-05-10 (1247 days remaining)' },
        { name: 'License Category', status: 'passed', detail: 'Heavy Motor Vehicle license verified' },
        { name: 'Aadhaar Verification', status: 'passed', detail: 'ID verified and matched with selfie' },
        { name: 'PAN Card', status: 'passed', detail: 'Tax records verified' },
        { name: 'Driver Selfie', status: 'passed', detail: 'Face match confidence: 96%' },
      ],
    },
    {
      category: 'Cross-Document Validation',
      checks: [
        { name: 'Name Consistency', status: 'passed', detail: 'All documents match: Ramesh Kumar' },
        { name: 'Vehicle Number Match', status: 'passed', detail: 'Consistent across all vehicle docs' },
        { name: 'Date Consistency', status: 'passed', detail: 'No conflicting dates found' },
      ],
    },
  ];

  const aiExplanations = {
    approved: {
      summary: 'All documents have been successfully verified and meet compliance requirements.',
      reasoning: [
        'All 9 mandatory documents uploaded and verified with high confidence (avg. 95.2%)',
        'No expired documents detected - all validity dates are within acceptable range',
        'Cross-document validation passed - names and numbers are consistent',
        'Insurance coverage meets route requirements (₹15,00,000 > ₹10,00,000)',
        'Driver license category appropriate for Heavy Motor Vehicle',
        'Face recognition match between Aadhaar and selfie: 96% confidence',
      ],
      nextSteps: [
        'Generate LR (Loading Receipt) document',
        'Assign loading bay and schedule',
        'Notify driver of loading bay number',
        'Send vehicle for loading operations',
      ],
    },
    rejected: {
      summary: 'Critical compliance issues detected. Vehicle cannot proceed without resolving these issues.',
      reasoning: [
        '❌ PUC Certificate expired 25 days ago - legal requirement for vehicle operation',
        '❌ Insurance coverage (₹8L) below minimum threshold (₹10L) for this route',
        'Other documents verified successfully but critical failures block approval',
        'AI confidence in detection: 98% (PUC), 95% (Insurance)',
      ],
      nextSteps: [
        'Upload valid PUC certificate (less than 6 months old)',
        'Provide insurance with minimum ₹10L coverage',
        'Re-submit for AI verification after document upload',
        'Estimated re-verification time: 2-3 minutes',
      ],
    },
    'manual-review': {
      summary: 'AI detected ambiguities requiring human verification. Documents forwarded to DAVT team.',
      reasoning: [
        '⚠️ Low confidence (72%) on DL expiry date - handwriting unclear',
        '⚠️ Minor mismatch in driver name spelling across documents (Ramesh vs Ramesh Kumar)',
        '⚠️ Vehicle photo shows possible minor damage - requires inspection',
        'All other checks passed but manual verification needed for final approval',
      ],
      nextSteps: [
        'DAVT team will review flagged documents within 15 minutes',
        'You will be notified of final decision via dashboard alert',
        'Ops supervisor can expedite review if urgent',
        'Average manual review time: 8-12 minutes',
      ],
    },
  };

  const currentExplanation = aiExplanations[kycStatus];

  const getStatusConfig = (status: KYCStatus) => {
    const configs = {
      approved: {
        bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
        icon: CheckCircle2,
        label: 'KYC Approved',
        subtitle: 'All checks passed - Ready to proceed',
      },
      rejected: {
        bg: 'bg-gradient-to-r from-red-500 to-rose-500',
        icon: XCircle,
        label: 'KYC Rejected',
        subtitle: 'Critical issues found - Action required',
      },
      'manual-review': {
        bg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
        icon: Brain,
        label: 'Manual Verification Required',
        subtitle: 'Waiting for DAVT team review',
      },
    };
    return configs[status];
  };

  const statusConfig = getStatusConfig(kycStatus);
  const StatusIcon = statusConfig.icon;

  // Calculate stats
  const totalChecks = verificationDetails.reduce((acc, cat) => acc + cat.checks.length, 0);
  const passedChecks = verificationDetails.reduce(
    (acc, cat) => acc + cat.checks.filter(c => c.status === 'passed').length,
    0
  );
  const failedChecksCount = verificationDetails.reduce(
    (acc, cat) => acc + cat.checks.filter(c => c.status === 'failed').length,
    0
  );

  const handleReuploadDoc = (docId: string) => {
    setRejectedDocs(docs =>
      docs.map(doc =>
        doc.id === docId ? { ...doc, uploaded: true } : doc
      )
    );

    // Check if all rejected docs have been re-uploaded
    const updatedDocs = rejectedDocs.map(doc =>
      doc.id === docId ? { ...doc, uploaded: true } : doc
    );
    
    if (updatedDocs.every(doc => doc.uploaded)) {
      // Simulate AI re-validation
      setReuploadingDocs(true);
      setTimeout(() => {
        setReuploadingDocs(false);
        setKycStatus('approved');
        if (onKycStatusChange) {
          onKycStatusChange('approved');
        }
        setShowReuploadSection(false);
      }, 3000);
    }
  };

  const handleNotifyVendor = () => {
    setVendorNotified(true);
    setTimeout(() => setVendorNotified(false), 3000);
  };

  const handleSendApprovalRequest = () => {
    if (approvalComment.trim()) {
      setApprovalRequestSent(true);
      setShowApprovalRequest(false);
    }
  };

  const handleSubmitForDAVT = () => {
    setDavtSubmitted(true);
    if (onDavtSubmit) {
      onDavtSubmit();
    }
  };

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
            Back to KYC Upload
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
                    <span>Processed: {new Date().toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <Activity className="w-4 h-4" />
                    <span>Processing Time: 2.4 seconds</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="flex items-center gap-6">
              <div className="text-center px-6 py-4 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                <p className="text-3xl mb-1">{passedChecks}/{totalChecks}</p>
                <p className="text-sm text-white/80">Checks Passed</p>
              </div>
              {kycStatus === 'rejected' && (
                <div className="text-center px-6 py-4 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                  <p className="text-3xl mb-1">{failedChecksCount}</p>
                  <p className="text-sm text-white/80">Issues Found</p>
                </div>
              )}
              <div className="text-center px-6 py-4 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                <p className="text-3xl mb-1">95.2%</p>
                <p className="text-sm text-white/80">AI Confidence</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-6">
          {/* Left Column - Status Details */}
          <div className="col-span-2 space-y-6">
            {/* Failed Checks (Rejected Status) */}
            {kycStatus === 'rejected' && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <h2 className="text-gray-900">Failed Compliance Checks</h2>
                  <span className="ml-auto px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm border border-red-300">
                    {failedChecks.length} Critical Issues
                  </span>
                </div>

                <div className="space-y-4">
                  {failedChecks.map((check) => (
                    <FailedCheckCard key={check.id} check={check} />
                  ))}
                </div>
              </div>
            )}

            {/* Manual Review Message */}
            {kycStatus === 'manual-review' && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-4 p-6 bg-yellow-50 border-2 border-yellow-300 rounded-xl">
                  <div className="animate-pulse">
                    <Brain className="w-12 h-12 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-yellow-900 mb-1">Waiting for DAVT Team Review</h3>
                    <p className="text-sm text-yellow-700 mb-3">
                      AI has flagged some documents for manual verification. Your request is in the queue.
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-yellow-700">
                        <Clock className="w-4 h-4" />
                        <span>Estimated wait: 8-12 minutes</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-yellow-700">
                        <Users className="w-4 h-4" />
                        <span>Queue position: #3</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Verification Details */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-5 h-5 text-blue-600" />
                <h2 className="text-gray-900">Verification Details</h2>
              </div>

              <div className="space-y-6">
                {verificationDetails.map((category, idx) => (
                  <div key={idx}>
                    <h3 className="text-sm text-gray-700 mb-3 flex items-center gap-2">
                      {category.category === 'Vehicle Documents' && <Truck className="w-4 h-4" />}
                      {category.category === 'Driver Documents' && <User className="w-4 h-4" />}
                      {category.category === 'Cross-Document Validation' && <Sparkles className="w-4 h-4" />}
                      {category.category}
                    </h3>
                    <div className="space-y-2">
                      {category.checks.map((check, checkIdx) => (
                        <CheckDetailRow key={checkIdx} check={check} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - AI Explanation & Actions */}
          <div className="space-y-6">
            {/* AI Explanation Panel */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <Brain className="w-5 h-5 text-indigo-600" />
                <h2 className="text-gray-900">AI Explanation</h2>
              </div>

              <div className="space-y-6">
                {/* Summary */}
                <div>
                  <h3 className="text-sm text-gray-700 mb-2">Summary</h3>
                  <p className="text-sm text-gray-900 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    {currentExplanation.summary}
                  </p>
                </div>

                {/* Reasoning */}
                <div>
                  <h3 className="text-sm text-gray-700 mb-3">AI Reasoning</h3>
                  <ul className="space-y-2">
                    {currentExplanation.reasoning.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span dangerouslySetInnerHTML={{ __html: reason }}></span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Next Steps */}
                <div>
                  <h3 className="text-sm text-gray-700 mb-3">Next Steps</h3>
                  <ul className="space-y-2">
                    {currentExplanation.nextSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-indigo-600 font-medium">{idx + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-sm text-gray-700 mb-4">Actions</h3>
              
              <div className="space-y-3">
                {/* Approved Actions */}
                {kycStatus === 'approved' && (
                  <>
                    <button
                      onClick={onProceedToLoading}
                      className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
                    >
                      <Truck className="w-5 h-5" />
                      <span>Prepare LR & Send for Loading</span>
                      <ArrowRight className="w-5 h-5 ml-auto" />
                    </button>
                    <button className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      Download KYC Report
                    </button>
                  </>
                )}

                {/* Rejected / Manual Review Actions */}
                {(kycStatus === 'rejected' || kycStatus === 'manual-review') && (
                  <>
                    {/* Button 1: Re-upload the Docs */}
                    <button
                      onClick={() => setShowReuploadSection(!showReuploadSection)}
                      className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/30"
                    >
                      <RefreshCw className="w-5 h-5" />
                      <span>Re-upload the Docs</span>
                    </button>

                    {/* Button 2: Notify Vendor */}
                    <button
                      onClick={handleNotifyVendor}
                      disabled={vendorNotified}
                      className={`w-full px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 border-2 $${
                        vendorNotified
                          ? 'bg-green-50 border-green-300 text-green-700'
                          : 'bg-yellow-100 border-yellow-300 text-yellow-700 hover:bg-yellow-200'
                      }`}
                    >
                      {vendorNotified ? (
                        <>
                          <CheckCheck className="w-4 h-4" />
                          Vendor Notified
                        </>
                      ) : (
                        <>
                          <Bell className="w-4 h-4" />
                          Notify Vendor
                        </>
                      )}
                    </button>

                    {/* Button 3: Ask for Approval */}
                    <button
                      onClick={() => setShowApprovalRequest(!showApprovalRequest)}
                      className="w-full px-4 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 border-2 border-gray-300 hover:border-gray-400"
                    >
                      <FileText className="w-4 h-4" />
                      Ask for Approval
                    </button>

                    {/* Button 4: Submit for DAVT Verification */}
                    <button
                      onClick={handleSubmitForDAVT}
                      disabled={davtSubmitted}
                      className={`w-full px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 $${
                        davtSubmitted
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
                      }`}
                    >
                      {davtSubmitted ? (
                        <>
                          <Clock className="w-4 h-4" />
                          Under DAVT Verification
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Submit for DAVT Verification
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>

              {/* Re-upload Section */}
              {showReuploadSection && kycStatus === 'rejected' && (
                <div className="mt-4 p-4 bg-gray-50 border-2 border-gray-300 rounded-lg">
                  <h4 className="text-sm text-gray-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    Rejected Documents
                  </h4>
                  <div className="space-y-3">
                    {rejectedDocs.map((doc) => (
                      <div key={doc.id} className="p-3 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm text-gray-900 font-medium">{doc.name}</p>
                            <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                              <XCircle className="w-3 h-3" />
                              {doc.issue}
                            </p>
                          </div>
                          {doc.uploaded && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs border border-green-300 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Uploaded
                            </span>
                          )}
                        </div>
                        {!doc.uploaded && (
                          <button
                            onClick={() => handleReuploadDoc(doc.id)}
                            className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs flex items-center justify-center gap-2"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            Upload New File
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {reuploadingDocs && (
                    <div className="mt-4 p-3 bg-blue-50 border-2 border-blue-300 rounded-lg animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="animate-spin">
                          <Brain className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-blue-900">AI is re-validating updated documents...</p>
                          <p className="text-xs text-blue-700">Running compliance checks</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Approval Request Section */}
              {showApprovalRequest && (
                <div className="mt-4 p-4 bg-gray-50 border-2 border-gray-300 rounded-lg">
                  <h4 className="text-sm text-gray-900 mb-3">Request Exception Approval</h4>
                  <textarea
                    value={approvalComment}
                    onChange={(e) => setApprovalComment(e.target.value)}
                    placeholder="Describe why this exception should be approved..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    rows={4}
                  />
                  
                  <div className="mt-3 p-3 bg-white border border-gray-200 rounded-lg">
                    <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>Attach supporting email / approval screenshot (optional)</span>
                      <input type="file" className="hidden" />
                    </label>
                  </div>

                  <button
                    onClick={handleSendApprovalRequest}
                    disabled={!approvalComment.trim()}
                    className={`w-full mt-3 px-4 py-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 $${
                      approvalComment.trim()
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    Send Approval Request
                  </button>
                </div>
              )}

              {/* Approval Request Sent Confirmation */}
              {approvalRequestSent && (
                <div className="mt-4 p-3 bg-green-50 border-2 border-green-300 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approval request sent for review.</span>
                  </div>
                </div>
              )}

              {/* Vendor Notified Toast */}
              {vendorNotified && (
                <div className="mt-4 p-3 bg-green-50 border-2 border-green-300 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Vendor has been notified to resend valid documents.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Failed Check Card Component
interface FailedCheckCardProps {
  check: FailedCheck;
}

function FailedCheckCard({ check }: FailedCheckCardProps) {
  const severityConfig = {
    critical: {
      bg: 'bg-red-50',
      border: 'border-red-300',
      text: 'text-red-700',
      badge: 'bg-red-100 text-red-700 border-red-300',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-300',
      text: 'text-yellow-700',
      badge: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    },
  };

  const config = severityConfig[check.severity];

  return (
    <div className={`p-4 rounded-lg border-2 ${config.border} ${config.bg}`}>
      <div className="flex items-start gap-3 mb-3">
        <XCircle className={`w-5 h-5 ${config.text} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className={`text-sm ${config.text}`}>{check.title}</h4>
            <span className={`px-2.5 py-0.5 rounded-md text-xs border ${config.badge}`}>
              {check.severity.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-gray-700 mb-3">{check.description}</p>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-gray-600">
              <FileText className="w-3 h-3" />
              <span>Source: {check.document}</span>
            </div>
            <div className="flex items-center gap-1.5 text-indigo-700">
              <Brain className="w-3 h-3" />
              <span>AI Confidence: {check.aiConfidence}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Check Detail Row Component
interface CheckDetailRowProps {
  check: {
    name: string;
    status: 'passed' | 'failed' | 'warning';
    detail: string;
  };
}

function CheckDetailRow({ check }: CheckDetailRowProps) {
  const statusConfig = {
    passed: {
      icon: CheckCircle2,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
    },
    failed: {
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
    },
  };

  const config = statusConfig[check.status];
  const Icon = config.icon;

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${config.border} ${config.bg}`}>
      <Icon className={`w-4 h-4 ${config.color} flex-shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm text-gray-900">{check.name}</p>
        </div>
        <p className="text-xs text-gray-600">{check.detail}</p>
      </div>
    </div>
  );
}

// Missing Users import
function Users({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}