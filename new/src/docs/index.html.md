[![](/_/img/sdog-bare.png)](/)

> **Functions delay binding; data structures induce binding. Moral:
> Structure data late in the programming process.**—Alan Perlis,
> Epigrams in Programming

Stardog Docs {#title}
============

Shortcuts {#toc-title}
=========

1.  [Download](http://stardog.com/dl/) Stardog
2.  [Quick Start Guide](quick-start)
3.  [Support
    Forum](https://groups.google.com/a/clarkparsia.com/group/stardog/about)

Introduction {#chapter}
============

Stardog is a [fast](../docs/performance), lightweight, commercial RDF
database for mission-critical apps: it supports [SPARQL
1.1](http://www.w3.org/TR/2012/WD-sparql11-query-20120105/);As of
@@VERSION@@, Stardog's SPARQL 1.1 support does not include: UPDATE query
language; federation; UPDATE protocol; no entailment regimes other than
OWL 2 Direct Semantics. We will address these in upcoming releases. HTTP
and the SNARL protocol for remote access and control;
[RDF](http://www.w3.org/RDF/) as a data model; and [OWL
2](http://www.w3.org/TR/owl2-overview/) for inference and data
analytics.

Acquiring Stardog & Support
---------------------------

[Download](http://stardog.com/dl/) Stardog to get started. The [Stardog
support
forum](https://groups.google.com/a/clarkparsia.com/group/stardog/about),
[stardog@clarkparsia.com](mailto:stardog@clarkparsia.com), is the place
to report bugs, ask questions, etc. You can also ask questions on [Stack
Overflow](http://stackoverflow.com/) using the tag *stardog*.

Contributing
------------

There are several open source components of Stardog; feel free to submit
pull requests!

-   [stardog-docs](https://github.com/clarkparsia/stardog-docs)
-   [stardog.js](https://github.com/clarkparsia/stardog.js)
-   [stardog-groovy](https://github.com/clarkparsia/stardog-groovy)
-   [stardog-spring](https://github.com/clarkparsia/stardog-spring)
-   [stardog.rb](https://github.com/antoniogarrote/stardog-rb)

### Acknowledgments

Thanks to all the Stardog testers, especially Robert Butler, Al Baker,
Marko A. Rodriguez, Brian Sletten, Alin Dreghiciu, Rob Vesse, Stephane
Fallah, John "New Model Army" Goodwin, José Devezas, Chris
Halaschek-Wiener, Gavin Carothers, Brian Panulla, Ryan Kohl, Morton
Swimmer, Quentin Reul, Paul Dlug, James Leigh, Alex Tucker, Ron
Zettlemoyer, Jim Rhyne. Andrea Westerinen, Huy Phan.

The Essential Documentation {#chapter}
===========================

This is documentation for Stardog **@@VERSION@@** (**@@DATE@@**). Check
out the [release notes](../docs/RELEASE_NOTES.txt) and the
[FAQ](../docs/faq/).

[Quick Start Guide](../docs/quick-start)
----------------------------------------

Instructions to get up-and-running very quickly with Stardog.

[Terminology](../docs/term/)
----------------------------

A [glossary](../docs/term/) of technical terms used throughout the
Stardog docs.

[Stardog Compatibility Policies: The Future of Queries, Data, and Programs](../docs/compatibility/)
---------------------------------------------------------------------------------------------------

A statement of the policies we will pursue in evolving Stardog beyond
the 1.0 release.

[Administration](../docs/admin/)
--------------------------------

1.  [CLI Overview](../docs/admin/#cli)
2.  [Administering a Stardog Server](../docs/admin/#admin-server)
3.  [Administering a Stardog Database](../docs/admin/#admin-db)
4.  [Configuring Security](../docs/admin/#security)
5.  [Managing Search Indexes](../docs/admin/#search)
6.  [Optimizing Bulk Data Loading](../docs/admin/#optimizing-bulk-load)
7.  [Resource Requirements for
    Stardog](../docs/admin/#resource-requirements)
8.  [Using Stardog on Windows](../docs/admin/#using-windows)

[Using Stardog](../docs/using/)
-------------------------------

1.  [Using Stardog](../docs/using/#using-stardog)
2.  [Querying a Database](../docs/using/#query)
3.  [Adding and Removing](../docs/using/#add-remove)
4.  [Exporting a Database](../docs/using/#export)
5.  [Searching](../docs/using/#search)

[Security](../docs/security)
----------------------------

1.  [The User & Security Model](../docs/security/#model)
2.  [Command-line Interface](../docs/security/#cli)
3.  [Programmatic Access](../docs/security/#api)
4.  [Deploying Stardog Securely](../docs/security/#deployment)

[Integrity Constraint Validation](../docs/sdp)
----------------------------------------------

1.  [Background & Terminology](../docs/sdp/#intro)
2.  [Validating RDF with Closed World Integrity
    Constraints](../docs/sdp/#validation)

[OWL 2 Reasoning](../docs/owl2)
-------------------------------

1.  [Using Stardog's Reasoning Capabilities](../docs/owl2/#reasoning)
2.  [Not Getting Expected Answers?](../docs/owl2/#trouble)
3.  [Known Issues](../docs/owl2/#issues)
4.  [Guidelines](../docs/owl2/#guidelines)
5.  [Technical Background](../docs/owl2/#query)

[Programming with Java](../docs/java/)
--------------------------------------

1.  [Introduction](../docs/java/#intro)
2.  [Creating and Administering Databases](../docs/java/#admin)
3.  [Creating a Connection String](../docs/java/#connection)
4.  [Security in Stardog](../docs/java/#security)
5.  [Using SNARL](../docs/java/#snarl)
6.  [Using Sesame](../docs/java/#sesame)
7.  [Using Jena](../docs/java/#jena)
8.  [Client-Server Stardog](../docs/java/#client-server)
9.  [Embedded Stardog](../docs/java/#embed)
10. [Connection Pooling](../docs/java/#pool)
11. [Deprecation & Backward Compatibility](../docs/java/#deprecation)

[Network Programming](../docs/network/)
---------------------------------------

1.  [SPARQL Protocol: HTTP](../docs/network/#http)
2.  [Extended HTTP Protocol](../docs/network/#extended-http)
3.  [SNARL: The Native Stardog Remote API](../docs/network/#snarl)

[Programming with Spring](../docs/spring)
-----------------------------------------

1.  [Introduction](../docs/spring/#intro)
2.  [Building Spring for Stardog](../docs/spring/#building)
3.  [Overview](../docs/spring/#overview)
4.  [Basic Spring](../docs/spring/#basic)
5.  [Spring Batch](../docs/spring/#batch)
6.  [Examples](../docs/spring/#examples)

[Programming with Groovy](../docs/groovy/)
------------------------------------------

1.  [Introduction](../docs/groovy/#intro)
2.  [Building Groovy for Stardog](../docs/groovy/#building)
3.  [Overview](../docs/groovy/#overview)
4.  [Examples](../docs/groovy/#examples)

The Man Pages
-------------

`stardog-admin`

> `db copy, db create, db drop, db list, db migrate, db offline, db online, db optimize, db status.`
>
> `icv add, icv drop, icv remove.`
>
> `metadata get, metadata set.`
>
> `query kill, query list, query status.`
>
> `role add, role grant, role list, role permission, role remove, role revoke.`
>
> `server start, server stop.`
>
> `user add, user disable, user enable, user addrole, user removerole, user grant, user list, user passwd, user permission, user remove, user revoke.`

`stardog`

> ` data add, data export, data remove, data size.`
>
> ` icv convert, icv validate.`
>
> ` namespace add, namespace list, namespace remove.`
>
> ` query execute, query explain, query search.`
>
> ` reasoning consistency, reasoning explain.`

Known Issues {#chapter}
============

As of **@@VERSION@@**, the known issues include:

1.  Asking for all individuals with reasoning via the query
    `{?s a owl:Thing}` might also retrieve some classes and properties.
    **WILLFIX**
2.  Schema queries do not bind graph variables.
3.  Dropping a database with the CLI will also delete all the data files
    on your Stardog home directory associated with that database. If you
    want to keep the data files but only remove the database from the
    system catalog, then you need to manually copy these files to
    another location before deleting the database.
4.  If relative URIs exist in the data files passed to create, add, or
    remove commands, then they will be resolved using the constant base
    URI `http://api.stardog.com/` iff the format of the file allows base
    URIs. Turtle and RDF/XML formats allows base URIs but N-Triples
    format doesn't allow base URIs and relative URIs in N-Triples data
    will cause errors.
5.  queries with `FROM NAMED` with a named graph that is *not* in
    Stardog will **not** cause Stardog to believe that it is, in fact,
    Maven, i.e., to automagically download the data from an arbitrary
    HTTP URL and include it in the query. Stardog will *only* evaluate
    queries over data that has been loaded into it.
6.  SPARQL queries without a context or named graph are executed against
    the default, unnamed graph. In Stardog, the default graph is *not*
    the union of all the named graphs and the default graph. Note: this
    behavior is configurable via the `query.all.graphs` configuration
    parameter.
7.  RDF literals are limited to 8MB (after compression) in Stardog.
    Input data with literals larger than 8MB (after compression) will
    raise an exception.

Notes {.fn}
=====

[⌂](# "Back to top")


