import { useState } from 'react';
import { 
  ArrowLeft, 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap,
  Brain,
  BarChart3,
  Target,
  AlertCircle,
  Shield,
  Package,
  Truck,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Activity,
  Percent,
  Users,
  MapPin
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface AIProcessIntelligenceProps {
  onBack: () => void;
}

export function AIProcessIntelligence({ onBack }: AIProcessIntelligenceProps) {
  const [timeRange, setTimeRange] = useState('7days');

  // SLA Risk Data
  const slaRiskData = [
    { name: 'Mon', atRisk: 12, onTrack: 45, breached: 3 },
    { name: 'Tue', atRisk: 15, onTrack: 42, breached: 5 },
    { name: 'Wed', atRisk: 18, onTrack: 38, breached: 4 },
    { name: 'Thu', atRisk: 14, onTrack: 43, breached: 6 },
    { name: 'Fri', atRisk: 20, onTrack: 35, breached: 8 },
    { name: 'Sat', atRisk: 16, onTrack: 40, breached: 4 },
    { name: 'Sun', atRisk: 11, onTrack: 48, breached: 2 },
  ];

  // Auto-Approval Trend
  const autoApprovalData = [
    { month: 'Jun', rate: 68, manual: 32 },
    { month: 'Jul', rate: 72, manual: 28 },
    { month: 'Aug', rate: 75, manual: 25 },
    { month: 'Sep', rate: 78, manual: 22 },
    { month: 'Oct', rate: 82, manual: 18 },
    { month: 'Nov', rate: 85, manual: 15 },
    { month: 'Dec', rate: 87, manual: 13 },
  ];

  // Vendor Error Trends
  const vendorErrorData = [
    { vendor: 'Transport Solutions', doc_errors: 12, validation_errors: 8, compliance_errors: 5 },
    { vendor: 'QuickLogistics', doc_errors: 8, validation_errors: 15, compliance_errors: 3 },
    { vendor: 'FastFreight Co', doc_errors: 18, validation_errors: 6, compliance_errors: 9 },
    { vendor: 'Express Movers', doc_errors: 5, validation_errors: 4, compliance_errors: 2 },
    { vendor: 'Prime Carriers', doc_errors: 14, validation_errors: 11, compliance_errors: 7 },
  ];

  // Stage-wise Processing Time
  const processingTimeData = [
    { stage: 'OPS Stage 1', avg: 2.4, target: 3.0 },
    { stage: 'OPS Stage 2', avg: 4.2, target: 5.0 },
    { stage: 'OPS Stage 3', avg: 3.8, target: 4.0 },
    { stage: 'DAVT Stage 1', avg: 1.8, target: 2.0 },
    { stage: 'DAVT Stage 2', avg: 2.1, target: 2.5 },
    { stage: 'DAVT Final', avg: 3.2, target: 4.0 },
  ];

  // Exception Distribution
  const exceptionData = [
    { name: 'Document Errors', value: 35, color: '#8b5cf6' },
    { name: 'Validation Issues', value: 28, color: '#3b82f6' },
    { name: 'Compliance Failures', value: 22, color: '#f59e0b' },
    { name: 'Financial Blocks', value: 15, color: '#ef4444' },
  ];

  // Lane-wise Shortage Prediction (Heatmap Data)
  const lanes = ['Mumbai-Delhi', 'Pune-Chennai', 'Bangalore-Hyderabad', 'Delhi-Jaipur', 'Chennai-Kolkata'];
  const shortageRiskLevels = [
    { lane: 'Mumbai-Delhi', risk: 85, avg_shortage: '2.3%', predicted: 'High' },
    { lane: 'Pune-Chennai', risk: 45, avg_shortage: '1.1%', predicted: 'Medium' },
    { lane: 'Bangalore-Hyderabad', risk: 25, avg_shortage: '0.6%', predicted: 'Low' },
    { lane: 'Delhi-Jaipur', risk: 70, avg_shortage: '1.8%', predicted: 'High' },
    { lane: 'Chennai-Kolkata', risk: 55, avg_shortage: '1.4%', predicted: 'Medium' },
  ];

  // Predictive Alerts
  const predictiveAlerts = [
    {
      id: 1,
      severity: 'high',
      title: 'SLA Breach Risk - Mumbai Lane',
      prediction: '12 orders at risk of SLA breach in next 6 hours',
      confidence: 92,
      action: 'Expedite processing',
    },
    {
      id: 2,
      severity: 'medium',
      title: 'Vendor Error Spike - FastFreight Co',
      prediction: 'Document errors up 34% this week - likely to continue',
      confidence: 87,
      action: 'Schedule vendor training',
    },
    {
      id: 3,
      severity: 'high',
      title: 'Shortage Pattern Detected',
      prediction: 'Mumbai-Delhi lane showing 85% shortage probability',
      confidence: 95,
      action: 'Increase inspection frequency',
    },
    {
      id: 4,
      severity: 'low',
      title: 'Peak Load Forecast',
      prediction: 'Expected 45% volume increase next Monday',
      confidence: 78,
      action: 'Resource allocation recommended',
    },
  ];

  const totalOrders = 487;
  const autoApproved = 424;
  const manualReview = 63;
  const autoApprovalRate = ((autoApproved / totalOrders) * 100).toFixed(1);
  const manualInterventionRate = ((manualReview / totalOrders) * 100).toFixed(1);
  const slaAtRisk = 16;
  const avgProcessingTime = 17.5;

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
              <h1 className="text-gray-900">AI Process Intelligence Dashboard</h1>
              <div className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" />
                Predictive Analytics
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Real-time insights, trends & predictions for DAVT automation system
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="24hours">Last 24 Hours</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
            <button className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-6 gap-4">
          <MetricCard
            icon={Zap}
            label="Auto-Approval Rate"
            value={`${autoApprovalRate}%`}
            trend="up"
            trendValue="+5.2%"
            color="green"
          />
          <MetricCard
            icon={Users}
            label="Manual Intervention"
            value={`${manualInterventionRate}%`}
            trend="down"
            trendValue="-3.8%"
            color="blue"
          />
          <MetricCard
            icon={AlertTriangle}
            label="SLA At Risk"
            value={slaAtRisk.toString()}
            trend="up"
            trendValue="+2"
            color="red"
          />
          <MetricCard
            icon={Clock}
            label="Avg Processing"
            value={`${avgProcessingTime}h`}
            trend="down"
            trendValue="-1.2h"
            color="purple"
          />
          <MetricCard
            icon={CheckCircle2}
            label="AI Accuracy"
            value="94.8%"
            trend="up"
            trendValue="+2.1%"
            color="green"
          />
          <MetricCard
            icon={Activity}
            label="Throughput"
            value={totalOrders.toString()}
            trend="up"
            trendValue="+12%"
            color="indigo"
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="grid grid-cols-12 gap-6">
          {/* SLA Risk Monitoring */}
          <div className="col-span-8 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-red-600" />
                  <h2 className="text-gray-900">SLA Risk Monitoring</h2>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span className="text-gray-600">On Track</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                      <span className="text-gray-600">At Risk</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span className="text-gray-600">Breached</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={slaRiskData}>
                  <defs>
                    <linearGradient id="colorOnTrack" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorAtRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorBreached" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="onTrack" stackId="1" stroke="#10b981" fillOpacity={1} fill="url(#colorOnTrack)" />
                  <Area type="monotone" dataKey="atRisk" stackId="1" stroke="#f59e0b" fillOpacity={1} fill="url(#colorAtRisk)" />
                  <Area type="monotone" dataKey="breached" stackId="1" stroke="#ef4444" fillOpacity={1} fill="url(#colorBreached)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Exception Distribution */}
          <div className="col-span-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-purple-600" />
                <h2 className="text-gray-900">Exception Distribution</h2>
              </div>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={exceptionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {exceptionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Auto-Approval Rate Trend */}
          <div className="col-span-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-600" />
                <h2 className="text-gray-900">Auto-Approval Rate & Manual Intervention</h2>
              </div>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={autoApprovalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} name="Auto-Approval %" dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="manual" stroke="#ef4444" strokeWidth={3} name="Manual Intervention %" dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stage-wise Processing Time */}
          <div className="col-span-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <h2 className="text-gray-900">Stage-wise Processing Time (hours)</h2>
              </div>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={processingTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="stage" stroke="#6b7280" style={{ fontSize: '11px' }} angle={-15} textAnchor="end" height={80} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avg" fill="#3b82f6" name="Avg Time" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="target" fill="#e5e7eb" name="Target" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Vendor Error Trends */}
          <div className="col-span-12 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-orange-600" />
                <h2 className="text-gray-900">Vendor Error Trends</h2>
              </div>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={vendorErrorData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="vendor" stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="doc_errors" fill="#8b5cf6" name="Document Errors" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="validation_errors" fill="#3b82f6" name="Validation Errors" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="compliance_errors" fill="#f59e0b" name="Compliance Errors" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Lane-wise Shortage Prediction Heatmap */}
          <div className="col-span-7 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-600" />
                <h2 className="text-gray-900">Lane-wise Shortage Prediction</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {shortageRiskLevels.map((lane, idx) => (
                  <ShortageHeatmapRow key={idx} lane={lane} />
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between text-xs text-gray-600 px-2">
                <span>Low Risk</span>
                <div className="flex items-center gap-1">
                  <div className="w-8 h-4 bg-green-200 rounded"></div>
                  <div className="w-8 h-4 bg-yellow-200 rounded"></div>
                  <div className="w-8 h-4 bg-orange-200 rounded"></div>
                  <div className="w-8 h-4 bg-red-200 rounded"></div>
                  <div className="w-8 h-4 bg-red-500 rounded"></div>
                </div>
                <span>High Risk</span>
              </div>
            </div>
          </div>

          {/* Predictive Alerts */}
          <div className="col-span-5 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-600" />
                <h2 className="text-gray-900">Predictive Alerts</h2>
              </div>
            </div>
            <div className="p-6 space-y-3 max-h-96 overflow-auto">
              {predictiveAlerts.map((alert) => (
                <PredictiveAlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
interface MetricCardProps {
  icon: any;
  label: string;
  value: string;
  trend: 'up' | 'down';
  trendValue: string;
  color: 'green' | 'blue' | 'red' | 'purple' | 'indigo';
}

function MetricCard({ icon: Icon, label, value, trend, trendValue, color }: MetricCardProps) {
  const colorStyles = {
    green: 'from-green-50 to-green-100 border-green-200',
    blue: 'from-blue-50 to-blue-100 border-blue-200',
    red: 'from-red-50 to-red-100 border-red-200',
    purple: 'from-purple-50 to-purple-100 border-purple-200',
    indigo: 'from-indigo-50 to-indigo-100 border-indigo-200',
  };

  const iconColors = {
    green: 'text-green-600',
    blue: 'text-blue-600',
    red: 'text-red-600',
    purple: 'text-purple-600',
    indigo: 'text-indigo-600',
  };

  const textColors = {
    green: 'text-green-900',
    blue: 'text-blue-900',
    red: 'text-red-900',
    purple: 'text-purple-900',
    indigo: 'text-indigo-900',
  };

  return (
    <div className={`bg-gradient-to-br ${colorStyles[color]} rounded-xl p-4 border`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className={`w-6 h-6 ${iconColors[color]}`} />
        <div className={`flex items-center gap-1 text-xs ${trend === 'up' ? 'text-green-700' : 'text-red-700'}`}>
          {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{trendValue}</span>
        </div>
      </div>
      <p className={`text-sm ${iconColors[color]} mb-1`}>{label}</p>
      <p className={`text-2xl ${textColors[color]}`}>{value}</p>
    </div>
  );
}

// Shortage Heatmap Row Component
interface ShortageHeatmapRowProps {
  lane: {
    lane: string;
    risk: number;
    avg_shortage: string;
    predicted: string;
  };
}

function ShortageHeatmapRow({ lane }: ShortageHeatmapRowProps) {
  const getRiskColor = (risk: number) => {
    if (risk >= 80) return 'bg-red-500';
    if (risk >= 60) return 'bg-red-300';
    if (risk >= 40) return 'bg-yellow-300';
    if (risk >= 20) return 'bg-green-300';
    return 'bg-green-200';
  };

  const getPredictionBadge = (predicted: string) => {
    const styles = {
      High: 'bg-red-100 text-red-700 border-red-300',
      Medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      Low: 'bg-green-100 text-green-700 border-green-300',
    };
    return styles[predicted as keyof typeof styles];
  };

  return (
    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex-1">
        <p className="text-sm text-gray-900 mb-1">{lane.lane}</p>
        <p className="text-xs text-gray-600">Avg Shortage: {lane.avg_shortage}</p>
      </div>
      
      <div className="flex-1">
        <div className="relative h-8 bg-gray-200 rounded-lg overflow-hidden">
          <div 
            className={`h-full ${getRiskColor(lane.risk)} transition-all duration-500`}
            style={{ width: `${lane.risk}%` }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-gray-900 font-medium">{lane.risk}% Risk</span>
          </div>
        </div>
      </div>

      <div>
        <span className={`px-3 py-1.5 rounded-lg text-xs border ${getPredictionBadge(lane.predicted)}`}>
          {lane.predicted}
        </span>
      </div>
    </div>
  );
}

// Predictive Alert Card Component
interface PredictiveAlertCardProps {
  alert: {
    severity: string;
    title: string;
    prediction: string;
    confidence: number;
    action: string;
  };
}

function PredictiveAlertCard({ alert }: PredictiveAlertCardProps) {
  const severityConfig = {
    high: {
      bg: 'bg-red-50',
      border: 'border-red-300',
      icon: AlertTriangle,
      iconColor: 'text-red-600',
      badge: 'bg-red-100 text-red-700',
    },
    medium: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-300',
      icon: AlertCircle,
      iconColor: 'text-yellow-600',
      badge: 'bg-yellow-100 text-yellow-700',
    },
    low: {
      bg: 'bg-blue-50',
      border: 'border-blue-300',
      icon: AlertCircle,
      iconColor: 'text-blue-600',
      badge: 'bg-blue-100 text-blue-700',
    },
  };

  const config = severityConfig[alert.severity as keyof typeof severityConfig];
  const Icon = config.icon;

  return (
    <div className={`${config.bg} border-2 ${config.border} rounded-lg p-4`}>
      <div className="flex items-start gap-3 mb-3">
        <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm text-gray-900">{alert.title}</h4>
            <span className={`px-2 py-0.5 rounded text-xs ${config.badge}`}>
              {alert.severity.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-gray-700 mb-2">{alert.prediction}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-xs text-gray-600">
                AI Confidence: <span className="font-medium text-indigo-700">{alert.confidence}%</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/60 rounded-lg p-2 border border-gray-200">
        <div className="flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-green-600" />
          <span className="text-xs text-gray-700">
            <span className="font-medium">Suggested Action:</span> {alert.action}
          </span>
        </div>
      </div>
    </div>
  );
}
