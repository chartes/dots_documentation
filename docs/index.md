# Présentation

<img src="./assets/dots-logo-retro.drawio.svg" alt="dots-logo" width="30%" style="display: block; margin: 0 auto;">

DoTS est une implémentation en XQuery de la spécification d'API DTS (<a href="https://distributed-text-services.github.io/specifications/" target="_blank">Distributed Text Services</a>), adossée au logiciel de base de données XML <a href="https://basex.org/" target="_blank">BaseX</a>.

Cet outil permet de publier aisément des sources en XML/TEI selon les principes FAIR (Findable, Accessible, Interoperable, Reusable).

La présente documentation indique :

- [comment installer DoTS](installation.md),
- et comment [organiser ses sources](dots-project-folder.md) TEI pour [publier un corpus](publishing-workflow.md).

## Code source

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/chartes/dots/blob/master/LICENSE.md)

Le code source de **DoTS** est disponible sous license MIT sur GitHub à l'adresse suivante : <a href="https://github.com/chartes/dots" target="_blank">https://github.com/chartes/dots</a>.

La version actuelle respecte la dernière version 1-alpha de la spécification DTS.

## Testez DoTS !

![](https://validator.swagger.io/validator?url=https://chartes.github.io/dots_documentation/api/openapi.json)

Si vous souhaitez tester notre résolveur DTS, les différents endpoints sont présentés dans la documentation OpenAPI 3.0 [disponible ici](api.md). 


Le serveur de démo est aussi directement accessible à l'adresse suivante : <a href="https://dots.chartes.psl.eu/demo/api/dts/" target="_blank">https://dots.chartes.psl.eu/demo/api/dts/</a>.

Les corpus qui s'y trouvent sont ceux présentés dans le [cookbook](cookbook/index.md) de cette documentation.

D'autres exemples vont venir en complément.

## Corpus disponibles

### Corpus de l'école nationale des chartes

Tous les corpus mis à disposition par l'école sont disponibles sur notre serveur <a href="https://dots.chartes.psl.eu/api/dts/collection" target="_blank">DoTS</a>.

Actuellement, seul le corpus des <a href="https://dots.chartes.psl.eu/api/dts/collection?id=ENCPOS" target="_blank">Positions de thèses de l'École nationale des chartes</a> est accessible, accompagné d'une <a href="https://theses.chartes.psl.eu/" target="_blank">application d'édition</a>. 

### Autres corpus

DoTS étant un outil libre, d'autres institutions (particulièrement nos partenaires de Biblissima+) peuvent mettre leur corpus à disposition.

Si vous avez partagé des corpus TEI grâce à DoTS, n'hésitez pas à nous le faire savoir !