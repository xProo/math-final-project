'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VoiceRecognition from '../components/VoiceRecognition';

interface Note {
  id: number;
  titre: string;
  contenu: string;
  date: string;
}

export default function Notes() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [modeEdition, setModeEdition] = useState<'nouvelle' | 'modification' | null>(null);
  const [noteCourante, setNoteCourante] = useState<Note | null>(null);

  useEffect(() => {
    // Charger les notes depuis le localStorage
    const notesSauvegardees = localStorage.getItem('notes');
    if (notesSauvegardees) {
      setNotes(JSON.parse(notesSauvegardees));
    }
  }, []);

  useEffect(() => {
    // Sauvegarder les notes dans le localStorage
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleCommand = (command: string) => {
    console.log('Commande reçue:', command);
    
    if (command.includes('retour')) {
      router.push('/');
      return;
    }

    if (command.includes('nouvelle note')) {
      setModeEdition('nouvelle');
      setNoteCourante({
        id: Date.now(),
        titre: 'Nouvelle note',
        contenu: '',
        date: new Date().toLocaleString()
      });
    }

    if (command.includes('supprime la note')) {
      const numeroNote = command.match(/\d+/);
      if (numeroNote) {
        const index = parseInt(numeroNote[0]) - 1;
        if (index >= 0 && index < notes.length) {
          setNotes(notes.filter((_, i) => i !== index));
        }
      }
    }

    if (modeEdition && noteCourante) {
      if (command.includes('titre')) {
        const titre = command.replace('titre', '').trim();
        setNoteCourante({ ...noteCourante, titre });
      } else if (command.includes('contenu')) {
        const contenu = command.replace('contenu', '').trim();
        setNoteCourante({ ...noteCourante, contenu });
      } else if (command.includes('sauvegarder')) {
        if (modeEdition === 'nouvelle') {
          setNotes([...notes, noteCourante]);
        } else {
          setNotes(notes.map(n => n.id === noteCourante.id ? noteCourante : n));
        }
        setModeEdition(null);
        setNoteCourante(null);
      }
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Notes Vocales
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Reconnaissance Vocale</h2>
          <VoiceRecognition onCommand={handleCommand} />
        </div>

        {modeEdition && noteCourante && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {modeEdition === 'nouvelle' ? 'Nouvelle Note' : 'Modifier la Note'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Titre</label>
                <input
                  type="text"
                  value={noteCourante.titre}
                  onChange={(e) => setNoteCourante({ ...noteCourante, titre: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contenu</label>
                <textarea
                  value={noteCourante.contenu}
                  onChange={(e) => setNoteCourante({ ...noteCourante, contenu: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => {
                  if (modeEdition === 'nouvelle') {
                    setNotes([...notes, noteCourante]);
                  } else {
                    setNotes(notes.map(n => n.id === noteCourante.id ? noteCourante : n));
                  }
                  setModeEdition(null);
                  setNoteCourante(null);
                }}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {notes.map((note, index) => (
            <div key={note.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold">{note.titre}</h3>
                <span className="text-sm text-gray-500">{note.date}</span>
              </div>
              <p className="mt-2 text-gray-600">{note.contenu}</p>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setModeEdition('modification');
                    setNoteCourante(note);
                  }}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Modifier
                </button>
                <button
                  onClick={() => setNotes(notes.filter((_, i) => i !== index))}
                  className="text-red-500 hover:text-red-600"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Commandes Vocales</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>"Nouvelle note"</li>
            <li>"Titre [votre titre]"</li>
            <li>"Contenu [votre contenu]"</li>
            <li>"Sauvegarder"</li>
            <li>"Supprime la note [numéro]"</li>
            <li>"Retour" (pour revenir à l'accueil)</li>
          </ul>
        </div>
      </div>
    </main>
  );
} 