'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import VoiceRecognition from './components/VoiceRecognition';
import AudioVisualizer from './components/AudioVisualizer';
import { AudioProcessor } from './lib/audioProcessing';

export default function Home() {
  const router = useRouter();
  const [audioData, setAudioData] = useState<Float32Array>(new Float32Array());
  const [processedAudioData, setProcessedAudioData] = useState<Float32Array>(new Float32Array());
  const audioProcessor = new AudioProcessor();

  const handleCommand = useCallback(async (command: string) => {
    console.log('Commande reçue:', command);
    
    // Exemple de traitement des commandes
    if (command.includes('ouvre la page')) {
      if (command.includes('contact')) {
        router.push('/contact');
      } else if (command.includes('domotique')) {
        router.push('/domotique');
      } else if (command.includes('calculatrice')) {
        router.push('/calculatrice');
      } else if (command.includes('notes')) {
        router.push('/notes');
      }
    }
  }, [router]);

  const handleAudioData = useCallback(async (data: Float32Array) => {
    setAudioData(data);
    
    // Traitement du signal audio
    const processedData = await audioProcessor.reduceNoise(data);
    const filteredData = await audioProcessor.applyLowPassFilter(processedData, 1000);
    setProcessedAudioData(filteredData);
  }, []);

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Assistant Vocal avec Traitement du Signal
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Reconnaissance Vocale</h2>
          <VoiceRecognition onCommand={handleCommand} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Signal Audio Brut</h2>
            <AudioVisualizer audioData={audioData} />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Signal Audio Traité</h2>
            <AudioVisualizer audioData={processedAudioData} />
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Pages Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => router.push('/contact')}>
              <h3 className="font-semibold">Contact</h3>
              <p className="text-gray-600">Gestion des contacts</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => router.push('/domotique')}>
              <h3 className="font-semibold">Domotique</h3>
              <p className="text-gray-600">Contrôle des appareils</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => router.push('/calculatrice')}>
              <h3 className="font-semibold">Calculatrice</h3>
              <p className="text-gray-600">Calculs vocaux</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => router.push('/notes')}>
              <h3 className="font-semibold">Notes</h3>
              <p className="text-gray-600">Notes vocales</p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Commandes Vocales</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>"Ouvre la page contact"</li>
            <li>"Ouvre la page domotique"</li>
            <li>"Ouvre la page calculatrice"</li>
            <li>"Ouvre la page notes"</li>
          </ul>
        </div>
      </div>
    </main>
  );
} 