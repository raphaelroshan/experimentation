import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Control panel for network architecture and hyperparameters
 */
export function ControlPanel({
  config,
  onConfigChange,
  isTraining,
  isPaused,
  onStart,
  onStop,
  onStep,
  onReset,
  onTogglePause,
  speed,
  onSpeedChange,
}) {
  const [localLayers, setLocalLayers] = useState(config.hiddenLayers.join(', '));

  const handleLayersChange = (value) => {
    setLocalLayers(value);
    const layers = value.split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n) && n > 0 && n <= 32);
    if (layers.length > 0) {
      onConfigChange({ hiddenLayers: layers });
    }
  };

  const activations = ['relu', 'sigmoid', 'tanh'];

  return (
    <div className="glass rounded-xl p-5 space-y-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Controls</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse-glow"></div>
          <span className="text-xs text-[var(--text-muted)]">
            {isTraining ? (isPaused ? 'Paused' : 'Training') : 'Ready'}
          </span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex gap-2">
        {!isTraining ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            className="flex-1 py-2.5 px-4 rounded-lg bg-[var(--accent-primary)] text-white font-medium
                     hover:bg-[var(--accent-secondary)] transition-colors flex items-center justify-center gap-2"
          >
            <PlayIcon /> Train
          </motion.button>
        ) : (
          <>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onTogglePause}
              className="flex-1 py-2.5 px-4 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-medium
                       hover:bg-[var(--text-muted)]/20 transition-colors flex items-center justify-center gap-2"
            >
              {isPaused ? <PlayIcon /> : <PauseIcon />}
              {isPaused ? 'Resume' : 'Pause'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onStop}
              className="py-2.5 px-4 rounded-lg bg-[var(--negative)]/20 text-[var(--negative)] font-medium
                       hover:bg-[var(--negative)]/30 transition-colors"
            >
              <StopIcon />
            </motion.button>
          </>
        )}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStep}
          disabled={isTraining && !isPaused}
          className="py-2.5 px-4 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-medium
                   hover:bg-[var(--text-muted)]/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          title="Single step"
        >
          <StepIcon />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReset}
          className="py-2.5 px-4 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-medium
                   hover:bg-[var(--text-muted)]/20 transition-colors"
          title="Reset network"
        >
          <ResetIcon />
        </motion.button>
      </div>

      {/* Speed Control */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--text-secondary)]">Speed</span>
          <span className="text-[var(--text-muted)]">{speed} epochs/sec</span>
        </div>
        <input
          type="range"
          min="1"
          max="50"
          value={speed}
          onChange={(e) => onSpeedChange(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="h-px bg-[var(--border)]"></div>

      {/* Architecture Controls */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-[var(--text-secondary)]">Architecture</h3>
        
        {/* Hidden Layers */}
        <div className="space-y-2">
          <label className="text-xs text-[var(--text-muted)]">Hidden Layers (comma-separated)</label>
          <input
            type="text"
            value={localLayers}
            onChange={(e) => handleLayersChange(e.target.value)}
            disabled={isTraining}
            className="w-full py-2 px-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)]
                     text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent-primary)]
                     disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="4, 4"
          />
        </div>

        {/* Activation */}
        <div className="space-y-2">
          <label className="text-xs text-[var(--text-muted)]">Activation</label>
          <select
            value={config.activation}
            onChange={(e) => onConfigChange({ activation: e.target.value })}
            disabled={isTraining}
            className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {activations.map(act => (
              <option key={act} value={act}>{act.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="h-px bg-[var(--border)]"></div>

      {/* Hyperparameters */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-[var(--text-secondary)]">Hyperparameters</h3>
        
        {/* Learning Rate */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Learning Rate</span>
            <span className="text-[var(--accent-secondary)]">{config.learningRate.toFixed(3)}</span>
          </div>
          <input
            type="range"
            min="0.001"
            max="1"
            step="0.001"
            value={config.learningRate}
            onChange={(e) => onConfigChange({ learningRate: parseFloat(e.target.value) })}
            disabled={isTraining}
            className="w-full disabled:opacity-50"
          />
        </div>

        {/* Batch Size */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Batch Size</span>
            <span className="text-[var(--accent-secondary)]">{config.batchSize}</span>
          </div>
          <input
            type="range"
            min="1"
            max="32"
            step="1"
            value={config.batchSize}
            onChange={(e) => onConfigChange({ batchSize: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

// Icons
function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4 2.5v11l9-5.5-9-5.5z"/>
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M3 2h4v12H3V2zm6 0h4v12H9V2z"/>
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="3" y="3" width="10" height="10" rx="1"/>
    </svg>
  );
}

function StepIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4 2.5v11l6-5.5-6-5.5zm6 0h3v11h-3V2.5z"/>
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 3a5 5 0 0 0-4.546 2.914L2 5v3h3l-1.31-1.31A3.5 3.5 0 0 1 8 4.5a3.5 3.5 0 0 1 3.5 3.5A3.5 3.5 0 0 1 8 11.5a3.5 3.5 0 0 1-2.95-1.615l-1.31.785A5 5 0 1 0 8 3z"/>
    </svg>
  );
}

export default ControlPanel;

