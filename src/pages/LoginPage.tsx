import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { GraduationCap, Lock, Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Debug log to console (F12)
    const url = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('Supabase Config Check:', {
      url: url ? `${url.substring(0, 10)}...` : 'MISSING',
      key: key ? 'DETECTED' : 'MISSING'
    });

    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name,
              role: 'siswa', // Default role
            },
          },
        });
        if (error) throw error;
        toast.success('Registrasi berhasil! Silakan cek email (jika konfirmasi aktif) atau langsung login.');
        setIsSignUp(false);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast.success('Login berhasil!');
        navigate('/app/dashboard');
      }
    } catch (error: any) {
      console.error(error);
      const message = error.message || 'Terjadi kesalahan sistem.';
      if (message.includes('Invalid login credentials')) {
        toast.error('Email atau password salah.');
      } else if (message.includes('Email not confirmed')) {
        toast.error('Email belum dikonfirmasi. Cek kotak masuk Anda.');
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl mx-auto mb-4">
            <GraduationCap size={32} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Portal CBT SMK Prima Unggul</h1>
          <p className="text-muted-foreground">
            {isSignUp ? 'Daftar akun baru siswa.' : 'Selamat datang kembali, silakan login.'}
          </p>
        </div>

        <Card className="shadow-xl border-t-4 border-t-primary">
          <form onSubmit={handleAuth}>
            <CardHeader>
              <CardTitle>{isSignUp ? 'Buat Akun' : 'Login'}</CardTitle>
              <CardDescription>
                {isSignUp 
                  ? 'Isi data berikut untuk mendaftar sebagai siswa.' 
                  : 'Masukkan kredensial Anda untuk mengakses sistem.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nama Lengkap</label>
                  <Input 
                    placeholder="Nama Lengkap" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input 
                    type="email" 
                    placeholder="nama@sekolah.sch.id" 
                    className="pl-10" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : (isSignUp ? 'Daftar' : 'Login')}
              </Button>
              <div className="flex flex-col items-center gap-2">
                <button 
                  type="button"
                  className="text-sm text-primary font-medium hover:underline"
                  onClick={() => setIsSignUp(!isSignUp)}
                >
                  {isSignUp ? 'Sudah punya akun? Login' : 'Belum punya akun? Daftar Sekarang'}
                </button>
                <Button variant="link" className="text-xs text-muted-foreground" onClick={() => navigate('/')}>
                  Kembali ke Landing Page
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
        
        <p className="text-center mt-8 text-sm text-muted-foreground">
          {isSignUp ? 'Role default adalah Siswa. Hubungi Admin untuk role Guru.' : 'Lupa password? Hubungi Admin IT Sekolah.'}
        </p>
      </motion.div>
    </div>
  );
}
