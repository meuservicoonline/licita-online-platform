from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
sys.path.append(os.path.dirname(__file__))

from database import db
from models.empresa import Empresa
from models.documento import Documento
from models.licitacao import Licitacao
from routes.empresa import empresa_bp
from routes.documentos import documentos_bp
from routes.licitacoes import licitacoes_bp

app = Flask(__name__)

# Configuração para produção na Vercel
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-key-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///tmp/app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# CORS configurado para produção
CORS(app, origins=[
    'https://*.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
])

db.init_app(app)

# Registrar blueprints
app.register_blueprint(empresa_bp, url_prefix='/api')
app.register_blueprint(documentos_bp, url_prefix='/api')
app.register_blueprint(licitacoes_bp, url_prefix='/api')

# Criar tabelas na primeira execução
with app.app_context():
    db.create_all()

# Handler para Vercel
def handler(event, context):
    return app(event, context)

if __name__ == '__main__':
    app.run(debug=False)