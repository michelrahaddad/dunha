# Especificações Técnicas - Render Deploy

## **Requisitos de Sistema**

### **Node.js**
- **Versão:** 18.x ou superior
- **npm:** 9.x ou superior  
- **Arquitetura:** x64

### **Recursos de Hardware (Render Free Tier)**
```
Build Environment:
- CPU: 0.5 vCPU
- RAM: 512 MB
- Disco: 1 GB temporário
- Timeout: 15 minutos

Runtime Environment:
- CPU: 0.1 vCPU
- RAM: 512 MB
- Disco: 1 GB persistente
- Timeout: Ilimitado
```

### **Dependências de Sistema**
- TypeScript transpilação (tsx)
- PostgreSQL client libraries
- Express.js server
- React build tools (Vite)

## **Configuração de Rede**

### **Portas**
- **Aplicação:** Porta dinâmica (process.env.PORT)
- **PostgreSQL:** 5432 (interno Render)
- **HTTPS:** 443 (automático)

### **Domínios**
- **Render subdomain:** `cartao-vidah.onrender.com`
- **Custom domain:** Configurável via DNS CNAME

## **Banco de Dados PostgreSQL**

### **Especificações**
```
Tipo: PostgreSQL 15+
CPU: Compartilhado
RAM: 256 MB
Disco: 1 GB
Conexões: 20 simultâneas
Backup: Automático (7 dias)
```

### **Variáveis de Conexão**
```bash
DATABASE_URL=postgresql://user:pass@host:5432/db
PGHOST=host
PGPORT=5432
PGUSER=user
PGPASSWORD=password
PGDATABASE=database
```

## **Comandos de Build e Deploy**

### **Build Process**
```bash
npm install          # Instala dependências
npm run build        # Compila React app
```

### **Start Process**
```bash
npm start           # Inicia servidor Express
```

## **Variáveis de Ambiente Completas**

### **Sistema**
```bash
NODE_ENV=production
PORT=10000
RENDER=true
```

### **Aplicação**
```bash
DATABASE_URL=postgresql://...
JWT_SECRET=cartao-vidah-super-secret-key-2025-secure
WHATSAPP_PHONE_NUMBER=5516997782211
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=vidah2025
```

## **Health Checks**

### **Endpoints Monitorados**
- `/` - Status básico
- `/health` - Status detalhado
- `/api/health` - Status da API

### **Configuração Auto-healing**
```yaml
Check Interval: 30 segundos
Timeout: 10 segundos
Retries: 3 tentativas
Restart Policy: Automático
```

## **SSL/TLS**

### **Certificados**
- **Tipo:** Let's Encrypt (automático)
- **Renovação:** Automática
- **Redirecionamento:** HTTP → HTTPS

## **CDN e Cache**

### **Static Assets**
- **Cache:** 1 ano para assets
- **Compressão:** Gzip automático
- **CDN:** Global edge locations

## **Limites de Recursos**

### **Free Tier Limits**
```
CPU Time: 750 horas/mês
RAM: 512 MB constante
Bandwidth: 100 GB/mês
Sleep após: 15 min inatividade
Cold start: 10-30 segundos
```

### **Scaling**
- **Horizontal:** 1 instância (free)
- **Vertical:** Fixo (free)
- **Auto-scaling:** Disponível em plans pagos

## **Logs e Monitoramento**

### **Log Retention**
- **Live logs:** Tempo real
- **Histórico:** 7 dias (free)
- **Formato:** JSON estruturado

### **Métricas Disponíveis**
- CPU usage
- Memory usage
- Response time
- Error rate
- Request count

## **Backup e Recuperação**

### **Database Backups**
- **Frequência:** Diário automático
- **Retenção:** 7 dias (free)
- **Restauração:** Manual via dashboard

### **Application Backups**
- **Code:** Git repository
- **Config:** Environment variables
- **Static:** Rebuild automático

Configurações otimizadas para melhor performance no Render Free Tier.