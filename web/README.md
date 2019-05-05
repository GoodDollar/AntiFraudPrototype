# Web

This is a React application, based on [create-react-app](https://github.com/facebook/create-react-app).

## Prerequisites

- [NodeJS](https://nodejs.org/)
- [now.sh](http://www.now.sh)

## Getting Started

1. Clone this repository
2. Run `npm install` to install dependencies
3. Start the server with `REACT_APP_ZOOM_LICENSE_KEY=d4QcD1WU4s5srMoJeDe2YDIIvy2AaMI0 REACT_APP_API_URL=http://localhost:3001` npm run start, assuming your API server is listening on port localhost:3000

## Deployment to now.sh
Deployment is done manually. You can also run the make file targets (on Windows, use NAMKE)
1. Deployment information appears on now.json. (like alias - domain name of the deployment: `https://good-face-reco.now.sh`)

2. server is assumed to run on: `https://good-face-reco.herokuapp.com/`
3. to deploy to now.sh (assuming now is installed in the path), run from the web\ folder:
`now --build-env REACT_APP_ZOOM_LICENSE_KEY=dmm5F80v71kkNcm3inG3DcAUadIlE5K4 --build-env`
`REACT_APP_API_URL=http://localhost:3001`
`now alias`
and browse to: `https://good-face-reco.now.sh`
