import { useState } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  FileText,
  Sparkles,
  Clock,
  Shield,
  QrCode,
  Camera,
  Scan,
  AlertTriangle,
  Zap,
  ArrowRight,
  Scale,
  Calendar,
  Package,
  FileCheck,
  TrendingUp,
  CheckCheck,
  Info
} from 'lucide-react';

interface AdvanceDocumentUploadProps {
  orderId: string | null;
  onBack: () => void;
}

interface AdvanceDocument {
  id: string;
  name: string;
  required: boolean;
  uploaded: boolean;
  status: 'empty' | 'processing' | 'valid' | 'invalid' | 'mismatch';
  fileName?: string;
  extractedData?: {
    field: string;
    value: string;
    confidence: number;
  }[];
}

interface CrossValidation {
  check: string;
  status: 'match' | 'mismatch' | 'warning' | 'pending';
  details: string;
  documents: string[];
}

interface AIDecision {
  outcome: 'approved' | 'rejected' | 'manual-review';
  confidence: number;
  issues: string[];
  autoFillData: {
    field: string;
    value: string;
    source: string;
  }[];
}

export function AdvanceDocumentUpload({ orderId, onBack }: AdvanceDocumentUploadProps) {
  const [documents, setDocuments] = useState<AdvanceDocument[]>([
    { id: 'lr', name: 'Lorry Receipt (LR)', required: true, uploaded: false, status: 'empty' },
    { id: 'invoice', name: 'Tax Invoice', required: true, uploaded: false, status: 'empty' },
    { id: 'eway-bill', name: 'E-way Bill', required: true, uploaded: false, status: 'empty' },
    { id: 'weighment', name: 'Weighment Slip', required: true, uploaded: false, status: 'empty' },
    { id: 'packing', name: 'Packing List', required: false, uploaded: false, status: 'empty' },
  ]);

  const [selectedDoc, setSelectedDoc] = useState<AdvanceDocument | null>(null);
  const [qrScanned, setQrScanned] = useState(false);
  const [qrData, setQrData] = useState<any>(null);
  const [crossValidations, setCrossValidations] = useState<CrossValidation[]>([]);
  const [aiDecision, setAiDecision] = useState<AIDecision | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const handleQRScan = () => {
    setIsScanning(true);
    
    // Simulate QR scanning
    setTimeout(() => {
      const mockQRData = {
        ewbNumber: 'EWB-391234567890',
        generatedDate: '08-Dec-2024',
        validUpto: '10-Dec-2024',
        vehicleNo: 'MH-12-AB-1234',
        fromPlace: 'Mumbai, Maharashtra',
        toPlace: 'Delhi, NCR',
        documentNumber: 'INV-2024-5678',
        documentDate: '08-Dec-2024',
        gstin: '27AABCU9603R1ZM',
        totalValue: '₹4,85,000',
        approximateWeight: '18500 KG',
      };
      
      setQrData(mockQRData);
      setQrScanned(true);
      setIsScanning(false);

      // Auto-upload E-way Bill document
      handleFileUpload('eway-bill', 'eway-bill-qr.pdf', mockQRData);
    }, 2000);
  };

  const handleFileUpload = (docId: string, fileName: string = 'document.pdf', qrExtractedData?: any) => {
    setDocuments(docs => 
      docs.map(doc => 
        doc.id === docId 
          ? { ...doc, uploaded: true, status: 'processing' as const, fileName }
          : doc
      )
    );

    const processingDoc = documents.find(d => d.id === docId);
    setSelectedDoc({ ...processingDoc!, uploaded: true, status: 'processing' as const, fileName });

    setTimeout(() => {
      const mockData = generateMockExtraction(docId, qrExtractedData);
      
      setDocuments(docs => 
        docs.map(d => 
          d.id === docId 
            ? { 
                ...d, 
                status: mockData.status, 
                extractedData: mockData.extractedData,
                fileName 
              }
            : d
        )
      );

      setSelectedDoc({ 
        ...processingDoc!, 
        status: mockData.status, 
        extractedData: mockData.extractedData,
        uploaded: true,
        fileName
      });

      // Run cross-validation when multiple documents are uploaded
      const uploadedCount = documents.filter(d => d.uploaded).length + 1;
      if (uploadedCount >= 3) {
        runCrossValidation();
      }
    }, 1500);
  };

  const generateMockExtraction = (docId: string, qrData?: any) => {
    const extractions: Record<string, any> = {
      'lr': {
        status: 'valid' as const,
        extractedData: [
          { field: 'LR Number', value: 'LR-MUM-2024-45678', confidence: 97 },
          { field: 'LR Date', value: '08-Dec-2024', confidence: 96 },
          { field: 'Consignor', value: 'ABC Manufacturing Ltd', confidence: 95 },
          { field: 'Consignee', value: 'XYZ Distributors Pvt Ltd', confidence: 96 },
          { field: 'From', value: 'Mumbai, Maharashtra', confidence: 98 },
          { field: 'To', value: 'Delhi, NCR', confidence: 97 },
          { field: 'Vehicle Number', value: 'MH-12-AB-1234', confidence: 98 },
          { field: 'Invoice Number', value: 'INV-2024-5678', confidence: 96 },
          { field: 'Freight Amount', value: '₹35,000', confidence: 94 },
          { field: 'Number of Packages', value: '150', confidence: 95 },
        ],
      },
      'invoice': {
        status: 'valid' as const,
        extractedData: [
          { field: 'Invoice Number', value: 'INV-2024-5678', confidence: 98 },
          { field: 'Invoice Date', value: '08-Dec-2024', confidence: 97 },
          { field: 'Seller Name', value: 'ABC Manufacturing Ltd', confidence: 96 },
          { field: 'Buyer Name', value: 'XYZ Distributors Pvt Ltd', confidence: 95 },
          { field: 'GSTIN (Seller)', value: '27AABCU9603R1ZM', confidence: 97 },
          { field: 'Total Amount', value: '₹4,85,000', confidence: 98 },
          { field: 'Total Quantity', value: '150 Units', confidence: 96 },
          { field: 'Total Weight', value: '18500 KG', confidence: 95 },
          { field: 'HSN Code', value: '8501', confidence: 94 },
        ],
      },
      'eway-bill': {
        status: 'valid' as const,
        extractedData: qrData ? [
          { field: 'E-way Bill Number', value: qrData.ewbNumber, confidence: 99 },
          { field: 'Generated Date', value: qrData.generatedDate, confidence: 99 },
          { field: 'Valid Upto', value: qrData.validUpto, confidence: 99 },
          { field: 'Vehicle Number', value: qrData.vehicleNo, confidence: 99 },
          { field: 'From Place', value: qrData.fromPlace, confidence: 99 },
          { field: 'To Place', value: qrData.toPlace, confidence: 99 },
          { field: 'Document Number', value: qrData.documentNumber, confidence: 99 },
          { field: 'Document Date', value: qrData.documentDate, confidence: 99 },
          { field: 'GSTIN', value: qrData.gstin, confidence: 99 },
          { field: 'Total Value', value: qrData.totalValue, confidence: 99 },
          { field: 'Approximate Weight', value: qrData.approximateWeight, confidence: 99 },
        ] : [
          { field: 'E-way Bill Number', value: 'EWB-391234567890', confidence: 98 },
          { field: 'Generated Date', value: '08-Dec-2024', confidence: 97 },
          { field: 'Valid Upto', value: '10-Dec-2024', confidence: 97 },
          { field: 'Vehicle Number', value: 'MH-12-AB-1234', confidence: 98 },
        ],
      },
      'weighment': {
        status: 'mismatch' as const,
        extractedData: [
          { field: 'Weighment Slip Number', value: 'WS-2024-9876', confidence: 96 },
          { field: 'Weighment Date', value: '08-Dec-2024', confidence: 97 },
          { field: 'Vehicle Number', value: 'MH-12-AB-1234', confidence: 98 },
          { field: 'Gross Weight', value: '20500 KG', confidence: 95 },
          { field: 'Tare Weight', value: '2500 KG', confidence: 94 },
          { field: 'Net Weight', value: '18000 KG', confidence: 96 },
          { field: 'Weighbridge No', value: 'WB-MUM-05', confidence: 93 },
        ],
      },
      'packing': {
        status: 'valid' as const,
        extractedData: [
          { field: 'Packing List Number', value: 'PL-2024-5678', confidence: 95 },
          { field: 'Date', value: '08-Dec-2024', confidence: 96 },
          { field: 'Total Packages', value: '150', confidence: 97 },
          { field: 'Total Gross Weight', value: '18500 KG', confidence: 95 },
          { field: 'Invoice Reference', value: 'INV-2024-5678', confidence: 96 },
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

  const runCrossValidation = () => {
    const validations: CrossValidation[] = [
      {
        check: 'Vehicle Number Matching',
        status: 'match',
        details: 'Vehicle number MH-12-AB-1234 matches across all documents',
        documents: ['LR', 'E-way Bill', 'Weighment Slip'],
      },
      {
        check: 'Invoice Number Matching',
        status: 'match',
        details: 'Invoice number INV-2024-5678 matches in LR and E-way Bill',
        documents: ['LR', 'Invoice', 'E-way Bill'],
      },
      {
        check: 'Date Consistency',
        status: 'match',
        details: 'All documents dated 08-Dec-2024',
        documents: ['LR', 'Invoice', 'E-way Bill', 'Weighment'],
      },
      {
        check: 'Weight Validation',
        status: 'mismatch',
        details: 'Weight mismatch detected: Invoice shows 18500 KG, Weighment shows 18000 KG (500 KG difference)',
        documents: ['Invoice', 'E-way Bill', 'Weighment Slip'],
      },
      {
        check: 'Quantity Verification',
        status: 'match',
        details: 'Package count of 150 units matches across documents',
        documents: ['LR', 'Invoice', 'Packing List'],
      },
      {
        check: 'GSTIN Verification',
        status: 'match',
        details: 'GSTIN 27AABCU9603R1ZM verified in Invoice and E-way Bill',
        documents: ['Invoice', 'E-way Bill'],
      },
      {
        check: 'E-way Bill Expiry',
        status: 'warning',
        details: 'E-way Bill valid until 10-Dec-2024 (2 days remaining)',
        documents: ['E-way Bill'],
      },
    ];

    setCrossValidations(validations);
    generateAIDecision(validations);
  };

  const generateAIDecision = (validations: CrossValidation[]) => {
    const hasMismatch = validations.some(v => v.status === 'mismatch');
    const hasWarning = validations.some(v => v.status === 'warning');

    if (hasMismatch) {
      setAiDecision({
        outcome: 'manual-review',
        confidence: 78,
        issues: [
          'Weight mismatch detected between documents',
          'Invoice weight: 18500 KG vs Weighment: 18000 KG',
          'Difference of 500 KG requires manual verification',
          'E-way Bill expiring in 2 days - monitor transit time',
        ],
        autoFillData: [
          { field: 'Vehicle Number', value: 'MH-12-AB-1234', source: 'E-way Bill (QR)' },
          { field: 'Invoice Number', value: 'INV-2024-5678', source: 'Invoice' },
          { field: 'LR Number', value: 'LR-MUM-2024-45678', source: 'LR' },
          { field: 'E-way Bill Number', value: 'EWB-391234567890', source: 'E-way Bill (QR)' },
          { field: 'Consignor', value: 'ABC Manufacturing Ltd', source: 'Invoice' },
          { field: 'Consignee', value: 'XYZ Distributors Pvt Ltd', source: 'Invoice' },
          { field: 'Total Weight', value: '18500 KG', source: 'Invoice (under review)' },
          { field: 'Total Quantity', value: '150 Units', source: 'Invoice' },
          { field: 'Freight Amount', value: '₹35,000', source: 'LR' },
        ],
      });
    } else if (hasWarning) {
      setAiDecision({
        outcome: 'approved',
        confidence: 92,
        issues: [
          'E-way Bill validity warning - expires in 2 days',
          'Ensure delivery within validity period',
        ],
        autoFillData: [
          { field: 'Vehicle Number', value: 'MH-12-AB-1234', source: 'E-way Bill (QR)' },
          { field: 'Invoice Number', value: 'INV-2024-5678', source: 'Invoice' },
          { field: 'LR Number', value: 'LR-MUM-2024-45678', source: 'LR' },
          { field: 'E-way Bill Number', value: 'EWB-391234567890', source: 'E-way Bill (QR)' },
          { field: 'Consignor', value: 'ABC Manufacturing Ltd', source: 'Invoice' },
          { field: 'Consignee', value: 'XYZ Distributors Pvt Ltd', source: 'Invoice' },
          { field: 'Total Weight', value: '18500 KG', source: 'E-way Bill' },
          { field: 'Total Quantity', value: '150 Units', source: 'Invoice' },
          { field: 'Freight Amount', value: '₹35,000', source: 'LR' },
        ],
      });
    } else {
      setAiDecision({
        outcome: 'approved',
        confidence: 98,
        issues: [],
        autoFillData: [
          { field: 'Vehicle Number', value: 'MH-12-AB-1234', source: 'E-way Bill (QR)' },
          { field: 'Invoice Number', value: 'INV-2024-5678', source: 'Invoice' },
          { field: 'LR Number', value: 'LR-MUM-2024-45678', source: 'LR' },
          { field: 'E-way Bill Number', value: 'EWB-391234567890', source: 'E-way Bill (QR)' },
          { field: 'Consignor', value: 'ABC Manufacturing Ltd', source: 'Invoice' },
          { field: 'Consignee', value: 'XYZ Distributors Pvt Ltd', source: 'Invoice' },
          { field: 'Total Weight', value: '18500 KG', source: 'E-way Bill' },
          { field: 'Total Quantity', value: '150 Units', source: 'Invoice' },
          { field: 'Freight Amount', value: '₹35,000', source: 'LR' },
        ],
      });
    }
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

  const handleApplyToOMS = () => {
    alert('Auto-filled data applied to OMS successfully!');
  };

  const handleSubmitForDAVT = () => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Order ${orderId} submitted for DAVT ADV Review - Status: ${aiDecision?.outcome.toUpperCase()}`);
    }, 2000);
  };

  const uploadedCount = documents.filter(d => d.uploaded).length;
  const validCount = documents.filter(d => d.status === 'valid').length;
  const mismatchCount = documents.filter(d => d.status === 'mismatch').length;

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
              <h1 className="text-gray-900">OPS STAGE 2 - Advance Document Upload</h1>
              <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                AI Cross-Validation
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Order {orderId || 'ORD-2024-001'} • Upload transport documents with QR extraction & automated matching
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleApplyToOMS}
              disabled={!aiDecision}
              className="px-4 py-2.5 border-2 border-blue-600 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <CheckCheck className="w-4 h-4" />
              Apply to OMS
            </button>
            <button 
              onClick={handleSubmitForDAVT}
              disabled={!aiDecision || isSubmitting}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-purple-500/30"
            >
              {isSubmitting ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Submit for DAVT ADV
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 mb-1">QR Scanned</p>
                <p className="text-2xl text-purple-900">{qrScanned ? 'Yes' : 'No'}</p>
              </div>
              <QrCode className={`w-8 h-8 ${qrScanned ? 'text-purple-600' : 'text-purple-400'}`} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 mb-1">Documents</p>
                <p className="text-2xl text-blue-900">{uploadedCount}/{documents.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 mb-1">Validated</p>
                <p className="text-2xl text-green-900">{validCount}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 mb-1">Mismatches</p>
                <p className="text-2xl text-red-900">{mismatchCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-indigo-700 mb-1">AI Confidence</p>
                <p className="text-2xl text-indigo-900">{aiDecision?.confidence || '--'}%</p>
              </div>
              <Sparkles className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
        </div>
      </header>

      {/* QR Scan Panel */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white">E-way Bill QR Scanner</h3>
              <p className="text-sm text-purple-100">
                {qrScanned 
                  ? `QR Extracted: ${qrData?.ewbNumber}` 
                  : 'Scan QR code for instant data extraction'}
              </p>
            </div>
          </div>

          <button
            onClick={handleQRScan}
            disabled={isScanning || qrScanned}
            className="px-6 py-3 bg-white text-purple-700 rounded-lg hover:bg-purple-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
          >
            {isScanning ? (
              <>
                <Scan className="w-5 h-5 animate-pulse" />
                Scanning QR...
              </>
            ) : qrScanned ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                QR Scanned
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                Scan EWB QR Code
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content - 3 Column Layout */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-12 gap-6 p-8">
          {/* LEFT PANEL - Document Upload Cards */}
          <div className="col-span-3 space-y-4 overflow-auto pr-2">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Upload className="w-5 h-5 text-purple-600" />
                <h2 className="text-gray-900">Upload Documents</h2>
              </div>
              <p className="text-sm text-gray-500">Transport & shipment docs</p>
            </div>

            <div className="space-y-3">
              {documents.map((doc) => (
                <AdvanceUploadCard
                  key={doc.id}
                  doc={doc}
                  isSelected={selectedDoc?.id === doc.id}
                  isDragOver={dragOver === doc.id}
                  onSelect={setSelectedDoc}
                  onUpload={handleFileUpload}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  qrScanned={doc.id === 'eway-bill' && qrScanned}
                />
              ))}
            </div>
          </div>

          {/* CENTER PANEL - AI Extracted Fields */}
          <div className="col-span-5 space-y-4 overflow-auto px-2">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h2 className="text-gray-900">AI Extracted Fields</h2>
              </div>
              <p className="text-sm text-gray-500">Cross-document data extraction</p>
            </div>

            {selectedDoc && selectedDoc.extractedData ? (
              <div className="bg-white rounded-xl border-2 border-blue-200 shadow-lg">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 border-b border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <FileCheck className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-gray-900">{selectedDoc.name}</h3>
                        <p className="text-xs text-gray-600">{selectedDoc.fileName}</p>
                      </div>
                    </div>
                    
                    {selectedDoc.status === 'valid' && (
                      <div className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm flex items-center gap-1.5 border border-green-300">
                        <CheckCircle2 className="w-4 h-4" />
                        Valid
                      </div>
                    )}
                    {selectedDoc.status === 'mismatch' && (
                      <div className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm flex items-center gap-1.5 border border-red-300">
                        <XCircle className="w-4 h-4" />
                        Mismatch
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  {selectedDoc.extractedData.map((field, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-gray-600">{field.field}</label>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                field.confidence >= 95 ? 'bg-green-500' :
                                field.confidence >= 85 ? 'bg-blue-500' :
                                'bg-yellow-500'
                              }`}
                              style={{ width: `${field.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-8">{field.confidence}%</span>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={field.value}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-gray-50"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 flex flex-col items-center justify-center text-center">
                <FileText className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-gray-900 mb-2">No Document Selected</h3>
                <p className="text-sm text-gray-500">
                  Upload and select a document to view extracted fields
                </p>
              </div>
            )}

            {/* Auto-Fill OMS Fields */}
            {aiDecision && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCheck className="w-5 h-5 text-green-600" />
                  <h3 className="text-gray-900">Auto-Fill OMS Fields</h3>
                </div>
                <div className="space-y-2 max-h-64 overflow-auto">
                  {aiDecision.autoFillData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{item.field}</p>
                        <p className="text-xs text-gray-600">{item.value}</p>
                      </div>
                      <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded border border-green-300">
                        {item.source}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT PANEL - Cross-Document Validation */}
          <div className="col-span-4 space-y-4 overflow-auto pl-2">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-purple-600" />
                <h2 className="text-gray-900">Cross-Validation</h2>
              </div>
              <p className="text-sm text-gray-500">Document matching results</p>
            </div>

            {crossValidations.length > 0 ? (
              <div className="space-y-4">
                {/* Validation Results */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-sm text-gray-900">Validation Checks</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {crossValidations.map((validation, idx) => (
                      <ValidationCard key={idx} validation={validation} />
                    ))}
                  </div>
                </div>

                {/* AI Decision */}
                {aiDecision && <AIDecisionPanel decision={aiDecision} />}
              </div>
            ) : (
              <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 flex flex-col items-center justify-center text-center">
                <Shield className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-gray-900 mb-2">Awaiting Cross-Validation</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Upload multiple documents to enable cross-validation
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Info className="w-3.5 h-3.5" />
                  <span>Minimum 3 documents required</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Advance Upload Card Component
interface AdvanceUploadCardProps {
  doc: AdvanceDocument;
  isSelected: boolean;
  isDragOver: boolean;
  qrScanned?: boolean;
  onSelect: (doc: AdvanceDocument) => void;
  onUpload: (docId: string) => void;
  onDragOver: (e: React.DragEvent, docId: string) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, docId: string) => void;
}

function AdvanceUploadCard({ doc, isSelected, isDragOver, qrScanned, onSelect, onUpload, onDragOver, onDragLeave, onDrop }: AdvanceUploadCardProps) {
  const getStatusIcon = () => {
    switch (doc.status) {
      case 'valid':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'mismatch':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const getCardStyles = () => {
    if (isDragOver) return 'border-purple-500 bg-purple-50 scale-105';
    if (isSelected) return 'border-purple-500 bg-purple-50 ring-2 ring-purple-200';
    if (doc.status === 'valid') return 'border-green-200 bg-green-50/50 hover:bg-green-50';
    if (doc.status === 'mismatch') return 'border-red-200 bg-red-50/50 hover:bg-red-50';
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
        
        {qrScanned && (
          <div className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs border border-purple-300 flex items-center gap-1">
            <QrCode className="w-3 h-3" />
            QR
          </div>
        )}
        {doc.status === 'valid' && (
          <div className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs border border-green-300">
            ✓ Valid
          </div>
        )}
        {doc.status === 'mismatch' && (
          <div className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs border border-red-300">
            Mismatch
          </div>
        )}
      </div>

      {!doc.uploaded ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUpload(doc.id);
          }}
          className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-xs text-gray-600 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
        >
          <Upload className="w-3.5 h-3.5" />
          Upload File
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

// Validation Card Component
interface ValidationCardProps {
  validation: CrossValidation;
}

function ValidationCard({ validation }: ValidationCardProps) {
  const getStatusConfig = () => {
    switch (validation.status) {
      case 'match':
        return {
          icon: CheckCircle2,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-600',
          textColor: 'text-green-900',
        };
      case 'mismatch':
        return {
          icon: XCircle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-600',
          textColor: 'text-red-900',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-600',
          textColor: 'text-yellow-900',
        };
      default:
        return {
          icon: Clock,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          iconColor: 'text-gray-600',
          textColor: 'text-gray-900',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-3`}>
      <div className="flex items-start gap-2 mb-2">
        <Icon className={`w-4 h-4 ${config.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <p className={`text-sm ${config.textColor}`}>{validation.check}</p>
          <p className="text-xs text-gray-600 mt-1">{validation.details}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1 mt-2">
        {validation.documents.map((doc, idx) => (
          <span key={idx} className="px-2 py-0.5 bg-white text-xs text-gray-700 rounded border border-gray-300">
            {doc}
          </span>
        ))}
      </div>
    </div>
  );
}

// AI Decision Panel Component
interface AIDecisionPanelProps {
  decision: AIDecision;
}

function AIDecisionPanel({ decision }: AIDecisionPanelProps) {
  const getOutcomeConfig = () => {
    switch (decision.outcome) {
      case 'approved':
        return {
          icon: CheckCircle2,
          bgColor: 'from-green-50 to-emerald-50',
          borderColor: 'border-green-300',
          iconBg: 'bg-green-600',
          title: '✅ APPROVED',
          titleColor: 'text-green-900',
        };
      case 'rejected':
        return {
          icon: XCircle,
          bgColor: 'from-red-50 to-rose-50',
          borderColor: 'border-red-300',
          iconBg: 'bg-red-600',
          title: '❌ REJECTED',
          titleColor: 'text-red-900',
        };
      case 'manual-review':
        return {
          icon: AlertCircle,
          bgColor: 'from-yellow-50 to-amber-50',
          borderColor: 'border-yellow-300',
          iconBg: 'bg-yellow-600',
          title: '🧠 MANUAL REVIEW',
          titleColor: 'text-yellow-900',
        };
    }
  };

  const config = getOutcomeConfig();
  const Icon = config.icon;

  return (
    <div className={`rounded-xl border-2 ${config.borderColor} bg-gradient-to-br ${config.bgColor} shadow-lg p-5`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 ${config.iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className={`${config.titleColor}`}>{config.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-600">Confidence:</span>
            <div className="flex-1 h-1.5 bg-white/50 rounded-full overflow-hidden max-w-[100px]">
              <div 
                className={`h-full ${
                  decision.outcome === 'approved' ? 'bg-green-600' :
                  decision.outcome === 'rejected' ? 'bg-red-600' :
                  'bg-yellow-600'
                }`}
                style={{ width: `${decision.confidence}%` }}
              />
            </div>
            <span className="text-xs text-gray-700">{decision.confidence}%</span>
          </div>
        </div>
      </div>

      {decision.issues.length > 0 && (
        <div className="bg-white/60 rounded-lg p-3">
          <p className="text-xs text-gray-700 mb-2">Issues Detected:</p>
          <ul className="space-y-1">
            {decision.issues.map((issue, idx) => (
              <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                <AlertTriangle className="w-3 h-3 text-red-600 flex-shrink-0 mt-0.5" />
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
