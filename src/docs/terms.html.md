---
quote: It's difficult to extract sense from strings, but they're the only communication coin we can count on.
layout: default
title: Terminology
shortTitle: Terms
toc: true
---

In the Stardog documentation, the following terms have a specific
technical meaning.

**Stardog Database Management System, aka Stardog Server, aka Stardog**: An instance of Stardog; only one Stardog Server may run per JVM. A computer may run multiple Stardog Servers by running one per multiple JVMs.

** Stardog Home, aka `STARDOG_HOME`**: A directory in a filesystem in which Stardog stores files and other information; established either in a Stardog configuration file or
by environment variable. Only one Stardog Server may run
simultaneously from a `STARDOG_HOME`.

**Stardog Network Home**:   A URL (HTTP or SNARL) which identifies a Stardog Server running on the network.

**Database**: A Stardog database is a graph of RDF data under management of a
Stardog Server. It may contain zero or more RDF Named Graphs. A
Stardog Server may manage more than one Database; there is no hard
limit, and the practical limit is disk space.

**Database Short Name, aka Database Name**:   An identifier used to name a database, provided as input when a database is created.

**Database Network Name**: A Database Short Name is part of the URI of a Database addressed over some network protocol.

**Index**:   The unit of persistence for a Database. We sometimes (sloppily) use
Database and Index interchangeably in the Stardog docs.

**Memory Database**: A Database may be stored in-memory or on disk; a Memory Database is
read entirely into system memory but can be (optionally) persisted to disk.

**Disk Database**:  A Disk Database is only paged into system memory as needed and is
persisted using one or more indexes.

**Connection String**: An identifier (a restricted subset of legal URLs, actually) that is used to connect to a Stardog database to send queries or perform other operations.

**Named Graph**:   A Named Graph is an explicitly named unit of data within a Database.
Named Graphs are queries explicitly by specifying them in SPARQL
queries. There is no practical limit on the number of Named Graphs
in a Database.

**Default Graph**:   The Default Graph in a Database is the context into which RDF
triples are stored when a Named Graph is not explicitly specified. A
SPARQL query executed by Stardog that does not contain any Named
Graph statements is executed against the data in the Default Graph
only.

**Security Realm**:   A Security Realm defines the users and their permissions for each
Database in an Stardog Server. There is only one Security Realm per
Stardog Server.

