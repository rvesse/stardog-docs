---
quote: Syntactic sugar causes cancer of the semicolon.
layout: "default"
title: Programming with .Net
shortTitle: .Net
toc: true
---

## Introduction

In the [Network Programming](../network/) chapter, we looked at 
how to interact with Stardog over a network via HTTP and SNARL
protocols.  In this chapter we describe how to program Stardog 
from .Net using [dotNetRDF][].  Note that this is an open source
library developed externally and so questions/issues with the 
.Net API should be directed to that project.

You should also be aware that dotNetRDF uses the HTTP API for all
communication with Stardog so you <strong>must</strong> enable 
the HTTP server to use Stardog from .Net.  This is enabled by 
default so most users should not need to do anything to fulfill
this requirement.

[dotNetRDF]: http://www.dotnetrdf.org

If you're a Java developer see the [Programming with Java](../java)]
chapter.  Alternatively If you're a Spring developer, you might want
to read the [Programming with Spring](../spring) chapter.  If you 
prefer a ORM-style approach, you might want to checkout 
[Empire](https://github.com/mhgrove/Empire), which is an implementation
of [JPA](http://www.oracle.com/technetwork/java/javaee/tech/persistence-jsp-140049.html) 
for RDF that works with Stardog.

### Creating & Administering Databases

`StardogServer` provides some limited administrative functionality by
implementing the [Servers API][]

[Servers API]: https://bitbucket.org/dotnetrdf/dotnetrdf/wiki/UserGuide/Storage/Servers

#### Creating a Database

You can create a basic disk backed database with Stardog with one line of code:

<gist>5732640.js</gist>

      <p>
		  It is important to note that, as shown in the examples, you <b>should</b> take care to always dispose of the <code>IStorageServer</code> and/or <code>IStorageProvider</code> instances you create when you are done working with them.
	  </p>

	  <p>
		  You can also use the <code>StardogDiskTemplate</code> or <code>StardogMemTemplate</code> to configure a disk/memory backed database with whatever options you desire, these both derive from the <code>BaseStardogTemplate</code> which
          contains many properties that can be used to configure Stardog database options:

	  <div style="font-size:small">
		  <script src="https://gist.github.com/rvesse/5732680.js"></script>
	  </div>
	  <p>This illustrates how to create a disk backed database named 'id' which supports full text search via <a href="../using">Waldo</a> and has durable transactions enabled.</p>

	  <div style="font-size:small">
		  <script src="https://gist.github.com/rvesse/5732690.js"></script>
	  </div>
	  <p>This illustrates how to create a disk backed database with ICV guard mode enabled at the QL reasoning type.  For more information on what the available
	  properties are see <a href="http://www.dotnetrdf.org/api/index.asp?Topic=VDS.RDF.Storage.Management.Provisioning.Stardog.BaseStardogTemplate">BaseStardogTemplate</a>, for what they mean to Stardog please refer to the <a href="../admin/">admin docs</a>, specifically the chapter on administering a database.</p>
	  
	  <p>For performing other basic administrative tasks via dotNetRDF please refer to the <a href="https://bitbucket.org/dotnetrdf/dotnetrdf/wiki/UserGuide/Storage/Servers">Servers API</a> documentation.

	  <p>Also note, Stardog database administration can be performed from the <a href="../admin/">command line</a> which is substantially more powerful and supports bulk loading of data at database creation time which dotNetRDF does not currently support.</p>
  </section>

  <section id="connection"><header><h1 id='chapter'>Connecting to a Database</h1></header>

  <p>
  Connecting to a database can be done using the dotNetRDF <a href="https://bitbucket.org/dotnetrdf/dotnetrdf/wiki/UserGuide/Storage%20API">Storage API</a>, they provide a <a href="http://www.dotnetrdf.org/api/index.asp?Topic=VDS.RDF.Storage.StardogConnector">StardogConnector</a> which implements their standard <code>IStorageProvider</code> interface.
  Making a connection requires at a minimum knowing the Base URI of your Stardog server and the name of the database.  The Base URI is the HTTP URL that Stardog prints out when you start up the server and is typically of the form <code>http://machine:5822</code> where <code>machine</code> is replaced with the name of the host on which the server
   is running and <code>5822</code> changed only if you have configured Stardog to run on a different HTTP port than the default.  As Stardog implements comprehensive <a href="../security">security</a> you will also likely require user credentials.
  </p>

  <div style="font-size: small">
    <script src="https://gist.github.com/rvesse/5732808.js"></script>
  </div>
  
  <p>
    Stardog allows you to specify the reasoning mode used for queries as part of the connection information like so:
  </p>
  
  <div style="font-size: small">
    <script src="https://gist.github.com/rvesse/5732812.js"></script>
  </div>
  
  <p>
  	Note that is it possible to change the reasoning mode used at any time by changing the value of the <code>Reasoning</code> property though remember that this only affects subsequently issued queries i.e. it does not affect queries that are already in-flight.
  </p>

  </section>

  <section id="storage-api"><header><h1 id='chapter'>Using the Storage API</h1></header>

  <p>
	  This chapter covers how to carry out various common operations against Stardog using dotNetRDF's <a href="https://bitbucket.org/dotnetrdf/dotnetrdf/wiki/UserGuide/Storage%20API">Storage API</a>, you may wish to refer to their <a href="https://bitbucket.org/dotnetrdf/dotnetrdf/wiki/UserGuide/Triple%20Store%20Integration">Triple Store Integration</a> documentation for some more generic examples of using this API.
  </p>
  
  <p>
      When using this API transactions are primarily handled for you with the connection operating in auto-commit mode by default, any write operations automatically using a new transaction and committing it or rolling it back as appropriate.
      Transactions may be manually managed using the <code>Begin()</code>, <code>Commit()</code> and <code>Rollback()</code> methods, read operations will only use transactions when they run in the context of an active transaction.
  </p>

  <h2>Adding Data</h2>
  
  <p>
  	The simplest way to add data is to call the <code>SaveGraph()</code> method which saves a RDF graph to the store.
  </p>

  <div style="font-size: small">
    <script src="https://gist.github.com/rvesse/5786144.js"></script>
  </div>

	  <p>By default, RDF added will go to the named graph corresponding to the <code>BaseUri</code> property of the provided graph unless it is <code>null</code> in which case it gets added to the default graph.</p>
	  
	  <p>When you use the <code>SaveGraph()</code> method the exact behaviour depends on the target graph, saving to the default graph appends data while saving to named graph overwites data.  You can inspect the <code>IOBehaviour</code> property to see all flags that apply to Stardog connectivity when used via dotNetRDF.
	  
	<h2>Modifying Data</h2>
	  
	  <p>If you want to add/remove data from an existing graph then you can use the <code>UpdateGraph()</code> method, this takes a URI for the graph to update and collections of triples to be added and removed.  Note that removals are always processed before additions.</p>
	  
	  <div style="font-size: small">
	    <script src="https://gist.github.com/rvesse/5833189.js"></script>
	  </div>
	  
  <h2>Loading Data</h2>
  
  <p>
    Since the <code>IStorageProvider</code> API is primarily graph oriented the simplest way to load data is to load an entire graph from a database:
  </p>
  
  <div style="font-size: small">
  	<script src="https://gist.github.com/rvesse/5786161.js"></script>
  </div>
  
  <p>
    If you need more fine grained control over loading data then you should make a SPARQL Query as detailed in the next section.
  </p>

  <h2>Making SPARQL Queries</h2>

  

  <div style="font-size: small">
    <!-- TODO: Gist for SparqlParameterizedString -->
  </div>

  <p>We can make a <code>Query</code> object by passing a SPARQL query in the constructor. Simple. Obvious.</p>

  <!-- TODO Write up making queries -->

  <p>We <b>strongly</b> recommend the use of SNARL's parameterized queries over concatenating strings together in order to build your SPARQL query.  This latter
      approach opens up the possibility for SPARQL injection attacks unless you are very careful in scrubbing your input.</p>

  <h2>Removing Data</h2>

  <div style="font-size: small">
    <!-- TODO: Gist for DeleteGraph() -->
  </div>

  <!-- TODO: Write up removing data using UpdateGraph() -->

  <h2>Reasoning</h2>

	  <p>Stardog supports query time OWL 2 QL, EL, and RL
		  reasoning by using a query rewriting technique.<n>In short, when reasoning
			  is requested, a query is automatically rewritten in <i>n</i> queries, which
			  are then executed.</n>. As mentioned earlier reasoning
		  is enabled at the <code>StardogConnector</code> layer and then any queries
		  executed over that connection are executed with reasoning enabled;
		  you don't need to do anything up front when you create your database if you want to use reasoning.  The in-use reasoning mode for your connection may be changed at any time by
		  setting the <code>Reasoning</code> property appropriately.</p>

	  <p>For more information on how reasoning is supported in Stardog, check out the
	  <a href="../owl2">reasoning section</a>.</p>
	  
  <h2>dotNetRDF API Docs</h2>

  <p>Please see the <a href="http://www.dotnetrdf.org/api/">dotNetRDF API</a> docs for more
information.</p>