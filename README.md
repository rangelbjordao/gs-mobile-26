# 📱 OrbitPass

Aplicativo mobile desenvolvido com foco em **turismo espacial interplanetário**, permitindo que o usuário explore destinos espaciais, consulte tours disponíveis, realize reservas de viagens e interaja com um assistente virtual inteligente.

---

## Integrantes

- Jhonatta Lima Sandes de Oliveira – RM 560277
- Lucas José Lima – RM 561160
- Rangel Bernardi Jordão – RM 560547

---

## Sobre o Projeto

O **OrbitPass** foi desenvolvido com o objetivo de oferecer uma experiência de turismo espacial através de uma aplicação mobile moderna e intuitiva.

O aplicativo permite que o usuário:

- Explorar destinos espaciais disponíveis;
- Consultar informações detalhadas sobre os tours;
- Consultar datas de partida para diferentes missões;
- Realizar reservas de viagens espaciais;
- Gerenciar suas reservas diretamente pelo aplicativo;
- Interagir com um assistente virtual especializado em turismo espacial.

O app combina **interface mobile + integração com API REST + autenticação segura + inteligência artificial**, proporcionando uma experiência completa para o usuário.

---

## Funcionalidades

### 🚀 Tours Espaciais

- Listagem de destinos disponíveis
- Exibição de detalhes dos tours
- Visualização de datas de partida
- Controle de assentos disponíveis por missão

---

### 🎫 Gerenciamento de Reservas

- Criação de novas reservas
- Consulta de reservas realizadas
- Alteração da data de partida
- Cancelamento de reservas
- Exibição do status da missão

---

### 💳 Checkout da Viagem

- Resumo completo da reserva
- Seleção da data de partida
- Escolha da forma de pagamento
- Validações de preenchimento antes da confirmação

---

### 🤖 OrbitBot (Assistente Virtual)

- Chat integrado ao aplicativo
- Respostas geradas por inteligência artificial
- Suporte ao usuário durante a navegação

---

### 🔐 Autenticação

- Cadastro de usuários
- Login com autenticação JWT
- Persistência de sessão
- Proteção das rotas da aplicação

---

### 👨‍🚀 Perfil do Usuário

- Visualização dos dados da conta
- Acesso à tela Sobre o Aplicativo
- Encerramento seguro da sessão (Logout)

---

### ℹ️ Sobre o Aplicativo

- Exibição da versão atual do aplicativo
- Exibição do commit utilizado na build

---

## 🛠️ Tecnologias Utilizadas

### Frontend (Mobile)

- React Native
- Expo
- TypeScript
- Expo Router
- Axios
- Expo Secure Store
- React Native Safe Area Context
- Expo Vector Icons (Ionicons)

### Backend

- Java
- Spring Boot
- API REST
- PostgreSQL

### Integrações

- API REST OrbitPass
- OrbitBot (IA integrada ao backend)

---

## Como Executar o Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/rangelbjordao/gs-mobile-26.git
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Rodar o projeto

```bash
npx expo start
```

### 4. Executar no dispositivo

O aplicativo pode ser executado através de:

- Android Emulator
- iOS Simulator
- Expo Go
- APK gerado via EAS Build

> Observação:
> O aplicativo já está configurado para consumir a API em ambiente de produção, não sendo necessária a alteração manual de IPs locais.

---

## 🎥 Demonstração

**Link do vídeo:**

[Clique aqui para assistir o vídeo](https://youtu.be/yQNd0TdlaxA)

---

## 📦 APK / Instalação

O aplicativo Android foi gerado utilizando EAS Build.

### APK para instalação

[Instalar aplicativo via Firebase App Distribution](https://appdistribution.firebase.google.com/testerapps/1:534161509897:android:8e422440fbe2216477f2d8/releases/1j5eem48h17p0?utm_source=firebase-console)

---

## Build Android

O projeto utiliza EAS Build para geração do APK Android.

Para gerar um novo build:

```bash
npx eas build --platform android --profile preview
```

---

## ⚠️ Observação sobre a API

A API backend está hospedada no plano gratuito do **Render**.

Por isso, após um período sem uso, o serviço pode entrar em modo de inatividade.

Quando isso acontece, a primeira requisição pode demorar alguns segundos até a API "acordar".

Após a inicialização da API, o funcionamento retorna ao normal.

Caso o aplicativo apresente demora no primeiro acesso, basta aguardar alguns instantes e tentar novamente.
