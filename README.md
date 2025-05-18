# Assistant Vocal avec Traitement du Signal

Ce projet est une application web interactive qui utilise la reconnaissance vocale et le traitement du signal pour créer une interface homme-machine basée sur la voix.

## Fonctionnalités

- Reconnaissance vocale en temps réel
- Traitement du signal audio avec FFT et filtres
- Visualisation du signal audio brut et traité
- Navigation par commandes vocales
- Interface de domotique simulée
- Gestion des contacts

## Technologies utilisées

- Next.js 14
- TypeScript
- TensorFlow.js
- Web Speech API
- D3.js
- Tailwind CSS

## Installation

1. Clonez le repository :
```bash
git clone [URL_DU_REPO]
cd [NOM_DU_PROJET]
```

2. Installez les dépendances :
```bash
npm install
```

3. Lancez le serveur de développement :
```bash
npm run dev
```

4. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Commandes vocales disponibles

### Navigation
- "Ouvre la page contacts"
- "Ouvre la page domotique"
- "Retour" (pour revenir à l'accueil)

### Domotique
- "Allume la lumière du salon"
- "Éteins la lumière de la cuisine"
- "Allume le chauffage"
- "Éteins la télévision"

## Structure du projet

```
/app
  /components
    - VoiceRecognition.tsx
    - AudioVisualizer.tsx
  /lib
    - audioProcessing.ts
  /pages
    - index.tsx
    - contacts.tsx
    - domotique.tsx
```

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## Licence

MIT
