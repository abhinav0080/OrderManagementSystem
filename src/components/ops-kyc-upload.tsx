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
  User,
  Calendar,
  Shield,
  Camera,
  CreditCard,
  IdCard,
  Brain,
  Sparkles,
  Eye,
  RefreshCw,
  Zap,
  Target,
  AlertCircle,
  ArrowRight,
  Download
} from 'lucide-react';

interface OpsKYCUploadProps {
  orderId: string | null;
  onBack: () => void;
  onProceedToOutcome?: () => void;
  onProceedToAdvanceUpload?: () => void;
}

interface Document {
  id: string;
  name: string;
  category: 'vehicle' | 'driver';
  icon: any;
  status: 'pending' | 'uploaded' | 'auto-verified' | 'auto-rejected';
  file?: string;
  aiConfidence?: number;
  rejectionReason?: string;
  extractedData?: Record<string, string>;
}

interface ParsedField {
  label: string;
  value: string;
  confidence: number;
  source: string;
  icon: any;
  status: 'valid' | 'expired' | 'warning';
}

export function OpsKYCUpload({ orderId, onBack, onProceedToOutcome, onProceedToAdvanceUpload }: OpsKYCUploadProps) {
  // Initial empty state - all documents need to be uploaded
  const initialDocuments: Document[] = [
    {
      id: 'vehicle-rc',
      name: 'Vehicle RC',
      category: 'vehicle',
      icon: FileText,
      status: 'pending',
    },
    {
      id: 'national-permit',
      name: 'National Permit',
      category: 'vehicle',
      icon: Shield,
      status: 'pending',
    },
    {
      id: 'puc-certificate',
      name: 'PUC Certificate',
      category: 'vehicle',
      icon: FileText,
      status: 'pending',
    },
    {
      id: 'vehicle-insurance',
      name: 'Vehicle Insurance',
      category: 'vehicle',
      icon: Shield,
      status: 'pending',
    },
    {
      id: 'vehicle-photo',
      name: 'Vehicle Photo',
      category: 'vehicle',
      icon: Camera,
      status: 'pending',
    },
    {
      id: 'driver-license',
      name: 'Driver License',
      category: 'driver',
      icon: CreditCard,
      status: 'pending',
    },
    {
      id: 'aadhaar-card',
      name: 'Aadhaar Card',
      category: 'driver',
      icon: IdCard,
      status: 'pending',
    },
    {
      id: 'pan-card',
      name: 'PAN Card',
      category: 'driver',
      icon: CreditCard,
      status: 'pending',
    },
    {
      id: 'driver-selfie',
      name: 'Driver Selfie',
      category: 'driver',
      icon: User,
      status: 'pending',
    },
  ];

  const initialParsedFields: ParsedField[] = [];
  const initialComplianceIssues: any[] = [];

  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [revalidatingDoc, setRevalidatingDoc] = useState<string | null>(null);
  const [complianceStatus, setComplianceStatus] = useState<'pending' | 'auto-approved' | 'auto-rejected' | 'manual-review'>('pending');
  const [parsedFields, setParsedFields] = useState<ParsedField[]>(initialParsedFields);
  const [complianceIssues, setComplianceIssues] = useState<any[]>(initialComplianceIssues);
  const [davtSubmitted, setDavtSubmitted] = useState(false);

  // Reset all state when component mounts or orderId changes
  useEffect(() => {
    setDocuments(initialDocuments);
    setParsedFields(initialParsedFields);
    setComplianceIssues(initialComplianceIssues);
    setComplianceStatus('pending');
    setAiProcessing(false);
    setRevalidatingDoc(null);
    setDavtSubmitted(false);
  }, [orderId]);

  const handleFileUpload = (docId: string) => {
    // Simulate file upload
    setDocuments(docs =>
      docs.map(doc =>
        doc.id === docId
          ? { ...doc, status: 'uploaded' as const, file: `${doc.name}_uploaded.pdf` }
          : doc
      )
    );

    // Simulate AI processing after upload
    setTimeout(() => {
      setDocuments(docs => {
        const updatedDocs = docs.map(doc =>
          doc.id === docId
            ? { 
                ...doc, 
                status: 'auto-verified' as const, 
                aiConfidence: 90 + Math.floor(Math.random() * 10),
              }
            : doc
        );
        
        // Check if all documents are verified
        const allVerified = updatedDocs.every(d => d.status === 'auto-verified');
        if (allVerified) {
          setComplianceStatus('auto-approved');
          setComplianceIssues([]);
        }
        
        return updatedDocs;
      });

      // Add parsed data when documents are uploaded
      if (docId === 'vehicle-rc') {
        setParsedFields(fields => [
          ...fields,
          {
            label: 'Vehicle Number',
            value: 'MH-12-AB-1234',
            confidence: 96,
            source: 'Vehicle RC',
            icon: Truck,
            status: 'valid',
          },
          {
            label: 'RC Validity',
            value: '2026-03-15',
            confidence: 96,
            source: 'Vehicle RC',
            icon: Calendar,
            status: 'valid',
          },
          {
            label: 'Owner Name',
            value: 'Ramesh Kumar Transport',
            confidence: 96,
            source: 'Vehicle RC',
            icon: User,
            status: 'valid',
          },
        ]);
      }

      if (docId === 'driver-license') {
        setParsedFields(fields => [
          ...fields,
          {
            label: 'DL Expiry',
            value: '2028-05-10',
            confidence: 97,
            source: 'Driver License',
            icon: Calendar,
            status: 'valid',
          },
        ]);
      }

      if (docId === 'vehicle-insurance') {
        setParsedFields(fields => [
          ...fields,
          {
            label: 'Insurance Coverage',
            value: '₹15,00,000',
            confidence: 95,
            source: 'Vehicle Insurance',
            icon: Shield,
            status: 'valid',
          },
        ]);
      }
    }, 1500);
  };

  const handleReupload = (docId: string) => {
    // Set document to uploaded state
    setDocuments(docs =>
      docs.map(doc =>
        doc.id === docId
          ? { ...doc, status: 'uploaded' as const, file: `${doc.name}_NEW_VALID.pdf`, rejectionReason: undefined }
          : doc
      )
    );

    // Trigger AI re-validation
    setRevalidatingDoc(docId);
    
    setTimeout(() => {
      // Simulate AI re-validation completion
      const isNowValid = true; // Simulating that the new document is valid
      
      if (isNowValid) {
        // Update document to auto-verified
        setDocuments(docs =>
          docs.map(doc =>
            doc.id === docId
              ? { 
                  ...doc, 
                  status: 'auto-verified' as const, 
                  aiConfidence: 97,
                  extractedData: {
                    validUpto: '2025-09-15', // New valid date
                  }
                }
              : doc
          )
        );

        // Update parsed fields with new data
        if (docId === 'puc-certificate') {
          setParsedFields(fields =>
            fields.map(field =>
              field.label === 'PUC Expiry'
                ? { ...field, value: '2025-09-15', confidence: 97, status: 'valid' as const }
                : field
            )
          );
        }

        // Clear compliance issues
        setComplianceIssues([]);

        // Update overall compliance status to approved
        setComplianceStatus('auto-approved');
      }
      
      setRevalidatingDoc(null);
    }, 3000); // 3 second AI processing simulation
  };

  const handleSubmitForReview = () => {
    setAiProcessing(true);
    setTimeout(() => {
      setAiProcessing(false);
      // Simulate AI processing completion
    }, 2000);
  };

  const uploadedCount = documents.filter(d => d.status !== 'pending').length;
  const verifiedCount = documents.filter(d => d.status === 'auto-verified').length;
  const rejectedCount = documents.filter(d => d.status === 'auto-rejected').length;

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
              <h1 className="text-gray-900">OPS Stage 1: Vehicle & Driver KYC Upload</h1>
              <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" />
                AI-Powered OCR
              </div>
              {orderId && (
                <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {orderId}
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Upload vehicle & driver documents for automated AI verification
            </p>
          </div>

          {/* Progress Stats */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl text-blue-700">{uploadedCount}/{documents.length}</p>
              <p className="text-xs text-gray-600">Uploaded</p>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <p className="text-2xl text-green-700">{verifiedCount}</p>
              <p className="text-xs text-gray-600">Verified</p>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <p className="text-2xl text-red-700">{rejectedCount}</p>
              <p className="text-xs text-gray-600">Rejected</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - 3 Column Layout */}
      <div className="flex-1 overflow-hidden flex gap-6 p-8">
        {/* Left Panel - Document Upload */}
        <div className="w-[380px] flex flex-col gap-4 overflow-auto">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="w-5 h-5 text-blue-600" />
              <h2 className="text-gray-900">Vehicle Documents</h2>
            </div>
            <div className="space-y-3">
              {documents
                .filter(doc => doc.category === 'vehicle')
                .map(doc => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    onUpload={() => handleFileUpload(doc.id)}
                    onReupload={() => handleReupload(doc.id)}
                  />
                ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-purple-600" />
              <h2 className="text-gray-900">Driver Documents</h2>
            </div>
            <div className="space-y-3">
              {documents
                .filter(doc => doc.category === 'driver')
                .map(doc => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    onUpload={() => handleFileUpload(doc.id)}
                    onReupload={() => handleReupload(doc.id)}
                  />
                ))}
            </div>
          </div>
        </div>

        {/* Center Panel - AI Parsed Data */}
        <div className="flex-1 overflow-auto">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h2 className="text-gray-900">AI Extracted Data</h2>
              <div className="ml-auto px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm flex items-center gap-2">
                <Zap className="w-3.5 h-3.5" />
                Real-time OCR
              </div>
            </div>

            <div className="space-y-4">
              {parsedFields.map((field, idx) => (
                <ParsedFieldCard key={idx} field={field} />
              ))}
            </div>

            {/* AI Processing Indicator */}
            {aiProcessing && (
              <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="animate-spin">
                    <Brain className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-900">AI processing documents...</p>
                    <p className="text-xs text-blue-700">Extracting data & validating compliance</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - AI Compliance Verdict */}
        <div className="w-[380px] flex flex-col gap-4 overflow-auto">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <Target className="w-5 h-5 text-green-600" />
              <h2 className="text-gray-900">AI Compliance Verdict</h2>
            </div>

            {/* Overall Status */}
            <div className="mb-6">
              {complianceStatus === 'auto-approved' && (
                <div className="p-4 bg-green-50 border-2 border-green-300 rounded-xl">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <div>
                      <h3 className="text-green-900 mb-1">KYC Approved – Vehicle Cleared for Loading</h3>
                      <p className="text-sm text-green-700">
                        All documents verified successfully. Ready to proceed to loading & LR document upload.
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-green-700">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>All compliance checks passed • AI Confidence: 95.8%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {complianceStatus === 'auto-rejected' && (
                <div className="p-4 bg-red-50 border-2 border-red-300 rounded-xl">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    <div>
                      <h3 className="text-red-900 mb-1">KYC Auto-Rejected</h3>
                      <p className="text-sm text-red-700">
                        Critical issues found. Please resolve before proceeding.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {complianceStatus === 'manual-review' && (
                <div className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Brain className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-yellow-900">Manual Review Required</h3>
                        {davtSubmitted && (
                          <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs border border-blue-300 flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            Under DAVT Verification
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-yellow-700">
                        AI requires human verification for final decision.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Re-validation Processing State */}
              {revalidatingDoc && (
                <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-300 rounded-xl animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin">
                      <Brain className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-blue-900 mb-1">AI is re-validating updated document...</h3>
                      <p className="text-sm text-blue-700">
                        Running OCR extraction • Expiry validation • Legal compliance checks
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-blue-600">
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
                          <span>OCR Extraction</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          <span>Expiry Validation</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                          <span>Compliance Checks</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Compliance Issues */}
            {complianceIssues.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm text-gray-700 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Issues Detected ({complianceIssues.length})
                </h3>
                <div className="space-y-3">
                  {complianceIssues.map((issue, idx) => (
                    <ComplianceIssueCard key={idx} issue={issue} />
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Primary CTA - Proceed to Loading & LR Upload (Only shown when approved) */}
              {complianceStatus === 'auto-approved' && (
                <button
                  onClick={onProceedToAdvanceUpload}
                  className="w-full px-4 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Proceed to Loading & LR Document Upload</span>
                  <ArrowRight className="w-5 h-5 ml-auto" />
                </button>
              )}

              {/* Submit for DAVT Verification */}
              <button
                onClick={() => setDavtSubmitted(true)}
                disabled={davtSubmitted || uploadedCount < documents.length}
                className={`w-full px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                  davtSubmitted
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : uploadedCount === documents.length
                    ? 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
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

              {/* View KYC Decision Outcome */}
              {onProceedToOutcome && (
                <button 
                  onClick={onProceedToOutcome}
                  className="w-full px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View KYC Decision Outcome
                </button>
              )}
            </div>

            {/* Stats Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm text-gray-700 mb-3">Verification Summary</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Documents</span>
                  <span className="text-gray-900">{documents.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Auto-Verified</span>
                  <span className="text-green-700">{verifiedCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Auto-Rejected</span>
                  <span className="text-red-700">{rejectedCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Pending Upload</span>
                  <span className="text-gray-900">
                    {documents.filter(d => d.status === 'pending').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Document Card Component
interface DocumentCardProps {
  document: Document;
  onUpload: () => void;
  onReupload: () => void;
}

function DocumentCard({ document, onUpload, onReupload }: DocumentCardProps) {
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
    'auto-verified': {
      bg: 'bg-green-50',
      border: 'border-green-300',
      text: 'text-green-700',
      icon: CheckCircle2,
      label: 'Auto-Verified',
    },
    'auto-rejected': {
      bg: 'bg-red-50',
      border: 'border-red-300',
      text: 'text-red-700',
      icon: XCircle,
      label: 'Auto-Rejected',
    },
  };

  const config = statusConfig[document.status];
  const StatusIcon = config.icon;

  // Check if document is locked (verified and should be preserved)
  const isLocked = document.status === 'auto-verified';

  return (
    <div className={`p-4 rounded-lg border-2 ${config.border} ${config.bg} ${isLocked ? 'opacity-90' : ''}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`p-2 rounded-lg ${config.bg} border ${config.border}`}>
          <Icon className={`w-4 h-4 ${config.text}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm text-gray-900">{document.name}</p>
            <div className="flex items-center gap-2">
              {isLocked && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs border border-green-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Locked
                </span>
              )}
              <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs border border-red-300">
                Required
              </span>
            </div>
          </div>
          {document.file && (
            <p className="text-xs text-gray-600 mb-2">{document.file}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
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

      {document.rejectionReason && (
        <div className="mt-3 pt-3 border-t border-red-200">
          <p className="text-xs text-red-700 flex items-start gap-1.5">
            <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
            <span>{document.rejectionReason}</span>
          </p>
        </div>
      )}

      <div className="mt-3">
        {document.status === 'pending' ? (
          <button
            onClick={onUpload}
            className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Document
          </button>
        ) : document.status === 'auto-rejected' ? (
          <button
            onClick={onReupload}
            className="w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Re-upload with Valid Document
          </button>
        ) : isLocked ? (
          <button 
            disabled
            className="w-full px-3 py-2 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed text-sm flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Verified & Locked
          </button>
        ) : (
          <button className="w-full px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center justify-center gap-2">
            <Eye className="w-4 h-4" />
            View Document
          </button>
        )}
      </div>
    </div>
  );
}

// Parsed Field Card Component
interface ParsedFieldCardProps {
  field: ParsedField;
}

function ParsedFieldCard({ field }: ParsedFieldCardProps) {
  const Icon = field.icon;
  
  const statusConfig = {
    valid: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700' },
    expired: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700' },
    warning: { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-700' },
  };

  const config = statusConfig[field.status];

  return (
    <div className={`p-4 rounded-lg border-2 ${config.border} ${config.bg}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${config.bg} border ${config.border}`}>
          <Icon className={`w-4 h-4 ${config.text}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm text-gray-700">{field.label}</p>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs border border-indigo-300">
              <Brain className="w-3 h-3" />
              <span>{field.confidence}%</span>
            </div>
          </div>
          <p className={`text-gray-900 mb-2`}>{field.value}</p>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <FileText className="w-3 h-3" />
            <span>Source: {field.source}</span>
          </div>
          {field.status === 'expired' && (
            <div className="mt-2 pt-2 border-t border-red-200">
              <div className="flex items-center gap-1.5 text-xs text-red-700">
                <AlertTriangle className="w-3 h-3" />
                <span>Expired Document</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Compliance Issue Card Component
interface ComplianceIssueCardProps {
  issue: {
    severity: string;
    title: string;
    description: string;
    source: string;
    aiConfidence: number;
  };
}

function ComplianceIssueCard({ issue }: ComplianceIssueCardProps) {
  const severityConfig = {
    critical: {
      bg: 'bg-red-50',
      border: 'border-red-300',
      text: 'text-red-700',
      badge: 'bg-red-100 text-red-700 border-red-300',
      icon: XCircle,
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-300',
      text: 'text-yellow-700',
      badge: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      icon: AlertTriangle,
    },
  };

  const config = severityConfig[issue.severity as keyof typeof severityConfig] || severityConfig.warning;
  const Icon = config.icon;

  return (
    <div className={`p-4 rounded-lg border-2 ${config.border} ${config.bg}`}>
      <div className="flex items-start gap-3 mb-3">
        <Icon className={`w-5 h-5 ${config.text} flex-shrink-0`} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className={`text-sm ${config.text}`}>{issue.title}</h4>
            <span className={`px-2 py-0.5 rounded text-xs border ${config.badge}`}>
              {issue.severity.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-gray-700 mb-2">{issue.description}</p>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-gray-600">
              <FileText className="w-3 h-3" />
              <span>{issue.source}</span>
            </div>
            <div className="flex items-center gap-1.5 text-indigo-700">
              <Brain className="w-3 h-3" />
              <span>{issue.aiConfidence}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}