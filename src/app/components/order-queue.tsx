import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  TrendingUp,
  ArrowRight,
  Sparkles,
  FileText,
  History
} from 'lucide-react';

interface Order {
  id: string;
  customer: string;
  source: string;
  destination: string;
  vehicleType: string;
  loadingDate: string;
  stage: 'Ops Upload' | 'DAVT ADV' | 'DAVT FS';
  completeness: number;
  aiRisk: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Blocked';
  aiAlerts: string[];
}

const mockOrders: Order[] = [
  {
    id: 'ORD-2024-001',
    customer: 'Reliance Industries',
    source: 'Mumbai',
    destination: 'Delhi',
    vehicleType: '32T Container',
    loadingDate: '2024-12-15',
    stage: 'Ops Upload',
    completeness: 100,
    aiRisk: 'Low',
    status: 'Pending',
    aiAlerts: [],
  },
  {
    id: 'ORD-2024-002',
    customer: 'Tata Steel',
    source: 'Jamshedpur',
    destination: 'Pune',
    vehicleType: '20T Flatbed',
    loadingDate: '2024-12-14',
    stage: 'Ops Upload',
    completeness: 65,
    aiRisk: 'Medium',
    status: 'In Progress',
    aiAlerts: ['Vehicle docs missing', 'E-way Bill expiry risk'],
  },
  {
    id: 'ORD-2024-003',
    customer: 'Amazon Logistics',
    source: 'Bangalore',
    destination: 'Hyderabad',
    vehicleType: '14T Truck',
    loadingDate: '2024-12-13',
    stage: 'DAVT ADV',
    completeness: 45,
    aiRisk: 'High',
    status: 'Blocked',
    aiAlerts: ['High mismatch probability', 'Insurance expired'],
  },
  {
    id: 'ORD-2024-004',
    customer: 'Mahindra & Mahindra',
    source: 'Chennai',
    destination: 'Kolkata',
    vehicleType: '25T Trailer',
    loadingDate: '2024-12-16',
    stage: 'Ops Upload',
    completeness: 85,
    aiRisk: 'Low',
    status: 'In Progress',
    aiAlerts: ['PUC certificate pending'],
  },
  {
    id: 'ORD-2024-005',
    customer: 'ITC Limited',
    source: 'Kolkata',
    destination: 'Mumbai',
    vehicleType: '18T Container',
    loadingDate: '2024-12-17',
    stage: 'DAVT FS',
    completeness: 92,
    aiRisk: 'Medium',
    status: 'In Progress',
    aiAlerts: ['Driver license near expiry'],
  },
  {
    id: 'ORD-2024-006',
    customer: 'Hindustan Unilever',
    source: 'Mumbai',
    destination: 'Ahmedabad',
    vehicleType: '12T Truck',
    loadingDate: '2024-12-15',
    stage: 'Ops Upload',
    completeness: 100,
    aiRisk: 'Low',
    status: 'Pending',
    aiAlerts: [],
  },
];

interface OrderQueueProps {
  onStartUpload: (orderId: string) => void;
  onStartAdvanceUpload: (orderId: string) => void;
  onStartFinalSettlement: (orderId: string) => void;
}

export function OrderQueue({ onStartUpload, onStartAdvanceUpload, onStartFinalSettlement }: OrderQueueProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (order: Order) => {
    if (order.status === 'Blocked') return 'red';
    if (order.completeness === 100 && order.aiRisk === 'Low') return 'green';
    return 'yellow';
  };

  const getStatusStyles = (color: string) => {
    const styles = {
      green: 'bg-green-50 border-green-200',
      yellow: 'bg-yellow-50 border-yellow-200',
      red: 'bg-red-50 border-red-200',
    };
    return styles[color as keyof typeof styles];
  };

  const getRiskBadgeStyles = (risk: string) => {
    const styles = {
      Low: 'bg-green-100 text-green-700 border border-green-200',
      Medium: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
      High: 'bg-red-100 text-red-700 border border-red-200',
    };
    return styles[risk as keyof typeof styles];
  };

  const getStatusBadgeStyles = (status: string) => {
    const styles = {
      Pending: 'bg-gray-100 text-gray-700',
      'In Progress': 'bg-blue-100 text-blue-700',
      Blocked: 'bg-red-100 text-red-700',
    };
    return styles[status as keyof typeof styles];
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-gray-900 mb-1">Order Queue</h1>
            <p className="text-sm text-gray-500">
              Monitor and manage transportation orders with AI-powered insights
            </p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 mb-1">Total Orders</p>
                <p className="text-2xl text-blue-900">{mockOrders.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 mb-1">Clean Orders</p>
                <p className="text-2xl text-green-900">
                  {mockOrders.filter(o => o.completeness === 100 && o.aiRisk === 'Low').length}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 mb-1">Needs Attention</p>
                <p className="text-2xl text-yellow-900">
                  {mockOrders.filter(o => o.status === 'In Progress').length}
                </p>
              </div>
              <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 mb-1">Blocked</p>
                <p className="text-2xl text-red-900">
                  {mockOrders.filter(o => o.status === 'Blocked').length}
                </p>
              </div>
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order ID or Customer Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Blocked">Blocked</option>
          </select>

          <button className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </header>

      {/* Orders Table */}
      <div className="flex-1 overflow-auto px-8 py-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Vehicle Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Loading Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Completeness
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">
                    AI Risk
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const statusColor = getStatusColor(order);
                  
                  return (
                    <tr 
                      key={order.id} 
                      className={`transition-colors hover:bg-gray-50 ${getStatusStyles(statusColor)}`}
                    >
                      <td className="px-6 py-4">
                        <span className="text-gray-900">{order.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-900">{order.customer}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <span>{order.source}</span>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                          <span>{order.destination}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700">{order.vehicleType}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700">{order.loadingDate}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-md text-sm">
                          {order.stage}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all ${
                                order.completeness === 100 
                                  ? 'bg-green-500' 
                                  : order.completeness >= 70 
                                  ? 'bg-blue-500' 
                                  : 'bg-yellow-500'
                              }`}
                              style={{ width: `${order.completeness}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-700 w-10">{order.completeness}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-sm flex items-center gap-1.5 w-fit ${getRiskBadgeStyles(order.aiRisk)}`}>
                          <Sparkles className="w-3.5 h-3.5" />
                          {order.aiRisk}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-sm ${getStatusBadgeStyles(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (order.stage === 'Ops Upload') {
                                onStartUpload(order.id);
                              } else if (order.stage === 'DAVT ADV') {
                                onStartAdvanceUpload(order.id);
                              } else {
                                onStartFinalSettlement(order.id);
                              }
                            }}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            {order.status === 'Pending' ? 'Start Upload' : 'Open Case'}
                          </button>
                          <button className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors">
                            <History className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Alerts Section */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {filteredOrders
            .filter(order => order.aiAlerts.length > 0)
            .slice(0, 3)
            .map((order) => (
              <div 
                key={order.id}
                className="bg-white border border-amber-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-sm text-gray-900">{order.id}</p>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">
                        AI Alert
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {order.aiAlerts.map((alert, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                          {alert}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}