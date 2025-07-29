const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Enable CORS for your GitHub Pages domain
app.use(cors({
  //origin: "https://purvash-143.github.io"
}));

app.use(express.json());

app.post("/trigger", async (req, res) => {
  const { vm_type } = req.body;
  if (!vm_type) return res.status(400).json({ error: "vm_type is required" });

  const token = process.env.GITHUB_TOKEN;
  //const owner = "Purvash-143";
  //const repo = "platform";
  //const url = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/deploy.yml/dispatches`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ref: "main",
        inputs: { vm_type }
      })
    });

    if (response.status === 204) {
      return res.status(200).json({ message: `✅ Deployment triggered for: ${vm_type}` });
    } else {
      const error = await response.json();
      return res.status(response.status).json({ error });
    }
  } catch (err) {
    console.error("Backend error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
