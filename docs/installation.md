# DoTS

## What is DoTS?

DoTS is an XQuery implementation of DTS using a <a href="https://basex.org/" target="_blank">BaseX</a> backend.

!!! Note

    **DoTS supports only DTS GET requests** for browsing collections, document retrieval and navigation.

## What is DTS?

The <a href="https://distributed-text-services.github.io/specifications" target="_blank">Distributed Text Services</a> (DTS) Specification defines an API for working with collections of text as machine-actionable data.

Publishers of digital text collections can use the DTS API to help them make their textual data Findable, Accessible, Interoperable and Reusable (<a href="https://www.ccsd.cnrs.fr/principes-fair/" target="_blank">FAIR</a>).

## Capabilities

Using DoTS, you can

- with the DTS Collection endpoint:
	- Retrieve lists of collection members.
	- Retrieve metadata about individual collection items.
- with the DTS Navigation endpoint:
	- Retrieve lists of citeable passages within a text.
	- Retrieve a range of citeable passages within a text.
	- Retrieve metadata about the citation structure of a document.
- with the DTS Document endpoint:
	- Retrieve a single text passage at any level of the citation hierarchy.
	- Retrieve a range of text passages with a clearly defined start and end passage.
	- Retrieve an entire text.

## Install

### BaseX

Download BaseX (>= 11.8): <a href="https://basex.org/download/" target="_blank">https://basex.org/download/</a>

!!! info

	- Prefer `ZIP Package`, which ensure that you will find the complete BaseX folder.
	- Requirements : <a href="https://docs.basex.org/wiki/Startup#Startup" target="_blank">https://docs.basex.org/wiki/Startup#Startup</a>


### DoTS

DoTS can be installed in any folder outside the BaseX directory.

```Bash
cd path/to/desired/installation/folder
```

```{.Bash .copy}
git clone https://github.com/chartes/dots.git
```

The structure of your DoTS repository should be as follows:


	dots/				# DoTS root dir.
		data/			# Database directory.
		repo/			# XQuery module (DTS backend, DTS resolver, etc.).
		schema/         # Relax NG schemas for validating DoTS registers.
		scripts/		# Bash and XQuery scripts to manage a DoTS project.
		tests/			# XQuery unit tests for continuous integration.
		webapp/			# Web Application directory.
			restxq/		# RESTXQ folder containing the API routes.
		...				# Others files.

## Start DTS resolver

```Bash
cd path/to/dots
```

```Bash
bash /path/to/basex/bin/basexhttp
```

By default, the base DTS API enpoint is available at <a href="http://localhost:8080/api/dts/" target="_blank">http://localhost:8080/api/dts/</a>.