# Administration — Première Impression

Espace d’équipe : `/admin` (non indexé, protégé par mot de passe).

## Accès

| Variable | Rôle |
| --- | --- |
| `ADMIN_PASSWORD` | Mot de passe de connexion. **Obligatoire avant la mise en ligne.** |
| `ADMIN_SESSION_SECRET` | Clé de signature du cookie de session (chaîne aléatoire longue). |

Sans `ADMIN_PASSWORD`, un mot de passe de démonstration (`premiere-impression`) est actif et un bandeau rouge
l’indique dans l’administration. La session dure 12 h (cookie `httpOnly`, signé HMAC-SHA256).

## Ce que l’on peut gérer

- **Tableau de bord** — volumes de demandes par type et par statut, dernières demandes.
- **Demandes** (`/admin/demandes`) — toutes les demandes de contact, de devis et les paniers envoyés.
  Filtres, fiche détaillée, changement de statut, notes internes, suppression, export CSV.
- **Catalogue** (`/admin/catalogue`) — création, modification, publication/masquage et suppression des produits :
  nom, identifiant d’URL, catégorie, parcours (panier ou devis), textes, visuels, prix, mise en avant, express,
  ordre d’affichage et options de configuration (JSON validé à l’enregistrement).
- **Réglages** (`/admin/reglages`) — adresse, plan, email, téléphone, WhatsApp, horaires, taille de fichier annoncée,
  et les interrupteurs « paiement en ligne connecté » / « transfert de fichiers connecté ».

Toute modification est répercutée immédiatement sur le site public (revalidation).

## Données

| Table | Contenu |
| --- | --- |
| `project_requests` | Demandes clients (référence, coordonnées, message, détails, statut). |
| `request_notes` | Notes internes liées à une demande. |
| `products` | Catalogue. Initialisé automatiquement depuis `src/data/products.ts` au premier démarrage. |
| `settings` | Réglages du site (ligne unique, clé `site`). |

En cas d’indisponibilité de la base, le site public retombe sur le catalogue et les réglages par défaut du code.

## Limites actuelles

- **Aucun email automatique** : les réponses partent de votre messagerie via le bouton « Écrire au client ».
- **Aucun fichier n’est stocké** : seuls le nom et le poids sont enregistrés tant que le transfert n’est pas branché.
- **Aucun paiement** : le tunnel de commande reste en démonstration tant que l’option n’est pas activée.
- **Un seul compte partagé** (mot de passe unique), sans historique par utilisateur.

## Visuels

Pour ajouter une photo : déposez le fichier dans `public/images/`, déclarez-le dans `src/data/images.ts`
(alt, cadrage mobile/desktop, `intent` pour la mention « Visuel d’intention »), puis sélectionnez-le dans la fiche produit.
