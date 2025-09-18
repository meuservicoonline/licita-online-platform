class Licitacao:
    id: int (PK)
    empresa_id: int (FK)
    numero_edital: str
    orgao_licitante: str
    objeto: str
    data_abertura: date
    link_edital: str
    status: str (em_andamento, finalizada, vencida, perdida)
    observacoes: text
    created_at: datetime
