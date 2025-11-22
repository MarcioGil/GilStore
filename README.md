



# GilStore – Mini E-commerce React


## Sumário

- [Funcionalidades](#funcionalidades)
- [Arquitetura e Estrutura](#arquitetura-e-estrutura)
- [Site Publicado](#site-publicado)
- [Exemplo de Uso](#exemplo-de-uso)
- [Como Fazer o Deploy](#como-fazer-o-deploy)
- [Como Contribuir](#como-contribuir)
- [Licença](#licenca)
- [Apresentação](#apresentacao)
- [PWA: Progressive Web App](#pwa-progressive-web-app)


## Funcionalidades

- Catálogo de produtos dinâmico
- Filtros avançados (nome, categoria, preço, avaliação, ordenação)
- Carrinho de compras com edição
- Checkout com resumo
- Wishlist (favoritos)
- Histórico de navegação e compras
- Tradução de nomes e categorias para portugues
- Layout responsivo e acessível
- Deploy fácil no GitHub Pages
- PWA: instalável e offline


## Arquitetura e Estrutura

O projeto segue a arquitetura padrão de aplicações React modernas:

- **src/**: Código-fonte principal
  - **components/**: Componentes reutilizáveis (ProductCard, Cart, Modal, etc.)
  - **pages/**: Páginas principais (Home, Checkout)
  - **context/**: Contextos globais (Carrinho, Usuário)
  - **services/**: Integração com API (Fake Store/json-server)
  - **assets/**: Imagens e ícones
- **public/**: Arquivos estáticos, manifest.json, index.html
- **db3.json**: Mock backend (json-server)
- **package.json**: Scripts, dependências e configurações



![Build Status](https://img.shields.io/github/actions/workflow/status/MarcioGil/GilStore/ci.yml?branch=main)
![License](https://img.shields.io/github/license/MarcioGil/GilStore)
![Repo Size](https://img.shields.io/github/repo-size/MarcioGil/GilStore)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)


## Site Publicado

[Acesse a loja online](https://marciogil.github.io/GilStore/)


Projeto desenvolvido com foco em acessibilidade, performance e experiência do usuário, utilizando:

- **React**: Componentização, semântica (header, main, button, form), navegação por teclado e foco gerenciado.
- **Tailwind CSS**: Contraste, responsividade, foco visível (`focus:outline`, `focus:ring`), classes utilitárias para acessibilidade visual.
- **Aria-labels, role e tabIndex**: Elementos interativos possuem atributos ARIA (`aria-label`, `role`, `tabIndex`) para leitores de tela e navegação assistida.
- **Labels em formulários**: Todos os campos possuem labels associadas para melhor compreensão e navegação por leitores de tela.
- **Mensagens de erro e feedbacks visuais**: Informações claras e acessíveis para todos os usuários, inclusive em estados de erro ou carregamento.
- **Testes manuais**: O site foi testado com navegação por teclado (Tab, Enter, Esc), leitores de tela e navegação por mouse.
- **PWA**: Funciona offline, pode ser instalado como app, com manifesto customizado.


### Modal de Produto: Acessibilidade e Navegação

- Modal centralizado, acessível e com foco gerenciado.
- Pode ser fechado de três formas:
  - Clicando no botão "X" (Fechar)
  - Pressionando a tecla **Esc**
  - Clicando fora do modal (na área escura)
- Foco é mantido no modal enquanto aberto.
- Possui `aria-modal="true"` e `role="dialog"` para leitores de tela.


### Como usar o site de forma acessível

- Navegue por Tab entre cards, botões e campos.
- Use Enter/Espaço para ativar botões e abrir modais.
- Todos os campos possuem labels e podem ser preenchidos por teclado.
- Checkout 100% navegável e acessível.












## Exemplo de Uso


1. Finalize a compra e veja o estoque ser atualizado em tempo real.
2. Confira o estoque na tela do produto ou via API (`/products`).


**Como resetar o estoque?**

Edite o arquivo `db3.json` e reinicie o mock backend (`npx json-server --watch db3.json --port 3002`).

- O frontend consome a API local do mock backend (`db3.json`).
- Ao finalizar uma compra, o estoque de cada produto é decrementado automaticamente via API.
- Você pode editar o arquivo `db3.json` para resetar ou ajustar estoques manualmente.


### Testando a integração

1. Inicie o frontend normalmente (`npm start`).
2. Inicie o mock backend:
  ```bash
  npx json-server --watch db3.json --port 3002
  ```
3. Adicione produtos ao carrinho e finalize a compra.
4. O estoque será atualizado em tempo real no backend mock.
5. Para ver o estoque atualizado, recarregue a página ou consulte [http://localhost:3002/products](http://localhost:3002/products).


---


## Como Fazer o Deploy


1. Configure o campo `homepage` no `package.json`:

  ```json
  "homepage": "https://MarcioGil.github.io/GilStore"
  ```

1. Instale a dependência gh-pages:

  ```bash
  npm install --save gh-pages
  ```

1. Adicione o script de deploy ao `package.json`:

  ```json
  "scripts": {
    "deploy": "gh-pages -d build"
  }
  ```

1. Execute o deploy:

  ```bash
  npm run deploy
  ```

O site estará disponível em: [https://marciogil.github.io/GilStore](https://marciogil.github.io/GilStore)




## Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b minha-feature`
3. Faça suas alterações
4. Envie um pull request




### Regras para Colaboradores

- Teste antes de enviar PR
- Respeite a licença e o código de conduta


## Licenca

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.



## Apresentacao


Olá! Eu sou **Márcio Gil**, Embaixador da turma 14 do DIO Campus Expert, estudante de Engenharia de Software, entusiasta de Educação, Inovação, Tecnologia e defensor da Justiça Social.



Fique à vontade para entrar em contato e contribuir!

---


> Projeto desenvolvido para portfólio, estudos e colaboração aberta.


## PWA: Progressive Web App

- **Instalável**: Pode ser adicionada à tela inicial do celular ou desktop, funcionando como um app nativo.
- **Offline**: Funciona sem conexão após o primeiro acesso, graças ao service worker e cache inteligente.
- **Performance**: Carregamento rápido, otimização de bundle e recursos, experiência fluida mesmo em redes lentas.
- **Manifesto customizado**: Ícones, nome, tema e descrição próprios da GilStore.
- **Prompt de instalação**: Usuário recebe sugestão para instalar no dispositivo.

> Teste: Acesse pelo Chrome/Edge no celular ou desktop, clique em "Instalar GilStore" na barra de endereço ou menu do navegador.
