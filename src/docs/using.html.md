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

## Querying

Stardog currently supports all of the [SPARQL 1.1 Query
language](http://www.w3.org/TR/sparql11-query/). <fn>Stardog does not support SPARQL 1.1 federation (the
`SERVICE` keyword).</fn> Stardog also supports the [OWL 2 Direct Semantics
entailment regime](http://www.w3.org/TR/2012/CR-sparql11-entailment-20121108/).

To execute a SPARQL query against a Stardog database, use the `query`
subcommand:

```bash
$ stardog query myDb "select * where { ?s ?p ?o }"
```

<!-- show a few more examples? -->

Detailed information on using the query command in Stardog can be found
on its [`man` page](/docs/man/query-execute.html).

## Updating

There are many ways to update the data in a Stardog database; the most commonly used methods are the CLI and SPARQL Update queries, both of which we discuss below.

### SPARQL Update <t>new2</t>

SPARQL 1.1 Update can be used to insert RDF into or delete RDF from a Stardog database using SPARQL query forms `INSERT` and `DELETE`, respectively.

```sparql
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX ns: <http://example.org/ns#>
INSERT DATA
{ GRAPH <http://example/bookStore> { <http://example/book1>  ns:price  42 } }
```

An example of deleting RDF:

```sparql
PREFIX dc: <http://purl.org/dc/elements/1.1/>

DELETE DATA
{
  <http://example/book2> dc:title "David Copperfield" ;
                         dc:creator "Edmund Wells" .
}
```

Or they can be combined with `WHERE` clauses:

```sparql
PREFIX foaf:  <http://xmlns.com/foaf/0.1/>

WITH <http://example/addresses>
DELETE { ?person foaf:givenName 'Bill' }
INSERT { ?person foaf:givenName 'William' }
WHERE
  { ?person foaf:givenName 'Bill' } 
```

### Adding Data with the CLI

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

### Removing Data with the CLI

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

## Exporting

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


## Obfuscating

When sharing sensitive RDF data with others, you might want to (selectively) obfuscate it so that sensitive bits are not present, but non-sensitive bits remain. For example, this feature can be used to submit Stardog bug reports using sensitive data.

Data obfuscation works much the same way as the `export` command and supports the same set of arguments:

```bash
$ stardog data obfuscate myDatabase obfDatabase.ttl
```

By default, all URIs, bnodes, and string literals in the database will be obfuscated using the SHA256 message digest algorithm. Non-string typed literals (numbers, dates, etc.) are left unchanged as well as URIs from built-in namespaces RDF, RDFS, and OWL. It is possible to customize obfuscation by providing a configuration file. 

```bash
$ stardog data obfuscate --config obfConfig.ttl myDatabase  obfDatabase.ttl
```

The configuration specifies which URIs and strings will be obfuscated by defining inclusion and exclusion filters. See the example configuration file provided in the distribution for details.

Once the data is obfuscated, queries written against the original data will no longer work. Stradog provides query obfuscation capability, too, so that queries can be executed against the obfuscated data. If a custom configuration file is used to obfuscate the data, then the same configuration should be used for obfuscating the queries as well:

```bash
$ stardog query obfuscate --config obfConfig.ttl myDatabase myQuery.sparql > obfQuery.ttl
```

## Functions

Stardog supports all the functions in SPARQL language plus some additional function from XPATH  and SWRL. These functions can be used in queries or rules. Some functions appear in multiple namespaces and all the namespaces are recognized.

Functions from the following namespaces are recognized:
<html>
	<head><meta content="text/html;charset=UTF-8"/></head>
	<body>
		<table border=1>
			<tr>
				<th>Prefix</th>
				<th>Namespace</th>
			</tr>
			<tr>
				<td>stardog</td>
				<td>stardog</td>
			</tr>
			<tr>
				<td>fn</td>
				<td>fn</td>
			</tr>
			<tr>
				<td>math</td>
				<td>math</td>
			</tr>
			<tr>
				<td>swrlb</td>
				<td>swrlb</td>
			</tr>
			<tr>
				<td>afn</td>
				<td>afn</td>
			</tr>
		</table>
	</body>
</html>

The list of function URIs recognized by Stardog are shown in the following table. Note that, some of these functions exist in SPARQL specification which means they can be used without an explicit namespace.
<html>
	<head><meta content="text/html;charset=UTF-8"/></head>
	<body>
		<table border=1>
			<tr>
				<th>Function name</th>
				<th>Recognized URIs</th>
			</tr>
			<tr>
				<td>concat</td>
				<td><a href="http://www.w3.org/2005/xpath-functions#concat">fn:concat</a>, <a href="http://www.w3.org/2003/11/swrlb#stringConcat">swrlb:stringConcat</a></td>
			</tr>
			<tr>
				<td>contains</td>
				<td><a href="http://www.w3.org/2005/xpath-functions#contains">fn:contains</a>, <a href="http://www.w3.org/2003/11/swrlb#contains">swrlb:contains</a></td>
			</tr>
			<tr>
				<td>containsIgnoreCase</td>
				<td><a href="http://www.w3.org/2003/11/swrlb#containsIgnoreCase">swrlb:containsIgnoreCase</a></td>
			</tr>
			<tr>
				<td>date</td>
				<td><a href="http://www.w3.org/2003/11/swrlb#date">swrlb:date</a></td>
			</tr>
			<tr>
				<td>dateTime</td>
				<td><a href="http://www.w3.org/2003/11/swrlb#dateTime">swrlb:dateTime</a></td>
			</tr>
			<tr>
				<td>day</td>
				<td><a href="http://www.w3.org/2005/xpath-functions#day-from-dateTime">fn:day-from-dateTime</a></td>
			</tr>
			<tr>
				<td>dayTimeDuration</td>
				<td><a href="http://www.w3.org/2003/11/swrlb#dayTimeDuration">swrlb:dayTimeDuration</a></td>
			</tr>
			<tr>
				<td>encode_for_uri</td>
				<td><a href="http://www.w3.org/2005/xpath-functions#encode-for-uri">fn:encode-for-uri</a></td>
			</tr>
			<tr>
				<td>exp</td>
				<td><a href="http://www.w3.org/2005/xpath-functions/math#exp">math:exp</a>, <a href="http://jena.hpl.hp.com/ARQ/function#e">afn:e</a></td>
			</tr>
			<tr>
				<td>hours</td>
				<td><a href="http://www.w3.org/2005/xpath-functions#hours-from-dateTime">fn:hours-from-dateTime</a></td>
			</tr>
			<tr>
				<td>lcase</td>
				<td><a href="http://www.w3.org/2005/xpath-functions#lower-case">fn:lower-case</a>, <a href="http://www.w3.org/2003/11/swrlb#lowerCase">swrlb:lowerCase</a></td>
			</tr>
			<tr>
				<td>max</td>
				<td><a href="http://www.w3.org/2005/xpath-functions#max">fn:max</a>, <a href="http://jena.hpl.hp.com/ARQ/function#max">afn:max</a></td>
			</tr>
			<tr>
				<td>min</td>
				<td><a href="http://www.w3.org/2005/xpath-functions#min">fn:min</a>, <a href="http://jena.hpl.hp.com/ARQ/function#min">afn:min</a></td>
			</tr>
			<tr>
				<td>minutes</td>
				<td><a href="http://www.w3.org/2005/xpath-functions#minutes-from-dateTime">fn:minutes-from-dateTime</a></td>
			</tr>
			<tr>
				<td>month</td>
				<td><a href="http://www.w3.org/2005/xpath-functions#month-from-dateTime">fn:month-from-dateTime</a></td>
			</tr>
			<tr>
				<td>normalizeSpace</td>
				<td><a href="http://www.w3.org/2005/xpath-functions#normalize-space">fn:normalize-space</a>, <a href="http://www.w3.org/2003/11/swrlb#normalizeSpace">swrlb:normalizeSpace</a></td>
			</tr>
			<tr>
				<td>pi</td>
				<td><a href="http://www.w3.org/2005/xpath-functions/math#pi">math:pi</a>, <a href="http://jena.hpl.hp.com/ARQ/function#pi">afn:pi</a></td>
			</tr>
			<tr>
				<td>replace</td>
				<td><a href="http://www.w3.org/2005/xpath-functions#replace">fn:replace</a></td>
			</tr>
			<tr>
				<td>seconds</td>
				<td><a href="http://www.w3.org/2005/xpath-functions#seconds-from-dateTime">fn:seconds-from-dateTime</a></td>
			</tr>
			<tr>
				<td>sqrt</td>
				<td><a href="http://www.w3.org/2005/xpath-functions/math#sqrt">math:sqrt</a>, <a href="http://jena.hpl.hp.com/ARQ/function#sqrt">afn:sqrt</a></td>
			</tr>
			<tr>
				<td>strafter</td>
				<td><a href="http://www.w3.org/2005/xpath-functions#substring-after">fn:substring-after</a>, <a href="http://www.w3.org/2003/11/swrlb#substringAfter">swrlb:substringAfter</a></td>
			</tr>
			<tr>
				<td>strbefore</td>
				<td><a href="http://www.w3.org/2005/xpath-functions#substring-before">fn:substring-before</a>, <a href="http://www.w3.org/2003/11/swrlb#substringBefore">swrlb:substringBefore</a></td>
			</tr>
			<tr>
				<td>strends</td>
				<td><a href="http://www.w3.org/2005/xpath-functions#ends-with">fn:ends-with</a>, <a href="http://www.w3.org/2003/11/swrlb#endsWith">swrlb:endsWith</a></td>
			</tr>
			<tr>
				<td>stringEqualIgnoreCase</td>
				<td><a href="http://www.w3.org/2003/11/swrlb#stringEqualIgnoreCase">swrlb:stringEqualIgnoreCase</a></td>
			</tr>
			<tr>
				<td>strlen</td>
				<td><a href="http://www.w3.org/2005/xpath-functions#string-length">fn:string-length</a>, <a href="http://www.w3.org/2003/11/swrlb#stringLength">swrlb:stringLength</a></td>
			</tr>
			<tr>
				<td>strstarts</td>
				<td><a href="http://www.w3.org/2005/xpath-functions#starts-with">fn:starts-with</a>, <a href="http://www.w3.org/2003/11/swrlb#startsWith">swrlb:startsWith</a></td>
			</tr>
			<tr>
				<td>substring</td>
				<td><a href="http://www.w3.org/2005/xpath-functions#substring">fn:substring</a>, <a href="http://www.w3.org/2003/11/swrlb#substring">swrlb:substring</a></td>
			</tr>
			<tr>
				<td>time</td>
				<td><a href="http://www.w3.org/2003/11/swrlb#time">swrlb:time</a></td>
			</tr>
			<tr>
				<td>timezone</td>
				<td><a href="http://www.w3.org/2005/xpath-functions#timezone-from-dateTime">fn:timezone-from-dateTime</a></td>
			</tr>
			<tr>
				<td>translate</td>
				<td><a href="http://www.w3.org/2005/xpath-functions#translate">fn:translate</a>, <a href="http://www.w3.org/2003/11/swrlb#translate">swrlb:translate</a></td>
			</tr>
			<tr>
				<td>ucase</td>
				<td><a href="http://www.w3.org/2005/xpath-functions#upper-case">fn:upper-case</a>, <a href="http://www.w3.org/2003/11/swrlb#upperCase">swrlb:upperCase</a></td>
			</tr>
			<tr>
				<td>year</td>
				<td><a href="http://www.w3.org/2005/xpath-functions#year-from-dateTime">fn:year-from-dateTime</a></td>
			</tr>
			<tr>
				<td>yearMonthDuration</td>
				<td><a href="http://www.w3.org/2003/11/swrlb#yearMonthDuration">swrlb:yearMonthDuration</a></td>
			</tr>
		</table>
	</body>
</html>
