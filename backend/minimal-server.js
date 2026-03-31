const express = require('express');
const app = express();

app.use(express.json());

console.log("Starting minimal server...");

app.get('/', (req, res) => {
  console.log("GET / called");
  res.json({ message: "Root" });
});

app.post('/test-post', (req, res) => {
  console.log("POST /test-post called");
  res.json({ message: "POST works" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Minimal server running on port ${PORT}`);
});
