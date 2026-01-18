'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, children, className }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Prevent scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm transition-all duration-200 animate-in fade-in">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />
      <div 
        className={cn(
          "relative z-50 w-full max-w-lg rounded-xl border bg-card p-6 shadow-xl animate-in zoom-in-95 duration-200 sm:max-w-2xl",
          className
        )}
      >
        <div className="absolute right-4 top-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full opacity-70 transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}
