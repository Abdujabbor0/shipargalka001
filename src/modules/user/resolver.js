const model = require('./model.js')
const jwt = require ('jsonwebtoken')
const path = require ('path')
const fs = require ('fs')
let ip = "https://shipargalka.herokuapp.com"
module.exports = {
	Query: {
		users: async (_, args) => {
			return await model.users(args)
		}
	},
	Mutation: {
		Put: async (_, args, context) => {
			try{
				let { id } = jwt.verify(context.token,"Tommy")
				if(!(id == args.userid)) throw new Error("Token key invalid!!!")
				const  user  = await model.put(args)
				if(user){
					return {
						status: 200,
						message: "User ozgartirildi!!!",
						user: user,
					}
				}
				else throw new Error("There is no such user!!")
			} catch(e){
				return {
					status: "Xozircha status yoq!!!",
					message: e.message
				}
			}
		},
		Register: async (_,args) =>{
			try{
				const { createReadStream, filename, mimetype, encoding } = await args.file
      			const stream = createReadStream()
				let as = filename.replace(/\s/g,'')
      			const fileAddress = path.join(process.cwd(), 'files/images', as)
      			const out = fs.createWriteStream(fileAddress)
      			stream.pipe(out)
				let mimetype1 = mimetype.split('/')
				if(!(mimetype1[1] == 'png' || mimetype1[1] == 'jpg' || mimetype1[1] == 'mp4' || mimetype1[1] == 'jpeg')) throw new Error('Vaqat vidio va rasm yuklasa boladi!!!')
				const user = await model.get(args)

				let newImage ={
					userid: user.userid,
					link: "/images/" + as,
					size: encoding,
					mimetype: mimetype1[1]
				}	

				const image = await model.images(newImage)				
				return {
					status: 200,
					message: "User qoshildi!!!",
					user: user,
					image: image,
					token: jwt.sign({ id : user.userid }, "Tommy")
				}
			}catch(e){
				return {
					status: "Xozircha status yoq!!!",
					message: e.message
				}
			}
		},
		Delete: async (_, args,context) => {
			try{
				let { id } = jwt.verify(context.token,"Tommy")
				if(!(id == args.userid)) throw new Error("Token key invalid!!!")
				let userid = args.userid
				let password = args.password
				let putuser = await model.del({password, userid})
				return {
					status: "Xozircha status yoq!!!",
					message: "User ocirildi",
					user: putuser,
				}	
			} catch(e){
				return {
					status: "Xozircha status yoq!!!",
					message: e.message
				}
			}
		}
	},

	User: {
		imagelink: async parent =>{
			let userid = parent.userid
			let x = await model.link({userid})
			if(x) {
				return ip + x.link
			}
			else {
				return null
			}
		}
	}
}
