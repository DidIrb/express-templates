import express from "express"
import { config } from "./config/env.js"

const app = express()
const PORT = config.port || 3000

app.get("/", (req, res) => {
  res.send("Hello, World!")
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
