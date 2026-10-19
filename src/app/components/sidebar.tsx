import { 
  LayoutDashboard, 
  Package, 
  AlertTriangle, 
  Bot, 
  BarChart3,
  Users
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, view: null },
    { id: 'orders', label: 'Orders', icon: Package, view: 'order-search' as const },
    { id: 'davt', label: 'DAVT Queue', icon: Users, view: 'davt-queue' as const },
    { id: 'exceptions', label: 'Exceptions', icon: AlertTriangle, view: 'exceptions' as const },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, view: 'analytics' as const },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-gray-900">LogiFlow AI</h1>
            <p className="text-xs text-gray-500">Operations Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          // Check if current view matches item or is a sub-view
          const isActive = item.view === currentView || 
            (item.id === 'davt' && (
              currentView === 'davt-queue' || 
              currentView === 'davt-kyc-detail' || 
              currentView === 'davt-advance-detail' || 
              currentView === 'davt-settlement-detail' ||
              currentView === 'davt-vehicle' ||
              currentView === 'davt-advance' ||
              currentView === 'davt-final'
            )) ||
            (item.id === 'orders' && (
              currentView === 'order-search' ||
              currentView === 'kyc-upload' ||
              currentView === 'kyc-outcome' ||
              currentView === 'advance-upload' ||
              currentView === 'advance-result' ||
              currentView === 'settlement-upload' ||
              currentView === 'settlement-result' ||
              currentView === 'orders'
            ));
          
          return (
            <button
              key={item.id}
              onClick={() => item.view && onNavigate(item.view)}
              disabled={!item.view}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : item.view
                  ? 'text-gray-700 hover:bg-gray-50'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white">
            OP
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-900">Ops Executive</p>
            <p className="text-xs text-gray-500">ops@logiflow.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}