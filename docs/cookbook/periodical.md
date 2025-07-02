# DoTS Cookbook


## Publier un périodique


### Introduction

Cette recette détaille les possibilités offertes par DoTS pour la publication d’un périodique.

Un périodique est une publication régulière et collective, par exemple une revue érudite semestrielle ou les actes annuels d’une conférence.

Nous prenons ici l’exemple de la publication des positions de thèses de l’École des chartes. Une *position* est un résumé de la thèse défendue. Depuis 1849, chaque année un recueil des positions est publié. L’ensemble de ces positions est consultable en ligne : <a href="https://theses.chartes.psl.eu/" target="_blank">https://theses.chartes.psl.eu/</a>.

### Définition du modèle documentaire

<a href="https://distributed-text-services.github.io/specifications/" target="_blank">DTS</a> permet de décrire et de standardiser l’accès aux :

- collections (`resource @type:Collection`) ;
- documents (`resource @type:Resource`) ;
- passages de ces documents (`fragment`).


La hiérarchie documentaire du corpus des positions est la suivante :

???+ info "Modèle"

    ```
    racine
      > annee
        > positions
          > sections
    ```

Pour la gestion et l’édition de vos sources XML/TEI vous pouvez bien entendu organiser le dossier comme bon vous semble.
Mais pour le chargement en base, le dossier de dépôt DoTS explicite vos choix documentaires. Pour la publication d’un périodique,

- les articles (ici les positions de thèse) peuvent être traités comme des documents (cas 1)
- les articles (ici les positions de thèse) peuvent être traités comme le fragment d’un volume (cas 2)


### Cas 1. Un article est un document


Dans ce cas, l’éditeur souhaite mettre l’accent sur la structuration sémantique du corpus : le volume annuel n’est non pas considéré comme un document (un volume), mais comme la collection annuelle des positions publiées.  
Par conséquent, chaque position devient un document de cette collection annuelle.


#### Structure

???+ info "Hiérarchie documentaire"

    ```
    encpos                collection (collection de premier niveau)
      > annee             collection
        > positions       document
          > sections      fragment
    ```
Il convient de déclarer chacune de ces unités documentaires.

|unité documentaire|type de resource|data type| (x)path                               |
|------------------|----------------|---------|---------------------------------------|
|collection des positions|collection|file dir | `data/`                               |
|volume annuel     |collection      |file dir | `data/ENCPOS_AAAA/`                   |
|position          |document        |TEI file | `data/ENCPOS_AAAA/ENCPOS_AAAA_NN.xml` |
|section           |fragment        |TEI node | `/TEI/text/body/div`                  |

#### Corpus de test

Le corpus de test est disponible : <a href="https://github.com/chartes/dots_documentation/tree/dev/data_test/periodiques/encpos_by_abstract" target="_blank">https://github.com/chartes/dots_documentation/tree/dev/data_test/periodiques/encpos_by_abstract</a>.

!!! info "Structure du dossier de dépôt"

	```
	ENCPOS/								# collection de premier niveau
		data/
			ENCPOS_1849/				# collection
				ENCPOS_1849_04.xml		# document
				ENCPOS_1849_08.xml
			ENCPOS_1971/
				ENCPOS_1971_09.xml
				ENCPOS_1971_12.xml
				ENCPOS_1971_14.xml
			…
		metadata/						# métadonnées des collections et des documents
			custom_collections.tsv
			default_collections_titles.tsv
			documents_metadata.tsv
			dots_metadata_mapping.xml
		README.md
	```


#### Dossier `data/`

- Les documents (les fichiers XML/TEI) DOIVENT être regroupés dans un dossier `/data`.
- La structure de ce dossier `/data` permet de représenter les collections par défaut du corpus : ici, le document `ENCPOS_1849_04.xml` appartient **par défaut** à la collection `ENCPOS_1849`.

{{ macro_collapse_card_api_doc(
  verb_http="get", 
  url="https://dots.chartes.psl.eu/demo/api/dts/collection?id=ENCPOS_1849")
}}

- Nous verrons qu’un document peut appartenir à plusieurs collections.


#### Dossier `metadata/`

Ce dossier est facultatif.

Il contient les métadonnées descriptives des ressources : `default_collections_titles.tsv` pour la description des collections et `documents_metadata.tsv` pour la description des documents.

Le fichier `dots_metadata_mapping.xml` est important. Il permet de :

- lister et qualifier les métadonnées partagées via le endpoint DTS Collection ;
- déclarer leur localisation.

Ces métadonnées peuvent être inscrites "en dur" dans le document `dots_metadata_mapping.xml`. Autrement dit, la valeur est inscrite directement dans le document XML.

Elles peuvent être inscrites dans la source XML/TEI, généralement dans le `teiHeader`. Dans ce cas, la localisation est inscrite en valeur de l’attribut `@xpath`.

Elles peuvent aussi être déportées dans un tableur TSV (`@source`). Dans ce cas, la localisation est inscrite en valeur de l’attribut `@value`.

Exemples :

???+ example "titre (`dc:title`) de chaque document"
    ```xml
    <dc:title
      xpath="//titleStmt/title[@type='main' or position()=1]"
      scope="document"/>
    ```

???+ example "titre (`dc:title`) de chaque collection"
    ```xml
    <dc:title
      format="tsv"
      source="./default_collections_titles.tsv"
      resourceId="id"
      value="title"
      scope="collection"/>
    ```

{{ macro_collapse_card_api_doc(
  verb_http="get", 
  url="https://dots.chartes.psl.eu/demo/api/dts/collection?id=ENCPOS_1972")
}}

???+ note

      Il est recommandé de fournir *a minima* un TSV avec le titre des collections (ici `default_collections_titles.tsv`). 

      Si aucune métadonnée n’est fournie, DoTS utilise le nom du dossier (qui sert aussi d’identifiant de collection) comme titre de collection.


#### Déclaration des fragments

L'élément <a href="https://www.tei-c.org/release/doc/tei-p5-doc/fr/html/ref-citeStructure.html" target="_blank">`<citeStructure>`</a> est facultatif.
Il permet de déclarer la structure du document TEI et de retrouver des fragments.

???+ example "structure hiérarchique d'un document à un niveau (un chapitre = un fragment)"
    ```xml
    <citeStructure unit="chapter" match="/TEI/text/body/div" use="position()">
      <citeData use="head" property="dc:title"/>
    </citeStructure>
    ```

{{ macro_collapse_card_api_doc(
  verb_http="get", 
  url="https://dots.chartes.psl.eu/demo/api/dts/navigation?resource=ENCPOS_1972_18&down=1")
}}

#### Créer la base de données

Pour créer la base de données, il suffit de saisir la commande :

```bash
bash scripts/project_create.sh
  --basex_path '/absolute/path/to/basex/bin'
  --project_dir_path 'path/to/dots_documentation/data_test/periodiques/encpos_by_abstract'
  --top_collection_id 'ENCPOS'
  --db_name 'encpos'
```

#### Ajout d’une collection thématique

Un document peut appartenir à plusieurs collections. Mais c'est dans un second temps qu'il est possible de créer de nouvelles collections et de lier des documents déjà présents dans la base à ces collections nouvellement créées.

Il est nécessaire pour cela de préparer un tableur TSV sur le modèle de `custom_collections.tsv` puis de lancer la commande suivante.

Arguments à spécifier :

- `basex_path` : chemin absolu vers le dossier `bin` de BaseX
- `collections_tsv_path` : chemin absolu vers le fichier TSV de métadonnées de collections

```{.Bash .copy} 
usage: bash scripts/custom_collections.sh
    --basex_path string 
    --collections_tsv_path string 
```

Exemple

```{Bash}
bash scripts/custom_collections.sh --basex_path '/absolute/path/to/basex/bin' --collections_tsv_path 'path/to/tsv/file'
```

{{ macro_collapse_card_api_doc(
  verb_http="get", 
  url="https://dots.chartes.psl.eu/demo/api/dts/collection?id=normandy")
}}

{{ macro_collapse_card_api_doc(
  verb_http="get", 
  url="https://dots.chartes.psl.eu/demo/api/dts/collection?id=ENCPOS_1849_04&nav=parents")
}}

### Cas 2. Un article est un fragment

Dans ce cas, l’éditeur souhaite mettre l’accent sur la structuration matérielle du corpus : chaque année est un tome considéré comme un document (un volume).  
Par conséquent, chaque position devient un fragment de ce document.

#### Structure


???+ info "Hiérarchie documentaire"

    ```
    encpos					        collection (collection de premier niveau)
    	> annee						document
    		> positions				fragment
    			> sections			fragment
    ```

Il convient de déclarer chacune de ces unités documentaires.

|unité documentaire|type de resource|data type| (x)path                                   |
|------------------|----------------|---------|-------------------------------------------|
|collection des positions|collection|file dir | `data/`                                   |
|volume annuel     |document        |TEI file | `data/ENCPOS_AAAA.xml/`                   |
|position          |fragment        |TEI node | `/TEI/text/body/div[@type='position]'`    |
|section           |fragment        |TEI node | `/TEI/text/body/div[@type='position]/div` |

#### Corpus de test

Le corpus de test est disponible : <a href="https://github.com/chartes/dots_documentation/tree/dev/data_test/periodiques/encpos_by_volume" target="_blank">https://github.com/chartes/dots_documentation/tree/dev/data_test/periodiques/encpos_by_volume</a>.

!!! info "Structure du dossier de dépôt"

    ``` 
    ENCPOS/                           # collection de premier niveau
      data/
        ENCPOS_1849_c2.xml            # document
        ENCPOS_1971_c2.xml 
        ENCPOS_1972_c2.xml 
      metadata/
        default_resources_titles.tsv
        dots_metadata_mapping.xml     # métadonnées des collections et des documents
        fragments_metadata.tsv        
      README.md
    ```

#### Dossier `data/`

- Les documents (les fichiers XML/TEI) DOIVENT être regroupés dans un dossier `/data`.
- Ici, le document `ENCPOS_1849_c2.xml`, par exemple, regroupe toutes les positions de 1849.
{{ macro_collapse_card_api_doc(
  verb_http="get", 
  url="https://dots.chartes.psl.eu/demo/api/dts/navigation?resource=ENCPOS_1972_c2&down=1")
}}

- Chaque position est dans ce cas un fragment du document.
{{ macro_collapse_card_api_doc(
  verb_http="get", 
  url="https://dots.chartes.psl.eu/demo/api/dts/navigation?resource=ENCPOS_1972_c2&ref=ENCPOS_1972_18")
}}

#### Dossier `metadata/`

Ce dossier est facultatif.

Il contient les métadonnées descriptives : `default_resources_titles.tsv` permet de lister les titres de la collection racine et des documents.

{{ macro_collapse_card_api_doc(
  verb_http="get", 
  url="https://dots.chartes.psl.eu/demo/api/dts/collection?id=ENCPOS_c2")
}}

`fragments_metadata.tsv` permet de lister des métadonnées complémentaires pour les fragments des documents/

{{ macro_collapse_card_api_doc(
  verb_http="get", 
  url="https://dots.chartes.psl.eu/demo/api/dts/navigation?resource=ENCPOS_1972_c2&down=1")
}}

#### Déclaration des fragments

L'élément `<citeStructure>` ( <a href="https://www.tei-c.org/release/doc/tei-p5-doc/fr/html/ref-citeStructure.html" target="_blank">https://www.tei-c.org/release/doc/tei-p5-doc/fr/html/ref-citeStructure.html</a> ) est utilisé pour déclarer la structure d'un document.
  Il est possible, comme dans cet exemple, de déclarer une structure imbriquée: les chapitres dans les positions de thèse.

???+ example "`citeStructure`"
    ```xml
      <citeStructure unit="position" match="/TEI/text/body/div[@type='position']" use="@xml:id">
        <citeData use="head" property="dc:title"/>
        <citeStructure unit="chapter" match="div" use="position()">
          <citeData use="head" property="dc:title"/>
        </citeStructure>
      </citeStructure>
    ```

{{ macro_collapse_card_api_doc(
  verb_http="get", 
  url="https://dots.chartes.psl.eu/demo/api/dts/navigation?resource=ENCPOS_1972_c2&ref=r2320")
}}

{{ macro_collapse_card_api_doc(
  verb_http="get", 
  url="https://dots.chartes.psl.eu/demo/api/dts/document?resource=ENCPOS_1972_c2&ref=r2320")
}}

#### Créer la base de données

Pour créer la base de données, il suffit de saisir la commande :

```bash
bash scripts/project_create.sh
  --basex_path '/absolute/path/to/basex/bin'
  --project_dir_path 'path/to/dots_documentation/data_test/periodiques/encpos_by_volume'
  --top_collection_id 'ENCPOS_c2'
  --db_name 'encpos_c2'
```