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
  User,
  CreditCard,
  Shield,
  Car,
  Camera,
  Send
} from 'lucide-react';

interface DAVTKYCVerificationProps {
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

interface ExtractedField {
  label: string;
  value: string;
  confidence: number;
  mismatch?: boolean;
}

export function DAVTKYCVerification({ orderId, onBack }: DAVTKYCVerificationProps) {
  const [decision, setDecision] = useState<'approve' | 'reject' | null>(null);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [remarks, setRemarks] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const documents: DocumentCard[] = [
    {
      id: '1',
      name: 'RC (Registration Certificate)',
      fileName: 'RC_MH12AB1234.pdf',
      uploaded: '10-Dec-2024 | 14:30',
      aiVerification: 'verified',
      confidence: 96,
      icon: Car,
    },
    {
      id: '2',
      name: 'National Permit',
      fileName: 'NationalPermit_MH12AB1234.pdf',
      uploaded: '10-Dec-2024 | 14:31',
      aiVerification: 'verified',
      confidence: 94,
      icon: FileText,
    },
    {
      id: '3',
      name: 'Insurance',
      fileName: 'Insurance_MH12AB1234.pdf',
      uploaded: '10-Dec-2024 | 14:32',
      aiVerification: 'flagged',
      confidence: 78,
      icon: Shield,
      issue: 'Expiry date near - 15 days remaining',
    },
    {
      id: '4',
      name: 'PUCC (Pollution Certificate)',
      fileName: 'PUCC_MH12AB1234.pdf',
      uploaded: '10-Dec-2024 | 14:33',
      aiVerification: 'verified',
      confidence: 92,
      icon: FileText,
    },
    {
      id: '5',
      name: 'Driver License',
      fileName: 'DL_MH1234567890.pdf',
      uploaded: '10-Dec-2024 | 14:34',
      aiVerification: 'flagged',
      confidence: 82,
      icon: CreditCard,
      issue: 'Name mismatch with RC owner',
    },
    {
      id: '6',
      name: 'Aadhaar Card',
      fileName: 'Aadhaar_XXXX5678.pdf',
      uploaded: '10-Dec-2024 | 14:35',
      aiVerification: 'verified',
      confidence: 95,
      icon: CreditCard,
    },
    {
      id: '7',
      name: 'PAN Card',
      fileName: 'PAN_ABCDE1234F.pdf',
      uploaded: '10-Dec-2024 | 14:36',
      aiVerification: 'verified',
      confidence: 93,
      icon: CreditCard,
    },
    {
      id: '8',
      name: 'Driver Selfie',
      fileName: 'Selfie_Driver.jpg',
      uploaded: '10-Dec-2024 | 14:37',
      aiVerification: 'verified',
      confidence: 88,
      icon: Camera,
    },
  ];

  const extractedData: ExtractedField[] = [
    { label: 'Vehicle Number', value: 'MH-12-AB-1234', confidence: 98 },
    { label: 'RC Expiry', value: '15-Mar-2026', confidence: 96 },
    { label: 'Permit Validity', value: '30-Jun-2025', confidence: 94 },
    { label: 'Insurance Coverage', value: 'Valid till 20-Dec-2024', confidence: 78, mismatch: true },
    { label: 'Owner Name', value: 'Rajesh Kumar Sharma', confidence: 95 },
    { label: 'DL Expiry', value: '12-Jan-2028', confidence: 92 },
    { label: 'License Category', value: 'LMV-TR, HMV', confidence: 93 },
    { label: 'Aadhaar Match %', value: '96% match with DL', confidence: 95 },
  ];

  const rejectionReasons = [
    'Missing Document',
    'Expired Document',
    'Wrong Document Uploaded',
    'Incomplete Document',
    'Name Mismatch',
    'Vehicle Details Mismatch',
    'Low Quality Image',
    'Suspicious / Tampered',
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
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-2xl">
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
                <h1 className="text-3xl text-white">Vehicle & Driver KYC Verification</h1>
                {orderId && (
                  <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm border border-white/30">
                    {orderId}
                  </div>
                )}
              </div>
              <p className="text-lg text-white/90">Manual verification of uploaded KYC documents</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                <p className="text-sm text-white/80 mb-1">Vehicle</p>
                <p className="text-white">MH-12-AB-1234</p>
              </div>
              <div className="px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                <p className="text-sm text-white/80 mb-1">Vendor</p>
                <p className="text-white">Express Logistics</p>
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
            <p className="text-white">KYC Verification Completed</p>
            <p className="text-sm text-white/80">Order moved to Advance Docs Verification Queue</p>
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
                  <DocumentCard key={doc.id} document={doc} />
                ))}
              </div>
            </div>
          </div>

          {/* Middle Panel - AI Extracted Data */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-indigo-600" />
                <h2 className="text-gray-900">AI Extracted Data</h2>
              </div>
              <div className="space-y-3">
                {extractedData.map((field, index) => (
                  <ExtractedFieldRow key={index} field={field} />
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
                  Approve KYC
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
                  Reject KYC
                </button>
              </div>

              {/* Rejection Reasons */}
              {decision === 'reject' && (
                <div className="mb-6">
                  <h4 className="text-sm text-gray-700 mb-3">Select Rejection Reasons</h4>
                  <div className="space-y-2">
                    {rejectionReasons.map((reason) => (
                      <label key={reason} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedReasons.includes(reason)}
                          onChange={() => toggleReason(reason)}
                          className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">{reason}</span>
                      </label>
                    ))}
                  </div>

                  {selectedReasons.includes('Other') && (
                    <textarea
                      placeholder="Please specify other reason..."
                      className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={4}
                />
              </div>

              {/* Upload Supporting Evidence */}
              <div className="mb-6">
                <h4 className="text-sm text-gray-700 mb-2">Upload Supporting Evidence</h4>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors cursor-pointer">
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
                    ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-500/30'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
                Submit Decision
              </button>
            </div>

            {/* AI Insights */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-purple-600" />
                <h3 className="text-purple-900">AI Insights</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>Insurance expiring in 15 days - recommend renewal before trip</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>Driver name shows slight variation across documents</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>All documents submitted on time</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Driver has clean history - no previous violations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Document Card Component
function DocumentCard({ document }: { document: DocumentCard }) {
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
          <button className="p-1 hover:bg-gray-200 rounded transition-colors">
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Extracted Field Row Component
function ExtractedFieldRow({ field }: { field: ExtractedField }) {
  return (
    <div className={`p-3 rounded-lg border ${field.mismatch ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200'}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-700">{field.label}</p>
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs border ${
          field.confidence >= 90
            ? 'bg-green-100 text-green-700 border-green-300'
            : field.confidence >= 80
            ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
            : 'bg-red-100 text-red-700 border-red-300'
        }`}>
          <Brain className="w-3 h-3" />
          <span>{field.confidence}%</span>
        </div>
      </div>
      <p className={`text-sm ${field.mismatch ? 'text-red-900' : 'text-gray-900'}`}>{field.value}</p>
      {field.mismatch && (
        <div className="mt-2 flex items-center gap-1 text-xs text-red-700">
          <AlertTriangle className="w-3 h-3" />
          <span>Needs manual verification</span>
        </div>
      )}
    </div>
  );
}
