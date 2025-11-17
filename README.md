# MarketConnect - Place de Marché Béninoise

MarketConnect est une maquette fonctionnelle complète d'une plateforme de e-commerce conçue pour connecter les artisans, les vendeurs et les acheteurs au Bénin. Ce projet, construit avec Next.js et React, simule toutes les fonctionnalités clés d'une place de marché moderne en utilisant le `localStorage` du navigateur pour la persistance des données.

## Fonctionnalités Principales

- **Système à Trois Niveaux d'Utilisateurs :**
  - **Administrateur :** Valide ou rejette les inscriptions de vendeurs, et visualise les statistiques de la plateforme.
  - **Vendeur :** Gère son profil, ajoute, modifie et supprime des produits de sa boutique.
  - **Client :** Parcourt les produits, consulte les profils des vendeurs et peut les contacter.

- **Flux d'Inscription Vendeur Complet :** Un vendeur peut soumettre une demande d'inscription, qui est ensuite examinée par l'administrateur.

- **Tableaux de Bord Dédiés :** Chaque type d'utilisateur dispose d'un tableau de bord adapté à ses besoins, avec des statistiques et des outils de gestion.

- **Profil Vendeur Enrichi :** Chaque vendeur dispose d'une page de profil public avec une bannière, une photo de profil, une biographie, des informations de contact (Email, Téléphone, Google Maps) et un bouton flottant pour un contact direct via WhatsApp.

- **Gestion de Produits :** Les vendeurs ont une autonomie complète pour gérer leur catalogue de produits.

- **Persistance des Données Locales :** L'application utilise `localStorage` pour simuler une base de données, rendant l'application entièrement interactive d'une session à l'autre sans nécessiter de backend.

## Comment lancer le projet en local

Suivez ces étapes pour faire fonctionner le projet sur votre machine.

### Prérequis

- [Node.js](https://nodejs.org/) (version 18 ou supérieure recommandée)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### 1. Installation

Clonez le dépôt sur votre machine, puis naviguez dans le dossier du projet et installez les dépendances nécessaires.

```bash
# Naviguer dans le dossier du projet
cd chemin/vers/votre/projet

# Installer les dépendances
npm install
```

### 2. Lancer le serveur de développement

Une fois l'installation terminée, vous pouvez lancer le serveur de développement local.

```bash
npm run dev
```

L'application sera alors accessible à l'adresse [http://localhost:9002](http://localhost:9002) dans votre navigateur.

### Accès Administrateur

Pour accéder au tableau de bord administrateur, rendez-vous sur la page de connexion admin et utilisez le mot de passe suivant :
`BeninShell@2025`
