---
quote: When someone says "I want a programming language in which I need only say what I wish done," give him a lollipop.
layout: "default"
title: Programming with Java
shortTitle: Java
toc: true
---

## Introduction

In the [Network Programming](../network/) chapter, we look at how to
interact with Stardog over a network via HTTP and SNARL protocol. In this 
chapter we describe how to program Stardog from Java using SNARL
(**Stardog Native API for the RDF Language**), Sesame, and Jena. We prefer
SNARL to Sesame to Jena and recommend, all other things being equal,
them in that order.

If you're a Spring developer, you might want to read the [Programming with
Spring](../spring) chapter.

If you prefer a ORM-style approach, you might want to checkout [Empire](https://github.com/mhgrove/Empire), which is an implementation of [JPA](http://www.oracle.com/technetwork/java/javaee/tech/persistence-jsp-140049.html) for RDF that works with Stardog.

### Examples

The *best* way to learn to program Stardog with Java is to study the
examples:

1.  [SNARL](https://gist.github.com/1045573)
2.  [Sesame bindings](https://gist.github.com/1045568)
3.  [Jena bindings](https://gist.github.com/1045572)
4.  [SNARL and OWL 2 reasoning](https://gist.github.com/1045578)
5.  [SNARL and Connection Pooling](https://gist.github.com/1070230)
6.  [SNARL and Searching](https://gist.github.com/1085116)

We offer some commentary on the interesting parts of these examples
below.

### Creating & Administering Databases

`AdminConnection` provides simple programmatic access to all administrative
functions available in Stardog.

#### Creating a Database

You can create a basic temporary memory database with Stardog with one
line of code:

<gist>1333782?file=CreateTempMemDb.java</gist>

You can also use the
[`memory`](../java/snarl/com/complexible/stardog/api/admin/AdminConnection.html#memory())
and
[`disk`](../java/snarl/com/complexible/stardog/api/admin/AdminConnection.html#disk())
functions to configure and create a database in any way you prefer.
These methods return
[`DatabaseBuilder`](../java/snarl/com/complexible/stardog/DatabaseBuilder.html)
objects which you can use to configure the options of the database you'd
like to create. Finally, the
[`create`](../java/snarl/com/complexible/stardog/DatabaseBuilder.html#create())
method takes the list of files to bulk load into the database when you
create it and returns a valid
[`ConnectionConfiguration`](../java/snarl/com/complexible/stardog/api/ConnectionConfiguration.html)
which can be used to create new
[`Connections`](../java/snarl/com/complexible/stardog/api/Connection.html)
to your database.

It is important to note that you **must** take
care to always log out of the server when you are done working with
`AdminConnection`.

<gist>1333782?file=CreateMemSearchDb.java</gist>

This illustrates how to create a temporary memory database named 'test'
which supports full text search via [Waldo](../using).

<gist>1333782?file=CreateDiskAndICV.java</gist>

This illustrates how to create a persistent disk database with ICV guard
mode enabled at the QL reasoning type. For more information on what the
available options for `set` are and what they mean, see the refer to the
[admin docs](../admin/), specifically the chapter on administing a
database.

Also note, Stardog database administration can be performed from the
[command line](../admin/).

### Creating a Connection String 

As you can see, the
[`ConnectionConfiguration`](../java/snarl/com/complexible/stardog/api/ConnectionConfiguration.html)
(in
[`com.clarkparsia.stardog.api`](../java/snarl/com/complexible/stardog/api/package-summary.html)
package) class is where the initial action takes place:

<gist>1045578?file=L4044.java</gist>

The
[`to()`](../java/snarl/com/complexible/stardog/api/ConnectionConfiguration.html#to()
method takes a `Database Name` (as a string); and then
[`connect()`](../java/snarl/com/complexible/stardog/api/ConnectionConfiguration.html#connect()
actually connects to the database using all specified properties on the
configuration. This class and its constructor methods are used for *all* of Stardog's
Java APIs: SNARL (native Stardog API), Sesame, Jena, as well as HTTP and
SNARL protocol. In the latter cases, you must also call
[`server`](../java/snarl/com/complexible/stardog/api/ConnectionConfiguration.html#server(java.lang.String)
and pass it a valid URL to the Stardog server using the HTTP or SNARL
protocols.

Without the call to `server()`, `ConnectionConfiguration` will attempt
to connect to a local, embedded version of the Stardog server. The
`Connection` still operates in the standard client-server mode, the only
difference is that the server is running in the *same* JVM as your
application.

**Note**: Whether using SNARL, Sesame, or Jena, most (perhaps all)
Stardog Java code will use `ConnectionConfiguration` to get a handle on
a Stardog database---whether embedded or remote---and, after getting that
handle, can use the API that makes the most sense for the use cases and
requirements at hand.

See the
[`ConnectionConfiguration`](../java/snarl/com/complexible/stardog/api/ConnectionConfiguration.html)
API docs or the [administration section](../admin/) for more information
on connection strings.

### Managing Security 

We discuss the security sytem in Stardog in the
[security](../security) chapter in greater detail.

When logged into the Stardog
[DBMS](../java/snarl/com/complexible/stardog/api/admin/AdminConnection.html)
you can access all security related features detailed in the security
section using any of the core security interfaces for [managing
users](../java/snarl/com/complexible/stardog/security/UserManager.html),
[roles](../java/snarl/com/complexible/stardog/security/RoleManager.html)
and
[permissions](../java/snarl/com/complexible/stardog/security/PermissionManager.html)

[Shiro](http://shiro.apache.org) is used internally as the core of the
security framework, but unlike previous versions, you do not need to
configure Shiro directly. All management can be done via the
command-line or via the security API provided by `AdminConnection`

### Using SNARL

In the examples (1) and (4) above, you can see how to use SNARL in Java
to interact with Stardog. The SNARL API will give the best performance
overall and is the native Stardog API. It uses some Sesame domain
classes but is otherwise a clean-sheet API and set of implementations.

The SNARL API is fluent with the aim of making code written for Stardog
easier to write and easier to maintain. Most objects are easily re-used
to make basic tasks with SNARL as simple as possible. We are always
interested in feedback on the API, so if you have suggestions or
comments, please send them to the mailing list.

Let's take a closer look at some of the interesting parts of SNARL.

### Adding Data

<gist>1045573?file=SNARLAddData.java</gist>

You must always enclose changes to a database within a transaction begin
and commit (or rollback). Changes are kept locally until the transaction is committed,
or you try and perform a query operation to inspect the state of the
database within the transaction.

By default, RDF added will go into the default context unless specified
otherwise. As shown, you can use
[Adder](../java/snarl/com/complexible/stardog/api/Adder.html) directly
to add statements and graphs to the database, and if you want to add
data from a file or input stream, you use an
[`io()`](../java/snarl/com/complexible/stardog/api/IO.html), `format()`,
and `stream()` chain of method invocations.

See the [SNARL API](../java/snarl) Javadocs for all the gory details.

### Removing Data

<gist>1045573?file=SNARLRemoveData.java</gist>

Let's look at
[removing](../java/snarl/com/complexible/stardog/api/Remover.html) data
via SNARL; in the example above, you can see that file or stream-based
removal is symmetric to file or stream-based addition, i.e., calling
`remove()` in an `io()` chain with a file or stream call. See the SNARL
API docs for more details about finer-grained deletes, etc.

### Parameterized SPARQL Queries

<gist>1045573?file=SNARLQuery.java</gist>

SNARL also lets us parameterize SPARQL queries. We can make a `Query` object by passing a SPARQL query in the constructor. Simple. Obvious.

Next, let's set a limit for the results: `aQuery.limit(10)`; or if we
want no limit, `aQuery.limit(Query.NO_LIMIT)`. By default, there is no
limit imposed on the query object; we'll use whatever is specified in
the query. But you can use limit to override any limit specified in the
query, however specifying NO\_LIMIT will not remove a limit specified in
a query, it will only remove any limit override you've specified
restoring the state to the default of using whatever is in the query.

We can execute that query with `executeSelect()` and iterate over the
results. We can also rebind the "?s" variable easily:
`aQuery.parameter("s", aURI)`, which will work for all instances of "?s"
in any BGP in the query, and you can specify `null` to remove the
binding.

Query objects are re-useable, so you can create one from your original
query string and alter bindings, limit, and offset in any way you see
fit and re-execute the query to get the updated results.

We **strongly** recommend the use of SNARL's parameterized queries over
concatenating strings together in order to build your SPARQL query. This
latter approach opens up the possibility for SPARQL injection attacks
unless you are very careful in scrubbing your input.

### Getter Interface

<gist>1045573?file=SNARLGetter.java</gist>

SNARL also supports some sugar for the classic statement-level
(`getSPO()` scars, anyone?) interactions. We ask in the first line of
the snippet above for an iterator over the Stardog connection, based on
`aURI` in the subject position. Then a while-loop, as one might
expect...

You can also parameterize `Getter`s by binding different positions of
the `Getter` (which acts like a kind of RDF statement filter)---and then
iterating as usual. **Note** the `aIter.close()` which is important for Stardog databases to avoid memory leaks. If you need to materialize the iterator as a graph, you can do that by calling `graph()`.

The snippet doesn't show `object()` or `context()` parameters on a
`Getter`, but those work, too, in the obvious way.


### Reasoning

Stardog supports query-time [reasoning](/owl2) using a
query rewriting technique. In short, when reasoning is requested, a query
is automatically rewritten in *n* queries, which are then executed.. As
we discuss below in Connection Pooling, reasoning is enabled at the
`Connection` layer and then any queries executed over that connection
are executed with reasoning enabled; you don't need to do anything up
front when you create your database if you want to use reasoning.

<gist>1045578?file=CreateReasoningConn.java</gist>

In this code example, you can see that it's trivial to enable reasoning
for a `Connection`: simply call `reasoning()` with the appropriate
constant (such as `ReasoningType.QL`) passed in. In addition to OWL2 QL,
EL, and RL, Stardog supports OWL2 DL *schema* queries. Stardog also
supports [SWRL](http://www.w3.org/Submission/SWRL/).

For more information on how reasoning is supported in Stardog, check out
the [reasoning chapter](../owl2).

### Search

Stardog's [search](../using) system can be used from Java in the following way. The fluent Java API for searching in SNARL looks a lot like the other
search interfaces: We create a `Searcher` instance with a fluent
constructor: `limit()` sets a limit on the results; `query()` contains
the search query, and `threshold` sets a minimum threshold for the
results.

<gist>1085116?file=SearcherUsage.java</gist>

Then we call the `search()` method of our `Searcher` instance and
iterate over the results (i.e., `SearchResults`). Last, we can use
`offset()` on an existing `Searcher` to grab another page of results.

Stardog also supports performing searches over the full-text index
*within* a SPARQL query via the [LARQ SPARQL
syntax](http://jena.apache.org/documentation/larq/). This provides a
powerful mechanism for querying both your RDF index and full-text index
at the same time while also giving you a more performant option to the
SPARQL `regex` filter.

### SNARL Connection Views


SNARL [`Connections`](../java/snarl/com/complexible/stardog/api/Connection.html#)
support obtaining a specified type of `Connection`. This provides the
ability to extend and enhance the features available to a Connection
while maintaining the standard, simple Connection API. The Connection
[`as`](../java/snarl/com/complexible/stardog/api/Connection.html#as())
method takes as a parameter the interface, which must be a sub-type of a
Connection, that you would like to use. `as` will either return the
Connection as the view you've specified, or it will throw an exception
if the view could not be obtained for some reason.

An example of obtaining an instance of a
[`SearchConnection`](../java/snarl/com/complexible/stardog/api/search/SearchConnection.html)
to use Stardog's full-text search support would look like this:

<gist>1085116?file=SearchConnectionView.java</gist>

### SNARL API Docs

Please see [SNARL API](../java/snarl/) docs for more information.

## Using Sesame 

Stardog supports the [Sesame
API](http://www.openrdf.org/doc/sesame/users/ch07.html); thus, for the
most part, using Stardog and Sesame is not much different from using
Sesame with other RDF databases. There are, however, at least two
differences worth pointing out.

### Wrap the connection with `StardogRepository`

<gist>1045568?file=init.java</gist>

As you can see from the code snippet, once you've created a
`ConnectionConfiguration` with all the details for connecting to a
Stardog database, you can wrap that in a `StardogRepository` which is a
Stardog specific implementation of the Sesame `Repository` interface. At
this point, you can use the resulting `Repository` like any other Sesame
`Repository` implementation. Each time you call
`Repository.getConnection`, your original `ConnectionConfiguration` will
be used to spawn a new connection to the database.

### Autocommit

Stardog's `RepositoryConnection` implementation will, by default, disable
`autoCommit` status. When enabled, every single statement added or
deleted via the `Connection` will incur the cost of a transaction, which
is too heavyweight for most use cases. You can enable
`autoCommit` and it will work as expected; but **we recommend
leaving it disabled**.

## Using Jena 

Stardog supports Jena via a Sesame-Jena bridge, so it's got more
overhead than Sesame or SNARL. YMMV. There two points in the Jena
example to emphasize.

### Init in Jena

<gist>1045572?file=InitJena.java</gist>

The initialization in Jena is a bit different from either SNARL or
Sesame; you can get a Jena `Model` instance by passing the `Connection`
instance (returned by `ConnectionConfiguration`) to the Stardog factory,
`SDJenaFactory`.

### Add in Jena

<gist>1045572?file=AddToJena.java</gist>

Jena also wants to add data to a `Model` one statement at a time, which
can be less than ideal. To work around this restriction, we recommend
adding data to a `Model` in a single Stardog transaction, which is
initiated with `aModel.begin()`. Then to read data into the model, we
recommend using RDF/XML, since that triggers the `BulkUpdateHandler` in
Jena or grab a `BulkUpdateHandler` directly from the underlying Jena
graph.

The other options include using the Stardog
[command-line](../admin/#cli) client to bulk load a Stardog database or
to use SNARL for loading and then switch to Jena for other operations,
processing, query, etc.

## Client-Server Stardog

Using Stardog from Java in either embedded or
client-server mode is *very similar*---the only visible difference
is the use of `url()` in a `ConnectionConfiguration`: when it's present,
we're in client-server model; else, we're in embedded mode.

That's a good and a bad thing: it's good because the code is symmetric
and uniform. It's bad because it can make reasoning about performance
difficult, i.e., it's not entirely clear in client-server mode which
operations trigger (or don't trigger) a round trip with the server and,
thus, which may be more expensive than they are in embedded mode.

In client-server mode, **everything triggers a round trip** with these
exceptions:

-   closing a connection outside a transaction
-   any parameterizations (or other) of a query or getter instance
-   any database state mutations in a transaction that don't need to be
    immediately visible to the transaction; that is, changes are sent to
    the server only when they are required, on commit, or on any query
    or read operation that needs to have the accurate up-to-date state
    of the data within the transaction.

Stardog generally tries to be as lazy as possible; but in client-server
mode, since state is maintained on the client, there are fewer chances
to be lazy and more interactions with the server.

## Embedded Stardog 

In addition to the `url()` issue, the other key difference between
client-server and embedded Stardog is, of course, Java classpath woes.
As of Stardog <t>version</t>, there is one classpath issue to watch out for: if you're using Jena in embedded mode, then Jena's libraries should
be on the classpath *after* Stardog's, because of conflicting Lucene
JARs. 

Please let us know if you find any other conflicts among JARs or other
classpath issues.

## Connection Pooling

Stardog supports connection pools for SNARL `Connection` objects for
efficiency and programmer sanity. Here's how they work:

<gist>1070230?file=JustCode.java</gist>

Per standard practice, we first initialize security and grab a
connection, in this case to the `testConnectionPool` database.

Then we setup a `ConnectionPoolConfig`, using its fluent API, which
establishes the parameters of the pool:

<dl class="metro">
<dt>`using()`</dt>
<dd>Sets which ConnectionConfiguration we want to pool; this is what is used to actually create the connections.</dd>
<dt>`minPool()`, `maxPool()`</dt>
<dd>Establishes min and max pooled objects; max pooled objects includes both leased and idled objects.</dd>
<dt>`expiration()`</dt>
<dd>Sets the idle life of objects; in this case, the pool reclaims objects idled for 1 hour.</dd>
<dt>`blockAtCapacity()`</dt>
<dd>Sets the max time (here: in minutes) that we'll block waiting for an object when there aren't any idle ones in the pool.</dd>
</dl>


Whew! Next we can `create()` the pool using this `ConnectionPoolConfig`
thing.

Finally, we call `obtain()` on the `ConnectionPool` when we need a new
one. And when we're done with it, we return it to the pool so it can be
re-used, by calling `release()`. When we're done, we `shutdown()` the
pool.

Since [reasoning](../owl2) in Stardog is enabled per `Connection`, you
can create two pools: one with reasoning connections, one with
non-reasoning connections; and then use the one you need to have
reasoning *per query*; never pay for more than you need.

## API Deprecation

Methods and classes in SNARL API that are marked with the
`com.google.common.annotations.Beta` are subject to change or removal in
any release. We are using this annotation to denote new or experimental
features, the behavior or signature of which may change significantly
before it's out of "beta".

We will otherwise attempt to keep the public APIs as stable as possible,
and methods will be marked with the standard `@Deprecated` annotation
for a least one full revision cycle before their removal from the SNARL
API. See [What 1.x Means](/compatibility) for more information about API stability.

Anything marked `@VisibleForTesting` is just that, visible as a
consequence of test case requirements; don't write any important code
that depends on functions with this annotation.
