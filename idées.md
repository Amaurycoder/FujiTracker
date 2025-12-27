# 💡 Idées d'Améliorations - FujiTracker

## 🎯 Fonctionnalités Manquantes

### 1. Export/Import de Recettes
- [x] Export des recettes en `.json` ou `.txt` pour partage
- [x] Import de recettes depuis des fichiers
- [x] Génération de QR Code pour partager rapidement une recette
- [x] Copier/coller une recette sous forme de texte formaté
- [x] Scanner QR code avec la caméra pour import direct
- [x] Détection automatique des doublons lors de l'import


### 2. Recherche Avancée
- [x] Filtres multiples (par simulation, par tags, par auteur)
- [x] Tri (par date de création, par nom, par popularité)
- [x] Recherche dans la description des recettes
- [x] Recherche par paramètres techniques (ex: DR400, WB Auto)
- [x] Affichage du nombre de résultats
- [x] Bouton de réinitialisation des filtres


### 3. Sauvegarde Cloud ⭐ (Prioritaire)
- [x] Actuellement tout est en `localStorage` → perte si cache effacé
- [x] Sync Firebase Firestore pour sauvegarder les recettes en ligne
- [x] Synchronisation entre appareils
- [x] Backup automatique quotidien
- [x] Restauration depuis un backup
- [x] Indicateur de statut de synchronisation en temps réel
- [x] Migration automatique des données localStorage vers cloud


### 4. Comparaison de Recettes
- [ ] Sélectionner 2-3 recettes et voir les différences côte à côte
- [ ] Tableau comparatif des paramètres
- [ ] Utile pour comprendre l'impact de chaque paramètre
- [ ] Mode "diff" visuel (rouge/vert pour les différences)

### 5. Historique & Statistiques
- [ ] Dashboard avec statistiques :
  - Recettes les plus utilisées
  - Simulations préférées
  - Distribution des paramètres
- [ ] Historique des modifications de slots
- [ ] Graphiques de vos préférences
- [ ] Export des statistiques en PDF/CSV

### 6. Mode PWA (Progressive Web App)
- [x] Manifest pour installer l'app comme application native
- [x] Service Worker pour fonctionner hors ligne
- [x] Cache des recettes pour consultation offline
- [ ] Notifications push pour nouvelles recettes communautaires (Phase 2)
- [ ] Badge d'icône avec nombre de nouvelles recettes (Phase 2)

### 7. README.md Complet ⭐
- [ ] Documentation utilisateur claire
- [ ] Screenshots de l'interface
- [ ] Guide de démarrage rapide
- [ ] FAQ (Questions fréquentes)
- [ ] Tutoriel vidéo (optionnel)

### 8. Tests Unitaires
- [ ] Tests pour `ThemeContext` et `RecipeContext`
- [ ] Tests pour les composants critiques (`RecipeCard`, `Dashboard`)
- [ ] Tests d'intégration pour les flux utilisateur
- [ ] CI/CD avec GitHub Actions
- [ ] Coverage minimum de 70%

## 📝 Améliorations UX

### Interface
- [ ] **Onboarding** : Tutoriel interactif pour les nouveaux utilisateurs
- [x] **Raccourcis clavier** : 
  - `N` pour nouvelle recette
  - `S` pour recherche
  - `Esc` pour fermer les modales
  - `1-4` pour naviguer entre les onglets
- [x] **Drag & Drop** : 
  - Réorganiser les recettes dans Dashboard ✅
  - Déplacer recettes entre slots directement ✅
- [x] **Animations** : Transitions de route plus fluides ✅
- [x] **Mode compact** : Vue liste en plus de la grille

### Accessibilité
- [ ] Support complet du clavier
- [ ] Labels ARIA pour lecteurs d'écran
- [ ] Contraste de couleurs WCAG AA
- [ ] Mode dyslexie (police adaptée)

### Performance
- [ ] Virtualisation de la liste de recettes (pour >100 recettes)
- [ ] Lazy loading des images
- [ ] Optimisation du bundle size
- [ ] Preload des pages fréquentes

## 🌐 Fonctionnalités Communautaires

### Partage Social
- [ ] Partage sur réseaux sociaux avec preview
- [ ] Galerie publique de recettes (avec modération)

### Collaboration
- [ ] Compte utilisateur (Firebase Auth)
- [ ] Collections partagées entre utilisateurs
- [ ] Suggestions de recettes basées sur vos goûts
- [ ] Système de tags personnalisés

## 🎲 Nouvelles Fonctionnalités

### Découverte & Évaluation
- [x] **Mode "Random Recipe"** : Bouton "Surprise-moi !" pour découvrir une recette aléatoire
- [x] **Rating personnel** : Système de notation (1-5 ⭐) avec notes textuelles privées
- [x] **Tri par rating** : Dans Collection, trier par vos notes favorites

### Intégrations Externes
- [ ] **Export réseaux sociaux** : 
  - Template Instagram Story avec card recette visuelle
  - Hashtags automatiques (#FujifilmRecipes)
  - Partage direct depuis l'app
- [ ] **Météo intégrée** : 
  - API météo pour suggestions intelligentes
  - "Il fait beau → Classic Chrome recommandé"
  - Conditions adaptées à chaque recette
- [ ] **Connexion appareil Fuji** (Avancé) :
  - Sync Bluetooth/WiFi avec votre Fuji
  - Lecture des recettes actuelles de l'appareil
  - Push direct des recettes vers camera

### Mobile & Accessibilité
- [ ] **Widget mobile** (iOS/Android) :
  - Quick access aux 4 slots depuis home screen
  - Voir favorites sans ouvrir l'app
- [x] **Multi-langue** :
  - Anglais, Français, Japonais
  - Auto-détection ou sélection manuelle
  - Traduction de l'interface complète

### Social & Découverte
- [ ] **Géolocalisation recettes populaires** :
  - Map view mondiale des recettes populaires
  - "Photographes à Paris utilisent..."
  - Découverte par lieu/pays
  - Tendances régionales


## 🔧 Améliorations Techniques

### Code Quality
- [ ] Extraction de hooks personnalisés (`useLocalStorage`, `useDebounce`)
- [ ] Storybook pour documentation des composants
- [ ] ESLint + Prettier avec configuration stricte
- [ ] Husky pour pre-commit hooks

### Infrastructure
- [ ] Déploiement automatique sur Vercel/Netlify
- [ ] Variables d'environnement par environnement (dev/staging/prod)
- [ ] Monitoring (Sentry pour les erreurs)
- [ ] Analytics (Google Analytics ou Plausible)

---

## 📋 Priorisation Suggérée

### Phase 1 (MVP Amélioré) - 1 semaine
1. README.md complet avec screenshots
2. Export/Import JSON
3. Recherche avancée avec filtres

### Phase 2 (Cloud & Stabilité) - 2 semaines
4. Sauvegarde Cloud (Firebase)
5. Tests unitaires
6. Mode PWA

### Phase 3 (Expérience) - 2 semaines
7. Comparaison de recettes
8. Statistiques et historique
9. Raccourcis clavier

### Phase 4 (Communauté) - Futur
10. Système de partage social
11. Galerie publique
12. Système de compte utilisateur

---

**Note** : Cette liste est évolutive. N'hésitez pas à ajouter vos propres idées !
