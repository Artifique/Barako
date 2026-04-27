# 🎨 PROMPT UI/UX — Plateforme "Baarako gèlèya bana"
> À utiliser dans : **Cursor AI**, **v0.dev**, **Bolt.new**, ou **Claude Artifacts**

---

## 🧠 CONTEXTE GÉNÉRAL

Tu es un expert UI/UX senior avec 10 ans d'expérience sur des plateformes web africaines et internationales. Tu dois concevoir et coder les interfaces complètes de la plateforme **"Baarako gèlèya bana"** — une bourse d'emploi et d'entrepreneuriat pour les jeunes au Mali.

**Stack imposée :**
- Frontend : Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Backend : Supabase (Auth, PostgreSQL, Storage)
- Déploiement : Vercel

La plateforme a **deux espaces distincts** :
1. **Site public** — pour les demandeurs d'emploi, entrepreneurs et entreprises
2. **Dashboard Admin** — gestion complète de la plateforme

---

## 🎨 IDENTITÉ VISUELLE & DESIGN SYSTEM

### Palette de couleurs (CSS variables obligatoires)
```css
:root {
  --primary:     #16A34A;  /* Vert Mali — espoir, croissance */
  --secondary:   #EA580C;  /* Orange vif — énergie, ambition */
  --accent:      #D4A017;  /* Or africain — excellence, réussite */
  --dark:        #0F2027;  /* Nuit profonde — fond sombre */
  --dark-card:   #1A2E35;  /* Cartes sombres */
  --light:       #F8FAF5;  /* Blanc naturel — fond clair */
  --text-main:   #1C1C1E;
  --text-muted:  #6B7280;
  --success:     #22C55E;
  --warning:     #F59E0B;
  --error:       #EF4444;
}
```

### Typographie
- **Titres / Display** : `Sora` (Google Fonts) — Bold 700/800 — moderne, impactant
- **Corps / UI** : `Nunito` (Google Fonts) — Regular/SemiBold — lisible, chaleureux
- **Code / Tags** : `JetBrains Mono` — pour les badges et labels techniques

### Style visuel : **"African Neo-Modern"**
- Inspiration visuelle : géométrie Adinkra + modernité tech startup
- Fond sombre (dark mode par défaut) avec touches de lumière
- Dégradés chauds subtils : vert → or, orange → rouge brique
- Formes géométriques décoratives (triangles, losanges, arcs) en arrière-plan avec faible opacité
- Cartes avec bordure lumineuse (glowing border) au hover
- Effets glassmorphism sur les modals et overlays
- Animations fluides : entrée des éléments au scroll (framer-motion), hover élastique
- Aucun design générique "bootstrap" ou "Material UI" visible

---

## 🌐 SITE PUBLIC — Pages à créer

---

### PAGE 1 — Hero / Accueil (`/`)

**Layout :**
- Navbar fixe avec logo Baarako + liens nav + boutons "Connexion" / "S'inscrire"
- Section Hero plein écran avec :
  - Fond : dégradé sombre animé + particules géométriques légères
  - Silhouette stylisée africaine en SVG (jeune dynamique avec mallette)
  - Titre H1 en 2 lignes : `"Trouve ton emploi.` / `Lance ton projet."` — texte alterné avec animation typewriter
  - Sous-titre : `"Baarako gèlèya bana — La plateforme de l'insertion et de l'entrepreneuriat des jeunes au Mali"`
  - 2 CTA buttons : `[🔍 Voir les offres d'emploi]` (vert) et `[💡 Soumettre mon projet]` (orange outline)
  - Badge animé : `"✨ +500 jeunes insérés"` flottant
- Compteurs animés (CountUp) : 
  - `250+ Bourses d'emploi` | `180+ Projets accompagnés` | `12 Entreprises partenaires` | `85% Taux d'insertion`

**Section "Nos deux programmes" :**
- 2 grandes cartes côte à côte avec icônes SVG custom :
  - 🏢 **Bourse Baarako** — Emploi salarié, avec tag "CDI / CDD / Stage"
  - 💼 **Bourse Tchakèda** — Auto-emploi, avec tag "Micro-entreprise / Financement"
- Chaque carte : fond dégradé vert ou orange, description courte, bouton d'action

**Section "Comment ça marche" :**
- Timeline horizontale en 4 étapes avec icônes :
  `Inscription → Profil → Candidature → Insertion`

**Section "Témoignages" :**
- Carousel de témoignages de jeunes avec photo (avatar placeholder), nom, secteur, statut ("Placé en CDI ✅")

**Footer :**
- Dark, avec logo, liens rapides, réseaux sociaux, mention légale
- Motif géométrique décoratif discret en fond

---

### PAGE 2 — Bourses d'Emploi / Bourse Baarako (`/offres`)

**Layout :**
- Header de section avec titre, description et compteur d'offres actives
- Barre de recherche centrale + filtres (secteur, localisation, type contrat) sur fond card
- Grille de cartes d'offres (3 colonnes desktop, 1 mobile) :

**Composant `JobCard` :**
```
┌─────────────────────────────────────┐
│ [Logo entreprise]  Nom entreprise   │
│                    📍 Bamako, Mali  │
│                                     │
│  Titre du Poste                     │
│  ── Développeur Web Junior ──       │
│                                     │
│  [CDI] [Tech] [Temps plein]         │
│                                     │
│  💰 300 000 – 450 000 FCFA/mois    │
│  ⏰ Expire dans 12 jours            │
│                                     │
│  [Voir détails →]                   │
└─────────────────────────────────────┘
```
- Hover : bordure lumineuse verte, légère élévation
- Badge "Nouveau" en or si offre < 3 jours

**Page détail offre (`/offres/[id]`) :**
- Header avec nom entreprise + logo + localisation
- Description complète avec sections : Missions / Profil recherché / Avantages
- Sidebar sticky : résumé offre + bouton "Postuler maintenant" (CTA orange)
- Section "Bourses similaires"

---

### PAGE 3 — Projets Entrepreneurs / Bourse Tchakèda (`/projets`)

**Layout similaire aux offres avec :**

**Composant `ProjectCard` :**
```
┌─────────────────────────────────────┐
│  🌱 Agriculture                     │
│                                     │
│  "Ferme Hydroponique Urbaine"       │
│  par Moussa Coulibaly               │
│                                     │
│  Description courte du projet...   │
│                                     │
│  [Mentorat ✅] [Financement 🔍]     │
│                                     │
│  Statut : [En cours d'examen]       │
└─────────────────────────────────────┘
```

- Formulaire de soumission de projet : stepper en 3 étapes (Idée → Détails → Validation)

---

### PAGE 4 — Formations (`/formations`)

- Grille de cartes formations avec date de début, durée, lieu
- Badge de type : `[Employabilité]` ou `[Entrepreneuriat]`
- Barre de progression "Places restantes" en vert
- Bouton "S'inscrire à cette formation"

---

### PAGE 5 — Authentification (`/auth/connexion` & `/auth/inscription`)

**Design :**
- Page split 50/50 : gauche = illustration SVG animée avec slogan, droite = formulaire
- Fond gauche : dégradé sombre vert/or avec motifs africains géométriques
- Formulaire droite : fond blanc/gris clair, ombres douces
- Inscription : sélecteur de rôle avec cartes visuelles :
  - 👤 Je cherche un emploi
  - 💡 Je suis porteur de projet
  - 🏢 Je suis une entreprise
- Animation de transition entre les étapes

---

### PAGE 6 — Profil Utilisateur (`/profil`)

**Layout dashboard personnel :**
- Sidebar gauche : avatar, nom, rôle, score de complétude du profil (barre circulaire animée)
- Onglets : Informations | CV & Documents | Mes candidatures | Mes formations
- Composant "Statut candidature" avec stepper : `Envoyée → Vue → Entretien → Acceptée ✅`
- Upload de CV avec drag & drop (Supabase Storage)

---

## 🛠️ DASHBOARD ADMIN — Interface d'administration (`/admin`)

**Layout global :**
- Sidebar gauche fixe (dark, 260px) avec navigation icône + libellé
- Header top avec breadcrumb + notifications bell + avatar admin
- Zone de contenu principale avec fond `#0F2027`

**Sidebar Admin :**
```
🏠  Dashboard
👥  Utilisateurs
💼 Bourses d'Emploi
💡  Projets Entrepreneurs
📚  Formations
🏢  Entreprises
🤝  Partenaires
⚙️  Paramètres
```

---

### ADMIN PAGE 1 — Dashboard Overview (`/admin`)

**KPI Cards (4 en ligne) :**
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  👥 1 247    │ │  💼 89       │ │  💡 234      │ │  ✅ 312      │
│ Utilisateurs│ │ Bourses act. │ │ Projets     │ │ Insertions  │
│  +12% ↑     │ │  +5 ce mois  │ │  soumis      │ │  réussies    │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```
- Style : fond dégradé par carte (vert, orange, bleu, or), icône large, variation mensuelle

**Graphiques (recharts ou Chart.js) :**
- Courbe : Nouvelles inscriptions par mois (12 derniers mois)
- Donut : Répartition des rôles (demandeurs / entrepreneurs / entreprises)
- Bar chart : Candidatures par secteur d'activité

**Tableau "Dernières activités" :**
- Actions récentes : nouvelles inscriptions, candidatures, projets soumis
- Colonnes : Type | Utilisateur | Date | Statut | Action

---

### ADMIN PAGE 2 — Gestion Utilisateurs (`/admin/utilisateurs`)

- Table avec colonnes : Avatar | Nom | Email | Rôle | Statut | Date d'inscription | Actions
- Filtres : par rôle (dropdown), par statut (actif/inactif), recherche globale
- Badges colorés pour les rôles :
  - `[Demandeur d'emploi]` bleu | `[Entrepreneur]` orange | `[Entreprise]` violet | `[Admin]` rouge
- Actions par ligne : 👁️ Voir | ✏️ Modifier | 🔒 Désactiver | 🗑️ Supprimer
- Modal de détail utilisateur (slide-in depuis la droite)

---

### ADMIN PAGE 3 — Gestion Bourses d'Emploi (`/admin/offres`)

- Table des offres avec colonnes : Titre | Entreprise | Lieu | Type | Candidatures | Statut | Date exp. | Actions
- Bouton "Créer une offre" → Modal formulaire en 2 étapes
- Sous-page détail : liste des candidatures avec changement de statut rapide (dropdown inline)
- Timeline statut candidature : `Pending → Reviewed → Interview → Accepted/Rejected`

---

### ADMIN PAGE 4 — Gestion Projets Entrepreneurs (`/admin/projets`)

- Kanban board avec colonnes de statut :
  `Soumis | En examen | Accepté | En mentorat | Financé`
- Drag & drop des cartes entre colonnes (utiliser `@hello-pangea/dnd`)
- Chaque carte : titre projet, nom entrepreneur, secteur, date soumission
- Panel latéral de détail au clic sur une carte

---

### ADMIN PAGE 5 — Statistiques & Rapports (`/admin/statistiques`)

- Filtres période : Semaine / Mois / Trimestre / Année
- Graphiques : Insertions par secteur | Évolution projets | Taux de réussite par cohorte
- Export CSV / Excel via bouton

---

## ⚙️ COMPOSANTS UI RÉUTILISABLES À CRÉER

```typescript
// À placer dans /components/ui/

<Button variant="primary|secondary|outline|ghost" size="sm|md|lg" />
<Badge variant="success|warning|error|info|gold" />
<Card glowing={true|false} />
<Avatar src="" name="" role="" />
<StatusTimeline steps={[]} currentStep={n} />
<FileUpload label="" accept=".pdf,.doc" onUpload={fn} />
<SearchBar placeholder="" filters={[]} onSearch={fn} />
<StatsCard icon="" value="" label="" trend="" />
<Modal isOpen={} onClose={} size="sm|md|lg|full" />
<DataTable columns={[]} data={[]} searchable sortable />
<RoleSelector roles={[]} onSelect={fn} />
<StepForm steps={[]} currentStep={n} />
```

---

## 🎞️ ANIMATIONS & MICRO-INTERACTIONS

```typescript
// Utiliser Framer Motion pour :

// 1. Entrée des cartes (stagger)
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" }
  })
}

// 2. Hero typewriter effect (react-type-animation)
// 3. CountUp sur les statistiques (react-countup, trigger au scroll)
// 4. Glassmorphism modals avec backdrop blur
// 5. Hover cards : scale(1.02) + box-shadow lumineuse verte
// 6. Page transitions : fade + slide (Next.js Layout animations)
// 7. Loading skeletons animés (shimmer) pour les listes
// 8. Toast notifications (react-hot-toast, style custom dark)
```

---

## 📐 RÈGLES DE LAYOUT & RESPONSIVE

```
Desktop (>1280px)  : Sidebar 260px + Content fluid
Tablet  (768-1280) : Sidebar collapsible (icônes seulement)
Mobile  (<768px)   : Bottom navigation bar, cartes en 1 colonne

Spacing scale Tailwind custom :
  xs: 4px | sm: 8px | md: 16px | lg: 24px | xl: 40px | 2xl: 64px

Border radius :
  cards: rounded-2xl (16px)
  buttons: rounded-xl (12px)  
  badges: rounded-full
  inputs: rounded-lg (8px)
```

---

## 🗂️ STRUCTURE DE FICHIERS RECOMMANDÉE

```
/app
  /(public)
    /page.tsx              ← Accueil
    /offres/page.tsx       ← Liste offres
    /offres/[id]/page.tsx  ← Détail offre
    /projets/page.tsx      ← Projets entrepreneurs
    /formations/page.tsx   ← Formations
    /auth/
      /connexion/page.tsx
      /inscription/page.tsx
    /profil/page.tsx
  /(admin)
    /admin/page.tsx                    ← Dashboard
    /admin/utilisateurs/page.tsx
    /admin/offres/page.tsx
    /admin/projets/page.tsx
    /admin/formations/page.tsx
    /admin/statistiques/page.tsx

/components
  /ui/          ← Composants réutilisables
  /layout/      ← Navbar, Sidebar, Footer
  /sections/    ← Sections de pages (Hero, Stats, etc.)
  /forms/       ← Formulaires métier

/lib
  /supabase/    ← Client + server + types générés
  /hooks/       ← useAuth, useProfile, useJobs...
  /utils/       ← Helpers, formatters

/styles
  /globals.css  ← Variables CSS + base styles
```

---

## 🔌 INTÉGRATIONS SUPABASE

```typescript
// Auth — utiliser @supabase/ssr
// RLS activé sur toutes les tables
// Realtime pour notifications candidatures
// Storage buckets : cvs/ | business-plans/ | logos/ | avatars/

// Types à générer :
// npx supabase gen types typescript --project-id YOUR_ID > lib/supabase/types.ts
```

---

## ✅ CHECKLIST QUALITÉ UI

- [ ] Dark mode cohérent sur toutes les pages
- [ ] Responsive parfait mobile/tablet/desktop
- [ ] Skeleton loaders sur tous les fetch async
- [ ] États vides (empty states) illustrés avec SVG
- [ ] Feedback visuel sur toutes les actions (toast, spinner, disabled state)
- [ ] Accessibilité : contrast ratio > 4.5:1, aria-labels, focus visible
- [ ] Performance : images optimisées next/image, lazy loading
- [ ] Animations respectant `prefers-reduced-motion`

---

*Prompt créé par Claude — Expert UI/UX pour la plateforme Baarako gèlèya bana*
