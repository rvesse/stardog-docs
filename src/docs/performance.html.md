---
quote: In computing, the mean time to failure keeps getting shorter.
title: Performance
layout: default
toc: true
shortTitle: "Perf"
summary: In this chapter we'll detail some basic performance numbers for Stardog, both load speed and query speed. As is always the case, the most important performance numbers are the ones you run on <strong>your</strong> data.
---

## Loading RDF

When Stardog creates a database, you can provide RDF to be bulk loaded
into the database. This is the optimal way to insert large amounts of
data into Stardog. We provide some [basic
guidelines](../admin/#resource-requirements) for the resources required
to bulk load large amounts of data.

## SP2B Results

The [SP2B](http://dbis.informatik.uni-freiburg.de/index.php?project=SP2B)
benchmark builds on DBLP attempting to create real-world queries which
utilize many different aspects of SPARQL query performance. It's an
excellent torture test for a SPARQL engine as [evidenced in their
initial results](http://arxiv.org/pdf/0806.4627v2.pdf). Stardog performs
quite well on SP2B which we believe is indicative of our focus on query
performance, particularly for difficult, analytic type SPARQL queries.

For reference, our earlier SP2B numbers can be seen
[here](http://weblog.clarkparsia.com/2011/05/31/stardog-performance-sp2b-benchmark/).


## BSBM Results

The [BSBM SPARQL benchmark](http://www4.wiwiss.fu-berlin.de/bizer/berlinsparqlbenchmark/)
uses generated data based on an e-commerce use case; the data set is
comprised of a set of products and vendor & consumer information, such
as reviews, about the products. BSBM uses a set of queries called a
query mix based around a search and navigation pattern of a consumer
looking for a product.


Our BSBM numbers reflect the full query mix using the same seed to
generate the data sets as provided in the last published BSBM results.
The numbers in the table represent the query mixes per hour (QMpH) as
reported by the BSBM test driver. 25 Warmups were executed followed by
100 runs, this was repeated 5 times and the average QMpH was taken for
each. 300 runs were used for 128 & 255 concurrent clients to ensure that
each thread was utilized at least once for a run.


Hardware used in tests as follows:
