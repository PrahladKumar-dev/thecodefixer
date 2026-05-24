const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { exec } = require("child_process");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.post("/run", async (req, res) => {
  try {
    const { source_code } = req.body;

    if (!source_code) {
      return res.status(400).json({
        output: "No source code provided",
      });
    }

    fs.writeFileSync("temp.js", source_code);

    exec("node temp.js", (error, stdout, stderr) => {
      if (error) {
        return res.json({
          output: error.message,
        });
      }

      if (stderr) {
        return res.json({
          output: stderr,
        });
      }

      return res.json({
        output: stdout,
      });
    });

  } catch (err) {
    return res.status(500).json({
      output: "Execution failed",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});