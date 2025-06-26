# Fonctionnalités avancées

## Réponse du endpoint `document` en HTML

Par défaut, le endpoint `document` fournit une réponse au format `TEI`. Cependant, DoTS permet également d'obtenir des réponses dans d'autres formats, notamment en HTML, grâce à des mécanismes de transformation.

Pour utiliser, par exemple, les transformations XSLT de la communauté TEI, suivez ces étapes :

1. Créez un dossier nommé `dots/webapp/static/transform`.
2. Téléchargez les feuilles de style dans ce dossier, par exemple en utilisant `git clone https://github.com/TEIC/Stylesheets.git`.
3. Ouvrez le module XQuery `/dots/repo/globals.xqm`.
4. Modifiez la valeur de la variable `$G:defaultXslEnginePath` pour qu'elle pointe vers la XSL dans le dossier `transform` (généralement `Stylesheet/html/html.xsl`).

Une fois ces étapes accomplies, le endpoint `document` avec le paramètre `mediaType=html` vous permettra d'afficher le document (ou le fragment) au format HTML.

## XSLT spécifiques et surcharges

DoTS propose également un système avancé de gestion des XSLT, offrant les possibilités suivantes :

- Utiliser une feuille XSLT spécifique pour un document et / ou un projet.
- Utiliser une feuille XSLT qui importe et complète d'autres XSLTs (XSLT par défaut, par exemple).

### XSLT pour un document

Dans le dossier `dots/webapp/static/transform`, vous pouvez créer un sous-dossier portant le nom de la base de données du projet. Dans ce sous-dossier, vous pouvez ajouter des feuilles de style XSLT supplémentaires :

- Si une feuille de style est nommée `{$resourceId}.xsl`, elle sera utilisée prioritairement pour le document `resourceId`.
- Si une feuille de style est nommée `dbName.xsl`, elle sera utilisée prioritairement pour tous les documents du projet de la db `dbName`.

Il est possible d'avoir une feuille de style pour le projet ainsi qu'une feuille de style spécifique pour un ou plusieurs documents du projet. De plus, ces feuilles de style peuvent importer d'autres XSL pour une personnalisation accrue.