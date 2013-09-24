---
quote: A good system can't have a weak command language.
title: Quick Start Guide
layout: default
related: ""
toc: false
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
and HTTP interfaces on port 5820.<n>That is, the server listens to one port (5820) and handles both protocols.</n>

```bash
$ ./stardog-admin server start
```

Fourth, create a database with an input file:

```bash
$ ./stardog-admin db create -n myDB examples/data/University0_0.owl
```

Fifth, query the database:

```bash
$ ./stardog query myDB "SELECT DISTINCT ?s WHERE { ?s ?p ?o } LIMIT 10"
```

You can use the Web Console to search or query the new database you created by hitting [http://localhost:5820/myDB](http://localhost:5820/myDB) in yr browser.

Now, go have a drink: you've earned it.
