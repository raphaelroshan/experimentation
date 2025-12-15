import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { NetworkVisualizer } from './components/NetworkVisualizer';
import { ControlPanel } from './components/ControlPanel';
import { MetricsPanel } from './components/MetricsPanel';
import { ProblemSelector } from './components/ProblemSelector';
import { DataPreview } from './components/DataPreview';
import { EducationalPanel } from './components/EducationalPanel';
import { useNetwork } from './hooks/useNetwork';
import { useTraining } from './hooks/useTraining';
import './index.css';

function App() {
  const [showEducation, setShowEducation] = useState(true);

  const {
    network,
    config,
    updateConfig,
    problemType,
    changeProblem,
    curveType,
    setCurveType,
    data,
    weights,
    activations,
    predictions,
    updateFromTraining,
    reset,
    getArchitecture,
    initialize,
  } = useNetwork('xor');

  const handleEpochEnd = useCallback((result) => {
    updateFromTraining(result);
  }, [updateFromTraining]);

  const {
    isTraining,
    isPaused,
    epoch,
    loss,
    accuracy,
    history,
    speed,
    setSpeed,
    start,
    stop,
    togglePause,
    step,
    resetState,
  } = useTraining(network, data, config.batchSize, handleEpochEnd);

  // Handle reset - reset both network and training state
  const handleReset = useCallback(() => {
    stop();
    resetState();
    reset();
  }, [stop, resetState, reset]);

  // Re-initialize when problem changes
  useEffect(() => {
    stop();
    resetState();
  }, [problemType, curveType]);

  // Handle config changes that require network rebuild
  const handleConfigChange = useCallback((updates) => {
    if (updates.hiddenLayers || updates.activation) {
      stop();
      resetState();
    }
    updateConfig(updates);
  }, [updateConfig, stop, resetState]);

  // Handle problem change
  const handleProblemChange = useCallback((newProblem) => {
    stop();
    resetState();
    changeProblem(newProblem);
  }, [changeProblem, stop, resetState]);

  const architecture = getArchitecture();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-4 lg:p-6">
      {/* Header */}
      <motion.header 
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-[var(--text-primary)] mb-2">
          🧠 Neural Network Visualizer
        </h1>
        <p className="text-[var(--text-muted)] text-sm lg:text-base max-w-2xl mx-auto">
          Watch how neural networks learn! Experiment with different architectures, 
          hyperparameters, and problems to understand deep learning.
        </p>
        
        {/* Toggle Education Panel */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowEducation(!showEducation)}
          className="mt-3 text-xs px-3 py-1.5 rounded-full bg-[var(--accent-primary)]/20 
                     text-[var(--accent-secondary)] hover:bg-[var(--accent-primary)]/30 transition-colors"
        >
          {showEducation ? '📕 Hide' : '📖 Show'} Learning Guide
        </motion.button>
      </motion.header>

      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        
        {/* Left Sidebar - Controls */}
        <motion.aside 
          className="lg:col-span-3 space-y-4 lg:space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ProblemSelector
            selectedProblem={problemType}
            onSelect={handleProblemChange}
            disabled={isTraining && !isPaused}
            curveType={curveType}
            onCurveTypeChange={setCurveType}
          />
          
          <ControlPanel
            config={config}
            onConfigChange={handleConfigChange}
            isTraining={isTraining}
            isPaused={isPaused}
            onStart={start}
            onStop={stop}
            onStep={step}
            onReset={handleReset}
            onTogglePause={togglePause}
            speed={speed}
            onSpeedChange={setSpeed}
          />
        </motion.aside>

        {/* Main Content - Network Visualization */}
        <motion.main 
          className="lg:col-span-6 space-y-4 lg:space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="glass rounded-xl p-4 lg:p-6 glow-box">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
      <div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                  Network Architecture
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Watch neurons activate and weights adjust during training
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                {architecture.map((n, i) => (
                  <span key={i} className="flex items-center">
                    <span className="px-2 py-0.5 rounded bg-[var(--bg-tertiary)] font-mono">{n}</span>
                    {i < architecture.length - 1 && <span className="mx-1 text-[var(--accent-primary)]">→</span>}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="aspect-[3/2] w-full flex items-center justify-center bg-[var(--bg-tertiary)]/30 rounded-lg">
              <NetworkVisualizer
                architecture={architecture}
                weights={weights}
                activations={activations}
                width={550}
                height={380}
              />
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 lg:gap-6 mt-4 text-xs text-[var(--text-muted)]">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[var(--positive)]"></span>
                Positive activation
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[var(--negative)]"></span>
                Negative activation
              </span>
              <span className="flex items-center gap-2">
                <span className="w-4 h-0.5 bg-[var(--positive)]"></span>
                Positive weight
              </span>
              <span className="flex items-center gap-2">
                <span className="w-4 h-0.5 bg-[var(--negative)]"></span>
                Negative weight
              </span>
            </div>
          </div>

          {/* Data Preview */}
          <DataPreview
            problemType={problemType}
            data={data}
            predictions={predictions}
            network={network}
            curveType={curveType}
          />

          {/* Educational Panel (collapsible, shown below main viz on mobile) */}
          {showEducation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden"
            >
              <EducationalPanel problemType={problemType} />
            </motion.div>
          )}
        </motion.main>

        {/* Right Sidebar - Metrics & Education */}
        <motion.aside 
          className="lg:col-span-3 space-y-4 lg:space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <MetricsPanel
            history={history}
            epoch={epoch}
            currentLoss={loss}
            currentAccuracy={accuracy}
            problemType={config.problemType}
          />
          
          {/* Educational Panel (desktop) */}
          {showEducation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="hidden lg:block"
            >
              <EducationalPanel problemType={problemType} />
            </motion.div>
          )}

          {/* Quick Tips */}
          <QuickTips epoch={epoch} isTraining={isTraining} loss={loss} />
        </motion.aside>
      </div>

      {/* Footer */}
      <footer className="text-center mt-8 lg:mt-12 text-xs text-[var(--text-muted)] space-y-1">
        <p>Built with React, TensorFlow.js, and Framer Motion</p>
        <p className="text-[var(--accent-secondary)]">
          💡 Tip: Hover over any (?) icon for helpful explanations!
        </p>
      </footer>
      </div>
  );
}

function QuickTips({ epoch, isTraining, loss }) {
  const tips = [
    { condition: epoch === 0 && !isTraining, text: "👆 Press 'Train' to start learning!", priority: 10 },
    { condition: epoch > 0 && epoch < 5, text: "👀 Watch the weights (lines) change as the network learns", priority: 5 },
    { condition: epoch >= 5 && epoch < 20, text: "📉 The loss should be decreasing if learning is working", priority: 4 },
    { condition: epoch >= 20 && loss !== null && loss < 0.1, text: "🎉 Great progress! The network is learning well", priority: 3 },
    { condition: epoch >= 50 && loss !== null && loss > 0.3, text: "🔧 Try adjusting the learning rate or adding more neurons", priority: 8 },
    { condition: !isTraining && epoch > 10, text: "🔄 Press 'Reset' to start fresh with new random weights", priority: 2 },
  ];

  const activeTip = tips
    .filter(t => t.condition)
    .sort((a, b) => b.priority - a.priority)[0];

  if (!activeTip) return null;

  return (
    <motion.div
      key={activeTip.text}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-4"
    >
      <h3 className="text-sm font-medium text-[var(--text-primary)] mb-2">💡 Quick Tip</h3>
      <p className="text-xs text-[var(--text-secondary)]">{activeTip.text}</p>
    </motion.div>
  );
}

export default App;
