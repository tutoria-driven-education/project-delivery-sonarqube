## Project Delivery

CLI responsável pela entrega manual de projetos.

### Como rodar

- Certifique-se que possui o NodeJS e `yarn` instalado

```bash
npm i -g yarn
```

- Instale as dependências

```bash
yarn install
```

- Adicione a chave de API

Popule a chave `API_KEY` no arquivo `.env` de acordo com o exemplo em `.env.example`.
Consulte seu coordenador para obter a chave de API válida.

- Execute a aplicação

```bash
make run
```

#### Envio em massa

- Caso deseje entregar vários projetos de uma vez rode o comando seguinte para iniciar o servidor:

```bash
make server
```

- Uma vez que o servidor esteja rodando, faça uma requisição POST para a rota `/delivery` de acordo com o local
que a aplicação estará rodando (localhost:3000).

- O body da aplicação deverá ser um JSON, e seguirá o formato de acordo com o arquivo `projects.json`

Qualquer dúvida, entre em contato pergunte para o time de tecnologia :)
