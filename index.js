const inquirer = require("inquirer");
const { schemaValidation, schemas } = require("./validation");
const deliveryProject = require("./delivery");

inquirer
  .prompt([
    {
      type: "input",
      message: "Qual o nome do projeto que deseja corrigir?",
      name: "projectSlug",
      validate: schemaValidation(schemas.slugSchema),
    },
    {
      type: "number",
      message: "Qual o ID do estudante?",
      name: "studentId",
      validate: schemaValidation(schemas.numericIdSchema),
    },
    {
      type: "input",
      message: "Qual o link do ZIP do projeto?",
      name: "zipUrl",
      validate: schemaValidation(schemas.zipUrlSchema),
    },
  ])
  .then(async (answers) => {
    const { projectSlug, studentId, zipUrl } = answers;

    try {
      console.log("Enviando projeto...");
      await deliveryProject(projectSlug, studentId, zipUrl);
      console.log("Projeto enviado com sucesso!");
      console.log(`Projeto: ${projectSlug}`);
      console.log(`ID do estudante: ${studentId}`);
      console.log(`Link do ZIP: ${zipUrl}`);
      console.log("========");
    } catch (err) {
      console.log(err);
      if (err.response.status === 401) {
        console.error(
          "Erro: API_KEY inválida. Crie um arquivo .env com valor para API_KEY. Caso não tenha, consulte seu coordenador de turma. Exemplo: API_KEY=123456789"
        );
      } else if (err.response.status === 400) {
        console.error("Erro: Dados inválidos.");
        console.error(err.response.data.message);
      } else {
        throw err.response;
      }
    }
  })
  .catch((err) => {
    console.error(
      "Erro ao enviar projeto. Verifique os dados ou entre em contato com o suporte."
    );
    process.exit(1);
  });
