# 🧠 Neural Network Visualizer

An interactive, educational web app that visualizes how neural networks learn in real-time. Built with React, TensorFlow.js, and Framer Motion.

![Neural Network Visualizer](https://img.shields.io/badge/React-18-blue) ![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.22-orange) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **Real-time Visualization**: Watch neurons activate and weights adjust during training
- **3 Problem Types**:
  - **XOR Problem** - Classic non-linear classification (Beginner)
  - **Curve Fitting** - Regression with 5 different functions (Intermediate)
  - **Digit Classification** - 8×8 pixel digit recognition (Advanced)
- **Full Interactivity**: Adjust architecture, learning rate, activation functions, and batch size
- **Educational Content**: Tooltips and guides explaining every concept
- **Beautiful UI**: Dark theme with smooth animations and glow effects

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/ai-vibe-hackathon/Raphael-NN-Visualizer.git
cd Raphael-NN-Visualizer

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🎮 How to Use

1. **Select a Problem**: Choose XOR, Regression, or Digits
2. **Configure the Network**: Adjust hidden layers, activation function, learning rate
3. **Train**: Press "Train" to start, watch the network learn!
4. **Explore**: Hover over (?) icons for educational explanations

## 🏗️ Architecture

```
src/
├── components/
│   ├── NetworkVisualizer.jsx   # SVG-based network diagram
│   ├── ControlPanel.jsx        # Training controls & hyperparameters
│   ├── MetricsPanel.jsx        # Loss/accuracy charts
│   ├── DataPreview.jsx         # Decision boundary & predictions
│   ├── EducationalPanel.jsx    # Learning guides
│   └── InfoTooltip.jsx         # Contextual help tooltips
├── engine/
│   ├── network.js              # TensorFlow.js wrapper
│   ├── training.js             # Training loop controller
│   └── problems/               # XOR, Regression, Digits generators
└── hooks/
    ├── useNetwork.js           # Network state management
    └── useTraining.js          # Training state & controls
```

## 🧪 Problem Types Explained

### XOR Problem
The classic test for neural networks - learn the exclusive OR function. Demonstrates why hidden layers are necessary for non-linear problems.

### Curve Fitting (Regression)
Approximate mathematical functions (sine, quadratic, cubic, step, gaussian). Shows the "universal approximation theorem" in action.

### Digit Classification
Recognize 8×8 pixel images of digits (0-9). A simplified version of MNIST - real machine learning!

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TensorFlow.js** - Neural network training in the browser
- **Framer Motion** - Smooth animations
- **Tailwind CSS** - Styling
- **Vite** - Fast build tool

## 📚 Learning Resources

This visualizer helps you understand:
- Forward propagation
- Backpropagation
- Loss functions
- Activation functions (ReLU, Sigmoid, Tanh)
- Hyperparameter tuning
- Overfitting and underfitting

## 📄 License

MIT License - feel free to use, modify, and share!

---

Built with ❤️ for the AI Vibe Hackathon
