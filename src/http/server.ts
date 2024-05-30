import { app } from './app'

const PORT = process.env.PORT
const HOSTNAME = 'localhost'

app.listen(PORT, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/ 🔥🔥`)
})
