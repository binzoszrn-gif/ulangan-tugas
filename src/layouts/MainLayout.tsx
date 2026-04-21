import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  ClipboardList, 
  LogOut, 
  Menu, 
  X,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      // In a real app, fetch role from public.users table
      // Mocking role for now based on email or metadata
      const role = user.user_metadata?.role || 'siswa'; // Default to siswa
      setUser({ ...user, role });
    };

    getUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.info('Session diakhiri');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard, roles: ['admin', 'guru', 'siswa'] },
    { name: 'Manajemen User', path: '/app/users', icon: Users, roles: ['admin'] },
    { name: 'Bank Soal', path: '/app/questions', icon: BookOpen, roles: ['admin', 'guru'] },
    { name: 'Ujian', path: '/app/exams', icon: ClipboardList, roles: ['admin', 'guru', 'siswa'] },
  ];

  if (!user) return null;

  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden font-sans">
      {/* Sidebar - Mobile Toggle */}
      <div className="md:hidden p-4 absolute z-50">
        <Button variant="outline" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside 
        className={cn(
          "w-[260px] bg-white border-r flex flex-col transition-all duration-300 z-40 fixed md:relative inset-y-0 left-0 transform",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-20"
        )}
      >
        <div className="h-[72px] flex items-center px-6 border-b shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shrink-0 font-bold text-xl">
              S
            </div>
            {sidebarOpen && (
              <div className="leading-tight shrink-0">
                <span className="font-bold text-sm block">SMK PRIMA</span>
                <span className="font-bold text-sm block">UNGGUL</span>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="px-3 mb-3 mt-4">
            {sidebarOpen && <p className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground/70">Menu Utama</p>}
          </div>
          {navItems.filter(item => item.roles.includes(user.role)).map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg transition-all font-medium text-sm",
                location.pathname.startsWith(item.path) 
                  ? "bg-primary/5 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
          
          {sidebarOpen && (
            <div className="pt-8 px-3">
              <p className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground/70 mb-3">Informasi Sekolah</p>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Jurusan: TKJ, DKV, AK, BC, MPLB, BD
              </p>
            </div>
          )}
        </nav>

        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-foreground/80 hover:bg-muted font-bold text-[13px] border py-2.5 px-4 rounded-md gap-3"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Keluar</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-[72px] bg-white border-b flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Pages /</span>
            <span className="font-bold">
              {navItems.find(item => location.pathname.startsWith(item.path))?.name || 'Dashboard'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold">{user.email}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-muted border flex items-center justify-center font-bold text-primary">
              {user.email?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
