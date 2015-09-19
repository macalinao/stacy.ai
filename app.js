import express from 'express';

const app = express();

app.use(express.static(`${__dirname}/public/`));
app.use(`/assets`, express.static(`${__dirname}/assets/`));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
