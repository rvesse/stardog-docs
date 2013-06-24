[![](/_/img/sdog-bare.png)](/)

> **A good system can't have a weak command language.**—Alan Perlis,
> Epigrams in Programming

Stardog \
Quick Start {#title}
===========

Unix Quick Start {#chapter}
================

This guide explains the basic steps to get you started quickly with
Stardog on a UnixWe test every Stardog release extensively with various
flavors of Linux and OS X. Please report a bug if you find issues on
other platforms. box.

First, tell Stardog where its home directory (where databases and other
files will be stored) is:If you're using some weird Unix shell that
doesn't create environment variables in this way, adjust accordingly.
Stardog requires `STARDOG_HOME` to be defined.

    $ export STARDOG_HOME=/data/stardog

Second, copy the `stardog-license-key.bin`You'll get this either with an
evaluation copy of Stardog or with a licensed copy. into place:

    $ cp stardog-license-key.bin $STARDOG_HOME

Of course `stardog-license-key.bin` has to be readable by the Stardog
process.

Third, start the Stardog server. By default the server will expose SNARL
and HTTP interfaces—on ports 5820 and 5822, respectively.

    $ ./stardog-admin server start

Fourth, create a database with an input file; use the `--server`
parameter to specify which server:

    $ ./stardog-admin db create -n myDB -t D -u admin -p admin examples/data/University0_0.owl

Fifth, optionally, admire the pure RDF bulk loading power...woof!

Sixth, query the database:

    $ ./stardog query myDB "SELECT DISTINCT ?s WHERE { ?s ?p ?o } LIMIT 10"

Notes {.fn}
=====

[⌂](# "Back to top")

For comments, questions, or to report problems with this page, please
email the [Stardog Support
Forum](https://groups.google.com/a/clarkparsia.com/group/stardog/about).


