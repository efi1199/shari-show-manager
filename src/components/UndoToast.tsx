import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Undo2, X } from 'lucide-react';

interface UndoToastProps {
  message: string;
  onUndo: () => void;
  duration?: number;
  onClose: () => void;
}

export function UndoToast({ message, onUndo, duration = 5000, onClose }: UndoToastProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      
      if (remaining === 0) {
        clearInterval(interval);
        onClose();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onClose]);

  const handleUndo = () => {
    onUndo();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className="fixed bottom-6 left-6 z-50 bg-card border border-border rounded-xl shadow-lg overflow-hidden"
      dir="rtl"
    >
      <div className="p-4 flex items-center gap-3">
        <span className="text-sm">{message}</span>
        <Button
          size="sm"
          variant="outline"
          onClick={handleUndo}
          className="gap-1 shrink-0"
        >
          <Undo2 className="w-3 h-3" />
          ביטול
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          className="h-6 w-6 shrink-0"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: '100%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.05 }}
        />
      </div>
    </motion.div>
  );
}

// Hook for managing undo state
export interface UndoAction {
  id: string;
  message: string;
  undo: () => void;
}

export function useUndo() {
  const [undoAction, setUndoAction] = useState<UndoAction | null>(null);

  const showUndo = (message: string, undoFn: () => void) => {
    setUndoAction({
      id: crypto.randomUUID(),
      message,
      undo: undoFn,
    });
  };

  const clearUndo = () => setUndoAction(null);

  return { undoAction, showUndo, clearUndo };
}
