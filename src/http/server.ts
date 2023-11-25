import { app } from './app'

app.get('/', (request, response) => {
  return response.send({
    message: 'Hello World!',
  })
})

const PORT = process.env.PORT
const HOSTNAME = 'localhost'

app.listen(PORT, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/ 🔥🔥`)
})
