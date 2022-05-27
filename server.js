const express = require('express');
const { schemaValidation, schemas } = require("./validation");
const deliveryProject = require("./delivery");
const axios = require("axios");

const port = 3000

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send({ message: 'Server is already running!' });
});

app.post('/delivery', async (req, res) => {
  try {
    const { projectSlug, projects } = req.body
    const isValidProjectSlug = schemaValidation(schemas.projectSlug, projectSlug);

    if (!isValidProjectSlug) {
      res.status(400).send({ message: 'Project slug is not valid!' });
    }
    let responses = []
    projects.map(async (project,index) => {
      setTimeout( async () => {
      const { studentId, zipUrl } = project
      const isValidStudentId = schemaValidation(schemas.numericIdSchema)
      const isValidZipUrl = schemaValidation(schemas.zipUrlSchema)

      if (isValidStudentId(studentId) && isValidZipUrl(zipUrl)) {
        await deliveryProject(projectSlug, studentId, zipUrl)
        responses.push({ success: true, message: `Project ${studentId} delivered successfully` })
      }
      else{

        responses.push({ success: false, message: `Project ${studentId} failed to deliver` })
      }
      
      if(responses.length === projects.length) return res.status(200).send({ success: true, message: 'Projects delivered successfully', responses })
      }, index*3000)
    })

    
  } catch (error) {
    res.status(400).send({ success: false, message: 'Projects failed to deliver', error })
  }
})

app.get('/zip-url', async (req, res) => {
  try {
    const { repositories } = req.body

    const promises = repositories.map(async (repository) => {
      const { name, studentId, link } = repository

      if (!link.includes("github.com")) {
        return { success: false, message: `Link ${link} is not valid` }
      }

      const repositorySplit = link.split('/')
      const repositoryName = repositorySplit[repositorySplit.length - 1]
      const repositoryOwner = repositorySplit[repositorySplit.length - 2]

      const branch = await getBranch(repositoryName, repositoryOwner)
      const zipUrl = getZipUrlLink(repositoryName, repositoryOwner, branch.data.name)

      return { name, zipUrl, studentId }
    })

    const branches = await Promise.all(promises)

    res.status(200).send({ success: true, message: 'Branches retrieved successfully', branches: branches })
  } catch (error) {
    res.status(400).send({ success: false, message: 'Branches failed to retrieve', error: error?.message })
  }
})

async function getBranch(repositoryName, repositoryOwner) {
  const baseUrl = "https://api.github.com/repos";
  const path = `/${repositoryOwner}/${repositoryName}/branches`;

  try {
    const branches = await axios({
      method: "GET",
      url: `${baseUrl}${path}`,
      headers: {
        "Content-Type": "application/json"
      },
    })

    const principalBranch = branches.data[branches.data.length - 1]

    return { success: true, data: principalBranch }
  } catch (error) {
    return { success: false, error: error?.message }
  }
}

function getZipUrlLink(repositoryName, repositoryOwner, branch) {
  const baseUrl = "https://github.com";
  const path = `/${repositoryOwner}/${repositoryName}/archive/refs/heads/${branch}.zip`;

  return `${baseUrl}${path}`
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})


