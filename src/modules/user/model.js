const { fetch, fetchAll } = require('../../utils/postgres.js')

const USERS = `
	SELECT
		userid,
		username,
		fullname,
		email,
		active
	FROM users
	WHERE
	CASE
		WHEN $1 > 0 THEN userid = $1
		ELSE TRUE
	END and
	CASE 
		WHEN LENGTH($2) > 0 THEN (
			username ILIKE CONCAT('%', $2 , '%') OR 
			fullname ILIKE CONCAT('%', $2 , '%')
		) ELSE TRUE
	END and 
	CASE
		WHEN $3 IN (true,false) THEN active = $3
		ELSE TRUE
	END
	ORDER BY userid
	offset $4 limit $5
`
const imagelink =`
	select 
		link
	from images
	where images.userid = $1
`
const GET = `
	insert into users (username, fullname, email,password,active) values
	($1, $2,$3, crypt($4, gen_salt('bf')), $5 )
	returning *
`
const img = `
	insert into images (link, userid, size, mimetype) values
	($1,$2,$3,$4)
	returning *
`

const DELETE =`
	DELETE FROM users where userid = $1 and password = crypt($2, password )
	returning userid, fullname,email,username,active
`

const PUT = `
		update users u set
			username = (
				case
					when length($1) > 0 then $1 else u.username
				end
			),
			fullname = (
				case
					when length($2) > 0 then $2 else u.fullname
				end
			),
			email = (
				case
					when length($3) > 0 then $3 else u.email
				end
			),
			password = (
				case
					when length($4) > 0 then crypt($4, gen_salt('bf')) else u.password
				end
			),
			active = (
				case
					when $5 in (true, false) then $5 else u.active
				end
			)
		where userid = $6
		returning *
	`

const users = ({pagination: {page, limit}, search, userid, active}) => fetchAll(USERS, userid, search, active, (page - 1) * limit, limit)

const put = ({userid, username, fullname, password, active,email}) => fetch(PUT,
	username, fullname, email, password,active, userid)

;const get = ({username, fullname, password, active,email}) => fetch(GET,
	username, fullname, email, password,active)

;const del = ({userid, password}) => fetch(DELETE, userid, password)

const images = ({userid, link, size, mimetype}) => fetch(img,
	link,
	userid,
	size,
	mimetype
)

const link = ({userid}) => fetch(
	imagelink,
	userid
)

module.exports = {
	users,
	put,
	get,
	del,
	images,
	link
}