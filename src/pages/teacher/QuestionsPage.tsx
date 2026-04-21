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
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Search, Edit2, Trash2, BookOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Question } from '@/types';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    question: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 'a'
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuestions(data || []);
    } catch (error: any) {
      console.error(error);
      // Mock data if table doesn't exist yet
      setQuestions([
        { id: '1', question: 'Apa kepanjangan dari TKJ?', option_a: 'Teknik Komputer & Jaringan', option_b: 'Teknik Komunikasi Jaringan', option_c: 'Tenaga Komputer Jaringan', option_d: 'Teknik Kapal Jarak', correct_answer: 'a', created_by: '', created_at: '' },
        { id: '2', question: 'Siapa penemu WWW?', option_a: 'Steve Jobs', option_b: 'Bill Gates', option_c: 'Tim Berners-Lee', option_d: 'Elon Musk', correct_answer: 'c', created_by: '', created_at: '' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('questions').insert([
        { ...formData, created_by: user?.id }
      ]);
      if (error) throw error;
      toast.success('Soal berhasil ditambahkan');
      setIsAddOpen(false);
      fetchQuestions();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus soal ini?')) return;
    try {
      const { error } = await supabase.from('questions').delete().eq('id', id);
      if (error) throw error;
      toast.success('Soal dihapus');
      fetchQuestions();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const filteredQuestions = questions.filter(q => 
    q.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bank Soal</h1>
          <p className="text-muted-foreground">Kelola semua pertanyaan ujian di sini.</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="h-11 rounded-xl shadow-lg flex gap-2">
              <Plus size={20} /> Tambah Soal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] rounded-2xl overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Buat Soal Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddQuestion} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Pertanyaan</Label>
                <textarea 
                  className="w-full min-h-[100px] rounded-xl border bg-background px-3 py-2 text-sm"
                  required
                  value={formData.question}
                  onChange={e => setFormData({...formData, question: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Opsi A</Label>
                  <Input required value={formData.option_a} onChange={e => setFormData({...formData, option_a: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Opsi B</Label>
                  <Input required value={formData.option_b} onChange={e => setFormData({...formData, option_b: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Opsi C</Label>
                  <Input required value={formData.option_c} onChange={e => setFormData({...formData, option_c: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Opsi D</Label>
                  <Input required value={formData.option_d} onChange={e => setFormData({...formData, option_d: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Jawaban Benar</Label>
                <select 
                  className="w-full h-10 rounded-xl border bg-background px-3 py-2 text-sm"
                  value={formData.correct_answer}
                  onChange={e => setFormData({...formData, correct_answer: e.target.value})}
                >
                  <option value="a">Opsi A</option>
                  <option value="b">Opsi B</option>
                  <option value="c">Opsi C</option>
                  <option value="d">Opsi D</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Batal</Button>
                <Button type="submit">Simpan Soal</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <CardHeader className="border-b pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Cari pertanyaan..." 
              className="pl-10 h-11 border-none bg-muted/50 rounded-xl"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[50px]">No</TableHead>
                <TableHead>Pertanyaan</TableHead>
                <TableHead>Jawaban</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuestions.map((q, i) => (
                <TableRow key={q.id}>
                  <TableCell className="font-medium">{i + 1}</TableCell>
                  <TableCell className="max-w-[400px] truncate">{q.question}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold uppercase">
                      {q.correct_answer}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                      <Edit2 size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-red-50" onClick={() => handleDelete(q.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredQuestions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                    Belum ada soal tersedia.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
