---
quote: In computing, the mean time to failure keeps getting shorter.
title: Performance
layout: default
toc: true
shortTitle: "Perf"
summary: In this chapter, we'll detail some basic performance numbers for Stardog, both load speed and query speed. As is always the case, the most important performance numbers are the ones you run on <strong>your</strong> data.
---

## Performance Tuning, Tips, Tricks

See the following:

1. basic approach: Stardog is read-biased; we will trade some slowdowns in writes for proportional (or greater, ideally) speedups in reads
1. capacity planning
1. bulk data loading guidelines
1. FAQ
1. if you can do without quads, do w/out them
1. use the tightest reasoning level appropriate to yr use cases

## Loading RDF 

When Stardog creates a database, you can provide RDF to be bulk loaded
into the database. This is the optimal way to insert large amounts of
data into Stardog. We provide some [basic
guidelines](../admin/#resource-requirements) for the resources required
to bulk load large amounts of data.

Server1: 2 x Six-core AMD Opteron 2439SE @ 2.8 GHz 32 GB RAM, RAID 0
(striping) array of 4 x 750GB hard drives at 7200 rpm. EC2 is a
[High-Memory Quad XL
instance](http://aws.amazon.com/ec2/instance-types/).

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



All SP2B numbers were collected on an iMac running OSX 10.6.8 2.8Ghz
Intel i7. The default Stardog configuration was used, except the process
was given 8G of RAM. Each query was run 5 times for a warmup and the
average was then collected over 25 additional executions of the query.
Execution times include parsing, planning, and optimization, but do not
include any result serialization; the embedded Stardog server was used
so the results were not serialized over the wire. Query times are in
**milliseconds**, so our result for Q4 @ 5M is 64,435.25 **ms**, or just
over 1 minute.

Query 5a did not produce results within the 1 hr timeout (T) specified
in the original study, nor did query 4 at 25M.

## BSBM Results 

The [BSBM SPARQL benchmark](http://www4.wiwiss.fu-berlin.de/bizer/berlinsparqlbenchmark/)
uses generated data based on an e-commerce use case; the data set is
comprised of a set of products and vendor & consumer information, such
as reviews, about the products. BSBM uses a set of queries called a
query mix based around a search and navigation pattern of a consumer
looking for a product.

The last results published by the BSBM authors are
[available](http://www4.wiwiss.fu-berlin.de/bizer/BerlinSPARQLBenchmark/results/V6/).
Other database vendors have published their own numbers independently
since the last study and are available online.

Our BSBM numbers reflect the full query mix using the same seed to
generate the data sets as provided in the last published BSBM results.
The numbers in the table represent the query mixes per hour (QMpH) as
reported by the BSBM test driver. 25 Warmups were executed followed by
100 runs, this was repeated 5 times and the average QMpH was taken for
each. 300 runs were used for 128 & 255 concurrent clients to ensure that
each thread was utilized at least once for a run.


Hardware used in tests as follows:

-   Dev1 is an iMac running OSX 10.6.8 2.8Ghz Intel i7, 16G RAM
-   Dev2 is a Linux box CPU: i7-3930K @ 3.2 GHz six cores,
    hyperthreading, 32 GB RAM, SSD SATA 3 HD
-   Server is a Linux box: 2 x Intel Xeon X5650 @ 2.67 Ghz. each CPU is
    6 cores with hyperthreading, 48 GB RAM.
-   EC2 is a [High-Memory Double XL
    instance](http://aws.amazon.com/ec2/instance-types/).

Tests were run with 4G of RAM allocated to the JVM unless noted
otherwise. 128 & 255 client tests were not run on Dev1 because of issues
with the ulimit & the max number of open sockets.
