/**
 * Regression Problem - Curve fitting
 */

export const CURVE_TYPES = {
  sine: {
    name: 'Sine Wave',
    fn: (x) => Math.sin(x * Math.PI * 2) * 0.5 + 0.5,
  },
  quadratic: {
    name: 'Quadratic',
    fn: (x) => Math.pow(x - 0.5, 2) * 4,
  },
  cubic: {
    name: 'Cubic',
    fn: (x) => Math.pow(x - 0.5, 3) * 8 + 0.5,
  },
  step: {
    name: 'Step Function',
    fn: (x) => x < 0.5 ? 0.2 : 0.8,
  },
  gaussian: {
    name: 'Gaussian',
    fn: (x) => Math.exp(-Math.pow((x - 0.5) * 4, 2)),
  },
};

export function generateRegressionData(curveType = 'sine', numSamples = 50, noise = 0.05) {
  const curve = CURVE_TYPES[curveType] || CURVE_TYPES.sine;
  const inputs = [];
  const outputs = [];

  for (let i = 0; i < numSamples; i++) {
    const x = i / (numSamples - 1);
    const y = curve.fn(x) + (Math.random() - 0.5) * noise * 2;
    inputs.push([x]);
    outputs.push(Math.max(0, Math.min(1, y))); // Clamp to [0, 1]
  }

  return { inputs, outputs };
}

export function generateCurvePoints(curveType = 'sine', resolution = 100) {
  const curve = CURVE_TYPES[curveType] || CURVE_TYPES.sine;
  const points = [];
  
  for (let i = 0; i <= resolution; i++) {
    const x = i / resolution;
    points.push({ x, y: curve.fn(x) });
  }

  return points;
}

export const regressionProblemConfig = {
  name: 'Curve Fitting',
  description: 'Learn to approximate different mathematical functions',
  inputSize: 1,
  outputSize: 1,
  defaultHiddenLayers: [8, 8],
  defaultActivation: 'tanh',
  outputActivation: 'sigmoid',
  problemType: 'regression',
  curveTypes: CURVE_TYPES,
  getData: (curveType) => generateRegressionData(curveType, 50, 0.05),
  generateData: generateRegressionData,
  generateCurve: generateCurvePoints,
};

export default regressionProblemConfig;

