import { motion } from 'framer-motion';

/**
 * Problem type selector component
 */
export function ProblemSelector({ 
  selectedProblem, 
  onSelect, 
  disabled = false,
  curveType,
  onCurveTypeChange,
}) {
  const problems = [
    {
      id: 'xor',
      name: 'XOR',
      description: 'Classic non-linear problem',
      icon: '⊕',
    },
    {
      id: 'regression',
      name: 'Regression',
      description: 'Curve fitting',
      icon: '📈',
    },
    {
      id: 'digits',
      name: 'Digits',
      description: '0-9 classification',
      icon: '🔢',
    },
  ];

  const curveTypes = [
    { id: 'sine', name: 'Sine Wave' },
    { id: 'quadratic', name: 'Quadratic' },
    { id: 'cubic', name: 'Cubic' },
    { id: 'step', name: 'Step' },
    { id: 'gaussian', name: 'Gaussian' },
  ];

  return (
    <div className="glass rounded-xl p-5 space-y-4">
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">Problem Type</h2>
      
      <div className="grid grid-cols-3 gap-2">
        {problems.map((problem) => (
          <motion.button
            key={problem.id}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            onClick={() => !disabled && onSelect(problem.id)}
            disabled={disabled}
            className={`
              p-3 rounded-lg border transition-all text-center
              ${selectedProblem === problem.id 
                ? 'bg-[var(--accent-primary)]/20 border-[var(--accent-primary)] text-[var(--text-primary)]' 
                : 'bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]/50'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="text-2xl mb-1">{problem.icon}</div>
            <div className="text-sm font-medium">{problem.name}</div>
            <div className="text-xs text-[var(--text-muted)] mt-0.5">{problem.description}</div>
          </motion.button>
        ))}
      </div>

      {/* Curve type selector for regression */}
      {selectedProblem === 'regression' && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-2"
        >
          <label className="text-sm text-[var(--text-secondary)]">Curve Type</label>
          <select
            value={curveType}
            onChange={(e) => onCurveTypeChange(e.target.value)}
            disabled={disabled}
            className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {curveTypes.map(ct => (
              <option key={ct.id} value={ct.id}>{ct.name}</option>
            ))}
          </select>
        </motion.div>
      )}
    </div>
  );
}

export default ProblemSelector;

