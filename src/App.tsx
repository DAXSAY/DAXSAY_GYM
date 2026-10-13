import React, { useState } from 'react';
import { GymProvider, useGym } from './context/GymContext';
import { Header, NavTab } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { MembersManagement } from './components/members/MembersManagement';
import { NewMemberModal } from './components/members/NewMemberModal';
import { MembershipsPlans } from './components/memberships/MembershipsPlans';
import { FinanceModule } from './components/finance/FinanceModule';
import { StaffContractsModule } from './components/staff/StaffContractsModule';
import { PhysiotherapyModule } from './components/physiotherapy/PhysiotherapyModule';
import { AppointmentsScheduleModule } from './components/appointments/AppointmentsScheduleModule';
import { NutritionMeasurementsModule } from './components/nutrition_measurements/NutritionMeasurementsModule';
import { StorePOS } from './components/store/StorePOS';
import { NotificationCenter } from './components/notifications/NotificationCenter';
import { AttendanceModule } from './components/attendances/AttendanceModule';
import { UserAuthModal } from './components/auth/UserAuthModal';

// Legacy fallback imports
import { TrainersManagement } from './components/trainers/TrainersManagement';
import { RoutinesAndExercises } from './components/routines/RoutinesAndExercises';
import { MeasurementsModule } from './components/measurements/MeasurementsModule';
import { SpinningModule } from './components/spinning/SpinningModule';

function MainAppContent() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isNewMemberModalOpen, setIsNewMemberModalOpen] = useState(false);
  const [isQuickSaleModalOpen, setIsQuickSaleModalOpen] = useState(false);
  const [isNewExpenseModalOpen, setIsNewExpenseModalOpen] = useState(false);
  const [isUserAuthModalOpen, setIsUserAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col selection:bg-blue-600 selection:text-white" style={{ backgroundColor: '#f3f4f6' }}>
      
      {/* Top Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewMemberModal={() => setIsNewMemberModalOpen(true)}
        onOpenQuickSaleModal={() => setActiveTab('store')}
        onOpenNewExpenseModal={() => setActiveTab('finance')}
        onOpenUserAuthModal={() => setIsUserAuthModalOpen(true)}
      />

      {/* App Body: High Density Sidebar + Dynamic Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row w-full mx-auto">
        
        {/* Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onOpenUserAuthModal={() => setIsUserAuthModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-y-auto min-w-0 bg-gray-100">
          {activeTab === 'dashboard' && (
            <DashboardOverview 
              setActiveTab={setActiveTab}
              onOpenNewMemberModal={() => setIsNewMemberModalOpen(true)}
              onOpenQuickSaleModal={() => setActiveTab('store')}
              onOpenNewExpenseModal={() => setActiveTab('finance')}
            />
          )}

          {activeTab === 'members' && (
            <MembersManagement 
              onOpenNewMemberModal={() => setIsNewMemberModalOpen(true)}
            />
          )}

          {activeTab === 'staff' && (
            <StaffContractsModule />
          )}

          {activeTab === 'memberships' && (
            <MembershipsPlans />
          )}

          {activeTab === 'nutrition' && (
            <NutritionMeasurementsModule />
          )}

          {activeTab === 'physiotherapy' && (
            <PhysiotherapyModule />
          )}

          {activeTab === 'appointments' && (
            <AppointmentsScheduleModule />
          )}

          {activeTab === 'attendances' && (
            <AttendanceModule />
          )}

          {activeTab === 'store' && (
            <StorePOS />
          )}

          {activeTab === 'finance' && (
            <FinanceModule 
              onOpenNewExpenseModal={() => setIsNewExpenseModalOpen(true)}
            />
          )}

          {activeTab === 'alerts' && (
            <NotificationCenter />
          )}

          {/* Legacy Tab Fallbacks */}
          {activeTab === 'trainers' && (
            <TrainersManagement />
          )}

          {activeTab === 'routines' && (
            <RoutinesAndExercises />
          )}

          {activeTab === 'measurements' && (
            <MeasurementsModule />
          )}

          {activeTab === 'spinning' && (
            <SpinningModule />
          )}
        </main>

      </div>

      {/* Global Modals */}
      <NewMemberModal 
        isOpen={isNewMemberModalOpen}
        onClose={() => setIsNewMemberModalOpen(false)}
      />

      <UserAuthModal
        isOpen={isUserAuthModalOpen}
        onClose={() => setIsUserAuthModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <GymProvider>
      <MainAppContent />
    </GymProvider>
  );
}
