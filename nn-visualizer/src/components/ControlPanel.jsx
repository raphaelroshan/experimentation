import { useState } from 'react';
import { motion } from 'framer-motion';
import { InfoTooltip } from './InfoTooltip';

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

  const activationDescriptions = {
    relu: 'ReLU (Rectified Linear Unit): Outputs the input if positive, else 0. Fast and effective, but can "die" if weights become very negative.',
    sigmoid: 'Sigmoid: Squashes values to 0-1 range. Great for probabilities but can cause vanishing gradients in deep networks.',
    tanh: 'Tanh: Squashes values to -1 to 1 range. Zero-centered, often better than sigmoid for hidden layers.',
  };

  return (
    <div className="glass rounded-xl p-5 space-y-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Controls</h2>
          <InfoTooltip title="Training Controls">
            Use these controls to train your neural network. Press <strong>Train</strong> to start, 
            <strong>Pause</strong> to freeze, <strong>Step</strong> to advance one epoch at a time, 
            and <strong>Reset</strong> to reinitialize weights randomly.
          </InfoTooltip>
        </div>
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
          title="Single step (one epoch)"
        >
          <StepIcon />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReset}
          className="py-2.5 px-4 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-medium
                   hover:bg-[var(--text-muted)]/20 transition-colors"
          title="Reset network (reinitialize weights)"
        >
          <ResetIcon />
        </motion.button>
      </div>

      {/* Speed Control */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <div className="flex items-center">
            <span className="text-[var(--text-secondary)]">Training Speed</span>
            <InfoTooltip title="Epochs per Second">
              Controls how fast the network trains. Higher values = faster training but less time 
              to observe changes. Lower values let you watch the learning process more carefully.
            </InfoTooltip>
          </div>
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
        <div className="flex items-center">
          <h3 className="text-sm font-medium text-[var(--text-secondary)]">Architecture</h3>
          <InfoTooltip title="Network Architecture">
            The architecture defines the structure of your neural network. More layers and neurons 
            can learn more complex patterns, but may also overfit or train slower.
          </InfoTooltip>
        </div>
        
        {/* Hidden Layers */}
        <div className="space-y-2">
          <div className="flex items-center">
            <label className="text-xs text-[var(--text-muted)]">Hidden Layers</label>
            <InfoTooltip title="Hidden Layers">
              <p>Hidden layers are the layers between input and output. Enter neuron counts separated by commas.</p>
              <p className="mt-1"><strong>Example:</strong> "4, 4" = two hidden layers with 4 neurons each.</p>
              <p className="mt-1"><strong>Tip:</strong> Start small! More neurons can learn complex patterns but train slower.</p>
            </InfoTooltip>
          </div>
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
          <div className="flex items-center">
            <label className="text-xs text-[var(--text-muted)]">Activation Function</label>
            <InfoTooltip title="Activation Functions">
              <p>Activation functions introduce non-linearity, allowing networks to learn complex patterns.</p>
              <p className="mt-1 text-[var(--accent-secondary)]">{activationDescriptions[config.activation]}</p>
            </InfoTooltip>
          </div>
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
        <div className="flex items-center">
          <h3 className="text-sm font-medium text-[var(--text-secondary)]">Hyperparameters</h3>
          <InfoTooltip title="Hyperparameters">
            Settings that control how the network learns. Unlike weights, these are set before 
            training and don't change during the learning process.
          </InfoTooltip>
        </div>
        
        {/* Learning Rate */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <div className="flex items-center">
              <span className="text-[var(--text-muted)]">Learning Rate</span>
              <InfoTooltip title="Learning Rate (α)">
                <p>Controls how big of a step the network takes when adjusting weights.</p>
                <p className="mt-1"><strong>Too high:</strong> Fast but may overshoot optimal values (unstable)</p>
                <p className="mt-1"><strong>Too low:</strong> Stable but very slow to learn</p>
                <p className="mt-1"><strong>Sweet spot:</strong> Usually between 0.001 and 0.1</p>
              </InfoTooltip>
            </div>
            <span className="text-[var(--accent-secondary)] font-mono">{config.learningRate.toFixed(3)}</span>
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
          <div className="flex justify-between text-xs text-[var(--text-muted)]">
            <span>0.001 (slow)</span>
            <span>1.0 (fast)</span>
          </div>
        </div>

        {/* Batch Size */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <div className="flex items-center">
              <span className="text-[var(--text-muted)]">Batch Size</span>
              <InfoTooltip title="Batch Size">
                <p>Number of training examples used in one weight update.</p>
                <p className="mt-1"><strong>Small batch:</strong> Noisier gradients, can help escape local minima</p>
                <p className="mt-1"><strong>Large batch:</strong> Smoother gradients, more stable training</p>
                <p className="mt-1">For small datasets, batch size = 4 often works well.</p>
              </InfoTooltip>
            </div>
            <span className="text-[var(--accent-secondary)] font-mono">{config.batchSize}</span>
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
          <div className="flex justify-between text-xs text-[var(--text-muted)]">
            <span>1 (noisy)</span>
            <span>32 (smooth)</span>
          </div>
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
