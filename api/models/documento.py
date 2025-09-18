class Documento:
    id: int (PK)
    empresa_id: int (FK)
    tipo: str (CNPJ, CCMEI, Certidão Federal, etc.)
    nome_arquivo: str
    caminho_arquivo: str
    data_emissao: date
    data_validade: date
    status: str (válido, vencido, próximo_vencimento)
    created_at: datetime
