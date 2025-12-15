import * as tf from '@tensorflow/tfjs';

/**
 * Neural Network Engine - TensorFlow.js wrapper for dynamic network creation
 */
export class NeuralNetwork {
  constructor(config = {}) {
    this.config = {
      inputSize: config.inputSize || 2,
      outputSize: config.outputSize || 1,
      hiddenLayers: config.hiddenLayers || [4, 4],
      activation: config.activation || 'relu',
      outputActivation: config.outputActivation || 'sigmoid',
      learningRate: config.learningRate || 0.1,
      problemType: config.problemType || 'classification', // 'classification' or 'regression'
    };
    
    this.model = null;
    this.weights = [];
    this.activations = [];
    this.history = { loss: [], accuracy: [] };
    this.epoch = 0;
    this.isDisposed = false;
    
    this.build();
  }

  build() {
    // Dispose of existing model if any
    if (this.model && !this.isDisposed) {
      try {
        this.model.dispose();
      } catch (e) {
        // Already disposed, ignore
      }
    }
    
    this.isDisposed = false;

    const { inputSize, outputSize, hiddenLayers, activation, outputActivation, learningRate, problemType } = this.config;

    this.model = tf.sequential();

    // Input layer + first hidden layer
    this.model.add(tf.layers.dense({
      inputShape: [inputSize],
      units: hiddenLayers[0] || 4,
      activation: activation,
      kernelInitializer: 'glorotUniform',
    }));

    // Additional hidden layers
    for (let i = 1; i < hiddenLayers.length; i++) {
      this.model.add(tf.layers.dense({
        units: hiddenLayers[i],
        activation: activation,
        kernelInitializer: 'glorotUniform',
      }));
    }

    // Output layer
    this.model.add(tf.layers.dense({
      units: outputSize,
      activation: outputActivation,
      kernelInitializer: 'glorotUniform',
    }));

    // Compile
    const loss = problemType === 'regression' ? 'meanSquaredError' : 
                 outputSize > 1 ? 'categoricalCrossentropy' : 'binaryCrossentropy';
    
    const metrics = problemType === 'regression' ? ['mse'] : ['accuracy'];

    this.model.compile({
      optimizer: tf.train.adam(learningRate),
      loss: loss,
      metrics: metrics,
    });

    // Extract initial weights
    this.extractWeights();
    this.epoch = 0;
    this.history = { loss: [], accuracy: [] };
  }

  extractWeights() {
    if (this.isDisposed || !this.model) return;
    
    this.weights = [];
    for (const layer of this.model.layers) {
      const layerWeights = layer.getWeights();
      if (layerWeights.length > 0) {
        const kernelData = layerWeights[0].arraySync();
        const biasData = layerWeights[1] ? layerWeights[1].arraySync() : null;
        this.weights.push({ kernel: kernelData, bias: biasData });
      }
    }
  }

  async extractActivations(inputData) {
    if (this.isDisposed || !this.model) return this.activations;
    
    this.activations = [];
    
    // Input layer activations
    this.activations.push(inputData[0] || inputData);

    // Get intermediate outputs
    let currentInput = tf.tensor2d([inputData[0] || inputData]);
    
    for (let i = 0; i < this.model.layers.length; i++) {
      const layer = this.model.layers[i];
      const output = layer.apply(currentInput);
      const outputData = await output.array();
      this.activations.push(outputData[0]);
      currentInput.dispose();
      currentInput = output;
    }
    
    currentInput.dispose();
    return this.activations;
  }

  async trainStep(xs, ys, batchSize = 4) {
    if (this.isDisposed || !this.model) return { loss: 0, accuracy: 0, epoch: this.epoch };
    
    const xTensor = tf.tensor2d(xs);
    const yTensor = this.config.outputSize > 1 ? tf.tensor2d(ys) : tf.tensor2d(ys, [ys.length, 1]);

    const result = await this.model.fit(xTensor, yTensor, {
      epochs: 1,
      batchSize: batchSize,
      shuffle: true,
      verbose: 0,
    });

    xTensor.dispose();
    yTensor.dispose();

    const loss = result.history.loss[0];
    const accuracy = result.history.acc ? result.history.acc[0] : 
                     result.history.accuracy ? result.history.accuracy[0] : null;

    this.history.loss.push(loss);
    if (accuracy !== null) {
      this.history.accuracy.push(accuracy);
    }

    this.epoch++;
    this.extractWeights();

    return { loss, accuracy, epoch: this.epoch };
  }

  predict(inputs) {
    if (this.isDisposed || !this.model) return [];
    
    const inputTensor = tf.tensor2d(inputs);
    const prediction = this.model.predict(inputTensor);
    const result = prediction.arraySync();
    inputTensor.dispose();
    prediction.dispose();
    return result;
  }

  getArchitecture() {
    const layers = [this.config.inputSize];
    for (const neurons of this.config.hiddenLayers) {
      layers.push(neurons);
    }
    layers.push(this.config.outputSize);
    return layers;
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.build();
  }

  reset() {
    this.build();
  }

  dispose() {
    if (this.model && !this.isDisposed) {
      try {
        this.model.dispose();
        this.isDisposed = true;
      } catch (e) {
        // Already disposed, ignore
      }
    }
  }
}

export default NeuralNetwork;
