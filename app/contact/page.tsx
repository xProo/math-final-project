'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import VoiceRecognition from '../components/VoiceRecognition';

export default function Contact() {
  const router = useRouter();

  const handleCommand = (command: string) => {
    console.log('Commande reçue sur la page contact:', command);
    if (command.includes('retour')) {
      router.push('/');
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Page de Contact
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Reconnaissance Vocale</h2>
          <VoiceRecognition onCommand={handleCommand} />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Liste des Contacts</h2>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Jean Dupont</h3>
              <p className="text-gray-600">jean.dupont@email.com</p>
              <p className="text-gray-600">01 23 45 67 89</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Marie Martin</h3>
              <p className="text-gray-600">marie.martin@email.com</p>
              <p className="text-gray-600">02 34 56 78 90</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Pierre Durand</h3>
              <p className="text-gray-600">pierre.durand@email.com</p>
              <p className="text-gray-600">03 45 67 89 01</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Dites "retour" pour revenir à la page d'accueil
          </p>
        </div>
      </div>
    </main>
  );
} 