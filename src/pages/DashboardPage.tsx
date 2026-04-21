import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { 
  Users as UsersIcon, 
  FileText, 
  ClipboardCheck, 
  Clock,
  TrendingUp,
  Award
} from 'lucide-react';
import { motion } from 'motion/react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalQuestions: 0,
    activeExams: 0,
    avgScore: 0
  });

  useEffect(() => {
    // Mocking data for the preview since DB might be empty
    setStats({
      totalStudents: 124,
      totalQuestions: 450,
      activeExams: 12,
      avgScore: 78.5
    });
  }, []);

  const cards = [
    { title: 'Ujian Selesai', value: stats.totalStudents / 10, icon: UsersIcon, color: 'text-[#0F172A]', bg: 'bg-white' },
    { title: 'Ujian Aktif', value: stats.activeExams, icon: ClipboardCheck, color: 'text-primary', bg: 'bg-white' },
    { title: 'Rata-rata Nilai', value: 88.5, icon: TrendingUp, color: 'text-[#0F172A]', bg: 'bg-white' },
  ];

  return (
    <div className="space-y-8 font-sans max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border border-[#E2E8F0] shadow-none bg-white p-6 rounded-xl">
              <p className="text-sm text-muted-foreground mb-2">{card.title}</p>
              <h3 className={cn("text-[28px] font-bold leading-none", card.color)}>{card.value}</h3>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Ujian Tersedia</h2>
        <span className="text-[13px] text-muted-foreground">Menampilkan 2 ujian terjadwal hari ini</span>
      </div>

      <div className="space-y-4">
        {[
          { title: 'Matematika Dasar - Ujian Tengah Semester', duration: 90, questions: 40, tag: 'Wajib', type: 'red' },
          { title: 'Pemrograman Dasar (Next.js & Supabase)', duration: 120, questions: 50, tag: 'Produktif', type: 'gray' }
        ].map((exam, i) => (
          <Card key={i} className="border border-[#E2E8F0] shadow-none bg-white p-5 rounded-xl flex items-center justify-between group overflow-hidden relative">
            <div className="space-y-1">
              <h3 className="font-semibold text-[15px]">{exam.title}</h3>
              <div className="flex items-center gap-4 text-[13px] text-muted-foreground">
                <span>Durasi: {exam.duration} Menit</span>
                <span>Soal: {exam.questions} Butir</span>
                <span className={cn(
                  "px-2 py-0.5 rounded text-[11px] font-bold uppercase",
                  exam.type === 'red' ? "bg-[#FEE2E2] text-[#991B1B]" : "bg-[#F1F5F9] text-[#475569]"
                )}>
                  {exam.tag}
                </span>
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-6 rounded-lg text-sm">
              Kerjakan Sekarang
            </Button>
          </Card>
        ))}
      </div>

      <div className="mt-6 p-5 border border-dashed border-[#CBD5E1] rounded-xl text-center text-muted-foreground text-sm">
        Gunakan koneksi internet yang stabil untuk mengerjakan ujian online.
      </div>
    </div>
  );
}
