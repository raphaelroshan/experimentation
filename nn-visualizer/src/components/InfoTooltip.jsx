import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Educational tooltip component
 */
export function InfoTooltip({ children, title, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="ml-1.5 w-4 h-4 rounded-full bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] 
                   text-xs flex items-center justify-center hover:bg-[var(--accent-primary)]/30 
                   transition-colors cursor-help"
        aria-label={`Info about ${title}`}
      >
        ?
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-2 z-50 w-64 p-3 rounded-lg 
                       bg-[var(--bg-secondary)] border border-[var(--border)] shadow-xl"
          >
            {title && (
              <div className="text-sm font-medium text-[var(--accent-secondary)] mb-1.5">
                {title}
              </div>
            )}
            <div className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {children}
            </div>
            <div className="absolute -top-1.5 left-4 w-3 h-3 bg-[var(--bg-secondary)] border-l border-t 
                          border-[var(--border)] transform rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Expandable info section
 */
export function InfoSection({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="glass rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left
                   hover:bg-[var(--bg-tertiary)]/50 transition-colors"
      >
        <span className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
          <span className="text-[var(--accent-primary)]">📚</span>
          {title}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-[var(--text-muted)]"
        >
          ▼
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 text-xs text-[var(--text-secondary)] leading-relaxed space-y-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default InfoTooltip;

