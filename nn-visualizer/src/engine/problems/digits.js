/**
 * Digit Classification Problem - Simple 8x8 digit recognition
 * Using a subset of patterns for each digit
 */

// 8x8 pixel patterns for digits 0-9 (simplified)
const DIGIT_PATTERNS = {
  0: [
    [0,1,1,1,1,1,1,0],
    [1,1,0,0,0,0,1,1],
    [1,1,0,0,0,0,1,1],
    [1,1,0,0,0,0,1,1],
    [1,1,0,0,0,0,1,1],
    [1,1,0,0,0,0,1,1],
    [1,1,0,0,0,0,1,1],
    [0,1,1,1,1,1,1,0],
  ],
  1: [
    [0,0,0,1,1,0,0,0],
    [0,0,1,1,1,0,0,0],
    [0,1,0,1,1,0,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,0,1,1,0,0,0],
    [0,1,1,1,1,1,1,0],
  ],
  2: [
    [0,1,1,1,1,1,0,0],
    [1,1,0,0,0,1,1,0],
    [0,0,0,0,0,1,1,0],
    [0,0,0,0,1,1,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,1,1,0,0,0,0],
    [0,1,1,0,0,0,0,0],
    [1,1,1,1,1,1,1,0],
  ],
  3: [
    [0,1,1,1,1,1,0,0],
    [1,0,0,0,0,1,1,0],
    [0,0,0,0,0,1,1,0],
    [0,0,1,1,1,1,0,0],
    [0,0,0,0,0,1,1,0],
    [0,0,0,0,0,1,1,0],
    [1,0,0,0,0,1,1,0],
    [0,1,1,1,1,1,0,0],
  ],
  4: [
    [0,0,0,0,1,1,0,0],
    [0,0,0,1,1,1,0,0],
    [0,0,1,1,1,1,0,0],
    [0,1,1,0,1,1,0,0],
    [1,1,0,0,1,1,0,0],
    [1,1,1,1,1,1,1,1],
    [0,0,0,0,1,1,0,0],
    [0,0,0,0,1,1,0,0],
  ],
  5: [
    [1,1,1,1,1,1,1,0],
    [1,1,0,0,0,0,0,0],
    [1,1,0,0,0,0,0,0],
    [1,1,1,1,1,1,0,0],
    [0,0,0,0,0,1,1,0],
    [0,0,0,0,0,1,1,0],
    [1,0,0,0,0,1,1,0],
    [0,1,1,1,1,1,0,0],
  ],
  6: [
    [0,0,1,1,1,1,0,0],
    [0,1,1,0,0,0,0,0],
    [1,1,0,0,0,0,0,0],
    [1,1,1,1,1,1,0,0],
    [1,1,0,0,0,1,1,0],
    [1,1,0,0,0,1,1,0],
    [1,1,0,0,0,1,1,0],
    [0,1,1,1,1,1,0,0],
  ],
  7: [
    [1,1,1,1,1,1,1,0],
    [0,0,0,0,0,1,1,0],
    [0,0,0,0,1,1,0,0],
    [0,0,0,0,1,1,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,1,1,0,0,0,0],
    [0,0,1,1,0,0,0,0],
  ],
  8: [
    [0,1,1,1,1,1,0,0],
    [1,1,0,0,0,1,1,0],
    [1,1,0,0,0,1,1,0],
    [0,1,1,1,1,1,0,0],
    [1,1,0,0,0,1,1,0],
    [1,1,0,0,0,1,1,0],
    [1,1,0,0,0,1,1,0],
    [0,1,1,1,1,1,0,0],
  ],
  9: [
    [0,1,1,1,1,1,0,0],
    [1,1,0,0,0,1,1,0],
    [1,1,0,0,0,1,1,0],
    [1,1,0,0,0,1,1,0],
    [0,1,1,1,1,1,1,0],
    [0,0,0,0,0,1,1,0],
    [0,0,0,0,1,1,0,0],
    [0,1,1,1,1,0,0,0],
  ],
};

function addNoise(pattern, noiseLevel = 0.1) {
  return pattern.map(row => 
    row.map(pixel => {
      const noise = (Math.random() - 0.5) * noiseLevel * 2;
      return Math.max(0, Math.min(1, pixel + noise));
    })
  );
}

function flattenPattern(pattern) {
  return pattern.flat();
}

function oneHotEncode(digit, numClasses = 10) {
  const encoded = new Array(numClasses).fill(0);
  encoded[digit] = 1;
  return encoded;
}

export function generateDigitData(numSamplesPerDigit = 10, noise = 0.15) {
  const inputs = [];
  const outputs = [];
  const labels = [];

  for (let digit = 0; digit <= 9; digit++) {
    const basePattern = DIGIT_PATTERNS[digit];
    
    for (let i = 0; i < numSamplesPerDigit; i++) {
      const noisyPattern = addNoise(basePattern, noise);
      inputs.push(flattenPattern(noisyPattern));
      outputs.push(oneHotEncode(digit));
      labels.push(digit);
    }
  }

  // Shuffle data
  const indices = [...Array(inputs.length).keys()];
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  return {
    inputs: indices.map(i => inputs[i]),
    outputs: indices.map(i => outputs[i]),
    labels: indices.map(i => labels[i]),
  };
}

export function getDigitPattern(digit) {
  return DIGIT_PATTERNS[digit] || DIGIT_PATTERNS[0];
}

export function computeConfusionMatrix(predictions, labels, numClasses = 10) {
  const matrix = Array(numClasses).fill(null).map(() => Array(numClasses).fill(0));
  
  for (let i = 0; i < predictions.length; i++) {
    const predicted = predictions[i].indexOf(Math.max(...predictions[i]));
    const actual = labels[i];
    matrix[actual][predicted]++;
  }

  return matrix;
}

export const digitsProblemConfig = {
  name: 'Digit Classification',
  description: 'Recognize handwritten digits (0-9) from 8x8 pixel images',
  inputSize: 64, // 8x8
  outputSize: 10,
  defaultHiddenLayers: [32, 16],
  defaultActivation: 'relu',
  outputActivation: 'softmax',
  problemType: 'classification',
  getData: () => generateDigitData(10, 0.15),
  generateData: generateDigitData,
  getPattern: getDigitPattern,
  computeConfusion: computeConfusionMatrix,
};

export default digitsProblemConfig;

