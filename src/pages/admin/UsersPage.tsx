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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Search, UserPlus, UserX, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    // Mocking for preview
    setUsers([
      { id: '1', email: 'admin@sekolah.id', name: 'Admin Utama', role: 'admin' },
      { id: '2', email: 'budi@sekolah.id', name: 'Budi Raharjo', role: 'guru' },
      { id: '3', email: 'siswa1@sekolah.id', name: 'Siti Aminah', role: 'siswa' },
    ]);
    setLoading(false);
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Yakin ingin menghapus user ini?')) return;
    toast.success('Simulasi: User berhasil dihapus');
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen User</h1>
          <p className="text-muted-foreground">Kelola akun admin, guru, dan siswa.</p>
        </div>
        
        <Button className="h-11 rounded-xl shadow-lg flex gap-2">
          <UserPlus size={20} /> Tambah User
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <CardHeader className="border-b pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Cari nama atau email..." 
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
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-bold">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "capitalize border-none shadow-none",
                      user.role === 'admin' ? "bg-red-100 text-red-700" : 
                      user.role === 'guru' ? "bg-blue-100 text-blue-700" : 
                      "bg-green-100 text-green-700"
                    )}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteUser(user.id)}>
                      <UserX size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');
