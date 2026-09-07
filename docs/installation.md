# Install DoTS


## BaseX

Download BaseX (>= 12.0): <a href="https://basex.org/download/" target="_blank">https://basex.org/download/</a>

!!! info

	- Prefer `ZIP Package`, which ensure that you will find the complete BaseX folder.
	- Requirements : <a href="https://docs.basex.org/wiki/Startup#Startup" target="_blank">https://docs.basex.org/wiki/Startup#Startup</a>


## DoTS

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