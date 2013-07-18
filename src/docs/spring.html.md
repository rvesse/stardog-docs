---
quote: "It goes against the grain of modern education to teach children to program. What fun is there in making plans, acquiring discipline in organizing thoughts, devoting attention to detail and learning to be self-critical?"
title: Programming with Spring
shortTitle: Spring
layout: default
toc: true
summary: Spring is a platform to build and run enterprise applications in Java. Stardog's Spring support makes life easier for enterprise developers who need to work with Semantic Web technology&mdash;including RDF, SPARQL, and OWL&mdash;by way of Stardog.
---

The Spring for Stardog [source code](http://github.com/clarkparsia/stardog-spring) is available on Github. 

## Overview 

Spring for Stardog makes it possible to rapidly build Stardog-backed applications with the Spring Framework. As with many other parts of Spring, Stardog's Spring
integration uses the template design pattern for abstracting standard
boilerplate away from application developers.

At the lowest level, Spring for Stardog includes

1.  `DataSouce` and `DataSourceFactoryBean` for managing Stardog
    connections
2.  `SnarlTemplate` for transaction- and connection-pool safe Stardog
    programming
3.  `DataImporter` for easy bootstrapping of input data into Stardog

In addition to the core capabilities, Spring for Stardog also integrates
with the Spring Batch framework. Spring Batch enables complex batch
processing jobs to be created to accomplish tasks such as ETL or legacy
data migration. The standard ItemReader and ItemWriter interfaces are
implemented with a separate callback writing records using the SNARL
Adder API.

Future releases of Spring for Stardog will address other command
enterprise capabilities: Spring Integration, Spring Data, etc.

## Building Spring for Stardog

To build Spring for Stardog, you need a release of Stardog; we use
[Gradle](http://www.gradle.org/) to build Stardog for Spring. Then,

-   edit `build.gradle` to point `stardogLocation` at a Stardog release
    directory;
-   run `gradlew`, which will download and bootstrap a gradle build
    environment;
-   then run `gradlew build`, which eventually results in a
    `stardog-spring.jar` in `build/libs`; finally,
-   `gradlew install` does a build, generates a POM, and installs the
    POM in local Maven repo; alternately,
-   `mvn install` will work, too:

        mvn install:install-file
              -DgroupId=com.clarkparsia.stardog
              -DartifactId=stardog-spring
              -Dversion=1.1.1
              -Dfile=stardog-spring.jar
              -Dpackaging=jar
              -DpomFile=pom.xml


## Basic Spring 

There are three Beans to add to a Spring application context:

-   `DataSourceFactoryBean`: `com.clarkparsia.stardog.ext.spring.DataSourceFactoryBean`
-   `SnarlTemplate`: `com.clarkparsia.stardog.ext.spring.SnarlTemplate`
-   `DataImporter`: `com.clarkparsia.stardog.ext.spring.DataImporter`

`DataSourceFactoryBean` is a Spring `FactoryBean` that configures and
produces a `DataSource`. All of the Stardog `ConnectionConfiguration`
and `ConnectionPoolConfig` methods are also property names of the
`DataSourceFactoryBean`--for example, "to", "url", "createIfNotPresent".

`DataSource` is a Spring for Stardog class, similar to
`javax.sql.DataSource`, that can be used to retrieve a `Connection` from
the `ConnectionPool`. This additional abstraction serves as place to add
Spring-specific capabilities (e.g. `spring-tx` support in the future)
without directly requiring Spring in Stardog.

`SnarlTemplate` provides a template abstraction over much of Stardog's
native API, [SNARL](/java), and follows the same approach of other
Spring template, i.e., `JdbcTemplate`, `JmsTemplate`, and so on.

Spring for Stardog also comes with convenience mappers, for
automatically mapping result set bindings into common data types. The
`SimpleRowMapper` projects the `BindingSet` as a `List>` and a
`SingleMapper` that accepts a constructor parameter for binding a single
parameter for a single result set.

For example,

The key methods on `SnarlTemplate` include the following:

    query(String sparqlQuery, Map args, RowMapper)

`query()` executes the SELECT query with provided argument list, and
invokes the mapper for result rows.

    doWithAdder(AdderCallback)

`doWithAdder()` is a transaction- and connection-pool safe adder call.

    doWithGetter(String subject, String predicate, GetterCallback)

`doWithGetter()` is the connection pool boilerplate method for the
`Getter` interface, including the programmatic filters.

    doWithRemover(RemoverCallback)

`doWithRemover()` As above, the remover method that is transaction and
pool safe.

    execute(ConnectionCallback)

`execute()` lets you work with a connection directly; again, transaction
and pool safe.

    construct(String constructSparql, Map args, GraphMapper)

`construct()` executes a SPARQL CONSTRUCT query with provided argument
list, and invokes the `GraphMapper` for the result set.

`DataImporter` is a new class that automates the loading of RDF files
into Stardog at initialization time.

It uses the Spring Resource API, so files can be loaded anywhere that is
resolvable by the Resource API: classpath, file, url, etc. It has a
single load method for further run-time loading and can load a list of
files at initialization time. The list assumes a uniform set of file
formats, so if there are many different types of files to load with
different RDF formats, there would be different `DataImporter` beans
configured in Spring.

Here's a sample `applicationContext`:

## Spring Batch 

In addition to the base `DataSource` and `SnarlTemplate`, Spring Batch
support adds the following:

-   `SnarlItemReader`:
    `com.clarkparsia.stardog.ext.spring.batch.SnarlItemReader`
-   `SnarlItemWriter`:
    `com.clarkparsia.stardog.ext.spring.batch.SnarlItemWriter`
-   `BatchAdderCallback`:
    `com.clarkparsia.stardog.ext.spring.batch.BatchAdderCallback`

These beans can then be used within Spring Batch job definition, for
example:

## Examples 

### query() with SELECT queries

### doWithGetter

### doWithAdder

### doWithRemover

### construct()