# MDD — Monde Du Dev

Application communautaire pour les développeurs : abonnements à des thèmes (topics), publication d'articles et commentaires.

## Stack technique

- [Next.js](https://nextjs.org) 16 (App Router)
- [Prisma](https://www.prisma.io) 7 (ORM) avec l'adapter [`@prisma/adapter-pg`](https://www.prisma.io/docs/orm/overview/databases/postgresql)
- PostgreSQL 16 (via Docker)
- TypeScript, Tailwind CSS

## Prérequis

- Node.js 20+
- Docker (pour la base de données PostgreSQL)

## Installation

1. Installer les dépendances :

   ```bash
   npm install
   ```

2. Créer un fichier `.env` à la racine du projet avec les variables suivantes :

   ```env
   POSTGRES_USER=
   POSTGRES_PASSWORD=
   POSTGRES_DB=
   POSTGRES_PORT=5432
   DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<db>"
   ```

3. Démarrer la base de données PostgreSQL :

   ```bash
   docker compose up -d
   ```

4. Appliquer le schéma de base de données :

   ```bash
   npm run db:migrate
   ```

5. Peupler la base avec des données de test :

   ```bash
   npm run db:seed
   ```

## Lancer le projet en développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans le navigateur.

## Scripts disponibles

| Commande            | Description                                      |
| -------------------- | ------------------------------------------------- |
| `npm run dev`        | Lance le serveur de développement Next.js         |
| `npm run build`      | Build de production                               |
| `npm run start`      | Lance le build de production                      |
| `npm run lint`       | Vérifie le code avec ESLint                       |
| `npm run db:migrate` | Crée/applique les migrations Prisma               |
| `npm run db:seed`    | Insère des données de test en base                |

## Modèle de données

- **User** : compte utilisateur (username, email, mot de passe hashé)
- **Topic** : thème auquel un utilisateur peut s'abonner
- **Post** : article publié par un utilisateur, associé à un topic
- **Comment** : commentaire d'un utilisateur sur un post
- **Subscription** : abonnement d'un utilisateur à un topic

Le schéma complet est défini dans [prisma/schema.prisma](prisma/schema.prisma).
