const express = require('express');
const { schemaValidation, schemas } = require("./validation");
const deliveryProject = require("./delivery");

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

    const promises = projects.map(async (project) => {
      const { studentId, zipUrl } = project
      const isValidStudentId = schemaValidation(schemas.numericIdSchema)
      const isValidZipUrl = schemaValidation(schemas.zipUrlSchema)

      if (isValidStudentId(studentId) && isValidZipUrl(zipUrl)) {
        await deliveryProject(projectSlug, studentId, zipUrl)

        return { success: true, message: `Project ${studentId} delivered successfully` }
      }

      return { success: false, message: `Project ${studentId} failed to deliver` }
    })

    const responses = await Promise.all(promises)

    res.status(200).send({ success: true, message: 'Projects delivered successfully', responses })
  } catch (error) {
    res.status(400).send({ success: false, message: 'Projects failed to deliver', error })
  }
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})


