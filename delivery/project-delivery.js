const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

function deliveryProject(projectSlug, studentId, zipUrl) {
  const baseUrl = "https://hub-bootcamp-pleev5musq-uc.a.run.app";
  const path = "/project-deliveries";
  const apiKey = process.env.API_KEY;

  const data = {
    projectSlug,
    studentId,
    zipUrl,
  };

  return axios({
    method: "POST",
    url: `${baseUrl}${path}`,
    data,
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": `Bearer ${apiKey}`,
    },
  });
}

module.exports = deliveryProject;
