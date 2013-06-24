[![](/_/img/sdog-bare.png)](/)

> **The proof of a system's value is its existence.**—Alan Perlis,
> Epigrams in Programming

Stardog OWL 2 {#title}
=============

Introduction {#chapter}
============

In this chapter we describe [how to use Stardog's reasoning
capabilities](#reasoning); we also address some [common
problems](#trouble) and [known issues](#issues). We also describe
[Stardog's approach to query answering](#approach) in some detail, as
well as a set of [guidelines](#guidelines) that contribute to efficient
query answering. If you are not familiar with the terminology, you can
peruse the section on [terminology](#terminology).

Stardog reasoning is based on the [OWL 2 Direct Semantics Entailment
Regime](http://www.w3.org/TR/2010/WD-sparql11-entailment-20100126/#id45013).
Stardog performs reasoning in a very lazy and late-binding fashion: it
does not materialize inferences; but, rather, reasoning is performed at
query time according to a given reasoning level. This allows for maximum
flexibility while maintaining excellent performance and scalability.

Stardog supports several reasoning levels; the reasoning level
determines the kinds of inference rules or axioms that are to be
considered during query evaluation:

-   **NONE**. No axioms are considered.
-   **RDFS**. For the OWL 2 axioms allowed in [RDF
    schema](http://www.w3.org/TR/rdf-schema/) (mainly subclasses,
    subproperties, domain, and ranges).
-   **QL**. For [OWL 2 QL](http://www.w3.org/TR/owl2-profiles/#OWL_2_QL)
    axioms.
-   **RL**. For [OWL 2 RL](http://www.w3.org/TR/owl2-profiles/#OWL_2_RL)
    axioms.
-   **EL**. For [OWL 2 EL](http://www.w3.org/TR/owl2-profiles/#OWL_2_EL)
    axioms.
-   **DL**. For [OWL 2 DL](http://www.w3.org/TR/owl2-syntax/) axioms.

Stardog also supports [user-defined rule reasoning](#swrl) (using
[SWRL](http://www.w3.org/Submission/SWRL/) syntax and bultins).SWRL
rules are taken into account for reasoning for all reasoning levels
except **NONE**.

Using Reasoning {#chapter}
===============

In order to perform query evaluation with reasoning, Stardog requires a
schema (sometimes called a "TBox") to be present in the database. Since
schemas are serialized as RDF, they are loaded into a Stardog database
in the same way that any RDF is loaded into a Stardog database. Also,
note that, since it is just more RDF triples, the schema may change as
needed: it is neither fixed nor compiled in any special way.

The schema may reside in the default graph, in a specific named graph,
or in a collection of graphs. You can tell Stardog where the schema is
by setting the `reasoning.schema.graphs` property to one or more named
graph URIs. If we want the default graph to be considered part of the
schema, then we can use the special built-in URI
`tag:stardog:api:context:default`. If we want to use all named graphs
(that is, to tell Stardog to look for the schema in every named graph),
we can use `tag:stardog:api:context:all`. The default value for this
property is to use the default graph only.

Query Answering
---------------

All of Stardog's interfaces (API, network, and command-line as of
@@VERSION@@) support reasoning during query evaluation.

### Command Line

In order to evaluate queries in Stardog using reasoning via the command
line, a specific reasoning level must be specified in the [connection
string](../admin/):

    $ ./stardog query "myDB;reasoning=QL" "SELECT ?s { ?s a :C } LIMIT 10"

### HTTP

For HTTP, the reasoning level is specified with the other connection
parameters in the request header `SD-Connection-String`:

    $ curl -u admin:admin -X GET -H "SD-Connection-String: reasoning=QL" \
      "http://localhost:5822/myDB/query?query=..."

ReasoningConnection API
-----------------------

In order to use the ReasoningConnection API one needs to specify a
reasoning level. See the [Java Programming](../java/) chapter for
details on specifying the reasoning level programmatically.

Currently, the API has two methods:

-   isConsistent(), which can be used to check if the current KB is
    consistent with respect to the reasoning level.
-   isSatisfiable(URI theURIClass), which can be used to check if the
    given class if satisfiable with respect to the current KB and
    reasoning level.

Explaining Reasoning Results
----------------------------

Stardog can be used to check if the current KB logically entails a set
of triples; moreover, Stardog can explain why this is so. An explanation
of an inference is the minimum set of statements explicitly stored in
the database that together justify or warrant the inference.
Explanations are useful for debugging and understanding, especially when
large number of statements interact with each other to infer new
statements.

Explanations can be retrieved using the CLI command `explain inference`
by providing an input file that contains the inferences to be explained:

    $ stardog reasoning explain "myDB;reasoning=EL" inference_to_explain.ttl 

The output is displayed in a concise syntax designed to be legible; but
it can be rendered in any one of the supported RDF syntaxes if desired.
Explanations are also accessible through the [extended HTTP
protocol](../network/#extended-http) and SNARL API. See the examples
included in the distribution for more details about retrieving
explanations programmatically.

Note that there is probably more than one explanation for an inference,
but Stardog returns only a single explanation. We plan to compute
multiple explanations in a future version.

Not Getting Expected Answers? {#chapter}
=============================

Here's a few things that you might want to try:

-   **Do you know what to expect?** The [OWL 2
    primer](http://www.w3.org/TR/owl2-primer/) is always a good place to
    start.
-   **Is the schema where you think it is?** Stardog might be extracting
    the wrong schema. You have to tell Stardog where to find the schema.
    See [Schema Extraction](#tbox_extraction) for details.
-   **Are you using the right reasoning level?** Perhaps some of the
    modeling constructs (a.k.a. axioms) in your database are being
    ignored. You can find out which axioms are being ignored due to the
    reasoning level used by simply including the following line in the
    logging.properties file in `STARDOG_HOME`:

        com.clarkparsia.blackout.level = ALL

-   **Are you using DL?** Stardog supports schema-only reasoning for OWL
    2 DL, which effectively means that only TBox queries—queries that
    contain [TBox BGPs](#query_types) only—will return complete query
    results.

Known Issues {#chapter}
============

Stardog **@@VERSION@@** does not

-   Follow ontology `owl:imports` statements automatically; any imported
    OWL ontologies that are required for reasoning must be loaded into a
    Stardog database in the normal way.
-   Handle recursive queries. If recursion is necessary to answer the
    query with respect to the schema, results will be sound (no wrong
    answers) but potentially incomplete (some correct answers not
    returned) with respect to the requested reasoning type.
-   Perform equality reasoning. Only *explicit* `owl:sameAs` and
    `owl:differentFrom` data assertions will be taken into account for
    query answering.
-   Perform datatype reasoning and user-defined datatypes.

User-defined Rule Reasoning {#chapter}
===========================

Many reasoning problems may be solved with OWL's axiom-based approach;
but, of course, not all reasoning problems are amenable to this
approach. A user-defined rules approach complements the OWL axiom-based
approach nicely and increases the expressive power of a reasoning system
from the user's point of view. Many RDF databases support user-defined
rules only. Stardog is one of the only RDF databases that
comprehensively supports both axioms and rules.

Stardog supports user-defined rule reasoning together with a rich set of
built-in functions using the [SWRL](http://www.w3.org/Submission/SWRL/)
syntax and builtin-ins library. In order to apply SWRL user-defined
rules, you must include the rules as part of the database's schema: that
is, put your rules where your axioms are, i.e., in the schema. See
[Schema Extraction](#tbox_extraction) for more details. Once the rules
are part of the schema, they will be used for reasoning automatically,
*unless the reasoning level selected is* **NONE**.

Assertions implied by the rules *will not* be materialized. Instead,
rules are used to expand queries just as regular axioms (see [Stardog's
approach to query answering](#approach)).

Supported Built-Ins
-------------------

Stardog supports the following SWRL built-in functions:

-   [Built-ins for comparisons](http://www.w3.org/Submission/SWRL/#8.1).
-   [Math built-ins](http://www.w3.org/Submission/SWRL/#8.2).
-   [Built-ins for boolean
    values](http://www.w3.org/Submission/SWRL/#8.3).
-   [Built-ins for strings](http://www.w3.org/Submission/SWRL/#8.4),
    with the exception of `swrlb:tokenize`.
-   [Built-ins for date, time, and
    duration](http://www.w3.org/Submission/SWRL/#8.4).

SWRL Examples
-------------

User-defined rules in SWRL provide a different sort of "user interface"
with respect to OWL 2 reasoning in Stardog. Some problems (and some
people) are simply a better fit for a rules-based approach to modeling
and reasoning than to an axioms-based approach. What follows are a few
(trivial and contrived) examples of user-defined rules in SWRL (using
Datalog syntax; Stardog requires the canonical RDF serialization of
SWRL, however).

### Basic Rules

A person between 13 and 19 (inclusive) years of age is a teenager:

    :Teenager(?x) <- :Person(?x), swrlb:greaterThanOrEqual(?age, 13),
                     swrlb:lessThanOrEqual(?age, 19),
                     :hasAge(?x, ?age)

A person who's an uncle of a niece:

    :UncleOfNiece(?x) <- :Person(?x), :Male(?x), :hasSibling(?x, ?y), 
                      :isParentOf(?y, ?z), :Female(?z)

A person who's male and has a niece or nephew is an uncle of his
niece(s) and nephew(s):

    :isUncleOf(?x, ?z) <- :isSiblingOf(?x, ?y), :isParentOf(?y, ?z), :Male(?x)

A super user can read all of the things!

    :Role(?z), :hasRole(?x, ?z), :readPermission(?z, ?y) <- :SuperUser(?x)
                       :Resource(?y), http://www.w3.org/ns/sparql#UUID(?z)

Special Predicates {#chapter}
==================

Direct/Strict Subclasses and Subproperties, and Direct Types
------------------------------------------------------------

Besides the standard RDF(S) predicates `rdf:type`, `rdfs:subClassOf` and
`rdfs:subPropertyOf`, Stardog supports the following special built-in
predicates:

-   `sdle:directType`
-   `sdle:directSubClassOf`
-   `sdle:strictSubClassOf`
-   `sdle:directSubPropertyOf`
-   `sdle:strictSubPropertyOf`

Where the `sdle` prefix stands for `http://pellet.owldl.com/ns/sdle#`.

We define the meaning of these predicates by relating each of them to an
analogous triple pattern.The predicates `sdle:directSubPropertyOf` and
`sdle:strictSubPropertyOf` are defined analogously.

    :ind sdle:directType :c1 ->

    :ind rdf:type :c1 .
    FILTER NOT EXISTS {
      :ind rdf:type :c2 .
      :c2 sdle:strictSubClassOf :c1 .
    }

    :c1 sdle:strictSubClassOf :c2 ->

    :c1 rdfs:subClassOf :c2 .
    FILTER NOT EXISTS {
      :c1 owl:equivalentClass :c2 .
    }

    :c1 sdle:directSubClassOf :c2 ->

    :c1 sdle:strictSubClassOf :c2 .
    FILTER NOT EXISTS {
      :c1 sdle:strictSubClassOf :c3 .
      :c3 sdle:strictSubClassOf :c2 .
    }

These triple patterns can be used instead of the triple containing our
built-in predicate in SELECT, CONSTRUCT, or ASK queries.

New Individuals with SWRL
-------------------------

One cannot create new individuals (i.e., new instances of classes) using
SWRL. This restriction is well-motivated as it can lead to
non-termination issues. Stardog weakens this restriction in some crucial
aspects, subject to the following restrictions, conditions, and
warnings. **Note that this support is effectively a gun with which users
may shoot themselves in the foot if they do not use it carefully.**

We can create new individuals with a rule by using the (non-standard)
built-in predicate `http://www.w3.org/ns/sparql#UUID` as follows:

    :Parent(?y) <- :Person(?x), http://www.w3.org/ns/sparql#UUID(?y).

This rule will be used to create a *random* bnode for each instance of
the class `:Person` and also to assert that each new instance is also an
instance of `:Parent`.

### Remarks

The new individual built-in can **only be used in the body of rules and
it cannot be the only body atom**. The URIs for the generated bnodes are
meaningless in the sense that they should not be used in further
queries; that is to say, these bnodes are not guaranteed by Stardog to
be stable. Due to normalization, rules with more than one atom in the
head are broken up into several rules. Thus,

    :Male(?y), :Parent(?y) <- :Person(?x), http://www.w3.org/ns/sparql#UUID(?y).

will be normalized into:

    :Male(?y) <- :Person(?x), http://www.w3.org/ns/sparql#UUID(?y).

    :Parent(?y) <- :Person(?x), http://www.w3.org/ns/sparql#UUID(?y).

As a consequence, in this case, instead of stating that the new
individual is both an instance of `:Male` and `:Parent`, we would create
two *different* new individuals, and assert that one is male and the
other is a parent. If you need to assert various things about the new
individual, we recommend the use of extra rules. In the previous
example, we can introduce a new class (`:Father`) and add the following
rule to our schema:

    :Male(?x), :Parent(?x) <- :Father(?x).

And then modify the original rule accordingly:

    :Father(?y) <- :Person(?x), http://www.w3.org/ns/sparql#UUID(?y).

Query Rewriting {#chapter}
===============

Query answering with reasoning in Stardog is based on *query rewriting*:
Stardog rewrites the user's query with respect to the schema, and then
executes the resulting expanded query (EQ) against the data. As can be
seen in Figure 2, the rewriting process involves 5 different phases.

![](/docs/owl2/blackout.png)

Figure 1. Query Answering

![](/docs/owl2/blackout-internals.png)

Figure 2. Query Rewriting

We illustrate the query answering process by means of an example.
Consider a Stardog database, MyDB~1~, containing the following schema
axioms:

      :SeniorManager rdfs:subClassOf :manages some :Manager
      :manages some :Employee rdfs:subClassOf :Manager
      :Manager rdfs:subClassOf :Employee
      

Which says that a senior manager manages at least one manager, that
every person that manages an employee is a manager, and that every
manager is also an employee. Moreover, let us assume MyDB~1~ also
contains the following data assertions:

      :Bill rdf:type :SeniorManager
      :Robert rdf:type :Manager
      :Ana :manages :Lucy
      :Lucy rdf:type :Employee
      

Finally, let us assume that we want to retrieve the set of all
employees. We do this by posing the following query:

    SELECT ?employee WHERE { ?employee rdf:type :Employee }

Given the knowledge captured in the schema, we expect all individuals
occurring in the data to be part of the answer. In order to answer this
query, Stardog first **rewrites** it using the schema. In this case, the
original query is rewritten into four queries:

      SELECT ?employee WHERE { ?employee rdf:type :Employee }
      SELECT ?employee WHERE { ?employee rdf:type :Manager }
      SELECT ?employee WHERE { ?employee rdf:type :SeniorManager }
      SELECT ?employee WHERE { ?employee :manages ?x. ?x rdf:type :Employee }
      

The final step consists of executing these four queries over the data.

The form of the EQ depends on the reasoning level. For OWL 2 QL, every
EQ produced by Stardog *is guaranteed to be expanded into a set of
queries*. If the reasoning level is OWL 2 RL or EL, then the EQ *may*
(but may not) include a recursive rule. If a recursive rule is included,
Stardog's answers will be sound but incomplete with respect to the
semantics of the requested reasoning level.

Why Query Rewriting?
--------------------

Query rewriting has several advantages over the (primary) alternative
technique, i.e., materialization. In this approach, it is the data that
gets expanded with respect to the schema, not the query. That is, the
axioms in the schema are used as rules to generate new triples. However,
materialization introduces some issues:

-   **data freshness**. Materialization has to be performed every time
    the data or the schema change. This is particularly unsuitable for
    applications where the data changes frequently.
-   **data size**. Depending on the schema, materialization can
    significantly increase the size of the data. A relatively simple
    class hierarchy with a single level of subclasses can duplicate the
    size of the data.
-   **OWL 2 profile reasoning**. Given the fact that QL, RL, and EL, are
    not comparable with respect to expressive power, an application that
    requires reasoning with more than one profile would need to maintain
    different corresponding materialized versions of the data.
-   **Resources**. Depending on the size of the original data and the
    complexity of the schema, materialization can be computationally
    expensive.

Performance Hints {#chapter}
=================

The [query rewriting approach implemented by Stardog](#approach) implies
guidelines that might contribute to more efficient query answering.

### Hierarchies and Queries

**Avoid unnecessarily deep class/property hierarchies**. If you do not
need to model several different types of a given class or property in
your schema, then do not. The reason shallow hierarchies are desirable
is that the maximal hierarchy depth in the ontology partly determines
the maximal size of the EQs produced by Stardog. The larger the EQ, the
more difficult is to evaluate it over the data.

For example, suppose our schema contains a very thorough and detailed
set of subclasses of the class `:Employee`:

      :Manager rdfs:subClassOf :Employee
      :SeniorManager rdfs:subClassOf :Manager
      ...
      
      :Supervisor rdfs:subClassOf :Employee
      :DepartmentSupervisor rdfs:subClassOf :Supervisor
      ...
      
      :Secretary rdfs:subClassOf :Employee
      ...
      

If we wanted to retrieve the set of all employees, Blackout would
produce an EQ containing a query of the following form for every
subclass `:Ci` of `:Employee`:

      SELECT ?employee WHERE { ?employee rdf:type :Ci }
      

At this point, it is easy to see that **the more specific the query, the
better** as general queries—that is, queries that contain concepts high
up in the class hierarchy defined by the schema—as the one above, will
typically yield larger EQs.

### Domains and Ranges

**Specify domain and range of the properties in the schema**. These
types of axiom can help reduce the size of the EQs significantly due to
an optimization technique implemented in Blackout called *query
subsumption*. In order to grasp the intuition behind it, let us consider
the following query asking for people and the employees they manage:

      SELECT ?manager ?employee WHERE { ?manager :manages ?employee. ?employee rdf:type :Employee }
      

We know that this query would cause a large EQ given the deep hierarchy
of `:Employee` in MyDB~1~. However, if we added the following single
range axiom:

      :manages rdfs:range :Employee
      

then the EQ would collapse to:

      SELECT ?manager ?employee WHERE { ?manager :manages ?employee }
      

which is considerably less difficult to evaluate.

Terminology
-----------

### Databases

A *database* (DB), a.k.a. ontology, is composed of two different parts:
the schema or *Terminological Box* (TBox) and the data or *Assertional
Box* (ABox). Analogus to relational databases, the TBox can be thought
of as the schema, and the ABox as the data. In other words, the TBox is
a set of *axioms*, whereas the ABox is a set of *assertions*.

As we explain in [Section OWL 2 Profiles](#profiles), the kinds of
assertion and axiom that one might use for a particular database are
determined by the fragment of OWL 2 to which one would like to adhere.
In general, you should choose the OWL 2 profile that most closely fits
the data modeling needs of your application.

The most common data assertions are class and property assertions. Class
assertions are used to state that a particular individual is an instance
of a given class. Property assertions are used to state that two
particular individuals (or an individual and a literal) are related via
a given property. For example, suppose we have a DB MyDB~2~ that
contains the following data assertions:We use the usual standard
prefixes for RDF(S) and OWL.

      :clark_and_parsia rdf:type :Company
      :clark_and_parsia :maintains :Stardog
      

stating that `:clark_and_parsia` is a company, and that
`:clark_and_parsia` maintains `:Stardog`.

The most common schema axioms are subclass axioms. Subclass axioms are
used to state that every instance of a particular class is also an
instance of another class. For example, suppose that MyDB~2~ contains
the following TBox axiom:

      :Company rdfs:subClassOf :Organization
      

stating that companies are a type of organization.

### Queries

When reasoning is enabled, Stardog executes SPARQL queries (simply
queries from now on) depending on the type of Basic Graph Patterns they
contain.

A BGP is said to be an ABox BGP if it is of one of the following forms:

-   **term~1~** rdf:type **uri**
-   **term~1~** **uri** **term~2~**
-   **term~1~** owl:differentFrom **term~2~**
-   **term~1~** owl:sameAs **term~2~**

A BGP is said to be a TBox BGP if it is of one of the following forms:

-   **term~1~** rdfs:subClassOf **term~2~**
-   **term~1~** owl:disjointWith **term~2~**
-   **term~1~** owl:equivalentClass **term~2~**
-   **term~1~** rdfs:subPropertyOf **term~2~**
-   **term~1~** owl:equivalentProperty **term~2~**
-   **term~1~** owl:inverseOf **term~2~**
-   **term~1~** owl:propertyDisjointWith **term~2~**
-   **term~1~** rdfs:domain **term~2~**
-   **term~1~** rdfs:range **term~2~**

A BGP is said to be a Hybrid BGP if it is of one of the following forms:

-   **term~1~** rdf:type **?var**
-   **term~1~** **?var** **term~2~**

where **term** (possibly with subscripts) is either an URI or variable;
**uri** is a URI; and **?var** is a variable.

When executing a query, ABox BGPs are handled by Blackout, TBox BGPs are
executed by Pellet, and Hybrid BGPs by a combination of both.

### Reasoning

Intuitively, reasoning with a DB means to make implicit knowledge
explicit. There are two main use cases for reasoning: infer implicit
knowledge and discover modeling errors.

With respect to the first use case, recall that MyDB~2~ contains the
following assertion and axiom:

      :clark_and_parsia rdf:type :Company
      :Company rdfs:subClassOf :Organization
      

From this DB, we can use Stardog in order to *infer* that
`:clark_and_parsia` is an organization:

      :clark_and_parsia rdf:type :Organization
      

Using reasoning in order to infer implicit knowledge in the context of
an enterprise application can lead to simpler queries. Let us suppose,
for example, that MyDB~2~ contains a complex class hierarchy including
several types of organization (including company). Let us further
suppose that our application requires to use Stardog in order to get the
list of all considered organizations. If Stardog were used **with
reasoning**, then we would need only issue the following simple query:

      SELECT ?org WHERE { ?org rdf:type :Organization}
      

In contrast, if we were using Stardog **with no reasoning**, then we
would have to issue the following considerably more complex query that
considers all possible types of organization:

      SELECT ?org WHERE { { ?org rdf:type :Organization } UNION 
                          { ?org rdf:type :Company } UNION
                          ... 
                        }
      

Stardog can also be used in order to discover modeling errors in a DB.
The most common modeling errors are *unsatisfiable* classes and
*inconsistent* DBs.

An unsatisfiable class is simply a class that cannot have any instances.
Say, for example, that we added the following axioms to MyDB~2~:

      :Company owl:disjointWith :Organization
      :LLC owl:equivalentClass :Company and :Organization  
      

stating that companies cannot be organizations and vice versa, and that
an LLC is a company and an organization. The disjointness axiom causes
the class `:LLC` to be unsatisfiable because, for the DB to be
contradiction-free, there can be no instances of `:LLC`.

Asserting (or inferring) that an unsatisfiable class has an instance,
causes the DB to be *inconsistent*. In the particular case of MyDB~2~,
we know that `:clark_and_parsia` is a company AND an organization (see
above); therefore, we also know that it is an instance of `:LLC`, and as
`:LLC` is known to be unsatisfiable, we have that MyDB~2~ is
inconsistent.

Using reasoning in order to discover modeling errors in the context of
an enterprise application is useful in order to maintain a correct
contradiction-free model of the domain. In our example, we discovered
that `:LLC` is unsatisfiable and MyDB~2~ is inconsistent, which leads us
to believe that there is a modeling error in our DB. In this case, it is
easy to see that the problem is the disjointness axiom between
`:Company` and `:Organization`.

### OWL 2 Profiles {#profiles}

As explained in the [OWL 2 Web Ontology Language Profiles
Specification](http://www.w3.org/TR/owl2-profiles/) of the W3C, an OWL 2
profile is a trimmed down version of OWL 2 that trades some expressive
power for the efficiency of reasoning. There are three OWL 2 profiles,
each of which achieves efficiency differently.

-   [OWL 2 QL](http://www.w3.org/TR/owl2-profiles/#OWL_2_QL) is aimed at
    applications that use very large volumes of instance data, and where
    query answering is the most important reasoning task. The expressive
    power of the profile is necessarily limited, however it includes
    most of the main features of conceptual models such as UML class
    diagrams and ER diagrams.
-   [OWL 2 EL](http://www.w3.org/TR/owl2-profiles/#OWL_2_EL) is
    particularly useful in applications employing ontologies that
    contain very large numbers of properties and/or classes. This
    profile captures the expressive power used by many such ontologies
    and is a subset of OWL 2 for which the basic reasoning problems can
    be performed in time that is polynomial with respect to the size of
    the ontology.
-   [OWL 2 RL](http://www.w3.org/TR/owl2-profiles/#OWL_2_RL) is aimed at
    applications that require scalable reasoning without sacrificing too
    much expressive power. It is designed to accommodate OWL 2
    applications that can trade the full expressivity of the language
    for efficiency, as well as RDF(S) applications that need some added
    expressivity.

Each profile restricts the kinds of axiom and assertion that can be used
in a DB. Intuitively, QL is the least expressive of the profiles,
followed by RL and EL; however, strictly speaking, no profile is more
expressive than any other as they provide incomparable sets of
constructs.

Stardog supports the three profiles of OWL 2 by making use of Blackout
and Pellet. Notably, since TBox BGPs are handled completely by Pellet,
Stardog supports reasoning for the whole of OWL 2 for queries containing
TBox BGPs only.

Notes {.fn}
=====

[⌂](# "Back to top")

For comments, questions, or to report problems with this page, please
email the [Stardog Support
Forum](https://groups.google.com/a/clarkparsia.com/group/stardog/about).


