import app from './app';

const port = parseInt(process.env.PORT || '3001', 10);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Health check available at http://localhost:${port}/health`);
  console.log(`Journeys endpoint available at http://localhost:${port}/api/journeys`);
});
