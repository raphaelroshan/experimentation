/**
 * Training loop with callbacks for visualization
 */

export class TrainingController {
  constructor() {
    this.isTraining = false;
    this.isPaused = false;
    this.speed = 10; // epochs per second
    this.callbacks = {
      onEpochEnd: null,
      onTrainingStart: null,
      onTrainingEnd: null,
      onPause: null,
      onResume: null,
    };
    this.animationFrameId = null;
    this.lastUpdateTime = 0;
  }

  setCallback(name, fn) {
    if (name in this.callbacks) {
      this.callbacks[name] = fn;
    }
  }

  setSpeed(epochsPerSecond) {
    this.speed = Math.max(1, Math.min(100, epochsPerSecond));
  }

  async start(network, data, batchSize = 4) {
    if (this.isTraining) return;
    
    this.isTraining = true;
    this.isPaused = false;

    if (this.callbacks.onTrainingStart) {
      this.callbacks.onTrainingStart();
    }

    const epochInterval = 1000 / this.speed;

    const trainLoop = async (timestamp) => {
      if (!this.isTraining) return;

      if (this.isPaused) {
        this.animationFrameId = requestAnimationFrame(trainLoop);
        return;
      }

      if (timestamp - this.lastUpdateTime >= epochInterval) {
        this.lastUpdateTime = timestamp;

        try {
          const result = await network.trainStep(data.inputs, data.outputs, batchSize);
          
          if (this.callbacks.onEpochEnd) {
            await network.extractActivations(data.inputs);
            this.callbacks.onEpochEnd({
              epoch: result.epoch,
              loss: result.loss,
              accuracy: result.accuracy,
              weights: network.weights,
              activations: network.activations,
              history: network.history,
            });
          }
        } catch (error) {
          console.error('Training error:', error);
          this.stop();
          return;
        }
      }

      this.animationFrameId = requestAnimationFrame(trainLoop);
    };

    this.animationFrameId = requestAnimationFrame(trainLoop);
  }

  async step(network, data, batchSize = 4) {
    if (this.isTraining && !this.isPaused) return;

    try {
      const result = await network.trainStep(data.inputs, data.outputs, batchSize);
      await network.extractActivations(data.inputs);
      
      if (this.callbacks.onEpochEnd) {
        this.callbacks.onEpochEnd({
          epoch: result.epoch,
          loss: result.loss,
          accuracy: result.accuracy,
          weights: network.weights,
          activations: network.activations,
          history: network.history,
        });
      }

      return result;
    } catch (error) {
      console.error('Step error:', error);
    }
  }

  pause() {
    this.isPaused = true;
    if (this.callbacks.onPause) {
      this.callbacks.onPause();
    }
  }

  resume() {
    this.isPaused = false;
    if (this.callbacks.onResume) {
      this.callbacks.onResume();
    }
  }

  stop() {
    this.isTraining = false;
    this.isPaused = false;
    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.callbacks.onTrainingEnd) {
      this.callbacks.onTrainingEnd();
    }
  }

  toggle() {
    if (!this.isTraining) return;
    
    if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  }
}

export default TrainingController;

