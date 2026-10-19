import { useState } from 'react';
import { Sidebar } from './components/sidebar';
import { OrderQueue } from './components/order-queue';
import { DocumentUpload } from './components/document-upload';
import { AdvanceDocumentUpload } from './components/advance-document-upload';
import { FinalSettlementUpload } from './components/final-settlement-upload';
import { DAVTVehicleVerification } from './components/davt-vehicle-verification';
import { DAVTAdvanceVerification as DAVTAdvanceVerificationDetail } from './components/davt-advance-verification';
import { DAVTFinalSettlement } from './components/davt-final-settlement';
import { DAVTQueue } from './components/davt-queue';
import { DAVTKYCVerification } from './components/davt-kyc-verification';
import { DAVTSettlementVerification } from './components/davt-settlement-verification';
import { AIExceptionHandling } from './components/ai-exception-handling';
import { AIProcessIntelligence } from './components/ai-process-intelligence';
import { OpsOrderSearch } from './components/ops-order-search';
import { OpsKYCUpload } from './components/ops-kyc-upload';
import { OpsKYCOutcome } from './components/ops-kyc-outcome';
import { OpsAdvanceUpload } from './components/ops-advance-upload';
import { OpsAdvanceResult } from './components/ops-advance-result';
import { OpsSettlementUpload } from './components/ops-settlement-upload';
import { OpsSettlementResult } from './components/ops-settlement-result';

export default function App() {
  const [currentView, setCurrentView] = useState<'orders' | 'upload' | 'advance-upload' | 'advance-result' | 'settlement-upload' | 'settlement-result' | 'final-settlement' | 'davt-vehicle' | 'davt-advance' | 'davt-final' | 'davt-queue' | 'davt-kyc-detail' | 'davt-advance-detail' | 'davt-settlement-detail' | 'exceptions' | 'analytics' | 'order-search' | 'kyc-upload' | 'kyc-outcome'>('order-search');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  // Track order statuses
  const [orderStatuses, setOrderStatuses] = useState<Record<string, 'vehicle-arrived' | 'loading-in-progress' | 'vehicle-in-transit' | 'vehicle-arrived-unloading'>>({});

  const handleStartUpload = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCurrentView('upload');
  };

  const handleStartAdvanceUpload = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCurrentView('advance-upload');
  };

  const handleStartFinalSettlement = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCurrentView('final-settlement');
  };

  const handleDAVTReview = (orderId: string, stage: 'vehicle' | 'advance' | 'final') => {
    setSelectedOrderId(orderId);
    setCurrentView(stage === 'vehicle' ? 'davt-vehicle' : stage === 'advance' ? 'davt-advance' : 'davt-final');
  };

  const handleProceedToKYC = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCurrentView('kyc-upload');
  };

  const handleProceedToOutcome = () => {
    setCurrentView('kyc-outcome');
  };

  const handleProceedToAdvanceUpload = () => {
    setCurrentView('advance-upload');
  };

  const handleBackToOrders = () => {
    setCurrentView('order-search');
    setSelectedOrderId(null);
  };

  const handleBackFromOutcome = () => {
    setCurrentView('kyc-upload');
  };

  const handleStartAdvanceUploadFromSearch = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCurrentView('advance-upload');
  };

  const handleProceedToAdvanceResult = () => {
    setCurrentView('advance-result');
  };

  const handleBackFromAdvanceResult = () => {
    setCurrentView('advance-upload');
  };

  const handleStartSettlementUpload = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCurrentView('settlement-upload');
  };

  const handleProceedToSettlementResult = () => {
    setCurrentView('settlement-result');
  };

  const handleBackFromSettlementResult = () => {
    setCurrentView('settlement-upload');
  };

  const handleOpenKYCVerification = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCurrentView('davt-kyc-detail');
  };

  const handleOpenAdvanceVerificationDetail = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCurrentView('davt-advance-detail');
  };

  const handleOpenSettlementVerificationDetail = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCurrentView('davt-settlement-detail');
  };

  const handleBackToDAVTQueue = () => {
    setCurrentView('davt-queue');
    setSelectedOrderId(null);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentView={currentView} onNavigate={(view) => {
        if (view === 'davt-vehicle') {
          handleDAVTReview('ORD-2024-001', 'vehicle');
        } else if (view === 'davt-advance') {
          handleDAVTReview('ORD-2024-002', 'advance');
        } else if (view === 'davt-final') {
          handleDAVTReview('ORD-2024-003', 'final');
        } else {
          setCurrentView(view as any);
        }
      }} />
      
      <main className="flex-1 overflow-auto">
        {currentView === 'order-search' ? (
          <OpsOrderSearch 
            onProceedToKYC={handleProceedToKYC} 
            onProceedToAdvanceUpload={handleStartAdvanceUploadFromSearch}
            onProceedToSettlement={handleStartSettlementUpload}
            orderStatuses={orderStatuses}
          />
        ) : currentView === 'kyc-upload' ? (
          <OpsKYCUpload 
            orderId={selectedOrderId} 
            onBack={handleBackToOrders}
            onProceedToOutcome={handleProceedToOutcome}
            onProceedToAdvanceUpload={handleProceedToAdvanceUpload}
          />
        ) : currentView === 'kyc-outcome' ? (
          <OpsKYCOutcome 
            orderId={selectedOrderId} 
            onBack={handleBackFromOutcome}
            onProceedToLoading={handleBackToOrders}
          />
        ) : currentView === 'orders' ? (
          <OrderQueue 
            onStartUpload={handleStartUpload} 
            onStartAdvanceUpload={handleStartAdvanceUpload}
            onStartFinalSettlement={handleStartFinalSettlement}
          />
        ) : currentView === 'upload' ? (
          <DocumentUpload 
            orderId={selectedOrderId} 
            onBack={handleBackToOrders}
          />
        ) : currentView === 'advance-upload' ? (
          <OpsAdvanceUpload 
            orderId={selectedOrderId} 
            onBack={handleBackToOrders}
            onProceedToResult={handleProceedToAdvanceResult}
          />
        ) : currentView === 'advance-result' ? (
          <OpsAdvanceResult 
            orderId={selectedOrderId} 
            onBack={handleBackFromAdvanceResult}
            onReupload={handleBackFromAdvanceResult}
          />
        ) : currentView === 'settlement-upload' ? (
          <OpsSettlementUpload 
            orderId={selectedOrderId} 
            onBack={handleBackToOrders}
            onProceedToResult={handleProceedToSettlementResult}
          />
        ) : currentView === 'settlement-result' ? (
          <OpsSettlementResult 
            orderId={selectedOrderId} 
            onBack={handleBackFromSettlementResult}
            onReupload={handleBackFromSettlementResult}
          />
        ) : currentView === 'final-settlement' ? (
          <FinalSettlementUpload 
            orderId={selectedOrderId} 
            onBack={handleBackToOrders}
          />
        ) : currentView === 'davt-vehicle' ? (
          <DAVTVehicleVerification 
            orderId={selectedOrderId} 
            onBack={handleBackToOrders}
          />
        ) : currentView === 'davt-advance' ? (
          <DAVTAdvanceVerificationDetail 
            orderId={selectedOrderId} 
            onBack={handleBackToOrders}
          />
        ) : currentView === 'davt-final' ? (
          <DAVTFinalSettlement 
            orderId={selectedOrderId} 
            onBack={handleBackToOrders}
          />
        ) : currentView === 'davt-queue' ? (
          <DAVTQueue 
            onOpenKYCVerification={handleOpenKYCVerification}
            onOpenAdvanceVerification={handleOpenAdvanceVerificationDetail}
            onOpenSettlementVerification={handleOpenSettlementVerificationDetail}
          />
        ) : currentView === 'davt-kyc-detail' ? (
          <DAVTKYCVerification 
            orderId={selectedOrderId} 
            onBack={handleBackToDAVTQueue}
          />
        ) : currentView === 'davt-advance-detail' ? (
          <DAVTAdvanceVerificationDetail 
            orderId={selectedOrderId} 
            onBack={handleBackToDAVTQueue}
          />
        ) : currentView === 'davt-settlement-detail' ? (
          <DAVTSettlementVerification 
            orderId={selectedOrderId} 
            onBack={handleBackToDAVTQueue}
          />
        ) : currentView === 'exceptions' ? (
          <AIExceptionHandling 
            onBack={handleBackToOrders}
          />
        ) : (
          <AIProcessIntelligence 
            onBack={handleBackToOrders}
          />
        )}
      </main>
    </div>
  );
}