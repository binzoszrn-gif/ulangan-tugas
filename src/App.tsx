import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import QuestionsPage from '@/pages/teacher/QuestionsPage';
import ExamsPage from '@/pages/teacher/ExamsPage';
import TakeExamPage from '@/pages/student/TakeExamPage';
import UsersPage from '@/pages/admin/UsersPage';
import MainLayout from '@/layouts/MainLayout';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function App() {
  return (
    <TooltipProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected App Routes */}
        <Route path="/app" element={<MainLayout />}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="questions" element={<QuestionsPage />} />
          <Route path="exams" element={<ExamsPage />} />
          <Route path="take-exam/:id" element={<TakeExamPage />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </TooltipProvider>
  );
}
