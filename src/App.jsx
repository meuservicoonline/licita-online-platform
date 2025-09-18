import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, FileText, Briefcase, BarChart3 } from 'lucide-react';
import Dashboard from './components/Dashboard';
import EmpresaForm from './components/EmpresaForm';
import DocumentosManager from './components/DocumentosManager';
import LicitacoesManager from './components/LicitacoesManager';
import './App.css';

function App() {
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmpresa();
  }, []);

  const fetchEmpresa = async () => {
    try {
      const response = await fetch('/api/empresa');
      if (response.ok) {
        const data = await response.json();
        setEmpresa(data);
      }
    } catch (error) {
      console.error('Erro ao carregar empresa:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmpresaCreated = (empresaData) => {
    setEmpresa(empresaData);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não há empresa cadastrada, mostrar apenas o formulário de cadastro
  if (!empresa) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">LicitaFácil</h1>
            <p className="text-xl text-gray-600">
              Sistema de Gestão de Licitações para MEI, Micro e Pequenas Empresas
            </p>
          </div>
          
          <Card className="mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Bem-vindo ao LicitaFácil!</CardTitle>
              <CardDescription className="text-lg">
                Para começar, cadastre os dados da sua empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Gestão de Documentos</h3>
                  <p className="text-sm text-gray-600">
                    Organize e monitore a validade de todos os seus documentos
                  </p>
                </div>
                <div className="text-center">
                  <Briefcase className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Acompanhamento de Licitações</h3>
                  <p className="text-sm text-gray-600">
                    Registre e acompanhe todas as licitações de interesse
                  </p>
                </div>
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Dashboard Inteligente</h3>
                  <p className="text-sm text-gray-600">
                    Visualize alertas e estatísticas importantes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <EmpresaForm onEmpresaCreated={handleEmpresaCreated} />
        </div>
      </div>
    );
  }

  // Interface principal com empresa cadastrada
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">LicitaFácil</h1>
          <p className="text-gray-600">Sistema de Gestão de Licitações</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="empresa" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>Empresa</span>
            </TabsTrigger>
            <TabsTrigger value="documentos" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Documentos</span>
            </TabsTrigger>
            <TabsTrigger value="licitacoes" className="flex items-center space-x-2">
              <Briefcase className="h-4 w-4" />
              <span>Licitações</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard empresaId={empresa.id} />
          </TabsContent>

          <TabsContent value="empresa">
            <EmpresaForm onEmpresaCreated={handleEmpresaCreated} />
          </TabsContent>

          <TabsContent value="documentos">
            <DocumentosManager empresaId={empresa.id} />
          </TabsContent>

          <TabsContent value="licitacoes">
            <LicitacoesManager empresaId={empresa.id} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default App;
