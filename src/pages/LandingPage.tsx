import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { BookOpen, GraduationCap, Laptop, Palette, Calculator, Radio, Briefcase, ShoppingBag, ArrowRight } from 'lucide-react';

const departments = [
  { name: 'TKJ', full: 'Teknik Komputer & Jaringan', icon: Laptop },
  { name: 'DKV', full: 'Desain Komunikasi Visual', icon: Palette },
  { name: 'AK', full: 'Akuntansi', icon: Calculator },
  { name: 'BC', full: 'Broadcasting', icon: Radio },
  { name: 'MPLB', full: 'Manajemen Perkantoran & Layanan Bisnis', icon: Briefcase },
  { name: 'BD', full: 'Bisnis Digital', icon: ShoppingBag },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg">
              <GraduationCap size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight">SMK Prima <span className="text-primary">Unggul</span></span>
          </div>
          <Button onClick={() => navigate('/login')} className="rounded-full px-6">
            Login Sistem
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Platform Ujian Berbasis <span className="text-primary">Komputer</span> Terpadu
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Sistem CBT modern untuk menunjang kelancaran ujian siswa SMK Prima Unggul. 
              Cepat, Aman, dan Transparan.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={() => navigate('/login')} className="h-14 px-8 text-lg rounded-xl flex gap-2">
                Mulai Ujian Sekarang <ArrowRight size={20} />
              </Button>
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-xl">
                Panduan Siswa
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Jurusan Unggulan Kami</h2>
            <p className="text-muted-foreground">Mempersiapkan tenaga kerja profesional di berbagai bidang kompetensi.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, index) => (
              <motion.div
                key={dept.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl border hover:border-primary/50 hover:shadow-xl transition-all group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <dept.icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">{dept.name}</h3>
                <p className="text-muted-foreground text-sm">{dept.full}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-t">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary mb-2">1200+</div>
            <div className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Siswa Aktif</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">45+</div>
            <div className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Guru Pengampu</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">6</div>
            <div className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Jurusan</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">100%</div>
            <div className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Digitalized</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-muted-foreground">© 2026 SMK Prima Unggul - Computer Based Test System</p>
        </div>
      </footer>
    </div>
  );
}
