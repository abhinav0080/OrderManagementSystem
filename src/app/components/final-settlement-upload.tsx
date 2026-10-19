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
  Camera,
  AlertTriangle,
  Zap,
  Calendar,
  Package,
  TrendingDown,
  BadgeCheck,
  FileCheck,
  IndianRupee,
  Timer,
  ImageIcon,
  CheckCheck,
  Stamp,
  FileSignature
} from 'lucide-react';

interface FinalSettlementUploadProps {
  orderId: string | null;
  onBack: () => void;
}

interface SettlementDocument {
  id: string;
  name: string;
  required: boolean;
  uploaded: boolean;
  status: 'empty' | 'processing' | 'valid' | 'invalid' | 'damage-detected';
  fileName?: string;
  extractedData?: {
    field: string;
    value: string;
    confidence: number;
    alert?: boolean;
  }[];
  aiAnalysis?: {
    sealDetected?: boolean;
    signatureDetected?: boolean;
    damageDetected?: boolean;
    damageType?: string;
    damagePercentage?: number;
  };
}

interface SettlementDecision {
  outcome: 'accepted' | 'sent-back' | 'manual-review';
  confidence: number;
  issues: string[];
  financialImpact: {
    freightAmount: number;
    deductions: {
      reason: string;
      amount: number;
    }[];
    finalSettlement: number;
  };
  timeline: {
    expectedDelivery: string;
    actualDelivery: string;
    delay: number;
    penaltyApplicable: boolean;
  };
}

export function FinalSettlementUpload({ orderId, onBack }: FinalSettlementUploadProps) {
  const [documents, setDocuments] = useState<SettlementDocument[]>([
    { id: 'pod', name: 'Proof of Delivery (POD)', required: true, uploaded: false, status: 'empty' },
    { id: 'grn', name: 'Goods Receipt Note (GRN)', required: true, uploaded: false, status: 'empty' },
    { id: 'challan', name: 'Delivery Challans', required: true, uploaded: false, status: 'empty' },
    { id: 'damage-proof', name: 'Damage/Shortage Proof', required: false, uploaded: false, status: 'empty' },
  ]);

  const [selectedDoc, setSelectedDoc] = useState<SettlementDocument | null>(null);
  const [settlementDecision, setSettlementDecision] = useState<SettlementDecision | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (docId: string, fileName: string = 'document.pdf') => {
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
      const mockData = generateMockExtraction(docId);
      
      setDocuments(docs => 
        docs.map(d => 
          d.id === docId 
            ? { 
                ...d, 
                status: mockData.status, 
                extractedData: mockData.extractedData,
                aiAnalysis: mockData.aiAnalysis,
                fileName 
              }
            : d
        )
      );

      setSelectedDoc({ 
        ...processingDoc!, 
        status: mockData.status, 
        extractedData: mockData.extractedData,
        aiAnalysis: mockData.aiAnalysis,
        uploaded: true,
        fileName
      });

      // Generate settlement decision when all required documents are uploaded
      const uploadedCount = documents.filter(d => d.uploaded).length + 1;
      if (uploadedCount >= documents.filter(d => d.required).length) {
        generateSettlementDecision();
      }
    }, 2000);
  };

  const generateMockExtraction = (docId: string) => {
    const extractions: Record<string, any> = {
      'pod': {
        status: 'valid' as const,
        extractedData: [
          { field: 'POD Number', value: 'POD-DEL-2024-9876', confidence: 97 },
          { field: 'Delivery Date', value: '12-Dec-2024', confidence: 98, alert: true },
          { field: 'Delivery Time', value: '14:30 hrs', confidence: 96 },
          { field: 'Receiver Name', value: 'Rajesh Kumar (Warehouse Manager)', confidence: 95 },
          { field: 'Designation', value: 'Warehouse Manager', confidence: 94 },
          { field: 'Contact Number', value: '+91-9876543210', confidence: 93 },
          { field: 'Packages Received', value: '148 / 150', confidence: 96, alert: true },
          { field: 'Condition', value: '3 packages damaged', confidence: 92, alert: true },
          { field: 'Remarks', value: 'Minor external damage on 3 cartons', confidence: 89 },
        ],
        aiAnalysis: {
          sealDetected: true,
          signatureDetected: true,
          damageDetected: false,
        },
      },
      'grn': {
        status: 'valid' as const,
        extractedData: [
          { field: 'GRN Number', value: 'GRN-2024-5432', confidence: 98 },
          { field: 'GRN Date', value: '12-Dec-2024', confidence: 97 },
          { field: 'Purchase Order', value: 'PO-2024-8765', confidence: 96 },
          { field: 'Invoice Reference', value: 'INV-2024-5678', confidence: 97 },
          { field: 'Received Quantity', value: '148 Units', confidence: 96, alert: true },
          { field: 'Accepted Quantity', value: '145 Units', confidence: 95, alert: true },
          { field: 'Rejected Quantity', value: '3 Units (Damaged)', confidence: 94, alert: true },
          { field: 'Total Value', value: '₹4,70,000', confidence: 96 },
          { field: 'Receiver Signature', value: 'Verified', confidence: 98 },
        ],
        aiAnalysis: {
          sealDetected: false,
          signatureDetected: true,
          damageDetected: false,
        },
      },
      'challan': {
        status: 'valid' as const,
        extractedData: [
          { field: 'Challan Number', value: 'CH-2024-7890', confidence: 96 },
          { field: 'Challan Date', value: '12-Dec-2024', confidence: 97 },
          { field: 'Vehicle Number', value: 'MH-12-AB-1234', confidence: 98 },
          { field: 'LR Number', value: 'LR-MUM-2024-45678', confidence: 97 },
          { field: 'Consignment Value', value: '₹4,85,000', confidence: 96 },
          { field: 'Delivery Location', value: 'Delhi Warehouse', confidence: 95 },
        ],
        aiAnalysis: {
          sealDetected: false,
          signatureDetected: true,
          damageDetected: false,
        },
      },
      'damage-proof': {
        status: 'damage-detected' as const,
        extractedData: [
          { field: 'Report Number', value: 'DMG-RPT-2024-456', confidence: 95 },
          { field: 'Report Date', value: '12-Dec-2024', confidence: 97 },
          { field: 'Damaged Items', value: '3 Cartons', confidence: 94, alert: true },
          { field: 'Damage Type', value: 'External packaging damage', confidence: 91 },
          { field: 'Estimated Loss', value: '₹15,000', confidence: 88, alert: true },
          { field: 'Photographic Evidence', value: '4 images attached', confidence: 99 },
        ],
        aiAnalysis: {
          sealDetected: false,
          signatureDetected: false,
          damageDetected: true,
          damageType: 'External packaging damage',
          damagePercentage: 2,
        },
      },
    };

    return extractions[docId] || {
      status: 'valid' as const,
      extractedData: [
        { field: 'Document Type', value: 'Verified', confidence: 90 },
      ],
      aiAnalysis: {},
    };
  };

  const generateSettlementDecision = () => {
    const hasDamage = documents.some(d => d.status === 'damage-detected');
    
    // Calculate delay (expected: 10-Dec, actual: 12-Dec = 2 days delay)
    const expectedDate = new Date('2024-12-10');
    const actualDate = new Date('2024-12-12');
    const delayDays = Math.floor((actualDate.getTime() - expectedDate.getTime()) / (1000 * 60 * 60 * 24));

    const freightAmount = 35000;
    const deductions = [];

    // Delay penalty: ₹500 per day
    if (delayDays > 0) {
      deductions.push({
        reason: `Delay Penalty (${delayDays} days @ ₹500/day)`,
        amount: delayDays * 500,
      });
    }

    // Damage deduction
    if (hasDamage) {
      deductions.push({
        reason: 'Damage Compensation (3 units)',
        amount: 15000,
      });
    }

    // Shortage deduction
    deductions.push({
      reason: 'Shortage Penalty (2 units)',
      amount: 5000,
    });

    const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
    const finalSettlement = freightAmount - totalDeductions;

    if (hasDamage || delayDays > 2) {
      setSettlementDecision({
        outcome: 'manual-review',
        confidence: 82,
        issues: [
          'Delivery delayed by 2 days (Expected: 10-Dec, Actual: 12-Dec)',
          'Damage detected: 3 units with external packaging damage',
          'Shortage identified: 2 units missing (150 shipped, 148 received)',
          'Manual verification required for damage assessment',
          'Penalty calculation needs approval',
        ],
        financialImpact: {
          freightAmount,
          deductions,
          finalSettlement,
        },
        timeline: {
          expectedDelivery: '10-Dec-2024',
          actualDelivery: '12-Dec-2024',
          delay: delayDays,
          penaltyApplicable: true,
        },
      });
    } else if (delayDays > 0) {
      setSettlementDecision({
        outcome: 'accepted',
        confidence: 91,
        issues: [
          'Minor delay detected (within acceptable range)',
          'All documents verified with signatures',
          'Settlement approved with delay penalty',
        ],
        financialImpact: {
          freightAmount,
          deductions,
          finalSettlement,
        },
        timeline: {
          expectedDelivery: '10-Dec-2024',
          actualDelivery: '12-Dec-2024',
          delay: delayDays,
          penaltyApplicable: true,
        },
      });
    } else {
      setSettlementDecision({
        outcome: 'accepted',
        confidence: 98,
        issues: [],
        financialImpact: {
          freightAmount,
          deductions: [],
          finalSettlement: freightAmount,
        },
        timeline: {
          expectedDelivery: '10-Dec-2024',
          actualDelivery: '10-Dec-2024',
          delay: 0,
          penaltyApplicable: false,
        },
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

  const handleSubmitToDAVTFS = () => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Order ${orderId} submitted for DAVT Final Settlement - Status: ${settlementDecision?.outcome.toUpperCase()}`);
    }, 2000);
  };

  const uploadedCount = documents.filter(d => d.uploaded).length;
  const validCount = documents.filter(d => d.status === 'valid').length;
  const damageCount = documents.filter(d => d.status === 'damage-detected').length;

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
              <h1 className="text-gray-900">OPS STAGE 3 - Final Settlement & POD Upload</h1>
              <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                AI Settlement Engine
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Order {orderId || 'ORD-2024-001'} • Upload delivery proof & settlement documents with AI verification
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
              onClick={handleSubmitToDAVTFS}
              disabled={!settlementDecision || isSubmitting}
              className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-green-500/30"
            >
              {isSubmitting ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCheck className="w-4 h-4" />
                  Submit to DAVT FS
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 mb-1">POD Status</p>
                <p className="text-2xl text-green-900">{documents[0]?.uploaded ? 'Uploaded' : 'Pending'}</p>
              </div>
              <BadgeCheck className={`w-8 h-8 ${documents[0]?.uploaded ? 'text-green-600' : 'text-green-400'}`} />
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

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 mb-1">Verified</p>
                <p className="text-2xl text-purple-900">{validCount}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 mb-1">Damage Reports</p>
                <p className="text-2xl text-red-900">{damageCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-indigo-700 mb-1">AI Confidence</p>
                <p className="text-2xl text-indigo-900">{settlementDecision?.confidence || '--'}%</p>
              </div>
              <Sparkles className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - 3 Column Layout */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-12 gap-6 p-8">
          {/* LEFT PANEL - Document Upload Cards */}
          <div className="col-span-3 space-y-4 overflow-auto pr-2">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Upload className="w-5 h-5 text-green-600" />
                <h2 className="text-gray-900">Settlement Documents</h2>
              </div>
              <p className="text-sm text-gray-500">Upload POD & final proofs</p>
            </div>

            <div className="space-y-3">
              {documents.map((doc) => (
                <SettlementUploadCard
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

          {/* CENTER PANEL - AI Extracted Data & Analysis */}
          <div className="col-span-5 space-y-4 overflow-auto px-2">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-green-600" />
                <h2 className="text-gray-900">AI Verification & Analysis</h2>
              </div>
              <p className="text-sm text-gray-500">Automated POD & damage detection</p>
            </div>

            {selectedDoc && selectedDoc.extractedData ? (
              <div className="space-y-4">
                {/* Extracted Data Card */}
                <div className="bg-white rounded-xl border-2 border-green-200 shadow-lg">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 border-b border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
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
                          Verified
                        </div>
                      )}
                      {selectedDoc.status === 'damage-detected' && (
                        <div className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm flex items-center gap-1.5 border border-red-300 animate-pulse">
                          <AlertTriangle className="w-4 h-4" />
                          Damage Detected
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    {selectedDoc.extractedData.map((field, idx) => (
                      <div key={idx} className={`space-y-1.5 ${field.alert ? 'p-2 bg-amber-50 rounded-lg border border-amber-200' : ''}`}>
                        <div className="flex items-center justify-between">
                          <label className={`text-xs ${field.alert ? 'text-amber-800' : 'text-gray-600'} flex items-center gap-1`}>
                            {field.alert && <AlertCircle className="w-3 h-3 text-amber-600" />}
                            {field.field}
                          </label>
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
                          className={`w-full px-3 py-2 border rounded-lg text-sm text-gray-900 ${
                            field.alert ? 'border-amber-300 bg-amber-50' : 'border-gray-300 bg-gray-50'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Analysis Panel */}
                {selectedDoc.aiAnalysis && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 p-5 shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <h3 className="text-gray-900">AI Document Analysis</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {selectedDoc.aiAnalysis.sealDetected !== undefined && (
                        <div className={`p-3 rounded-lg border-2 ${
                          selectedDoc.aiAnalysis.sealDetected 
                            ? 'bg-green-50 border-green-300' 
                            : 'bg-red-50 border-red-300'
                        }`}>
                          <div className="flex items-center gap-2 mb-1">
                            <Stamp className={`w-4 h-4 ${
                              selectedDoc.aiAnalysis.sealDetected ? 'text-green-600' : 'text-red-600'
                            }`} />
                            <span className="text-xs text-gray-700">Seal Detection</span>
                          </div>
                          <p className={`text-sm ${
                            selectedDoc.aiAnalysis.sealDetected ? 'text-green-900' : 'text-red-900'
                          }`}>
                            {selectedDoc.aiAnalysis.sealDetected ? '✓ Detected' : '✗ Not Found'}
                          </p>
                        </div>
                      )}

                      {selectedDoc.aiAnalysis.signatureDetected !== undefined && (
                        <div className={`p-3 rounded-lg border-2 ${
                          selectedDoc.aiAnalysis.signatureDetected 
                            ? 'bg-green-50 border-green-300' 
                            : 'bg-red-50 border-red-300'
                        }`}>
                          <div className="flex items-center gap-2 mb-1">
                            <FileSignature className={`w-4 h-4 ${
                              selectedDoc.aiAnalysis.signatureDetected ? 'text-green-600' : 'text-red-600'
                            }`} />
                            <span className="text-xs text-gray-700">Signature</span>
                          </div>
                          <p className={`text-sm ${
                            selectedDoc.aiAnalysis.signatureDetected ? 'text-green-900' : 'text-red-900'
                          }`}>
                            {selectedDoc.aiAnalysis.signatureDetected ? '✓ Verified' : '✗ Missing'}
                          </p>
                        </div>
                      )}

                      {selectedDoc.aiAnalysis.damageDetected !== undefined && (
                        <div className={`p-3 rounded-lg border-2 ${
                          selectedDoc.aiAnalysis.damageDetected 
                            ? 'bg-red-50 border-red-300' 
                            : 'bg-green-50 border-green-300'
                        }`}>
                          <div className="flex items-center gap-2 mb-1">
                            <ImageIcon className={`w-4 h-4 ${
                              selectedDoc.aiAnalysis.damageDetected ? 'text-red-600' : 'text-green-600'
                            }`} />
                            <span className="text-xs text-gray-700">Damage Check</span>
                          </div>
                          <p className={`text-sm ${
                            selectedDoc.aiAnalysis.damageDetected ? 'text-red-900' : 'text-green-900'
                          }`}>
                            {selectedDoc.aiAnalysis.damageDetected ? '⚠ Damage Found' : '✓ No Damage'}
                          </p>
                        </div>
                      )}

                      {selectedDoc.aiAnalysis.damageType && (
                        <div className="p-3 rounded-lg border-2 bg-amber-50 border-amber-300">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            <span className="text-xs text-gray-700">Damage Type</span>
                          </div>
                          <p className="text-sm text-amber-900">{selectedDoc.aiAnalysis.damageType}</p>
                          {selectedDoc.aiAnalysis.damagePercentage && (
                            <p className="text-xs text-amber-700 mt-1">
                              Impact: {selectedDoc.aiAnalysis.damagePercentage}%
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleFileUpload(selectedDoc.id, selectedDoc.fileName)}
                      className="w-full mt-4 px-4 py-2.5 border-2 border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Re-upload Document
                    </button>
                  </div>
                )}
              </div>
            ) : selectedDoc && selectedDoc.status === 'processing' ? (
              <div className="bg-white rounded-xl border-2 border-blue-200 p-12 flex flex-col items-center justify-center text-center shadow-lg">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
                <h3 className="text-gray-900 mb-2">AI Processing Document</h3>
                <p className="text-sm text-gray-500 mb-4">Analyzing POD, signatures & damage evidence...</p>
                <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 flex flex-col items-center justify-center text-center">
                <FileText className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-gray-900 mb-2">No Document Selected</h3>
                <p className="text-sm text-gray-500">
                  Upload and select a document to view AI analysis
                </p>
              </div>
            )}
          </div>

          {/* RIGHT PANEL - Settlement Decision & Financial Impact */}
          <div className="col-span-4 space-y-4 overflow-auto pl-2">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <IndianRupee className="w-5 h-5 text-green-600" />
                <h2 className="text-gray-900">Settlement Analysis</h2>
              </div>
              <p className="text-sm text-gray-500">Financial & timeline validation</p>
            </div>

            {settlementDecision ? (
              <SettlementDecisionPanel decision={settlementDecision} />
            ) : (
              <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 flex flex-col items-center justify-center text-center">
                <Shield className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-gray-900 mb-2">Awaiting Settlement Analysis</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Upload all required documents for automated settlement calculation
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Zap className="w-3.5 h-3.5" />
                  <span>AI-powered financial analysis</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Settlement Upload Card Component
interface SettlementUploadCardProps {
  doc: SettlementDocument;
  isSelected: boolean;
  isDragOver: boolean;
  onSelect: (doc: SettlementDocument) => void;
  onUpload: (docId: string) => void;
  onDragOver: (e: React.DragEvent, docId: string) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, docId: string) => void;
}

function SettlementUploadCard({ doc, isSelected, isDragOver, onSelect, onUpload, onDragOver, onDragLeave, onDrop }: SettlementUploadCardProps) {
  const getStatusIcon = () => {
    switch (doc.status) {
      case 'valid':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'damage-detected':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return doc.id === 'damage-proof' ? (
          <Camera className="w-5 h-5 text-gray-400" />
        ) : (
          <FileText className="w-5 h-5 text-gray-400" />
        );
    }
  };

  const getCardStyles = () => {
    if (isDragOver) return 'border-green-500 bg-green-50 scale-105';
    if (isSelected) return 'border-green-500 bg-green-50 ring-2 ring-green-200';
    if (doc.status === 'valid') return 'border-green-200 bg-green-50/50 hover:bg-green-50';
    if (doc.status === 'damage-detected') return 'border-red-200 bg-red-50/50 hover:bg-red-50';
    if (doc.status === 'processing') return 'border-blue-200 bg-blue-50/50';
    return 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/30';
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
        
        {doc.status === 'damage-detected' && (
          <div className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs border border-red-300 animate-pulse">
            Damage
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
          className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-xs text-gray-600 hover:border-green-400 hover:text-green-600 hover:bg-green-50 transition-all flex items-center justify-center gap-2"
        >
          {doc.id === 'damage-proof' ? (
            <>
              <Camera className="w-3.5 h-3.5" />
              Upload Photos
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
          AI Analyzing...
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

// Settlement Decision Panel Component
interface SettlementDecisionPanelProps {
  decision: SettlementDecision;
}

function SettlementDecisionPanel({ decision }: SettlementDecisionPanelProps) {
  const getOutcomeConfig = () => {
    switch (decision.outcome) {
      case 'accepted':
        return {
          icon: CheckCircle2,
          bgColor: 'from-green-50 to-emerald-50',
          borderColor: 'border-green-300',
          iconBg: 'bg-green-600',
          title: '✅ ACCEPTED',
          titleColor: 'text-green-900',
        };
      case 'sent-back':
        return {
          icon: XCircle,
          bgColor: 'from-red-50 to-rose-50',
          borderColor: 'border-red-300',
          iconBg: 'bg-red-600',
          title: '❌ SENT BACK',
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
    <div className="space-y-4">
      {/* Outcome Card */}
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
                    decision.outcome === 'accepted' ? 'bg-green-600' :
                    decision.outcome === 'sent-back' ? 'bg-red-600' :
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
                  <AlertCircle className="w-3 h-3 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Timeline Analysis */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm text-gray-900">Delivery Timeline</h3>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
            <span className="text-xs text-gray-700">Expected Delivery</span>
            <span className="text-sm text-blue-900">{decision.timeline.expectedDelivery}</span>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
            <span className="text-xs text-gray-700">Actual Delivery</span>
            <span className="text-sm text-green-900">{decision.timeline.actualDelivery}</span>
          </div>

          {decision.timeline.delay > 0 && (
            <div className={`flex items-center justify-between p-2 rounded-lg border-2 ${
              decision.timeline.delay > 2 ? 'bg-red-50 border-red-300' : 'bg-yellow-50 border-yellow-300'
            }`}>
              <div className="flex items-center gap-2">
                <Clock className={`w-4 h-4 ${decision.timeline.delay > 2 ? 'text-red-600' : 'text-yellow-600'}`} />
                <span className="text-xs text-gray-700">Delay</span>
              </div>
              <span className={`text-sm ${decision.timeline.delay > 2 ? 'text-red-900' : 'text-yellow-900'}`}>
                {decision.timeline.delay} days
              </span>
            </div>
          )}

          {decision.timeline.penaltyApplicable && (
            <div className="p-2 bg-amber-50 border border-amber-300 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="text-xs text-amber-900">Penalty Applicable</span>
            </div>
          )}
        </div>
      </div>

      {/* Financial Settlement */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 shadow-lg">
        <div className="p-4 border-b border-green-200">
          <div className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-green-600" />
            <h3 className="text-sm text-gray-900">Financial Settlement</h3>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
            <span className="text-sm text-gray-700">Base Freight</span>
            <span className="text-sm text-gray-900">₹{decision.financialImpact.freightAmount.toLocaleString()}</span>
          </div>

          {decision.financialImpact.deductions.length > 0 && (
            <>
              <div className="border-t border-green-200 pt-2">
                <p className="text-xs text-gray-600 mb-2">Deductions:</p>
                {decision.financialImpact.deductions.map((deduction, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-red-50 rounded-lg mb-2">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                      <span className="text-xs text-gray-700">{deduction.reason}</span>
                    </div>
                    <span className="text-sm text-red-900">-₹{deduction.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="border-t-2 border-green-300 pt-3 mt-3">
            <div className="flex items-center justify-between p-3 bg-green-100 rounded-lg border border-green-300">
              <span className="text-gray-900">Final Settlement</span>
              <span className="text-xl text-green-900">₹{decision.financialImpact.finalSettlement.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Processing Metrics */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <h3 className="text-sm text-gray-900">AI Analysis Summary</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/60 rounded-lg p-2">
            <p className="text-xs text-gray-600">POD Verified</p>
            <p className="text-sm text-purple-900">✓ Yes</p>
          </div>
          <div className="bg-white/60 rounded-lg p-2">
            <p className="text-xs text-gray-600">Signatures</p>
            <p className="text-sm text-purple-900">✓ Found</p>
          </div>
          <div className="bg-white/60 rounded-lg p-2">
            <p className="text-xs text-gray-600">Processing Time</p>
            <p className="text-sm text-purple-900">2.1s</p>
          </div>
          <div className="bg-white/60 rounded-lg p-2">
            <p className="text-xs text-gray-600">Model Version</p>
            <p className="text-sm text-purple-900">v3.2</p>
          </div>
        </div>
      </div>
    </div>
  );
}
