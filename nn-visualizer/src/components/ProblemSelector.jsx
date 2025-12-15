import { motion } from 'framer-motion';
import { InfoTooltip } from './InfoTooltip';

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
      difficulty: 'Beginner',
      difficultyColor: 'var(--positive)',
    },
    {
      id: 'regression',
      name: 'Regression',
      description: 'Curve fitting',
      icon: '📈',
      difficulty: 'Intermediate',
      difficultyColor: 'var(--warning)',
    },
    {
      id: 'digits',
      name: 'Digits',
      description: '0-9 classification',
      icon: '🔢',
      difficulty: 'Advanced',
      difficultyColor: 'var(--negative)',
    },
  ];

  const curveTypes = [
    { id: 'sine', name: 'Sine Wave', description: 'Smooth periodic function' },
    { id: 'quadratic', name: 'Quadratic', description: 'Parabola (x²)' },
    { id: 'cubic', name: 'Cubic', description: 'S-curve (x³)' },
    { id: 'step', name: 'Step', description: 'Discontinuous jump' },
    { id: 'gaussian', name: 'Gaussian', description: 'Bell curve' },
  ];

  return (
    <div className="glass rounded-xl p-5 space-y-4">
      <div className="flex items-center">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Problem Type</h2>
        <InfoTooltip title="Choose a Problem">
          Each problem demonstrates different neural network capabilities. Start with XOR to 
          understand the basics, then try more complex tasks!
        </InfoTooltip>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {problems.map((problem) => (
          <motion.button
            key={problem.id}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            onClick={() => !disabled && onSelect(problem.id)}
            disabled={disabled}
            className={`
              p-3 rounded-lg border transition-all text-center relative
              ${selectedProblem === problem.id 
                ? 'bg-[var(--accent-primary)]/20 border-[var(--accent-primary)] text-[var(--text-primary)]' 
                : 'bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]/50'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="text-2xl mb-1">{problem.icon}</div>
            <div className="text-sm font-medium">{problem.name}</div>
            <div className="text-xs text-[var(--text-muted)] mt-0.5">{problem.description}</div>
            <div 
              className="text-[10px] mt-1.5 px-1.5 py-0.5 rounded-full inline-block"
              style={{ 
                backgroundColor: `${problem.difficultyColor}20`,
                color: problem.difficultyColor 
              }}
            >
              {problem.difficulty}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Problem-specific info */}
      {selectedProblem === 'xor' && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-xs text-[var(--text-secondary)] bg-[var(--bg-tertiary)] rounded-lg p-3"
        >
          <strong className="text-[var(--accent-secondary)]">🎯 Goal:</strong> Learn the XOR function. 
          Watch the decision boundary form as training progresses. The network needs hidden layers 
          to solve this non-linear problem!
        </motion.div>
      )}

      {/* Curve type selector for regression */}
      {selectedProblem === 'regression' && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-3"
        >
          <div className="flex items-center">
            <label className="text-sm text-[var(--text-secondary)]">Target Function</label>
            <InfoTooltip title="Target Function">
              Choose which mathematical function the network should learn to approximate. 
              Some functions are harder to learn than others!
            </InfoTooltip>
          </div>
          <select
            value={curveType}
            onChange={(e) => onCurveTypeChange(e.target.value)}
            disabled={disabled}
            className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {curveTypes.map(ct => (
              <option key={ct.id} value={ct.id}>{ct.name} — {ct.description}</option>
            ))}
          </select>
          <div className="text-xs text-[var(--text-secondary)] bg-[var(--bg-tertiary)] rounded-lg p-3">
            <strong className="text-[var(--accent-secondary)]">🎯 Goal:</strong> Make the purple 
            prediction line match the dashed target line. This demonstrates function approximation!
          </div>
        </motion.div>
      )}

      {selectedProblem === 'digits' && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-xs text-[var(--text-secondary)] bg-[var(--bg-tertiary)] rounded-lg p-3"
        >
          <strong className="text-[var(--accent-secondary)]">🎯 Goal:</strong> Classify 8×8 pixel 
          images of digits (0-9). The network has 64 inputs (pixels) and 10 outputs (digit classes). 
          This is real machine learning in action!
        </motion.div>
      )}
    </div>
  );
}

export default ProblemSelector;
