from flask import Blueprint, request, jsonify
from src.database import db
from src.models.empresa import Empresa
from src.models.documento import Documento
from src.models.licitacao import Licitacao

empresa_bp = Blueprint('empresa', __name__)

@empresa_bp.route('/empresa', methods=['GET'])
def get_empresa():
    """Obter dados da empresa (assume que existe apenas uma empresa por instância)"""
    empresa = Empresa.query.first()
    if empresa:
        return jsonify(empresa.to_dict())
    return jsonify({'message': 'Empresa não encontrada'}), 404

@empresa_bp.route('/empresa', methods=['POST'])
def create_empresa():
    """Criar nova empresa"""
    data = request.get_json()
    
    # Validações básicas
    required_fields = ['razao_social', 'cnpj', 'porte']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Campo {field} é obrigatório'}), 400
    
    # Verificar se já existe uma empresa com este CNPJ
    existing_empresa = Empresa.query.filter_by(cnpj=data['cnpj']).first()
    if existing_empresa:
        return jsonify({'error': 'Já existe uma empresa com este CNPJ'}), 400
    
    try:
        empresa = Empresa(
            razao_social=data['razao_social'],
            cnpj=data['cnpj'],
            endereco=data.get('endereco'),
            telefone=data.get('telefone'),
            email=data.get('email'),
            porte=data['porte'],
            cnae_principal=data.get('cnae_principal')
        )
        
        db.session.add(empresa)
        db.session.commit()
        
        return jsonify(empresa.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@empresa_bp.route('/empresa/<int:empresa_id>', methods=['PUT'])
def update_empresa(empresa_id):
    """Atualizar dados da empresa"""
    empresa = Empresa.query.get_or_404(empresa_id)
    data = request.get_json()
    
    try:
        # Atualizar campos se fornecidos
        if 'razao_social' in data:
            empresa.razao_social = data['razao_social']
        if 'cnpj' in data:
            empresa.cnpj = data['cnpj']
        if 'endereco' in data:
            empresa.endereco = data['endereco']
        if 'telefone' in data:
            empresa.telefone = data['telefone']
        if 'email' in data:
            empresa.email = data['email']
        if 'porte' in data:
            empresa.porte = data['porte']
        if 'cnae_principal' in data:
            empresa.cnae_principal = data['cnae_principal']
        
        db.session.commit()
        return jsonify(empresa.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@empresa_bp.route('/empresa/<int:empresa_id>/dashboard', methods=['GET'])
def get_dashboard_data(empresa_id):
    """Obter dados do dashboard para a empresa"""
    empresa = Empresa.query.get_or_404(empresa_id)
    
    # Contar documentos por status
    documentos_validos = Documento.query.filter_by(empresa_id=empresa_id, status='válido').count()
    documentos_vencidos = Documento.query.filter_by(empresa_id=empresa_id, status='vencido').count()
    documentos_proximo_vencimento = Documento.query.filter_by(empresa_id=empresa_id, status='próximo_vencimento').count()
    
    # Contar licitações por status
    licitacoes_em_andamento = Licitacao.query.filter_by(empresa_id=empresa_id, status='em_andamento').count()
    licitacoes_vencidas = Licitacao.query.filter_by(empresa_id=empresa_id, status='vencida').count()
    licitacoes_perdidas = Licitacao.query.filter_by(empresa_id=empresa_id, status='perdida').count()
    
    return jsonify({
        'empresa': empresa.to_dict(),
        'documentos': {
            'validos': documentos_validos,
            'vencidos': documentos_vencidos,
            'proximo_vencimento': documentos_proximo_vencimento,
            'total': documentos_validos + documentos_vencidos + documentos_proximo_vencimento
        },
        'licitacoes': {
            'em_andamento': licitacoes_em_andamento,
            'vencidas': licitacoes_vencidas,
            'perdidas': licitacoes_perdidas,
            'total': licitacoes_em_andamento + licitacoes_vencidas + licitacoes_perdidas
        }
    })

