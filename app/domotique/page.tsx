'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import VoiceRecognition from '../components/VoiceRecognition';

interface Device {
  id: string;
  name: string;
  status: boolean;
}

export default function Domotique() {
  const router = useRouter();
  const [devices, setDevices] = useState<Device[]>([
    { id: 'light1', name: 'Lumière Salon', status: false },
    { id: 'light2', name: 'Lumière Cuisine', status: false },
    { id: 'heater', name: 'Chauffage', status: false },
    { id: 'tv', name: 'Télévision', status: false },
  ]);

  const toggleDevice = (deviceId: string) => {
    setDevices(devices.map(device =>
      device.id === deviceId
        ? { ...device, status: !device.status }
        : device
    ));
  };

  const handleCommand = (command: string) => {
    console.log('Commande reçue sur la page domotique:', command);
    
    if (command.includes('retour')) {
      router.push('/');
      return;
    }

    // Traitement des commandes de domotique
    devices.forEach(device => {
      const deviceName = device.name.toLowerCase();
      if (command.includes(deviceName)) {
        if (command.includes('allume') || command.includes('active')) {
          toggleDevice(device.id);
        } else if (command.includes('éteins') || command.includes('désactive')) {
          toggleDevice(device.id);
        }
      }
    });
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Contrôle Domotique
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Reconnaissance Vocale</h2>
          <VoiceRecognition onCommand={handleCommand} />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Appareils</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {devices.map(device => (
              <div
                key={device.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  device.status ? 'bg-green-50 border-green-500' : 'bg-gray-50'
                }`}
                onClick={() => toggleDevice(device.id)}
              >
                <h3 className="font-semibold">{device.name}</h3>
                <p className={`text-sm ${device.status ? 'text-green-600' : 'text-gray-600'}`}>
                  {device.status ? 'Allumé' : 'Éteint'}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Exemples de commandes vocales :
          </p>
          <ul className="mt-2 text-gray-600">
            <li>"Allume la lumière du salon"</li>
            <li>"Éteins le chauffage"</li>
            <li>"Retour" (pour revenir à l'accueil)</li>
          </ul>
        </div>
      </div>
    </main>
  );
} 