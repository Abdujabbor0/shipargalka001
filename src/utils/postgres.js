const { Pool } = require('pg')

const pool = new Pool({
	connectionString: 'postgres://olzcoqyd:jW2HXVR0g02SlsAnb8avpL9phaNs8NRt@john.db.elephantsql.com/olzcoqyd'
	// host: 'localhost',
  	// port: 5432,
  	// user: 'postgres',
  	// password: '2409',
  	// database: 'uy_ishi_9'
})


async function fetch (query, ...params) {
	const client = await pool.connect()
	try {
		const { rows: [ row ] } = await client.query(query, params.length ? params : null)
		return row
	} catch(error) {
		throw error
	} finally {
		client.release()
	}
}


async function fetchAll (query, ...params) {
	const client = await pool.connect()
	try {
		const { rows } = await client.query(query, params.length ? params : null)
		return rows
	} catch(error) {
		throw error
	} finally {
		client.release()
	}
}


module.exports = {
	fetchAll,
	fetch
}