import { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Upload,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Truck,
  Calendar,
  Scale,
  User,
  QrCode,
  Brain,
  Sparkles,
  Eye,
  RefreshCw,
  Zap,
  Target,
  AlertCircle,
  ShieldCheck,
  Package,
  FileCheck,
  Send,
  CheckCheck,
  Bell,
  Paperclip
} from 'lucide-react';

interface OpsAdvanceUploadProps {
  orderId: string | null;
  onBack: () => void;
  onProceedToResult: () => void;
}

interface Document {
  id: string;
  name: string;
  description: string;
  icon: any;
  status: 'pending' | 'uploaded' | 'verified' | 'failed';
  file?: string;
  aiConfidence?: number;
  issue?: string;
  issueReason?: string;
}

interface ExtractedField {
  label: string;
  value: string;
  confidence: number;
  source: string;
  icon: any;
}

interface CrossVerification {
  check: string;
  status: 'passed' | 'failed' | 'pending';
  details: string;
  confidence: number;
}

export function OpsAdvanceUpload({ orderId, onBack, onProceedToResult }: OpsAdvanceUploadProps) {
  // Initial empty state - all documents need to be uploaded
  const initialDocuments: Document[] = [
    {
      id: 'lr',
      name: 'LR (Loading Receipt)',
      description: 'Handwritten document',
      icon: FileText,
      status: 'pending',
    },
    {
      id: 'invoice',
      name: 'Invoice',
      description: 'Digital PDF',
      icon: FileCheck,
      status: 'pending',
    },
    {
      id: 'eway-bill',
      name: 'E-Way Bill',
      description: 'QR enabled',
      icon: QrCode,
      status: 'pending',
    },
    {
      id: 'weighment',
      name: 'Weighment Slip',
      description: 'Weight certificate',
      icon: Scale,
      status: 'pending',
    },
    {
      id: 'packing',
      name: 'Packing List',
      description: 'Item manifest',
      icon: Package,
      status: 'pending',
    },
  ];

  const initialExtractedFields: ExtractedField[] = [];
  const initialCrossVerifications: CrossVerification[] = [];

  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [qrScanned, setQrScanned] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extractedFields, setExtractedFields] = useState<ExtractedField[]>(initialExtractedFields);
  const [crossVerifications, setCrossVerifications] = useState<CrossVerification[]>(initialCrossVerifications);
  
  // New state for action buttons
  const [vendorNotified, setVendorNotified] = useState(false);
  const [vendorNotifyTime, setVendorNotifyTime] = useState('');
  const [showApprovalRequest, setShowApprovalRequest] = useState(false);
  const [approvalComment, setApprovalComment] = useState('');
  const [approvalSent, setApprovalSent] = useState(false);
  const [davtStatus, setDavtStatus] = useState<'idle' | 'submitted'>('idle');

  // Reset all state when component mounts or orderId changes
  useEffect(() => {
    setDocuments(initialDocuments);
    setExtractedFields(initialExtractedFields);
    setCrossVerifications(initialCrossVerifications);
    setQrScanned(false);
    setExtracting(false);
    setVendorNotified(false);
    setVendorNotifyTime('');
    setShowApprovalRequest(false);
    setApprovalComment('');
    setApprovalSent(false);
    setDavtStatus('idle');
  }, [orderId]);

  const handleScanQR = () => {
    setExtracting(true);
    setTimeout(() => {
      setQrScanned(true);
      setExtracting(false);
    }, 2000);
  };

  const handleFileUpload = (docId: string) => {
    setDocuments(docs =>
      docs.map(doc =>
        doc.id === docId
          ? { ...doc, status: 'uploaded' as const, file: `${doc.name}_uploaded.pdf` }
          : doc
      )
    );

    // Simulate AI processing and verification
    setTimeout(() => {
      setDocuments(docs => {
        const updatedDocs = docs.map(doc =>
          doc.id === docId
            ? { 
                ...doc, 
                status: 'verified' as const, 
                aiConfidence: 90 + Math.floor(Math.random() * 10),
              }
            : doc
        );
        
        // Add cross-verifications as documents are uploaded
        const uploadedCount = updatedDocs.filter(d => d.status !== 'pending').length;
        
        if (uploadedCount >= 3) {
          setCrossVerifications([
            {
              check: 'LR vs Invoice Match',
              status: 'passed',
              details: 'Vehicle number, consignor & consignee match across documents',
              confidence: 96,
            },
            {
              check: 'Invoice vs E-Way Bill Match',
              status: 'passed',
              details: 'Invoice number, vehicle number, and party details verified',
              confidence: 99,
            },
            {
              check: 'Weight Match',
              status: 'passed',
              details: 'LR weight (12,500 kg) matches weighment slip',
              confidence: 96,
            },
          ]);
        }
        
        return updatedDocs;
      });

      // Add extracted data based on document type
      if (docId === 'lr') {
        setExtractedFields(fields => [
          ...fields,
          {
            label: 'Loading Date',
            value: '10-Dec-2024 14:30',
            confidence: 96,
            source: 'LR',
            icon: Calendar,
          },
        ]);
      }

      if (docId === 'invoice') {
        setExtractedFields(fields => [
          ...fields,
          {
            label: 'Consignor',
            value: 'Reliance Industries Ltd.',
            confidence: 98,
            source: 'Invoice',
            icon: User,
          },
          {
            label: 'Consignee',
            value: 'ABC Distributors Pvt. Ltd.',
            confidence: 98,
            source: 'Invoice',
            icon: User,
          },
        ]);
      }

      if (docId === 'weighment') {
        setExtractedFields(fields => [
          ...fields,
          {
            label: 'Weight',
            value: '12,500 kg',
            confidence: 96,
            source: 'Weighment Slip',
            icon: Scale,
          },
        ]);
      }
    }, 1500);
  };

  const uploadedCount = documents.filter(d => d.status !== 'pending').length;
  const verifiedCount = documents.filter(d => d.status === 'verified').length;

  // Calculate LR confidence dynamically
  const lrDoc = documents.find(d => d.id === 'lr');
  const lrConfidence = lrDoc?.aiConfidence || 0;
  const needsManualReview = lrConfidence > 0 && lrConfidence < 80;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm px-8 py-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Order Search
        </button>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-gray-900">OPS Stage 2: Advance Document Upload</h1>
              <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" />
                AI Cross-Verification
              </div>
              {orderId && (
                <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {orderId}
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Upload LR & loading documents with AI-powered data extraction and cross-verification
            </p>
          </div>

          {/* Progress Stats */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl text-purple-700">{uploadedCount}/{documents.length}</p>
              <p className="text-xs text-gray-600">Uploaded</p>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <p className="text-2xl text-green-700">{verifiedCount}</p>
              <p className="text-xs text-gray-600">Verified</p>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <p className="text-2xl text-indigo-700">{lrConfidence}%</p>
              <p className="text-xs text-gray-600">LR Confidence</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - 3 Column Layout */}
      <div className="flex-1 overflow-hidden flex gap-6 p-8">
        {/* Left Panel - Document Upload */}
        <div className="w-[380px] flex flex-col gap-6 overflow-auto">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Upload className="w-5 h-5 text-purple-600" />
              <h2 className="text-gray-900">Document Upload</h2>
            </div>
            <div className="space-y-3">
              {documents.map(doc => (
                <AdvanceDocCard
                  key={doc.id}
                  document={doc}
                  onUpload={() => handleFileUpload(doc.id)}
                />
              ))}
            </div>
          </div>

          {/* QR Scan Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <QrCode className="w-5 h-5 text-indigo-600" />
              <h2 className="text-gray-900">Quick Scan</h2>
            </div>
            
            <button
              onClick={handleScanQR}
              disabled={extracting || qrScanned}
              className={`w-full px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                qrScanned
                  ? 'bg-green-100 text-green-700 border-2 border-green-300'
                  : extracting
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30'
              }`}
            >
              {extracting ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Scanning QR...
                </>
              ) : qrScanned ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  QR Data Extracted
                </>
              ) : (
                <>
                  <QrCode className="w-5 h-5" />
                  Scan E-Way Bill QR
                </>
              )}
            </button>

            {qrScanned && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-700 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  E-Way Bill data extracted successfully
                </p>
                <div className="text-xs text-gray-700 space-y-1">
                  <div className="flex justify-between">
                    <span>EWB No:</span>
                    <span className="font-mono">341234567890</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valid Until:</span>
                    <span>15-Dec-2024</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center Panel - AI Extracted Data */}
        <div className="flex-1 overflow-auto space-y-6">
          {/* Auto-filled Fields */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h2 className="text-gray-900">AI Extracted Data</h2>
              <div className="ml-auto px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm flex items-center gap-2">
                <Zap className="w-3.5 h-3.5" />
                Auto-filled from Documents
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {extractedFields.map((field, idx) => (
                <ExtractedFieldCard key={idx} field={field} />
              ))}
            </div>
          </div>

          {/* AI Cross Verification */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              <h2 className="text-gray-900">AI Cross-Verification</h2>
            </div>

            <div className="space-y-4">
              {crossVerifications.map((verification, idx) => (
                <CrossVerificationCard key={idx} verification={verification} />
              ))}
            </div>
          </div>

          {/* Handwritten LR Detection Alert */}
          {needsManualReview && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-yellow-900 mb-2">Manual Verification Required</h3>
                    <p className="text-sm text-yellow-700 mb-3">
                      Handwritten LR has low OCR confidence ({lrConfidence}%). AI recommends DAVT team review.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-yellow-700">OCR Confidence</span>
                        <span className="text-yellow-900 font-medium">{lrConfidence}%</span>
                      </div>
                      <div className="h-2 bg-yellow-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-500"
                          style={{ width: `${lrConfidence}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-yellow-600 flex items-center gap-1.5">
                        <Brain className="w-3 h-3" />
                        Threshold: 80% • Current: {lrConfidence}% • Shortfall: {80 - lrConfidence}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Actions */}
        <div className="w-[360px] flex flex-col gap-6 overflow-auto">
          {/* Verification Summary */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-blue-600" />
              <h2 className="text-gray-900">Verification Status</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-900">Cross-Verification Passed</span>
                </div>
                <p className="text-xs text-green-700">
                  All documents validated and data matched successfully
                </p>
              </div>

              {needsManualReview && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm text-yellow-900">Manual Review Flagged</span>
                  </div>
                  <p className="text-xs text-yellow-700">
                    Handwritten LR requires DAVT verification
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Documents Uploaded</span>
                  <span className="text-gray-900">{uploadedCount}/{documents.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Auto-Verified</span>
                  <span className="text-green-700">{verifiedCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Cross-Checks</span>
                  <span className="text-green-700">{crossVerifications.filter(v => v.status === 'passed').length}/{crossVerifications.length} Passed</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Avg Confidence</span>
                  <span className="text-indigo-700">94.2%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            {davtStatus === 'submitted' && (
              <div className="mb-4 p-3 bg-blue-50 border-2 border-blue-300 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Under DAVT Verification</span>
                </div>
              </div>
            )}
            
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
                    <span>Optional: Attach email screenshots or approval notes</span>
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
                    Send Approval Request
                  </button>
                </div>
              )}

              {approvalSent && (
                <div className="p-3 bg-blue-50 border-2 border-blue-300 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approval Requested</span>
                  </div>
                </div>
              )}

              {/* 3. Submit for DAVT Verification */}
              <button
                onClick={() => setDavtStatus('submitted')}
                disabled={davtStatus === 'submitted' || uploadedCount < documents.length}
                className={`w-full px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                  davtStatus === 'submitted'
                    ? 'bg-blue-100 text-blue-700 cursor-not-allowed border-2 border-blue-300'
                    : uploadedCount === documents.length
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
                <span>{davtStatus === 'submitted' ? 'Under DAVT Verification' : 'Submit for DAVT Verification'}</span>
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
          </div>

          {/* AI Insights */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm text-gray-900">AI Insights</h3>
            </div>
            <ul className="space-y-2 text-xs text-gray-700">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>All cross-document validations passed</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>E-Way Bill QR scan successful</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Handwriting quality affects LR confidence</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Weight consistency verified across docs</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Advance Doc Card Component
interface AdvanceDocCardProps {
  document: Document;
  onUpload: () => void;
}

function AdvanceDocCard({ document, onUpload }: AdvanceDocCardProps) {
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
      label: 'Failed',
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
          <p className="text-sm text-gray-900 mb-0.5">{document.name}</p>
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

      {/* Re-upload Button for Uploaded/Verified (always visible) */}
      {(document.status === 'verified' || document.status === 'uploaded') && !showReupload && (
        <button
          onClick={() => setShowReupload(true)}
          className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {hasIssue ? 'Re-upload Better Quality' : 'Re-upload'}
        </button>
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
        <button
          onClick={() => setShowReupload(true)}
          className="w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Re-upload Better Quality
        </button>
      )}
    </div>
  );
}

// Extracted Field Card Component
interface ExtractedFieldCardProps {
  field: ExtractedField;
}

function ExtractedFieldCard({ field }: ExtractedFieldCardProps) {
  const Icon = field.icon;
  
  return (
    <div className="p-4 rounded-lg border-2 border-indigo-200 bg-indigo-50">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-indigo-100 border border-indigo-300">
          <Icon className="w-4 h-4 text-indigo-700" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-600">{field.label}</p>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs border border-indigo-300">
              <Brain className="w-3 h-3" />
              <span>{field.confidence}%</span>
            </div>
          </div>
          <p className="text-sm text-gray-900 mb-1 truncate">{field.value}</p>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <FileText className="w-3 h-3" />
            <span className="truncate">{field.source}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cross Verification Card Component
interface CrossVerificationCardProps {
  verification: CrossVerification;
}

function CrossVerificationCard({ verification }: CrossVerificationCardProps) {
  const statusConfig = {
    passed: {
      icon: CheckCircle2,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-300',
    },
    failed: {
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-300',
    },
    pending: {
      icon: Clock,
      color: 'text-gray-600',
      bg: 'bg-gray-50',
      border: 'border-gray-300',
    },
  };

  const config = statusConfig[verification.status];
  const Icon = config.icon;

  return (
    <div className={`p-4 rounded-lg border-2 ${config.border} ${config.bg}`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${config.color} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className={`text-sm ${config.color}`}>{verification.check}</h4>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs border border-indigo-300">
              <Brain className="w-3 h-3" />
              <span>{verification.confidence}%</span>
            </div>
          </div>
          <p className="text-xs text-gray-700">{verification.details}</p>
        </div>
      </div>
    </div>
  );
}