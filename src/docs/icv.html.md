---
quote: "It is easier to write an incorrect program than understand a correct one."
title: "ICV"
layout: "default"
related: ""
toc: true
---

## Introduction

Stardog Integrity Constraint Validation ("ICV") validates RDF data stored in a Stardog database according to data rules (i.e., "constraints") described by users and that make sense for their domain, application, and data. These constraints are written in SPARQL, OWL, or SWRL. This chapter explains how to use ICV and how it works.

## ICV Quick Start

To use ICV in Stardog, you need some data and some constraints. To get you started very quickly, we've included a sample database and constraints in the Stardog distribution. This section explains how to use ICV in Stardog using that sample info.

```
$ ./stardog icv 
```

@TODO write me

## Validating Linked Data

The use of high-level languages (OWL 2, SWRL, and SPARQL) to validate
RDF data using closed world semantics is one of Stardog's unique
capabilities. Using high level languages like OWL, SWRL, and SPARQL as schema or constraint languages for RDF and Linked Data has several advantages:

-   Unifying the domain model with data quality rules
-   Aligning the domain model and data quality rules with the
    integration model and language (i.e., RDF)
-   Being able to query the domain model, data quality rules,
    integration model, mapping rules, etc with SPARQL
-   Being able to use automated reasoning about all of these things to insure logical consistency, explain errors and problems, etc.

(If you are also interested in theory and background, please see the [ICV specification](icv-specification.html), which has all the formal details.)

### ICV & OWL 2 Reasoning

An integrity constraint may be satisfied or violated in either of two
ways: by an explicit statement in a Stardog database or by a statement that's been legally inferred by Stardog (because a user requested reasoning). This means that when ICV is enabled for a Stardog database, it has to be enabled with respect to a reasoning type (which we sometimes call in the Stardog Docs a "reasoning level"). The valid choices of reasoning type are any type or kind of reasoning supported by Stardog. See [Stardog's reasoning & inference chapter](/owl2#reasoning-levels) for more.

The implication is that ICV is performed with three inputs: 

1. a Stardog database, 
2. a set of constraints, and 
3. a reasoning type (which may be, of course, no reasoning). 

This is the case because domain modelers, ontology developers, or integrity constraint authors must consider the interactions between explicit and inferred statements and how these are accounted for in integrity constraints.

### Security Implications

There is a security implication in this design choice that may not be
obvious. Changing the reasoning type associated with a database and
integrity constraint validation has serious security implications with
respect to a Stardog database and may only be performed by a user role
with sufficient privileges for that action.

### Using ICV Programmatically

This section will describe how to use Stardog ICV via the SNARL APIs.
For more information on using SNARL in general, please refer to the
section on [programming with Stardog in Java](../java).

There is command-line interface support for many of the operations
necessary to using ICV with a Stardog database; please see the
[Administration](../admin) chapter for that documentation.

To use ICV in Stardog, one must:

1.  create some constraints
2.  associate those constraints with a Stardog database

#### Creating Constraints

[`Constraints`](../java/snarl/com/clarkparsia/stardog/icv/Constraint.html)
can be created using the
[`ConstraintFactory`](../java/snarl/com/clarkparsia/stardog/icv/ConstraintFactory.html)
which provides methods for creating integrity constraints from OWL
axioms or from SPARQL select queries. `ConstraintFactory` expects your
constraints, if they are defined as OWL axioms, as an RDF triple (or
graph). To aid in authoring constraints in OWL,
[`ExpressionFactory`](../java/snarl/com/clarkparsia/openrdf/util/ExpressionFactory.html)
is provided for building the [RDF
equivalent](http://www.w3.org/TR/owl2-mapping-to-rdf/) of the OWL axioms
of your constraint.

You can also write your constraints in OWL in your favorite editor, such
as Protege, and load them into the database from your OWL file.

We recommend defining your constraints as OWL axioms, but you are free
to define them using SPARQL SELECT queries. If you choose to define a
constraint using a SPARQL select query, please keep in mind that if your
query returns results, those are interpreted as the violations of the
integrity constraint.

An example of creating a simple constraint using the ExpressionFactory.

#### Adding Constraints to Stardog

The [ICVConnection](../java/snarl/com/clarkparsia/stardog/icv/api/ICVConnection.html) interface provides programmatic access to the ICV support in Stardog.
It provides support for adding, removing and clearing integrity constraints in
your database as well as methods for checking whether or not the data is
valid; and when it's not, retrieving the list of violations.

This example shows how to add an integrity constraint to a Stardog
database.

Here we show how to add a set of constraints as defined in a local OWL
ontology.

#### IC Validation

Checking whether or not the contents of a database are valid is easy.
Once you have an
[`ICVConnection`](../java/snarl/com/clarkparsia/stardog/icv/api/ICVConnection.html)
you can simply call its
[`isValid()`](../java/snarl/com/clarkparsia/stardog/icv/api/ICVConnection.html#isValid())
method which will return whether or not the contents of the database are
valid with respect to the constraints associated with that database.
Similarly, you can provide some
[`constraints`](../java/snarl/com/clarkparsia/stardog/icv/Constraint.html)
to the `isValid()` method to see if the data in the database is invalid
for those **specific** constraints; which can be a subset of the
constraints associated with the database, or they can be new constraints
you are working on.

If the data is invalid for some constraints—either the explicit
constraints in your database or a new set of constraints you have
authored—you can get some information about what the violation was from
the SNARL IC Connection.
[`ICVConnection.getViolationBindings()`](../java/snarl/com/clarkparsia/stardog/icv/api/ICVConnection.html#getViolationBindings())
will return the constraints which are violated, and for each constraint,
you can get the violations as the set of bindings that satisfied the
constraint query. You can turn the bindings into the individuals which
are in the violation using
[`ICV.asIndividuals`](../java/snarl/com/clarkparsia/stardog/icv/ICV.html#asIndividuals()).

### ICV and Transactions

In addition to using the ICConnection a data oracle to tell whether or
not your data is valid with respect to some constraints, you can also
use Stardog's ICV support to protect your database from invalid data by
using ICV as a guard within transactions.

When guard mode for ICV is enabled in Stardog, each commit is inspected
to ensure that the contents of the database are valid for the set of
constraints that have been associated with it. Should someone attempt to
commit data which violates one or more of the constraints defined for
the database, the commit will fail and the data will not be
added/removed from your database.

By default, reasoning is not used when you enable guard mode, however
you are free to specify any of the reasoning types supported by Stardog
when enabling guard mode. If you have provided a specific reasoning type
for guard mode it will be used during validation of the integrity
constraints. This means you can author your constraints with the
expectation of inference results satisfying a constraint.

This illustrates how to create a persistent disk database with ICV guard
mode enabled at the QL reasoning type. Guard mode can also be enabled
when the database is created on the [command line](../admin)

ICV Examples
------------

Rather than discuss the [formal semantics](icv-specification.html) of
ICV here, we will look at some examples. The following examples use OWL
2's Manchester syntax; and they assume a simple data schema, which is
available as an [OWL ontology](company.owl) and as a [UML
diagram](ClassDiagram.png). The examples also assume that the default
namespace is `<http://example.com/company.owl#>` and that `xsd:` is
bound to the standard, `<http://www.w3.org/2001/XMLSchema#>`.

We [provide reference code](https://gist.github.com/1333767) for each of
the different following examples. This is also included in the examples
directory in the Stardog distribution.

### Subsumption Constraints

This kind of constraint guarantees certain subclass and superclass
(i.e., subsumption) relationships exist between instances.

#### Managers must be employees

Constraint

    Class: Manager
        SubClassOf: Employee

A

    Individual: Alice
        Types: Manager

Invalid

B

    Individual: Alice
        Types: Manager, Employee

Valid

This constraint says that if an RDF individual is an instance of
*Manager*, then it must also be an instance of *Employee*. In ontology
A, the only instance of *Manager*, namely *Alice*, is not an instance of
*Employee*; therefore, A is invalid. In B, *Alice* is an instance of
both *Manager* and *Employee*; therefore, B is valid.

### Domain-Range Constraints

These constraints control the types of domain and range instances for
properties.

#### Only project leaders can be responsible for projects.

Constraint

    ObjectProperty: is_responsible_for
        Domain: Project_Leader
        Range: Project

A

    Individual: Alice
        Facts: is_responsible_for MyProject

    Individual: MyProject
        Types: Project

Invalid

B

    Individual: Alice
        Types: Project_Leader
        Facts: is_responsible_for MyProject

    Individual: MyProject

Invalid

C

    Individual: Alice
        Types: Project_Leader
        Facts: is_responsible_for MyProject

    Individual: MyProject
        Types: Project

Valid

This constraint says that if an RDF instance *i* is related to an RDF
instance *j* via the property *is\_responsible\_for*, then *i* must be
an instance of *Project\_Leader* and *j* must be an instance of
*Project*. In ontology A, there is only one pair of individuals related
via *is\_responsible\_for*, namely *(Alice, MyProject)*, and *MyProject*
is an instance of *Project*; but *Alice* is not an instance of
*Project\_Leader*. Therefore, A is invalid. In B, *Alice* is an instance
of *Project\_Leader*, but *MyProject* is not an instance of *Project*;
therefore, B is not valid. In C, *Alice* is an instance of
*Project\_Leader*, and *MyProject* is an instance of *Project*;
therefore, C is valid.

#### Only employees can have an SSN.

Constraint

    DataProperty: SSN
        Domain: Employee

A

    Individual: Bob
        Facts: SSN "123-45-6789"

Invalid

B

    Individual: Bob
        Types: Employee
        Facts: SSN "123-45-6789"

Valid

This constraint says that if an RDF instance *i* has a data assertion
via the the property *SSN*, then *i* must be an instance of *Employee*.
In ontology A, *Bob* is not known to be an instance of *Employee* but
has *SSN*, therefore, A is invalid. In B, *Bob* is defined to be an
instance of *Employee*, therefore the ontology is valid.

#### Each date of birth must be a date.

Constraint

    DataProperty: DOB
        Range: xsd:date

A

    Individual: Bob
        Facts: DOB "1970-01-01"

Invalid

B

    Individual: Bob
        Facts: DOB "1970-01-01"^^xsd:date

Valid

This constraint says that if an RDF instance *i* is related to a literal
*l* via the data property *DOB*, then *l* must have the XML Schema type
*xsd:date*. In ontology A, *Bob* is related to the untyped literal
*"1970-01-01"* via *DOB* so A is invalid. In B, the literal
*"1970-01-01"* is properly typed so the ontology is valid.

### Participation Constraints

These constraints control whether (or not) an RDF instance participates
in some specified relationship.

#### Each supervisor must supervise at least one employee.

Constraint

    Class: Supervisor
        SubClassOf: supervises some Employee

A

    Individual: Alice

Valid

B

    Individual: Alice
        Types: Supervisor

Invalid

C

    Individual: Alice
        Types: Supervisor
        Facts: supervises Bob

    Individual: Bob

Invalid

D

    Individual: Alice
        Types: Supervisor
        Facts: supervises Bob

    Individual: Bob
        Types: Employee

Valid

This constraint says that if an RDF instance *i* is of type
*Supervisor*, then *i* must be related to an individual *j* via the
property *supervises*, and *j* must be an instance of *Employee*. In
ontology A, *Supervisor* has no instances; therefore, A is vacuously
valid. In B, the only instance of *Supervisor*, namely *Alice*, is
related to no individual; therefore, B is invalid. In C, *Alice* is
related to *Bob* via *supervises*, but *Bob* is not an instance of
*Employee*; therefore, C is invalid. In D, *Alice* is related to *Bob*
via *supervises*, and *Bob* is an instance of *Employee*; therefore, D
is valid.

#### Each project must have a valid project number.

Constraint

    Class: Project
    SubClassOf: number some integer[> 0, < 5000]

A

    Individual: MyProject

Valid

B

    Individual: MyProject
    Types: Project

Invalid

C

    Individual: MyProject
    Types: Project
    Facts: number "23"

Invalid

D

    Individual: MyProject
    Types: Project
    Facts: number "6000"^^integer

Invalid

E

    Individual: MyProject
    Types: Project
    Facts: number "23"^^integer

Valid

This constraint says that if an RDF instance *i* is of type *Project*,
then *i* must be related via the property *number* to an integer between
*0* and *5000* (inclusive). In ontology A, the individual *MyProject* is
not known to be an instance of *Project* so the constraint does not
apply and the ontology is valid. In B, *MyProject* is an instance of
*Project* but is not known to have any data assertions via *number* so A
is invalid. In C, *MyProject* does have a data property assertion via
*number* but the literal *"23"* is untyped (not an integer) therefore
the ontology is invalid. In D, *MyProject* is related to an integer via
*number* but it is out of the range so the ontology is invalid. Finally,
in E, *MyProject* is related to the integer *23* which is in the range
of *[0,5000]* so this ontology is valid.

### Cardinality Constraints

These constraints control the number of various relationships or
property values.

#### Employees mustn't work on more than 3 projects

Constraint

    Class: Employee
    SubClassOf: works_on max 3 Project

A

    Individual: Bob

Valid

B

    Individual: Bob
    Types: Employee
    Facts: works_on MyProject

    Individual: MyProject
    Types: Project

Valid

C

    Individual: Bob
    Types: Employee
    Facts: works_on MyProject, works_on MyProjectFoo, works_on MyProjectBar,
           works_on MyProjectBaz

    Individual: MyProject
    Types: Project

    Individual: MyProjectFoo
    Types: Project

    Individual: MyProjectBar
    Types: Project

    Individual: MyProjectBaz
    Types: Project

Invalid

This constraint says that if an RDF instance *i* is an *Employee*, then
*i* must not be related via the property *works\_on* to more than 3
named individuals of class *Project*. In ontology A, *Bob* is not known
to be an instance of *Employee* so the constraint does not apply and the
ontology is valid. In B, *Bob* is an instance of *Employee* but is known
to work on only a single project, namely *MyProject*, so the ontology is
valid. In C, *Bob* is related to 4 named individuals of class *Project*
(namely, *MyProject*, *MyProjectFoo*, *MyProjectBar*, and
*MyProjectBaz*) via *works\_on*. Due to the weak UNA these individuals
are considered distinct so the ontology is invalid.

#### Departments must have at least 2 employees.

Constraint

    Class: Department
    SubClassOf: inverse(works_in) min 2 Employee

A

    Individual: MyDepartment

Valid

B

    Individual: MyDepartment
    Types: Department

    Individual: Bob
    Types: Employee
    Facts: works_in MyDepartment

Invalid

C

    Individual: MyDepartment
    Types: Department

    Individual: Bob
    Types: Employee
    Facts: works_in MyDepartment

    Individual: Alice
    Types: Employee
    Facts: works_in MyDepartment

Valid

This constraint says that if an RDF instance *i* is a *Department*, then
there should exist at least 2 instances *j* and *k* of class *Employee*
which are related to *i* via the property *works\_in* (or, equivalently,
*i* should be related to them via the inverse of *works\_in*). In
ontology A, the individual *MyDepartment* is not known to be an instance
of *Department* so the constraint does not apply and the ontology is
valid. In B, *MyDepartment* is an instance of *Department* but only one
instance of *Employee*, namely *Bob*, is known to work in it, so the
ontology is invalid. In C, *MyDepartment* is related to the individuals
*Bob* and *Alice*, which are both instances of *Employee* and (due to
the weak Unique Name Assumption that Stardog adopts for ICV), are
distinct, so the ontology is valid.

#### Managers must manage exactly 1 department.

Constraint

    Class: Manager
        SubClassOf: manages exactly 1 Department

A

    Individual: Isabella

Valid

B

    Individual: Isabella
        Types: Manager

Invalid

C

    Individual: Isabella
        Types: Manager
        Facts: manages MyDepartment

Invalid

D

    Individual: Isabella
        Types: Manager
        Facts: manages MyDepartment

    Individual: MyDepartment
        Types: Department

Valid

E

    Individual: Isabella
        Types: Manager
        Facts: manages MyDepartment, MyDepartment1

    Individual: MyDepartment
        Types: Department

    Individual: MyDepartment1
        Types: Department

Invalid

This constraint says that if an RDF instance *i* is a *Manager*, then it
must be related to exactly 1 instance of *Department* via the property
*manages*. In ontology A, the individual *Isabella* is not known to be
an instance of *Manager* so the constraint does not apply and the
ontology is valid. In B, *Isabella* is an instance of *Manager* but is
not related to any instances of *Department*, so the ontology is
invalid. In C, *Isabella* is related to the individual *MyDepartment*
via the property *manages* but *MyDepartment* is not known to be an
instance of *Department*, so the ontology is invalid. In D, *Isabella*
is related to exactly one instance of *Department*, namely
*MyDepartment*, so the ontology is valid. Finally, in E, *Isabella* is
related to 2 distinct (again, because of weak UNA) instances of
*Department*, namely *MyDepartment* and *MyDepartment1*, so the ontology
is invalid.

#### Entities must not have more than one name.

Constraint

    DataProperty: name
        Characteristics: Functional

A

    Individual: MyDepartment

Valid

B

    Individual: MyDepartment
        Facts: name "Human Resources"

Valid

C

    Individual: MyDepartment
        Facts: name "Human Resources", name "Legal"

Invalid

This constraint says that no RDF instance *i* can have more than 1
assertion via the data property *name*. In ontology A, the individual
*MyDepartment* does not have any data property assertions so A is valid.
In B, *MyDepartment* has a single assertion via *name*, so the ontology
is also invalid. In C, *MyDepartment* is related to 2 literals, namely
*"Human Resources"* and *"Legal"*, via *name*, so the ontology is
invalid.

### Property Constraints

These constraints control how instances are related to one another via
properties.

#### The manager of a department must work in that department.

Constraint

    ObjectProperty: manages
        SubPropertyOf: works_in

A

    Individual: Bob
        Facts: manages MyDepartment

Invalid

B

    Individual: Bob
        Facts: manages MyDepartment, works_in MyDepartment

Valid

This constraint says that if an RDF instance *i* is related to *j* via
the property *manages*, then *i* must also be related to *j* va the
property *works\_in*. In ontology A, *Bob* is related to *MyDepartment*
via *manages*, but not via *works\_in*, so the ontology is invalid. In
B, *Bob* is related to *MyDepartment* via both *manages* and
*works\_in*, so the ontology is valid.

#### Department managers must supervise all the department's employees.

Constraint

    ObjectProperty: is_supervisor_of
        SubPropertyChain: manages o inverse(works_in)

A

    Individual: Jose
        Facts: manages MyDepartment, is_supervisor_of Maria

    Individual: Maria
        Facts: works_in MyDepartment

    Individual: Diego
        Facts: works_in MyDepartment

Invalid

B

    Individual: Jose
        Facts: manages MyDepartment, is_supervisor_of Maria, is_supervisor_of Diego

    Individual: Maria
        Facts: works_in MyDepartment

    Individual: Diego
        Facts: works_in MyDepartment

Valid

This constraint says that if an RDF instance *i* is related to *j* via
the property *manages* and *k* is related to *j* via the property
*works\_in*, then *i* must be related to *k* via the property
*is\_supervisor\_of*. In ontology A, *Jose* is related to *MyDepartment*
via *manages*, *Diego* is related to *MyDepartment* via *works\_in*, but
*Jose* is not related to *Diego* via any property, so the ontology is
invalid. In B, *Jose* is related to *Maria* and *Diego*, who both are
related to *MyDepartment* via *works\_in*, via the property
*is\_supervisor\_of*, so the ontology is valid.

### Complex Constraints

These constraints are more complex, often including multiple conditions,
etc.

#### Employee Constraints

Each employee either works on at least one project, supervises at least
one employee that works on at least one project, or manages at least one
department.

Constraint

    Class: Employee
        SubClassOf: works_on some Project or
            supervises some (Employee and works_on some Project) or
            manages some Department

A

    Individual: Esteban
        Types: Employee

Invalid

B

    Individual: Esteban
        Types: Employee
        Facts: supervises Lucinda

    Individual: Lucinda
        Types: Employee

Invalid

C

    Individual: Esteban
        Types: Employee
        Facts: supervises Lucinda

    Individual: Lucinda
        Types: Employee
        Facts: works_on MyProject

    Individual: MyProject
        Types: Project

Valid

D

    Individual: Esteban
        Types: Employee
        Facts: manages MyDepartment

    Individual: MyDepartment
        Types: Department

Valid

E

    Individual: Esteban
        Facts: manages MyDepartment, works_on MyProject

    Individual: MyDepartment
        Types: Department

    Individual: MyProject
        Types: Project

Valid

This constraint says that if an individual *i* is an instance of
*Employee*, then at least one of three conditions must be met: First, it
is related to an instance of *Project* via the property *works\_on*.
Second, it is related to an instance *j* via the property *supervises*
and *j* is an instance of *Employee* and also related to some instance
of *Project* via the property *works\_on*. Third, it is related to an
instance of *Department* via the property *manages*.

Ontologies A and B are invalid because none of the conditions are met. C
meets the second condition: *Esteban* (who is an *Employee*) is related
to *Lucinda* via the property *supervises* whereas *Lucinda* is both an
*Employee* and related to *MyProject*, which is a *Project*, via the
property *works\_on*. D meets the third condition: *Esteban* is related
to an instance of *Department*, namely *MyDepartment*, via the property
*manages*. Finally, E meets the first and the third conditions because
in addition to managing a department *Esteban* is also related an
instance of *Project*, namely *MyProject*, via the property *works\_on*

#### Employees and US government funding

Only employees who are American citizens can work on a project that
receives funds from a US government agency.

Constraint

    Class: Project and receives_funds_from some US_Government_Agency
        SubClassOf: inverse(works_on) only (Employee and nationality value "US")

A

    Individual: MyProject
        Types: Project
        Facts: receives_funds_from NASA

    Individual: NASA
        Types: US_Government_Agency

Valid

B

    Individual: MyProject
        Types: Project
        Facts: receives_funds_from NASA

    Individual: NASA
        Types: US_Government_Agency

    Individual: Andy
        Types: Employee
        Facts: works_on MyProject

Invalid

C

    Individual: MyProject
        Types: Project
        Facts: receives_funds_from NASA

    Individual: NASA
        Types: US_Government_Agency

    Individual: Andy
        Types: Employee
        Facts: works_on MyProject, nationality "US"

Invalid

D

    Individual: MyProject
        Types: Project
        Facts: receives_funds_from NASA

    Individual: NASA
        Types: US_Government_Agency

    Individual: Andy
        Types: Employee
        Facts: works_on MyProject, nationality "US"

    Individual: Heidi
        Types: Supervisor
        Facts: works_on MyProject, nationality "US"

Invalid

E

    Individual: MyProject
        Types: Project
        Facts: receives_funds_from NASA

    Individual: NASA
        Types: US_Government_Agency

    Individual: Andy
        Types: Employee
        Facts: works_on MyProject, nationality "US"

    Individual: Heidi
        Types: Supervisor
        Facts: works_on MyProject, nationality "US"

    Class: Supervisor
        SubClassOf: Employee

Valid

This constraint says that if an individual *i* is an instance of
*Project* and is related to an instance of *US\_Government\_Agency* via
the property *receives\_funds\_from*, then any individual *j* which is
related to *i* via the property *works\_on* must satisfy two conditions:
First, it must be an instance of *Employee*. Second, it must not be
related to any literal other than *"US"* via the data property
*nationality*.

Ontology A is valid because there is no individual related to
*MyProject* via *works\_on*, so the constraint is vacuously satisfied.
Ontology B is invalid since *Andy* is related to *MyProject* via
*works\_on*, *MyProject* is an instance of *Project* and is related to
an instance of *US\_Government\_Agency*, that is, *NASA*, via
*receives\_funds\_from*, but *Andy* does not have any data property
assertions. C is valid because both conditions are met. D is not valid
because *Heidi* violated the first condition: she is related to
*MyProject* via *works\_on* but is not known to be an instance of
*Employee*. Finally, this is fixed in the ontology E which states that
every instance of *Supervisor* is an instance of *Employee*, so *Heidi*
is inferred to be an instance of *Employee* and, consequently, the
ontology is valid.

## Terminology

In the sections below, we explain the operational usage of Integrity
Constraint Validation (ICV) in Stardog: it may be easier for you to
understand if you read this section on terminology first.

### ICV, Integrity Constraint Validation

The process of checking whether some Stardog database is valid with
respect to some integrity constraints. The result of ICV is a boolean
value (true if valid, false if invalid) and, optionally, an *explanation
of constraint violations*.

### Schema, TBox

A schema (or "terminology box" a.k.a., TBox) is a set of statements that
define the relationships between data elements, including property and
class names, their relationships, etc. In practical terms, schema
statements for a Stardog database are RDF Schema and OWL 2 terms,
axioms, and definitions.

### Data, ABox

All of the triples in a Stardog database that aren't part of the schema
are part of the data (or "assertional box" a.k.a. ABox).

### Integrity Constraint

A declarative expression of some rule or constraint which data must
conform to in order to be valid. Integrity Constraints are typically
domain and application specific. They can be expressed in OWL 2 (any
legal syntax), SWRL rules, or (a restricted form of) SPARQL queries.

### Constraints

Constraints that have been associated with a Stardog database and which
are used to validate the data it contains. Each Stardog may optionally
have one and only one set of constraints associated with it.

### Closed World Assumption, Closed World Reasoning

Stardog ICV assumes a closed world with respect to data and constraints:
that is, it assumes that all relevant data is known to it and included
in a database to be validated. It interprets the meaning of Integrity
Constraints in light of this assumption; if a constraint says a value
*must* be present, the absence of that value is interpreted as a
constraint violation and, hence, as invalid data.

### Open World Assumption, Open World Reasoning

A legal OWL 2 inference may violate or satisfy an Integrity Constraint
in Stardog. In other words, you get to have your cake (OWL as a
constraint language) and eat it, too (OWL as modeling or inference
language). This means that constraints are applied to a Stardog database
*with respect to an OWL 2 profile*.

### Monotonicity

OWL is a monotonic language: that means you can never **add** anything to a
Stardog database that causes there to be **fewer** legal inferences. Or, put
another way, the only way to decrease the number of legal inferences is
to **delete** something.

Monotonicity interacts with ICV in the following ways:

1.  Adding data to or removing it from a Stardog database may make it
    invalid.
2.  Adding schema statements to or removing them from a Stardog database
    may make it invalid.
3.  Adding new constraints to a Stardog database may make it invalid.
4.  Deleting constraints from a Stardog database *cannot make it
    invalid*.
