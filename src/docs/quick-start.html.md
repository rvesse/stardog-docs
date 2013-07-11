---
quote: A good system can't have a weak command language.
title: Quick Start Guide
layout: default
related: ""
toc: false
summary: 'This guide explains the basic steps to get you started quickly with Stardog on a Unix machine. We test every Stardog release extensively with various flavors of Linux and OS X. Please report a bug if you find issues on other platforms.'

---

First, tell Stardog where its home directory (where databases and other
files will be stored) is:

```bash
$ export STARDOG_HOME=/data/stardog
```

If you're using some weird Unix shell that doesn't create environment variables in this way, adjust accordingly.

<t>shout</t> Stardog requires `STARDOG_HOME` to be defined.

Second, copy the `stardog-license-key.bin` into the right place:

```bash
$ cp stardog-license-key.bin $STARDOG_HOME
```

Of course `stardog-license-key.bin` has to be readable by the Stardog
process. 

<t>shout</t> Stardog won't run without a valid `stardog-license-key.bin` in `STARDOG_HOME`.

Third, start the Stardog server. By default the server will expose SNARL
and HTTP interfaces—on ports 5820 and 5822, respectively.

```bash
$ ./stardog-admin server start
```

Fourth, create a database with an input file; use the `--server`
parameter to specify which server:

```bash
$ ./stardog-admin db create -n myDB -t D -u admin -p admin \ examples/data/University0_0.owl
```

Fifth, optionally, admire the pure RDF bulk loading power...woof!

Sixth, query the database:

```bash
$ ./stardog query myDB "SELECT DISTINCT ?s WHERE { ?s ?p ?o } LIMIT 10"
```

Seventh, go have a beer: you've earned it!