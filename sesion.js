const sequelize = require("./sequelize")
const { Op } = require("sequelize");
const { Bot } = require("grammy");
const bot = new Bot("6190666166:AAFEwifGX3DTlHlC4kZfJeorRDJRvHGUij4");

class sesion {
	constructor(){
		this.hola="1"
	}

	/**
	*	# Verificar Sesion
	*
	*	Esta funcion permite comprobar si hay una sesion iniciada por el usuario
	*/
	async verificar_sesion(codigo_usuario){
	console.log("verificando si el usuario tiene sesion")
		const { models } = sequelize

		const existe=await models.usuarios.findOne({
			where:{
				codigo_usuario:codigo_usuario,
				comando_usuario:{
					[Op.not]:""
				}
			}
		})

		if(existe=== null){
			return false
		}else{
			return true
		}
		
	}
	/**
	*	# Crear Sesion
	*	
	*	Permite crear una sesion para el usuario
	*/
	crear_sesion(codigo_usuario,comando){
		const {models} = sequelize

		const variables={
			username:""
		}

		models.usuarios.update({
			comando_usuario:comando,
			variables_usuario: JSON.stringify(variables)
		},{
			where:{
				codigo_usuario:codigo_usuario
			}
		})
	}

	/**
	*	# Cancelar Sesion
	*
	*	Permite cancelar la sesion activa del usuario
	*/
	cancelar_sesion(codigo_usuario){
		const { models } = sequelize

		models.usuarios.update({
			comando_usuario:"",
			variables_usuario:""
		},{
			where:{
				codigo_usuario:codigo_usuario
			}
		})
	}
	/**
	* #Actualizar Comando
	*
	* Permite actualizar el comando a uno nuevo
	*/
	actualizar_comando(codigo_usuario,nombre_comando){
		const { models} = sequelize

		models.usuarios.update({
			comando_usuario:nombre_comando
		},{
			where:{
				codigo_usuario:codigo_usuario
			}
		})
	}

	/**
	* #Obtener comando
	*
	* Devuelve el comando que esta activo
	*/

	async obtener_comando(codigo_usuario){
		const { models } = sequelize

		const comando = await models.usuarios.findOne({
			where:{
				codigo_usuario:codigo_usuario
			}
		})

		if(comando.comando_usuario){
			return comando.comando_usuario
		}else{
			return null
		}
	}

	/**
	* #Actualizar Variable
	*
	* Permite actualizar la variable del usuario
	*/

	actualizar_variable(codigo_usuario,variable,contenido){
		const { models } = sequelize
		console.log(codigo_usuario)
		console.log(variable)
		console.log(contenido)
		models.usuarios.findOne({
			where:{
				codigo_usuario:codigo_usuario
			}
		}).then(resp=>{
			let variables= JSON.parse(resp.dataValues.variables_usuario)//obtengo las variables
			variables[variable]=contenido
			models.usuarios.update({
				variables_usuario:JSON.stringify(variables)
			},{
				where:{
					codigo_usuario:codigo_usuario
				}
			})
		})
	}
	/**
	* #Obtener Variable
	*
	*/
	async obtener_variable(codigo_usuario,nombre_variable){
		const { models}= sequelize

		var variable= await models.usuarios.findOne({
			where:{
				codigo_usuario:codigo_usuario
			}
		})
		if(variable.variables_usuario){
			return JSON.parse(variable.variables_usuario)[nombre_variable]	
		}else{
			return null
		}
		
	}

	/**
	* #Obtener Entrada Formateada
	*
	* Permite obtener la entrada en texto plano formateada
	*/
	async obtener_entrada_formateada(codigo_usuario){
		const { models} = sequelize

		var usuarios = await models.usuarios.findOne({
			where:{
				codigo_usuario:codigo_usuario
			}
		})

		if(usuarios){
			var variables= JSON.parse(usuarios.dataValues.variables_usuario)
			
			var mensaje="<b>Nueva entrada de autor:</b>\n\n🖊️<b>Nombre</b>🖊️: "+variables.username + "\n#"+variables.username +"\n\n📱<b>Redes</b>📱:\n"+variables.redes + "\n\n📧<b>Mensaje📧:</b>\n"+ variables.contenido + "\n\nRecuerden seguir y compartir para continuar creciendo.\n\n Comparte arte en el @muro_escritores con el ✍@escriba_muro_bot\n\nTambien recuerden que pueden compartir arte con @dimension2draw"
	
			return mensaje	
		}else{
			return null
		}
		
		
	}
	/**
	* #Obtener entrada para revision
	*
	* Obtiene la primera entrada(la mas antigua) para revisar por el admin
	*/
	async obtener_entrada_revision(){
		const { models } = sequelize

		var usuario = await models.usuarios.findOne({
			where:{
				comando_usuario:"revision"
			}
		})

		if(usuario){
			return usuario.dataValues.codigo_usuario	
		}else{
			return null
		}
	}

	/**
	* #Obtener usuario para soporte
	*
	*
	*/
	async obtener_usuario_soporte(){
		const { models }= sequelize

		var usuario = await models.usuarios.findOne({
			where:{
				comando_usuario:"soporte"
			}
		})

		if(usuario){
			return usuario.dataValues.codigo_usuario
		}else{
			return null
		}
	}
	/**
	* # Obtener lista usuarios registrados
	*
	*
	*/
	async obtener_usuarios(){
		const {models} = sequelize

		var usuario= await models.usuarios.findAll()

		if(usuario){
			return usuario.dataValues
		}else{
			return null
		}
	}
	
}

module.exports = new sesion()
