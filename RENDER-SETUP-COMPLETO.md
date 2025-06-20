# Cartão + Vidah - Setup Completo Render

## 🚀 Deploy no Render - Guia Completo

### **1. Preparação do Projeto**
1. Extraia o ZIP `cartao-vidah-render.zip`
2. Renomeie `package-render.json` para `package.json`
3. Upload para seu GitHub

### **2. Criar Conta e Conectar GitHub**
1. Acesse: https://render.com
2. Crie conta (gratuita)
3. Conecte com GitHub: Settings → GitHub → Connect Account

### **3. Criar PostgreSQL Database**
1. Dashboard Render → "New +"
2. Selecione **"PostgreSQL"**
3. Configurações:
   ```
   Name: cartao-vidah-db
   Database: cartao_vidah
   User: cartao_vidah_user
   Region: Oregon (ou mais próximo)
   Plan: Free
   ```
4. Clique **"Create Database"**
5. **IMPORTANTE:** Copie a **Internal Database URL** gerada

### **4. Criar Web Service**
1. Dashboard → "New +" → **"Web Service"**
2. Conecte ao repositório GitHub
3. Configurações:
   ```
   Name: cartao-vidah
   Environment: Node
   Region: Oregon (mesma do banco)
   Branch: main
   Root Directory: (deixe vazio)
   Build Command: npm install && npm run build
   Start Command: npm start
   Plan: Free
   ```

### **5. Configurar Variáveis de Ambiente**
No Web Service criado, vá em **"Environment"** e adicione:

```bash
NODE_ENV=production
DATABASE_URL=[COLE_AQUI_A_URL_DO_POSTGRES]
JWT_SECRET=cartao-vidah-super-secret-key-2025-secure
WHATSAPP_PHONE_NUMBER=5516997782211
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=vidah2025
```

**IMPORTANTE:** Substitua `[COLE_AQUI_A_URL_DO_POSTGRES]` pela URL interna do PostgreSQL.

### **6. Deploy Automático**
1. Clique **"Create Web Service"**
2. Aguarde build (5-10 minutos)
3. Status deve ficar **"Live"** ✅

### **7. Configurações de Sistema Render**

**Node.js Version:** 18.x ou superior
**npm Version:** 9.x ou superior
**Build Environment:**
- CPU: 0.5 vCPU
- RAM: 512 MB
- Disco: 1 GB

**Runtime Environment:**
- CPU: 0.1 vCPU  
- RAM: 512 MB
- Auto-deploy: Enabled
- Health Check: Automático (endpoint `/health`)

### **8. URLs de Acesso**

Após deploy bem-sucedido:
- **Site:** `https://cartao-vidah.onrender.com`
- **Admin:** `https://cartao-vidah.onrender.com/admin/login`
- **Health Check:** `https://cartao-vidah.onrender.com/health`
- **API:** `https://cartao-vidah.onrender.com/api/`

### **9. Credenciais de Acesso**
```
Usuário: admin
Senha: vidah2025
```

### **10. Variáveis Completas de Ambiente**

```bash
# Ambiente
NODE_ENV=production

# Database (substituir pela URL real do PostgreSQL)
DATABASE_URL=postgresql://cartao_vidah_user:senha@dpg-xxx-oregon-postgres.render.com/cartao_vidah

# Segurança
JWT_SECRET=cartao-vidah-super-secret-key-2025-secure

# WhatsApp
WHATSAPP_PHONE_NUMBER=5516997782211

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=vidah2025

# Render (automáticas)
PORT=10000
RENDER=true
```

### **11. Recursos Incluídos**

✅ **Sistema completo de planos** (Individual, Familiar, Empresarial)
✅ **Dashboard administrativo** funcional
✅ **Integração WhatsApp** (5516997782211)
✅ **Captura de leads** automática
✅ **Sistema de parceiros** (hospitais, clínicas, óticas)
✅ **Galeria de médicos** (Família Haddad + especialistas)
✅ **Sistema de assinaturas** com pagamento
✅ **Cartão digital** com QR Code
✅ **SSL/HTTPS** automático
✅ **CDN** global
✅ **Auto-scaling** conforme demanda

### **12. Monitoramento**

No dashboard Render você pode acompanhar:
- **Logs em tempo real**
- **Métricas de performance**
- **Status do serviço**
- **Uso de recursos**
- **Deploys automáticos**

### **13. Domínio Personalizado (Opcional)**

Para usar seu domínio .com.br:
1. Web Service → Settings → Custom Domains
2. Adicione: `seudominio.com.br`
3. Configure DNS:
   ```
   Tipo: CNAME
   Nome: @
   Valor: cartao-vidah.onrender.com
   ```

### **14. Troubleshooting**

**Se o deploy falhar:**
1. Verifique logs em "Events"
2. Confirme variáveis de ambiente
3. Teste URL do PostgreSQL
4. Redeploy manual se necessário

**Contato WhatsApp:** 5516997782211

Tudo configurado para funcionamento completo no Render!