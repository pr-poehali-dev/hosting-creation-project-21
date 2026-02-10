import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';

type Plan = {
  id: string;
  name: string;
  cpu: string;
  ram: string;
  disk: string;
  price: number;
};

type Server = {
  id: string;
  name: string;
  plan: string;
  location: string;
  status: 'online' | 'offline';
  cpu: number;
  ram: number;
  disk: number;
  domain: string;
};

type FileItem = {
  name: string;
  type: 'file' | 'folder';
  size?: string;
  content?: string;
};

const plans: Plan[] = [
  { id: 'earth', name: 'Земля', cpu: '1 ядро', ram: '1.0 ГБ', disk: '8 ГБ', price: 79 },
  { id: 'stone', name: 'Камень', cpu: '1 ядро', ram: '2.0 ГБ', disk: '12 ГБ', price: 209 },
  { id: 'coal', name: 'Уголь', cpu: '1.5 ядер', ram: '3.0 ГБ', disk: '20 ГБ', price: 279 },
  { id: 'copper', name: 'Медь', cpu: '1.5 ядер', ram: '4.0 ГБ', disk: '30 ГБ', price: 329 },
  { id: 'iron', name: 'Железо', cpu: '3 ядра', ram: '8.0 ГБ', disk: '15 ГБ', price: 399 },
  { id: 'lazurite', name: 'Лазурит', cpu: '2 ядра', ram: '6.0 ГБ', disk: '35 ГБ', price: 469 },
  { id: 'quartz', name: 'Кварц', cpu: '4 ядра', ram: '10.0 ГБ', disk: '20 ГБ', price: 529 },
  { id: 'redstone', name: 'Редстоун', cpu: '2 ядра', ram: '8.0 ГБ', disk: '40 ГБ', price: 609 },
  { id: 'gold', name: 'Золото', cpu: '2.5 ядра', ram: '12.0 ГБ', disk: '50 ГБ', price: 839 },
];

const Index = () => {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [location, setLocation] = useState('moscow');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [servers, setServers] = useState<Server[]>([]);
  const [currentServer, setCurrentServer] = useState<Server | null>(null);
  const [activeTab, setActiveTab] = useState('console');
  const [balance, setBalance] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [activeCodes, setActiveCodes] = useState<string[]>([]);
  const [consoleOutput, setConsoleOutput] = useState<string[]>(['Консоль готова к работе...']);
  const [files, setFiles] = useState<FileItem[]>([
    { name: 'server.properties', type: 'file', size: '2.4 KB', content: 'server-port=25565\nmax-players=20' },
    { name: 'plugins', type: 'folder' },
    { name: 'worlds', type: 'folder' },
  ]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [editContent, setEditContent] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    if (currentServer && currentServer.status === 'online') {
      const interval = setInterval(() => {
        setCurrentServer(prev => prev ? {
          ...prev,
          cpu: Math.min(100, Math.max(0, prev.cpu + (Math.random() - 0.5) * 10)),
          ram: Math.min(100, Math.max(0, prev.ram + (Math.random() - 0.5) * 8)),
          disk: Math.min(100, Math.max(0, prev.disk + (Math.random() - 0.5) * 3)),
        } : null);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [currentServer]);

  const handlePurchase = () => {
    if (!selectedPlan || !paymentMethod || !cardNumber) {
      toast.error('Заполните все поля');
      return;
    }

    if (servers.length >= 5) {
      toast.error('Максимум 5 серверов на аккаунт');
      return;
    }

    const domainMap: Record<string, string> = {
      moscow: 'sdp1.superhost.ru:20183',
      europe: 'eu.superhost.net:25565',
      armenia: 'am.superhost.fum:29182',
    };

    const newServer: Server = {
      id: `srv-${Date.now()}`,
      name: selectedPlan.name,
      plan: selectedPlan.name,
      location,
      status: 'offline',
      cpu: 0,
      ram: 0,
      disk: 0,
      domain: domainMap[location],
    };

    setServers([...servers, newServer]);
    toast.success('Сервер успешно приобретён!');
    setShowPurchaseModal(false);
    setShowDashboard(true);
    setCurrentServer(newServer);
  };

  const handlePromoCode = () => {
    if (!activeCodes.includes(promoCode)) {
      setActiveCodes([...activeCodes, promoCode]);
      
      if (promoCode === 'adminmehagost4') {
        toast.success('Промокод активирован! Открыт раздел "Логи"');
      } else if (promoCode === 'texrabotieee') {
        setMaintenanceMode(true);
        toast.warning('Технические работы включены');
      } else if (promoCode === '2026ono') {
        setMaintenanceMode(false);
        toast.success('Технические работы завершены');
      } else {
        toast.success('Промокод применён');
      }
    }
    setPromoCode('');
  };

  const handleServerAction = (action: 'start' | 'stop' | 'restart') => {
    if (maintenanceMode && action !== 'stop') {
      toast.error('Консоль недоступна: технические работы');
      return;
    }

    if (!currentServer) return;

    const logs: Record<string, string[]> = {
      start: [
        '[INFO] Starting Minecraft server...',
        '[INFO] Loading libraries, please wait...',
        '[INFO] Building unoptimized datafixer',
        '[INFO] Preparing level "world"',
        '[INFO] Done! For help, type "help"',
        '[INFO] Server started successfully',
      ],
      stop: [
        '[INFO] Stopping the server',
        '[INFO] Saving players',
        '[INFO] Saving worlds',
        '[INFO] Server stopped',
      ],
      restart: [
        '[INFO] Restarting server...',
        '[INFO] Stopping the server',
        '[INFO] Server stopped',
        '[INFO] Starting Minecraft server...',
        '[INFO] Server started successfully',
      ],
    };

    setConsoleOutput([]);
    let i = 0;
    const interval = setInterval(() => {
      if (i < logs[action].length) {
        setConsoleOutput(prev => [...prev, logs[action][i]]);
        i++;
      } else {
        clearInterval(interval);
        if (action === 'start' || action === 'restart') {
          setCurrentServer({ ...currentServer, status: 'online' });
        } else {
          setCurrentServer({ ...currentServer, status: 'offline' });
        }
      }
    }, 300);
  };

  const handleFileAction = (file: FileItem, action: 'view' | 'delete') => {
    if (action === 'view' && file.type === 'file') {
      setSelectedFile(file);
      setEditContent(file.content || '');
    } else if (action === 'delete') {
      setFiles(files.filter(f => f.name !== file.name));
      toast.success(`Удалено: ${file.name}`);
    }
  };

  const saveFile = () => {
    if (selectedFile) {
      setFiles(files.map(f => f.name === selectedFile.name ? { ...f, content: editContent } : f));
      toast.success('Файл сохранён');
      setSelectedFile(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {!showDashboard ? (
        <div className="container mx-auto px-4 py-8">
          <header className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-3">
              <Icon name="Server" className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-primary">SuperHost</h1>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowProfile(true)}>
                <Icon name="User" className="w-4 h-4 mr-2" />
                Профиль
              </Button>
              <Button variant="default">Регистрация</Button>
            </div>
          </header>

          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Выберите тариф хостинга</h2>
            <p className="text-muted-foreground">Все тарифы поддерживают локации: Москва, Европа, Армения</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {plans.map(plan => (
              <Card key={plan.id} className="hover:border-primary transition-all">
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ЦПУ</span>
                      <span className="font-medium">{plan.cpu}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Память</span>
                      <span className="font-medium">{plan.ram}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Диск</span>
                      <span className="font-medium">{plan.disk}</span>
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-4">{plan.price}.00₽</div>
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      setSelectedPlan(plan);
                      setShowPurchaseModal(true);
                    }}
                  >
                    Выбрать
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle>VDS Тарифы</CardTitle>
              <CardDescription>В разработке</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">Скоро</Badge>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex h-screen">
          <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
            <div className="p-4 border-b border-sidebar-border">
              <h2 className="font-bold text-lg text-sidebar-foreground">УПРАВЛЕНИЕ СЕРВЕРОМ</h2>
            </div>
            <nav className="flex-1 p-2">
              <button 
                onClick={() => setActiveTab('overview')} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${activeTab === 'overview' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent/50'}`}
              >
                <Icon name="BarChart3" className="w-5 h-5" />
                Общие сведения
              </button>
              <button 
                onClick={() => setActiveTab('console')} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${activeTab === 'console' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent/50'}`}
              >
                <Icon name="Terminal" className="w-5 h-5" />
                Консоль
              </button>
              <button 
                onClick={() => setActiveTab('files')} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${activeTab === 'files' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent/50'}`}
              >
                <Icon name="FolderOpen" className="w-5 h-5" />
                Файловый менеджер
              </button>
              <button 
                onClick={() => setActiveTab('database')} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${activeTab === 'database' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent/50'}`}
              >
                <Icon name="Database" className="w-5 h-5" />
                Базы данных
              </button>
              <button 
                onClick={() => setActiveTab('backups')} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${activeTab === 'backups' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent/50'}`}
              >
                <Icon name="Archive" className="w-5 h-5" />
                Бэкапы
              </button>
              <button 
                onClick={() => setActiveTab('access')} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${activeTab === 'access' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent/50'}`}
              >
                <Icon name="Users" className="w-5 h-5" />
                Совместный доступ
              </button>
              <button 
                onClick={() => setActiveTab('settings')} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${activeTab === 'settings' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent/50'}`}
              >
                <Icon name="Settings" className="w-5 h-5" />
                Настройки
              </button>
              {activeCodes.includes('adminmehagost4') && (
                <button 
                  onClick={() => setActiveTab('logs')} 
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${activeTab === 'logs' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent/50'}`}
                >
                  <Icon name="FileText" className="w-5 h-5" />
                  Логи
                </button>
              )}
              <button 
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
              >
                <Icon name="HelpCircle" className="w-5 h-5" />
                Нужна помощь?
              </button>
            </nav>
            <div className="p-4 border-t border-sidebar-border">
              <Button variant="outline" size="sm" className="w-full" onClick={() => setShowDashboard(false)}>
                <Icon name="ArrowLeft" className="w-4 h-4 mr-2" />
                К тарифам
              </Button>
            </div>
          </aside>

          <main className="flex-1 flex flex-col">
            <header className="h-16 border-b border-border px-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant={currentServer?.status === 'online' ? 'default' : 'secondary'} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${currentServer?.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                  {currentServer?.status === 'online' ? 'Онлайн' : 'Оффлайн'}
                </Badge>
                <span className="text-sm text-muted-foreground">{currentServer?.domain}</span>
              </div>
              <div className="text-xl font-bold text-primary">{currentServer?.plan}</div>
            </header>

            <div className="flex-1 p-6 overflow-auto">
              {activeTab === 'overview' && currentServer && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">CPU</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{currentServer.cpu.toFixed(1)}%</div>
                        <div className="w-full bg-muted rounded-full h-2 mt-2">
                          <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${currentServer.cpu}%` }} />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Оперативная память</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{currentServer.ram.toFixed(1)}%</div>
                        <div className="w-full bg-muted rounded-full h-2 mt-2">
                          <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${currentServer.ram}%` }} />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Диск</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{currentServer.disk.toFixed(1)}%</div>
                        <div className="w-full bg-muted rounded-full h-2 mt-2">
                          <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${currentServer.disk}%` }} />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Информация о сервере</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Тариф:</span>
                        <span className="font-medium">{currentServer.plan}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Локация:</span>
                        <span className="font-medium">{currentServer.location === 'moscow' ? 'Москва' : currentServer.location === 'europe' ? 'Европа' : 'Армения'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Домен:</span>
                        <span className="font-medium">{currentServer.domain}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'console' && (
                <div className="space-y-4">
                  {maintenanceMode && (
                    <Card className="border-yellow-500 bg-yellow-500/10">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-yellow-500">
                          <Icon name="AlertTriangle" className="w-5 h-5" />
                          <span className="font-medium">Технические работы: консоль недоступна</span>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  <div className="flex gap-2">
                    <Button onClick={() => handleServerAction('start')} disabled={currentServer?.status === 'online' || maintenanceMode}>
                      <Icon name="Play" className="w-4 h-4 mr-2" />
                      Старт
                    </Button>
                    <Button onClick={() => handleServerAction('stop')} disabled={currentServer?.status === 'offline'} variant="destructive">
                      <Icon name="Square" className="w-4 h-4 mr-2" />
                      Стоп
                    </Button>
                    <Button onClick={() => handleServerAction('restart')} disabled={currentServer?.status === 'offline' || maintenanceMode} variant="secondary">
                      <Icon name="RotateCw" className="w-4 h-4 mr-2" />
                      Рестарт
                    </Button>
                  </div>
                  <Card className="bg-black/90 border-muted">
                    <CardContent className="p-4">
                      <ScrollArea className="h-96">
                        <div className="font-mono text-sm space-y-1">
                          {consoleOutput.map((line, i) => (
                            <div key={i} className="text-green-400">{line}</div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'files' && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button>
                      <Icon name="Upload" className="w-4 h-4 mr-2" />
                      Загрузить файл
                    </Button>
                    <Button variant="outline">
                      <Icon name="FolderPlus" className="w-4 h-4 mr-2" />
                      Создать папку
                    </Button>
                  </div>
                  <Card>
                    <CardContent className="p-0">
                      <div className="divide-y divide-border">
                        {files.map((file, i) => (
                          <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <Icon name={file.type === 'folder' ? 'Folder' : 'File'} className="w-5 h-5 text-primary" />
                              <div>
                                <div className="font-medium">{file.name}</div>
                                {file.size && <div className="text-sm text-muted-foreground">{file.size}</div>}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {file.type === 'file' && (
                                <Button size="sm" variant="outline" onClick={() => handleFileAction(file, 'view')}>
                                  <Icon name="Eye" className="w-4 h-4" />
                                </Button>
                              )}
                              <Button size="sm" variant="destructive" onClick={() => handleFileAction(file, 'delete')}>
                                <Icon name="Trash2" className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'database' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Управление базами данных</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Здесь можно создавать и управлять базами данных для вашего сервера</p>
                    <Button>
                      <Icon name="Plus" className="w-4 h-4 mr-2" />
                      Создать БД
                    </Button>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'backups' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Резервные копии</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Создавайте бэкапы вашего сервера для безопасности данных</p>
                    <Button>
                      <Icon name="Download" className="w-4 h-4 mr-2" />
                      Создать бэкап
                    </Button>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'access' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Совместный доступ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Предоставьте доступ другим пользователям к управлению сервером</p>
                    <div className="flex gap-2">
                      <Input placeholder="Email пользователя" />
                      <Button>Добавить</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>SFTP подключение</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Хост</Label>
                        <Input value={currentServer?.domain} readOnly />
                      </div>
                      <div>
                        <Label>Порт</Label>
                        <Input value="22" readOnly />
                      </div>
                      <div>
                        <Label>Пользователь</Label>
                        <Input value="root" readOnly />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Java версия</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Select defaultValue="java17">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="java8">Java 8</SelectItem>
                          <SelectItem value="java11">Java 11</SelectItem>
                          <SelectItem value="java17">Java 17</SelectItem>
                          <SelectItem value="java21">Java 21</SelectItem>
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'logs' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Логи действий в реальном времени</CardTitle>
                    <CardDescription>Все действия пользователей на сайте</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      <div className="space-y-2 font-mono text-sm">
                        <div>[{new Date().toISOString()}] Пользователь открыл раздел тарифов</div>
                        <div>[{new Date().toISOString()}] Пользователь выбрал тариф: Золото</div>
                        <div>[{new Date().toISOString()}] Создан новый сервер: srv-{Date.now()}</div>
                        <div>[{new Date().toISOString()}] Пользователь открыл консоль</div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        </div>
      )}

      <Dialog open={showPurchaseModal} onOpenChange={setShowPurchaseModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Покупка тарифа: {selectedPlan?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Локация</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="moscow">Москва</SelectItem>
                  <SelectItem value="europe">Европа</SelectItem>
                  <SelectItem value="armenia">Армения</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Способ оплаты</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите способ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sbp">СБП</SelectItem>
                  <SelectItem value="tbank">Т-Банк</SelectItem>
                  <SelectItem value="yoomoney">ЮМани</SelectItem>
                  <SelectItem value="sberkids">СберKids</SelectItem>
                  <SelectItem value="alfa">Альфа-Банк</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Номер карты</Label>
              <Input 
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={e => setCardNumber(e.target.value)}
                maxLength={19}
              />
            </div>
            <div className="flex justify-between items-center pt-4 border-t">
              <span className="font-medium">Итого:</span>
              <span className="text-2xl font-bold">{selectedPlan?.price}.00₽</span>
            </div>
            <Button className="w-full" onClick={handlePurchase}>Оплатить</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Профиль</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Баланс</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">{balance.toFixed(2)}₽</div>
                <Button>
                  <Icon name="Plus" className="w-4 h-4 mr-2" />
                  Пополнить
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Мои серверы</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{servers.length} / 5</div>
                <p className="text-sm text-muted-foreground">Максимум 5 серверов</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Промокод</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Введите промокод"
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value)}
                  />
                  <Button onClick={handlePromoCode}>Применить</Button>
                </div>
                {activeCodes.length > 0 && (
                  <div className="mt-4 space-y-1">
                    <p className="text-sm text-muted-foreground">Активные промокоды:</p>
                    {activeCodes.map(code => (
                      <Badge key={code} variant="secondary">{code}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редактирование: {selectedFile?.name}</DialogTitle>
          </DialogHeader>
          <Textarea 
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
            className="font-mono min-h-[300px]"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSelectedFile(null)}>Отмена</Button>
            <Button onClick={saveFile}>Сохранить</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
