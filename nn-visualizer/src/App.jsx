import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { NetworkVisualizer } from './components/NetworkVisualizer';
import { ControlPanel } from './components/ControlPanel';
import { MetricsPanel } from './components/MetricsPanel';
import { ProblemSelector } from './components/ProblemSelector';
import { DataPreview } from './components/DataPreview';
import { useNetwork } from './hooks/useNetwork';
import { useTraining } from './hooks/useTraining';
import './index.css';

function App() {
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
    <div className="min-h-screen bg-[var(--bg-primary)] p-6">
      {/* Header */}
      <motion.header 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
          Neural Network Visualizer
        </h1>
        <p className="text-[var(--text-muted)]">
          Watch neural networks learn in real-time
        </p>
      </motion.header>

      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar - Controls */}
        <motion.aside 
          className="lg:col-span-3 space-y-6"
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
          className="lg:col-span-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="glass rounded-xl p-6 glow-box">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Network Architecture
              </h2>
              <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                {architecture.map((n, i) => (
                  <span key={i} className="flex items-center">
                    <span className="px-2 py-0.5 rounded bg-[var(--bg-tertiary)]">{n}</span>
                    {i < architecture.length - 1 && <span className="mx-1">→</span>}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="aspect-[3/2] w-full flex items-center justify-center">
              <NetworkVisualizer
                architecture={architecture}
                weights={weights}
                activations={activations}
                width={550}
                height={380}
              />
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-4 text-xs text-[var(--text-muted)]">
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
        </motion.main>

        {/* Right Sidebar - Metrics & Data */}
        <motion.aside 
          className="lg:col-span-3 space-y-6"
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
          
          <DataPreview
            problemType={problemType}
            data={data}
            predictions={predictions}
            network={network}
            curveType={curveType}
          />
        </motion.aside>
      </div>

      {/* Footer */}
      <footer className="text-center mt-12 text-xs text-[var(--text-muted)]">
        <p>Built with React, TensorFlow.js, and Framer Motion</p>
      </footer>
    </div>
  );
}

export default App;
