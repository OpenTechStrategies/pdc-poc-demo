from pdc import create_app
from werkzeug.middleware.proxy_fix import ProxyFix

app = create_app()

if __name__ == "__main__":
    app.run()

## Flask doesn't handle reverse proxies by default, so we need
## to use this little helper.  Otherwise it will redirect using
## localhost instead of the intended host name
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)
