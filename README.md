# GoodDollar Anti-Fraud Prototype

This repository contains a prototype of a facial-recognition-based service to detect potentially fraudulent users of GoodDollar.

It's divided into two areas:

- `api` – a Rails-based API that performs facial recognition / comparison
- `web` – a dummy web application for testing the API

See individual directories for further info.

## Deployment

The prototype is hosted on Heroku and Zeit Now for API and web respectively. To deploy, run `make deploy-api` or `make deploy-web`.
