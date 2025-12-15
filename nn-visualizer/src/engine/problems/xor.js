/**
 * XOR Problem - Classic non-linear classification problem
 */

export const XOR_DATA = {
  inputs: [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ],
  outputs: [0, 1, 1, 0],
};

export function generateXORData(numSamples = 100, noise = 0.1) {
  const inputs = [];
  const outputs = [];

  for (let i = 0; i < numSamples; i++) {
    const x1 = Math.random() > 0.5 ? 1 : 0;
    const x2 = Math.random() > 0.5 ? 1 : 0;
    
    // Add noise to inputs
    const noisyX1 = x1 + (Math.random() - 0.5) * noise;
    const noisyX2 = x2 + (Math.random() - 0.5) * noise;
    
    inputs.push([noisyX1, noisyX2]);
    outputs.push(x1 ^ x2); // XOR operation
  }

  return { inputs, outputs };
}

export function generateDecisionBoundaryGrid(resolution = 50) {
  const points = [];
  for (let i = 0; i <= resolution; i++) {
    for (let j = 0; j <= resolution; j++) {
      points.push([i / resolution, j / resolution]);
    }
  }
  return points;
}

export const xorProblemConfig = {
  name: 'XOR Problem',
  description: 'Learn the XOR (exclusive or) function - a classic non-linearly separable problem',
  inputSize: 2,
  outputSize: 1,
  defaultHiddenLayers: [4, 4],
  defaultActivation: 'tanh',
  outputActivation: 'sigmoid',
  problemType: 'classification',
  getData: () => XOR_DATA,
  generateData: generateXORData,
  generateGrid: generateDecisionBoundaryGrid,
};

export default xorProblemConfig;

