# Proof-of-Concept Demo: Common Grant Application for Philanthropy (CGAP) -- Common Data Platform

This is a demonstration project to show what a common grant
application for philanthropy might look like.  See the [use cases
documentation](docs/USE_CASES.md) for more details about what this
demo shows and why, and the [core fields list](docs/CORE_FIELDS.md)
for the set of fields we have so far identified as being common to
many grant applications.

Please note that this software is for demonstration purposes only and
is NOT meant to run in production.  The APIs are public, with no
authorization controls.  There is a live demo site at
[cgap.opentechstrategies.com/poc-demo](cgap.opentechstrategies.com/poc-demo).
The demo site uses entirely made-up sample data that may be refreshed
or deleted at any time.

There are a draft [architecture diagram](docs/architecture.png) and a
draft [entity relationship diagram
(ERD)](docs/entity-relationships.png) in the [docs](docs) directory;
both are available as PDF and PNG.  These diagrams are
works-in-progress and should not be considered final.  There are also
a number of screenshots available in the [images](images) directory
(as well as a few in [cgap/static/images](cgap/static/images/) that
are actually displayed by the application itself).  Screenshots are
not guaranteed to be up-to-date with respect to the code.

## Setting Up

This project uses [`pipenv`](https://pipenv.pypa.io/en/latest/) to manage dependencies.  Data runs via SQLLite3

To set up your development environment run:

```
$ pipenv install
```

Then set up the database via:

```
pipenv run flask init-db --seed
```

## Running Locally

Once you have set up your environment you can run the project via flask:

```
$ export FLASK_APP=cgap
$ pipenv run flask run
```


## Running on Production

This project has a WSGI entry point if you want to use something like [gunicorn](https://flask.palletsprojects.com/en/2.0.x/deploying/wsgi-standalone/#gunicorn).

