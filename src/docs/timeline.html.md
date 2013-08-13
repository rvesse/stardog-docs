---
quote: "Every program is a part of some other program and rarely fits."
title: "What's New?"
layout: default
related: ""
toc: false
---

This chapter gives an overview of major features and other notable changes to Stardog. For a complete list of changes, including notable bug fixes, see the [Release Notes](/docs/RELEASE_NOTES.txt).

## 2.0

- [SPARQL 1.1 Update](/using)
- [Web Console](/console)
- [JMX monitoring](/admin/#jmx)
- HTTP & SNARL servers unified into a single server (default port 5820)
- [Stardog Web](/web) application development framework
- [Database archetypes]() for PROV, SKOS; user-extensible for user-defined ontologies, schemas, etc.
- [Stardog Rules Syntax](/owl2/): new syntax for user-defined rules
- Performance improvements for SPARQL query evaluation
- Nested explanations of inferences using proof trees

## 1.2

- Query management: slow query log, kill-able queries, etc.
- new CLI
- new transaction layer
- SPARQL Service Description
- new security layer
- Query rewrite cache
- Removed Stardog Shell

## 1.1.2

- New optimizer for subqueries

## 1.1

- SPARQL 1.1 Query
- Transitive reasoning
- User-defined rules in SWRL
- new SWRL builtins and syntactic sugar for schema-queries
- Improved performance of reasoning queries involving rdf:type
- Improved performance of search indexing
- Deprecated Stardog Shell

## 1.0.4

- Convert ICVs to SPARQL queries in the CLI or Java API
- Running as a Windows Service
- Parametric queries in CLI

## 1.0.2

- Stardog Community
- ICV in SNARL and HTTP
- HTTP Admin protocol extensions
- SPARQL 1.1 Graph Store Protocol

## 1.0.1

- Self-hosting Stardog documentation
- Prefix mappings per database
- Access and audit logging

## 1.0

- Execute `DESCRIBE` queries against multiple resources
- Database consistency checking from CLI
- Inference explanations from CLI