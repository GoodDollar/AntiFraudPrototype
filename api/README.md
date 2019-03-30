# API

This is a simple Ruby on Rails application to provide an API for the anti-fraud prototype.

## Prerequisites

- [PostgreSQL](https://www.postgresql.org/)
- [Ruby 2.6.1](https://www.ruby-lang.org/en/)
- [Bundler](https://bundler.io/) (`gem install bundler`)

## Getting Started

1. Clone this repository
1. Run `bundle install` to obtain dependencies
1. Run `bundle exec rails db:create` to create a new Postgres database
1. Run `bundle exec rails db:migrate` to build DB schema
1. Run `bundle exec rails server --port 3001` to launch the application on port 3000
