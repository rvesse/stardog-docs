[![](/_/img/sdog-bare.png)](/)

> **Making something variable is easy. Controlling duration of constancy
> is the trick.**—Alan Perlis, Epigrams in Programming

Stardog Groovy {#title}
==============

Introduction {#chapter}
============

[Groovy](http://http://groovy.codehaus.org//) is an agile and dynamic
programming language for the JVM, making popular programming features
such as closures available to Java developers. Stardog's Groovy support
makes life easier for developers who need to work with RDF, SPARQL, and
OWL by way of Stardog.

The Groovy for Stardog [source
code](http://github.com/clarkparsia/stardog-groovy) is available on
Github.

Building Groovy for Stardog {#chapter}
===========================

To build Groovy for Stardog, you need a release of Stardog; we use
[Gradle](http://www.gradle.org/) to build Stardog for Groovy. Then,

-   edit `build.gradle` to point `stardogLocation` at a Stardog release
    directory;
-   run `gradlew build`, which eventually results in a
    `stardog-groovy.jar` in `build/libs`; finally,
-   `gradlew install` does a build, generates a POM, and installs the
    POM in local Maven repo; alternately,
-   `mvn install` will work, too:

        mvn install:install-file
              -DgroupId=com.clarkparsia.stardog
              -DartifactId=stardog-groovy
              -Dversion=1.1.1
              -Dfile=stardog-groovy.jar
              -Dpackaging=jar
              -DpomFile=pom.xml

Overview {#chapter}
========

Groovy for Stardog **@@SPRING\_VERSION@@** provides a set of Groovy API
wrappers for developers to build applications with Stardog and take
advantage of native Groovy features. For example, you can create a
Stardog connection pool in a single line, much like Groovy SQL support.
In Groovy for Stardog, queries can be iterated over using closures and
transaction safe closures can be executed over a connection.

For the first release, Groovy for Stardog includes
`com.clarkparsia.stardog.ext.groovy.Stardog` with the following methods:

1.  `Stardog(map)` constructor for managing Stardog connection pools
2.  `each(String, Closure)` for executing a closure over a query's
    results, including projecting SPARQL result variables into the
    closure.
3.  `query(String, Closure)` for executing a closure over a query's
    results, passing the BindingSet to the closure
4.  `insert(List)` for inserting a list of vars as a triple, or a list
    of list of triples for insertion
5.  `remove(List)` for removing a triple from the database
6.  `withConnection` for executing a closure with a transaction safe
    instance of
    [Connection](http://stardog.com/docs/java/snarl/com/clarkparsia/stardog/api/Connection.html)

In addition to the core capabilities, Groovy for Stardog also integrates
with the Spring bindings and can use a `DataSource` to initialize the
constructor. Combining both together creates an easy to use solution for
other Groovy environments, such as [Grails](http://www.grails.org).

Examples {#chapter}
========

Create a Connection
-------------------

SPARQL Vars projected into Groovy Closures
------------------------------------------

Add and remove triples
----------------------

withConnection closure example
------------------------------

Notes {.fn}
=====

[⌂](# "Back to top")

For comments, questions, or to report problems with this page, please
email the [Stardog Support
Forum](https://groups.google.com/a/clarkparsia.com/group/stardog/about).


