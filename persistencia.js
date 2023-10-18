const sequelize = require("./sequelize")
const { Bot } = require("grammy");
const bot = new Bot(process.env.BOTAPI);

class persistencia {
	constructor() {
		this.hola = "1"
	}
	/**
		# Registrar mensaje

		Esta funcion sirve de hub para los procesos de registro de los usuarios.

		cuando llega el mensaje, se revisa la base de datos para verificar si el usuario existe
		si el usuario no existe, se agrega a la tabla usuarios

		si el mensaje es de estado en ctx.update.chat_member contiene new_chat_member entonces se guarda el usuario
		si el mensaje es de estado en ctx.update.chat_member, se vincula el canal al usuario
	*/
	async registrar_mensaje(ctx) {
		//para mensajes
		if (ctx.update.message) {
			//paso 1, validar si el usuario existe en la tabla de usuarios
			if (await this.validar_usuario(ctx.update.message.from.id) == false) {
				//si el usuario no existe, entonces se registran sus datos en la tabla
				//console.log(ctx.update.message.from)
				this.registrar_usuario(ctx.update.message.from.id, ctx.update.message.from.username, ctx.update.message.from.first_name, ctx.update.message.from.last_name, ctx.update.message.from.language_code)
			}

			//paso 2, validar si el usuario ya se encuentra registrado en el canal
			if (await this.validar_usuario_canal(ctx.update.message.from.id, process.env.CHANNEL) == false) {
				console.log("el usuario no se encuentra en el canal, aunque ya deberia estar en la base de datos")

			}
		}
		//para actualizaciones de estado
		//paso 1 determinar si el mensaje es una actualizacion de nuevo miembro del canal y actualizar al usuario, si existe
		if (ctx.update.chat_member) {
			//significa que es un estado de anuncio de nuevo miembro de chat
			//console.log(ctx.update.chat_member)
			//comprobar si el usuario ya existe
			if(this.validar_usuario(ctx.update.chat_member.from.id)==false){
				console.log("el usuario se ha suscrito, pero no registrado en la base de datos")
				console.log("registro al usuario debido a que no existe en el canal y tampoco ha sido registrado anteriormente")
				this.registrar_usuario(ctx.update.chat_member.from.id, ctx.update.chat_member.from.username, ctx.update.chat_member.from.first_name, ctx.update.chat_member.from.last_name, ctx.update.chat_member.from.language_code)
			}else{
				console.log("el usuario ya esta en el sistema")
			}
			//comprobar si el usuario ya se ha suscrito al canal
			if (ctx.update.chat_member.new_chat_member.status == "member") {
				console.log("El usuario se ha suscrito")
				//console.log(await this.validar_usuario_canal(ctx.update.chat_member.from.id, process.env.CHANNEL))
				if (await this.validar_usuario_canal(ctx.update.chat_member.from.id, process.env.CHANNEL) == false) {
					console.log("actualizo el canal del usuario debido a que se ha registrado en el canal")
					this.registrar_usuario_canal(ctx.update.chat_member.from.id, process.env.CHANNEL)
					bot.api.sendMessage(ctx.update.chat_member.from.id, "¡Genial! Ahora podremos escribir en el «Muro de los Escritores».");
					bot.api.sendMessage(ctx.update.chat_member.from.id, "Para continuar, elije cualquiera de los comandos disponibles.\nSiempre puedes pedir ayuda con el comando /ayuda o escribir un mensaje al admin mediante el comando de /soporte");
				}
			}

			if (ctx.update.chat_member.new_chat_member.status == "left") {
				console.log("El usuario se ha desuscrito")
				if (await this.validar_usuario_canal(ctx.update.chat_member.from.id, process.env.CHANNEL) == true) {
					//si se ha desuscrito y esta en la base, eliminarlo de la base
					this.eliminar_usuario_canal(ctx.update.chat_member.from.id, process.env.CHANNEL)
					bot.api.sendMessage(ctx.update.chat_member.from.id, "Es una lastima que te hayas desuscrito.\nSi te molestaba la cantidad de notificaciones, podrias silenciarlas.");
					bot.api.sendMessage(ctx.update.chat_member.from.id, "Pero no te preocupes, puedes renovar tu suscripcion para poder volver a publicar en el @muro_escritores");
				}
			}
		}

		const before = Date.now(); // milliseconds
		const { models } = sequelize
		/*models.usuarios.create({
			codigo_usuario:"1231235"
		})*/
		const after = Date.now(); // milliseconds
		console.log(`Response time: ${after - before} ms`);


	}
	/**
	 * # Validar Usuario
	 * 
	 * Valida si el usuario se encuentra registrado en la base de datos
	 * @returns boolean
	 */
	async validar_usuario(codigo_usuario) {
		const { models } = sequelize

		const existe = await models.usuarios.findOne({
			where: {
				codigo_usuario: codigo_usuario
			}
		})
		if (existe === null) {
			return false
		} else {
			return true
		}

	}
	/**
	 * # Registrar Usuario
	 * 
	 * Registra al usuario segun los datos suministrados.
	 * @returns boolean
	 */
	registrar_usuario(codigo_usuario, nombre_usuario, nombres, apellidos, idioma) {
		const { models } = sequelize
		models.usuarios.create({
			codigo_usuario: codigo_usuario,
			nombre_usuario: nombre_usuario,
			nombres: nombres,
			apellidos: apellidos,
			idioma: idioma
		})
	}
	/**
	 * # Validar usuario canal
	 * 
	 * Valida si el usuario se encuentra registrado en el canal
	 */
	async validar_usuario_canal(codigo_usuario, codigo_canal) {
		const { models } = sequelize

		const existe = await models.usuarios.findOne({
			where: {
				codigo_usuario: codigo_usuario,
				codigo_canal: codigo_canal
			}
		})

		if (existe === null) {
			return false
		} else {
			return true
		}
	}
	registrar_usuario_canal(codigo_usuario, codigo_canal) {
		const { models } = sequelize

		models.usuarios.update({
			codigo_canal: codigo_canal
		}, {
			where: {
				codigo_usuario: codigo_usuario
			}
		})
	}
	
	eliminar_usuario_canal(codigo_usuario) {
		const { models } = sequelize

		models.usuarios.update({
			codigo_canal: ""
		}, {
			where: {
				codigo_usuario: codigo_usuario
			}
		})
	}

}

module.exports = new persistencia()
