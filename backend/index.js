import express from "express"
import fs from "fs" // file system
import cors from "cors"

const app = express()
app.use(cors())

const products = JSON.parse(fs.readFileSync("./src/data/products.json", "utf-8"))

app.get("/", (req, res) => {
  res.json(products)
})

app.listen(3000)
console.log(1)