import { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  FileText,
  Sparkles,
  Clock,
  Shield,
  AlertTriangle,
  CheckCheck,
  Send,
  ArrowUpCircle,
  Brain,
  Search,
  Filter,
  TrendingUp,
  Calendar,
  Package,
  User,
  Truck,
  FileX,
  BarChart3,
  Lightbulb,
  RefreshCw,
  MessageSquare,
  Zap,
  CircleDot,
  Target
} from 'lucide-react';

interface AIExceptionHandlingProps {
  onBack: () => void;
}

interface BlockedOrder {
  id: string;
  orderDate: string;
  customer: string;
  route: string;
  stage: string;
  reasonCode: string;
  reasonCategory: 'document' | 'validation' | 'compliance' | 'financial';
  blockedSince: string;
  priority: 'high' | 'medium' | 'low';
  aiSuggestion: string;
  detailedIssue: string;
  affectedDocuments: string[];
}

interface HistoricalPattern {
  reasonCode: string;
  occurrences: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  avgResolutionTime: string;
  successRate: number;
}

interface ResolutionStep {
  step: number;
  action: string;
  responsible: string;
  estimatedTime: string;
  automation: boolean;
}

export function AIExceptionHandling({ onBack }: AIExceptionHandlingProps) {
  const [blockedOrders] = useState<BlockedOrder[]>([
    {
      id: 'ORD-2024-007',
      orderDate: '07-Dec-2024',
      customer: 'Reliance Industries',
      route: 'Mumbai → Ahmedabad',
      stage: 'OPS Stage 1',
      reasonCode: 'DOC_EXPIRED_PUC',
      reasonCategory: 'document',
      blockedSince: '2 hours ago',
      priority: 'high',
      aiSuggestion: 'Request PUC renewal from vendor',
      detailedIssue: 'PUC certificate expired on 05-Dec-2024. Vehicle cannot be dispatched without valid pollution certificate.',
      affectedDocuments: ['PUC Certificate'],
    },
    {
      id: 'ORD-2024-008',
      orderDate: '08-Dec-2024',
      customer: 'Tata Motors',
      route: 'Pune → Chennai',
      stage: 'OPS Stage 2',
      reasonCode: 'VAL_WEIGHT_MISMATCH',
      reasonCategory: 'validation',
      blockedSince: '5 hours ago',
      priority: 'high',
      aiSuggestion: 'Re-weigh consignment or update invoice',
      detailedIssue: 'Invoice shows 15,000 KG but weighment slip records 14,200 KG. 800 KG (5.3%) variance exceeds threshold.',
      affectedDocuments: ['Invoice', 'Weighment Slip', 'E-way Bill'],
    },
    {
      id: 'ORD-2024-009',
      orderDate: '08-Dec-2024',
      customer: 'Amazon Logistics',
      route: 'Bangalore → Hyderabad',
      stage: 'DAVT Stage 1',
      reasonCode: 'COM_DL_CLASS_MISMATCH',
      reasonCategory: 'compliance',
      blockedSince: '1 day ago',
      priority: 'medium',
      aiSuggestion: 'Replace driver or obtain endorsement',
      detailedIssue: 'Driver license class is LMV but order requires HMV authorization. Vehicle weight exceeds DL authorization.',
      affectedDocuments: ['Driving License'],
    },
    {
      id: 'ORD-2024-010',
      orderDate: '06-Dec-2024',
      customer: 'Flipkart',
      route: 'Delhi → Jaipur',
      stage: 'OPS Stage 3',
      reasonCode: 'FIN_DAMAGE_EXCEED_LIMIT',
      reasonCategory: 'financial',
      blockedSince: '3 hours ago',
      priority: 'high',
      aiSuggestion: 'Escalate for management approval',
      detailedIssue: 'Damage deduction of ₹45,000 (90% of freight) exceeds auto-approval limit of ₹25,000.',
      affectedDocuments: ['POD', 'Damage Report', 'GRN'],
    },
    {
      id: 'ORD-2024-011',
      orderDate: '09-Dec-2024',
      customer: 'Mahindra Logistics',
      route: 'Chennai → Mumbai',
      stage: 'OPS Stage 2',
      reasonCode: 'VAL_EWB_EXPIRED',
      reasonCategory: 'validation',
      blockedSince: '30 mins ago',
      priority: 'high',
      aiSuggestion: 'Generate new E-way Bill immediately',
      detailedIssue: 'E-way Bill expired during transit. Current validity ended on 08-Dec-2024.',
      affectedDocuments: ['E-way Bill'],
    },
    {
      id: 'ORD-2024-012',
      orderDate: '07-Dec-2024',
      customer: 'ITC Limited',
      route: 'Kolkata → Delhi',
      stage: 'DAVT Stage 2',
      reasonCode: 'DOC_SIGNATURE_MISSING',
      reasonCategory: 'document',
      blockedSince: '6 hours ago',
      priority: 'medium',
      aiSuggestion: 'Contact consignee for signature',
      detailedIssue: 'POD received without consignee signature. AI signature detection failed to locate authorized signature.',
      affectedDocuments: ['POD'],
    },
  ]);

  const [historicalPatterns] = useState<HistoricalPattern[]>([
    {
      reasonCode: 'DOC_EXPIRED_PUC',
      occurrences: 47,
      trend: 'increasing',
      avgResolutionTime: '4.2 hours',
      successRate: 92,
    },
    {
      reasonCode: 'VAL_WEIGHT_MISMATCH',
      occurrences: 35,
      trend: 'stable',
      avgResolutionTime: '6.8 hours',
      successRate: 78,
    },
    {
      reasonCode: 'COM_DL_CLASS_MISMATCH',
      occurrences: 23,
      trend: 'decreasing',
      avgResolutionTime: '12.5 hours',
      successRate: 85,
    },
    {
      reasonCode: 'FIN_DAMAGE_EXCEED_LIMIT',
      occurrences: 18,
      trend: 'stable',
      avgResolutionTime: '24.0 hours',
      successRate: 65,
    },
    {
      reasonCode: 'VAL_EWB_EXPIRED',
      occurrences: 42,
      trend: 'increasing',
      avgResolutionTime: '2.5 hours',
      successRate: 98,
    },
    {
      reasonCode: 'DOC_SIGNATURE_MISSING',
      occurrences: 29,
      trend: 'stable',
      avgResolutionTime: '8.0 hours',
      successRate: 88,
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<BlockedOrder>(blockedOrders[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolutionNote, setResolutionNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resolutionSteps: ResolutionStep[] = [
    {
      step: 1,
      action: 'Contact vendor for PUC renewal',
      responsible: 'Ops Team',
      estimatedTime: '30 mins',
      automation: false,
    },
    {
      step: 2,
      action: 'Request digital PUC upload via vendor portal',
      responsible: 'AI System',
      estimatedTime: '5 mins',
      automation: true,
    },
    {
      step: 3,
      action: 'Auto-verify PUC using OCR & validation',
      responsible: 'AI System',
      estimatedTime: '2 mins',
      automation: true,
    },
    {
      step: 4,
      action: 'Re-submit order for DAVT approval',
      responsible: 'AI System',
      estimatedTime: '1 min',
      automation: true,
    },
  ];

  const handleResolve = () => {
    if (!resolutionNote.trim()) {
      alert('Please provide resolution notes');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Order ${selectedOrder.id} marked as RESOLVED\nNotes: ${resolutionNote}`);
      setShowResolveModal(false);
      setResolutionNote('');
    }, 1500);
  };

  const handleSendToOps = () => {
    alert(`Order ${selectedOrder.id} sent to Ops Team for manual intervention`);
  };

  const handleEscalate = () => {
    alert(`Order ${selectedOrder.id} escalated to Team Lead for review`);
  };

  const filteredOrders = blockedOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.reasonCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || order.reasonCategory === filterCategory;
    const matchesPriority = filterPriority === 'all' || order.priority === filterPriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const highPriorityCount = blockedOrders.filter(o => o.priority === 'high').length;
  const documentIssues = blockedOrders.filter(o => o.reasonCategory === 'document').length;
  const validationIssues = blockedOrders.filter(o => o.reasonCategory === 'validation').length;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm px-8 py-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-gray-900">AI Exception Handling Center</h1>
              <div className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                {blockedOrders.length} Blocked Orders
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Monitor, analyze & resolve AI-flagged exceptions with intelligent recommendations
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 mb-1">Total Blocked</p>
                <p className="text-2xl text-red-900">{blockedOrders.length}</p>
              </div>
              <FileX className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700 mb-1">High Priority</p>
                <p className="text-2xl text-orange-900">{highPriorityCount}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 mb-1">Document Issues</p>
                <p className="text-2xl text-purple-900">{documentIssues}</p>
              </div>
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 mb-1">Validation Errors</p>
                <p className="text-2xl text-blue-900">{validationIssues}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 mb-1">Avg Resolution</p>
                <p className="text-2xl text-green-900">6.8h</p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-12 gap-6 p-8">
          {/* LEFT PANEL - Blocked Orders List */}
          <div className="col-span-4 space-y-4 overflow-auto pr-2">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h2 className="text-gray-900">Blocked Orders Queue</h2>
              </div>

              {/* Search & Filters */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="document">Document</option>
                    <option value="validation">Validation</option>
                    <option value="compliance">Compliance</option>
                    <option value="financial">Financial</option>
                  </select>

                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-3">
              {filteredOrders.map((order) => (
                <BlockedOrderCard
                  key={order.id}
                  order={order}
                  isSelected={selectedOrder.id === order.id}
                  onClick={() => setSelectedOrder(order)}
                />
              ))}
            </div>
          </div>

          {/* CENTER PANEL - Exception Details & AI Resolution */}
          <div className="col-span-5 space-y-4 overflow-auto px-2">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <FileX className="w-5 h-5 text-red-600" />
                <h2 className="text-gray-900">Exception Details</h2>
              </div>
              <p className="text-sm text-gray-500">Order: {selectedOrder.id}</p>
            </div>

            {/* Exception Details Card */}
            <div className="bg-white rounded-xl border-2 border-red-200 shadow-lg">
              <div className="bg-gradient-to-r from-red-50 to-rose-50 p-5 border-b border-red-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-gray-900 mb-1">{selectedOrder.id}</h3>
                    <p className="text-sm text-gray-600">{selectedOrder.customer}</p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 border ${
                    selectedOrder.priority === 'high'
                      ? 'bg-red-100 text-red-700 border-red-300'
                      : selectedOrder.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                      : 'bg-blue-100 text-blue-700 border-blue-300'
                  }`}>
                    <AlertCircle className="w-4 h-4" />
                    {selectedOrder.priority.toUpperCase()}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/60 rounded-lg p-2">
                    <p className="text-xs text-gray-600">Route</p>
                    <p className="text-sm text-gray-900">{selectedOrder.route}</p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-2">
                    <p className="text-xs text-gray-600">Stage</p>
                    <p className="text-sm text-gray-900">{selectedOrder.stage}</p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-2">
                    <p className="text-xs text-gray-600">Blocked Since</p>
                    <p className="text-sm text-gray-900">{selectedOrder.blockedSince}</p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-2">
                    <p className="text-xs text-gray-600">Order Date</p>
                    <p className="text-sm text-gray-900">{selectedOrder.orderDate}</p>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Reason Code */}
                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <h4 className="text-sm text-red-900">Exception Reason</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm font-mono border border-red-300">
                        {selectedOrder.reasonCode}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        selectedOrder.reasonCategory === 'document'
                          ? 'bg-purple-100 text-purple-700'
                          : selectedOrder.reasonCategory === 'validation'
                          ? 'bg-blue-100 text-blue-700'
                          : selectedOrder.reasonCategory === 'compliance'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-pink-100 text-pink-700'
                      }`}>
                        {selectedOrder.reasonCategory.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{selectedOrder.detailedIssue}</p>
                  </div>
                </div>

                {/* Affected Documents */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-gray-600" />
                    <h4 className="text-sm text-gray-900">Affected Documents</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedOrder.affectedDocuments.map((doc, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700">
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <button
                    onClick={() => setShowResolveModal(true)}
                    className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Resolve
                  </button>
                  <button
                    onClick={handleSendToOps}
                    className="px-4 py-2.5 border-2 border-blue-600 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send to Ops
                  </button>
                  <button
                    onClick={handleEscalate}
                    className="px-4 py-2.5 border-2 border-yellow-600 text-yellow-700 rounded-lg hover:bg-yellow-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowUpCircle className="w-4 h-4" />
                    Escalate
                  </button>
                </div>
              </div>
            </div>

            {/* AI Resolution Steps */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 shadow-lg">
              <div className="p-5 border-b border-purple-200">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-purple-600" />
                  <h3 className="text-sm text-gray-900">AI-Suggested Resolution Steps</h3>
                </div>
              </div>

              <div className="p-5">
                <div className="bg-purple-100 border-2 border-purple-300 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-3">
                    <Brain className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-purple-900 mb-1">Primary Recommendation</p>
                      <p className="text-sm text-purple-800">{selectedOrder.aiSuggestion}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {resolutionSteps.map((step) => (
                    <ResolutionStepCard key={step.step} step={step} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL - Historical Patterns & Analytics */}
          <div className="col-span-3 space-y-4 overflow-auto pl-2">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <h2 className="text-gray-900">Historical Patterns</h2>
              </div>
              <p className="text-sm text-gray-500">Exception analytics</p>
            </div>

            {/* Historical Patterns */}
            <div className="space-y-3">
              {historicalPatterns.map((pattern, idx) => (
                <HistoricalPatternCard key={idx} pattern={pattern} />
              ))}
            </div>

            {/* Quick Insights */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm text-gray-900">Quick Insights</h3>
              </div>

              <div className="space-y-3">
                <div className="bg-white/60 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-700 mb-1">Top Resolution</p>
                      <p className="text-sm text-gray-900">E-way Bill renewal - 98% success</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-700 mb-1">Trending Issue</p>
                      <p className="text-sm text-gray-900">PUC expiry ↑ 23% this week</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-700 mb-1">Fastest Resolution</p>
                      <p className="text-sm text-gray-900">E-way Bill - 2.5 hours avg</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-purple-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-700 mb-1">AI Automation</p>
                      <p className="text-sm text-gray-900">67% auto-resolved this month</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resolve Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg text-gray-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Mark Exception as Resolved
              </h3>
            </div>
            <div className="p-6">
              <label className="block text-sm text-gray-700 mb-2">
                Resolution Notes <span className="text-red-600">*</span>
              </label>
              <textarea
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="Enter resolution details and actions taken..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowResolveModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResolve}
                disabled={isSubmitting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    Resolving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Confirm Resolution
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

// Blocked Order Card Component
interface BlockedOrderCardProps {
  order: BlockedOrder;
  isSelected: boolean;
  onClick: () => void;
}

function BlockedOrderCard({ order, isSelected, onClick }: BlockedOrderCardProps) {
  return (
    <div
      onClick={onClick}
      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
        isSelected
          ? 'border-red-500 bg-red-50 ring-2 ring-red-200'
          : 'border-gray-200 bg-white hover:border-red-300 hover:bg-red-50/30'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="text-sm text-gray-900 mb-1">{order.id}</h4>
          <p className="text-xs text-gray-600">{order.customer}</p>
        </div>
        <div className={`px-2 py-0.5 rounded text-xs ${
          order.priority === 'high'
            ? 'bg-red-100 text-red-700'
            : order.priority === 'medium'
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-blue-100 text-blue-700'
        }`}>
          {order.priority.toUpperCase()}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-mono">
            {order.reasonCode}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Clock className="w-3 h-3" />
          <span>{order.blockedSince}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Package className="w-3 h-3" />
          <span>{order.stage}</span>
        </div>
      </div>
    </div>
  );
}

// Resolution Step Card Component
interface ResolutionStepCardProps {
  step: ResolutionStep;
}

function ResolutionStepCard({ step }: ResolutionStepCardProps) {
  return (
    <div className="bg-white border-2 border-purple-200 rounded-lg p-3">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 text-white">
          {step.step}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-sm text-gray-900">{step.action}</h5>
            {step.automation && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Auto
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{step.responsible}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{step.estimatedTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Historical Pattern Card Component
interface HistoricalPatternCardProps {
  pattern: HistoricalPattern;
}

function HistoricalPatternCard({ pattern }: HistoricalPatternCardProps) {
  const getTrendIcon = () => {
    switch (pattern.trend) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-red-600" />;
      case 'decreasing':
        return <TrendingUp className="w-4 h-4 text-green-600 rotate-180" />;
      default:
        return <CircleDot className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded text-xs font-mono">
          {pattern.reasonCode}
        </span>
        {getTrendIcon()}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-600 mb-1">Occurrences</p>
          <p className="text-lg text-gray-900">{pattern.occurrences}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Success Rate</p>
          <p className="text-lg text-green-900">{pattern.successRate}%</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Avg Resolution</span>
          <span className="text-gray-900">{pattern.avgResolutionTime}</span>
        </div>
      </div>
    </div>
  );
}
