'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import VoiceRecognition from '../components/VoiceRecognition';

export default function Calculatrice() {
  const router = useRouter();
  const [historique, setHistorique] = useState<string[]>([]);
  const [resultat, setResultat] = useState<string>('');

  const evaluerExpression = (expression: string): number => {
    try {
      // Remplacer les mots par des opérateurs
      expression = expression
        .replace(/plus/g, '+')
        .replace(/moins/g, '-')
        .replace(/fois/g, '*')
        .replace(/divisé par/g, '/')
        .replace(/au carré/g, '**2')
        .replace(/racine carrée de/g, 'Math.sqrt')
        .replace(/virgule/g, '.');
      
      return eval(expression);
    } catch (error) {
      return NaN;
    }
  };

  const handleCommand = (command: string) => {
    console.log('Commande reçue:', command);
    
    if (command.includes('retour')) {
      router.push('/');
      return;
    }

    if (command.includes('calcule')) {
      const expression = command.replace('calcule', '').trim();
      const resultat = evaluerExpression(expression);
      
      if (!isNaN(resultat)) {
        const calcul = `${expression} = ${resultat}`;
        setHistorique(prev => [calcul, ...prev].slice(0, 5));
        setResultat(resultat.toString());
      } else {
        setResultat('Expression invalide');
      }
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Calculatrice Vocale
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Reconnaissance Vocale</h2>
          <VoiceRecognition onCommand={handleCommand} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Résultat</h2>
            <div className="text-3xl font-bold text-center p-4 bg-gray-100 rounded-lg">
              {resultat || '0'}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Historique</h2>
            <div className="space-y-2">
              {historique.map((calcul, index) => (
                <div key={index} className="p-2 bg-gray-100 rounded">
                  {calcul}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Exemples de Commandes</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>"Calcule 5 plus 3"</li>
            <li>"Calcule 10 fois 2"</li>
            <li>"Calcule racine carrée de 16"</li>
            <li>"Calcule 20 divisé par 4"</li>
            <li>"Retour" (pour revenir à l'accueil)</li>
          </ul>
        </div>
      </div>
    </main>
  );
} 