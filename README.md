Anonvid - Anonymous Multi-Client Video Conferencing Chat Server

Requirements
------------
Python 3.5+, pip

External Dependencies
---------------------

MongoDB - Any version of MongoDB that PyMongo can connect to. Used only to store Conference ID and Hash of password.

Signaling server - Node.js based socket.io server offered by &yet: https://github.com/andyet/signalmaster

SimpleWebRTC Javascript - Base library by &yet. Slightly modified version available at: https://github.com/praveenram/SimpleWebRTC

FabricJS - For whiteboard canvas and their handy canvas toJSON function.

For full documentation on SimpleWebRTC check out: https://simplewebrtc.com/

Running the server
------------------

For local/custom cloud VM deployments run, `python src/app.py`

For Heroku deployments, create an application with heroku and deploy this repository from Github / using Heroku deploy.

TURN/STUN Server
----------------

By default the signalmaster server is configured with only a STUN server.

To connect with peers behind firewalls, a TURN server is required. You may host your own TURN server as suggested in https://github.com/andyet/signalmaster/blob/master/README.md

Or you may use a public TURN server such as: http://numb.viagenie.ca/

Remember, TURN servers use network bandwidth. So, please be considerate when using public services.

Environment Variables
---------------------

For production set the following environment variables,

DEPLOY_ENV=production

MONGODB_URI=mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]

SIGNALMASTER_URL=https://signalmaster_server:port/

PORT=[port to bind python server to]
