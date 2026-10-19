import { useState } from 'react';
import { 
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Package,
  Truck,
  FileText,
  Sparkles,
  Target,
  RefreshCw,
  Download,
  Eye,
  Activity
} from 'lucide-react';

interface OpsOrderSearchProps {
  onProceedToKYC: (orderId: string) => void;
  onProceedToAdvanceUpload: (orderId: string) => void;
  onProceedToSettlement?: (orderId: string) => void;
  orderStatuses?: { [key: string]: Order['status'] };
}

interface Order {
  id: string;
  vehicleNumber: string;
  customer: string;
  source: string;
  destination: string;
  status: 'vehicle-arrived' | 'loading-in-progress' | 'vehicle-in-transit' | 'vehicle-arrived-unloading';
  aiReadinessScore: number;
  vehicleKYCStatus: 'pending' | 'completed';
  advanceDocsStatus: 'pending' | 'uploaded';
  settlementDocsStatus?: 'pending' | 'uploaded';
  orderValue: string;
  loadingBay: string;
}

const mockOrders: Order[] = [
  {
    id: 'ORD-2024-001',
    vehicleNumber: 'MH-12-AB-1234',
    customer: 'Reliance Industries',
    source: 'Mumbai',
    destination: 'Delhi',
    status: 'vehicle-arrived',
    aiReadinessScore: 45,
    vehicleKYCStatus: 'pending',
    advanceDocsStatus: 'pending',
    orderValue: '₹4,85,000',
    loadingBay: 'Bay 3',
  },
  {
    id: 'ORD-2024-002',
    vehicleNumber: 'GJ-05-CD-5678',
    customer: 'Tata Steel',
    source: 'Jamshedpur',
    destination: 'Pune',
    status: 'loading-in-progress',
    aiReadinessScore: 75,
    vehicleKYCStatus: 'completed',
    advanceDocsStatus: 'pending',
    orderValue: '₹6,20,000',
    loadingBay: 'Bay 1',
  },
  {
    id: 'ORD-2024-003',
    vehicleNumber: 'KA-09-EF-9012',
    customer: 'Amazon Logistics',
    source: 'Bangalore',
    destination: 'Hyderabad',
    status: 'vehicle-in-transit',
    aiReadinessScore: 92,
    vehicleKYCStatus: 'completed',
    advanceDocsStatus: 'uploaded',
    orderValue: '₹3,45,000',
    loadingBay: 'Bay 5',
  },
  {
    id: 'ORD-2024-004',
    vehicleNumber: 'MH-12-GH-3456',
    customer: 'Mahindra & Mahindra',
    source: 'Chennai',
    destination: 'Kolkata',
    status: 'vehicle-arrived',
    aiReadinessScore: 38,
    vehicleKYCStatus: 'pending',
    advanceDocsStatus: 'pending',
    orderValue: '₹5,75,000',
    loadingBay: 'Bay 2',
  },
  {
    id: 'ORD-2024-005',
    vehicleNumber: 'DL-10-IJ-7890',
    customer: 'ITC Limited',
    source: 'Kolkata',
    destination: 'Mumbai',
    status: 'loading-in-progress',
    aiReadinessScore: 88,
    vehicleKYCStatus: 'completed',
    advanceDocsStatus: 'uploaded',
    orderValue: '₹4,20,000',
    loadingBay: 'Bay 4',
  },
  {
    id: 'ORD-2024-006',
    vehicleNumber: 'TN-22-KL-2345',
    customer: 'Hindustan Unilever',
    source: 'Mumbai',
    destination: 'Ahmedabad',
    status: 'vehicle-arrived-unloading',
    aiReadinessScore: 65,
    vehicleKYCStatus: 'completed',
    advanceDocsStatus: 'pending',
    orderValue: '₹2,95,000',
    loadingBay: 'Bay 6',
  },
];

export function OpsOrderSearch({ onProceedToKYC, onProceedToAdvanceUpload, onProceedToSettlement, orderStatuses }: OpsOrderSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Merge external order statuses if provided
  const orders = mockOrders.map(order => ({
    ...order,
    status: orderStatuses?.[order.id] || order.status,
  }));

  const filters = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'vehicle-arrived', label: 'Vehicle at Loading', count: orders.filter(o => o.status === 'vehicle-arrived').length },
    { id: 'loading-in-progress', label: 'Loading In Progress', count: orders.filter(o => o.status === 'loading-in-progress').length },
    { id: 'vehicle-in-transit', label: 'Vehicle in Transit', count: orders.filter(o => o.status === 'vehicle-in-transit').length },
    { id: 'vehicle-arrived-unloading', label: 'Vehicle Arrived Unloading', count: orders.filter(o => o.status === 'vehicle-arrived-unloading').length },
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || order.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusConfig = (status: string) => {
    const configs = {
      'vehicle-arrived': {
        label: 'Vehicle Arrived at Loading',
        color: 'text-blue-700',
        bg: 'bg-blue-100',
        border: 'border-blue-300',
        icon: Truck,
      },
      'loading-in-progress': {
        label: 'Loading In Progress',
        color: 'text-purple-700',
        bg: 'bg-purple-100',
        border: 'border-purple-300',
        icon: Clock,
      },
      'vehicle-in-transit': {
        label: 'Vehicle In-Transit',
        color: 'text-indigo-700',
        bg: 'bg-indigo-100',
        border: 'border-indigo-300',
        icon: Truck,
      },
      'vehicle-arrived-unloading': {
        label: 'Vehicle Arrived at Unloading',
        color: 'text-green-700',
        bg: 'bg-green-100',
        border: 'border-green-300',
        icon: Package,
      },
    };
    return configs[status as keyof typeof configs] || configs['vehicle-arrived'];
  };

  const getReadinessColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-green-500', text: 'text-green-700', label: 'Ready' };
    if (score >= 50) return { bg: 'bg-yellow-500', text: 'text-yellow-700', label: 'Needs Docs' };
    return { bg: 'bg-red-500', text: 'text-red-700', label: 'Blocked' };
  };

  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order.id === selectedOrder?.id ? null : order);
  };

  const statsCards = [
    {
      icon: Package,
      label: 'Total Orders',
      value: orders.length.toString(),
      color: 'blue',
    },
    {
      icon: Truck,
      label: 'At Loading',
      value: orders.filter(o => o.status === 'vehicle-arrived').length.toString(),
      color: 'green',
    },
    {
      icon: Clock,
      label: 'In Progress',
      value: orders.filter(o => o.status === 'loading-in-progress').length.toString(),
      color: 'purple',
    },
    {
      icon: Activity,
      label: 'In-Transit',
      value: orders.filter(o => o.status === 'vehicle-in-transit').length.toString(),
      color: 'indigo',
    },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm px-8 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-gray-900">Order Search & Selection</h1>
            <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Search orders by vehicle number or order ID when vehicle arrives at loading
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Vehicle Number / Order ID / Customer Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-3 mb-6">
          <Filter className="w-4 h-4 text-gray-500" />
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeFilter === filter.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'
              }`}
            >
              {filter.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeFilter === filter.id
                  ? 'bg-blue-700'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          {statsCards.map((stat, idx) => {
            const Icon = stat.icon;
            const colorStyles = {
              blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-600',
              green: 'from-green-50 to-green-100 border-green-200 text-green-600',
              purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-600',
              indigo: 'from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-600',
            };
            return (
              <div key={idx} className={`bg-gradient-to-br ${colorStyles[stat.color as keyof typeof colorStyles]} rounded-xl p-4 border`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${stat.color === 'blue' ? 'text-blue-700' : stat.color === 'green' ? 'text-green-700' : stat.color === 'purple' ? 'text-purple-700' : 'text-indigo-700'} mb-1`}>
                      {stat.label}
                    </p>
                    <p className={`text-2xl ${stat.color === 'blue' ? 'text-blue-900' : stat.color === 'green' ? 'text-green-900' : stat.color === 'purple' ? 'text-purple-900' : 'text-indigo-900'}`}>
                      {stat.value}
                    </p>
                  </div>
                  <Icon className={`w-8 h-8`} />
                </div>
              </div>
            );
          })}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{filteredOrders.length}</span> orders
              </p>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
                <button className="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Vehicle Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Customer Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Current Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">
                    AI Readiness
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const statusConfig = getStatusConfig(order.status);
                  const readinessColor = getReadinessColor(order.aiReadinessScore);
                  const StatusIcon = statusConfig.icon;
                  const isSelected = selectedOrder?.id === order.id;

                  return (
                    <tr 
                      key={order.id}
                      onClick={() => handleOrderSelect(order)}
                      className={`transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 border-l-4 border-l-blue-600'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-1 h-8 rounded-full ${
                            order.aiReadinessScore >= 80 ? 'bg-green-500' :
                            order.aiReadinessScore >= 50 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}></div>
                          <div>
                            <p className="text-gray-900">{order.id}</p>
                            <p className="text-xs text-gray-500">Bay {order.loadingBay}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900 font-mono">{order.vehicleNumber}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div>
                          <p className="text-gray-900">{order.customer}</p>
                          <p className="text-xs text-gray-500">{order.orderValue}</p>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <span>{order.source}</span>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                          <span>{order.destination}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${statusConfig.bg} border ${statusConfig.border}`}>
                            <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                            <span className={`text-sm ${statusConfig.color}`}>{statusConfig.label}</span>
                          </div>
                          
                          {/* AI Indicators */}
                          <div className="flex flex-col gap-1">
                            {order.vehicleKYCStatus === 'pending' && (
                              <div className="flex items-center gap-1.5 text-xs text-red-700">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Vehicle KYC Pending</span>
                              </div>
                            )}
                            {order.advanceDocsStatus === 'pending' && (
                              <div className="flex items-center gap-1.5 text-xs text-yellow-700">
                                <FileText className="w-3 h-3" />
                                <span>Advance Docs Not Uploaded</span>
                              </div>
                            )}
                            {order.vehicleKYCStatus === 'completed' && order.advanceDocsStatus === 'uploaded' && (
                              <div className="flex items-center gap-1.5 text-xs text-green-700">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>All Docs Complete</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${readinessColor.bg} transition-all`}
                                style={{ width: `${order.aiReadinessScore}%` }}
                              ></div>
                            </div>
                            <span className={`text-sm ${readinessColor.text} font-medium min-w-[3rem]`}>
                              {order.aiReadinessScore}%
                            </span>
                          </div>
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border ${
                            order.aiReadinessScore >= 80
                              ? 'bg-green-50 text-green-700 border-green-300'
                              : order.aiReadinessScore >= 50
                              ? 'bg-yellow-50 text-yellow-700 border-yellow-300'
                              : 'bg-red-50 text-red-700 border-red-300'
                          }`}>
                            <Target className="w-3 h-3" />
                            {readinessColor.label}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <button 
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2 shadow-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOrderSelect(order);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                          Open for Upload
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-900 mb-1">No orders found</h3>
              <p className="text-sm text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Floating CTA - Appears when order is selected */}
      {selectedOrder && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className={`${
            selectedOrder.status === 'vehicle-arrived' 
              ? 'bg-gradient-to-r from-blue-600 to-blue-600' 
              : selectedOrder.status === 'loading-in-progress'
              ? 'bg-gradient-to-r from-purple-600 to-violet-600'
              : selectedOrder.status === 'vehicle-in-transit'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-600'
              : 'bg-gradient-to-r from-green-600 to-emerald-600'
          } text-white rounded-2xl shadow-2xl ${
            selectedOrder.status === 'vehicle-arrived' 
              ? 'shadow-blue-500/50' 
              : selectedOrder.status === 'loading-in-progress'
              ? 'shadow-purple-500/50'
              : selectedOrder.status === 'vehicle-in-transit'
              ? 'shadow-indigo-500/50'
              : 'shadow-green-500/50'
          } border-2 ${
            selectedOrder.status === 'vehicle-arrived' 
              ? 'border-blue-400' 
              : selectedOrder.status === 'loading-in-progress'
              ? 'border-purple-400'
              : selectedOrder.status === 'vehicle-in-transit'
              ? 'border-indigo-400'
              : 'border-green-400'
          }`}>
            <div className="px-8 py-5">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className={`text-sm ${
                      selectedOrder.status === 'vehicle-arrived' 
                        ? 'text-blue-100' 
                        : selectedOrder.status === 'loading-in-progress'
                        ? 'text-purple-100'
                        : selectedOrder.status === 'vehicle-in-transit'
                        ? 'text-indigo-100'
                        : 'text-green-100'
                    } mb-0.5`}>Selected Order</p>
                    <p className="text-lg font-medium">{selectedOrder.id} - {selectedOrder.vehicleNumber}</p>
                  </div>
                </div>

                <div className="h-12 w-px bg-white/30"></div>

                {selectedOrder.status === 'vehicle-arrived' && (
                  <button
                    onClick={() => onProceedToKYC(selectedOrder.id)}
                    className="px-6 py-3 bg-white text-blue-700 rounded-xl hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg"
                  >
                    <span className="font-medium">Proceed to Vehicle & Driver KYC</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}

                {selectedOrder.status === 'loading-in-progress' && (
                  <button
                    onClick={() => onProceedToAdvanceUpload(selectedOrder.id)}
                    className="px-6 py-3 bg-white text-purple-700 rounded-xl hover:bg-purple-50 transition-all flex items-center gap-2 shadow-lg"
                  >
                    <span className="font-medium">Proceed to Loading Doc Upload</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}

                {selectedOrder.status === 'vehicle-in-transit' && (
                  <button
                    onClick={() => console.log('Track vehicle')}
                    className="px-6 py-3 bg-white text-indigo-700 rounded-xl hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-lg"
                  >
                    <span className="font-medium">Track Vehicle in Transit</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}

                {selectedOrder.status === 'vehicle-arrived-unloading' && (
                  <button
                    onClick={() => onProceedToSettlement?.(selectedOrder.id)}
                    className="px-6 py-3 bg-white text-green-700 rounded-xl hover:bg-green-50 transition-all flex items-center gap-2 shadow-lg"
                  >
                    <span className="font-medium">Proceed to POD & Settlement</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}