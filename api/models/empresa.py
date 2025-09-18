class Empresa:
    id: int (PK)
    razao_social: str
    cnpj: str
    endereco: str
    telefone: str
    email: str
    porte: str (MEI, ME, EPP)
    cnae_principal: str
    created_at: datetime
    updated_at: datetime
