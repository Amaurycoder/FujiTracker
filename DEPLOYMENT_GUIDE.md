# Guide de Déploiement - FujiTracker

Votre application est prête à être mise en ligne avec **Firebase Hosting** (recommandé car vous utilisez déjà Firebase pour l'authentification).

## Pré-requis
Assurez-vous d'avoir node.js installé (ce qui est le cas puisque vous faites tourner le site).

## Étape 1 : Construction (Build) `[DÉJÀ FAIT]`
J'ai déjà exécuté la commande de construction pour vous.
Le dossier `/dist` contient la version optimisée de votre site.
*(Si vous faites des modifications, relancez simplement `npm run build`).*

## Étape 2 : Installation des outils Firebase
Ouvrez un terminal (dans VS Code ou ailleurs) et lancez :
```bash
npm install -g firebase-tools
```
*(Si vous avez une erreur de permission sur Mac, ajoutez `sudo` devant : `sudo npm install -g firebase-tools`)*

## Étape 3 : Connexion
Connectez le terminal à votre compte Google :
```bash
firebase login
```
Une fenêtre de navigateur s'ouvrira pour vous connecter.

## Étape 4 : Initialisation
Configuration du projet (à faire une seule fois) :
```bash
firebase init hosting
```
Le terminal vous posera des questions. Voici quoi répondre :
1.  **Are you ready to proceed?** -> `Y` (Yes)
2.  **Select a default Firebase project** -> Choisissez `Use an existing project` puis sélectionnez votre projet `fujitracker` dans la liste.
3.  **What do you want to use as your public directory?** -> Tapez `dist` (puis Entrée).
4.  **Configure as a single-page app (rewrite all urls to /index.html)?** -> `Y` (Yes) **(Très important pour React !)**
5.  **Set up automatic builds and deploys with GitHub?** -> `N` (No) (Vous pourrez le faire plus tard si vous voulez).
6.  *S'il demande d'écraser `dist/index.html` (Overwrite?)* -> `N` (No) (Ne pas écraser votre site construit !).

## Étape 5 : Déploiement
Envoyez le site en ligne :
```bash
firebase deploy
```

## C'est fini ! 🚀
Le terminal vous donnera l'URL de votre site (ex: `https://votre-projet.web.app`).
Vous pouvez partager ce lien et l'ouvrir sur n'importe quel appareil.
