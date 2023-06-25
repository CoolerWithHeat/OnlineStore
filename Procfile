release: python3 manage.py migrate
web: gunicorn OnlineStore.wsgi --preload -b 0.0.0.0:5000 