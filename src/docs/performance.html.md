[![](/_/img/sdog-bare.png)](/)

> **In computing, the mean time to failure keeps getting shorter.**—Alan
> Perlis, Epigrams in Programming

Stardog Perf {#title}
============

In this chapter, we'll detail some basic performance numbers for
Stardog, both load speed and query speed.As is always the case, the most
important performance numbers are the ones you run on *your* data.

Loading RDF {#chapter}
===========

When Stardog creates a database, you can provide RDF to be bulk loaded
into the database. This is the optimal way to insert large amounts of
data into Stardog. We provide some [basic
guidelines](../admin/#resource-requirements) for the resources required
to bulk load large amounts of data.

Dataset

\# triples

\# files

Index Strategy

Load Time (h:mm:ss)

Load kTPS(Kilo Triples/Second)

Machine

BSBM 100M

100.0M

1

QUADS

0:24:57

66.8

Server1

BSBM 100M

100.0M

10

QUADS

0:20:13

82.4

Server1

BSBM 1B

997.9M

1

QUADS

5:12:41

53.2

Server1

SP2B 100M

100.0M

1

QUADS

0:21:27

77.7

Server1

SP2B 250M

250.0M

1

QUADS

1:00:51

68.5

Server1

LUBM 1k

138.3M

1

QUADS

0:21:23

107.7

Server1

LUBM 10k

1243.7M

10

TRIPLES

1:33:45

221.9

EC2

LUBM 10k

1243.7M

10

QUADS

2:13:27

155.3

EC2

LUBM 30k

4144.7M

30

QUADS

17:19:01

66.5

EC2

LUBM 60k

8290.3M

60

TRIPLES

125:09:26

18.4

EC2

Stardog Bulk Load performance

Server1: 2 x Six-core AMD Opteron 2439SE @ 2.8 GHz 32 GB RAM, RAID 0
(striping) array of 4 x 750GB hard drives at 7200 rpm. EC2 is a
[High-Memory Quad XL
instance](http://aws.amazon.com/ec2/instance-types/).

SP2B {#chapter}
====

The
[SP2B](http://dbis.informatik.uni-freiburg.de/index.php?project=SP2B)
benchmark builds on DBLP attempting to create real-world queries which
utilize many different aspects of SPARQL query performance. It's an
excellent torture test for a SPARQL engine as [evidenced in their
initial results](http://arxiv.org/pdf/0806.4627v2.pdf). Stardog performs
quite well on SP2B which we believe is indicative of our focus on query
performance, particularly for difficult, analytic type SPARQL queries.

For reference, our earlier SP2B numbers can be seen
[here](http://weblog.clarkparsia.com/2011/05/31/stardog-performance-sp2b-benchmark/).

Q1

Q2

Q3a

Q3b

Q3c

Q4

Q5a

Q5b

Q6

Q7

Q8

Q9

Q10

Q11

Q12a

Q12b

Q12c

\# results

1

248,738

192,373

1,317

0

18,362,955

210,662

210,662

417,625

1,200

493

4

656

10

1

1

0

Avg Time (ms)

0.45

2,167.95

466.2

2.9

4.95

64,435.25

T

1,471.8

3,680.55

753.35

421.3

1359.8

0.85

612.4

733.1

369.1

0

Stardog SP2B 5M

\

Q1

Q2

Q3a

Q3b

Q3c

Q4

Q5a

Q5b

Q6

Q7

Q8

Q9

Q10

Q11

Q12a

Q12b

Q12c

\# results

1

1,876,999

594,890

4,075

0

-

696,681

696,681

1,945,167

5,099

493

4

656

10

1

1

1

Avg Time (ms)

0.45

12,914.35

795.55

11.0

15.2

T

T

7,074.25

30,765.2

8,003.95

442

6,784.05

0.95

2,950.7

7,100

395.25

0.2

Stardog SP2B 25M

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

BSBM {#chapter}
====

The [BSBM SPARQL
benchmark](http://www4.wiwiss.fu-berlin.de/bizer/berlinsparqlbenchmark/)
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

Dev1

Dev2

Server

Server w/ 16G

EC2

Single Client

23,811.83

13,456.60

22,698.14

25,653.92

19,691.46

MT 4

63,116.72

82,832.94

85,460.98

97,441.88

60,853.48

MT 8

83,348.36

123,346.19

153,345.42

181,567.47

67,336.72

MT 16

84,232.34

145,474.24

215,479.83

256,089.42

68,837.71

MT 64

83,277.24

140,989.11

232,004.95

258,293.93

67,873.73

MT 128

143,205.89

241,373.41

277,605.49

70,334.39

MT 255

134,528.47

240,240.40

273,721.59

70,037.50

Stardog BSBM 10M results

\

Dev1

Dev2

Server

Server w/ 16G

EC2

Single Client

10,553.84

10,017.67

9,200.93

9,808.69

8,254.39

MT 4

28,424.51

39,428.96

35,277.63

38,171.86

28,793.58

MT 8

39,952.62

57,891.07

65,224.94

71,211.84

30,019.72

MT 16

38,108.93

66,790.67

95,653.91

106,146.16

29,551.78

MT 64

37,591.20

62,485.25

102,286.73

118,012.20

28,102.12

MT 128

60,509.47

95,366.01

124,466.95

26,841.89

MT 255

58,028.40

90,812.58

124,123.85

25,271.50

Stardog BSBM 100M results

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

Notes {.fn}
=====

[⌂](# "Back to top")

For comments, questions, or to report problems with this page, please
email the [Stardog Support
Forum](https://groups.google.com/a/clarkparsia.com/group/stardog/about).


