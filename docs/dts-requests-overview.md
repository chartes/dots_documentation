# Exemplier de requêtes DTS

L’objectif de cette documentation est de **comprendre par l’exemple** les paramètres DTS disponibles et d’appréhender les usages possibles de leurs combinaisons.

!!!warning
	DoTS propose une implémentation de la version [1-alpha](https://distributed-text-services.github.io/specifications/versions/1-alpha/) de DTS pour la publication de corpus XML/TEI.  



## Définitions



- Un **projet** est une collection DTS de premier niveau : par exemple, nous distinguons ci-dessous les projets *Théâtre* et *Thèses* qui n’ont aucun rapport éditorial ou thématique.
- Une **collection** est un regroupement éditorial déclaré (thématique, chronologique…) de documents qui peut être hiérarchique (collection de collections). Un même document peut appartenir à différentes collections.
- Pour DoTS, un **document** correspond à un fichier XML/TEI. L’éditeur est invité à définir le découpage éditorial de son corpus en documents : par exemple, dans le cas de la publication d’un périodique, il peut considérer que chaque article est un document (un fichier XML/TEI par article dans ce cas), ou que le volume est un document (un unique fichier XML/TEI pour ce volume, regroupant l’ensemble des articles qui seront alors traités comme des fragments).
- Un **fragment** correspond à un passage déclaré du document. Un fragment peut-être une scène d’une pièce de théâtre, un acte d’un cartulaire, un poème dans un recueil. Les métadonnées de ces fragments sont accessibles grâce au *endpoint* `Navigation`.

## Modèle documentaire

L'essentiel des exemples présentés ci-dessous sont issus du **projet** `theater` dont le modèle documentaire est le suivant :

???+ info "Hiérarchie documentaire" 
    ```  
   
    theatre							projet (collection de premier niveau)
      > moliere						collection
        > moliere_avare 			document
          > acte					fragment
            > scène					fragment
              > tour de parole		fragment
        > moliere_dom-juan          document
        > moliere_tartuffe          document
          > acte					fragment
            > scène					fragment
              > tour de parole		fragment
              	> vers				fragment	
      > racine                      collection
        > racine_andromaque         documment
        > racine_phedre             document
      > comedie                     collection
        > moliere_avare             document
        > moliere_tartuffe          document
      > tragedie                    collection
        > moliere_dom-juan          document
        > racine_andromaque         document
        > racine_phedre             document

    ```


## *Endpoint* `Collection`

Usages : 

- Lister les membres (collections et documents) d’une collection
- Accéder aux métadonnées d’une collection
- Accéder aux métadonnées d’un document

### Requêtes DTS

Lister les **projets** disponibles : 

> On distingue ici les différents projets (collections de premier niveau) disponibles.

{{ macro_collapse_card_api_doc(
  verb_http="get",
  url="https://dots.chartes.psl.eu/demo/api/dts/collection")
}}

Lister les contenus (collections et/ou documents) du **projet** *theater* et leurs métadonnées : 

> Le projet théâtre comprend 4 collections (`totalChildren`).

{{ macro_collapse_card_api_doc(
  verb_http="get",
  url="https://dots.chartes.psl.eu/demo/api/dts/collection?id=theater")
}}

Lister le contenu de la **collection** "*Trois pièces de Molière*" : 

> Cette collection comprend 3 pièces dont les métadonnées sont listées.     
> On constate d'après `maxCiteDepth`, que la structure éditoriale peut différer d’une pièce à l’autre (être plus ou moins profonde).

{{ macro_collapse_card_api_doc(
  verb_http="get",
  url="https://dots.chartes.psl.eu/demo/api/dts/collection?id=moliere")
}}

Lister les métadonnées d'un **document** :

> Pour un `id` de **document** (`moliere_avare`), le *endpoint* `Collection` permet de lister ses métadonnées regroupées par objets, selon leur usage et espace de nom. Le premier objet regroupe les métadonnées DTS obligatoires. Il est possible de déclarer des métadonnées dans l’espace de nom de votre choix dans l’objet `extensions`, par ex. ici une licence (`dct:license`).  
> 
> La structure éditoriale est explictée ici (`citationTrees`). Elle est aussi disponible via le *endpoint* `Navigation`.
> 
> Le document et ses fragments sont disponibles en XML/TEI et HTML (`mediaTypes `).
> 
> On constate enfin que cette pièce dépend de 2 collections différentes (`totalParents`).

{{ macro_collapse_card_api_doc(
  verb_http="get",
  url="https://dots.chartes.psl.eu/demo/api/dts/collection?id=moliere_avare")
}}

Lister les collections auxquelles le **document** `moliere_avare` appartient : 

> Ici, *L'Avare* est membre des collections *Trois pièces de Molière* et *Les comédies*.  
> Il est possible de changer le "sens de circulation" pour accéder aux informations concernant les parents d'une ressource (`&nav=parents`) et non plus ses enfants (par défaut).

{{ macro_collapse_card_api_doc(
  verb_http="get",
  url="https://dots.chartes.psl.eu/demo/api/dts/collection?id=moliere_avare&nav=parents")
}}

### Options DoTS

Lister les **documents** de la **collection** `moliere` de 1669 : 

> Un utilisateur peut filtrer des résultats en fonction de la valeur d'une métadonnée de son choix (`dc:date`).  
> 
> Le paramètre DoTS `filter` est disponible pour tous les *endpoints*.  
> Il est possible de combiner différents filtres avec l’opérateur `AND`.

{{ macro_collapse_card_api_doc(
  verb_http="get",
  url="https://dots.chartes.psl.eu/demo/api/dts/collection?id=moliere&filter=dc:date=1669")
}}


## *Endpoint* `Navigation`

Usages :

- Parcourir la structure éditoriale d’un document (la hiérarchie de ses fragments)
- Accéder aux métadonnées des fragments d’un document
- Filtrer la liste des fragments selon leurs métadonnées (fonctionnalité DoTS)

### Requêtes DTS

Lister les **fragments** de niveau 1 (les actes) du **document** `moliere_tartuffe` :

> La première partie de la réponse est un descriptif détaillée de la ressource (`moliere_tartuffe`) et de sa structure éditoriale (`citationTrees`).
> La liste des fragments qui suit est calculée en fonction de la valeur du paramètre `down`.
> 
> Chaque fragment dispose d’un identifiant (`identifier`).

{{ macro_collapse_card_api_doc(
  verb_http="get",
  url="https://dots.chartes.psl.eu/demo/api/dts/navigation?resource=moliere_tartuffe&down=1")
}}

!!! warning
	
	Les requêtes de `Navigation` nécessitent 2 paramètres de requête : `ressource` (obligatoire) et un paramètre contextuel (`down`, `ref`, `start`/`end`).

Lister les **fragments** de niveau 1 et 2 (les actes et les scènes) du **document** `moliere_tartuffe` :

> Le paramètre `down` permet donc d'afficher les fragments d'un document depuis le niveau 1 **jusqu'au** niveau demandé dans `down`.
> 
> La liste des fragments est **plate** et non hiérarchique. Le niveau hiérarchique de chaque fragment (acte ou scène) est inscrit en valeur de `level` (ici `1` ou `2`).

{{ macro_collapse_card_api_doc(
  verb_http="get",
  url="https://dots.chartes.psl.eu/demo/api/dts/navigation?resource=moliere_tartuffe&down=2")
}}

Lister tous les fragments du **document** `moliere_tartuffe` :

> La valeur `-1` permet d'afficher tous les fragments d'un **document**.  
> Ici, `down=4` ou `down=-1` donnent la même réponse.

{{ macro_collapse_card_api_doc(
  verb_http="get",
  url="https://dots.chartes.psl.eu/demo/api/dts/navigation?resource=moliere_tartuffe&down=-1")
}}

Afficher les métadonnées du **fragment** dont l’identifiant est *a3* (acte 3) du **document** `moliere_tartuffe` :

> Le paramètre `ref` permet d'accéder aux métadonnées d'un fragment précis.

{{ macro_collapse_card_api_doc(
  verb_http="get",
  url="https://dots.chartes.psl.eu/demo/api/dts/navigation?resource=moliere_tartuffe&ref=a3")
}}

Afficher les métadonnées du **fragment** dont l’identifiant est *a3* (acte 3) du **document** `moliere_tartuffe` ainsi que la liste de tous les **fragments** qu'il contient et leurs métadonnées :

> Il est possible de combiner les paramètres `ref` et `down`.

{{ macro_collapse_card_api_doc(
  verb_http="get",
  url="https://dots.chartes.psl.eu/demo/api/dts/navigation?resource=moliere_tartuffe&ref=a3&down=-1")
}}

Lister les **fragments** : du fragment dont l’identifiant est *a3-s2* (acte 3, scène 2) inclus au fragment *a3-s6* (acte 3, scène 6) inclus, et leurs métadonnées :

> Les paramètres `start` et `end` permettent d'accéder à tous les fragments dans un intervalle donné. 

{{ macro_collapse_card_api_doc(
  verb_http="get",
  url="https://dots.chartes.psl.eu/demo/api/dts/navigation?resource=moliere_tartuffe&start=a3-s2&end=a3-s6")
}}

<!-- usage de tree non conforme à la spécification DTS
La liste de tous les **fragments** de type _act_ dans **l'arbre de citation** parmi tous les **fragments** du **document** _Le Tartuffe_ de Molière :

{{ macro_collapse_card_api_doc(
  verb_http="get",
  url="https://dots.chartes.psl.eu/demo/api/dts/navigation?resource=moliere_tartuffe&tree=act&down=-1")
}}
-->


### Options DoTS

Dans le **document** `moliere_tartuffe`, lister tous les **fragments** de niveau 3 (les tours de parole) dont la métadonnée `tei:role` est *Tartuffe* :

{{ macro_collapse_card_api_doc(
  verb_http="get",
  url="https://dots.chartes.psl.eu/demo/api/dts/navigation?resource=moliere_tartuffe&down=3&filter=tei:role=Tartuffe")
}}


Dans le **document** `moliere_tartuffe`, lister tous les fragments attribués à Tartuffe (https://www.wikidata.org/wiki/Q63492366) :

> Cette requête, plus robuste que la précédente (avec `down=-1`, inutile de connaître le niveau correspondant aux tours de parole), renvoie le même résultat.

{{ macro_collapse_card_api_doc(
  verb_http="get",
  url="https://dots.chartes.psl.eu/demo/api/dts/navigation?resource=moliere_tartuffe&down=-1&filter=character_QID=https://www.wikidata.org/wiki/Q63492366")
}}


## *Endpoint* `Document`

Usages :

- Afficher un document complet (XML/TEI ou HTML)
- Afficher un fragment du document 
- Afficher un intervalle de fragments du document 
- Filtrer l’affichage des fragments selon leurs métadonnées (fonctionnalité DoTS)

### Requêtes DTS

Accéder au **document** complet au format XML/TEI : 

> Pour DoTS, le format de la réponse est XML/TEI par défaut.

{{ macro_collapse_card_api_doc(
  verb_http="get",
  url="https://dots.chartes.psl.eu/demo/api/dts/document?resource=moliere_tartuffe")
}}

Accéder au **document** complet au format HTML : 

> Pour bénéficier d'une version HTML, c'est à l'éditeur de fournir les feuilles de transformation XSLT (cf. la page [Fonctionnalités avancées](advanced-rendering.md)).

{{ macro_collapse_card_api_doc(
  verb_http="get",
  url="https://dots.chartes.psl.eu/demo/api/dts/document?resource=moliere_tartuffe&mediaType=html")
}}


Accéder au **fragment** dont l’identifiant est `l0012` du **document** `moliere_tartuffe` au format XML/TEI : 

> On constate que le paramètre `ref` est disponible pour les *endpoints* `Navigation` ET `Document`. Les paramètres `start` et `end` le sont également.

{{ macro_collapse_card_api_doc(
  verb_http="get",
  url="https://dots.chartes.psl.eu/demo/api/dts/document?resource=moliere_tartuffe&ref=l0012")
}}

Accéder aux **fragments** du **fragment** `a1-s1_05` (niveau 3) au **fragment** `l0023` (niveau 4) au format XML/TEI : 

> On constate que les bornes de l'intervalle peuvent être de niveaux différents : ici de niveau 3 (tour de parole) pour le premier fragment, et de niveau 4 (vers) pour le dernier.

{{ macro_collapse_card_api_doc(
  verb_http="get",
  url="https://dots.chartes.psl.eu/demo/api/dts/document?resource=moliere_tartuffe&start=a1-s1_05&end=l0023")
}}

### Options DoTS

Dans le **document** `moliere_tartuffe`, afficher en XML/TEI tous les fragments attribués à Tartuffe (dont la métadonnée `tei:role` est "Tartuffe") :

{{ macro_collapse_card_api_doc(
  verb_http="get",
  url="https://dots.chartes.psl.eu/demo/api/dts/document?resource=moliere_tartuffe&filter=tei:role=Tartuffe")
}}

Dans le **document** `moliere_tartuffe`, afficher en HTML tous les fragments attribués à Orgon compris entre l'acte 1 et l'acte 3 :

> Le paramètre DoTS `filter` peut être combiné avec les autres paramètres DTS (ici avec `start`, `end` et `mediaType`).

{{ macro_collapse_card_api_doc(
  verb_http="get",
  url="https://dots.chartes.psl.eu/demo/api/dts/document?resource=moliere_tartuffe&start=a1&end=a3&filter=tei:role=Orgon&mediaType=html")
}}

Afficher le **fragment** `r3587` (Troisième partie) du **document** `ENCPOS_1972_18`, en excluant les **fragments "enfants"** : 

{{ macro_collapse_card_api_doc(
  verb_http="get",
  url="https://dots.chartes.psl.eu/demo/api/dts/document?resource=ENCPOS_1972_18&ref=r3587&excludeFragments=true")
}}

Ce tour d'horizon de l'implémentation DoTS de l’API DTS montre qu'il est possible d'accèder très finement aux **documents**, aux **fragments** d'un document et à toutes leurs **métadonnées** grâce aux trois *endpoints* et à la combinaison de leurs paramètres.
