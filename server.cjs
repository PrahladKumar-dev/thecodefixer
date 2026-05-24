const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/run', async (req, res) => {

  try {

    const { source_code } = req.body;

    // TEMP FILE CREATE

    fs.writeFileSync('temp.js', source_code);

    // RUN CODE

    exec('node temp.js', (error, stdout, stderr) => {

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

  } catch (error) {

    console.log(error);

    res.status(500).json({

      output: 'Execution failed',

    });

  }

});

app.listen(5000, () => {

  console.log('Server running on port 5000');

});