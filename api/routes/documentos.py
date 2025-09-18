import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from datetime import datetime, date
from src.database import db
from src.models.documento import Documento
from src.models.empresa import Empresa

documentos_bp = Blueprint('documentos', __name__)

ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}
UPLOAD_FOLDER = 'uploads'

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def ensure_upload_folder():
    upload_path = os.path.join(os.path.dirname(current_app.instance_path), UPLOAD_FOLDER)
    if not os.path.exists(upload_path):
        os.makedirs(upload_path)
    return upload_path

@documentos_bp.route('/documentos', methods=['GET'])
def get_documentos():
    """Listar todos os documentos"""
    empresa_id = request.args.get('empresa_id')
    if not empresa_id:
        return jsonify({'error': 'empresa_id é obrigatório'}), 400
    
    documentos = Documento.query.filter_by(empresa_id=empresa_id).all()
    
    # Atualizar status dos documentos
    for doc in documentos:
        doc.update_status()
    db.session.commit()
    
    return jsonify([doc.to_dict() for doc in documentos])

@documentos_bp.route('/documentos', methods=['POST'])
def upload_documento():
    """Upload de novo documento"""
    if 'file' not in request.files:
        return jsonify({'error': 'Nenhum arquivo enviado'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Nenhum arquivo selecionado'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Tipo de arquivo não permitido'}), 400
    
    # Obter dados do formulário
    empresa_id = request.form.get('empresa_id')
    tipo = request.form.get('tipo')
    data_emissao = request.form.get('data_emissao')
    data_validade = request.form.get('data_validade')
    
    if not empresa_id or not tipo:
        return jsonify({'error': 'empresa_id e tipo são obrigatórios'}), 400
    
    # Verificar se a empresa existe
    empresa = Empresa.query.get(empresa_id)
    if not empresa:
        return jsonify({'error': 'Empresa não encontrada'}), 404
    
    try:
        # Salvar arquivo
        upload_path = ensure_upload_folder()
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_')
        filename = timestamp + filename
        file_path = os.path.join(upload_path, filename)
        file.save(file_path)
        
        # Converter datas
        data_emissao_obj = None
        data_validade_obj = None
        
        if data_emissao:
            data_emissao_obj = datetime.strptime(data_emissao, '%Y-%m-%d').date()
        if data_validade:
            data_validade_obj = datetime.strptime(data_validade, '%Y-%m-%d').date()
        
        # Criar registro no banco
        documento = Documento(
            empresa_id=empresa_id,
            tipo=tipo,
            nome_arquivo=file.filename,
            caminho_arquivo=file_path,
            data_emissao=data_emissao_obj,
            data_validade=data_validade_obj
        )
        
        # Atualizar status
        documento.update_status()
        
        db.session.add(documento)
        db.session.commit()
        
        return jsonify(documento.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@documentos_bp.route('/documentos/<int:documento_id>', methods=['GET'])
def get_documento(documento_id):
    """Obter documento específico"""
    documento = Documento.query.get_or_404(documento_id)
    return jsonify(documento.to_dict())

@documentos_bp.route('/documentos/<int:documento_id>', methods=['DELETE'])
def delete_documento(documento_id):
    """Excluir documento"""
    documento = Documento.query.get_or_404(documento_id)
    
    try:
        # Remover arquivo físico
        if os.path.exists(documento.caminho_arquivo):
            os.remove(documento.caminho_arquivo)
        
        # Remover registro do banco
        db.session.delete(documento)
        db.session.commit()
        
        return jsonify({'message': 'Documento excluído com sucesso'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@documentos_bp.route('/documentos/alertas', methods=['GET'])
def get_alertas():
    """Obter documentos próximos do vencimento ou vencidos"""
    empresa_id = request.args.get('empresa_id')
    if not empresa_id:
        return jsonify({'error': 'empresa_id é obrigatório'}), 400
    
    # Atualizar status de todos os documentos
    documentos = Documento.query.filter_by(empresa_id=empresa_id).all()
    for doc in documentos:
        doc.update_status()
    db.session.commit()
    
    # Buscar documentos com alertas
    documentos_alerta = Documento.query.filter(
        Documento.empresa_id == empresa_id,
        Documento.status.in_(['vencido', 'próximo_vencimento'])
    ).all()
    
    return jsonify([doc.to_dict() for doc in documentos_alerta])

@documentos_bp.route('/documentos/tipos', methods=['GET'])
def get_tipos_documento():
    """Obter lista de tipos de documento disponíveis"""
    tipos = [
        'CNPJ',
        'CCMEI',
        'Certidão Federal',
        'Certidão Estadual',
        'Certidão Municipal',
        'Certidão FGTS',
        'Certidão Trabalhista',
        'Alvará de Funcionamento',
        'Inscrição Estadual',
        'Inscrição Municipal',
        'Comprovante de Endereço',
        'Contrato Social',
        'Outros'
    ]
    return jsonify(tipos)

