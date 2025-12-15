import { useState, useRef, useCallback, useEffect } from 'react';
import { TrainingController } from '../engine/training';

export function useTraining(network, data, batchSize, onEpochEnd) {
  const [isTraining, setIsTraining] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [history, setHistory] = useState({ loss: [], accuracy: [] });
  const [speed, setSpeed] = useState(10);

  const controllerRef = useRef(null);

  // Initialize controller
  useEffect(() => {
    controllerRef.current = new TrainingController();
    
    return () => {
      if (controllerRef.current) {
        controllerRef.current.stop();
      }
    };
  }, []);

  // Set up callbacks
  useEffect(() => {
    if (!controllerRef.current) return;

    controllerRef.current.setCallback('onEpochEnd', (result) => {
      setEpoch(result.epoch);
      setLoss(result.loss);
      setAccuracy(result.accuracy);
      setHistory(result.history);
      
      if (onEpochEnd) {
        onEpochEnd(result);
      }
    });

    controllerRef.current.setCallback('onTrainingStart', () => {
      setIsTraining(true);
      setIsPaused(false);
    });

    controllerRef.current.setCallback('onTrainingEnd', () => {
      setIsTraining(false);
      setIsPaused(false);
    });

    controllerRef.current.setCallback('onPause', () => {
      setIsPaused(true);
    });

    controllerRef.current.setCallback('onResume', () => {
      setIsPaused(false);
    });
  }, [onEpochEnd]);

  // Update speed
  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.setSpeed(speed);
    }
  }, [speed]);

  // Start training
  const start = useCallback(() => {
    if (!network || !data || !controllerRef.current) return;
    controllerRef.current.start(network, data, batchSize);
  }, [network, data, batchSize]);

  // Stop training
  const stop = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.stop();
    }
  }, []);

  // Toggle pause
  const togglePause = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.toggle();
    }
  }, []);

  // Single step
  const step = useCallback(async () => {
    if (!network || !data || !controllerRef.current) return;
    await controllerRef.current.step(network, data, batchSize);
  }, [network, data, batchSize]);

  // Reset training state
  const resetState = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.stop();
    }
    setEpoch(0);
    setLoss(null);
    setAccuracy(null);
    setHistory({ loss: [], accuracy: [] });
  }, []);

  return {
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
  };
}

export default useTraining;

