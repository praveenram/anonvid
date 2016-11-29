
if [ "$WEB_SERVER" == "true" ]; then
  python src/app.py
else
  node src/signalmaster/server.js
fi
