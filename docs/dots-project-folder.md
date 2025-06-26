# Le dossier de dépôt

Le dossier de dépôt est le dossier chargé en base grâce aux modules DoTS et contenant les sources XML/TEI publiées.

Pour tirer avantage de l’ensemble des outils de la suite DoTS, votre dossier de dépôt doit se conformer aux recommandations détaillées dans ce document.

Ce document détaille en particulier les règles de structuration de ce dossier de dépôt ainsi que les méthodes disponibles pour déclarer les métadonnées des ressources publiées (collections, documents et fragments).

Des [cookbooks](./cookbook/index.md) illustrent la mise en œuvre de ces recommandations, pour différents types de publication, genres littéraires et choix documentaires.


## Structure du dossier de dépôt

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
		metadata/						# OPTIONNEL. Métadonnées des collections et des documents
			dots_metadata_mapping.xml	# Déclaration du chemin des métadonnées
			metadata_1.tsv				# Un fichier de métadonnées
			metadata_2.tsv				# idem
		README.md						# OPTIONNEL. Documentation (plan de nommage, etc.)
	```


- `nom_projet/`: racine du dossier de dépôt. Son nom est libre. Au chargement en base, vous pourrez spécifier le nom de la base de données BaseX, ainsi que l’identifiant DTS attribué à la collection racine.

- `data/`: les documents XML/TEI. Ce dossier est **obligatoire**. Il contient les sources XML/TEI de votre projet organisées selon la hiérarchie de votre choix. Cette hiérarchie représente les collections **par défaut** de votre projet. Par exemple, ici, les documents `file_1.xml` et `file_2.xml` appartiennent à la collection `collection_1`.

- `metadata/`: les métadonnées. Ce dossier est **optionnel**. Si présent, il doit contenir *a minima* le document XML `dots_metadata_mapping.xml` qui permet de déclarer l’accès aux métadonnées des collections et/ou des documents. 

- `README.md`. Ce fichier est optionnel. Il permet de documenter le dossier de dépôt.


## Déclarer la structure éditoriale du projet


### Collections par défaut

La structuration du dossier `data/` représente la structure éditoriale du projet.

Vous pouvez structurer vos documents en collections et sous-collections hiérarchiques (ou tous les déposer "à plat" en racine du dossier).


??? example "Le projet contient une unique collection racine"

	```
	moliere_project/
		data/
			avare.xml
			scapin.xml
			tartuffe.xml
	```

??? example "Le projet contient des sous-collections"

	```
	theater_project/
		data/
			corneille/
				cid.xml
				horace.xml
			moliere/
				avare.xml
				scapin.xml
				tartuffe.xml
	```

??? example "Le projet contient des sous-sous-collections, etc."

	```
	theater_project/
		data/
			corneille/
				cid.xml
				horace.xml
			moliere/
				ballet/
					psyche.xml
				comedy/
					avare.xml
					scapin.xml
					tartuffe.xml
	```

### Autres collections

Avec DoTS, un même document peut-être assigné à différentes collections.

La description de ces nouvelles collections – avec la liste de leurs documents – doit être structurée dans un TSV conforme au modèle suivant.

| |dbName|collectionId|dc:title|parentId|documentIds|dc:description|
|-|------|------------|-----|---------|-----------|-----------|
|**Description**|nom de la db du projet|id de la collection|`dc:title`|id de la collection parente|liste des ids des documents|`dc:description`|
|**Example**|theater|comedy|Les comédies classiques|theatre-genre|avare\|illusion-comique\|plaideurs|Les comédies de Corneille, Molière et Racine|
	

### Passages

Le endpoint `Navigation` permet de lister les passages référencés d’un document. Le endpoint `Document` permet d’en afficher le contenu.

Ce découpage éditorial optionnel d’un document est déclaré dans son `teiHeader` grâce à l’élément <a href="https://www.tei-c.org/release/doc/tei-p5-doc/en/html/ref-citeStructure.html" target="_blank">`citeStructure`</a>.

Cette déclaration est **optionnelle**.


???+ example "Example de `tei:citeStructure` pour une pièce de théâtre"

	```xml
	<citeStructure match="//div[@type='act']" use="@xml:id" unit="act">
		<citeData use="head" property="dc:title"/>
		<citeStructure match="div[@type='scene']" use="@xml:id" unit="scene">
			<citeData use="head" property="dc:title"/>
			<citeStructure match="sp" use="position()" unit="speaker">
				<citeData use="substring-after(@who, '#')" property="dc:title"/>
				<citeStructure match="l" use="@xml:id" unit="verse"/>
			</citeStructure>
		</citeStructure>
	</citeStructure>
	```


## Déclarer les métadonnées des ressources du projet

### Métadonnées obligatoires

**Pour une collection et un document**, DTS impose la déclaration d’un identifiant et d’un titre. Cependant, pour publier un projet, DoTS n’a besoin d’aucune métadonnée et attribue automatiquement aux ressources un identifiant et un titre défini selon l'ordre de priorité suivant :

#### Pour une collection

Identifiant :

1. nom du dossier de collection dans `data/`

???+ warning
	
	L'utilisation d’espace ou de diacritique pour le nommage de ces dossiers n'est donc pas autorisé. Un plan de nommage de ces dossiers de collection peut utilement documenter un dossier de dépôt dans le `README.md`.

Titre (`dc:title`) :

1. valeur référencée dans `metadata/dots_metadata_mapping.xml` (voir [surcharge](#surcharge-et-metadonnees-optionnelles))
1. nom du dossier de collection dans `data/`

???+ note
	
	Il est recommandé de déclarer dans un fichier TSV le titre des collections (ainsi que toutes les métadonnées utiles à leur description). 
    
    Il est utile de donner aussi le titre du projet (collection de premier niveau).

#### Pour un document

Identifiant :

1. valeur de l’attribut `/TEI/@xml:id` du fichier
1. nom du fichier

Titre (`dc:title`) :

1. valeur référencée dans `metadata/dots_metadata_mapping.xml` (voir [surcharge](#surcharge-et-metadonnees-optionnelles))
1. valeur de `/TEI/teiHeader/fileDesc/titleStmt/title[@type='main']`
1. valeur de `/TEI/teiHeader/fileDesc/titleStmt/title[1]`


####Pour un passage

DTS impose la déclaration d’un identifiant. DoTS attribue automatiquement aux passages un identifiant selon la déclaration faite par l’éditeur dans l’élément `citeStructure`. L’identifiant est copié ou calculé selon la valeur de l’attribut `citeStructure/@use`.

!!! warning

    Pour l’attribution des identifiants de passage déclarés en valeur de `citeStructure/@use`, DoTS prends en charge la **seule** valeur `@xml:id`, qui garantit l’unicité de cette identification des passages dans le document. DoTS ne traite pas les autres valeurs possibles de `@use`, telles que `position()` ou `@n`, et attribue automatiquement un identifiant aux passages selon leur ordre d’inscription dans le registre DoTS.


### Surcharge et métadonnées optionnelles

Pour les collections et les documents, le fichier `metadata/dots_metadata_mapping.xml` permet :

- de surcharger le titre (`dc:title`) attribué par défaut par DoTS

Pour les collections, les documents et les passages, le fichier `metadata/dots_metadata_mapping.xml` permet :

- d’appeler optionnellement toutes les métadonnées souhaitées. Et ces métadonnées peuvent être inscrites directement dans le fichier `metadata/dots_metadata_mapping.xml` et/ou dans le `teiHeader` des documents et/ou déportées dans un tableur.


!!! example "dots_metadata_mapping.xml"

	```xml
	<?xml version="1.0" encoding="UTF-8"?>
	<metadataMap xmlns="https://github.com/chartes/dots/"
	  xmlns:dc="http://purl.org/dc/elements/1.1/"
	  xmlns:dct="http://purl.org/dc/terms/"
	  xmlns:html="http://www.w3.org/1999/xhtml">
	  <mapping>
	    <dc:title  scope="collection" format="tsv" source="./default_collections_titles.tsv" value="title"/>
	    <dct:license scope="document" resourceId="all" value=".">https://creativecommons.org/licenses/by-nc-sa/4.0/</dct:license>
	    <dc:title scope="document" xpath="//titleStmt/title[@type = 'main' or position() = 1]"/>
	    <html:h1 scope="document" format="tsv" source="./documents_metadata.tsv" value="title_rich"/>
	    <dc:date  scope="document" format="tsv" source="./documents_metadata.tsv" value="promotion_year" type="number"/>
	    <dc:creator scope="document" format="tsv" source="./documents_metadata.tsv" value="author_fullname_label"></dc:creator>
	    <dct:creator scope="document" format="tsv" source="./documents_metadata.tsv" value="author_idref_ppn" prefix="https://www.idref.fr/" key="@id"/>
	    <dct:extent scope="document" format="tsv" source="./documents_metadata.tsv" value="pagination"/>
	  </mapping>
	</metadataMap>
	```

Pour déclarer une métadonnée, c'est le nom de l’élément XML avec le préfixe qui permet de qualifier son vocabulaire d’appartenance. La procédure de déclaration varie ensuite selon le lieu où est inscrite la métadonnée.

Ces métadonnées peuvent être inscrites :

- dans le fichier `dots_metadata_mapping.xml` pour les valeurs communes à l’ensemble des collections ou à l’ensemble des documents.
- dans un fichier TSV (pour les collections, les documents et les passages)
- dans le fichier XML/TEI (pour les seuls documents)

#### Métadonnées inscrites dans `dots_metadata_mapping.xml`

Certaines métadonnées, telle qu’une licence, peuvent être partagées par l’ensemble des ressources. Dans ce cas, leur valeur peut être renseignée directement dans `dots_metadata_mapping.xml`.


!!! abstract "Template"

	```xml
	<ns:property
		scope="collection|document|fragment"
		resourceId="all"
		value=".">property value</ns:property>
	```


!!! example "Exemple. Déclaration d’une licence commune à tous les documents"

	```xml
	<dct:license
		scope="document"
		resourceId="all">https://creativecommons.org/licenses/by-nc-sa/4.0/</dct:license>
	```

|attribut|définition|valeur| commentaire                                                |
|--------|----------|------|------------------------------------------------------------|
|`@scope`|type des ressources décrites|`collection` ou `document` ou `fragment`|                                                            |
|`resourceId`|ids des ressources décrites|`all`| la métadonnée décrit toutes les ressources d’un type donné |

<!--
**Modèle**
```xml
<ns:property scope="collection|document" resourceId="all" value=".">property value</ns:property>
```

- `<propriété/>` : le nom de l'élément permet de définir la propriété attendue en réponse de la requête API. Dans l'exemple, la propriété est la licence en dublin core.
- `@scope` : la valeur attendue est *collection* ou *document*, selon la porté de la métadonnée.
- `@resourceID` : la valeur doit être ici *all* pour spécifier que la métadonnée concerne l'ensemble des ressources (collection ou document).
- le contenu de l'élément correspond à la valeur attendue pour la réponse d'API.
-->



#### Métadonnées déportées dans un tableur TSV

Les métadonnées des documents, des collections et des fragments peuvent être déportées dans un tableur. `dots_metadata_mapping.xml` permet de les appeler.

!!! abstract "Template"

	```xml
	<ns:property
		scope="collection|document|fragment"
		format="tsv"
		source="./metadata_file.tsv"
		value="value_column-header"/>
	```


!!! example "Exemple. Appel des dates de publication (`dc:date`) des documents"

	```xml
	<dc:date 
		scope="document" 
		format="tsv"
		source="./documents_metadata.tsv"
		value="publication_year"/>
	```

!!! example "Exemple. `documents_metadata.tsv`"

	|id|titre|publication_year|
	|------|-----|----------------|
	|ENCPOS_1849_08|Wala et Louis le Débonnaire|1849|
	|ENCPOS_1971_14|Le bestiaire héraldique au Moyen Âge|1972|

!!! warning

    La première colonne du tableur doit obligatoirement s'intituler `id` et contenir l'identifiant de la ressource décrite.

|attribut|définition|valeur|commentaire|
|--------|----------|------|-----------|
|`@scope`|type des ressources décrites|`collection` ou `document` ou `fragment`||
|`@format`|format du fichier de métadonnées appelé|`tsv`||
|`@source`|chemin vers le fichier de métadonnées|`path/to/file`||
|`@value`|nom de la colonne contenant la valeur de la métadonnée|||

#### Métadonnées inscrites dans la source XML/TEI

Les métadonnées d’un document peuvent être inscrites dans son `teiHeader`. `dots_metadata_mapping.xml` permet de les appeler en spécifiant un chemin XPath.


!!! abstract "Template"

	```xml
	<ns:property
		scope="document" 
		xpath="xpath/to/metadata"/>
	```


!!! example "Exemple. Appel de l’éditeur (`dc:publisher`) des documents"

	```xml
	<dc:publisher 
		scope="document" 
		xpath="/TEI/teiHeader/fileDesc/publicationStmt/publisher"/>
	```

|attribut|définition|valeur|commentaire|
|--------|----------|------|-----------|
|`@scope`|type des ressources décrites|`document`||
|`@xpath`|chemin de la métadonnée|||


#### Autres fonctionnalités

D'autres fonctionnalités sont par ailleurs disponibles.

##### Typage des valeurs

Par défaut, toutes les valeurs des métadonnées sont considérées comme des chaînes de caractère.

Mais il est toujours possible de préciser le type de valeur attendue pour la métadonnée avec l'attribut `@type` : *number*, *boolean* ou *null* selon les besoins. 

|attribut|définition|valeur|commentaire|
|--------|----------|------|-----------|
| `@type` | type de données | `number`, `boolean` ou `null`||

!!! warning

	Si la valeur ne correspond pas au type demandé, la réponse d'API affiche une erreur.

##### Utilisation de valeurs multiples

L'utilisateur peut vouloir plusieurs valeurs pour une même métadonnée. Par exemple, utiliser plusieurs fois la métadonnée `dct:creator` afin de renvoyer à plusieurs référentiels.

Dans ce cas de figure, il est **obligatoire** d'ajouter un attribut supplémentaire `@key` qui permet de créer une **liste** de valeurs dans la réponse d'API en JSON. Chaque élément de cette liste est précédée d'une *clef* dont la valeur est spécifiée dans cet attribut `@key`.

Par exemple :

!!! example "Exemple. Appel de plusieurs **creator** (`dct:creator`)"

    ```xml
        <dct:creator 
		    scope="document" 
		    format="csv" 
            source="./path/to/tsv" 
            value="creator_idref" key="@id"/>
        <dct:creator 
		    scope="document" 
		    format="csv" 
            source="./path/to/tsv" 
            value="creator_data_bnf" key="@id"/>
    ```

Cet exemple permettrait d'avoir une réponse `json` de ce type :

!!! example "Extrait de réponse `json`"
    
    ```json
         "dct:creator": [
          {
            "@id": "https://www.idref.fr/26798441"
          },
          {
            "@id": "https://data.bnf.fr/ark:/12148/cb11897617m"
          }
        ]
    ```

##### Concaténation de chaînes de caractères

Il est toujours possible de concaténer une métadonnée avec un préfix et/ou un suffixe, en utilisant simplement les attributs `@prefix` et/ou `@suffix`.

|attribut|définition|valeur|commentaire|
|--------|----------|------|-----------|
|`@prefix`| prefix à concaténer avec la métadonnée|||
|`@suffix`| suffix à concaténer avec la métadonnée |||
