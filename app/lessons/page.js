"use client";

import { useStore } from '@/store/useStore';
import { lessonCategories, lessons } from '@/data/lessons';
import LessonCard from '@/components/lessons/LessonCard';
import styles from './lessons.module.css';

export default function Lessons() {
  const { user } = useStore();
  const completedLessons = user?.lessons?.completed || [];

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Typing Lessons</h1>
        <p className={styles.pageSubtitle}>Structured learning paths from beginner to advanced.</p>
      </div>
      
      {lessonCategories.map(category => {
        const categoryLessons = lessons.filter(l => l.categoryId === category.id);
        const completedInCategory = categoryLessons.filter(l => 
          completedLessons.some(cl => cl.lessonId === l.id)
        ).length;
        
        return (
          <section key={category.id} className={styles.categorySection}>
            <div className={styles.categoryHeader}>
              <div>
                <h2 className={styles.categoryTitle}>
                  <span style={{ backgroundColor: category.color }}></span>
                  {category.title}
                </h2>
                <p className={styles.categoryDescription}>{category.description}</p>
              </div>
              <div className={styles.progressText}>
                {completedInCategory} / {categoryLessons.length} Completed
              </div>
            </div>
            
            <div className={styles.lessonsGrid}>
              {categoryLessons.map(lesson => {
                const completionData = completedLessons.find(cl => cl.lessonId === lesson.id);
                return (
                  <LessonCard 
                    key={lesson.id} 
                    lesson={lesson} 
                    status={completionData ? { isCompleted: true, ...completionData } : null}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
