import { useState, useCallback, useRef, useEffect } from 'react';
import { NeuralNetwork } from '../engine/network';
import { xorProblemConfig } from '../engine/problems/xor';
import { regressionProblemConfig } from '../engine/problems/regression';
import { digitsProblemConfig } from '../engine/problems/digits';

const problemConfigs = {
  xor: xorProblemConfig,
  regression: regressionProblemConfig,
  digits: digitsProblemConfig,
};

export function useNetwork(initialProblem = 'xor') {
  const [problemType, setProblemType] = useState(initialProblem);
  const [curveType, setCurveType] = useState('sine');
  const [config, setConfig] = useState(() => {
    const problemConfig = problemConfigs[initialProblem];
    return {
      inputSize: problemConfig.inputSize,
      outputSize: problemConfig.outputSize,
      hiddenLayers: [...problemConfig.defaultHiddenLayers],
      activation: problemConfig.defaultActivation,
      outputActivation: problemConfig.outputActivation,
      learningRate: 0.1,
      batchSize: 4,
      problemType: problemConfig.problemType,
    };
  });

  const [data, setData] = useState(null);
  const [weights, setWeights] = useState([]);
  const [activations, setActivations] = useState([]);
  const [predictions, setPredictions] = useState(null);
  const [network, setNetwork] = useState(null);
  
  const networkRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Initialize network and data
  const initialize = useCallback(() => {
    const problemConfig = problemConfigs[problemType];
    
    // Generate data
    let newData;
    if (problemType === 'regression') {
      newData = problemConfig.generateData(curveType, 50, 0.05);
    } else if (problemType === 'digits') {
      newData = problemConfig.generateData(10, 0.15);
    } else {
      newData = problemConfig.getData();
    }
    setData(newData);

    // Create network
    const newConfig = {
      inputSize: problemConfig.inputSize,
      outputSize: problemConfig.outputSize,
      hiddenLayers: config.hiddenLayers,
      activation: config.activation,
      outputActivation: problemConfig.outputActivation,
      learningRate: config.learningRate,
      problemType: problemConfig.problemType,
    };

    // Dispose of existing model safely
    if (networkRef.current && networkRef.current.model) {
      try {
        networkRef.current.model.dispose();
      } catch (e) {
        // Model already disposed, ignore
      }
    }

    const newNetwork = new NeuralNetwork(newConfig);
    networkRef.current = newNetwork;
    setNetwork(newNetwork);
    setWeights(newNetwork.weights);
    setActivations([]);
    setPredictions(null);

    return { network: newNetwork, data: newData };
  }, [problemType, curveType, config]);

  // Initialize on mount and when problem/config changes
  useEffect(() => {
    // Prevent double initialization in StrictMode
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      initialize();
    }
    
    return () => {
      // Only dispose on actual unmount, not StrictMode re-runs
      // We'll handle disposal in initialize() when creating new network
    };
  }, []);

  // Re-initialize when problem type or curve type changes
  useEffect(() => {
    if (isInitializedRef.current) {
      initialize();
    }
  }, [problemType, curveType]);

  // Update config
  const updateConfig = useCallback((updates) => {
    setConfig(prev => {
      const newConfig = { ...prev, ...updates };
      
      // Rebuild network if architecture changes
      if (updates.hiddenLayers || updates.activation) {
        if (networkRef.current) {
          networkRef.current.updateConfig({
            hiddenLayers: newConfig.hiddenLayers,
            activation: newConfig.activation,
            learningRate: newConfig.learningRate,
          });
          setWeights(networkRef.current.weights);
          setActivations([]);
          setPredictions(null);
          setNetwork(networkRef.current);
        }
      }
      
      return newConfig;
    });
  }, []);

  // Change problem type
  const changeProblem = useCallback((newProblem) => {
    const problemConfig = problemConfigs[newProblem];
    setProblemType(newProblem);
    setConfig(prev => ({
      ...prev,
      inputSize: problemConfig.inputSize,
      outputSize: problemConfig.outputSize,
      hiddenLayers: [...problemConfig.defaultHiddenLayers],
      activation: problemConfig.defaultActivation,
      problemType: problemConfig.problemType,
    }));
  }, []);

  // Update state after training step
  const updateFromTraining = useCallback(({ weights: w, activations: a }) => {
    setWeights(w);
    setActivations(a);
    
    // Update predictions
    if (networkRef.current && data) {
      try {
        if (problemType === 'regression') {
          // Generate prediction curve
          const curveInputs = [];
          for (let i = 0; i <= 100; i++) {
            curveInputs.push([i / 100]);
          }
          const preds = networkRef.current.predict(curveInputs);
          setPredictions(preds);
        } else {
          const preds = networkRef.current.predict(data.inputs);
          setPredictions(preds);
        }
      } catch (e) {
        // Network might be disposed, ignore
      }
    }
  }, [data, problemType]);

  // Reset network
  const reset = useCallback(() => {
    initialize();
  }, [initialize]);

  // Get architecture for visualization
  const getArchitecture = useCallback(() => {
    if (networkRef.current) {
      return networkRef.current.getArchitecture();
    }
    return [config.inputSize, ...config.hiddenLayers, config.outputSize];
  }, [config]);

  return {
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
  };
}

export default useNetwork;
