import * as tf from '@tensorflow/tfjs';
import FFT from 'fft.js';

export class AudioProcessor {
  private fft: FFT;
  private sampleRate: number;

  constructor(sampleRate: number = 44100) {
    this.fft = new FFT(2048);
    this.sampleRate = sampleRate;
  }

  // Applique un filtre passe-bas sur le signal audio
  async applyLowPassFilter(audioData: Float32Array, cutoffFrequency: number): Promise<Float32Array> {
    const tensor = tf.tensor1d(audioData);
    const fft = tf.spectral.rfft(tensor);
    
    // Créer le filtre passe-bas
    const frequencies = tf.linspace(0, this.sampleRate / 2, fft.shape[0]);
    const filter = tf.where(
      frequencies.less(cutoffFrequency),
      tf.ones([fft.shape[0]]),
      tf.zeros([fft.shape[0]])
    );

    // Appliquer le filtre
    const filteredFFT = fft.mul(filter);
    const filteredSignal = tf.spectral.irfft(filteredFFT);

    const result = await filteredSignal.array() as Float32Array;
    
    // Nettoyage
    tensor.dispose();
    fft.dispose();
    frequencies.dispose();
    filter.dispose();
    filteredFFT.dispose();
    filteredSignal.dispose();

    return result;
  }

  // Calcule la transformée de Fourier rapide (FFT)
  computeFFT(audioData: Float32Array): { real: number[], imag: number[] } {
    const out = this.fft.forward(audioData);
    return {
      real: Array.from(out.slice(0, out.length / 2)),
      imag: Array.from(out.slice(out.length / 2))
    };
  }

  // Calcule le spectre de magnitude
  computeMagnitudeSpectrum(audioData: Float32Array): number[] {
    const { real, imag } = this.computeFFT(audioData);
    return real.map((r, i) => Math.sqrt(r * r + imag[i] * imag[i]));
  }

  // Normalise le signal audio
  normalizeSignal(audioData: Float32Array): Float32Array {
    const max = Math.max(...audioData.map(Math.abs));
    return new Float32Array(audioData.map(x => x / max));
  }

  // Réduit le bruit de fond
  async reduceNoise(audioData: Float32Array, threshold: number = 0.1): Promise<Float32Array> {
    const normalized = this.normalizeSignal(audioData);
    return new Float32Array(normalized.map(x => Math.abs(x) < threshold ? 0 : x));
  }
} 