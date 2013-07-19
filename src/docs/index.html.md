---
quote: "Functions delay binding; data structures induce binding. Moral: Structure data late in the programming process."
layout: "default"
title: "Stardog Docs"
root: true
toc: true
summary: 
---

This is documentation for Stardog <t>version</t> (<t>reldate</t>). Check
out the [release notes](/RELEASE_NOTES.txt).

## Introducing Stardog

Stardog is a fast, lightweight, commercial RDF
database for mission-critical apps: it supports [SPARQL
1.1](http://www.w3.org/TR/2012/WD-sparql11-query-20120105/); HTTP
and the SNARL protocol for remote access and control;
[RDF](http://www.w3.org/RDF/) as a data model; [OWL
2](http://www.w3.org/TR/owl2-overview/) and rules for inference and data
analytics.

### Acquiring Stardog & Support

[Download](http://stardog.com/dl/) Stardog to get started. The [Stardog support forum](https://groups.google.com/a/clarkparsia.com/group/stardog/about),
<a href="mailto:stardog@clarkparsia.com">stardog@clarkparsia.com</a>, is the place
to report bugs, ask questions, etc. You can also ask questions on [Stack
Overflow](http://stackoverflow.com/) using the tag *stardog*.

**For information about [Stardog commercial licensing], you can [drop us a line](mailto:sales@clarkparsia.com) to start a conversation.**

### Contributing

There are several open source components of Stardog; feel free to submit
pull requests: [stardog-docs](https://github.com/clarkparsia/stardog-docs), [stardog.js](https://github.com/clarkparsia/stardog.js), [stardog-groovy](https://github.com/clarkparsia/stardog-groovy), [stardog-spring](https://github.com/clarkparsia/stardog-spring), and [stardog.rb](https://github.com/antoniogarrote/stardog-rb).

### Acknowledgments

Thanks to all Stardog users, contributors, testers, etc., especially Robert Butler, Al Baker, Marko A. Rodriguez, Brian Sletten, Alin Dreghiciu, Rob Vesse, Stephane
Fallah, John "New Model Army" Goodwin, José Devezas, Chris
Halaschek-Wiener, Gavin Carothers, Brian Panulla, Ryan Kohl, Morton
Swimmer, Quentin Reul, Paul Dlug, James Leigh, Alex Tucker, Ron
Zettlemoyer, Jim Rhyne, Andrea Westerinen, Huy Phan, Zach Whitley.

## Using Stardog 

Stardog basics include SPARQL query, search, reading, writing, etc.

### [Quick Start Guide](/quick-start/)

Covers basic installation and starting a Stardog Server in five easy steps.

### [Query, Search, Add, Remove](/using/)
2.  [Querying a Database](/using/#query)
3.  [Adding and Removing](/using/#add-remove)
4.  [Exporting a Database](/using/#export)
5.  [Searching](/using/#search)

### [Stardog Console](/console/)
1. Accessing Stardog Console
1. Managing Stardog with the Console
1. SPARQL Query
1. Data Management
1. HTTP Services

## Administering Stardog

Administering Stardog Server, databases, including configuration and deployment information.

### [Administration](/admin/)
1.  [CLI Overview](/admin/#cli)
2.  [Administering a Stardog Server](/admin/#admin-server)
3.  [Administering a Stardog Database](/admin/#admin-db)
4.  [Configuring Security](/admin/#security)
5.  [Managing Search Indexes](/admin/#search)
6.  [Optimizing Bulk Data Loading](/admin/#optimizing-bulk-load)
7.  [Resource Requirements for Stardog](/admin/#resource-requirements)
8.  [Using Stardog on Windows](/admin/#using-windows)

#### [Security](/security)

1.  [The User & Security Model](/security/#model)
2.  [Command-line Interface](/security/#cli)
3.  [Programmatic Access](/security/#api)
4.  [Deploying Stardog Securely](/security/#deployment)

## Programming Stardog

Everything from reasoning, data validation, and SPARQL to programming Stardog with Java, JavaScript, and many other languages. Includes the documentation for Stardog Web.

### [Integrity Constraint Validation](/icv)
1.  [Background & Terminology](/sdp/#intro)
2.  [Validating RDF with Closed World Integrity Constraints](/sdp/#validation)

### [OWL 2 Reasoning](/owl2)
1.  [Using Stardog's Reasoning Capabilities](/owl2/#reasoning)
2.  [Not Getting Expected Answers?](/owl2/#trouble)
3.  [Known Issues](/owl2/#issues)
4.  [Guidelines](/owl2/#guidelines)
5.  [Technical Background](/owl2/#query)

### [Building Stardog Web Apps](/web/)

1. Blah
1. Blah
1. Blah

### [Programming with Java](/java/)

1.  [Introduction](/java/#intro)
2.  [Creating and Administering Databases](/java/#admin)
3.  [Creating a Connection String](/java/#connection)
4.  [Security in Stardog](/java/#security)
5.  [Using SNARL](/java/#snarl)
6.  [Using Sesame](/java/#sesame)
7.  [Using Jena](/java/#jena)
8.  [Client-Server Stardog](/java/#client-server)
9.  [Embedded Stardog](/java/#embed)
10. [Connection Pooling](/java/#pool)
11. [Deprecation & Backward Compatibility](/java/#deprecation)

### [HTTP Programming](/http/)

1.  [SPARQL Protocol: HTTP](/network/#http)
2.  [Extended HTTP Protocol](/network/#extended-http)
3.  [SNARL: The Native Stardog Remote API](/network/#snarl)

### [Programming with Spring](/spring)

1.  [Introduction](/spring/#intro)
2.  [Building Spring for Stardog](/spring/#building)
3.  [Overview](/spring/#overview)
4.  [Basic Spring](/spring/#basic)
5.  [Spring Batch](/spring/#batch)
6.  [Examples](/spring/#examples)

### [Programming with Groovy](/groovy/)

1.  [Introduction](/groovy/#intro)
2.  [Building Groovy for Stardog](/groovy/#building)
3.  [Overview](/groovy/#overview)
4.  [Examples](/groovy/#examples)

### [Programming with Javascript](http://clarkparsia.github.io/stardog.js/)

The documentation for [stardog.js](http://clarkparsia.github.io/stardog.js), which is available on [Github](https://github.com/clarkparsia/stardog.js) and [npm]().

## Understanding Stardog

Background information on tuning, known issues, compatibility policies, etc.

### [Stardog Performance: Benchmarks, Tuning, Tips](/performance)
1. RDF Loading
1. Something
1. Something Else

### [Frequently Asked Questions](/faq)
Questions that people have asked for which we have answers.

### [Terminology](/terms/)
A glossary of technical terms used in these docs.

### [Stardog Compatibility Policies](/compatibility/)
A statement of the policies we will pursue in evolving Stardog beyond
the 1.0 release.

### [Known Issues](/known-issues)
Everything we know about that sucks.

## The Man Pages

### `stardog` CLI

1. ` data add, data export, data remove, data size.`
1. ` icv convert, icv validate.`
1. ` namespace add, namespace list, namespace remove.`
1. ` query execute, query explain, query search.`
1. ` reasoning consistency, reasoning explain.`

### `stardog-admin` CLI

1. `db copy`, `db create`, `db drop`, `db list`, `db migrate`, `db offline`, `db online`, `db optimize`, `db status`
1.`icv add`, `icv drop`, `icv remove`
1. `metadata get`, `metadata set`
1. `query kill`, `query list`, `query status`
1. `role add`, `role grant`, `role list`, `role permission`, `role remove`, `role revoke`
1. `server start`, `server stop`
1. `user add`, `user disable`, `user enable`, `user addrole`, `user removerole`, `user grant`, `user list`, `user passwd`, `user permission`, `user remove`, `user revoke`

