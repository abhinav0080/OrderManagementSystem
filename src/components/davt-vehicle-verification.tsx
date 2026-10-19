import { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Edit3,
  FileText,
  Sparkles,
  Clock,
  Shield,
  AlertTriangle,
  Calendar,
  CheckCheck,
  ThumbsUp,
  ThumbsDown,
  Brain,
  Info,
  TrendingUp,
  Eye,
  FileCheck,
  User,
  Truck,
  MessageSquare
} from 'lucide-react';

interface DAVTVehicleVerificationProps {
  orderId: string | null;
  onBack: () => void;
}

interface VerificationDocument {
  id: string;
  name: string;
  status: 'verified' | 'warning' | 'expired' | 'missing';
  data: {
    field: string;
    value: string;
    aiConfidence: number;
    isEdited?: boolean;
  }[];
  expiryDate?: string;
  daysUntilExpiry?: number;
  complianceChecks: {
    check: string;
    status: 'pass' | 'fail' | 'warning';
    message: string;
  }[];
}

interface AIRecommendation {
  decision: 'approve' | 'reject' | 'review';
  confidence: number;
  reasons: string[];
  risks: {
    type: 'low' | 'medium' | 'high';
    description: string;
  }[];
  explanations: {
    icon: any;
    title: string;
    message: string;
    type: 'success' | 'warning' | 'error' | 'info';
  }[];
}

export function DAVTVehicleVerification({ orderId, onBack }: DAVTVehicleVerificationProps) {
  const [documents] = useState<VerificationDocument[]>([
    {
      id: 'vehicle-rc',
      name: 'Vehicle RC',
      status: 'verified',
      data: [
        { field: 'Registration Number', value: 'MH-12-AB-1234', aiConfidence: 98 },
        { field: 'Owner Name', value: 'Transport Solutions Pvt Ltd', aiConfidence: 95 },
        { field: 'Vehicle Class', value: 'Heavy Goods Vehicle', aiConfidence: 97 },
        { field: 'Engine Number', value: 'ENG456789XYZ', aiConfidence: 94 },
        { field: 'Chassis Number', value: 'CHS987654ABC', aiConfidence: 96 },
        { field: 'Registration Date', value: '15-Jan-2020', aiConfidence: 96 },
      ],
      expiryDate: '14-Jan-2035',
      daysUntilExpiry: 3688,
      complianceChecks: [
        { check: 'Valid Registration', status: 'pass', message: 'RC is valid and active' },
        { check: 'Owner Verification', status: 'pass', message: 'Owner matches contract database' },
        { check: 'Vehicle Class Match', status: 'pass', message: 'HGV certified for cargo transport' },
      ],
    },
    {
      id: 'driver-dl',
      name: 'Driving License',
      status: 'warning',
      data: [
        { field: 'License Number', value: 'MH-1420110012345', aiConfidence: 96 },
        { field: 'Name', value: 'RAJESH KUMAR SINGH', aiConfidence: 97 },
        { field: 'Date of Birth', value: '15-Mar-1985', aiConfidence: 95 },
        { field: 'Blood Group', value: 'B+', aiConfidence: 92 },
        { field: 'Vehicle Class', value: 'HMV, LMV, TRANS', aiConfidence: 96 },
        { field: 'Issue Date', value: '15-Mar-2020', aiConfidence: 95 },
      ],
      expiryDate: '14-Mar-2030',
      daysUntilExpiry: 1919,
      complianceChecks: [
        { check: 'Valid License', status: 'pass', message: 'DL is active and valid' },
        { check: 'Expiry Check', status: 'warning', message: 'Expires in 5.2 years - safe for contract' },
        { check: 'Vehicle Authorization', status: 'pass', message: 'Authorized for Heavy Motor Vehicles' },
        { check: 'Age Verification', status: 'pass', message: 'Driver is 39 years old - within limits' },
      ],
    },
    {
      id: 'permit',
      name: 'National Permit',
      status: 'verified',
      data: [
        { field: 'Permit Number', value: 'NP/MH/2024/45678', aiConfidence: 94 },
        { field: 'Permit Type', value: 'All India Tourist Permit', aiConfidence: 96 },
        { field: 'Valid From', value: '01-Jan-2024', aiConfidence: 96 },
        { field: 'Issuing Authority', value: 'RTO Mumbai Central', aiConfidence: 93 },
      ],
      expiryDate: '31-Dec-2024',
      daysUntilExpiry: 22,
      complianceChecks: [
        { check: 'Valid Permit', status: 'pass', message: 'Active for 22 more days' },
        { check: 'Route Coverage', status: 'pass', message: 'All India coverage applicable' },
        { check: 'Renewal Due', status: 'warning', message: 'Renewal required within 30 days' },
      ],
    },
    {
      id: 'puc',
      name: 'PUC Certificate',
      status: 'expired',
      data: [
        { field: 'Certificate Number', value: 'PUC/MH/2023/9876', aiConfidence: 92 },
        { field: 'Vehicle Number', value: 'MH-12-AB-1234', aiConfidence: 96 },
        { field: 'Issue Date', value: '10-Jun-2023', aiConfidence: 95 },
        { field: 'Test Result', value: 'PASS', aiConfidence: 94 },
      ],
      expiryDate: '09-Dec-2023',
      daysUntilExpiry: -1,
      complianceChecks: [
        { check: 'Validity Status', status: 'fail', message: 'PUC expired 1 day ago' },
        { check: 'Compliance Risk', status: 'fail', message: 'Cannot dispatch without valid PUC' },
        { check: 'Legal Requirement', status: 'fail', message: 'Violates Motor Vehicles Act' },
      ],
    },
    {
      id: 'insurance',
      name: 'Vehicle Insurance',
      status: 'verified',
      data: [
        { field: 'Policy Number', value: 'ICICI/COM/2024/567890', aiConfidence: 97 },
        { field: 'Insured Vehicle', value: 'MH-12-AB-1234', aiConfidence: 98 },
        { field: 'Policy Type', value: 'Comprehensive Commercial', aiConfidence: 96 },
        { field: 'Sum Insured', value: '₹25,00,000', aiConfidence: 95 },
      ],
      expiryDate: '31-Dec-2024',
      daysUntilExpiry: 22,
      complianceChecks: [
        { check: 'Active Coverage', status: 'pass', message: 'Policy active for 22 days' },
        { check: 'Coverage Amount', status: 'pass', message: 'Meets minimum requirement of ₹20L' },
        { check: 'Policy Type', status: 'pass', message: 'Comprehensive coverage verified' },
      ],
    },
  ]);

  const [selectedDoc, setSelectedDoc] = useState<VerificationDocument>(documents[0]);
  const [editMode, setEditMode] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const aiRecommendation: AIRecommendation = {
    decision: 'reject',
    confidence: 95,
    reasons: [
      'PUC certificate expired on 09-Dec-2023',
      'Legal requirement violation detected',
      'Vehicle cannot be dispatched without valid pollution certificate',
      'All other documents verified successfully',
    ],
    risks: [
      { type: 'high', description: 'PUC expiry - Legal compliance violation' },
      { type: 'low', description: 'Permit renewal due in 22 days - Monitor' },
      { type: 'low', description: 'Insurance renewal due in 22 days - Monitor' },
    ],
    explanations: [
      {
        icon: XCircle,
        title: 'PUC Certificate Expired',
        message: 'PUC expired 1 day ago. Motor Vehicles Act requires valid pollution certificate for operation.',
        type: 'error',
      },
      {
        icon: CheckCircle2,
        title: 'DL Expires in 5.2 Years',
        message: 'Driving License valid until 14-Mar-2030 (1,919 days remaining). Well within safe threshold for long-term contracts.',
        type: 'success',
      },
      {
        icon: AlertTriangle,
        title: 'Permit Renewal Required',
        message: 'National Permit expires in 22 days. Safe for current shipment but renewal needed before next assignment.',
        type: 'warning',
      },
      {
        icon: CheckCircle2,
        title: 'RC Valid for 10+ Years',
        message: 'Vehicle Registration valid until 14-Jan-2035 (3,688 days). No concerns for long-term operations.',
        type: 'success',
      },
      {
        icon: Info,
        title: 'Insurance Coverage Adequate',
        message: 'Comprehensive policy with ₹25L coverage exceeds minimum requirement of ₹20L. Renews in 22 days.',
        type: 'info',
      },
    ],
  };

  const handleApprove = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Order ${orderId} APPROVED by DAVT Agent`);
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
      alert(`Order ${orderId} REJECTED: ${rejectReason}`);
      setShowRejectModal(false);
      onBack();
    }, 1500);
  };

  const handleManualEdit = () => {
    setEditMode(!editMode);
  };

  const verifiedCount = documents.filter(d => d.status === 'verified').length;
  const warningCount = documents.filter(d => d.status === 'warning').length;
  const expiredCount = documents.filter(d => d.status === 'expired').length;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm px-8 py-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Queue
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-gray-900">DAVT Stage 1 - Vehicle & Driver Verification</h1>
              <div className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" />
                AI-Assisted Review
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Order {orderId || 'ORD-2024-001'} • Review AI-extracted compliance documents
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleManualEdit}
              className={`px-4 py-2.5 border-2 rounded-lg transition-colors flex items-center gap-2 ${
                editMode 
                  ? 'border-blue-600 bg-blue-50 text-blue-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              {editMode ? 'Exit Edit Mode' : 'Manual Edit'}
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
              disabled={isSubmitting || aiRecommendation.decision === 'reject'}
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
                  Approve
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-indigo-700 mb-1">Total Documents</p>
                <p className="text-2xl text-indigo-900">{documents.length}</p>
              </div>
              <FileText className="w-8 h-8 text-indigo-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 mb-1">Verified</p>
                <p className="text-2xl text-green-900">{verifiedCount}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 mb-1">Warnings</p>
                <p className="text-2xl text-yellow-900">{warningCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 mb-1">Expired</p>
                <p className="text-2xl text-red-900">{expiredCount}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 mb-1">AI Confidence</p>
                <p className="text-2xl text-purple-900">{aiRecommendation.confidence}%</p>
              </div>
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - 3 Column Layout */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-12 gap-6 p-8">
          {/* LEFT PANEL - Document List */}
          <div className="col-span-3 space-y-4 overflow-auto pr-2">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <FileCheck className="w-5 h-5 text-indigo-600" />
                <h2 className="text-gray-900">Documents</h2>
              </div>
              <p className="text-sm text-gray-500">Click to review details</p>
            </div>

            <div className="space-y-2">
              <div className="bg-white rounded-lg border border-gray-200 p-3 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-900">Vehicle Documents</span>
                </div>
                <div className="space-y-2">
                  {documents.filter(d => ['vehicle-rc', 'permit', 'puc', 'insurance'].includes(d.id)).map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      doc={doc}
                      isSelected={selectedDoc.id === doc.id}
                      onClick={() => setSelectedDoc(doc)}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-900">Driver Documents</span>
                </div>
                <div className="space-y-2">
                  {documents.filter(d => d.id === 'driver-dl').map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      doc={doc}
                      isSelected={selectedDoc.id === doc.id}
                      onClick={() => setSelectedDoc(doc)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CENTER PANEL - Parsed Data */}
          <div className="col-span-5 space-y-4 overflow-auto px-2">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-5 h-5 text-blue-600" />
                <h2 className="text-gray-900">AI-Parsed Data</h2>
              </div>
              <p className="text-sm text-gray-500">Extracted with confidence scores</p>
            </div>

            {/* Document Data Card */}
            <div className="bg-white rounded-xl border-2 border-blue-200 shadow-lg">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 border-b border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-gray-900">{selectedDoc.name}</h3>
                      <p className="text-xs text-gray-600">Auto-extracted by AI</p>
                    </div>
                  </div>
                  
                  {selectedDoc.status === 'verified' && (
                    <div className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm flex items-center gap-1.5 border border-green-300">
                      <CheckCircle2 className="w-4 h-4" />
                      Verified
                    </div>
                  )}
                  {selectedDoc.status === 'warning' && (
                    <div className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-sm flex items-center gap-1.5 border border-yellow-300">
                      <AlertTriangle className="w-4 h-4" />
                      Warning
                    </div>
                  )}
                  {selectedDoc.status === 'expired' && (
                    <div className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm flex items-center gap-1.5 border border-red-300 animate-pulse">
                      <XCircle className="w-4 h-4" />
                      Expired
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 space-y-3">
                {selectedDoc.data.map((field, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-gray-600 flex items-center gap-1">
                        {field.field}
                        {field.isEdited && (
                          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                            Edited
                          </span>
                        )}
                      </label>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-purple-500" />
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              field.aiConfidence >= 95 ? 'bg-green-500' :
                              field.aiConfidence >= 85 ? 'bg-blue-500' :
                              'bg-yellow-500'
                            }`}
                            style={{ width: `${field.aiConfidence}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-8">{field.aiConfidence}%</span>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={field.value}
                      readOnly={!editMode}
                      className={`w-full px-3 py-2 border rounded-lg text-sm text-gray-900 transition-colors ${
                        editMode 
                          ? 'border-blue-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500' 
                          : 'border-gray-300 bg-gray-50'
                      }`}
                    />
                  </div>
                ))}

                {selectedDoc.expiryDate && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">Expiry Validation</span>
                    </div>
                    <div className={`px-4 py-3 rounded-lg border-2 ${
                      selectedDoc.daysUntilExpiry! < 0
                        ? 'bg-red-50 border-red-300'
                        : selectedDoc.daysUntilExpiry! < 30
                        ? 'bg-yellow-50 border-yellow-300'
                        : 'bg-green-50 border-green-300'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-700">Expires On:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedDoc.expiryDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Days Remaining:</span>
                        <span className={`text-sm font-medium ${
                          selectedDoc.daysUntilExpiry! < 0
                            ? 'text-red-900'
                            : selectedDoc.daysUntilExpiry! < 30
                            ? 'text-yellow-900'
                            : 'text-green-900'
                        }`}>
                          {selectedDoc.daysUntilExpiry! < 0 
                            ? `Expired ${Math.abs(selectedDoc.daysUntilExpiry!)} days ago` 
                            : `${selectedDoc.daysUntilExpiry} days (${(selectedDoc.daysUntilExpiry! / 365).toFixed(1)} years)`
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contract Compliance */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm text-gray-900">Contract Compliance Checks</h3>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                {selectedDoc.complianceChecks.map((check, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border ${
                    check.status === 'pass' 
                      ? 'bg-green-50 border-green-200' 
                      : check.status === 'fail'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-yellow-50 border-yellow-200'
                  }`}>
                    <div className="flex items-start gap-2">
                      {check.status === 'pass' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : check.status === 'fail' ? (
                        <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className={`text-sm ${
                          check.status === 'pass' 
                            ? 'text-green-900' 
                            : check.status === 'fail'
                            ? 'text-red-900'
                            : 'text-yellow-900'
                        }`}>
                          {check.check}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">{check.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL - AI Recommendations & Explanations */}
          <div className="col-span-4 space-y-4 overflow-auto pl-2">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <h2 className="text-gray-900">AI Recommendation</h2>
              </div>
              <p className="text-sm text-gray-500">Automated decision analysis</p>
            </div>

            {/* AI Decision Card */}
            <AIDecisionCard recommendation={aiRecommendation} />

            {/* AI Explanations */}
            <div className="space-y-3">
              {aiRecommendation.explanations.map((explanation, idx) => {
                const Icon = explanation.icon;
                const colorStyles = {
                  success: {
                    bg: 'bg-green-50',
                    border: 'border-green-200',
                    icon: 'text-green-600',
                    title: 'text-green-900',
                  },
                  warning: {
                    bg: 'bg-yellow-50',
                    border: 'border-yellow-200',
                    icon: 'text-yellow-600',
                    title: 'text-yellow-900',
                  },
                  error: {
                    bg: 'bg-red-50',
                    border: 'border-red-200',
                    icon: 'text-red-600',
                    title: 'text-red-900',
                  },
                  info: {
                    bg: 'bg-blue-50',
                    border: 'border-blue-200',
                    icon: 'text-blue-600',
                    title: 'text-blue-900',
                  },
                };
                const style = colorStyles[explanation.type];

                return (
                  <div key={idx} className={`${style.bg} border ${style.border} rounded-lg p-4 shadow-sm`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 ${style.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${style.icon}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-sm ${style.title} mb-1`}>{explanation.title}</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">{explanation.message}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Risk Analysis */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm text-gray-900">Risk Analysis</h3>
              </div>
              <div className="space-y-2">
                {aiRecommendation.risks.map((risk, idx) => (
                  <div key={idx} className={`p-2 rounded-lg border ${
                    risk.type === 'high' 
                      ? 'bg-red-50 border-red-200' 
                      : risk.type === 'medium'
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-green-50 border-green-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        risk.type === 'high' 
                          ? 'bg-red-100 text-red-700' 
                          : risk.type === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {risk.type.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-700">{risk.description}</span>
                    </div>
                  </div>
                ))}
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
                Reject Order
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
    </div>
  );
}

// Document Card Component
interface DocumentCardProps {
  doc: VerificationDocument;
  isSelected: boolean;
  onClick: () => void;
}

function DocumentCard({ doc, isSelected, onClick }: DocumentCardProps) {
  const getStatusIcon = () => {
    switch (doc.status) {
      case 'verified':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'expired':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusStyles = () => {
    if (isSelected) {
      return 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200';
    }
    switch (doc.status) {
      case 'verified':
        return 'border-green-200 bg-green-50/50 hover:bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50/50 hover:bg-yellow-50';
      case 'expired':
        return 'border-red-200 bg-red-50/50 hover:bg-red-50';
      default:
        return 'border-gray-200 bg-white hover:bg-gray-50';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`border-2 rounded-lg p-2.5 cursor-pointer transition-all ${getStatusStyles()}`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-sm text-gray-900">{doc.name}</span>
        </div>
      </div>
      {doc.expiryDate && (
        <div className="flex items-center gap-1 mt-1">
          <Calendar className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-600">
            {doc.daysUntilExpiry! < 0 
              ? `Expired ${Math.abs(doc.daysUntilExpiry!)}d ago` 
              : `${doc.daysUntilExpiry}d remaining`
            }
          </span>
        </div>
      )}
    </div>
  );
}

// AI Decision Card Component
interface AIDecisionCardProps {
  recommendation: AIRecommendation;
}

function AIDecisionCard({ recommendation }: AIDecisionCardProps) {
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
      case 'review':
        return {
          icon: Brain,
          bg: 'from-yellow-50 to-amber-50',
          border: 'border-yellow-300',
          iconBg: 'bg-yellow-600',
          title: '🧠 MANUAL REVIEW NEEDED',
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
          <ul className="space-y-1">
            {recommendation.reasons.map((reason, idx) => (
              <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                <span className="text-gray-400">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
