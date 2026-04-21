import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  Timer, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Question, Exam } from '@/types';
import { cn } from '@/lib/utils';

export default function TakeExamPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0); // seconds
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    fetchExamData();
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !loading && !isFinished) {
      handleAutoSubmit();
    }
  }, [timeLeft, isFinished, loading]);

  const fetchExamData = async () => {
    try {
      // Mocking for preview
      const mockExam = { id: 'exam1', title: 'Ujian Akhir Semester - Matematika', duration: 30 };
      const mockQuestions = [
        { id: '1', question: 'Hasil dari 5 + 3 * 2 adalah...', option_a: '16', option_b: '11', option_c: '10', option_d: '26', correct_answer: 'b' },
        { id: '2', question: 'Manakah yang merupakan bilangan prima...', option_a: '4', option_b: '9', option_c: '15', option_d: '17', correct_answer: 'd' },
        { id: '3', question: 'Luas lingkaran dengan jari-jari 7cm adalah... (pi = 22/7)', option_a: '154 cm2', option_b: '44 cm2', option_c: '49 cm2', option_d: '144 cm2', correct_answer: 'a' },
      ];
      
      setExam(mockExam as any);
      setQuestions(mockQuestions as any);
      setTimeLeft(mockExam.duration * 60);
    } catch (error) {
      toast.error('Gagal memuat ujian');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleAutoSubmit = () => {
    toast.warning('Waktu habis! Menyerahkan jawaban otomatis...');
    handleSubmit();
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct_answer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const handleSubmit = async () => {
    setIsFinished(true);
    const score = calculateScore();
    
    try {
      // Save result logic here
      toast.success('Ujian selesai! Nilai Anda: ' + score);
    } catch (error) {
      toast.error('Gagal menyimpan hasil');
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-primary" size={40} />
      <p className="text-muted-foreground">Menyiapkan lembar ujian...</p>
    </div>
  );

  if (isFinished) {
    const score = calculateScore();
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto py-12"
      >
        <Card className="border-none shadow-xl text-center p-8">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-bold mb-2">Ujian Selesai!</h2>
          <p className="text-muted-foreground mb-8">Hasil ujian Anda telah berhasil dikirimkan ke sistem.</p>
          
          <div className="bg-muted p-8 rounded-2xl mb-8">
            <p className="text-sm uppercase tracking-widest font-semibold text-muted-foreground mb-1">Nilai Kamu</p>
            <div className="text-6xl font-black text-primary">{score}</div>
          </div>
          
          <Button size="lg" className="h-14 px-10 rounded-2xl" onClick={() => navigate('/app/dashboard')}>
            Kembali ke Dashboard
          </Button>
        </Card>
      </motion.div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border">
        <div>
          <h1 className="text-xl font-bold">{exam?.title}</h1>
          <p className="text-sm text-muted-foreground">Soal {currentIndex + 1} dari {questions.length}</p>
        </div>
        <div className={cn(
          "flex items-center gap-3 px-6 py-2 rounded-xl border-2 font-mono text-xl font-bold",
          timeLeft < 300 ? "border-red-500 text-red-600 animate-pulse" : "border-primary/20 text-primary"
        )}>
          <Timer size={24} />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground italic">Navigasi Soal</CardTitle>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-5 gap-2">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all border-2",
                    currentIndex === i ? "bg-primary text-white border-primary" : 
                    answers[questions[i].id] ? "bg-green-100 text-green-700 border-green-200" : "bg-white text-muted-foreground border-muted hover:border-primary/50"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </CardContent>
          </Card>
          
          <Button 
            variant="destructive" 
            className="w-full h-12 rounded-xl shadow-lg shadow-red-100"
            onClick={() => {
              if (confirm('Yakin ingin menyelesaikan ujian? Pastikan semua soal telah terjawab.')) {
                handleSubmit();
              }
            }}
          >
            Selesaikan Ujian
          </Button>
        </div>

        {/* Question Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border-none shadow-sm min-h-[400px] flex flex-col">
                <CardContent className="p-8 flex-1">
                  <div className="text-xl font-medium leading-relaxed mb-8">
                    {currentQuestion.question}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {['a', 'b', 'c', 'd'].map((option) => (
                      <button
                        key={option}
                        onClick={() => handleAnswer(currentQuestion.id, option)}
                        className={cn(
                          "w-full p-4 rounded-xl border-2 text-left flex items-center gap-4 transition-all hover:bg-muted/50",
                          answers[currentQuestion.id] === option 
                            ? "border-primary bg-primary/5 text-primary shadow-sm" 
                            : "border-muted text-muted-foreground "
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold uppercase",
                          answers[currentQuestion.id] === option ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                        )}>
                          {option}
                        </div>
                        <span className="font-medium">
                          {(currentQuestion as any)[`option_${option}`]}
                        </span>
                      </button>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-6 border-t bg-muted/30 flex justify-between">
                  <Button 
                    variant="outline" 
                    className="h-11 px-6 rounded-xl"
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex(prev => prev - 1)}
                  >
                    <ChevronLeft className="mr-2" /> Sebelumnya
                  </Button>
                  <Button 
                    className={cn(
                      "h-11 px-8 rounded-xl",
                      currentIndex === questions.length - 1 ? "bg-green-600 hover:bg-green-700" : ""
                    )}
                    onClick={() => {
                      if (currentIndex < questions.length - 1) {
                        setCurrentIndex(prev => prev + 1);
                      } else {
                        // Option to finish at last question
                        toast.info('Klik Selesaikan Ujian di samping untuk mengakhiri.');
                      }
                    }}
                  >
                    {currentIndex === questions.length - 1 ? 'Selesai' : 'Lanjut'} <ChevronRight className="ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </AnimatePresence>

          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground px-2">
            <AlertCircle size={16} /> 
            Jawaban Anda tersimpan otomatis. Jangan tutup halaman ini sebelum ujian selesai.
          </p>
        </div>
      </div>
    </div>
  );
}
