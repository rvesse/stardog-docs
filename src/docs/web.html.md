---
title: Stardog Web
layout: default
toc: true
quote: A programming language is low level when its programs require attention to the irrelevant.
summary:
shortTitle: Web
---

## Introducing Stardog Web

Stardog Web is a web framework for rapidly building Stardog-based apps. Stardog Web combines Stardog RDF database with some Java middleware, node, and client-side JavaScript libraries for a featureful, configuration-first development experience.

Stardog Web automagically generates Web apps for browsing and managing RDF. These apps can be built via configuration and can be customized or extended in several ways, including new HTML templates and JavaScript modules. 

Out of the box functionality includes:

<ul class="two_up tiles">
    <li><strong>&middot;</strong> Execute arbitrary SPARQL queries against RDF</li>
    <li><strong>&middot;</strong> Manage queries (create, delete, update)</li>
    <li><strong>&middot;</strong> Visualize
        <ul>
        <li>classes and their instances,</li>
        <li>their property assertions,</li>
        <li>class/property hierarchies,</li>
        <li>axioms and rules,</li>
        <li>query results,</li>
        <li> subgraphs</li>
    </ul>
    </li>
    <li><strong>&middot;</strong> Save query results</li>
    <li><strong>&middot;</strong> Faceted browsing via [Pelorus](http://pelorus.clarkparsia.com/)</li>
    <li><strong>&middot;</strong> full text search</li>
    <li><strong>&middot;</strong> Enforce access control</li>
</ul>

### Gobs of Open Source Goodness

Stardog Web is built on top Stardog and Annex, our Linked Data middleware, and also uses [Yeoman](http://yeoman.io), [Backbone](http://backbonejs.org/), [Backbone.LayoutManager](https://github.com/tbranyen/backbone.layoutmanager), [Lodash](http://lodash.com/), [Require](http://requirejs.org/), [Handlebars](http://handlebarsjs.com/), [Bootstrap](http://twitter.github.com/bootstrap/), [jQuery](http://jquery.com/), [CSS3](http://www.w3.org/TR/2001/WD-css3-roadmap-20010523/), and [Less](http://lesscss.org/)

## Building an App

The typical workflow for building Stardog-based apps was always the same and we got tired of doing it manually every time. Stardog Web automates the boring parts, which lets us all concentrate on the fun stuff.

A Stardog Web project lifecycle looks a bit like this:

1. beg, borrow, steal, or integrate some RDF data
1. install Stardog Web
1. generate a Stardog Web app1. 
1. configure the app
1. run, test, customize, and extend the app
1. lather, rinse, repeat...
1. deploy the app

### Installing Stardog Web

Stardog Web consists of two Node packages, a generator and a CLI, which are provided in the installation distribution as `tar.gz` files. 

First, install [Node](http://nodejs.org/). We'll wait.

Next, verify that you have Web access (to be able to access the NPM registry & repositories) and check that the `npm` prefix is pointing to `/usr/local`. You can verify the value of the prefix as follows:

```bash
$ npm config get prefix
```

If the prefix is not `/usr/local`, you can change it using one of the methods described [here](https://npmjs.org/doc/config.html).<fn>[http://yeoman.io/generators.html](http://yeoman.io/generators.html)In the following, we assume the `egad-0.x.x.zip` distribution file has been decompressed into the `<package_dir>` directory.</fn>

Then run this:

```bash
$ npm install -g <package_dir>/egad-cli-0.x.tar.gz <package_dir>/generator-egad-0.x.tar.gz
```

Finally, ...test the setup? @fixme

Stardog Web depends on 

* [Node.js](http://nodejs.org/) = v0.8.x (Not tested in v0.10.x yet, but it should work)
* [NPM](https://npmjs.org/) (Included in Nodejs)
* [Yeoman v1.0 BETA](http://yeoman.io/) (latest version)
* Annex Middleware Services (`annex.war` provided in the installation package)
* [Stardog >= 1.2.3](http://stardog.com)
* Servlet container ([Caucho Resin](http://www.caucho.com/) recommended)

### Installing Stardog

Stardog Web works with...Stardog. If you already have Stardog installed, you should be good to go. If you don't, install it. Now make sure that you know how to create a database, add data to it, etc. There's a [Quick Start Guide](/quick-start).

### Provisioning Stardog 

Create a Stardog database containing the data for your Stardog Web app and expose it in an SPARQL endpoint. Please see [Stardog docs](http://stardog.com/docs/) for details about database creation. Once a database has been created, we can expose it in an SPARQL endpoint by simply starting the corresponding Stardog server:

```bash
$ stardog-admin --disable-security server start
```

<t>secnote</t> Stardog Web v0.4.5 (and earlier) requires Stardog Server to run with security disabled. We'll fix this bug in a future release.

#### Custom Namespaces

Add the required prefixes that will be used in the app. You can list prefixes defined in the Stardog database using the following command:

```bash
stardog namespace list -c snarl://localhost/<DB>
```

By default, Stardog defines a set of common namespaces:

```bash
+--------+---------------------------------------------+
| Prefix |                  Namespace                  |
+--------+---------------------------------------------+
| rdf    | http://www.w3.org/1999/02/22-rdf-syntax-ns# |
| rdfs   | http://www.w3.org/2000/01/rdf-schema#       |
| xsd    | http://www.w3.org/2001/XMLSchema#           |
| owl    | http://www.w3.org/2002/07/owl#              |
+--------+---------------------------------------------+
```

To add your prefixes, you can execute the `stardog namespace add` command:

```bash
stardog namespace add --prefix test --uri \
   'http://example.org/test#' -c snarl://localhost/myDB -u admin -p admin
```

### Installing Annex Middleware

Annex is the middleware service that connects Stardog Web to Stardog. It must be installed<fn>**Note:** We will distribute Annex in Stardog in the 2.x release cycle and it won't have to be separately installed.</fn> and configured to run on a J2EE container--we recommend Caucho Resin--on the same machine as Stardog (for now).

Annex is distributed as a single WAR file (`annex.war`). Simply deploy the WAR file in a servlet container. Typically this can be accomplished by copying the WAR file into the container's `webapps` folder and (re)starting the container. Currently, each Stardog Web application uses its own instance of Annex; therefore, we recommend changing the name of the WAR file in the `webapps` accordingly:

```bash
$ cp <package_dir>/annex.war <container_dir>/webapps/annex-<appname>.war
```

In order to be used by a Stardog Web application, one needs to specify where the data resides as well as provide valid credentials. This information can be specified in the `web.xml`, by modifying the following properties: 

```xml
<init-param>
    <param-name>annex.db.host</param-name>
    <param-value>localhost:5820</param-value>
</init-param>

<init-param>
    <param-name>annex.db.repository</param-name>
    <!-- name of the Stardog DB -->
    <param-value>myDB</param-value>
</init-param>

<init-param>
    <param-name>annex.db.user</param-name>
    <param-value>admin</param-value>
</init-param>

<init-param>
    <param-name>annex.db.password</param-name>
    <param-value>admin</param-value>
</init-param>
```

#### Apache Tomcat Notes
  
There are a few wrinkles if you want to use Tomcat:

* You need to add the following configuration option to the `catalina.properties` file in `<tomcat_dir>/conf/catalina.properties`

```java
org.apache.tomcat.util.buf.UDecoder.ALLOW_ENCODED_SLASH=true
```
    
* There is a known tomcat bug in versions earlier than 7.0.30. For more details on the issue, please refer to the [bug report](https://issues.apache.org/bugzilla/show_bug.cgi?id=53535). In order for Annex to work properly with Tomcat, please update to a later version.

### Configuring Stardog Web

Stardog Web's functionality is configured, customized, and (partially) extended by editing a configuration file (usually `config.ttl` or `config.json`) in JSON or Turtle. Your Stardog Web app may also be customized and extended by writing new templates, new JavaScript components, or new middleware. More about that [here](). @fixme

Note that the references to `rdf:type` URIs in the configuration file can be done according to the `namespaces` map defined in the same file. These namespaces should be the same (prefix and namespace) as the ones defined in the Stardog database previously.<fn>Stardog Web will actively maintain these in a future release. Till then: hold fast!</fn>

Here's an example configuration file which we comment on next...

<!--
```javascript
{ 
   "name": "My Application",
   "label": "App",
   "sparqlEndpoint": "http://192.168.69.111:5822/gov/query",
   "apiEndpoint": "http://192.168.69.111:8080/annex-gov/api",
   "editData": false,
   "namespaces": {
       "http://www.w3.org/1999/02/22-rdf-syntax-ns#":"rdf",
       "http://www.w3.org/2000/01/rdf-schema#": "rdfs",
       "http://www.w3.org/2001/XMLSchema#": "xsd",
       "http://www.w3.org/2002/07/owl#": "owl",
       "http://purl.org/dc/elements/1.1/": "dc"
   },
   "modules": {
       "home": {
           "content": "mycontent/myhome.html"
       },
       "browse": true,
       "query": {
           "label": "Query Panel",
           "mainUrl": "#!/query"
       },
       "search": {
           "label": "Search",
           "mainUrl": "#!/search"
       },
       "navbar": {
           "items": [ 
               { "htmlId":"lientry", 
                 "label": "Data Entry", 
                 "type":"browse",
                 "using": "dgtwc:DataEntry",
                 "icon": "icon-tasks"
               }
           ]
       },
       "footer": true
   },
   "collections": {
       "default": {
           "limit": 20
       },
       "dgtwc:DataEntry": {
           "using":"dgtwc:DataEntry",
           "usingLabel":":title"
       }
   }
}```
-->

Or:

```sparql
@prefix      :  <tag:clarkparsia:egad:configuration#> .
@prefix   rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix  rdfs:  <http://www.w3.org/2000/01/rdf-schema#> .
@prefix   xsd:  <http://www.w3.org/2001/XMLSchema#> .
@prefix   owl:  <http://www.w3.org/2002/07/owl#> .
@prefix    dc:  <http://purl.org/dc/elements/1.1/> .
@prefix dgtwc:  <http://data-gov.tw.rpi.edu/2009/data-gov-twc.rdf#> .

:DataGov a :App;
  :name "Data.gov EGAD Application"^^xsd:string ;
  :label "Data.gov"^^xsd:string ;
  :sparqlEndpoint <http://192.168.69.111:5822/gov/query> ;
  :apiEndpoint <http://192.168.69.111:8080/annex-gov/api> ;
  :editData "true"^^xsd:boolean ;
  :modules :home, :browse, :query, :search, :treebrowser, :navbar, :footer;
  :collections :defaultCollection, :entryCollection.

:defaultCollection a :CollectionDefaultSetting ;
  :limit "20"^^xsd:int .

:entryCollection a :CollectionSetting ;
  :using dgtwc:DataEntry ;
  :usingLabel dc:title .

:someCollection a :CollectionSetting
  :using dgtwc:DataEntry ;
  :limit "20"^^xsd:int ;
  :usingLabel rdfs:label ;
  :fields ( dc:title dc:created ) .

:home a :Module ;
  :content "mycontent/myhome.html"^^xsd:string .

:browse a :Module .

:query a :Module ;
  :linkLabel "Query Panel" ;
  :linkUrl "#!/query" .

:search a :Module ;
  :linkLabel "Search" ;
  :linkUrl "#!/search" .

:treebrowser a :Module .

# the navbar items
:navbar a :Module ;
  :items ( :navItemEntry ) .

:navItemEntry :htmlId "lientry" ;
  :label "Data Entry" ;
  :type "browse" ;
  :using dgtwc:DataEntry ;
  :icon "icon-tasks" .

:footer a :Module .```

The top-level configuration settings should always be present, even if the values are empty objects.

- `:name`: This is the application name, displayed at the footer of the web application.

- `:label`: App short label to be displayed at the top left side in the navigation bar.

- `:sparqlEndpoint`: This is the SPARQL endpoint that will be used to explore the schema and generate the EGAD Web application. This endpoint is also used in the Query Panel (if enabled).

- `apiEndpoint`: This is the endpoint used by the client application generated, which is an annex API endpoint, abstracting all data in the RDF repository as a RESTful service using /{collection}/{ind} routes. If deploying to a remote server, make sure **not** to use `localhost`, since this is sent to the client and the client webapp will try to find all references (to the API) as localhost, instead use the API or server reference.

- `editData`: Enables/disables data mutations in the application using add/edit/delete actions.

- `namespaces`: This is a list of namespace : prefix to use, they represent the namespaces used in the data set.

- `collections`: Configurations for collection display.

- `collections > default` :: `Object`: Defines the default configuration for the collection listings.

- `collections > default > limit` :: `Number`: Sets the limit of elements to show in the collection view.

- `modules` :: `Object`: Sets the modules to use in the application, either system modules or custom user modules. Modules can receive a configuration object or just activate them using `true` value. To deactivate a module just set the value to `false`.

Some of the Stardog Web builtin modules include the following.

* home - Enables content in the homepage of the application. Receives an object with the content attribute refering to a html template to include as home content relative to the app directory, e.g.:

        "home": {
            "content": "mycontent/myhome.html"
        }

* navbar - Enables top navigation bar in the application. Receives a configuration object specifying the link items which are objects including an `htmlId` to reference the element, a `label` to show in the navbar, an `using` to make the link to the proper collection view and an `icon` name, based on the icon names included in [bootstrap](http://twitter.github.com/bootstrap/base-css.html#icons); or dropdowns to include, e.g.:

        "navbar": {
            "items": [ { "htmlId":"lientry", "label": "Data Entry", "type":"browse", "using": "dgtwc:DataEntry", "icon": "icon-tasks" }
            ],
            "dropdowns": [
                {
                    "name": "Queries",
                    "icon": "icon-filter",
                    "items": [ … ]
                },
                …
            ]
        }

    `type` - refers to a function of a module, in this case, the module browse (the url handler), will be activated by this link with the `using` attribute as a parameter, so the rendered link in the navbar will be: `#!/browse/dgtwc:DataEntry`

    The `items` attribute in the `dropdown` object takes the same objects as the top level `items` in navbar.

* footer - `true`/`false` enables or disables the default footer respectively, it can receive a content object same as the home page module.
* browse - `true`/`false` enables or disables the browsing feature of collections and individuals.
* search - `true`/`false` enables or disables the text search module, it can receive a configuration object to add a link to the navbar & footer:

        {
            "label": "Search",
            "mainUrl": "#!/search"
        }


* query - `true`/`false` enables or disables the treebrowser module, it can receive a configuration object to add a link to the navbar & footer:

        "query": {
            "label": "Query Panel",
            "mainUrl": "#!/query"
        }



You can customize the EGAD application homepage by creating your own content using [Handlebars](http://handlebarsjs.com) templating, [Bootstrap](http://twitter.github.io/bootstrap/) UI components an a little bit of configuration in your EGAD app configuration file.

Once you have your homepage content in an *.html file, you can reference it in the configuration file of your application using the content property of the home module, having something like the following section in the configuration file:

    ...
    "modules": {                                        # the modules section of the configuration file
        "home": {                                       # home module descriptor
            "content": "mycontent/somepage.html"        # reference to the homepage template content, 
        },                                              #   relative to the configuration file        
        ...
    }

Remember that after any change in the configuration file you need to re-generate your application to make your changes effective, you can use the update command of the EGAD CLI to do this:

    $ egad update -j config.js

__Note:__ the widgets below this section can not be modified unless you dive into the JS code, but that should be configurable in the next EGAD versions.Before starting to create EGAD apps, make sure you have Yeoman 1.0 listed in the [Requirements](https://github.com/clarkparsia/generator-egad/wiki/Requirements) installed. Once the requirements are installed, you can proceed to create an EGAD app with the following steps:

Assuming you already have installed the egad distribution as mentioned in [Installing EGAD](https://github.com/clarkparsia/generator-egad/wiki/Installing-EGAD), you can create an EGAD Application using the EGAD CLI:

Create a new directory `<myApp>` for your EGAD application.

  $ mkdir <myApp>
  $ cd <myApp>


Create a configuration file `<myApp>/config.js` for your EGAD application. An example can be found in `<package_dir>/config.js.example`. Please refer to the __Configuration__ document provided in this package for details.

Once a configuration file has been created, generate your EGAD app using the EGAD CLI:

* Using the Turtle configuration file

        <myApp>$ egad create config.ttl
    
or
    
* Using the JS configuration file

        <myApp>$ egad create -j config.js
    
### Generating a Stardog Web App
   
Other services provided are: search, schema inspector and query. For more information on the available resources and interfaces in the Annex Platform, please refer to the [API documentation](http://docs.annex.apiary.io/).

# Testing

Once an EGAD application has been created, it can be tested using the `run` command of the EGAD CLI (make sure Annex & Stardog are up and running):

    <myApp>$ egad run

## Updating the EGAD App 

If you have made changes to the EGAD app configuration file, to update the application source use the following command: 

* Using the Turtle configuration file

        <myApp>$ egad update config.ttl
    
or
    
* Using the JS configuration file

        <myApp>$ egad update -j config.js
    


### Known Issues

Some of the known issues in the current release are:

* Instance edit views have issues when rendering properties with too many values.
* Pelorus is not integrated completely, there's no way to generate a pelorus model from the EGAD toolkit.
* There may be some errors in the web service with data containing bnodes.Annex Platform Services is a RESTful web service that provides a series of abstractions for semantic services. Provides a graph browsing interfaces with common RESTful resources and operations, using JSON-LD as the serialization format, which makes it perfect for MV* JS applications.


### Cleaning the application directory

To clean the application directory, one can use the command:

    <myApp>$ egad clean
    
Which will delete all EGAD generated files (excluding all configuration & files added by the user).

### Deploying

An optimized version of the appication (CSS & JS minified/optimized) can be obtained by running

    <myAppp>$ egad build

Once a `dist` directory is created, it can be deployed in any web server since it contains only static files - HTML, JavaScript, CSS and images.
Before creating EGAD modules, make sure you have Yeoman 1.0 listed in the [Requirements](https://github.com/clarkparsia/generator-egad/wiki/Requirements) installed. Once the requirements are installed, you can proceed to create an EGAD module with the following steps:

Assuming you already have installed the egad distribution as mentioned in [Installing EGAD](https://github.com/clarkparsia/generator-egad/wiki/Installing-EGAD), you can create an EGAD module using the EGAD CLI. Usually modules are created once you already have created an application using an EGAD configuration file, this provides the testing environment for you module, if you haven't created an application yet, please refer to the _Creating an EGAD App_ document.

In the application directory, execute the command:

	<myapp>$ egad module <mymodule>
	
Where <mymodule> is the name of your module within the EGAD application. This will create the basic stubs for an EGAD module, providing the structure for your module code. It also creates a set of configurations for you to include in the main EGAD application configuration file.
If your configuration file is named `egad.json`, the tool will automatically append the configuration settings of the new module to the configuration file, like the following:

    "mymodule": {
        "code": "modules/mymodule/code",
        "templates": "modules/mymodule/template"
    }
    
If your configuration file is named different, the configuration settings of the module will be stored in a module configuration file named `mymodule.json`. Note that for now, the content of this configuration file MUST be added manually to the `modules` section in the main app configuration file. In the future we'll provide support for module specific configuration files and you'll be able to reference them from the main app configuration file.

Modules files are created under the `modules` directory that, if not present, will be created in the root of your EGAD application directory, for example, the directory tree will be similar to:

    modules/
    └── mymodule
        ├── code
        │   ├── main-view.js
        │   └── main.js
        ├── mymodule.json
        └── template
            └── main.html

### Generated module files

The module scafolding tool generates the following files as showed in the previous directory tree:

* `modules/mymodule/code/main.js`: this file is the main module descriptor, it defines the module object in terms of the EGAD Framework, which lets the EGAD app detect and register the module for its use.

        define([
          "jquery",
          "underscore",
          "egad",
          "api",

          "mymodule/main-view"
        ], 
        
        function($, _, egad, api, MainView) {

          var mymoduleModule = egad.api.Module.extend({
            name: "mymodule",
            
            routes: {
              "!/mymodule": "routeHandler"
            },

            // Module initialization function.
            // Executed when the module is loaded in the application.
            initialize: function () {
              console.log("mymodule initialized!");
            },

            // Module route handler function.
            routeHandler: function () {
              console.log('mymodule runs!');

              // render a main view
              var mainView = new MainView();
              $('.pageContainer').html(mainView.$el);
              mainView.render();
            }

          });

          return new mymoduleModule();
        });

* `modules/mymodule/code/main-view.js`: defines a sample of a Backbone view that is used in the module, just as an example of how you can load views when using the application routes defined by the module.

        define([
          "jquery",
          "underscore",
          // Application
          "egad",
          "egad.config",
          "api",

          // Other module deps
          "alerts",

          "bootstrap",
          "handlebars.helpers"
        ], 

        function($, _, egad, egadConfig, api, Alerts) {

          var MainView = Backbone.View.extend({
            template: "mymodule/main",
            tagName: "div",
            id: "mymodule",

            initialize: function () {
              _.bindAll(this);
            },

            serialize: function () {
              if (this.model) {
                return this.model.toJSON();
              } else {
                return {};
              }
            }
          });

          return MainView;

        });

* `modules/mymodule/template/main.html`: handlebars HTML template used by the Backbone view in main-view.js.

        <div class="span12 module">
          <h2>mymodule content - html Handlebars template!</h2>
        </div>

* `modules/mymodule/mymodule.json`: module configuration settings to be added in the main EGAD application configuration file.

        {
          "code": "modules/mymodule/code",
          "templates": "modules/mymodule/template"
        }
        

## Extending Stardog Web

The only EGAD specific bits of code are in `main.js`, defining the EGAD module, and the structure is pretty much the same as a [Backbone.js Router](http://backbonejs.org/#Router). An EGAD module follows the structure of a [Require.js](http://requirejs.org/docs/api.html#packages) package.

The require.js configuration of the EGAD appplication can be found in the application tree in the file: `app/scripts/config.js`. You can see there how all the libraries and tools are defined to be loaded in the application.

### EGAD API

You can find the EGAD api in the file `app/scripts/egad.js` of your application directory. This API defines the Module API and some other bits of application registry and module coordination via a asynch mediator.

### Annex API

In order to retrive information from the Annex platform, you need to use the `api.js` code. Which defines tools to query the Annex endpoints based on the Annex RESTful interface. For more details on the Annex API, please refer to the _Middleware_ document.

We use the `bootstrap`-based color-scheme [framework](https://github.com/rriepe/1pxdeep) for customizing the look and feel of the EGAD apps. In order to build and apply a customized version of `bootstrap.css`, use the attached `LESS` project and follow these steps:

1. Download `recess` via npm:
   
		npm install recess

2. Compile `styles.less` with `recess`:

		./node_modules/.bin/recess --compile styles.less > bootstrap.css
 
3. Replace `app/styles/bootstrap.css` with your newly compiled version of `bootstrap.css`.This page describes the required steps to start contributing to the project, how to develop new features and create/run test cases.

In order to start development on EGAD, such as adding new build targets or adding files on the templates to create a base web application, you need the following:

1. Install the [Requirements](https://github.com/clarkparsia/generator-egad/wiki/Requirements)
2. Git clone the [EGAD Repository](https://github.com/clarkparsia/generator-egad) `git clone https://github.com/clarkparsia/generator-egad.git`
3. Once you have the EGAD Repository locally, `cd` to it and execute `npm install` to download all the development dependencies.
4. Run the test cases with the command: `npm test`

### Generator Structure

The EGAD Generator follows the structure of a Yeoman Generator API v2.0, in which targets are defined for scafolding a web application. Usually there's an `app` target, which could take a set of arguments (defined by the generator) and generate the required files for the web application using a [Web Stack](https://github.com/clarkparsia/generator-egad/wiki/Web-Stack).

The structure of the EGAD Generator is the following:

    - app/						<-- generator 'all' target (generates all the webapp)
        - index.js				<-- main executor of the all target, defines operations of the all task generator
        - USAGE					<-- descriptive information on how to use the all task in the generator
        + templates				<-- contents of the web application, usually template to be filed by the generator
    - sparql					<-- utility module to query SPARQL endpoints
        - sparqlClient.js		<-- main JS file of the SPARQL Client module
    - test						
        - test-egad.js			<-- EGAD generator test cases
        - test-sparql.js		<-- SPARQL module test cases
    - type
        - index.js				<-- generator 'type' target (scafolding a rdf:type in a already existing web app)
    - .gitignore				<-- gitignore file
    - README.md					<-- README
    - config.js.example			<-- example of the configuration file to use in the 'all' target generator
    - package.json				<-- NPM package description file
    

### “Basic Features”

_Generator_
* Use a configuration file (JSON)
* Generation of Web app by SPARQL endpoint

_Client App_
* Browsing data read only (collections and individuals)
* App Modules/Services: pelorus, search (not typed yet), Query Panel
* Home page/Main panel (some basic widgets to define)

_Middleware_
* Search interface with paging (/search/{term}/p/{page})
* Browsing interface (/rdf:type, /rdf:type/:ind, /resource/:ind)
* SPARQL Proxy (/evaluate?query={query})

### “Improvements & Service Generalization”

_Client App_
* Generation of Web app based on data in an RDF file
* Editions (add, edit, remove) on individuals
* Typed search
* More complex homepage / Main panel
* Customizable views of individuals per rdf:type (setting it in the config file). By default show everything

_Middleware_
* Ability to set a RDF file as the data source (using stardog embedded or other technique)
* Generalize middleware (this will bring the ability to generate web apps all in a common service)

### “Security”

_Client App_
* Security based on middleware service Authentication / Authorization

_Middleware_
* Authentication / Authorization using a compatible source (using OpenAZ)

### “Cloud Service” ??
_-- TBD --_

Features will include all necessary changes to run EGAD gen as a Cloud based services, to generate webapps/repositories on demand.This page describes all the technologies used for the web development included in EGAD generated apps. EGAD web apps are based in a MV* HTML5 web stack, following the single page pattern, in which all the application is state aware in the client side, using JavaScript all over the place.


### Change Log

### v0.4.5

* Added - Beta support of custom CSS themes using less
* Fixed - Paging in property values on instance views
* Fixed - Support for *.ttl configuration files (RDF Turtle)
* Fixed - egad-build cli task to build the minified and optimized application code

### v0.4

* Added - Extensibility API for EGAD
* Added - Modular refactor of all functionality
* Modified - Improved search results in search module
* Added - Better validation on instance views for browse module when editing information
* Fixed - Displaying collections based on used properties by individuals
* Added - Better handling of ObjectProperties with references to URIs without triples in the store
* Added - Showing localname of URIs in the UI when no label has been found
* Added - Properties with no label can now be added in the edit individual view
* Added - Reasoning (on-test)

### v0.3

* Added - SchemaBrowser widget
* Added - TreeBrowser module for navigating instance data as a tree
* Added - support for Turtle configuration files & EGAD configuration vocabulary in addition to already supported JS configuration files
* Modified - Improved performance in middleware services
* Added - Data mutation operations (add/edit/delete)
* Added - Better handling of URIs & data without namespaces

### v0.2

* Data mutation operations (add/edit/delete)
* Bug fixing & stabilization
* Removing some unnecessary dependencies
* Added class on instance view

### v0.1

* First read only version
* Browsing through Collections & Instances
* Configuration file in JS
* SPARQL Query panel
* Text search