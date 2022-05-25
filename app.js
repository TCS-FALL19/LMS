const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {

  res.send('Adding Annoucements2!')
  //Temp comment
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})