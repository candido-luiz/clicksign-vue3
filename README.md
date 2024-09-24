# clicksign-vue3

Esta aplicação é um gerenciador de projetos que permite realizar operações de CRUD (Criar, Ler, Atualizar e Deletar) de forma simples e eficiente. O desenvolvimento foi realizado utilizando as seguintes tecnologias:

- **Vue 3 com Vite e TypeScript**: Para criar uma interface interativa e responsiva.
- **Pinia**: Utilizado para gerenciar estados na aplicação, junto com um plugin também criado com o pinia que armazena os dados no `localStorage`.
- **Vue Router**: Para gerenciar o roteamento entre as diferentes páginas da aplicação.
- **Bootstrap**: Escolhido como framework para desenvolver a interface, devido à sua simplicidade na criação de componentes e fácil customização. O Sass foi utilizado para personalizar o estilo dos componentes.
- **Docker**: Utilizado para facilitar a execução do ambiente de desenvolvimento.
- **Vue Test Utils e Vitest**: Ferramentas utilizadas para realizar testes nos componentes Vue e na store do Pinia.
- **formkit/auto-animate**: Biblioteca utilizada como plugin para criar uma diretiva de facilitação de animação das transições em tela.
- **Github Actions**: Utilizado para realizar o deploy da aplicação, que se encontra [nesse endereço](https://candido-luiz.github.io/clicksign-vue3/).

## Configuração do Projeto

### Pré-requisitos
O projeto precisará de uma das duas opções abaixo para ser executado:
- **Node.js 18.3 ou maior**: Conforme o [recomendado na documentação do Vue](https://vuejs.org/guide/quick-start.html#:~:text=Install%20Node.js%20version%2018.3%20or%20higher)
- **Docker e Docker compose**: Alternativamente, se tiver o Docker e o Docker Compose instalados, poderá executar o ambiente de desenvolvimento usando o docker compose. 

### Instalação e execução do ambiente de desenvolvimento com o Docker:
Na pasta raiz do projeto, executar o comando:

```
docker compose up
```
### Instalação e execução com a versão correta do Node.js:

Para instalar as dependências do projeto, execute:

```
npm install
```

Para executar o ambiente de desenvolvimento:

```
npm run dev
```
### Fazer o build da aplicação

Para executar os testes, utilize o comando:
```
npm run build
```

### Executar testes unitários

Para executar os testes, utilize o comando:
```
npm run test
```


