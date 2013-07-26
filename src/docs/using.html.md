---
quote: "The string is a stark data structure and everywhere it is passed there is much duplication of process. It is a perfect vehicle for hiding information."
title: "Using Stardog"
layout: default
related: ""
toc: true
---

While Stardog is a full-featured RDF database, its primary purpose is to
execute queries against RDF data which it has under direct
management.<fn>This implies that Stardog will not retrieve data from the Web
or from any other network via HTTP URLs in order to query that data. If
you want to query data using Stardog, you must add that data to a new or
existing Stardog database. A future version of Stardog will
support [SDQ](http://weblog.clarkparsia.com/2011/03/07/sdq-information-integration-i%0An-the-real-world/), a distributed query system, that will lift this restriction.</fn> Stardog supports the [SPARQL](http://www.cambridgesemantics.com/2008/09/sparql-by-example) query language, a W3C standard.

## Querying a Database

Stardog currently supports all of the [SPARQL 1.1 Query
language](http://www.w3.org/TR/sparql11-query/). Support is planned for
[SPARQL 1.1 Update](http://www.w3.org/TR/2012/PR-sparql11-update-20121108) in a
future release. Stardog does not support SPARQL 1.1 federation (the
`SERVICE` keyword). Stardog also supports the [OWL 2 Direct Semantics
entailment regime](http://www.w3.org/TR/2012/CR-sparql11-entailment-20121108/).

To execute a SPARQL query against a Stardog database, use the `query`
subcommand:

```bash
$ stardog query myDb "select * where { ?s ?p ?o }"
```

Detailed information on using the query command in Stardog can be found
on its [manpage](/docs/man/query-execute.html)

## Adding & Removing Data

The most efficient way to load data into Stardog is at database creation
time. See the [Creating a Database](../admin/#create) section for bulk
loading data at database creation time. To add data to an existing
Stardog database, use the [add](/docs/man/data-add.html) command:

```bash
$ stardog data add myDatabase 1.rdf 2.rdf 3.rdf
```

The optional arguments are `-f` (or `--format`) to specify the RDF
serialization type of the files to be loaded; if you specify the wrong
type, `add` will fail. If you don't specify a type, Stardog will try to
determine the type on its own based on the file extension. For example,
the files that have names ending with '.ttl' will be parsed with Turtle
syntax. If you specify a type, then all the files being loaded must of
that same type.

If you want to add data to a named graph, specify it via the
`--graph-uri` or `-g` options.

To remove data from a Stardog database,
[remove](/docs/man/data-remove.html) is used by specifying—

1.  one Named Graph, OR
2.  one or more files containing RDF (in some recognized serialization
    format, i.e., RDF/XML, Turtle, Trig), OR
3.  one Named Graph and one or more RDF files.

For example,

```bash
$ stardog data remove -g http://foo myDatabase
```

will remove the named graph `http://foo` and all its triples from
`myDatabase`.

```bash
$ stardog data remove myDatabase 1.rdf
```

will remove the triples in `1.rdf` from (the default graph of)
`myDatabase`.

```bash
$ stardog data remove -g http://foo -f TURTLE myDatabase 2.rdf 3.rdf
```

will remove the triples in the Turtle files `2.rdf` and `3.rdf` from the
named graph `http://foo` of `myDatabase`.

Strict or loose parsing may be set for the input payload by using
`--strict-parsing=TRUE|FALSE`.

### How Stardog Handles RDF Parsing

RDF parsing in Stardog is strict: it requires typed RDF literals to
match their explicit datatypes, URIs to be well-formed, etc. In some
cases, strict parsing isn't ideal, so it may be disabled using the
`--strict-parsing=FALSE` to disable it.

However, even with strict parsing disabled, Stardog's RDF parser may
encounter parse errors from which it cannot recover. And loading data in
lax mode may lead to unexpected SPARQL query results. For example,
malformed literals (`"2.5"^^xsd:int`) used in filter evaluation may lead
to undesired results.

## Exporting a Database

To export data from a Stardog database back to RDF,
[export](/docs/man/data-export.html) is used by specifying—

1.  the connection string of the database to export
2.  the export format: `N-TRIPLES, RDFXML, TURTLE, TRIG`. default is
    'N-TRIPLES'— 'TRIG' must be used when exporting the entire database
    if the database contains triples inside named graphs.
3.  optionally, the URI of the named graph to export if you wish to
    export a single named graph only.
4.  the file to export to

For example,

```bash
$ stardog data export --format TURTLE myDatabase myDatabase_output.ttl

$ stardog data export --graph-uri http://example.org/context myDatabase myDatabase_output.nt
```

## Searching 
Stardog includes an RDF-aware semantic search capability: it will index
RDF literals and supports information retrieval-style queries over
indexed data.

### Indexing Strategy

The indexing strategy creates a "search document" per RDF literal. Each
document consists of the following fields: literal ID; literal value;
and contexts.

### Search in SPARQL

We use the predicate `http://jena.hpl.hp.com/ARQ/property#textMatch` to
access the search index in a SPARQL query.

For example,

```bash
SELECT DISTINCT ?s ?score 
WHERE {
?s ?p ?l.
( ?l ?score ) <http://jena.hpl.hp.com/ARQ/property#textMatch> ( 'mac' 0.5 50 ). 
}
```
This query selects the top 50 literals, and their scores, which match
'mac' and whose scores are above a threshold of 0.5. These literals are
then joined with the generic BGP `?s ?p ?l` to get the resources (?s)
that have those literals. Alternatively, you could use
`?s rdf:type ex:Book` if you only wanted to select the books which
reference the search criteria; you can include as many other BGP's as
you like to enhance your initial search results.

### Searching with the Command Line

First, check out the CLI help for the
[search](/docs/man/query-search.html) subcommand:

```bash
$ stardog help query search
```

Okay, now let's do a search over the O'Reilly book catalog in RDF for
everything mentioning "html":

```bash
$ stardog query search -q "html" -l 10 catalog
```

The results?

```bash
Index    Score    Hit
====================
0    6.422    urn:x-domain:oreilly.com:product:9780596527402.IP
1    6.422    urn:x-domain:oreilly.com:product:9780596003166.IP
2    6.422    urn:x-domain:oreilly.com:product:9781565924949.IP
3    6.422    urn:x-domain:oreilly.com:product:9780596002251.IP
4    6.422    urn:x-domain:oreilly.com:product:9780596101978.IP
5    6.422    urn:x-domain:oreilly.com:product:9780596154066.IP
6    6.422    urn:x-domain:oreilly.com:product:9780596157616.IP
7    6.422    urn:x-domain:oreilly.com:product:9780596805876.IP
8    6.422    urn:x-domain:oreilly.com:product:9780596527273.IP
9    6.422    urn:x-domain:oreilly.com:product:9780596002961.IP
```

### Query Syntax

Stardog search is based on Lucene 4.2.0: we support all of the [search
modifiers](http://lucene.apache.org/java/3_4_0/queryparsersyntax.html)
that Lucene supports, with the exception of fields.

-   wildcards: `?` and `*`
-   fuzzy: `~` and `~` with similarity weights (e.g. `foo~0.8`)
-   proximities: `"semantic web"~5`
-   term boosting
-   booleans: `OR`, `AND`, `+`, `NOT`, and `-`.
-   grouping

For a more detailed discussion, see the [Lucene
docs](http://lucene.apache.org/java/3_3_0/queryparsersyntax.html).
