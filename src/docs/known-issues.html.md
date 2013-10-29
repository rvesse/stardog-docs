---
layout: default
title: Known Issues
quote: We kid ourselves if we think that the ratio of procedure to data in an active data-base system can be made arbitrarily small or even kept small.
---

The known issues in Stardog <t>version</t>--

1. Our `CONSTRUCT` slightly deviates from [SPARQL 1.1 specification](http://www.w3.org/TR/sparql11-query/#construct) in that it does not implicitly `DISTINCT` query results; rather, it implicitly applies `REDUCED` semantics to `CONSTRUCT` query results.<fn>Strictly speaking, this is a Sesame parser deviation from the SPARQL 1.1 spec with which we happen to agree.</fn>
1.  Asking for all individuals with reasoning via the query
    `{?s a owl:Thing}` might also retrieve some classes and properties.
    **WILLFIX**
2.  Schema queries do not bind graph variables.
3.  Dropping a database with the CLI deletes all of the data files
    in Stardog Home associated with that database. If you
    want to keep the data files and remove the database from the
    system catalog, then you need to manually copy these files to
    another location before deleting the database.
4.  If relative URIs exist in the data files passed to create, add, or
    remove commands, then they will be resolved using the constant base
    URI `http://api.stardog.com/` iff the format of the file allows base
    URIs. Turtle and RDF/XML formats allows base URIs but N-Triples
    format doesn't allow base URIs and relative URIs in N-Triples data
    will cause errors.
5.  Queries with `FROM NAMED` with a named graph that is *not* in
    Stardog will **not** cause Stardog to download the data from an arbitrary
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
