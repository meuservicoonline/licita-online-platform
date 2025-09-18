import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, Trash2, AlertTriangle, Calendar } from 'lucide-react';

const DocumentosManager = ({ empresaId }) => {
  const [documentos, setDocumentos] = useState([]);
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    tipo: '',
    data_emissao: '',
    data_validade: '',
    file: null
  });

  useEffect(() => {
    if (empresaId) {
      fetchDocumentos();
      fetchTiposDocumento();
    }
  }, [empresaId]);

  const fetchDocumentos = async () => {
    try {
      const response = await fetch(`/api/documentos?empresa_id=${empresaId}`);
      if (response.ok) {
        const data = await response.json();
        setDocumentos(data);
      }
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
    }
  };

  const fetchTiposDocumento = async () => {
    try {
      const response = await fetch('/api/documentos/tipos');
      if (response.ok) {
        const data = await response.json();
        setTiposDocumento(data);
      }
    } catch (error) {
      console.error('Erro ao carregar tipos de documento:', error);
    }
  };

  const handleFileChange = (e) => {
    setUploadForm(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUploadForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value) => {
    setUploadForm(prev => ({
      ...prev,
      tipo: value
    }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.file || !uploadForm.tipo) {
      alert('Por favor, selecione um arquivo e o tipo de documento');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', uploadForm.file);
    formData.append('empresa_id', empresaId);
    formData.append('tipo', uploadForm.tipo);
    if (uploadForm.data_emissao) formData.append('data_emissao', uploadForm.data_emissao);
    if (uploadForm.data_validade) formData.append('data_validade', uploadForm.data_validade);

    try {
      const response = await fetch('/api/documentos', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Documento enviado com sucesso!');
        setUploadForm({
          tipo: '',
          data_emissao: '',
          data_validade: '',
          file: null
        });
        // Reset file input
        document.getElementById('file-input').value = '';
        fetchDocumentos();
      } else {
        const error = await response.json();
        alert(`Erro: ${error.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao enviar documento:', error);
      alert('Erro ao enviar documento');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentoId) => {
    if (!confirm('Tem certeza que deseja excluir este documento?')) {
      return;
    }

    try {
      const response = await fetch(`/api/documentos/${documentoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Documento excluído com sucesso!');
        fetchDocumentos();
      } else {
        alert('Erro ao excluir documento');
      }
    } catch (error) {
      console.error('Erro ao excluir documento:', error);
      alert('Erro ao excluir documento');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'válido':
        return <Badge variant="outline" className="text-green-600">Válido</Badge>;
      case 'próximo_vencimento':
        return <Badge variant="outline" className="text-yellow-600">Próx. Vencimento</Badge>;
      case 'vencido':
        return <Badge variant="destructive">Vencido</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Formulário de Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Enviar Novo Documento</span>
          </CardTitle>
          <CardDescription>
            Faça upload dos documentos necessários para participar de licitações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Documento *</Label>
                <Select value={uploadForm.tipo} onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposDocumento.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_emissao">Data de Emissão</Label>
                <Input
                  id="data_emissao"
                  name="data_emissao"
                  type="date"
                  value={uploadForm.data_emissao}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_validade">Data de Validade</Label>
                <Input
                  id="data_validade"
                  name="data_validade"
                  type="date"
                  value={uploadForm.data_validade}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file-input">Arquivo *</Label>
              <Input
                id="file-input"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                required
              />
              <p className="text-sm text-gray-500">
                Formatos aceitos: PDF, JPG, PNG (máx. 16MB)
              </p>
            </div>

            <Button type="submit" disabled={loading}>
              <Upload className="h-4 w-4 mr-2" />
              {loading ? 'Enviando...' : 'Enviar Documento'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Lista de Documentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Documentos Cadastrados</span>
          </CardTitle>
          <CardDescription>
            Gerencie todos os documentos da sua empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          {documentos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum documento cadastrado ainda</p>
              <p className="text-sm">Envie seus primeiros documentos usando o formulário acima</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documentos.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium">{doc.tipo}</h4>
                        <p className="text-sm text-gray-500">{doc.nome_arquivo}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-2">
                      {getStatusBadge(doc.status)}
                      {doc.data_emissao && (
                        <span className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Emissão: {formatDate(doc.data_emissao)}
                        </span>
                      )}
                      {doc.data_validade && (
                        <span className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Validade: {formatDate(doc.data_validade)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {doc.status === 'vencido' && (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    )}
                    {doc.status === 'próximo_vencimento' && (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(doc.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentosManager;

