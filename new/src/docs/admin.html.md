---
quote: "In man-machine symbiosis, it is man who must adjust: The machines can't."
title: "Admin"
layout: default
related: "..."
---

In this chapter we describe the administration of Stardog Server and
Stardog databases, including how to use the various
Stardog command-line programs and how to configure a Stardog Server and
its databases. An important part of Stardog administration is security,
which is discussed in a separate [chapter](../security).

## Command Line Interface

Stardog's command-line interface (CLI) comes in two parts:

1. `stardog-admin`: admininstrative client (uses HTTP or SNARL)
2. `stardog`: a user's client (uses HTTP or SNARL)

The admin and user's tools operate on local or remote databases, using
either HTTP or SNARL Protocols. Both of these CLI tools are Unix-only,
are self-documenting, and the help output of these tools is their
canonical documentation.

The CLI tools were completely rewritten for Stardog 1.2: online
documentation, including examples, is much more extensive; and the
commands and their arguments are rationalized and consistent. The
documentation of these tools in this chapter goes into more detail,
offers background, etc. But if there is a conflict between this
documentation and the output of the CLI tools' `help` command, the CLI
tools' output is correct.

### Help

To use the Stardog CLI tools, you can start by asking them to display
help:

    $ stardog help

Or:

    $ stardog-admin help

And for the very laziest among us, these work too:

    $ stardog

    $ stardog-admin

### Security Considerations

The rationale for separating functionality into two CLI programs is
largely based on security, since `stardog-admin` will need, in
production environments, to have considerably tighter access
restrictions than `stardog`.

> **SECURITY NOTICE**: For usability, Stardog <t>version</t> provides a
> default user "admin" and password "admin" in `stardog-admin` commands
> if no user or password are given. This is obviously **not secure**;
> before any serious use of Stardog is contemplated, read the
> [security](../security) chapter at least twice, and
> then—minimally—change the administrative password to something we
> haven't published on the interwebs!

### Command Groups

The CLI tools both contain a lot of functionality; we've introduced
"command groups" to make CLI subcommands easier to find. To print help
for a particular command group, just ask for help:

    $ stardog help [command_group_name]

The command groups and their subcommands include

- data: add, remove, export;
- query: search, execute, explain, status;
- reasoning: explain, consistency; namespace: add, list, remove;
- server: start, stop;
- metadata: get, set;
- user: add, drop, edit, grant, list, permission, revoke, passwd;
- role: add, drop, grant, list, permission, revoke;
- db: copy, create, drop, migrate, optimize, list, online, offline.

The main help command for either CLI tool will print a listing of the
command groups:

    usage: stardog  []

    The most commonly used stardog commands are:
        data        Commands which can modify or dump the contents of a database
        help        Display help information
        icv         Commands for working with Stardog Integrity Constraint support
        namespace   Commands which work with the namespaces defined for a database
        query       Commands which query a Stardog database
        reasoning   Commands which use the reasoning capabilities of a Stardog database
        version     Prints information about this version of Stardog

    See 'stardog help ' for more information on a specific command.

To get more information about a particular command, simply issue the
help command for it including its command group:

    $ stardog help query execute

Finally, everything here about command groups, commands, and online help
works equally well for `stardog-admin`.

The result of all these changes is a better user experience:

    $ stardog reasoning consistency -u myUsername -p myPassword -r QL myDB

    $ stardog-admin db migrate -u myUsername -p myPassword myDb

### Autocomplete

Stardog 1.2 also includes support for CLI autocomplete via the bash
autocomplete feature. To install autocomplete for bash shell, you'll
first want to make sure bash completion is installed:

#### Homebrew

    $ brew install bash-completion

Then enable it in .bash\_profile:

    if [ -f `brew --prefix`/etc/bash_completion ]; then
    . `brew --prefix`/etc/bash_completion
    fi

#### MacPorts

First, you really should be using Homebrew; you feel me?

If not, then:

    $ sudo port install bash-completion

Enable it in .bash\_profile:

    if [ -f /opt/local/etc/bash_completion ]; then
        . /opt/local/etc/bash_completion
    fi

Finally, an example for our Linux friends:

#### Ubuntu

    $ sudo apt-get install bash-completion

#### Fedora

    $ sudo yum install bash-completion

#### All Platforms

Now put the Stardog autocomplete script—`stardog-completion.sh`—into yr
bash\_completion.d directory, typically one of
`/etc/bash_completion.d, /usr/local/etc/bash_completion.d or ~/bash_completion.d.`

Alternately you can put it anywhere you want, but tell `.bash_profile`
about it:

    source ~/.stardog-completion.sh

### How to Make a Connection String

We've simplified connection strings in Stardog 1.2 to improve usability.
A connection string may consist solely of the database name in cases
where (a) Stardog is running on the standard ports; (b) SNARL is
enabled; and (c) the command is invoked on the same machine where the
server is running. In any other cases, a "fully qualified" connection
string, as described below, is required.

Additionally, we've rationalized the method of specifying the connection
string: instead of using the `-c` option in a command, the connection
string is now assumed to be the first argument of the command.

Some CLI subcommands require a Stardog connection string as an argument
to identify the server and database upon which operations are to be
performed. Connection strings are URLs and may either be local to the
machine where the CLI is run or they may be on some other remote
machine. There are two URL schemes recognized by Stardog: `http://` and
`snarl://`. The former uses Stardog's (extended) version of SPARQL
Protocol; the latter uses Stardog's native data access protocol, called
SNARL, which is based on Google's Protocol Buffers.

As of Stardog 1.2, in `stardog-admin` the `--server` option for setting
the default server is a global arg.

Note: `stardog-admin` and `stardog` user's client works with HTTP or
SNARL Protocol, interchangeably.SNARL is faster than HTTP in cases where
payloads to and from the server are relatively *small*; for payloads
that are large, raw transfer time dominates and there isn't much or any
difference in performance.

### Example Connection Strings

To make a connection string, you need to know the URL scheme; the
machine name and port the Stardog Server is running on; any (optional)
URL path to the database (it's very unlikely you'll need this); and the
name of the database:

    {scheme}{machineName}:{port}/{databaseName};{connectionOptions}
    snarl://server/billion-triples-punk
    http://localhost:5000/myDatabase
    http://169.175.100.5:1111/myOtherDatabase;reasoning=QL
    snarl://stardog:8888/the_database
    snarl://localhost:1024/db1;reasoning=NONE

Using the default ports for SNARL and HTTP protocols simplifies
connection strings. `connectionOptions` are a series of `;` delimited
key-value pairs which themselves are `=` delimited. Key names must be
**lowercase** and their values are case-sensitive.

Finally, in the case where the scheme is SNARL, the machine is
"localhost", and the port is the default SNARL port, a connection string
may consist of the "databaseName" only.

## Stardog Server Administration

Stardog Server is multi-protocol beast: it supports both SNARL and HTTP
protocols. The default port for SNARL is **5820**; the default port for
HTTP is **5822**. **All administrative functions work over SNARL or HTTP
protocols.**

To use any of these commands against a remote server, pass a global
`--server` argument with an HTTP or SNARL URL.

**Note**: If you are running `stardog-admin` on the same machine where
Stardog Server is running, and you're using the default protocol ports,
then you can omit the `--server` argument and simply pass a database
name via `-n` option. Most of the following commands assume this case
for ease of exposition.

### Configuring Stardog Server

**Note**: the properties described in this section control the behavior
of the Stardog Server (whether HTTP or SNARL protocols are in use); to
set properties or other metadata on individual Stardog *databases*, see
[Administering a Database](#admin-database).

Stardog Server's behavior can be configured via the JVM arg
`stardog.home`, which sets Stardog Home, overriding the value of
`STARDOG_HOME` set as an environment variable. Stardog Server's behavior
can also be configured via a `stardog.properties`—which is a Java
Properties file—file in `STARDOG_HOME`. To change the behavior of a
running Stardog Server, it is necessary to restart it.

The following twiddly knobs for Stardog Server are available in
`stardog.properties`:

1.  `strict.parsing`: Controls whether Stardog parses RDF strictly
    (`true`, the default) or laxly (`false`)
2.  `query.all.graphs`: Controls what Stardog Server queries over; if
    `true`, it will query over the default graph and the union of all
    named graphs; if `false` (the default), it will query only over the
    default graph.
3.  `query.timeout`: Sets the upper bound for query execution time
    that's inherited by all databases unless explicitly overriden. See
    [Query Management](#manage-queries) section below for details.
4.  `logging.[access,audit].[enabled,type,file]`: Controls whether and
    how Stardog logs server events; described in detail below.
5.  `logging.slow_query.enabled`
6.  `logging.slow_query.time`
7.  `logging.slow_query.type`: The three slow query logging options are
    used in the following way. To enable logging of slow queries, set
    `enabled` to `true`. To define what counts as a "slow" query, set
    `time` to a time duration value (positive integer plus "h", "m",
    "s", or "ms" for hours, minutes, seconds, or milliseconds
    respectively). To determine the type of logging, set `type` to
    `text` (the default) or `binary`. **To state the obvious explicitly,
    a `logging.slow_query.time` that exceeds the value of
    `query.timeout` will result in null logs.**
8.  `database.connection.timeout.ms`: Controls how long, in
    milliseconds,connections may idle before being automatically closed
    by the server.
9.  `http.max.connections`: The next two parameters control the maximum
    number of simultaneous connections for a client; for more
    information, see the [relevant Apache
    docs](%20http://hc.apache.org/httpcomponents-client-ga/tutorial/html/connmgmt.html).
10. `http.max.get.query.length`: The length in characters of the longest
    SPARQL query that will be serialized via HTTP `GET`; queries longer
    are serialized via `POST`.
11. `bnode.preserve.id`: Determines how the Stardog parser handles bnode
    identifiers that may be present in (some) RDF input. If this
    property is enabled (i.e., `TRUE`), parsing and data loading
    performance are improved; but the other effect is that if distinct
    input files use (randomly or intentionally) the same bnode
    identifier, that bnode will point to one and the same node in the
    database. If you have input files that use explicit bnode
    identifiers, and multiple files may use the asame bnode idenitifers,
    and you don't want those bnodes to be smushed into a single node in
    the database, then this configuration option should be disabled (set
    to `FALSE`).

### Starting & Stopping the Server

**Note**: Unlike the other `stardog-admin` subcommands, starting and
stopping the server may only be run locally, i.e., on the same machine
as Stardog Server will run on.

The simplest way to start the server—running on the default ports,
detaching to run as a daemon, and writing `stardog.pid` and
`stardog.log` to the current working directory— is

    $ stardog-admin server start

To specify parameters:

    $ stardog-admin server start --logfile=stardog.log --no-docs --http=8080

`--no-docs` will tell Stardog not to serve its documentation over HTTP
at `http://SERVER/docs`, which it will otherwise do by default.

Note: ports can be specified using the properties `--snarl` and
`--http`. The HTTP interface can be disabled by using the flag
`--no-http`; the SNARL interface may not be disabled.

To shut down the server:

    $ stardog-admin server stop

If you started stardog on a port other than the default, or want to shut
down a remote server, you can simply use the `--server` option to
specify the location of the server you wish to shut down

### Serving Stardog Documentation

By default, if you start Stardog Server with HTTP enabled, then Stardog
will serve the system documentation at `http://SERVER/docs` (which is
why "docs" is an invalid database name).

In a production deployment, you might want to disable documentation
serving, which you can do by passing `--no-docs` on server startup or by
disabling HTTP altogether.

### Locking Stardog Home

Stardog Server will lock `STARDOG_HOME` when it starts to prevent
synchronization errors and other nasties if you start more than one
Stardog Server with the same `STARDOG_HOME`. If you need to run more
than one Stardog Server instance, choose a different `STARDOG_HOME` or
pass a different value to `--home`.

### Access & Audit Logging

See `stardog.properties` for a complete discussion of how access and
audit logging work in Stardog Server. Basically, audit logging is a
superset of the events in access logging. Access logging covers the most
commonly required logging events; you should consider enabling audit
logging if you really need to log *every* every server event. Logging
generally doesn't have a statistically significant impact on
performance; but the safest way to insure that is the case is to log to
a separate disk (or to a centralized logging server altogether, etc.).

The important configuration choices are whether logs should be binary or
plain text (both based on ProtocolBuffer message formats); the type of
logging (audit or access); the logging location (which may be "off disk"
or even "off machine") Logging to a centralized logging facility
requires a Java plugin that implements the Stardog Server logging
interface; see the [Java Chapter](../java/) for more information; and
the log rotation policy (file size or time).

Slow query logging is also available. See the "Managing Queries" section
below.

## Administering Databases

Stardog is a multi-tenancacy system and will happily provide access to
multiple, distinct, disjoint databases.

### Configuring a Database

To administer a Stardog database, some config options must be set at
creation time; others may be changed subsequently and some may never be
changed. All of the config options have sensible defaults (except,
obviously, for database name), so you don't have to twiddle any of the
knobs till you really need to.

### Configuration Options

The following are the legal configuration options for a Stardog
database:

database.name

A legal database name.

database.online

The status of the database: online or offline. It may be set so that the
database is created initially in online or offline status; subsequently,
it can't be set directly but only by using the relevant admin commands.

icv.active.graphs

Specifies which part of the database, in terms of named graphs, is
checked with IC validation. Set to `tag:stardog:api:context:all` to
validate all the named graphs in the database.

icv.enabled

Determines whether ICV is active for the database; if true, all database
mutations are subject to IC validation (i.e., "guard mode").

icv.reasoning-type

Determines what "reasoning level" is used during IC validation.

index.differential.enable.limit

Sets the minimum size of the Stardog database before differential
indexes are used.

index.differential.merge.limit

Sets the size in number of RDF triples before the differential indexes
are merged to the main indexes.

index.literals.canonical

Enables RDF literal canonicalization. See [literal
canonicalization](../java/snarl/com/clarkparsia/stardog/index/IndexOptions.html#CANONICAL_LITERALS)
for details.

index.named.graphs

Enables optimized index support for named graphs; speeds SPARQL query
evaluation with named graphs at the cost of some overhead for database
loading and index maintenance.

index.persist

Enables persistent indexes.

index.persist.sync

Enables whether memory indexes are synchronously or asynchronously
persisted to disk with respect to a transaction.

index.statistics.update.automatic

Sets whether statistics are maintained automatically.

index.type

Sets the index type (memory or disk).

reasoning.consistency.automatic

Enables automatic consistency checking with respect to a transaction.

reasoning.punning.enabled

Enables punning.

reasoning.schema.graphs

Determines which, if any, named graph or graphs contains the "tbox",
i.e., the schema part of the data.

search.enabled

Enables semantic search on the database.

search.reindex.mode

Sets how search indexes are maintained.

transactions.durable

Enables durable transactions.

#### A Note About Database Status

A database must be set to `offline` status before most configuration
parameters may be changed. So the routine is to set the database
offline, change the parameters, and then set the database to online. All
of these operations may be done programmatically from CLI tools, such
that they can be scripted in advance to minimize downtime. In a future
version, we will allow some properties to be set while the database
remains online.

#### Summary of Configuration Options

The following table summarizes the options:

| Config Option | Mutability    | Default| API    |
| ------------  |:-------------:| -----: | foo    |
| col 3 is      | right-aligned | $1600  | bar    |
| col 2 is      | centered      |   $12  | **baz**|
| zebra stripes | are neat      |    $1  | bap    |



Config Option

Mutability

Default

API

Config Option

Mutability

Default

API

database.name

false

{NO DEFAULT}

[DatabaseOptions.NAME](../java/snarl/com/clarkparsia/stardog/DatabaseOptions.html#NAME)

database.online

falseThis may be set at creation time so that the database is created in
offline or online status; but it may not be subsequently changed
directly, except by using the admin tools to move the database on- or
offline.

true

[DatabaseOptions.ONLINE](../java/snarl/com/clarkparsia/stardog/DatabaseOptions.html#ONLINE)

icv.active.graphs

false

default

[DatabaseOptions.ICV\_ACTIVE\_GRAPHS](../java/snarl/com/clarkparsia/stardog/DatabaseOptions.html#ICV_ACTIVE_GRAPHS)

icv.enabled

true

false

[DatabaseOptions.ICV\_ENABLED](../java/snarl/com/clarkparsia/stardog/DatabaseOptions.html#ICV_ENABLED)

icv.reasoning.type

true

NONE

[DatabaseOptions.ICV\_REASONING\_TYPE](../java/snarl/com/clarkparsia/stardog/DatabaseOptions.html#ICV_REASONING_TYPE)

index.differential.enable.limit

true

1000000

[IndexOptions.DIFF\_INDEX\_MIN\_LIMIT](../java/snarl/com/clarkparsia/stardog/index/IndexOptions.html#DIFF_INDEX_MIN_LIMIT)

index.differential.merge.limit

true

10000

[IndexOptions.DIFF\_INDEX\_MAX\_LIMIT](../java/snarl/com/clarkparsia/stardog/index/IndexOptions.html#DIFF_INDEX_MAX_LIMIT)

index.literals.canonical

false

true

[IndexOptions.CANONICAL\_LITERALS](../java/snarl/com/clarkparsia/stardog/index/IndexOptions.html#CANONICAL_LITERALS)

index.named.graphs

false

true

[IndexOptions.INDEX\_NAMED\_GRAPHS](../java/snarl/com/clarkparsia/stardog/index/IndexOptions.html#INDEX_NAMED_GRAPHS)

index.persist

true

false

[IndexOptions.PERSIST](../java/snarl/com/clarkparsia/stardog/index/IndexOptions.html#PERSIST)

index.persist.sync

true

true

[IndexOptions.SYNC](../java/snarl/com/clarkparsia/stardog/index/IndexOptions.html#SYNC)

index.statistics.update.automatic

true

true

[IndexOptions.AUTO\_STATS\_UPDATE](../java/snarl/com/clarkparsia/stardog/index/IndexOptions.html#AUTO_STATS_UPDATE)

index.type

false

Disk

[IndexOptions.INDEX\_TYPE](../java/snarl/com/clarkparsia/stardog/index/IndexOptions.html#INDEX_TYPE)

reasoning.consistency.automatic

true

false

[DatabaseOptions.CONSISTENCY\_AUTOMATIC](../java/snarl/com/clarkparsia/stardog/DatabaseOptions.html#CONSISTENCY_AUTOMATIC)

reasoning.punning.enabled

false

false

[DatabaseOptions.PUNNING\_ENABLED](../java/snarl/com/clarkparsia/stardog/DatabaseOptions.html#PUNNING_ENABLED)

reasoning.schema.graphs

true

default

[DatabaseOptions.SCHEMA\_GRAPHS](../java/snarl/com/clarkparsia/stardog/DatabaseOptions.html#SCHEMA_GRAPHS)

search.enabled

false

false

[DatabaseOptions.SEARCHABLE](../java/snarl/com/clarkparsia/stardog/DatabaseOptions.html#SEARCHABLE)

search.reindex.mode

false

wait

[DatabaseOptions.SEARCH\_REINDEX\_MODE](../java/snarl/com/clarkparsia/stardog/DatabaseOptions.html#SEARCH_REINDEX_MODE)

transactions.durable

true

false

[DatabaseOptions.TRANSACTIONS\_DURABLE](../java/snarl/com/clarkparsia/stardog/DatabaseOptions.html#TRANSACTIONS_DURABLE)

#### Legal Values of Configuration Options

The following options take a boolean value:
`database.online, icv.enabled, index.literals.canonical, index.named.graphs, index.persist, index.sync, index.statistics.update.automatic, reasoning.consistency.automatic, reasoning.punning.enabled, search.enabled, transactions.durable`.

The legal value of `database.name` is given by the regular expression
`[A-Za-z]{1}[A-Za-z0-9_-]`.

The legal value of `icv.active.graphs` is a list of named graph
identifiers. See `reasoning.schema.graphs` below for syntactic sugar
URIs for default graph and all named graphs.

The legal value of `icv.reasoning.type` is one of the reasoning levels
(i.e, one of the following strings): `NONE, RDFS, QL, RL, EL, DL`.

The legal value of `index.differential.*` is an integer.

The legal value of `index.type` is the string "disk" or "memory"
(case-insensitive).

The legal value of `reasoning.schema.graphs` is a list of named graph
identifiers, including (optionally) the special names,
`tag:stardog:api:context:default` and `tag:stardog:api:context:all`,
which represent the default graph and the union of all named graphs and
the default graph, respectively. In the context of database
configurations only, Stardog will recognize `default` and `*` as shorter
forms of those URIs, respectively.

The legal value of `search.reindex.mode` is one of the strings `sync` or
`async` (case insensitive) or a legal [Quartz cron
expression](http://www.quartz-scheduler.org/documentation/quartz-2.1.x/tutorials/crontrigger).

Managing Database Status
------------------------

Databases are either online or offline; this allows database maintenance
to be decoupled from server maintenance.

### Online and Offline

Databases are put online or offline synchronously: these operations
block until other database activity is completed or terminated. See
`stardog-admin help db` for details.

### Examples

To set a database from offline to online:

    $ stardog-admin db offline myDatabase

To set the database online:

    $ stardog-admin db online myDatabase

If Stardog Server is shutdown while a database is offline, the database
will be offline the next time the server starts.

Creating a Database
-------------------

Stardog databases may be created locally or remotely; but, of course,
performance is better if data files don't have to be transferred over a
network during creation and initial loading.See the section below about
loading compressed data. All data files, indexes, and server metadata
for the new database will be stored in Stardog Home. Stardog won't
create a database with the same name as an existing database.Stardog
database names must conform to the regular expression,
`[A-Za-z]{1}[A-Za-z0-9_-] `.

**Note: there are three reserved words that may not be used for the
names of Stardog databases:** `system`, `admin`, and `docs`.

Minimally, the only thing you must know to create a Stardog database is
a database *name*; alternately, you may customize some other database
parameters and options depending on anticipated workloads, data
modeling, and other factors.

See `stardog-admin help db create` for all the details includin
examples.

### Persisting and Managing Namespace Prefix Bindings

SPARQL queries can become verbose because of the (often redundant)
`PREFIX` declarations in the prologue of each query. Stardog allows
database administrators to persist and manage custom namespace prefix
bindings, which works in the following way:

1.  At database creation time, if data is loaded to the database that
    contains namespace prefixes, then those are persisted for the life
    of the database. Any subsequent queries to the database may simply
    omit the `PREFIX` declarations:

        $ stardog query myDB "select * {?s rdf:type owl:Class}"

2.  To add new bindings, use the `namespace` subcommand in the CLI:

        $ stardog namespace add myDb --prefix ex --uri 'http://example.org/test#'

3.  To modify an existing binding, delete the existing one and then add
    a new one:
4.  Finally, to see all of the existing namespace prefix bindings:

        $ stardog namespace list myDB

If no files are used during database creation, or if the files do not
define any prefixes (e.g. NTriples), then the "Big Four" default
prefixes are stored: RDF, RDFS, XSD, and OWL.

When executing queries in the CLI, the default table format for SPARQL
`SELECT` results will use the bindings as qnames. SPARQL `CONSTRUCT`
query output (including export) will also use the stored prefixes.

To reiterate, namespace prefix bindings are *per database*, not global.

### Database Creation Templates

As a boon to the overworked admin or devops peeps, Stardog Server
supports a feature we call "database creation templates", which is to
say that you can pass a Java Properties file with config values set and
with the values (typically just the database name) that are unique to a
specific database passed in CLI parameters.

### Examples

To create a new database with the default options by simply providing a
name and a set of initial datasets to load:

    $ stardog-admin db create -n myDb input.ttl another_file.rdf moredata.rdf.gz

Datasets can be loaded later as well, though bulk loading at creation
time is the fastest way to load data.

To create (in this case, an empty) database from a template file:

    $ stardog-admin db create -c database.properties

At a minimum, the configuration file must have a value for
`database.name` option.

Finally, if you only want to change only a few configuration options you
can directly provide the values for these options in the CLI args as
follows:

    $ stardog-admin db create -n db -o icv.enabled=true icv.reasoning.type=QL -- input.ttl

Note that '--' is used in this case when -o is the last option to
delimit the value for -o from the files to be bulk loaded.

Please refer to the CLI help for more details of the `db create`
command.

### Options

Name

Description

Arg values

Default

Name

Description

Arg values

Default

`--durable`, `-d`

If present, sets all mutation operations to database as transactionally
durable; durability increases the cost of all mutation operations.In a
future release, we will allow durability to be overriden or enabled in
connection strings, rather than set once-for-all at database creation
time.

`False`

`--guard`, `-g arg`

Specifies that ICV guard mode should enabled for this database.
Transactional writes to database that are invalid with respect to
constraints will fail.

`OFF` disables guard mode; a reasoning typeOne of "QL", "EL", "RL",
"RDFS", or "NONE". enables it.

Disabled

`--type`, `-t`

Specifies the kind of database to be created: Memory or Disk.

`M`,`D`

Disk

`--searchable`, `-s`

Specifies this database should be searchable.

None

`--index-triples-only`, `-i`

Specifies this database's indexes should be optimized for RDF triples
(as opposed to quads) only

[it's a flag and takes no args]

Options for the Stardog `create` command.

### Index Strategies

By default Stardog builds extra indexes for named graphs. These
additional indexes are used when SPARQL queries specify datasets using
`FROM` and `FROM NAMED`. With these additional indexes, better
statistics about named graphs are also computed.

Stardog may also be configured to create and to use fewer indexes, if
the database is only going to be used to store RDF triples, that is,
will not be used to store named graph information. In this mode, Stardog
will maintain fewer indexes, which will result in faster database
creation and faster updates without compromising query answering
performance. In such databases, quads (that is: triples with named
graphs or contexts specified) may still be added to these database at
any time, but query performance may degrade in such cases.

To create a database which indexes only RDF triples, set the option
`index.named.graphs` to `false` at database creation time. The CLI
provides a shorthand option—`-i` or `--index-triples-only`—which is
equivalent.

Please note that this option can only be set at database creation time
and cannot be changed later without rebuilding the database, so use this
option with caution.

### Differential Indexes

While Stardog is generally biased in favor of read (i.e., query)
performance, write performance is also important in many applications.
In order to increase write performance, Stardog may be used, optionally,
with a *differential index*.

Stardog's differential index is used to persist additions and removals
separately from the main indexes, such that updates to the database can
be performed faster. Query answering takes into consideration all the
data stored in the main indexes and the differential index; hence, query
answers are computed as if all the data is stored in the main indexes.

There is a slight overhead for query answering with differential indexes
if the differential index size gets too large. For this reason, the
differential index is merged into the main indexes when its size reaches
the `DIFF_INDEX_MAX_LIMIT`. There is no benefit of differential indexes
if the main index itself is small. For this reason, the differential
index is not used until the main index size reaches
`DIFF_INDEX_MAX_LIMIT`.

In most cases, the default value of the `DIFF_INDEX_MAX_LIMIT` parameter
will work fine and doesn't need to be changed.The corollary of this
claim is that you shouldn't change this value in a production system
till you've tested the effects of a change in a non-production system.

Using Compressed Data
---------------------

Stardog supports loading data from compressed files directly so there is
no need to uncompress files before loading. Compressed input is actually
typically faster to load since it minimizes disk access so the
recommended way to load large input files is to load them in compressed
format.

Stardog supports GZIP and ZIP compressions natively. If a file name
passed to create or add commands (through CLI or API) will be
interpreted to be a gzip file if the file name ends with '.gz'. The RDF
format of the file is determined by the extension that comes before
'.gz'. So, if a file named 'test.ttl.gz' is used as input, Stardog will
perform gzip decompression during loading and parse the file with Turtle
parser. All the formats supported by Stardog (RDF/XML, Turtle, Trig,
etc.) can be used with gzip compression.

The zip support works differently since zipped files can contain
multiple files inside. When an input file name ends with '.zip', Stardog
performs zip decompression and tries to load all the files inside the
zip file. The RDF format of the files inside the zip file is determined
by their file names as usual. If there is an unrecognized file extension
(e.g. '.txt') that file will be skipped.

Dropping a Database
-------------------

This command removes a database and all associated files and metadata.
This means all files on disk pertaining to the database will be deleted,
so only use `drop` when you're certain! Databases must be offline in
order to be dropped.

It takes as its only argument a valid database name. For example,

    $ stardog-admin db drop my_db

Using Integrity Constraint Validation
-------------------------------------

Stardog supports integrity constraint validation as a data quality
mechanism via closed world reasoning. Constraints can be specified in
OWL, SWRL, and SPARQL.

Please see the [ICV chapter](../sdp) for more about using ICV in Stardog
programmatically.

The CLI `icv` subcommand can be used to add, delete, or drop all
constraints from an existing database. It may also be used to validate
an existing database with constraints that are passed into the `icv`
subcommand; that is, using different constraints than the ones already
associated with the database.

For details of ICV usage, see `stardog help icv` and
`stardog-admin help icv`.

For ICV in transacted mutations of Stardog databases, see the database
creation section above.

Migrating a Database
--------------------

The `migrate` subcommand migrates an older Stardog database to the
latest version of Stardog. Its only argument is the name of the database
to migrate. `migrate` won't necessarily work between arbitrary Stardog
version, so before upgrading check the release notes for a new version
carefully to see whether migration is required or possible.

    $ stardog-admin db migrate myDatabase

will update `myDatabase` to the latest database format.

Getting Database Information
----------------------------

You can get some information about a database (online/offline status,
creation time, last modification time, etc.) by running the following
command:

    $ stardog-admin get my_db_name

This will return all the metadata stored about the database, including
the values of configuration options used for this database instance. If
you want to get the value for a specific option then you can run the
following command:

    $ stardog-admin get -o index.named.graphs my_db_name

Managing Queries
----------------

Stardog includes the capability to manage running queries according to
configurable policies set at run-time; this capability includes support
for

-   **listing** running queries;
-   **deleting** running queries;
-   **reading** the status of a running query;
-   **killing** running queries that exceed a time threshold
    automatically;
-   **logging** slow queries for analysis.

Stardog is pre-configured with sensible *server-wide* defaults for query
management parameters; these defaults may be overridden or disabled per
database.

### Configuring Query Management

For many uses cases the default configuration will be sufficient. But
you may need to tweak the timeout parameter to be longer or shorter,
depending on the hardware, data load, queries, throughput, etc. The
default configuration has a server-wide query timeout value of
`query.timeout`, which is inherited by all the databases in the server.
You can customize the server-wide timeout value and then set
per-database custom values, too. Any database without a custom value
inherits the server-wide value. To disable query timeout, set
`query.timeout` to `0`.

### Command-line Tools

The query management command-line tools are simple and easy to use.

#### Listing Queries

To see all running queries, use the `query list` subcommand:

    $ stardog-admin query list

The results are formatted tabularly:

    +----+----------+-------+--------------+
    | ID | Database | User  | Elapsed time |
    +----+----------+-------+--------------+
    | 2  | test     | admin | 00:00:20.165 |
    | 3  | test     | admin | 00:00:16.223 |
    | 4  | test     | admin | 00:00:08.769 |
    +----+----------+-------+--------------+

    3 queries running

You can see the user who owns the query (superuser's can see all running
queries), as well as the elapsed time and the database against which the
query is running. The ID column is the key to deleting queries.

#### Deleting Queries

To delete a running query, simply pass its ID to the `query kill`
subcommand:

    $ stardog-admin query kill 3

The output confirms the query kill completing successfully:

    Query 3 killed successfully

#### Automatically Killing Queries

For production use, especially when a Stardog database is exposed to
arbitrary query input, some of which may not execute in an acceptable
time period, the automatic query killing feature is useful. It will
protect a Stardog Server from queries consuming too many resources.

Once the execution time of a query exceeds the value of `query.timeout`,
the query will be killed automatically. The client that submitted the
query will receive an error message. The value of `query.timeout` may be
overriden by setting a different value (smaller or longer) in database
options. To disable, set to `query.timeout` to `0`.

The value of `query.timeout` is a positive integer concated with a
letter, all of which is interpreted as a time duration: 'h' (for hours),
'm' (for minutes), 's' (for seconds, )or 'ms' (for milliseconds). For
example, '1h' for 1 hour, '5m' for 5 minutes, '90s' for 90 seconds, and
'500ms' for 500 milliseconds.

The default, out-of-the-box value of `query.timeout` is five minutes.

#### Query Status

To see more detail about one running query, use the `query status`
subcommand:

    $ stardog-admin query status 1

The resulting output includes query metadata, including the query
itself:

    Username: admin
    Database: test
    Started : 2013-02-06 09:10:45 AM
    Elapsed : 00:01:19.187
    Query   :
    select ?x ?p ?o1 ?y ?o2
    where {
      ?x ?p ?o1.
      ?y ?p ?o2.
      filter (?o1 > ?o2).
    }
    order by ?o1
    limit 5

### Slow Query Logging

Stardog does not log slow queries in the default configuration,
primarily because there isn't a sensible default meaning of "slow
query", which is entirely relative to queries, access patterns, dataset
sizes, etc. While slow query logging has very minimal overhead, what
counts as a slow query in some context may be quite acceptable in
another. To enable slow query logging, see the Stardog Server Properties
discussion above.

### Protocols and Java API

For HTTP protocol support, see [Stardog's
Apiary](http://docs.stardog.apiary.io/) docs.

For Java, see [Stardog Javadocs](http://stardog.com/docs/java/snarl/).

### Security and Query Management

The security model for query management is very simple: any user can
kill any running query submitted by that user; a superuser can kill any
running query. The same general restriction is applied to query status;
you cannot see query status for a query you do not own, either as a
non-superuser or as superuser.

Configuring Security
====================

See the [Security Chapter](../security) for information about Stardog's
security system, secure deployment patterns, and more.

Managing Search Indexes
=======================

Maintaining Search Indexes
--------------------------

Stardog's search service is described in the [Using Stardog](../using)
chapter.

But managing the reindexing of search indexes is an administrative task.

There are three modes for reindexing indexes:

1.  `sync`: Recompute the search index synchronously with a transacted
    write.
2.  `async`: Recompute the search index asynchronously as soon as
    possible with respect to a transacted write.
3.  Scheduled: Use a [cron
    expression](http://www.quartz-scheduler.org/documentation/quartz-2.1.x/tutorials/crontrigger)
    to specify when the search index should be updated.

This is specified when creating a database by setting the property
`search.reindex.mode` to "sync", "async", or to a valid cron expression.
The default is "sync".

Recovering From Transaction Failures
====================================

In Stardog 1.2 we introduced a new transaction subsystem written from
scratch for use in Stardog. This transaction framework—which we call
"erg"—is mostly maintenance free; but there are some rare conditions in
which manual intervention may be needed.

Commit Failure Autorecovery
---------------------------

Stardog's strategy for recovering automatically from (the very unlikely
event of) commit failure is as follows:

-   Stardog will automatically roll back the transaction upon a commit
    failure;
-   Stardog automatically takes the affected database offline for
    maintenance;The probability of recovering from a catastrophic
    transaction failure is inversely proportional to the number of
    subsequent write attempts; hence, Stardog offlines the database to
    prevent subsequent write attempts and, hence, to increase the
    likelihood of recovery. then
-   Stardog will then begin recovery automatically, bringing the
    recovered database back online once that task is successful so that
    it can resume operations.

With an appropriate logging configuration for production usage (at least
error-level logging), log messages for the preceding recovery operations
will occur. If for whatever reason the database fails to be returned
automatically to online status, an administrator may use the CLI tools
(i.e., `stardog-admin db online`) to attempt to online the database.

Optimizing Bulk Data Loading
============================

Stardog tries hard to do bulk loading at database creation time in the
most efficient and scalable way possible. But data loading time can vary
widely, depending on factors in the data to be loaded, including the
number of unique resources, etc. Here are some tuning tips that may work
for you:

1.  Load [compressed data files](#compressed) since compression
    minimizes disk access
2.  Use a multicore machine since bulk loading is highly parallelized
    and indexes are built concurrently.
3.  Load multiple files together at creation time since different files
    will be parsed and processed concurrently improving the load speed
4.  Turn off [`strict.parsing`](#jvm-arg).
5.  If you are not using named graphs, use [triples only indexing
    strategy](#index-strategies)

Resource Requirements for Stardog
=================================

The three system resources used by Stardog are CPU, memory, and disk. In
what follows we primarily discuss memory and disk. Stardog will take
advantage of multiple CPUs, cores, and core-based threads in data
loading and in throughput-heavy or multi-user loads. And obviously
Stardog performance is influenced by the speed of CPUs and cores. But
some workloads are bound by main memory or by disk I/O (or both) more
than by CPU. In general, use the fastest CPUs you can afford with the
largest secondary caches and the most number of cores and core-based
threads of execution, especially in multi-user workloads.

The following subsections provides more detailed guidance for the memory
and disk resource requirements of Stardog.

Memory usage
------------

Stardog uses system memory aggressively and the total system memory
available to Stardog is typically the most important factor in
performance. Stardog uses both JVM memory (known as heap memory) and
also the operating system memory outside the JVM (known as non-heap
memory). Having more system memory available is always good; however,
increasing JVM memory too close to total system memory is not usually
prudent as it will tend to increase Garbage Collection (GC) time in the
JVM.

The following table shows minimum recommended JVM memory and system
memory requirements for Stardog:

Number of triples

JVM memory

System memory

10 million

2GB

4GB

100 million

3GB

8GB

1 billion

4GB

16GB

10 billion

8GB

64GB

Recommended memory resources for a Stardog database.

By default, Stardog CLI sets the maximum JVM memory to 2GB. This setting
works fine for most small to medium database sizes (up to 100 million
triples). As the database size increases, we recommend increasing JVM
memory. You can increase the JVM memory for Stardog by setting the
system property `STARDOG_JAVA_ARGS` using the standard JVM options. For
example, you can set this property to `"-Xms4g -Xmx4g"` to increase the
JVM memory to 4GB. We recommend setting the minimum heap size (`-Xms`
option) as close to the max heap size (`-Xmx` option) as possible.

Disk usage
----------

Stardog stores data on disk in a compressed format. The disk space
needed for a database depends on many factors besides the number of
triples, including the number of unique resources and literals in the
data, average length of resource identifiers and literals, and how much
the data is compressed. The following table shows average disk space
used by a Stardog database:

Number of triples

Disk space used

10 million

700MB - 1GB

100 million

7GB - 10GB

1 billion

70GB - 100GB

10 billion

700GB - 1TB

Average amount of disk space used by a Stardog database.

These numbers are given for information purposes and the actual disk
usage for a database may be significantly different in practice. Also it
is important to note that the amount of disk space needed at creation
time for bulk loading data is higher as several temporary files will be
created. The additional disk space needed at bulk loading time can be
40% to 70% of the final database size.

Disk space used by a database is non-trivially smaller if [triples only
indexing strategy](#index-strategies) is used. Triples-only indexing
reduces overall disk space used by 25% in average; however, please note
the tradeoff: SPARQL queries involving named graphs perform
significantly better with quads indexing.

The disk space used by Stardog is additive for multiple databases and
there is very little disk space used outside the databases. To calculate
the total disk space needed for multiple databases, one can simply sum
up the disk space needed by each database.

Using Stardog on Windows
========================

Stardog provides Windows batch (`.bat`) files for use on Windows; they
provide roughly the same set of functionality provided by the Bash
scripts which are used on \*nix systems. There are however, a few small
differences between the two. You cannot change the logfile with the
global `--logfile` option using the .bat scripts, it will always just
log to the console. Additionally, when you start a server with
`server start`, this does not detach to the background, it will run in
the current console.

To shut down the server correctly, you should either issue a
`server stop` command from another window, or press CTRL-C (and then
response 'Y' when asked to "Terminate batch job"). Do not under any
circumstance close the window without shutting down the server. This
will simply kill the process without shutting down Stardog which could
cause your database to be corrupted.

The .bat scripts for windows support our standard `STARDOG_HOME` and
`STARDOG_JAVA_ARGS` environment variables which can be used to control
where Stardog's database is stored and usually, how much memory is given
to Stardog's JVM when it starts. By default, the script will use the JVM
that is available in the directory from which Stardog is run via the
`JAVA_HOME` environment variable. If this is not set, it will simply
execute `java` from within that directory.

Running Stardog as a Windows Service
------------------------------------

You can run Stardog as a Windows Service using the following
configuration. Please, note, that the following assumes commands are
executed from a Command Prompt with administrative privileges:

### Installing the Service

Change the directory to the Stardog installation directory:

    cd c:\stardog-$VERSION

### Configuring the Service

The default settings with which the service will be installed are

-   2048 MB of RAM
-   `STARDOG_HOME` is the same as the installation directory
-   the name of the installed service will be "Stardog Service"
-   Stardog service will write logs to the "logs" directory within the
    installation directory

To change these settings, set appropriate environment variables:

-   `STARDOG_MEMORY`: the amount of memory in MB (e.g., set
    `STARDOG_MEMORY`=4096)
-   `STARDOG_HOME`: the path to `STARDOG_HOME` (e.g., set
    `STARDOG_HOME`=c:\\stardog-home)
-   `STARDOG_SERVICE_DISPLAY_NAME`: a different name to be displayed in
    the list of services (e.g., set
    `STARDOG_SERVICE_DISPLAY_NAME`=Stardog Service)
-   `STARDOG_LOG_PATH`: a path to a directory where the log files should
    be written (e.g., set `STARDOG_LOG_PATH`=c:\\stardog-logs)

Note: if you have changed the default administrator password, you also
need to modify `stop-service.bat` and specify the new username and
password there (by passing `-u` and `-p` parameters in the line that
invokes `stardog-admin server stop`). In one of the future releases, an
alternative solution will be provided that avoids the need to encode the
administrator's password in the file.

### Installing Stardog as a Service

Run the `install-service.bat` script.

At this point the service has been installed, but it is not running. To
run it, see the next section or use any Windows mechanism for
controlling the services (e.g., type `services.msc` on the command
line).

### Starting, Stopping, and Changing Service Configuration

Once the service has been installed, execute `stardog-serverw.exe`,
which will allow you to configure the service (e.g., set whether the
service is started automatically or manually), manually start and stop
the service, as well as to configure most of the service parameters.

### Uninstalling the Stardog Service

The service can be uninstalled by running `uninstall-service.bat`
script.