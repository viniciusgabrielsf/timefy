import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { PlayIcon, PauseIcon, RotateCcwIcon } from 'lucide-react';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

const TIMER_SETTINGS = {
  work: 25 * 60, // 25 minutes in seconds
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
};

export const PomodoroTimer = () => {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(TIMER_SETTINGS.work);
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const getProgress = (): number => {
    const total = TIMER_SETTINGS[mode];
    return ((total - timeLeft) / total) * 100;
  };

  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);

    // Play notification sound (optional - browser dependent)
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZRQ0PVbDm7q5aFglFouHyvmwiCCt9zPLaizsIDGS76+yhUBELTKXh8LJlHAU2jdXyzn0pBSh+zPDajTkIDmm/7eSXSA4OWLTn7q1ZFApFouHyvmwiCCt9zPLaizsIDGS76+yhUBELTKXh8LJlHAU2jdXyzn0pBSh+zPDajTkIDmm/7eSXSA4OWLTn7q1ZFApFouHyvmwiCCt9zPLaizsIDGS76+yhUBELTKXh8LJlHAU2jdXyzn0pBSh+zPDajTkIDmm/7eSXSA4OWLTn7q1ZFApFouHyvmwiCCt9zPLaizsIDGS76+yhUBELTKXh8LJlHAU2jdXyzn0pBSh+zPDajTkIDmm/7eSXSA4OWLTn7q1ZFApFouHyvmwiCCt9zPLaizsIDGS76+yhUBELTKXh8LJlHAU2jdXyzn0pBSh+zPDajTkIDmm/7eSXSA4OWLTn7q1ZFApFouHyvmwiCCt9zPLaizsIDGS76+yhUBELTKXh8LJlHAU2jdXyzn0pBSh+zPDajTkIDmm/7eSXSA4OWLTn7q1ZFApFouHyvmwiCCt9zPLaizsIDGS76+yhUBELTKXh8LJlHAU2jdXyzn0pBSh+zPDajTkIDmm/7eSXSA4OWLTn7q1ZFApFouHyvmwiCCt9zPLaizsIDGS76+yhUBELTKXh8LJlHAU2jdXyzn0pBSh+zPDajTkIDmm/7eSXSA4OWLTn7q1ZFApFouHyvmwiCCt9zPLaizsIDGS76+yhUBELTKXh8LJlHAU2jdXyzn0pBSh+zPDajTkIDmm/7eSXSA4OWLTn7q1ZFA==');
      audio.play().catch(() => {
        // Ignore if audio playback fails
      });
    } catch {
      // Audio not supported or failed
    }

    // Determine next mode
    if (mode === 'work') {
      const newCompleted = completedPomodoros + 1;
      setCompletedPomodoros(newCompleted);

      if (newCompleted % 4 === 0) {
        setMode('longBreak');
        setTimeLeft(TIMER_SETTINGS.longBreak);
      } else {
        setMode('shortBreak');
        setTimeLeft(TIMER_SETTINGS.shortBreak);
      }
    } else {
      setMode('work');
      setTimeLeft(TIMER_SETTINGS.work);
    }
  }, [mode, completedPomodoros]);

  // Timer countdown logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, handleTimerComplete]);

  const handleTimerComplete = () => {
    setIsRunning(false);

    // Play notification sound (optional - browser dependent)
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZRQ0PVbDm7q5aFglFouHyvmwiCCt9zPLaizsIDGS76+yhUBELTKXh8LJlHAU2jdXyzn0pBSh+zPDajTkIDmm/7eSXSA4OWLTn7q1ZFApFouHyvmwiCCt9zPLaizsIDGS76+yhUBELTKXh8LJlHAU2jdXyzn0pBSh+zPDajTkIDmm/7eSXSA4OWLTn7q1ZFApFouHyvmwiCCt9zPLaizsIDGS76+yhUBELTKXh8LJlHAU2jdXyzn0pBSh+zPDajTkIDmm/7eSXSA4OWLTn7q1ZFApFouHyvmwiCCt9zPLaizsIDGS76+yhUBELTKXh8LJlHAU2jdXyzn0pBSh+zPDajTkIDmm/7eSXSA4OWLTn7q1ZFApFouHyvmwiCCt9zPLaizsIDGS76+yhUBELTKXh8LJlHAU2jdXyzn0pBSh+zPDajTkIDmm/7eSXSA4OWLTn7q1ZFApFouHyvmwiCCt9zPLaizsIDGS76+yhUBELTKXh8LJlHAU2jdXyzn0pBSh+zPDajTkIDmm/7eSXSA4OWLTn7q1ZFApFouHyvmwiCCt9zPLaizsIDGS76+yhUBELTKXh8LJlHAU2jdXyzn0pBSh+zPDajTkIDmm/7eSXSA4OWLTn7q1ZFApFouHyvmwiCCt9zPLaizsIDGS76+yhUBELTKXh8LJlHAU2jdXyzn0pBSh+zPDajTkIDmm/7eSXSA4OWLTn7q1ZFApFouHyvmwiCCt9zPLaizsIDGS76+yhUBELTKXh8LJlHAU2jdXyzn0pBSh+zPDajTkIDmm/7eSXSA4OWLTn7q1ZFApFouHyvmwiCCt9zPLaizsIDGS76+yhUBELTKXh8LJlHAU2jdXyzn0pBSh+zPDajTkIDmm/7eSXSA4OWLTn7q1ZFA==');
      audio.play().catch(() => {
        // Ignore if audio playback fails
      });
    } catch {
      // Audio not supported or failed
    }

    // Determine next mode
    if (mode === 'work') {
      const newCompleted = completedPomodoros + 1;
      setCompletedPomodoros(newCompleted);

      if (newCompleted % 4 === 0) {
        setMode('longBreak');
        setTimeLeft(TIMER_SETTINGS.longBreak);
      } else {
        setMode('shortBreak');
        setTimeLeft(TIMER_SETTINGS.shortBreak);
      }
    } else {
      setMode('work');
      setTimeLeft(TIMER_SETTINGS.work);
    }
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(TIMER_SETTINGS[mode]);
  };

  const handleModeSwitch = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(TIMER_SETTINGS[newMode]);
  };

  const getModeLabel = (): string => {
    switch (mode) {
      case 'work':
        return 'Foco';
      case 'shortBreak':
        return 'Pausa Curta';
      case 'longBreak':
        return 'Pausa Longa';
    }
  };

  const getModeColor = (): string => {
    switch (mode) {
      case 'work':
        return 'bg-red-500';
      case 'shortBreak':
        return 'bg-green-500';
      case 'longBreak':
        return 'bg-blue-500';
    }
  };

  return (
    <Card className="p-6 flex flex-col items-center gap-6">
      {/* Mode Selector */}
      <div className="flex gap-2 w-full">
        <Button
          variant={mode === 'work' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleModeSwitch('work')}
          className="flex-1"
          disabled={isRunning}
        >
          Foco
        </Button>
        <Button
          variant={mode === 'shortBreak' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleModeSwitch('shortBreak')}
          className="flex-1"
          disabled={isRunning}
        >
          Pausa Curta
        </Button>
        <Button
          variant={mode === 'longBreak' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleModeSwitch('longBreak')}
          className="flex-1"
          disabled={isRunning}
        >
          Pausa Longa
        </Button>
      </div>

      {/* Timer Display */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Progress Circle */}
        <svg className="absolute w-full h-full -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-muted-foreground/20"
          />
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className={getModeColor()}
            strokeDasharray={`${2 * Math.PI * 88}`}
            strokeDashoffset={`${2 * Math.PI * 88 * (1 - getProgress() / 100)}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>

        {/* Time Text */}
        <div className="flex flex-col items-center">
          <span className="text-5xl font-bold tabular-nums">{formatTime(timeLeft)}</span>
          <span className="text-sm text-muted-foreground mt-2">{getModeLabel()}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        {!isRunning ? (
          <Button onClick={handleStart} size="lg" className="min-w-32">
            <PlayIcon className="size-5 mr-2" />
            Iniciar
          </Button>
        ) : (
          <Button onClick={handlePause} size="lg" variant="outline" className="min-w-32">
            <PauseIcon className="size-5 mr-2" />
            Pausar
          </Button>
        )}
        <Button onClick={handleReset} size="lg" variant="ghost">
          <RotateCcwIcon className="size-5" />
        </Button>
      </div>

      {/* Pomodoro Counter */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Pomodoros concluídos:</span>
        <span className="text-lg font-bold">{completedPomodoros}</span>
      </div>
    </Card>
  );
};
