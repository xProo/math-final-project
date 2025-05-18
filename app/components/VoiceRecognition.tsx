'use client';

import React, { useState, useEffect, useRef } from 'react';

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: {
    [key: number]: {
      transcript: string;
    };
    isFinal: boolean;
  }[];
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface VoiceRecognitionProps {
  onCommand: (command: string) => void;
  onAudioData?: (data: Float32Array) => void;
}

const VoiceRecognition: React.FC<VoiceRecognitionProps> = ({ onCommand, onAudioData }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.error('La reconnaissance vocale n\'est pas supportée dans ce navigateur.');
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'fr-FR';

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);

        if (event.results[current].isFinal) {
          onCommand(transcript.toLowerCase());
        }
      };

      recognition.onerror = (event) => {
        console.error('Erreur de reconnaissance vocale:', event.error);
        setIsListening(false);
      };

      if (isListening) {
        recognition.start();
      }

      return () => {
        recognition.stop();
      };
    }
  }, [isListening, onCommand]);

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const startAudioCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      source.connect(analyserRef.current);

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Float32Array(bufferLength);

      const updateAudioData = () => {
        if (!isListening || !analyserRef.current) return;
        
        analyserRef.current.getFloatTimeDomainData(dataArray);
        onAudioData?.(new Float32Array(dataArray));
        requestAnimationFrame(updateAudioData);
      };

      updateAudioData();
    } catch (error) {
      console.error('Erreur lors de la capture audio:', error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <button
        onClick={toggleListening}
        className={`px-6 py-3 rounded-full text-white font-semibold transition-all ${
          isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isListening ? 'Arrêter' : 'Démarrer'} la reconnaissance vocale
      </button>
      {transcript && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <p className="text-gray-800">Vous avez dit : {transcript}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceRecognition; 