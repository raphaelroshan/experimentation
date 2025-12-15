import { motion } from 'framer-motion';
import { InfoSection } from './InfoTooltip';

/**
 * Educational panel explaining neural network concepts
 */
export function EducationalPanel({ problemType }) {
  return (
    <div className="space-y-3">
      <InfoSection title="What is a Neural Network?" defaultOpen={true}>
        <p>
          A <strong className="text-[var(--accent-secondary)]">neural network</strong> is a 
          machine learning model inspired by the human brain. It consists of layers of 
          interconnected <strong className="text-[var(--positive)]">nodes</strong> (neurons) 
          that process information.
        </p>
        <p className="mt-2">
          Each connection has a <strong className="text-[var(--warning)]">weight</strong> that 
          determines how much influence one neuron has on another. During training, these 
          weights are adjusted to minimize errors in predictions.
        </p>
      </InfoSection>

      <InfoSection title="Understanding the Visualization">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="w-3 h-3 rounded-full bg-[var(--positive)] mt-0.5 shrink-0"></span>
            <span><strong>Green nodes:</strong> Positive activation (neuron is "firing")</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-3 h-3 rounded-full bg-[var(--negative)] mt-0.5 shrink-0"></span>
            <span><strong>Red nodes:</strong> Negative activation (inhibited)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-4 h-0.5 bg-[var(--positive)] mt-1.5 shrink-0"></span>
            <span><strong>Green lines:</strong> Positive weights (excitatory connection)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-4 h-0.5 bg-[var(--negative)] mt-1.5 shrink-0"></span>
            <span><strong>Red lines:</strong> Negative weights (inhibitory connection)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-4 h-1 bg-[var(--text-muted)] mt-1 shrink-0"></span>
            <span><strong>Line thickness:</strong> Larger weight magnitude = thicker line</span>
          </div>
        </div>
      </InfoSection>

      <InfoSection title="The Learning Process">
        <ol className="list-decimal list-inside space-y-1.5">
          <li><strong>Forward Pass:</strong> Input data flows through the network, producing a prediction</li>
          <li><strong>Loss Calculation:</strong> The error between prediction and actual value is computed</li>
          <li><strong>Backpropagation:</strong> Gradients flow backward, determining how to adjust weights</li>
          <li><strong>Weight Update:</strong> Weights are adjusted to reduce the error</li>
          <li><strong>Repeat:</strong> This process continues for many epochs until the network learns</li>
        </ol>
      </InfoSection>

      {problemType === 'xor' && (
        <InfoSection title="About XOR Problem">
          <p>
            The <strong className="text-[var(--accent-secondary)]">XOR (exclusive or)</strong> problem 
            is a classic test for neural networks. It outputs 1 when inputs are different, 0 when the same:
          </p>
          <div className="mt-2 grid grid-cols-2 gap-1 text-center font-mono text-xs">
            <div className="bg-[var(--bg-tertiary)] p-1.5 rounded">0 ⊕ 0 = 0</div>
            <div className="bg-[var(--bg-tertiary)] p-1.5 rounded">0 ⊕ 1 = 1</div>
            <div className="bg-[var(--bg-tertiary)] p-1.5 rounded">1 ⊕ 0 = 1</div>
            <div className="bg-[var(--bg-tertiary)] p-1.5 rounded">1 ⊕ 1 = 0</div>
          </div>
          <p className="mt-2">
            This problem is <strong>not linearly separable</strong> — you cannot draw a single 
            straight line to separate the classes. This is why hidden layers are necessary!
          </p>
        </InfoSection>
      )}

      {problemType === 'regression' && (
        <InfoSection title="About Curve Fitting">
          <p>
            <strong className="text-[var(--accent-secondary)]">Regression</strong> is the task of 
            predicting continuous values. Here, the network learns to approximate a mathematical function.
          </p>
          <p className="mt-2">
            Watch how the network's prediction (solid line) gradually matches the target function 
            (dashed line) as training progresses. The yellow dots are training data points.
          </p>
          <p className="mt-2">
            <strong>Why this matters:</strong> This demonstrates the "universal approximation theorem" — 
            neural networks can approximate any continuous function given enough neurons!
          </p>
        </InfoSection>
      )}

      {problemType === 'digits' && (
        <InfoSection title="About Digit Classification">
          <p>
            <strong className="text-[var(--accent-secondary)]">Classification</strong> assigns inputs 
            to discrete categories. Here, the network learns to recognize handwritten digits (0-9) 
            from 8×8 pixel images.
          </p>
          <p className="mt-2">
            The input layer has <strong>64 neurons</strong> (one per pixel), and the output layer 
            has <strong>10 neurons</strong> (one per digit). The output neuron with the highest 
            activation is the predicted digit.
          </p>
          <p className="mt-2">
            <strong>Fun fact:</strong> This is a simplified version of MNIST, a famous dataset 
            used to benchmark machine learning algorithms since 1998!
          </p>
        </InfoSection>
      )}
    </div>
  );
}

export default EducationalPanel;

