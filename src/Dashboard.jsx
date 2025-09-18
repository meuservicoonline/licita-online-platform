import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, FileText, Briefcase, Building2 } from 'lucide-react';

const Dashboard = ({ empresaId }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (empresaId) {
      fetchDashboardData();
    }
  }, [empresaId]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`/api/empresa/${empresaId}/dashboard`);
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Dados não disponíveis</div>
      </div>
    );
  }

  const { empresa, documentos, licitacoes } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Header com informações da empresa */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg">
        <div className="flex items-center space-x-3">
          <Building2 className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">{empresa.razao_social}</h1>
            <p className="text-blue-100">CNPJ: {empresa.cnpj} | Porte: {empresa.porte}</p>
          </div>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Documentos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documentos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documentos.total}</div>
            <div className="flex space-x-2 mt-2">
              <Badge variant="outline" className="text-green-600">
                {documentos.validos} válidos
              </Badge>
              {documentos.proximo_vencimento > 0 && (
                <Badge variant="outline" className="text-yellow-600">
                  {documentos.proximo_vencimento} próx. venc.
                </Badge>
              )}
              {documentos.vencidos > 0 && (
                <Badge variant="destructive">
                  {documentos.vencidos} vencidos
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Licitações */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Licitações</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{licitacoes.total}</div>
            <div className="flex space-x-2 mt-2">
              <Badge variant="outline" className="text-blue-600">
                {licitacoes.em_andamento} em andamento
              </Badge>
              {licitacoes.vencidas > 0 && (
                <Badge variant="outline" className="text-green-600">
                  {licitacoes.vencidas} vencidas
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Alertas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {documentos.vencidos + documentos.proximo_vencimento}
            </div>
            <p className="text-xs text-muted-foreground">
              Documentos que precisam de atenção
            </p>
          </CardContent>
        </Card>

        {/* Status Geral */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {documentos.vencidos === 0 ? (
                <span className="text-green-600">OK</span>
              ) : (
                <span className="text-red-600">Atenção</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {documentos.vencidos === 0 
                ? 'Todos os documentos estão em dia'
                : 'Existem documentos vencidos'
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas importantes */}
      {(documentos.vencidos > 0 || documentos.proximo_vencimento > 0) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              <span>Atenção Necessária</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {documentos.vencidos > 0 && (
                <p className="text-red-700">
                  • {documentos.vencidos} documento(s) vencido(s) - Renovação urgente necessária
                </p>
              )}
              {documentos.proximo_vencimento > 0 && (
                <p className="text-yellow-700">
                  • {documentos.proximo_vencimento} documento(s) próximo(s) do vencimento - Planeje a renovação
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;

