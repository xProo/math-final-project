import * as tf from '@tensorflow/tfjs';

export class AudioProcessor {
  private sampleRate: number = 44100;

  constructor(sampleRate: number = 44100) {
    this.sampleRate = sampleRate;
  }

  // Normalise le signal audio entre -1 et 1
  private normalizeSignal(audioData: Float32Array): Float32Array {
    const max = Math.max(...Array.from(audioData).map(Math.abs));
    return new Float32Array(audioData.map(x => x / max));
  }

  // Réduit le bruit de fond
  async reduceNoise(audioData: Float32Array): Promise<Float32Array> {
    // Convertir en tenseur
    const tensor = tf.tensor1d(Array.from(audioData));
    
    // Appliquer la FFT
    const fft = tf.spectral.rfft(tensor);
    
    // Réduire le bruit (exemple simple)
    const threshold = 0.1;
    const filteredFFT = tf.where(
      tf.abs(fft).greater(threshold),
      fft,
      tf.zerosLike(fft)
    );
    
    // Reconvertir en signal temporel
    const filteredSignal = tf.spectral.irfft(filteredFFT);
    
    // Convertir en Float32Array
    const arrayData = await filteredSignal.array() as number[];
    const result = new Float32Array(arrayData);
    
    // Nettoyage
    tensor.dispose();
    fft.dispose();
    filteredFFT.dispose();
    filteredSignal.dispose();
    
    return result;
  }

  // Applique un filtre passe-bas sur le signal audio
  async applyLowPassFilter(audioData: Float32Array, cutoffFrequency: number): Promise<Float32Array> {
    // Convertir en tenseur
    const tensor = tf.tensor1d(Array.from(audioData));
    
    // Appliquer la FFT
    const fft = tf.spectral.rfft(tensor);
    
    // Créer le filtre passe-bas
    const freqs = tf.linspace(0, 1, fft.shape[0]);
    const filter = tf.sub(1, tf.sigmoid(tf.sub(freqs, cutoffFrequency / 22050)));
    
    // Appliquer le filtre
    const filteredFFT = tf.mul(fft, filter);
    
    // Reconvertir en signal temporel
    const filteredSignal = tf.spectral.irfft(filteredFFT);
    
    // Convertir en Float32Array
    const arrayData = await filteredSignal.array() as number[];
    const result = new Float32Array(arrayData);
    
    // Nettoyage
    tensor.dispose();
    fft.dispose();
    filter.dispose();
    filteredFFT.dispose();
    filteredSignal.dispose();
    
    return result;
  }

  // Calcule la transformée de Fourier rapide (FFT)
  async computeFFT(audioData: Float32Array): Promise<{ real: number[], imag: number[] }> {
    const tensor = tf.tensor1d(Array.from(audioData));
    const fft = tf.spectral.rfft(tensor);
    const array = await fft.array() as number[];
    
    tensor.dispose();
    fft.dispose();
    
    return {
      real: array.filter((_, i) => i % 2 === 0),
      imag: array.filter((_, i) => i % 2 === 1)
    };
  }

  // Calcule le spectre de magnitude
  async computeMagnitudeSpectrum(audioData: Float32Array): Promise<number[]> {
    const { real, imag } = await this.computeFFT(audioData);
    return real.map((r, i) => Math.sqrt(r * r + imag[i] * imag[i]));
  }
} 