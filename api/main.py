from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Configuração para Vercel
if os.environ.get('VERCEL'):
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tmp/app.db'
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'

# Importar rotas
from .routes.empresa import empresa_bp
from .routes.documentos import documentos_bp
from .routes.licitacoes import licitacoes_bp

app.register_blueprint(empresa_bp, url_prefix='/api')
app.register_blueprint(documentos_bp, url_prefix='/api')
app.register_blueprint(licitacoes_bp, url_prefix='/api')

# Para Vercel
def handler(request):
    return app(request.environ, start_response)

