# API

This is a simple Ruby on Rails application to provide an API for the anti-fraud prototype.

## Prerequisites

- [PostgreSQL](https://www.postgresql.org/)
- [Ruby 2.6.1](https://www.ruby-lang.org/en/)
- [Bundler](https://bundler.io/) (`gem install bundler`)
- [Heroku](http://www.heroku.com)

## Getting Started

1. Clone this repository
2. Run `bundle install` to obtain dependencies
3. Run `bundle exec rails db:create` to create a new Postgres database
4. Run `bundle exec rails db:migrate` to build DB schema
5. Run `bundle exec rails server --port 3001` to launch the application on port 3000


## Deployment to now.sh
Deployment is done manually. You can also run the make file targets (on Windows, use NAMKE)
1. Deployment information appears on PROC file 
2. Server runs on: `https://good-face-reco.herokuapp.com/`
3. to deploy to heroku, you need to git push changes done on /api. To push to heroku only changes on this sub folder, use (after a regulat git commit):
`git subtree push --prefix api heroku master`