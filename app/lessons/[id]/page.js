"use client";

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { lessons } from '@/data/lessons';
import TypingEngine from '@/components/typing/TypingEngine';
import Button from '@/components/ui/Button';

export default function LessonPage({ params }) {
  const router = useRouter();
  
  // In Next 15 (if upgraded), params is a promise.
  // Next 14 handles it fine, but we'll unwrap just in case.
  const unwrappedParams = use(params);
  const lessonId = unwrappedParams.id;
  
  const lesson = lessons.find(l => l.id === lessonId);

  useEffect(() => {
    if (!lesson) {
      router.push('/lessons');
    }
  }, [lesson, router]);

  if (!lesson) return null;

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', paddingTop: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Button 
          variant="ghost" 
          icon={ChevronLeft} 
          onClick={() => router.push('/lessons')}
          style={{ paddingLeft: 0 }}
        >
          Back to Lessons
        </Button>
      </div>
      
      <TypingEngine lesson={lesson} />
    </div>
  );
}
