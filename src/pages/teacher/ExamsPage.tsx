import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Play, Clock, FileText, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Exam } from '@/types';
import { Badge } from '@/components/ui/badge';

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [role, setRole] = useState('siswa');

  useEffect(() => {
    const checkRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setRole(user?.user_metadata?.role || 'siswa');
    };
    checkRole();
    fetchExams();
  }, []);

  const fetchExams = async () => {
    // Mocking for preview
    const mockExams = [
      { id: 'exam1', title: 'Ujian Akhir Semester - Matematika', duration: 30, created_at: '2026-04-20', created_by: 'guru1' },
      { id: 'exam2', title: 'Kuis Jaringan Dasar', duration: 15, created_at: '2026-04-21', created_by: 'guru1' },
    ];
    setExams(mockExams as any);
    setLoading(false);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daftar Ujian</h1>
          <p className="text-muted-foreground">Pilih ujian yang ingin dikerjakan atau dikelola.</p>
        </div>
        
        {['admin', 'guru'].includes(role) && (
          <Button className="h-11 rounded-xl shadow-lg flex gap-2">
            <Plus size={20} /> Buat Ujian
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <Card key={exam.id} className="border border-[#E2E8F0] shadow-none hover:shadow-md transition-all group bg-white p-5 rounded-xl flex flex-col gap-4">
            <div className="space-y-1">
              <div className="flex justify-between items-start">
                <Badge className="bg-[#FEE2E2] text-[#991B1B] border-none shadow-none text-[11px] font-bold uppercase py-0.5">Aktif</Badge>
                <div className="flex items-center gap-1 text-muted-foreground text-[12px] font-medium">
                  <Clock size={14} /> {exam.duration} Menit
                </div>
              </div>
              <h3 className="text-[17px] font-bold leading-tight group-hover:text-primary transition-colors">{exam.title}</h3>
              <p className="text-[13px] text-muted-foreground">20 Pertanyaan • Pilihan Ganda</p>
            </div>
            
            <div className="flex gap-2 pt-2 mt-auto">
              {role === 'siswa' ? (
                <Button className="flex-1 h-10 rounded-lg text-sm font-bold bg-primary hover:bg-primary/90" onClick={() => navigate(`/app/take-exam/${exam.id}`)}>
                  Mulai Ujian
                </Button>
              ) : (
                <>
                  <Button variant="outline" className="flex-1 h-10 rounded-lg text-sm border-[#E2E8F0]">
                    Hasil
                  </Button>
                  <Button className="flex-1 h-10 rounded-lg text-sm font-bold bg-primary">Kelola</Button>
                </>
              )}
            </div>
          </Card>
        ))}
        {exams.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed">
            <ClipboardList className="mx-auto mb-4 text-muted-foreground" size={48} />
            <p className="text-muted-foreground">Belum ada ujian yang tersedia saat ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const ClipboardList = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <path d="M9 12h6"/>
    <path d="M9 16h6"/>
    <path d="M9 8h6"/>
  </svg>
);
