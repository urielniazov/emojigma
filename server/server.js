require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 2481;

app.listen(PORT, () => {
  console.log(`Emojigma server running on port ${PORT}`);
});