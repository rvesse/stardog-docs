---
quote: "The proof of a system's value is its existence."
layout: "default"
title: "SNARL API Changes in 2.0"
toc: true
shortTitle: "Changes API 2.0"
---

This document serves as a guide for migrating your SNARL 1 API based code to the new SNARL 2 API. 

##Deprecating and Renaming
* All deprecated methods have been removed.
* All `com.clarkparsia` packages have been moved to `com.complexible`.
* All methods marked @Beta have been promoted.

##Queries
* We introduced a new taxonomy for the class `com.complexible.stardog.api.Query`:
```
com.complexible.stardog.api.Query
    com.complexible.stardog.api.ReadQuery
        com.complexible.stardog.api.BooleanQuery
        com.complexible.stardog.api.GraphQuery
        com.complexible.stardog.api.SelectQuery
    com.complexible.stardog.api.UpdateQuery
```
* Queries can be created from a `com.complexible.stardog.api.Connection` object using the suitable method according to desired type of query: `select`, `ask`, `graph`, or `update`.
* It is now possible to specify the reasoning type with which a particular `com.complexible.stardog.api.ReadQuery` is to be executed via the method `reasoning(ReasoningType)`. The query reasoning type overrides the reasoning type of the parent connection. Note that setting the reasoning type to `ReasoningType.NONE` will disable reasoning for that particular query.
* The methods `executeAsk()`, `executeSelect()`, and `executeGraph()` on `com.complexible.stardog.api.Query` have been removed. Queries can be executed by using the `execute()` method which will return a value appropriate for the type of query being executed.

##Connections
* The class `com.complexible.stardog.api.admin.StardogDBMS` was removed.  It has been replaced by `com.complexible.stardog.api.admin.AdminConnectionConfiguration` for creating connections to the Stardog DBMS and `com.complexible.stardog.api.admin.AdminConnection` for the actual connection.
* The method `login` on `com.complexible.stardog.api.admin.StardogDBMS` (now `com.complexible.stardog.api.admin.AdminConnectionConfiguration`) has been renamed `connect` to align with usage of the standard `com.complexible.stardog.api.ConnectionConfiguration`
* The method `connect(ReasoningType)` on `com.complexible.stardog.api.ConnectionConfiguration` has been removed.
* The method `getBaseConnection()` on `com.complexible.stardog.api.reasoning.ReasoningConnection` has been removed.  To obtain a `ReasoningConnection` from a base connection, simply use `Connection.as(ReasoningConnection.class)`.

##Explanations
* The explain functions of `com.complexible.stardog.api.reasoning.ReasoningConnection` now return  `com.complexible.stardog.reasoning.Proof` objects. `com.complexible.stardog.reasoning.Proof.getStatements()` function can be used to get only the asserted statements which is equivalent to what explain functions returned in 1.x.

##Starting the server
* In order to start a server we can use a server builder obtained via the method `buildServer()` on `com.complexible.stardog.Stardog` and then specify the protocol (HTTP or SNARL) and a socket address. The following example shows how to create a new embedded SNARL server.
```
Server aServer = Stardog
            .buildServer()
            .codec(ServerBuilder.Protocol.SNARL)
            .bind(SNARLProtocol.EMBEDDED_ADDRESS)
            .start();
```

A note when programmatically starting a Stardog server in your application.  You *must* be sure to stop the server when you're done with it, otherwise it can prevent the JVM from exiting.