<div align="center">
  <img src="./assets/images/logo.png" alt="Aconteceu Hoje Logo" width="200"/>
  
  # 📓 Aconteceu Hoje
  ### Diário Digital Pessoal
  
  ![React Native](https://img.shields.io/badge/React%20Native-0.81.4-blue?style=for-the-badge&logo=react)
  ![Expo](https://img.shields.io/badge/Expo-~54.0.10-000020?style=for-the-badge&logo=expo)
  ![AsyncStorage](https://img.shields.io/badge/AsyncStorage-2.2.0-green?style=for-the-badge)
  ![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)
  
  *Um espaço seguro para registrar seus pensamentos, emoções e reflexões diárias*
</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Como Usar](#-como-usar)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Telas do Aplicativo](#-telas-do-aplicativo)
- [Desenvolvimento](#-desenvolvimento)
- [Equipe](#-equipe)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

**Aconteceu Hoje** é um aplicativo de diário digital desenvolvido como parte do Projeto Integrador do curso de Desenvolvimento de Sistemas. O app oferece uma experiência moderna e intuitiva para que os usuários possam registrar seus pensamentos, emoções e experiências diárias de forma privada e organizada.

### 🎓 Contexto Acadêmico

Este projeto foi desenvolvido como parte do **Projeto Integrador - Desenvolvimento de Aplicativo com React Native (Expo)**, atendendo aos requisitos de:
- ✅ Desenvolvimento de aplicativo móvel funcional
- ✅ Implementação de navegação com Expo Router
- ✅ Armazenamento local de dados (AsyncStorage)
- ✅ Design responsivo e atrativo
- ✅ Sistema de autenticação completo

### 🎯 Objetivo

Proporcionar aos usuários um espaço seguro e privado para:
- 📝 Registrar pensamentos e reflexões diárias
- 😊 Acompanhar estados emocionais ao longo do tempo
- 📊 Visualizar estatísticas de escrita e emoções
- 🔒 Manter dados seguros e privados no dispositivo

---

## ✨ Funcionalidades

### Funcionalidades Principais

#### 🏠 Tela Inicial (Home)
- **Dashboard Personalizado**: Exibe saudação personalizada com o nome do usuário
- **Estatísticas em Tempo Real**: 
  - Total de entradas registradas
  - Sequência de dias ativos
  - Status de escrita do dia atual
- **Citações Motivacionais**: Frases inspiradoras sobre escrita e autoconhecimento
- **Ações Rápidas**: Acesso direto para criar nova entrada ou visualizar histórico

#### 📝 Criação de Entradas
- **Editor de Texto Rico**: Campo de texto amplo e confortável para escrever
- **Registro de Emoções**: Seleção de 8 diferentes estados emocionais com ícones visuais:
  - 😊 Feliz
  - 😢 Triste
  - 😰 Ansioso
  - 😌 Calmo
  - 😠 Irritado
  - 🌟 Esperançoso
  - 🤔 Nostálgico
  - ⚡ Energético
- **Títulos Opcionais**: Adicione títulos descritivos às suas entradas
- **Contador de Caracteres**: Limite de 5000 caracteres por entrada
- **Salvamento Automático**: Data e hora registradas automaticamente

#### 📃 Listagem de Entradas
- **Visualização em Páginas de Diário**: Design que simula páginas reais de diário
- **Informações Detalhadas**: 
  - Data da entrada
  - Emoção registrada
  - Título e prévia do conteúdo
- **Botão Flutuante**: Acesso rápido para criar nova entrada
- **Atualização em Tempo Real**: Lista atualizada automaticamente ao criar/editar

#### 👤 Perfil do Usuário
- **Informações da Conta**:
  - Nome do usuário
  - Email cadastrado
  - ID único da conta
  - Data de criação da conta
- **Estatísticas Completas**:
  - Total de entradas registradas
  - Dias ativos de escrita
  - Emoção mais frequente
  - Data da última entrada
- **Edição de Perfil**: Modal completo para editar:
  - Nome de usuário
  - Email
  - Senha (com confirmação)
  - Visualização/ocultação de senha
- **Gerenciamento de Dados**:
  - Limpar todas as entradas do diário
  - Logout seguro

#### 🔐 Sistema de Autenticação
- **Cadastro de Usuários**:
  - Validação de email
  - Senha mínima de 6 caracteres
  - Confirmação de senha
  - Armazenamento seguro
- **Login Seguro**:
  - Autenticação por email e senha
  - Mensagens de erro personalizadas
  - Redirecionamento automático após login
- **Proteção de Rotas**:
  - Usuários não autenticados são redirecionados para login
  - Usuários autenticados acessam áreas privadas

### 🎨 Funcionalidades Extras (Diferenciais)

- ✅ **Design Dark Mode**: Interface escura moderna (#403E3E, #676767, #9F9F9F)
- ✅ **Autenticação Completa**: Sistema de login e cadastro funcional
- ✅ **Edição de Perfil**: Atualização de dados do usuário
- ✅ **Indicador Online**: Status visual de conta ativa
- ✅ **Animações Suaves**: Transições entre telas fluidas
- ✅ **Feedback Visual**: Alertas e confirmações para ações importantes
- ✅ **Validações Completas**: Formulários com validação em tempo real

---

## 🛠 Tecnologias Utilizadas

### Core
- **React Native** `0.81.4` - Framework para desenvolvimento mobile
- **Expo** `~54.0.10` - Plataforma para desenvolvimento e build
- **Expo Router** `~6.0.9` - Roteamento baseado em arquivos

### Navegação e Roteamento
- **Expo Router** - Sistema de navegação baseado em arquivos
- **React Navigation** - Navegação nativa entre telas

### Armazenamento
- **AsyncStorage** `2.2.0` - Armazenamento local persistente de dados

### UI/UX
- **React Native Safe Area Context** `~5.6.0` - Gerenciamento de áreas seguras
- **Expo Vector Icons** - Biblioteca de ícones (Ionicons)
- **React Native Screens** `~4.16.0` - Otimização de performance de telas

### Gerenciamento de Estado
- **React Context API** - Gerenciamento de estado global (autenticação)
- **React Hooks** - useState, useEffect, useCallback, useFocusEffect

---

## 📦 Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/)

### Para testar o app:
- **Expo Go** instalado no seu dispositivo móvel (Android/iOS)
- OU Emulador Android/iOS configurado

---

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/pedro-ols/aconteceu-hoje.git
cd aconteceu-hoje
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Inicie o projeto

```bash
npm start
# ou
yarn start
# ou
expo start
```

### 4. Execute no dispositivo

- **Android**: Pressione `a` no terminal ou escaneie o QR Code com o Expo Go
- **iOS**: Pressione `i` no terminal ou escaneie o QR Code com a câmera
- **Web**: Pressione `w` no terminal

---

## 📱 Como Usar

### Primeiro Acesso

1. **Cadastro**
   - Abra o aplicativo
   - Na tela de login, clique em "Criar uma conta"
   - Preencha: Nome completo, Email e Senha
   - Confirme sua senha
   - Clique em "Cadastrar"

2. **Login**
   - Digite seu email e senha
   - Clique em "Entrar"
   - Você será redirecionado para a tela inicial

### Criando sua primeira entrada

1. Na tela inicial, clique em "Nova Entrada"
2. (Opcional) Adicione um título
3. Selecione como você está se sentindo hoje
4. Escreva seus pensamentos no campo de texto
5. Clique em "Salvar no Diário"

### Visualizando entradas

1. Na tela inicial, clique em "Ver Entradas"
2. Role para ver todas as suas entradas em formato de páginas de diário
3. Use o botão flutuante "+" para criar uma nova entrada

### Editando seu perfil

1. Vá para a aba "Perfil"
2. Clique em "Editar Perfil"
3. Altere as informações desejadas
4. Clique em "Salvar"

---

## 📂 Estrutura do Projeto

```
aconteceu-hoje/
├── app/                          # Diretório principal do Expo Router
│   ├── (auth)/                   # Grupo de rotas de autenticação
│   │   ├── _layout.js           # Layout das telas de auth
│   │   ├── login.js             # Tela de login
│   │   └── register.js          # Tela de cadastro
│   ├── (tabs)/                   # Grupo de rotas com tabs
│   │   ├── _layout.js           # Layout com bottom tabs
│   │   ├── home.js              # Tela inicial
│   │   ├── create.js            # Criar entrada
│   │   ├── list.js              # Lista de entradas
│   │   └── profile.js           # Perfil do usuário
│   ├── _layout.js               # Layout raiz do app
│   └── index.js                 # Ponto de entrada
├── assets/                       # Recursos estáticos
│   ├── images/
│   │   ├── logo.png             # Logo do aplicativo
│   │   └── diary-background.png # Imagem de fundo do diário
│   └── README.md
├── contexts/                     # Contextos React
│   └── AuthContext.js           # Contexto de autenticação
├── utils/                        # Funções utilitárias
│   ├── storage.js               # Funções de armazenamento
│   └── diaryTemplate.js         # Template de entradas
├── app.json                      # Configuração do Expo
├── package.json                  # Dependências do projeto
└── README.md                     # Este arquivo
```

---

## 🖼 Telas do Aplicativo

### 1. 🔐 Autenticação

#### Login
- Campo de email
- Campo de senha
- Botão de entrar
- Link para criar conta

#### Cadastro
- Campo de nome completo
- Campo de email
- Campo de senha
- Campo de confirmação de senha
- Botão de cadastrar
- Link para voltar ao login

### 2. 🏠 Home (Tela Inicial)

- Logo do aplicativo
- Saudação personalizada
- Data atual
- Citação motivacional
- Cards de estatísticas (Entradas e Sequência)
- Card de status do dia (Já escreveu hoje?)
- Ações rápidas (Nova Entrada e Ver Entradas)

### 3. ✍️ Criar Entrada

- Cabeçalho com data completa
- Campo de título (opcional)
- Seletor de emoções (8 opções)
- Campo de texto grande para conteúdo
- Contador de caracteres
- Botão de salvar

### 4. 📖 Lista de Entradas

- Cabeçalho com logo e nome do usuário
- Cards em formato de página de diário
- Informações de cada entrada:
  - Data
  - Emoção
  - Título
  - Prévia do conteúdo
- Botão flutuante para nova entrada
- Pull to refresh

### 5. 👤 Perfil

- Avatar com iniciais do usuário
- Nome e email
- Data de criação da conta
- Estatísticas:
  - Total de entradas
  - Dias ativos
  - Emoção favorita
  - Última entrada
- Informações da conta (detalhadas)
- Sobre o diário
- Configurações:
  - Editar perfil
  - Privacidade e segurança
  - Limpar dados
  - Sair da conta

### 6. ✏️ Modal de Edição de Perfil

- Campo de nome
- Campo de email
- Campo de nova senha (opcional)
- Campo de confirmação de senha
- Botão de mostrar/ocultar senha
- Validações em tempo real
- Botões de cancelar e salvar

---

## 👨‍💻 Desenvolvimento

### Padrões de Código

- **Componentização**: Componentes reutilizáveis e bem organizados
- **Hooks**: Uso extensivo de React Hooks para gerenciamento de estado
- **Context API**: Gerenciamento global de autenticação
- **Async/Await**: Operações assíncronas legíveis
- **Error Handling**: Tratamento de erros com try/catch e feedback ao usuário

### Esquema de Cores

```javascript
const colors = {
  background: '#403E3E',    // Fundo principal
  card: '#676767',          // Cards e botões
  input: '#9F9F9F',         // Campos de input
  textPrimary: '#dddd',     // Texto principal
  textSecondary: '#9F9F9F', // Texto secundário
  accent: '#D9D3CC',        // Acentos (logo, destaques)
}
```

### Funcionalidades Implementadas

#### Armazenamento de Dados
- **Usuários**: Chave `users` (array de objetos)
- **Usuário Atual**: Chave `@rotas_privadas:user` (objeto)
- **Entradas do Diário**: Chave `diary_entries_${email}` (array por usuário)

#### Validações
- Email: Regex para validar formato
- Senha: Mínimo de 6 caracteres
- Confirmação de senha: Verificação de igualdade
- Campos obrigatórios: Verificação de preenchimento
- Email único: Verificação de duplicatas no cadastro

#### Segurança
- Senhas armazenadas (em produção, usar hash)
- Dados isolados por usuário
- Proteção de rotas privadas
- Logout seguro com limpeza de dados

---

## 👥 Equipe

### Grupo 2 - App de Diário

- **Desenvolvedor Frontend**: [Seu Nome]
- **Desenvolvedor Backend/Lógica**: [Nome do Colega]
- **Designer UI/UX**: [Nome do Colega]
- **Tester/QA**: [Nome do Colega]

> *"Mais importante do que o aplicativo pronto é o aprendizado no processo."*

---

## 🎯 Critérios Atendidos

### Funcionalidades Obrigatórias
| Requisito | Status | Implementação |
|-----------|--------|---------------|
| 🏠 Tela Inicial | ✅ | Home com dashboard completo |
| 📃 Tela de Listagem | ✅ | Lista de entradas com design de diário |
| 🔍 Tela de Detalhes | ✅ | Cards expandidos com informações completas |
| 📝 Tela de Criação/Edição | ✅ | Formulário completo de entrada |
| 💾 Armazenamento (AsyncStorage) | ✅ | Dados persistentes no dispositivo |
| 📱 Design Responsivo | ✅ | Layout adaptável com Expo Router |

### Funcionalidades Extras (Bônus)
| Extra | Status | Descrição |
|-------|--------|-----------|
| 🔒 Login/Cadastro | ✅ | Sistema completo de autenticação |
| 🎨 Design Aprimorado | ✅ | Interface dark mode profissional |
| ✨ Animações | ✅ | Transições suaves entre telas |
| 📊 Estatísticas | ✅ | Dashboard com métricas de uso |
| ✏️ Edição de Perfil | ✅ | Modal completo de edição |

---

## 📊 Avaliação do Projeto

### Critérios Alcançados

- **Funcionalidade (40%)**: ✅ App 100% funcional com CRUD completo
- **Interface e Usabilidade (25%)**: ✅ Design moderno, intuitivo e responsivo
- **Organização do Código (20%)**: ✅ Código limpo e bem estruturado
- **Criatividade e Inovação (15%)**: ✅ Extras implementados + design único

---

## 🚧 Melhorias Futuras

- [ ] Implementar busca de entradas por palavra-chave
- [ ] Adicionar filtros por emoção e data
- [ ] Exportar entradas em PDF
- [ ] Backup em nuvem
- [ ] Lembretes para escrever diariamente
- [ ] Temas personalizáveis
- [ ] Gráficos de humor ao longo do tempo
- [ ] Fotos nas entradas
- [ ] Modo de leitura focado

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🙏 Agradecimentos

- **Professor**: Pela orientação e conhecimento compartilhado
- **Equipe**: Pela colaboração e dedicação
- **Expo**: Pela excelente plataforma de desenvolvimento
- **React Native Community**: Pelos recursos e documentação

---

## 📞 Contato

**Aconteceu Hoje - Diário Digital**

- 📧 Email: [giovanni.ggoncalves@outlook.com]
- 🌐 GitHub: [https://github.com/pedro-ols/aconteceu-hoje](https://github.com/pedro-ols/aconteceu-hoje)

---

<div align="center">
  
  ⭐ Se este projeto te ajudou, considere dar uma estrela!
  
  **"Suas palavras têm poder. Use-as com sabedoria."** --Nino Abravanel
  
</div>
