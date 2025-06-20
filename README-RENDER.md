# Cartão + Vidah - Deploy no Render

Sistema completo de benefícios de saúde pronto para deploy no Render.

## Como Fazer Deploy

### 1. Preparação
- Faça fork ou clone deste repositório no GitHub
- Certifique-se que todos os arquivos estão presentes

### 2. No Render (render.com)
1. Crie conta no Render
2. Conecte sua conta GitHub
3. Clique "New Web Service"
4. Selecione este repositório

### 3. Configurações do Web Service
```
Name: cartao-vidah
Environment: Node
Region: Oregon (ou mais próximo)
Branch: main
Build Command: npm install && npm run build
Start Command: npm start
```

### 4. Adicionar PostgreSQL Database
1. No dashboard, clique "New +"
2. Escolha "PostgreSQL"
3. Nome: cartao-vidah-db
4. Região: mesma do web service

### 5. Variáveis de Ambiente
Adicione estas variáveis no Web Service:
```
NODE_ENV = production
DATABASE_URL = [URL do PostgreSQL criado]
JWT_SECRET = cartao-vidah-super-secret-key-2025-secure
WHATSAPP_PHONE_NUMBER = 5516997782211
ADMIN_USERNAME = admin
ADMIN_PASSWORD_HASH = vidah2025
```

### 6. Deploy
- Clique "Create Web Service"
- Aguarde build e deploy (5-10 minutos)
- Acesse URL fornecida pelo Render

## Acesso
- Site: https://cartao-vidah.onrender.com
- Admin: https://cartao-vidah.onrender.com/admin/login
- Login: admin / vidah2025

## Funcionalidades
- Sistema completo de planos de saúde
- Dashboard administrativo
- Integração WhatsApp
- Captura de leads
- Sistema de parceiros e médicos