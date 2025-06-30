# Publier un corpus avec DoTS


Pour publier une collection de documents <a href="https://www.tei-c.org/" target="_blank">TEI</a>, il suffit de charger un *dossier de dépôt* conforme aux recommandations DoTS.

Cette page décrit le *workflow* de publication, les recommandations DoTS de structuration de ce *dossier de dépôt*, et la procédure de création et de gestion d'un *projet*.

## Introduction

### Vocabulaire

**Projet**. Un "projet" est une collection DTS de premier niveau, un corpus éditorial défini. Par exemple, il est possible de donner accès via un même endpoint DTS à des correspondances ET à des pièces de théâtre : on distinguera donc le projet *Correspondance* et le projet *Théâtre*.

**Dossier de dépôt** ou ***Import folder***. Pour être correctement chargé en base avec les outils DoTS, un *projet* doit être structuré dans un dossier conformément aux recommandations de DoTS. Ce dossier est désigné dans la documentation par l’expression "dossier de dépôt".

**Base de données projet** ou **DB projet**. Chaque *projet* (chaque collection DTS de premier niveau) est importé sous la forme d’une base de données BaseX. Les projets *Correspondance* et *Théâtre* sont chargés sous la forme de deux bases de données distinctes, par exemple respectivement `letters` et `theater`.


### Workflow

![Screenshot](img/dots_workflow.png)


???+ note

    DoTS ne fournit pas d'outil pour passer d'un dossier de travail utilisateur à un dossier de dépôt. Cependant, la structure de ce dossier de dépôt est conçue pour faciliter le travail éditorial. Pour optimiser le *workflow*, nous recommandons donc de travailler autant que possible à l’édition des sources XML/TEI directement dans le dossier de dépôt.


## Préparer les données

### Préparer le dossier de dépôt

Un [dossier de dépôt](dots-project-folder.md) contient :

- **obligatoirement** les sources XML/TEI du projet (dossier `data/`), organisées selon la hiérarchie de votre choix.
- **optionnellement** les métadonnées décrivant les collections, documents et passages (dossier `metadata/`). Si présent, le document XML `dots_metadata_mapping.xml` est obligatoire.
- **optionnellement** un `README.md` documentant le dossier de dépôt.


???+ info "Modèle"

	```
	nom_projet/							# Racine du dossier de dépôt
		data/							# OBLIGATOIRE. Fichiers TEI en dossiers de collection
			collection_1/				# Collection 1
				file_1.xml				# file_1 appartient par défaut à la collection 1
				file_2.xml				# idem
			collection_2/				# Collection 2
				file_100.xml			# file_100 appartient par défaut à la collection 2
				file_101.xml			# idem
		metadata/						# OPTIONNEL. Métadonnées des ressources
			dots_metadata_mapping.xml	# Déclaration du chemin des métadonnées
			metadata_1.tsv				# Un fichier de métadonnées
			metadata_2.tsv				# idem
		README.md						# OPTIONNEL. Documentation (plan de nommage, etc.)
	```


<!--
- Racine du projet – `nom_projet/`. Le nom de ce dossier est libre. Au chargement en base, vous pourrez spécifier le nom de la base de données BaseX, et l’identifiant DTS attribué à la collection racine. Vous pourrez aussi lui attribuer un titre.

- Les documents XML/TEI – `data/`. Ce dossier est **obligatoire**. Il contient les sources XML/TEI de votre *<a>projet</a>* organisées selon la hiérarchie de votre choix. Cette hiérarchie représente les collections par défaut de votre *projet*. Par exemple, ici, les documents `file_1.xml` et `file_2.xml` appartiennent à la collection `collection_1`.

- Les métadonnées – `metadata/`. Ce dossier est **optionnel**. S'il est présent, il doit contenir *a minima* un document XML `dots_metadata_mapping.xml` qui permet de déclarer finement où se trouvent les métadonnées de collections et / ou de documents. 
-->

### Déclarer les passages

L'utilisateur peut décrire la structure éditoriale de chaque document et définir l'accès aux passages. Il doit pour cela faire usage de l'élément TEI <a href="https://tei-c.org/release/doc/tei-p5-doc/en/html/ref-citeStructure.html" target="_blank">`tei:citeStructure`</a> (voir [dossier de dépôt](dots-project-folder.md/#passages)).


### Exemples

Pour bien illustrer toutes les potentialités offertes par DTS et DoTS, un [cookbook](cookbook/index.md) est disponible, avec plusieurs exemples :

- [publier un périodique](cookbook/periodical.md)
- [publier des pièces de théâtre](cookbook/theater.md)


## Gestion d’un projet

Pour lancer les commandes, il est nécessaire de se placer dans le dossier `dots`.

```bash
cd path/to/dots
```

### Création d’un projet

Cette commande crée un projet DoTS à partir d’un dossier de dépôt.


```{.Bash}
usage: scripts/project_create.sh
	--basex_path string
	--project_dir_path string
	--top_collection_id string
	--db_name string 
```

Arguments :

- `basex_path` : chemin absolu en local vers le répertoire `bin` de BaseX
- `project_dir_path` : chemin absolu en local vers le *dossier de dépôt* du projet
- `top_collection_id` : identifiant DTS de la collection racine du *projet*
- `db_name` : nom de la base de données du *projet*

!!! warning

	**La base de données du *projet* ne DOIT PAS être ouverte dans le GUI BaseX.**
<!-- [README.md](../README.md) -->

Exemple : 

```{.Bash .copy}
bash scripts/project_create.sh --basex_path '/path/to/basex/bin' --project_dir_path '/path/to/import/folder' --top_collection_id 'id' --db_name 'name'
```
!!! tip

	La commande bash suivante permet de mettre à jour un projet DoTS en le supprimant puis en le recréant :
	```{.Bash .copy}
	bash scripts/project_create.sh --basex_path '/path/to/basex/bin' --project_dir_path '/path/to/import/folder' --top_collection_id 'id' --db_name 'name' --cleanOption 'true' --delete 'true'
	```

NB. La base de données *projet* est créée en conservant la structure du dossier de dépôt en collections et sous-collections. 

!!! success

	Les ressources de votre projet sont désormais décrites et accessibles via les endpoints DTS fournis par DoTS. Les *endpoints* ouverts sont documentés dans la section [DTS API](api.md).


### Création de nouvelles collections

DoTS permet d’associer un document à plusieurs collections. Pour un projet, cette commande permet de créer de nouvelles collection et d’y associer des documents.

!!! warning

	**Les documents doivent être déjà enregistrés dans la base de données du projet.**


```{.Bash .copy}
bash scripts/custom_collections.sh --basex_path string --collections_tsv_path string
```
Argument :

- `basex_path` : chemin absolu en local vers le répertoire `bin` de BaseX
- `collections_tsv_path` : chemin absolu en local vers le fichier TSV décrivant ces collections. Ce fichier doit être conforme aux recommandations – voir [Dossier de dépôt/Autres collections](http://127.0.0.1:8000/dots-project-folder/#autres-collections).


### Suppression d’un projet

Cette commande efface des registres DoTS les ressources du projet et supprime optionnellement sa base de données.

```{.Bash}
usage: scripts/project_delete.sh
	--basex_path string
	--db_name string 
	--db_delete boolean
```

Arguments :

- `basex_path` : chemin absolu en local vers le répertoire `bin` de BaseX
- `db_name` : nom de la base de données du *projet*
- `db_delete` : booléen
	- `true` (*default*): la base de données du projet est supprimée
	- `false`: la base de données du projet est conservée (seules les registres sont mis à jour).


!!! warning

	**La base de données du *projet* ne DOIT PAS être ouverte dans le GUI BaseX.**


Exemple :

```{.Bash .copy}
bash scripts/project_delete.sh --basex_path '/path/to/basex/bin' --db_name 'name'
```


