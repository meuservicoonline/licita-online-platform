from flask import Blueprint, request, jsonify
from datetime import datetime
from src.database import db
from src.models.licitacao import Licitacao
from src.models.empresa import Empresa

licitacoes_bp = Blueprint('licitacoes', __name__)

@licitacoes_bp.route('/licitacoes', methods=['GET'])
def get_licitacoes():
    """Listar todas as licitações"""
    empresa_id = request.args.get('empresa_id')
    if not empresa_id:
        return jsonify({'error': 'empresa_id é obrigatório'}), 400
    
    licitacoes = Licitacao.query.filter_by(empresa_id=empresa_id).order_by(Licitacao.created_at.desc()).all()
    return jsonify([licitacao.to_dict() for licitacao in licitacoes])

@licitacoes_bp.route('/licitacoes', methods=['POST'])
def create_licitacao():
    """Criar nova licitação"""
    data = request.get_json()
    
    # Validações básicas
    required_fields = ['empresa_id', 'numero_edital', 'orgao_licitante', 'objeto']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Campo {field} é obrigatório'}), 400
    
    # Verificar se a empresa existe
    empresa = Empresa.query.get(data['empresa_id'])
    if not empresa:
        return jsonify({'error': 'Empresa não encontrada'}), 404
    
    try:
        # Converter data de abertura se fornecida
        data_abertura_obj = None
        if data.get('data_abertura'):
            data_abertura_obj = datetime.strptime(data['data_abertura'], '%Y-%m-%d').date()
        
        licitacao = Licitacao(
            empresa_id=data['empresa_id'],
            numero_edital=data['numero_edital'],
            orgao_licitante=data['orgao_licitante'],
            objeto=data['objeto'],
            data_abertura=data_abertura_obj,
            link_edital=data.get('link_edital'),
            status=data.get('status', 'em_andamento'),
            observacoes=data.get('observacoes')
        )
        
        db.session.add(licitacao)
        db.session.commit()
        
        return jsonify(licitacao.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@licitacoes_bp.route('/licitacoes/<int:licitacao_id>', methods=['GET'])
def get_licitacao(licitacao_id):
    """Obter licitação específica"""
    licitacao = Licitacao.query.get_or_404(licitacao_id)
    return jsonify(licitacao.to_dict())

@licitacoes_bp.route('/licitacoes/<int:licitacao_id>', methods=['PUT'])
def update_licitacao(licitacao_id):
    """Atualizar licitação"""
    licitacao = Licitacao.query.get_or_404(licitacao_id)
    data = request.get_json()
    
    try:
        # Atualizar campos se fornecidos
        if 'numero_edital' in data:
            licitacao.numero_edital = data['numero_edital']
        if 'orgao_licitante' in data:
            licitacao.orgao_licitante = data['orgao_licitante']
        if 'objeto' in data:
            licitacao.objeto = data['objeto']
        if 'data_abertura' in data:
            if data['data_abertura']:
                licitacao.data_abertura = datetime.strptime(data['data_abertura'], '%Y-%m-%d').date()
            else:
                licitacao.data_abertura = None
        if 'link_edital' in data:
            licitacao.link_edital = data['link_edital']
        if 'status' in data:
            licitacao.status = data['status']
        if 'observacoes' in data:
            licitacao.observacoes = data['observacoes']
        
        db.session.commit()
        return jsonify(licitacao.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@licitacoes_bp.route('/licitacoes/<int:licitacao_id>', methods=['DELETE'])
def delete_licitacao(licitacao_id):
    """Excluir licitação"""
    licitacao = Licitacao.query.get_or_404(licitacao_id)
    
    try:
        db.session.delete(licitacao)
        db.session.commit()
        return jsonify({'message': 'Licitação excluída com sucesso'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@licitacoes_bp.route('/licitacoes/status', methods=['GET'])
def get_status_licitacao():
    """Obter lista de status disponíveis para licitações"""
    status = [
        'em_andamento',
        'finalizada',
        'vencida',
        'perdida'
    ]
    return jsonify(status)

