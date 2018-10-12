const { Pool, Client } = require('pg')

const pool = new Pool({
  user: 'favio1',
  host: 'localhost',
  database: 'testdb',
  password: 'favio1',
  port: 5432,
})

pool.query('SELECT * FROM alumno;', (err, res) => {
  console.log(err, res.rows)
  pool.end()
})

const client = new Client({
  user: 'favio1',
  host: 'localhost',
  database: 'testdb',
  password: 'favio1',
  port: 5432,
})
client.connect()

client.query('SELECT NOW()', (err, res) => {
  console.log(err, res.rows)
  client.end()
})