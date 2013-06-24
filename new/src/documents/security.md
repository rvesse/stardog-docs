[![](/_/img/sdog-bare.png)](/)

> **Every program has (at least) two purposes: the one for which it was
> written, and another for which it wasn't.**—Alan Perlis, Epigrams in
> Programming

Stardog Security {#title}
================

Stardog uses [Apache Shiro](http://shiro.apache.org/) for
authentication, authorization, and session management; for cryptography,
Stardog uses jBCrypt.

Security Model {#chapter}
==============

Stardog security model is based on standard role-based access control:
*users* have *permissions* over *resources*, permissions can be grouped
into *roles*, and roles can be assigned to users.

Resources
---------

A resource is some Stardog entity or service to which access is to be
controlled. Resources are identified by their *type* and their *name*. A
particular resource is denoted as `type_prefix:name`. The valid resource
types with their prefixes are shown below.

  Resource type             Prefix              Description
  ------------------------- ------------------- ---------------------------------------------------------------------------------------------------------------
  User                      `user`              Represents a user (e.g., `user:admin`)
  Role                      `role`              Represents a role that can be assigned to a user (e.g., `role:reader`)
  Database                  `db`                Represents a database (e.g., `db:myDB`)
  Database Metadata         `metadata`          Represents the metadata of a particular database (e.g., `metadata:myDB`)
  Database Administration   `admin`             Represents a special type of resource that is reserved for database administration tasks (e.g., `admin:myDB`)
  Integrity Constraints     `icv-constraints`   Represents the integrity constraints associated to a particular database (e.g., `icv-constraints:myDB`)

  : Resource Types for Stardog @@VERSION@@

Permissions
-----------

Permissions are composed of a *permission subject*, an *action*, and a
*permission object*, meaning that the subject resource can perform the
specified action over the object resource.

Permission subjects can be of type `user` or `role` only. Permission
objects can be of any valid type. Valid actions are shown as follows:

`read`
:   Permits reading the resource properties
`write`
:   Permits changing the resource properties
`create`
:   Permits creating new resources
`delete`
:   Permits deleting a resource
`grant`
:   Permits granting permissions over a resource
`revoke`
:   Permits revoking permissions over a resource
`execute`
:   Permits executing administration actions over a database
`all`
:   Special action type that permits all previous actions over a
    resource

### Wildcards

Stardog allows the use of wildcards to represent sets of resources. A
wildcard is denoted with the character `*`. Wildcards can be used to
create complex permissions; for instance, we can give a user the ability
to create any database by granting it a `create` permission over `db:*`.
Similarly, wildcards can be used in order to revoke multiple permissions
at the same time.

### Superusers

It is possible to specify that a given user is a superuser at creation
time. Being a superuser is equivalent to having been granted an `all`
permission over `*:*`. Therefore, as expected, superusers are allowed to
perform any valid action over any existing resource.

### Owner Permissions

When a user creates a resource, it is automatically granted `delete`,
`write`, `read`, `grant`, and `revoke` permissions over the new
resource. If the new resource is a database, then the user is
additionally granted `write`, `read`, `grant`, and `revoke` permissions
over `icv-constraints:theDatabase`, and `execute` permission over
`admin:theDatabase`. These two permissions give the creator of the
database the ability to administer the ICV constraints for the database
and administer the database itself.

Default Security Configuration
------------------------------

Out of the box, the Stardog security setup is minimal:

-   `user:admin` with password set to "admin" is a superuser.
-   `user:anonymous` with password "anonymous" has the "reader" role.
-   `role:reader` allows to `read` from any resource.

Security Management {#chapter}
===================

Stardog can be used to manage security resources (users, roles,
permissions, etc.) programmatically and via the CLI. In this section we
provide the corresponding permissions the user managing security
information must have.

Users
-----

Create a user
:   `create` permission over `user:*`. \
     Only superusers can create other superusers.
Delete a user
:   `delete` permission over the user.
Enable/Disable a user
:   User must be a superuser.
Change password of a user
:   User must be a superuser OR \
     user must be trying to change its own password.
Check if a user is a superuser
:   `read` permission over the user OR \
     user must be trying to get its own info
    .
Check if a user is enabled
:   `read` permission over the user OR \
     user must be trying to get its own info.
List users
:   Superusers can see all users. \
     Regular users can see only users over which they have a permission.

Roles
-----

Create a role
:   `create` permission over `role:*`.
Delete a role
:   `delete` permission over the role.
Assign a role to a user
:   `grant` permission over the role AND \
     user must have all the permissions associated to the role.
Unassign a role from a user
:   `revoke` permission over the role AND \
     user must have all the permissions associated to the role.
List roles
:   Superusers can see all roles. \
     Regular users can see only roles they have been assigned OR over
    which they have a permission.

Databases
---------

Create a database
:   `create` permission over `db:*`.
Delete a database
:   `delete` permission over `db:theDatabase`.
Add/Remove integrity constraints to a database
:   `write` permission over `icv-constraints:theDatabase`.
Verify a database is valid with respect to its integrity constraints
:   `read` permission over `icv-constraints:theDatabase`.
Online/Offline a database
:   `execute` permission over `admin:theDatabase`.
Migrate a database
:   `execute` permission over `admin:theDatabase`.
Optimize a database
:   `execute` permission over `admin:theDatabase`.
List databases
:   Superusers can see all databases. \
     Regular users can see only databases over which they have a
    permission.

Permissions
-----------

Grant a permission
:   `grant` permission over the permission object AND \
     user must have the permission that it is trying to grant.
Revoke a permission from a user or role over an object resource
:   `revoke` permission over the permission object AND \
     user must have the permission that it is trying to revoke.
List user permissions
:   User must be a superuser OR \
     user must be trying to get its own info.
List role permissions
:   User must be a superuser OR \
     user must have been assigned the role.

Deploying Stardog Securely {#chapter}
==========================

Securing Stardog in a Networked Environment
-------------------------------------------

To ensure that Stardog's RBAC access control implementation will be
effective, all non-administrator access to Stardog databases should
occur over network (i.e., non-native) database connections.In other
words, embedded or native Stardog access is inherently *insecure* and
should be used accordingly. To ensure the confidentiality of user
authentication credentials when using remote connections, the Stardog
server should only accept connections that are secured with SSL. This
section describes how Stardog can be configured to use SSL for data
confidentiality and server authentication. It does not address using SSL
for client authentication.Stardog @@VERSION@@ does not support client
authentication using X.509 certificates instead of passphrases.

### Configuring Stardog to use SSL

Stardog's HTTP server does not include support for SSL; it must be
deployed with other components to provide SSL support. The two primary
ways to accomplish such a deployment are both described below: HTTPS
reverse proxying; and SSL-enabled application server.

#### HTTPS Reverse Proxying

An HTTPS reverse proxyReverse proxying may be useful beyond SSL
layering—it may be used to distribute load across multiple Stardog
servers. For general documentation of reverse proxying with lighttpd,
see [the fine
documentation](http://redmine.lighttpd.net/wiki/lighttpd/Docs:ModProxy);
likewise for
[Apache](http://httpd.apache.org/docs/2.2/mod/mod_proxy.html#forwardreverse).
may be used to secure Stardog client-server connections if the Stardog
server is run using the command-line tool or deployed as a servlet. In
the following two sections, we describe how to use [Apache]() and
[lighttpd]() as HTTPS reverse proxies for Stardog. These configurations
can be used for new reverse proxy deployments or can be modified to
augment existing reverse proxies with SSL.Of course other solutions may
be used; these are illustrative of the general technique and approach.

In this deployment approach, the network connection between Stardog
clients and the proxy server is secured using SSL. But the connection
between the proxy server and Stardog server is insecure; thus, *care
should be taken to ensure that proxy-Stardog connections only occur over
trusted networks.* Note also that non-SSL connections to the Stardog
server from hosts other than the proxy server should be prohibited in
order to prevent network exposure of user credentials and data.Stardog's
default HTTP server listens on all host interfaces and accepts all
connections. If it is used, then a host-based firewall is necessary to
prohibit connections from servers other than the proxy server.

HTTPS reverse proxying depends on having a certificate and private key
on the proxy server. A cheap and easy deployment strategy is to use a
self-signed certificate. Creating such a certificate is documented
elsewhere adn not repeated here.For example, see [the
example](http://docs.oracle.com/javaee/1.4/tutorial/doc/Security6.html)
creating a certificate with the Java keytool; or [an
example](http://www.openssl.org/docs/apps/req.html) generating a self
signed root certificate using the openssl req tool. Alternatively, an
SSL cert can be obtained from a commercial certificate authority.

##### Reverse Proxy with lighttpd

[lighttpd](http://lighttpd.net) can be configured to provide an SSL
layer for remote connections. The following lighttpd configuration file
is a complete example that lets clients use HTTPS connections with the
lighttpd proxy to communicate with a Stardog HTTP server listening on
port 12345 of the lighttpd host.

    server.port = 443
    ssl.engine = "enable"
    ssl.pemfile = "server.pem"
    server.modules = ( "mod_proxy" )
    proxy.server = ( "" =>
            ( ( "host" => "127.0.0.1" , "port" => "12345" ) )
            )
    server.document-root = "/dev/null"

This configuration directs lighttpd to use the certificate and private
key in server.pem for SSL connections.lighttpd can be configured to
present chaining certificates with the server certificate. This may be
necessary if the server certificate is not directly signed by a trusted
authority, but chains to a trusted authority. For details on this
configuration see [the
docs](http://redmine.lighttpd.net/wiki/lighttpd/Docs:SSL) (the
ssl.ca-file option).

##### Reverse Proxy with Apache 2

Apache httpd can be configured to provide an SSL layer for remote
connections. The following partial configuration fileA complete
configuration file is not provided because the minimal configuration
file required by Apache is more detailed than the configuration file
required by lighttpd.The configuration directives shown are those
necessary to enable SSL and reverse proxying. allows clients to use
HTTPS connections with the Apache proxy, which communicates with a
Stardog HTTP server listening on port 12345 of the Apache host.

    SSLEngine        On
    SSLCertificateFile        server.pem
    <Directory />
            SSLRequireSSL
    </Directory>
    ProxyPass        /        http://127.0.0.1:12345/

This configuration depends on the SSL certificate and private key being
located in the `server.pem` file in the Apache server root. It also
depends on `mod_ssl`, `mod_proxy`, and `mod_proxy_http` modules being
compiled into the httpd binary or loaded via directives elsewhere in the
configuration file.

#### SSL-Enabled App Server

Of course Stardog may also be deployed as a servlet in a servlet
container or app server that can provide SSL support. For example, if
Stardog is deployed into a default Resin Server,See
[Resin](http://caucho.com/resin/) for more info; it supports SSL using
JSSE in the open source version and using OpenSSL in the professional
version. Resin’s SSL support is [well
documented](http://www.caucho.com/resin-4.0/admin/security-ssl.xtp).
then the following configuration would enable SSL on the server using
the certificate and private key stored in the Java KeyStore at
`server-keystore.jks`.

    <http address="*" port="443">
            <jsse-ssl>
                    <key-store-file>server-keystore.jks</key-store-file>
                    <password>********</password>
            </jsse-ssl>
    </http>

Other Java app servers support SSL including GlassFish, Tomcat, and
JBoss. The configuration of SSL for each application server is
implementation specific, so users should consult the relevant server’s
documentation.

### Configuring Stardog Client to use SSL

The Stardog HTTP client driver directly supports SSL when the `https:`
scheme is used in the database connection string. For example, the
following invocation of the Stardog command line utility will initiate
an SSL connection to a remote database

    $ stardog status -c https://stardog.example.org/sp2b_10k

If the client is unable to authenticate the server, then the connection
will fail and an error message like the following will be generated.

    Error during connect.  Cause was SSLPeerUnverifiedException: peer not authenticated

The most common cause of this error is that the server presented a
certificate that was not issued by an authority that the client trusts.
The Stardog HTTP client driver uses standard Java security components to
access a store of trusted certificates. By default, it trusts a list of
certificates installed with the Java runtime environment, but it can be
configured to use a custom trust store.The Stardog HTTP client driver
uses an X509TrustManager. The details of how a trust store is selected
to initialize the trust manager are
[documented](http://docs.oracle.com/javase/6/docs/technotes/guides/security/jsse/JSSERefGuide.html#X509TrustManager).

The client driver can be directed to use a specific Java KeyStore file
as a trust store by setting the `javax.net.ssl.trustStore` system
property. To address the authentication error above, that trust store
should contain the issuer of the server’s certificate.Standard Java
tools can create such a file. The following invocation of the `keytool`
utility creates a new trust store named `my-truststore.jks` and
initializes it with the certificate in `my-trusted-server.crt`. The tool
will prompt for a passphrase to associate with the trust store. This is
not used to encrypt its contents, but can be used to ensure its
integrity.See the `javax.net.ssl.trustStorePassword` system property
[documentation](http://docs.oracle.com/javase/6/docs/technotes/guides/security/jsse/JSSERefGuide.html#X509TrustManager).

    $ keytool -importcert  -keystore my-truststore.jks \
            -alias stardog-server -file my-trusted-server.crt

The following Stardog command line invocation uses the newly created
truststore.

    $ STARDOG_JAVA_ARGS=”-Djavax.net.ssl.trustStore=my-truststore.jks” \
            stardog status -c https://stardog.example.org/sp2b_10k

For custom Java applications that use the Stardog HTTP client driver,
the system property can be set programmatically or when the JVM is
initialized.

The most common deployment approach requiring a custom trust store is
when a self-signed certificate is presented by the Stardog server. For
connections to succeed, the Stardog client must trust the self-signed
certificate. To accomplish this with the examples given above, the
self-signed certificate should be in the my-trusted-server.crt file in
the keytool invocation.

A client may also fail to authenticate the server if the hostname in the
Stardog database connection string does not match a name contained in
the server certificate.The matching algorithm used is
[described](http://hc.apache.org/httpcomponents-client-ga/tutorial/html/connmgmt.html)
in the Apache docs about `BrowserCompatHostnameVerifier`.

This will cause an error message like the following

    Error during connect.  Cause was SSLException: hostname in certificate didn't match

The client driver does not support connecting despite a mismatch,
therefore the only solutions are to replace the server’s certificate or
modify the connection string to use an alias for the same server that
matches the certificate.

Securing Stardog on Linux
-------------------------

This section describes one approach to installing Stardog on Linux—or
another Unix-like operating system—with the goal of restricting
unauthorized access to Stardog data. The approach detailed below is not
the only effective way to secure a Stardog installation. Stardog
administrators should customize their installation for the requirements
of their environment.

In what follows, you'll see snippets of shell code. For each snippet `$`
represents the shell prompt and `\` is the line continuation character.
Some of the shell snippets make use of relative paths and are intended
to be run from within directory where Stardog release file was unzipped.
Many of the snippets will need to be run with elevated permissions.

### Warning

Make sure that you know what you're doing before you copy any of the
snippets of shell code or configuration syntax into a real Linux system.
*You've been warned.*

### Creating A Basic Stardog Environment

The Stardog library files should be copied from the distribution
directory into a permanent location in the host system. The snippet
below chooses a common location and uses a versioning string to
facilitate parallel installs of different Stardog releases. An
administrator may choose any location.

    $ export STARDOG_VERSION=@@VERSION@@
    $ export STARDOG_LIBDIR=/opt/stardog-${STARDOG_VERSION}/lib
    $ install -d ${STARDOG_LIBDIR}
    $ cp -r lib/* ${STARDOG_LIBDIR}
    $ chown -R root:root ${STARDOG_LIBDIR}
    $ chmod -R a+r ${STARDOG_LIBDIR}

The Stardog command line tools should be copied from the distribution
directory into a location that places them into most users’ execution
PATH. Execution permissions to the tools are *not* limited because
access to the data directory will be *strictly limited*.

    $ install -c -m a=rx \
    ./stardog /usr/bin/stardog
    $ install -c -m a=rx \
    ./stardog-admin /usr/sbin/stardog-admin

The Stardog data directory stores both user data and system
configuration data, including access control information. The location
selected for the data directory should be reliable, large enough to meet
data requirements, and secured from unauthorized access.

    $ export STARDOG_HOME=/var/db/stardog

Access to the data directory is limited to the `stardog` group and the
only member of that group is the `stardog` user.Granting access
permissions to members of the `stardog` group is more flexible than
limiting access to a single user. For example, it may allow a Stardog
network server to run as a user other than `stardog`; or it may
facilitate other processes other than Stardog, i.e., data backup. The
snippet below creates that user and group.

    $ groupadd stardog
    $ useradd \
    -d ${STARDOG_HOME} \
    -g stardog \
    -s /sbin/nologin \
    stardog

This snippet creates the data directory and limits its access to the
newly created group.

    $ install -d -o stardog -g stardog -m ug=rwx,o= \
    ${STARDOG_HOME}

Note that if a Stardog server is used to allow network access to remote
Stardog clients, then the approach described here requires the server to
run as a user in the `stardog` group.

An administrator can accomplish this by running the server as the
`stardog` user or by adding the relevant user to the `stardog` group.
For example, the following snippet adding the `tomcat` user to the
`stardog` group may be needed in an environment where a Stardog HTTP
server is run as an application within Tomcat.

    $ usermod --add-to-group stardog tomcat

Of course the ideal deployment of the Stardog server depends on the
particulars of the deployment environment, the preferences of the
administrator, and the anticipated user load. The group-based permission
approach provides flexibility to satisfy many alternatives.

Notes {.fn}
=====

[⌂](# "Back to top")

For comments, questions, or to report problems with this page, please
email the [Stardog Support
Forum](https://groups.google.com/a/clarkparsia.com/group/stardog/about).


