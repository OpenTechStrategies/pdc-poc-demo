# Proof-of-Concept Demo: Common Grant Application for Philanthropy (CGAP) -- Common Data Platform

This is a demonstration project to show what a common grant application for philanthropy might look like.

This is NOT meant to run in production (APIs are public and data can be deleted any time).

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

