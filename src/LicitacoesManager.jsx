import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Briefcase, Plus, Edit, Trash2, ExternalLink, Calendar } from 'lucide-react';

const LicitacoesManager = ({ empresaId }) => {
  const [licitacoes, setLicitacoes] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLicitacao, setEditingLicitacao] = useState(null);
  const [formData, setFormData] = useState({
    numero_edital: '',
    orgao_licitante: '',
    objeto: '',
    data_abertura: '',
    link_edital: '',
    status: 'em_andamento',
    observacoes: ''
  });

  useEffect(() => {
    if (empresaId) {
      fetchLicitacoes();
      fetchStatusOptions();
    }
  }, [empresaId]);

  const fetchLicitacoes = async () => {
    try {
      const response = await fetch(`/api/licitacoes?empresa_id=${empresaId}`);
      if (response.ok) {
        const data = await response.json();
        setLicitacoes(data);
      }
    } catch (error) {
      console.error('Erro ao carregar licitações:', error);
    }
  };

  const fetchStatusOptions = async () => {
    try {
      const response = await fetch('/api/licitacoes/status');
      if (response.ok) {
        const data = await response.json();
        setStatusOptions(data);
      }
    } catch (error) {
      console.error('Erro ao carregar status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      numero_edital: '',
      orgao_licitante: '',
      objeto: '',
      data_abertura: '',
      link_edital: '',
      status: 'em_andamento',
      observacoes: ''
    });
    setEditingLicitacao(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({
      ...prev,
      status: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editingLicitacao ? 'PUT' : 'POST';
      const url = editingLicitacao 
        ? `/api/licitacoes/${editingLicitacao.id}` 
        : '/api/licitacoes';
      
      const payload = {
        ...formData,
        empresa_id: empresaId
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(editingLicitacao ? 'Licitação atualizada com sucesso!' : 'Licitação cadastrada com sucesso!');
        setDialogOpen(false);
        resetForm();
        fetchLicitacoes();
      } else {
        const error = await response.json();
        alert(`Erro: ${error.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao salvar licitação:', error);
      alert('Erro ao salvar licitação');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (licitacao) => {
    setEditingLicitacao(licitacao);
    setFormData({
      numero_edital: licitacao.numero_edital,
      orgao_licitante: licitacao.orgao_licitante,
      objeto: licitacao.objeto,
      data_abertura: licitacao.data_abertura || '',
      link_edital: licitacao.link_edital || '',
      status: licitacao.status,
      observacoes: licitacao.observacoes || ''
    });
    setDialogOpen(true);
  };

  const handleDelete = async (licitacaoId) => {
    if (!confirm('Tem certeza que deseja excluir esta licitação?')) {
      return;
    }

    try {
      const response = await fetch(`/api/licitacoes/${licitacaoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Licitação excluída com sucesso!');
        fetchLicitacoes();
      } else {
        alert('Erro ao excluir licitação');
      }
    } catch (error) {
      console.error('Erro ao excluir licitação:', error);
      alert('Erro ao excluir licitação');
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'em_andamento': { label: 'Em Andamento', variant: 'default', className: 'text-blue-600' },
      'finalizada': { label: 'Finalizada', variant: 'outline', className: 'text-gray-600' },
      'vencida': { label: 'Vencida', variant: 'outline', className: 'text-green-600' },
      'perdida': { label: 'Perdida', variant: 'outline', className: 'text-red-600' }
    };

    const config = statusMap[status] || { label: status, variant: 'outline', className: '' };
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusLabel = (status) => {
    const labels = {
      'em_andamento': 'Em Andamento',
      'finalizada': 'Finalizada',
      'vencida': 'Vencida',
      'perdida': 'Perdida'
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* Header com botão de adicionar */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Licitações</h2>
          <p className="text-gray-600">Gerencie as licitações de interesse da sua empresa</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Licitação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingLicitacao ? 'Editar Licitação' : 'Nova Licitação'}
              </DialogTitle>
              <DialogDescription>
                {editingLicitacao 
                  ? 'Atualize as informações da licitação'
                  : 'Cadastre uma nova licitação de interesse'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numero_edital">Número do Edital *</Label>
                  <Input
                    id="numero_edital"
                    name="numero_edital"
                    value={formData.numero_edital}
                    onChange={handleInputChange}
                    placeholder="Ex: 001/2024"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orgao_licitante">Órgão Licitante *</Label>
                  <Input
                    id="orgao_licitante"
                    name="orgao_licitante"
                    value={formData.orgao_licitante}
                    onChange={handleInputChange}
                    placeholder="Ex: Prefeitura Municipal"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data_abertura">Data de Abertura</Label>
                  <Input
                    id="data_abertura"
                    name="data_abertura"
                    type="date"
                    value={formData.data_abertura}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={handleSelectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {getStatusLabel(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="objeto">Objeto da Licitação *</Label>
                <Textarea
                  id="objeto"
                  name="objeto"
                  value={formData.objeto}
                  onChange={handleInputChange}
                  placeholder="Descreva o objeto da licitação"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link_edital">Link do Edital</Label>
                <Input
                  id="link_edital"
                  name="link_edital"
                  type="url"
                  value={formData.link_edital}
                  onChange={handleInputChange}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleInputChange}
                  placeholder="Anotações importantes sobre esta licitação"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : (editingLicitacao ? 'Atualizar' : 'Cadastrar')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Licitações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5" />
            <span>Licitações Cadastradas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {licitacoes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma licitação cadastrada ainda</p>
              <p className="text-sm">Cadastre suas primeiras licitações de interesse</p>
            </div>
          ) : (
            <div className="space-y-4">
              {licitacoes.map((licitacao) => (
                <div key={licitacao.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-lg">{licitacao.numero_edital}</h4>
                        {getStatusBadge(licitacao.status)}
                      </div>
                      <p className="text-gray-600 mb-1">{licitacao.orgao_licitante}</p>
                      <p className="text-sm text-gray-500 mb-2">{licitacao.objeto}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {licitacao.data_abertura && (
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Abertura: {formatDate(licitacao.data_abertura)}
                          </span>
                        )}
                        {licitacao.link_edital && (
                          <a
                            href={licitacao.link_edital}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Ver Edital
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(licitacao)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(licitacao.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {licitacao.observacoes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded">
                      <p className="text-sm text-gray-700">{licitacao.observacoes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LicitacoesManager;

