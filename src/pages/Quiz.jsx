import React, { useState, useEffect } from 'react';
import { quizQuestions } from '../utils/seedData';
import { Timer, CheckCircle, XCircle, ChevronRight, ChevronLeft, Send, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Randomize and pick 10 questions
    const shuffled = [...quizQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10).map(q => ({
      ...q,
      shuffledOptions: [...q.options].sort(() => 0.5 - Math.random())
    }));
    setQuestions(selected);
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted]);

  const handleAnswerSelect = (option) => {
    if (isSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIdx]: option
    });
  };

  const handleSubmit = async () => {
    if (isSubmitted || submitLoading) return;
    setSubmitLoading(true);
    setIsSubmitted(true);
    const questionResults = questions.map((q, idx) => ({
      question: q.question,
      selectedAnswer: selectedAnswers[idx],
      correctAnswer: q.options[q.correctAnswerIndex],
      isCorrect: selectedAnswers[idx] === q.options[q.correctAnswerIndex],
      explanation: q.explanation
    }));

    let score = 0;
    questionResults.forEach(r => { if (r.isCorrect) score++; });

    const attemptData = {
      uid: currentUser.uid,
      score,
      totalQuestions: questions.length,
      accuracy: (score / questions.length) * 100,
      timeTaken: 600 - timeLeft,
      completedAt: serverTimestamp(),
      results: questionResults
    };

    try {
      // Create a promise that rejects after 4 seconds
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout")), 4000)
      );

      // Race the Firebase call against the timeout
      const docRef = await Promise.race([
        addDoc(collection(db, "quizAttempts"), attemptData),
        timeoutPromise
      ]);

      alert(`Quiz Submitted! Your score: ${score}/${questions.length}`);
      navigate(`/quiz/result/${docRef.id}`);
    } catch (e) {
      console.error("Quiz submission delayed/failed:", e);
      // FASTER FALLBACK: Save results to localStorage so the results page can read it immediately
      const tempId = "local_" + Date.now();
      localStorage.setItem(`quiz_result_${tempId}`, JSON.stringify(attemptData));
      navigate(`/quiz/result/${tempId}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (questions.length === 0) return <div>Loading Quiz...</div>;

  const currentQuestion = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Daily Market Sprint</h1>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <span>Question {currentIdx + 1} of {questions.length}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Timer size={14} /> {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
        <div style={{ width: '120px', height: '8px', background: 'var(--bg-tertiary)', borderRadius: '10px', overflow: 'hidden' }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} style={{ height: '100%', background: 'var(--accent-primary)' }} />
        </div>
      </div>

      <motion.div 
        key={currentIdx}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card"
      >
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            {currentQuestion.topic} • {currentQuestion.difficulty}
          </div>
          <h2 style={{ fontSize: '1.25rem', lineHeight: 1.4 }}>{currentQuestion.question}</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {currentQuestion.shuffledOptions.map((option, i) => {
            const isSelected = selectedAnswers[currentIdx] === option;
            return (
              <button
                key={i}
                onClick={() => handleAnswerSelect(option)}
                style={{
                  padding: '1.25rem',
                  textAlign: 'left',
                  background: isSelected ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-tertiary)',
                  border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                  borderRadius: '12px',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                {option}
                {isSelected && <CheckCircle size={18} className="text-success" />}
              </button>
            );
          })}
        </div>
      </motion.div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button 
          className="btn btn-secondary" 
          onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
          disabled={currentIdx === 0}
        >
          <ChevronLeft size={20} /> Previous
        </button>
        
        {currentIdx < questions.length - 1 ? (
          <button 
            className="btn btn-primary" 
            onClick={() => setCurrentIdx(prev => prev + 1)}
            disabled={!selectedAnswers[currentIdx]}
          >
            Next Question <ChevronRight size={20} />
          </button>
        ) : (
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit}
            style={{ padding: '1rem 2rem', background: 'var(--accent-blue)', boxShadow: '0 8px 24px -6px rgba(59, 130, 246, 0.4)' }}
            disabled={submitLoading}
          >
            {submitLoading ? 'Analyzing Results...' : 'Submit Quiz'} <Send size={18} />
          </button>
        )}
      </div>

      {Object.keys(selectedAnswers).length < questions.length && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', fontSize: '0.875rem', justifyContent: 'center', background: 'rgba(251, 191, 36, 0.05)', padding: '0.75rem', borderRadius: '8px' }}>
          <AlertCircle size={14} /> You have {questions.length - Object.keys(selectedAnswers).length} unanswered questions.
        </div>
      )}
    </div>
  );
}
