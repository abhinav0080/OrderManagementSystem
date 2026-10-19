import { useState } from 'react';
import { 
  Search,
  Filter,
  Clock,
  AlertTriangle,
  CheckCircle2,
  User,
  FileText,
  Package,
  IndianRupee,
  TrendingUp,
  Eye,
  ChevronDown
} from 'lucide-react';

interface DAVTQueueProps {
  onOpenKYCVerification: (orderId: string) => void;
  onOpenAdvanceVerification: (orderId: string) => void;
  onOpenSettlementVerification: (orderId: string) => void;
}

type TabType = 'kyc' | 'advance' | 'settlement';

interface QueueTask {
  id: string;
  orderId: string;
  vehicleNumber: string;
  vendorName: string;
  customerName: string;
  issuesFlagged?: string;
  aiRiskLevel: 'high' | 'medium' | 'low';
  queueTime: string;
  priority: 'high' | 'medium' | 'low';
  route?: string;
  aiCrossCheckStatus?: string;
  docsMissing?: string;
  shortageFlag?: boolean;
  damageFlag?: boolean;
  delayFlag?: boolean;
  aiConfidence?: number;
  netPayable?: string;
  netBillable?: string;
}

export function DAVTQueue({ 
  onOpenKYCVerification, 
  onOpenAdvanceVerification,
  onOpenSettlementVerification 
}: DAVTQueueProps) {
  const [activeTab, setActiveTab] = useState<TabType>('kyc');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [agingFilter, setAgingFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [assignedFilter, setAssignedFilter] = useState('all');

  // Mock data for KYC queue
  const kycTasks: QueueTask[] = [
    {
      id: '1',
      orderId: 'ORD-2024-1245',
      vehicleNumber: 'MH-12-AB-1234',
      vendorName: 'Express Logistics Pvt Ltd',
      customerName: 'Reliance Industries',
      issuesFlagged: '2 issues — Name mismatch, RC expiry risk',
      aiRiskLevel: 'high',
      queueTime: '18 min',
      priority: 'high',
      route: 'Mumbai → Delhi'
    },
    {
      id: '2',
      orderId: 'ORD-2024-1246',
      vehicleNumber: 'GJ-01-CD-5678',
      vendorName: 'FastMove Transport',
      customerName: 'Tata Motors',
      issuesFlagged: '1 issue — Insurance expired',
      aiRiskLevel: 'medium',
      queueTime: '12 min',
      priority: 'medium',
      route: 'Ahmedabad → Pune'
    },
    {
      id: '3',
      orderId: 'ORD-2024-1247',
      vehicleNumber: 'DL-3C-EF-9012',
      vendorName: 'Quick Transport Solutions',
      customerName: 'Mahindra & Mahindra',
      issuesFlagged: '3 issues — DL expired, Low quality selfie, PAN mismatch',
      aiRiskLevel: 'high',
      queueTime: '45 min',
      priority: 'high',
      route: 'Delhi → Bangalore'
    },
  ];

  // Mock data for Advance Docs queue
  const advanceTasks: QueueTask[] = [
    {
      id: '1',
      orderId: 'ORD-2024-1248',
      vehicleNumber: 'KA-05-GH-3456',
      vendorName: 'Southern Logistics',
      customerName: 'Amazon Logistics',
      aiCrossCheckStatus: '3 mismatches',
      docsMissing: 'E-Way Bill',
      aiRiskLevel: 'high',
      queueTime: '32 min',
      priority: 'high',
      route: 'Bangalore → Chennai'
    },
    {
      id: '2',
      orderId: 'ORD-2024-1249',
      vehicleNumber: 'TN-09-IJ-7890',
      vendorName: 'Eastern Transport Co',
      customerName: 'Flipkart',
      aiCrossCheckStatus: '1 QR issue',
      aiRiskLevel: 'medium',
      queueTime: '15 min',
      priority: 'medium',
      route: 'Chennai → Hyderabad'
    },
  ];

  // Mock data for Settlement queue
  const settlementTasks: QueueTask[] = [
    {
      id: '1',
      orderId: 'ORD-2024-1250',
      vehicleNumber: 'MH-14-KL-2345',
      vendorName: 'Western Freight Services',
      customerName: 'Asian Paints',
      shortageFlag: true,
      damageFlag: true,
      delayFlag: false,
      aiConfidence: 87,
      netPayable: '₹73,750',
      netBillable: '₹76,050',
      aiRiskLevel: 'high',
      queueTime: '25 min',
      priority: 'high',
      route: 'Mumbai → Pune'
    },
    {
      id: '2',
      orderId: 'ORD-2024-1251',
      vehicleNumber: 'GJ-27-MN-6789',
      vendorName: 'Gujarat Transport Ltd',
      customerName: 'Ultratech Cement',
      shortageFlag: false,
      damageFlag: false,
      delayFlag: true,
      aiConfidence: 94,
      netPayable: '₹85,000',
      netBillable: '₹90,000',
      aiRiskLevel: 'low',
      queueTime: '8 min',
      priority: 'low',
      route: 'Surat → Rajkot'
    },
  ];

  const getCurrentTasks = () => {
    switch (activeTab) {
      case 'kyc':
        return kycTasks;
      case 'advance':
        return advanceTasks;
      case 'settlement':
        return settlementTasks;
      default:
        return [];
    }
  };

  const handleOpenTask = (orderId: string) => {
    switch (activeTab) {
      case 'kyc':
        onOpenKYCVerification(orderId);
        break;
      case 'advance':
        onOpenAdvanceVerification(orderId);
        break;
      case 'settlement':
        onOpenSettlementVerification(orderId);
        break;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-2xl">
        <div className="px-8 py-6">
          <h1 className="text-3xl text-white mb-2">DAVT Queue</h1>
          <p className="text-lg text-white/90">Worklist of all orders pending manual verification based on agent skills</p>

          {/* Tabs */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab('kyc')}
              className={`px-6 py-3 rounded-lg transition-all ${
                activeTab === 'kyc'
                  ? 'bg-white text-purple-700 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Vehicle & Driver KYC
            </button>
            <button
              onClick={() => setActiveTab('advance')}
              className={`px-6 py-3 rounded-lg transition-all ${
                activeTab === 'advance'
                  ? 'bg-white text-purple-700 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Advance Docs Verification
            </button>
            <button
              onClick={() => setActiveTab('settlement')}
              className={`px-6 py-3 rounded-lg transition-all ${
                activeTab === 'settlement'
                  ? 'bg-white text-purple-700 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Settlement Verification
            </button>
          </div>

          {/* Filters */}
          <div className="mt-6 flex items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                type="text"
                placeholder="Search Order ID / Vehicle No / Customer / Vendor…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            {/* Aging Filter */}
            <select
              value={agingFilter}
              onChange={(e) => setAgingFilter(e.target.value)}
              className="px-4 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="all">All Aging</option>
              <option value="0-30">0-30 min</option>
              <option value="30-60">30-60 min</option>
              <option value="60+">60+ min</option>
            </select>

            {/* Risk Filter */}
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-4 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="all">All Risk Levels</option>
              <option value="high">High Risk</option>
              <option value="normal">Normal</option>
            </select>

            {/* Assigned Filter */}
            <select
              value={assignedFilter}
              onChange={(e) => setAssignedFilter(e.target.value)}
              className="px-4 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="all">All Tasks</option>
              <option value="me">Assigned to Me</option>
            </select>
          </div>
        </div>
      </div>

      {/* Queue Summary Cards */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-5 gap-4 max-w-7xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Pending</p>
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-3xl text-gray-900">24</p>
            <p className="text-xs text-gray-500 mt-1">Across all queues</p>
          </div>

          <div className="bg-white rounded-xl border border-red-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">High Priority</p>
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-3xl text-red-700">8</p>
            <p className="text-xs text-gray-500 mt-1">Need immediate attention</p>
          </div>

          <div className="bg-white rounded-xl border border-orange-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">SLA Breached</p>
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-3xl text-orange-700">3</p>
            <p className="text-xs text-gray-500 mt-1">Over 60 min wait</p>
          </div>

          <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Assigned to Me</p>
              <User className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl text-blue-700">5</p>
            <p className="text-xs text-gray-500 mt-1">In your queue</p>
          </div>

          <div className="bg-white rounded-xl border border-purple-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">AI High-Risk Flags</p>
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl text-purple-700">6</p>
            <p className="text-xs text-gray-500 mt-1">Flagged by AI</p>
          </div>
        </div>
      </div>

      {/* Task Table */}
      <div className="flex-1 overflow-auto px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'kyc' && <KYCQueueTable tasks={kycTasks} onOpen={handleOpenTask} />}
          {activeTab === 'advance' && <AdvanceQueueTable tasks={advanceTasks} onOpen={handleOpenTask} />}
          {activeTab === 'settlement' && <SettlementQueueTable tasks={settlementTasks} onOpen={handleOpenTask} />}
        </div>
      </div>
    </div>
  );
}

// KYC Queue Table
function KYCQueueTable({ tasks, onOpen }: { tasks: QueueTask[]; onOpen: (orderId: string) => void }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs text-gray-600">Priority</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">Order ID</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">Vehicle Number</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">Vendor Name</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">Customer Name</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">Issues Flagged</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">AI Risk Level</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">Queue Time</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-4">
                <PriorityChip priority={task.priority} />
              </td>
              <td className="px-4 py-4">
                <p className="text-sm text-gray-900">{task.orderId}</p>
              </td>
              <td className="px-4 py-4">
                <p className="text-sm text-gray-900">{task.vehicleNumber}</p>
              </td>
              <td className="px-4 py-4">
                <p className="text-sm text-gray-900">{task.vendorName}</p>
              </td>
              <td className="px-4 py-4">
                <p className="text-sm text-gray-900">{task.customerName}</p>
              </td>
              <td className="px-4 py-4">
                <p className="text-sm text-red-700">{task.issuesFlagged}</p>
              </td>
              <td className="px-4 py-4">
                <RiskLevelChip level={task.aiRiskLevel} />
              </td>
              <td className="px-4 py-4">
                <p className="text-sm text-gray-700">{task.queueTime}</p>
              </td>
              <td className="px-4 py-4">
                <button
                  onClick={() => onOpen(task.orderId)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Open
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Advance Docs Queue Table
function AdvanceQueueTable({ tasks, onOpen }: { tasks: QueueTask[]; onOpen: (orderId: string) => void }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs text-gray-600">Priority</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">Order ID</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">Vehicle Number</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">Vendor Name</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">Customer Name</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">AI Cross-Check Status</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">Docs Missing</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">AI Risk Level</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">Queue Time</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-4">
                <PriorityChip priority={task.priority} />
              </td>
              <td className="px-4 py-4">
                <p className="text-sm text-gray-900">{task.orderId}</p>
              </td>
              <td className="px-4 py-4">
                <p className="text-sm text-gray-900">{task.vehicleNumber}</p>
              </td>
              <td className="px-4 py-4">
                <p className="text-sm text-gray-900">{task.vendorName}</p>
              </td>
              <td className="px-4 py-4">
                <p className="text-sm text-gray-900">{task.customerName}</p>
              </td>
              <td className="px-4 py-4">
                <p className="text-sm text-orange-700">{task.aiCrossCheckStatus}</p>
              </td>
              <td className="px-4 py-4">
                <p className="text-sm text-red-700">{task.docsMissing || '—'}</p>
              </td>
              <td className="px-4 py-4">
                <RiskLevelChip level={task.aiRiskLevel} />
              </td>
              <td className="px-4 py-4">
                <p className="text-sm text-gray-700">{task.queueTime}</p>
              </td>
              <td className="px-4 py-4">
                <button
                  onClick={() => onOpen(task.orderId)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Open
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Settlement Queue Table
function SettlementQueueTable({ tasks, onOpen }: { tasks: QueueTask[]; onOpen: (orderId: string) => void }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs text-gray-600">Priority</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">Order ID</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">Vehicle Number</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">Customer</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">Flags</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">AI Confidence</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">Net Payable</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">Net Billable</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">Queue Time</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-4">
                <PriorityChip priority={task.priority} />
              </td>
              <td className="px-4 py-4">
                <p className="text-sm text-gray-900">{task.orderId}</p>
              </td>
              <td className="px-4 py-4">
                <p className="text-sm text-gray-900">{task.vehicleNumber}</p>
              </td>
              <td className="px-4 py-4">
                <p className="text-sm text-gray-900">{task.customerName}</p>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-1">
                  {task.shortageFlag && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs border border-red-300">
                      Shortage
                    </span>
                  )}
                  {task.damageFlag && (
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs border border-orange-300">
                      Damage
                    </span>
                  )}
                  {task.delayFlag && (
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs border border-yellow-300">
                      Delay
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-4">
                <p className="text-sm text-indigo-700">{task.aiConfidence}%</p>
              </td>
              <td className="px-4 py-4">
                <p className="text-sm text-gray-900">{task.netPayable}</p>
              </td>
              <td className="px-4 py-4">
                <p className="text-sm text-green-700">{task.netBillable}</p>
              </td>
              <td className="px-4 py-4">
                <p className="text-sm text-gray-700">{task.queueTime}</p>
              </td>
              <td className="px-4 py-4">
                <button
                  onClick={() => onOpen(task.orderId)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Open
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Priority Chip Component
function PriorityChip({ priority }: { priority: 'high' | 'medium' | 'low' }) {
  const config = {
    high: 'bg-red-100 text-red-700 border-red-300',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    low: 'bg-gray-100 text-gray-700 border-gray-300',
  };

  return (
    <span className={`px-3 py-1 rounded-lg text-xs border ${config[priority]} capitalize`}>
      {priority}
    </span>
  );
}

// Risk Level Chip Component
function RiskLevelChip({ level }: { level: 'high' | 'medium' | 'low' }) {
  const config = {
    high: 'bg-red-100 text-red-700 border-red-300',
    medium: 'bg-orange-100 text-orange-700 border-orange-300',
    low: 'bg-green-100 text-green-700 border-green-300',
  };

  return (
    <span className={`px-3 py-1 rounded-lg text-xs border ${config[level]} capitalize`}>
      {level} Risk
    </span>
  );
}
