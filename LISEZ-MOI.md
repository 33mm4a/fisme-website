# FISME STUDIO — site web

Site statique (HTML, CSS, JS) + une fonction Cloudflare qui envoie les formulaires par e-mail.

## Structure

```
index.html              Accueil
portfolio.html          Aperçu des projets
projet-01.html … 03     Pages détail de chaque projet
services.html           Création, refonte, sur mesure (boutons devis / FirstLook)
firstlook.html          Explication + formulaire FirstLook
devis.html              Formulaire de devis
contact.html            Calendrier Cal.com
mentions-legales.html   À compléter
confidentialite.html    À compléter
404.html                Page introuvable
assets/
  styles.css            Tout le design (couleurs en haut du fichier)
  main.js               Menu mobile, animation d'accueil, formulaires
  logo-*.svg, star*.svg Tes vecteurs
functions/api/send.js   Envoi des e-mails (Cloudflare Pages Function)
_headers                En-têtes de sécurité et cache
```

## Modifier le site

- **Textes** : ouvre le fichier .html de la page et modifie le texte entre les balises.
- **Couleurs** : variables au début de `assets/styles.css` (`--ac` = jaune, `--ink` = noir).
- **Navigation et pied de page** : ils sont recopiés dans chaque page. Pour les changer, modifie le bloc `<nav>` / `<footer>` dans chaque fichier (recherche-remplacement dans ton éditeur).
- **Ajouter un projet** : copie `projet-03.html` en `projet-04.html`, modifie le contenu, puis ajoute une carte dans `portfolio.html` en copiant une carte existante.
- **Les textes entre [crochets]** sont des espaces à remplir (projets, mentions légales, confidentialité).

## Mettre en ligne sur Cloudflare Pages

1. Crée un dépôt GitHub avec le contenu de ce dossier (le dossier `functions` doit être à la racine).
2. Cloudflare → Workers & Pages → Create → Pages → Connect to Git → choisis le dépôt.
   Build command : *(vide)*. Output directory : `/` (la racine).
3. Pages → Custom domains → ajoute `fisme-studio.com`.

Important : l'envoi par glisser-déposer du dossier dans le tableau de bord ne prend pas en charge le dossier `functions`. Utilise Git (ci-dessus), ou la ligne de commande : `npx wrangler pages deploy .` (vérifie la documentation Cloudflare, ça évolue).

## Recevoir les formulaires sur contact@fisme-studio.com

Le site envoie les e-mails avec le service Resend (offre gratuite pour démarrer, vérifie les limites actuelles).

1. Crée un compte sur resend.com.
2. Ajoute et vérifie le domaine `fisme-studio.com` (Resend te donne des enregistrements DNS à ajouter dans Cloudflare → DNS).
3. Crée une clé API.
4. Cloudflare → ton projet Pages → Settings → Variables and secrets, ajoute :
   - `RESEND_API_KEY` : ta clé (type Secret) — obligatoire
   - `FROM_EMAIL` : `FISME STUDIO <contact@fisme-studio.com>` (valeur par défaut, doit utiliser le domaine vérifié)
5. Redéploie le site pour que les variables soient prises en compte.

Comportement : le message de confirmation s'affiche **seulement** si l'e-mail est bien parti. Sinon, le visiteur voit un message d'erreur avec ton adresse. Tu peux répondre directement à l'e-mail reçu : il est envoyé avec l'adresse du client en « répondre à ».

Test en local : crée un fichier `.dev.vars` contenant `RESEND_API_KEY=ta_clé`, puis `npx wrangler pages dev .`

## Calendrier

`contact.html` intègre `fisme-studio/reserve-ton-appel` de Cal.com. Si l'adresse de ton événement change, modifie `calLink` en bas de la page.

## Avant de publier

- Remplace les textes entre [crochets] et complète les pages légales (à faire valider, je ne suis pas juriste).
- Fais un envoi de test des deux formulaires et une réservation de test.
- Ajoute des images de partage (balises `og:image`) si tu le souhaites.
