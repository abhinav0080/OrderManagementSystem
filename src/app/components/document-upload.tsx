import { useState } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  FileText,
  Camera,
  Sparkles,
  Clock,
  Shield,
  TrendingUp,
  FileCheck,
  AlertTriangle,
  Zap,
  X
} from 'lucide-react';

interface DocumentUploadProps {
  orderId: string | null;
  onBack: () => void;
}

interface Document {
  id: string;
  name: string;
  category: 'vehicle' | 'driver';
  required: boolean;
  uploaded: boolean;
  status: 'empty' | 'processing' | 'valid' | 'expired' | 'invalid';
  fileName?: string;
  extractedData?: {
    field: string;
    value: string;
    confidence: number;
  }[];
  expiryDate?: string;
}

interface AIVerdict {
  decision: 'auto-approve' | 'auto-reject' | 'manual-review';
  confidence: number;
  issues: string[];
  recommendations: string[];
  validations: {
    check: string;
    status: 'pass' | 'fail' | 'warning';
    message: string;
  }[];
}

export function DocumentUpload({ orderId, onBack }: DocumentUploadProps) {
  const [documents, setDocuments] = useState<Document[]>([
    { id: 'vehicle-rc', name: 'Vehicle RC', category: 'vehicle', required: true, uploaded: false, status: 'empty' },
    { id: 'permit', name: 'National Permit', category: 'vehicle', required: true, uploaded: false, status: 'empty' },
    { id: 'puc', name: 'PUC Certificate', category: 'vehicle', required: true, uploaded: false, status: 'empty' },
    { id: 'insurance', name: 'Vehicle Insurance', category: 'vehicle', required: true, uploaded: false, status: 'empty' },
    { id: 'vehicle-photo', name: 'Vehicle Photo', category: 'vehicle', required: true, uploaded: false, status: 'empty' },
    { id: 'driver-dl', name: 'Driving License', category: 'driver', required: true, uploaded: false, status: 'empty' },
    { id: 'pan', name: 'PAN Card', category: 'driver', required: true, uploaded: false, status: 'empty' },
    { id: 'aadhaar', name: 'Aadhaar Card', category: 'driver', required: true, uploaded: false, status: 'empty' },
    { id: 'driver-photo', name: 'Driver Photo', category: 'driver', required: true, uploaded: false, status: 'empty' },
  ]);

  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [aiVerdict, setAiVerdict] = useState<AIVerdict | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (docId: string, fileName: string = 'document.pdf') => {
    // Simulate file upload and AI processing
    setDocuments(docs => 
      docs.map(doc => 
        doc.id === docId 
          ? { ...doc, uploaded: true, status: 'processing' as const, fileName }
          : doc
      )
    );

    const processingDoc = documents.find(d => d.id === docId);
    setSelectedDoc({ ...processingDoc!, uploaded: true, status: 'processing' as const, fileName });

    // Simulate AI extraction after 2 seconds
    setTimeout(() => {
      const mockData = generateMockExtraction(docId);
      
      setDocuments(docs => 
        docs.map(d => 
          d.id === docId 
            ? { 
                ...d, 
                status: mockData.status, 
                extractedData: mockData.extractedData,
                expiryDate: mockData.expiryDate,
                fileName 
              }
            : d
        )
      );

      setSelectedDoc({ 
        ...processingDoc!, 
        status: mockData.status, 
        extractedData: mockData.extractedData,
        expiryDate: mockData.expiryDate,
        uploaded: true,
        fileName
      });

      // Generate AI verdict when all required documents are uploaded
      const uploadedDocs = documents.filter(d => d.uploaded).length + 1;
      if (uploadedDocs >= documents.length - 2) {
        generateAIVerdict();
      }
    }, 2000);
  };

  const handleDragOver = (e: React.DragEvent, docId: string) => {
    e.preventDefault();
    setDragOver(docId);
  };

  const handleDragLeave = () => {
    setDragOver(null);
  };

  const handleDrop = (e: React.DragEvent, docId: string) => {
    e.preventDefault();
    setDragOver(null);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(docId, files[0].name);
    }
  };

  const generateMockExtraction = (docId: string) => {
    const extractions: Record<string, any> = {
      'vehicle-rc': {
        status: 'valid' as const,
        extractedData: [
          { field: 'Registration Number', value: 'MH-12-AB-1234', confidence: 98 },
          { field: 'Owner Name', value: 'Transport Solutions Pvt Ltd', confidence: 95 },
          { field: 'Vehicle Class', value: 'Heavy Goods Vehicle', confidence: 97 },
          { field: 'Engine Number', value: 'ENG456789XYZ', confidence: 94 },
          { field: 'Chassis Number', value: 'CHS987654ABC', confidence: 96 },
          { field: 'Registration Date', value: '15-Jan-2020', confidence: 96 },
          { field: 'Valid Until', value: '14-Jan-2035', confidence: 97 },
        ],
        expiryDate: '2035-01-14',
      },
      'permit': {
        status: 'valid' as const,
        extractedData: [
          { field: 'Permit Number', value: 'NP/MH/2024/45678', confidence: 94 },
          { field: 'Permit Type', value: 'All India Tourist Permit', confidence: 96 },
          { field: 'Valid From', value: '01-Jan-2024', confidence: 96 },
          { field: 'Valid Until', value: '31-Dec-2024', confidence: 97 },
          { field: 'Issuing Authority', value: 'RTO Mumbai Central', confidence: 93 },
        ],
        expiryDate: '2024-12-31',
      },
      'puc': {
        status: 'expired' as const,
        extractedData: [
          { field: 'Certificate Number', value: 'PUC/MH/2023/9876', confidence: 92 },
          { field: 'Vehicle Number', value: 'MH-12-AB-1234', confidence: 96 },
          { field: 'Issue Date', value: '10-Jun-2023', confidence: 95 },
          { field: 'Valid Until', value: '09-Dec-2023', confidence: 96 },
          { field: 'Test Result', value: 'PASS', confidence: 94 },
        ],
        expiryDate: '2023-12-09',
      },
      'insurance': {
        status: 'valid' as const,
        extractedData: [
          { field: 'Policy Number', value: 'ICICI/COM/2024/567890', confidence: 97 },
          { field: 'Insured Vehicle', value: 'MH-12-AB-1234', confidence: 98 },
          { field: 'Insurer', value: 'ICICI Lombard General Insurance', confidence: 98 },
          { field: 'Policy Type', value: 'Comprehensive Commercial Vehicle', confidence: 96 },
          { field: 'Valid From', value: '01-Jan-2024', confidence: 96 },
          { field: 'Valid Until', value: '31-Dec-2024', confidence: 97 },
          { field: 'Sum Insured', value: '₹25,00,000', confidence: 95 },
        ],
        expiryDate: '2024-12-31',
      },
      'driver-dl': {
        status: 'valid' as const,
        extractedData: [
          { field: 'License Number', value: 'MH-1420110012345', confidence: 96 },
          { field: 'Name', value: 'RAJESH KUMAR SINGH', confidence: 97 },
          { field: 'Father Name', value: 'SURESH SINGH', confidence: 95 },
          { field: 'Date of Birth', value: '15-Mar-1985', confidence: 95 },
          { field: 'Blood Group', value: 'B+', confidence: 92 },
          { field: 'Vehicle Class', value: 'HMV, LMV, TRANS', confidence: 96 },
          { field: 'Issue Date', value: '15-Mar-2020', confidence: 95 },
          { field: 'Valid Until', value: '14-Mar-2030', confidence: 98 },
        ],
        expiryDate: '2030-03-14',
      },
      'pan': {
        status: 'valid' as const,
        extractedData: [
          { field: 'PAN Number', value: 'ABCDE1234F', confidence: 98 },
          { field: 'Name', value: 'RAJESH KUMAR SINGH', confidence: 97 },
          { field: 'Father Name', value: 'SURESH SINGH', confidence: 96 },
          { field: 'Date of Birth', value: '15/03/1985', confidence: 95 },
        ],
      },
      'aadhaar': {
        status: 'valid' as const,
        extractedData: [
          { field: 'Aadhaar Number', value: 'XXXX-XXXX-2345', confidence: 98 },
          { field: 'Name', value: 'Rajesh Kumar Singh', confidence: 97 },
          { field: 'Date of Birth', value: '15/03/1985', confidence: 96 },
          { field: 'Gender', value: 'Male', confidence: 99 },
          { field: 'Address', value: 'Mumbai, Maharashtra', confidence: 94 },
        ],
      },
      'vehicle-photo': {
        status: 'valid' as const,
        extractedData: [
          { field: 'Image Quality', value: 'High Resolution', confidence: 96 },
          { field: 'Number Plate Visible', value: 'Yes - MH-12-AB-1234', confidence: 94 },
          { field: 'Vehicle Condition', value: 'Good', confidence: 88 },
        ],
      },
      'driver-photo': {
        status: 'valid' as const,
        extractedData: [
          { field: 'Image Quality', value: 'Clear', confidence: 95 },
          { field: 'Face Detection', value: 'Match with DL Photo', confidence: 92 },
          { field: 'Photo Type', value: 'Recent (within 6 months)', confidence: 87 },
        ],
      },
    };

    return extractions[docId] || {
      status: 'valid' as const,
      extractedData: [
        { field: 'Document Type', value: 'Verified', confidence: 90 },
      ],
    };
  };

  const generateAIVerdict = () => {
    const expiredDocs = documents.filter(d => d.status === 'expired');
    const validDocs = documents.filter(d => d.status === 'valid');
    const uploadedDocs = documents.filter(d => d.uploaded);

    if (expiredDocs.length > 0) {
      setAiVerdict({
        decision: 'auto-reject',
        confidence: 98,
        issues: [
          'PUC certificate expired on 09-Dec-2023',
          'Vehicle cannot be dispatched with expired pollution certificate',
          'Immediate renewal required as per Motor Vehicles Act',
        ],
        recommendations: [
          'Renew PUC certificate immediately',
          'Visit authorized PUC center',
          'Re-upload valid certificate to proceed',
        ],
        validations: [
          { check: 'Document Authenticity', status: 'pass', message: 'All documents verified authentic' },
          { check: 'OCR Extraction Quality', status: 'pass', message: 'Average confidence: 95.2%' },
          { check: 'Expiry Date Validation', status: 'fail', message: 'PUC certificate expired' },
          { check: 'Contract Compliance', status: 'fail', message: 'Non-compliant with transport policy' },
          { check: 'Cross-Document Verification', status: 'warning', message: 'Name mismatch requires manual check' },
        ],
      });
    } else if (validDocs.length >= documents.filter(d => d.required).length - 1) {
      setAiVerdict({
        decision: 'auto-approve',
        confidence: 97,
        issues: [],
        recommendations: [
          'All documents verified successfully',
          'Vehicle and driver cleared for dispatch',
          'Documents valid for next 180 days minimum',
        ],
        validations: [
          { check: 'Document Authenticity', status: 'pass', message: 'All documents verified authentic' },
          { check: 'OCR Extraction Quality', status: 'pass', message: 'Average confidence: 95.8%' },
          { check: 'Expiry Date Validation', status: 'pass', message: 'All documents valid for minimum 6 months' },
          { check: 'Contract Compliance', status: 'pass', message: 'Compliant with all transport regulations' },
          { check: 'Cross-Document Verification', status: 'pass', message: 'All details match across documents' },
        ],
      });
    } else {
      setAiVerdict({
        decision: 'manual-review',
        confidence: 75,
        issues: [
          'Incomplete document set',
          'Some critical documents pending upload',
          'Manual verification recommended',
        ],
        recommendations: [
          'Upload remaining required documents',
          'Ensure all documents are clear and readable',
          'DAVT agent to verify manually',
        ],
        validations: [
          { check: 'Document Authenticity', status: 'pass', message: 'Uploaded documents are authentic' },
          { check: 'OCR Extraction Quality', status: 'pass', message: 'Average confidence: 93.4%' },
          { check: 'Expiry Date Validation', status: 'warning', message: 'Cannot validate incomplete set' },
          { check: 'Contract Compliance', status: 'warning', message: 'Requires complete document set' },
          { check: 'Cross-Document Verification', status: 'warning', message: 'Pending complete upload' },
        ],
      });
    }
  };

  const handleSubmitForReview = () => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      // Show success message or navigate
      alert(`Order ${orderId} submitted for ${aiVerdict?.decision.replace('-', ' ').toUpperCase()}`);
    }, 2000);
  };

  const vehicleDocs = documents.filter(d => d.category === 'vehicle');
  const driverDocs = documents.filter(d => d.category === 'driver');

  const uploadedCount = documents.filter(d => d.uploaded).length;
  const validCount = documents.filter(d => d.status === 'valid').length;
  const issuesCount = documents.filter(d => d.status === 'expired' || d.status === 'invalid').length;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm px-8 py-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Order Queue
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-gray-900">OPS STAGE 1 - Document Upload & Verification</h1>
              <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                AI Powered
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Order {orderId || 'ORD-2024-001'} • Upload vehicle & driver compliance documents for automated AI verification
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Save Draft
            </button>
            <button 
              onClick={handleSubmitForReview}
              disabled={!aiVerdict || isSubmitting}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-blue-500/30"
            >
              {isSubmitting ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Submit for AI Review
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 mb-1">Total Documents</p>
                <p className="text-2xl text-blue-900">{documents.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-indigo-700 mb-1">Uploaded</p>
                <p className="text-2xl text-indigo-900">{uploadedCount}/{documents.length}</p>
              </div>
              <Upload className="w-8 h-8 text-indigo-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 mb-1">Verified</p>
                <p className="text-2xl text-green-900">{validCount}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 mb-1">Issues Found</p>
                <p className="text-2xl text-red-900">{issuesCount}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 mb-1">AI Confidence</p>
                <p className="text-2xl text-purple-900">{aiVerdict?.confidence || '--'}%</p>
              </div>
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - 3 Column Layout */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-12 gap-6 p-8">
          {/* LEFT PANEL - Document Upload Cards */}
          <div className="col-span-4 space-y-4 overflow-auto pr-2">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Upload className="w-5 h-5 text-blue-600" />
                <h2 className="text-gray-900">Document Upload</h2>
              </div>
              <p className="text-sm text-gray-500">Drag & drop or click to upload</p>
            </div>

            {/* Vehicle Documents */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200">
                <FileCheck className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm text-gray-900">Vehicle Documents</h3>
              </div>
              <div className="space-y-3">
                {vehicleDocs.map((doc) => (
                  <UploadCard
                    key={doc.id}
                    doc={doc}
                    isSelected={selectedDoc?.id === doc.id}
                    isDragOver={dragOver === doc.id}
                    onSelect={setSelectedDoc}
                    onUpload={handleFileUpload}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  />
                ))}
              </div>
            </div>

            {/* Driver Documents */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200">
                <FileCheck className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm text-gray-900">Driver Documents</h3>
              </div>
              <div className="space-y-3">
                {driverDocs.map((doc) => (
                  <UploadCard
                    key={doc.id}
                    doc={doc}
                    isSelected={selectedDoc?.id === doc.id}
                    isDragOver={dragOver === doc.id}
                    onSelect={setSelectedDoc}
                    onUpload={handleFileUpload}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* CENTER PANEL - AI Extracted Data */}
          <div className="col-span-4 space-y-4 overflow-auto px-2">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h2 className="text-gray-900">AI Extracted Data</h2>
              </div>
              <p className="text-sm text-gray-500">Auto-extracted with confidence scores</p>
            </div>

            {selectedDoc && selectedDoc.extractedData ? (
              <div className="bg-white rounded-xl border-2 border-purple-200 shadow-lg">
                {/* Document Header */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 border-b border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-gray-900">{selectedDoc.name}</h3>
                        <p className="text-xs text-gray-600">{selectedDoc.fileName}</p>
                      </div>
                    </div>
                    
                    {selectedDoc.status === 'valid' && (
                      <div className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm flex items-center gap-1.5 border border-green-300">
                        <CheckCircle2 className="w-4 h-4" />
                        Verified
                      </div>
                    )}
                    {selectedDoc.status === 'expired' && (
                      <div className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm flex items-center gap-1.5 border border-red-300 animate-pulse">
                        <AlertTriangle className="w-4 h-4" />
                        Expired
                      </div>
                    )}
                    {selectedDoc.status === 'processing' && (
                      <div className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm flex items-center gap-1.5 border border-blue-300">
                        <Clock className="w-4 h-4 animate-spin" />
                        Processing
                      </div>
                    )}
                  </div>
                </div>

                {/* Extracted Fields */}
                <div className="p-5 space-y-4">
                  {selectedDoc.extractedData.map((field, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-600">{field.field}</label>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all ${
                                field.confidence >= 95 ? 'bg-green-500' :
                                field.confidence >= 85 ? 'bg-blue-500' :
                                field.confidence >= 70 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${field.confidence}%` }}
                            />
                          </div>
                          <span className={`text-xs w-10 text-right ${
                            field.confidence >= 95 ? 'text-green-700' :
                            field.confidence >= 85 ? 'text-blue-700' :
                            field.confidence >= 70 ? 'text-yellow-700' :
                            'text-red-700'
                          }`}>
                            {field.confidence}%
                          </span>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={field.value}
                        readOnly
                        className={`w-full px-3 py-2.5 border-2 rounded-lg text-gray-900 transition-colors ${
                          field.confidence >= 95 
                            ? 'border-green-200 bg-green-50/50' 
                            : field.confidence >= 85
                            ? 'border-blue-200 bg-blue-50/50'
                            : 'border-yellow-200 bg-yellow-50/50'
                        }`}
                      />
                    </div>
                  ))}

                  {selectedDoc.expiryDate && (
                    <div className="mt-6 pt-4 border-t-2 border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">Expiry Date Validation</span>
                      </div>
                      <div className={`px-4 py-3 rounded-lg border-2 ${
                        selectedDoc.status === 'expired' 
                          ? 'bg-red-50 text-red-900 border-red-300' 
                          : 'bg-green-50 text-green-900 border-green-300'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Valid Until: {selectedDoc.expiryDate}</span>
                          {selectedDoc.status === 'expired' ? (
                            <XCircle className="w-5 h-5 text-red-600" />
                          ) : (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Re-upload button */}
                  <button
                    onClick={() => handleFileUpload(selectedDoc.id, selectedDoc.fileName)}
                    className="w-full mt-4 px-4 py-2.5 border-2 border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Re-upload Document
                  </button>
                </div>
              </div>
            ) : selectedDoc && selectedDoc.status === 'processing' ? (
              <div className="bg-white rounded-xl border-2 border-blue-200 p-12 flex flex-col items-center justify-center text-center shadow-lg">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
                <h3 className="text-gray-900 mb-2">AI Processing Document</h3>
                <p className="text-sm text-gray-500 mb-4">Extracting data with OCR technology...</p>
                <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 flex flex-col items-center justify-center text-center">
                <FileText className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-gray-900 mb-2">No Document Selected</h3>
                <p className="text-sm text-gray-500">
                  Upload and select a document from the left panel to view AI-extracted data
                </p>
              </div>
            )}
          </div>

          {/* RIGHT PANEL - AI Compliance Verdict */}
          <div className="col-span-4 space-y-4 overflow-auto pl-2">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <h2 className="text-gray-900">AI Compliance Verdict</h2>
              </div>
              <p className="text-sm text-gray-500">Automated decision system</p>
            </div>

            {aiVerdict ? (
              <AIVerdictPanel verdict={aiVerdict} />
            ) : (
              <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-gray-900 mb-2">Awaiting AI Analysis</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Upload documents to receive automated compliance verdict
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Powered by Advanced AI</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Upload Card Component
interface UploadCardProps {
  doc: Document;
  isSelected: boolean;
  isDragOver: boolean;
  onSelect: (doc: Document) => void;
  onUpload: (docId: string) => void;
  onDragOver: (e: React.DragEvent, docId: string) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, docId: string) => void;
}

function UploadCard({ doc, isSelected, isDragOver, onSelect, onUpload, onDragOver, onDragLeave, onDrop }: UploadCardProps) {
  const getStatusIcon = () => {
    switch (doc.status) {
      case 'valid':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'expired':
      case 'invalid':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return doc.id.includes('photo') ? (
          <Camera className="w-5 h-5 text-gray-400" />
        ) : (
          <Upload className="w-5 h-5 text-gray-400" />
        );
    }
  };

  const getCardStyles = () => {
    if (isDragOver) return 'border-blue-500 bg-blue-50 scale-105';
    if (isSelected) return 'border-purple-500 bg-purple-50 ring-2 ring-purple-200';
    if (doc.status === 'valid') return 'border-green-200 bg-green-50/50 hover:bg-green-50';
    if (doc.status === 'expired' || doc.status === 'invalid') return 'border-red-200 bg-red-50/50 hover:bg-red-50';
    if (doc.status === 'processing') return 'border-blue-200 bg-blue-50/50';
    return 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50/30';
  };

  return (
    <div
      onClick={() => onSelect(doc)}
      onDragOver={(e) => onDragOver(e, doc.id)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, doc.id)}
      className={`relative border-2 rounded-lg p-3 cursor-pointer transition-all ${getCardStyles()}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <div>
            <p className="text-sm text-gray-900">{doc.name}</p>
            {doc.required && (
              <span className="text-xs text-red-600">* Required</span>
            )}
          </div>
        </div>
        
        {doc.status === 'expired' && (
          <div className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs border border-red-300 animate-pulse">
            Expired
          </div>
        )}
        {doc.status === 'valid' && (
          <div className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs border border-green-300">
            ✓ Valid
          </div>
        )}
      </div>

      {!doc.uploaded ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUpload(doc.id);
          }}
          className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-xs text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
        >
          {doc.id.includes('photo') ? (
            <>
              <Camera className="w-3.5 h-3.5" />
              Upload Photo
            </>
          ) : (
            <>
              <Upload className="w-3.5 h-3.5" />
              Upload File
            </>
          )}
        </button>
      ) : doc.status === 'processing' ? (
        <div className="text-xs text-blue-600 flex items-center gap-2 py-1">
          <Clock className="w-3.5 h-3.5 animate-spin" />
          AI Processing...
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-gray-600 py-1">
          <FileText className="w-3.5 h-3.5" />
          <span className="flex-1 truncate">{doc.fileName}</span>
        </div>
      )}
    </div>
  );
}

// AI Verdict Panel Component
interface AIVerdictPanelProps {
  verdict: AIVerdict;
}

function AIVerdictPanel({ verdict }: AIVerdictPanelProps) {
  const getVerdictConfig = () => {
    switch (verdict.decision) {
      case 'auto-approve':
        return {
          icon: CheckCircle2,
          bgColor: 'from-green-50 to-emerald-50',
          borderColor: 'border-green-300',
          iconBg: 'bg-green-600',
          title: '✅ AUTO-APPROVE',
          titleColor: 'text-green-900',
          description: 'All compliance checks passed',
        };
      case 'auto-reject':
        return {
          icon: XCircle,
          bgColor: 'from-red-50 to-rose-50',
          borderColor: 'border-red-300',
          iconBg: 'bg-red-600',
          title: '❌ AUTO-REJECT',
          titleColor: 'text-red-900',
          description: 'Critical compliance failures detected',
        };
      case 'manual-review':
        return {
          icon: AlertCircle,
          bgColor: 'from-yellow-50 to-amber-50',
          borderColor: 'border-yellow-300',
          iconBg: 'bg-yellow-600',
          title: '🧠 MANUAL REVIEW REQUIRED',
          titleColor: 'text-yellow-900',
          description: 'DAVT agent verification needed',
        };
    }
  };

  const config = getVerdictConfig();
  const Icon = config.icon;

  return (
    <div className="space-y-4">
      {/* Main Verdict Card */}
      <div className={`rounded-xl border-2 ${config.borderColor} bg-gradient-to-br ${config.bgColor} shadow-lg overflow-hidden`}>
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-14 h-14 ${config.iconBg} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
              <Icon className="w-7 h-7 text-white" />
            </div>
            
            <div className="flex-1">
              <h3 className={`text-lg mb-1 ${config.titleColor}`}>
                {config.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3">{config.description}</p>
              
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Confidence Score</span>
                    <span className={`text-xs ${config.titleColor}`}>{verdict.confidence}%</span>
                  </div>
                  <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${verdict.decision === 'auto-approve' ? 'bg-green-600' : verdict.decision === 'auto-reject' ? 'bg-red-600' : 'bg-yellow-600'}`}
                      style={{ width: `${verdict.confidence}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Issues/Recommendations */}
          {verdict.issues.length > 0 && (
            <div className="bg-white/60 rounded-lg p-3 mb-3">
              <p className="text-xs text-gray-700 mb-2">Critical Issues:</p>
              <ul className="space-y-1.5">
                {verdict.issues.map((issue, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {verdict.recommendations.length > 0 && (
            <div className="bg-white/60 rounded-lg p-3">
              <p className="text-xs text-gray-700 mb-2">
                {verdict.decision === 'auto-approve' ? 'Status:' : 'Recommendations:'}
              </p>
              <ul className="space-y-1.5">
                {verdict.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                    <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${verdict.decision === 'auto-approve' ? 'text-green-600' : 'text-blue-600'}`} />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Validation Checks */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm text-gray-900">Compliance Validation</h3>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          {verdict.validations.map((validation, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-700">{validation.check}</span>
                {validation.status === 'pass' ? (
                  <div className="px-2 py-0.5 bg-green-100 text-green-700 rounded-md text-xs flex items-center gap-1 border border-green-300">
                    <CheckCircle2 className="w-3 h-3" />
                    Pass
                  </div>
                ) : validation.status === 'fail' ? (
                  <div className="px-2 py-0.5 bg-red-100 text-red-700 rounded-md text-xs flex items-center gap-1 border border-red-300">
                    <XCircle className="w-3 h-3" />
                    Fail
                  </div>
                ) : (
                  <div className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-md text-xs flex items-center gap-1 border border-yellow-300">
                    <AlertCircle className="w-3 h-3" />
                    Warning
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">{validation.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Processing Info */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <h3 className="text-sm text-gray-900">AI Processing Metrics</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/60 rounded-lg p-2.5">
            <p className="text-xs text-gray-600 mb-1">OCR Accuracy</p>
            <p className="text-lg text-purple-900">95.8%</p>
          </div>
          <div className="bg-white/60 rounded-lg p-2.5">
            <p className="text-xs text-gray-600 mb-1">Processing Time</p>
            <p className="text-lg text-purple-900">1.8s</p>
          </div>
          <div className="bg-white/60 rounded-lg p-2.5">
            <p className="text-xs text-gray-600 mb-1">Documents Verified</p>
            <p className="text-lg text-purple-900">9/9</p>
          </div>
          <div className="bg-white/60 rounded-lg p-2.5">
            <p className="text-xs text-gray-600 mb-1">Model Version</p>
            <p className="text-lg text-purple-900">v2.4</p>
          </div>
        </div>
      </div>
    </div>
  );
}
