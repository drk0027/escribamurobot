require('dotenv').config();
//const sequelize = require("./sequelize")
var DB = require("./persistencia")
var SESION = require("./sesion")

async function registrar_mensaje(ctx,next){
	DB.registrar_mensaje(ctx)
	next()
}

const { Bot } = require("grammy");
const bot = new Bot(process.env.BOTAPI);

bot.use(registrar_mensaje)

/**
 * #Funcion Publicar
 * 
 * Inicia el proceso de Publicacion
*/
async function publicar(ctx){//iniciar el proceso de publicacion
	//primero, validar si ya se pertenece al canal
	if(await SESION.verificar_sesion(ctx.update.message.from.id)==false){
		SESION.crear_sesion(ctx.update.message.from.id,"username")//crea el comando username, que permite registrar el nombre del usuario
		ctx.reply("Muy bien, vamos a ello. Recuerda que siempre puedes cancelar este proceso usando el comando /cancelar\n\nIngresa a continuacion tu nombre de usuario, cuando hayas terminado, presiona el comando /guardar_username")
		
	}else{
		//Si hay sesion activa, preguntar si se desea cancelar
		ctx.reply("Tienes una sesion activa y no puedes hacer nada mas hasta que se termine el proceso. Si quieres, puedes cancelarla con /cancelar para comenzar de nuevo")
	}
}

/**
 * #Iniciar Bot
 * 
 * Punto de arranque del sistema
 * 
*/
async function iniciar_bot(ctx){
	//validar si el usuario ya esta registrado en el canal y responder de acuerdo a ello.
	//console.log(await DB.validar_usuario_canal(ctx.update.message.from.id, process.env.CHANNEL))
	if(await DB.validar_usuario_canal(ctx.update.message.from.id, process.env.CHANNEL)){ //Si no es la primera vez que llega el usuario
		ctx.reply("Tal vez tengas todavia dudas sobre este proyecto. ¿Por que no le echas un ojo a los comandos de /ayuda y /soporte? Espero que te puedan servir para que le des visibilidad a tus proyectos desde este canal.")
	}else{
		ctx.reply("Hola, te doy la bienvenida a este proyecto. Soy el «Escriba del Muro», un bot sencillo diseñado para acompañarte a publicar en el «Muro de los Escritores».\nPara comenzar, debes estar subscrito al canal @muro_escritores. Adelante, yo te espero. :D")
	}
}

/*
*   Comandos de control de flujo de sesion
*/

/**
* # Username
*
* Esta funcion permite hacer seguimiento de lo que ingrese el usuario hasta que se presione el comando para terminar
*/
function username(ctx){
    console.log(ctx.update.message.from.id + " Se encuentra en sesion de carga de username\n\n")
	SESION.actualizar_variable(ctx.update.message.from.id,"username",ctx.message.text)
	ctx.reply("Si tu nombre de usuario es correcto, presiona /guardar_username, de lo contrario, ingresa otro")
}

/**
* #Redes
*
* Esta funcion permite hacer seguimiento a lo que ingrese el usuario hasta que presione el comando para terminar
*/
function redes(ctx){
    console.log(ctx.update.message.from.id + " Se encuentra en sesion de carga de redes\n\n")
	SESION.actualizar_variable(ctx.update.message.from.id,"redes",ctx.message.text)
	ctx.reply("Si terminaste, presiona /guardar_redes para guardar y continuar")
}

/**
* #Contenido
*
* Esta funcion permite hacer seguimiento a lo que ingrese el usuario hasta que presione terminar
*/
function contenido(ctx){
    console.log(ctx.update.message.from.id + " Se encuentra en sesion de carga de contenidos\n\n")
	SESION.actualizar_variable(ctx.update.message.from.id,"contenido",ctx.message.text)
	ctx.reply("Si terminaste, presiona /guardar_contenido para guardar y continuar")
}

/**
* #Revision
*
* Esta funcion permite hacer seguimiento a lo que ingrese el usuario hasta que presione un nuevo comando
*/
function revision(ctx){
    console.log(ctx.update.message.from.id + " Se encuentra en sesion de revision de publicacion\n\n")
	ctx.reply("El contenido esta guardado y ahora se encuentra en revision. Si deseas empezar de nuevo, presiona /cancelar y luego /publicar")
}
/**
* #Soporte
*
* Esta funcion permite hacer de puente entre el usuario y el admin
*/
async function soporte(ctx){
    console.log(ctx.update.message.from.id + " Se encuentra en sesion de solicitud de soporte\n\n")
	if(await SESION.obtener_comando(ctx.update.message.from.id)=="soporte_aceptado"){
		if(ctx.update.message.from.id!=process.env.ADMIN){
			bot.api.sendMessage(process.env.ADMIN,"@"+ ctx.update.message.from.username + " dice: "+ ctx.message.text)
		}else{
			bot.api.sendMessage(await SESION.obtener_variable(process.env.ADMIN,"codigo_usuario"),"El admin dice: " + ctx.message.text)
		}
	}
}

async function difusion(ctx){
	//recibo el mensaje y lo difundo a todos los usuarios registrados
	// creo que mejor no lo hago, aparte de la pereza, que sentido tiene?
}

/**
* #Guardar Username
*
* Esta funcion permite avanzar al siguiente comando para guardar redes y enlaces
*/
async function guardar_username(ctx){
	//si se presiona este comando, se guarda y se abre la sesion de redes sociales
	if(await SESION.obtener_comando(ctx.update.message.from.id)=="username"){
		SESION.actualizar_comando(ctx.update.message.from.id,"redes")
		ctx.reply("Ahora vamos a agregar redes sociales a tu entrada\nAgrega a continuacion un enlace de redes sociales, cuando hayas terminado, presiona /guardar_redes o /agregar_redes para continuar añadiendo")
		
	}else{
		ctx.reply("No es el momento para eso")
	}
}

/**
* #Guardar Redes
*
* Esta funcion permite avanzar al siguiente comando para agregar contenido al mensaje
*/
async function guardar_redes(ctx){
	if(await SESION.obtener_comando(ctx.update.message.from.id)=="redes"){
		SESION.actualizar_comando(ctx.update.message.from.id,"contenido")
		ctx.reply("Ahora vamos a agregar contenido a tu entrada. Recuerda que puedes agregar hashtag para que los demas puedan encontrar y saber sobre que tema estas publicando, cuando termines, presiona /guardar_contenido")
	}else{
		ctx.reply("No es el momento para eso")
	}
}

/**
* #Guardar Contenido
*
* Esta funcion permite avanzar al siguiente comando para agregar 
*/
async function guardar_contenido(ctx){
	if(await SESION.obtener_comando(ctx.update.message.from.id)=="contenido"){
		SESION.actualizar_comando(ctx.update.message.from.id,"revision")
		//Cuando se manda a revision, tambien se debe mandar al admin un mensaje de que hay una nueva entrada en espera de revision, vamos a ello
		bot.api.sendMessage(
			process.env.ADMIN,
			"El usuario @" + ctx.update.message.from.username + " con codigo: " + ctx.update.message.from.id + " ha enviado una publicacion para revisar. Puedes empezar el proceso de revision con /revisar"
		)
		ctx.reply("Así se verá tu entrada al publicar y se encuentra ahora en revision.\n Puedes cancelar usando el comando /cancelar para empezar de nuevo.")
		ctx.reply(await SESION.obtener_entrada_formateada(ctx.update.message.from.id),{parse_mode:"HTML"})
	}else{
		ctx.reply("No es el momento para eso")
	}
}

//flujo para el admin
async function iniciar_revision(ctx){
	if(ctx.update.message.from.id!=process.env.ADMIN){
		ctx.reply("Error 404.")
	}else{
		if(await SESION.obtener_entrada_revision()==null){
			ctx.reply("Nada que revisar")			
		}else{
			SESION.crear_sesion(process.env.ADMIN,"revisando")
			var codigo_usuario = await SESION.obtener_entrada_revision()
			SESION.actualizar_variable(process.env.ADMIN,"codigo_usuario",codigo_usuario)
			ctx.reply("este es el mensaje para revisar. Usa /aprobar o /rechazar, puedes dejar un mensaje explicando por que rechazas la publicacion")
			ctx.reply(await SESION.obtener_entrada_formateada(codigo_usuario),{parse_mode:"HTML"})	
		}
		
	}
}

async function aprobar_publicacion(ctx){
	if(ctx.update.message.from.id!=process.env.ADMIN){
		ctx.reply("Error 404.")
	}else{
		if(await SESION.obtener_comando(process.env.ADMIN)==null){
			ctx.reply("no hay nada que aprobar")
		}else{
			//obtener el codigo del usuario que se esta revisando
			codigo_usuario= await SESION.obtener_variable(process.env.ADMIN,"codigo_usuario")
			//publicar en el muro
			var entrada = await SESION.obtener_entrada_formateada(codigo_usuario)
			bot.api.sendMessage(process.env.CHANNEL,entrada,{parse_mode:"HTML"})
			//limpiar sesion del usuario
			SESION.cancelar_sesion(codigo_usuario)
			bot.api.sendMessage(process.env.ADMIN,"Entrada Aprobada, sigue revisando con el comando /revisar")
			//limpiar la sesion del admin
			SESION.cancelar_sesion(process.env.ADMIN)
			//confirmar al usuario que ha sido publicado
			bot.api.sendMessage(codigo_usuario,"Tu publicacion ha sido aprobada. Sigue compartiendo en el @muro_escritores")	
		}
	}
}

/**
 * #Rechazar Publicacion
 * 
 * Permite rechazar la publicacion en revision
 * 
 * 
*/
async function rechazar_publicacion(ctx){
	if(ctx.update.message.from.id!=process.env.ADMIN){
		ctx.reply("Error 404.")
	}else{
		if(await SESION.obtener_comando(process.env.ADMIN)==null){
			ctx.reply("nada que rechazar")
		}else{
			codigo_usuario = await SESION.obtener_variable(process.env.ADMIN,"codigo_usuario")
			bot.api.sendMessage(process.env.ADMIN,"Entrada Rechazada, sigue revisando con /revisar")
			SESION.cancelar_sesion(process.env.ADMIN)
			SESION.cancelar_sesion(codigo_usuario)
			bot.api.sendMessage(codigo_usuario,"Tu publicacion ha sido rechazada.")
		}
	}
}

async function iniciar_soporte(ctx){
	if(ctx.update.message.from.id!=process.env.ADMIN){
		//El usuario solicita soporte y se guarda su comando como soporte, mientras esta en modo soporte, no puede hacer nada mas
		SESION.crear_sesion(process.env.ADMIN,"soporte_admin")
		SESION.crear_sesion(ctx.update.message.from.id,"soporte")
		ctx.reply("Tu solicitud de soporte esta siendo procesada.  recuerda que no puedes publicar nada mientras estes en este modo, pero puedes cancelar la solicitud de soporte usando el comando /cancelar")
		bot.api.sendMessage(process.env.ADMIN,"El usuario "+ctx.update.message.from.id + " Esta solicitando soporte, atiende la lista de solicitudes mediante el comando /revisar_soporte")
	}else{
		//el admin no deberia poder usar este comando, no tiene sentido
		ctx.reply("¿A quien vas a soportar? nadie te lo pidio")
	}
}

async function revisar_soporte(ctx){
	//pal admin, elegir un miembro
	if(ctx.update.message.from.id!=process.env.ADMIN){
		ctx.reply("Error 404.")	
	}else{
		var codigo_usuario=await SESION.obtener_usuario_soporte()
		if(codigo_usuario){
			ctx.reply("Seleccionando un usuario para dar soporte")
			//a partir de aqui se cambia el comando a soporte aceptado del usuario
			SESION.actualizar_comando(codigo_usuario,"soporte_aceptado")
			SESION.actualizar_comando(process.env.ADMIN,"soporte_aceptado")
			SESION.actualizar_variable(process.env.ADMIN,"codigo_usuario",codigo_usuario)
			bot.api.sendMessage(codigo_usuario,"Soporte aceptado, Escribe tu mensaje y el administrador te responderá")
		}else{
			ctx.reply("No hay usuarios a los que dar soporte")
		}
	}
	
}
async function terminar_soporte(ctx){
	//solo lo puede usar el admin
	if(ctx.update.message.from.id!=process.env.ADMIN){
		ctx.reply("Error 404.")
	}else{
		codigo_usuario = await SESION.obtener_variable(process.env.ADMIN,"codigo_usuario")
		SESION.cancelar_sesion(codigo_usuario)
		SESION.cancelar_sesion(process.env.ADMIN)
		bot.api.sendMessage(codigo_usuario,"Sesion de soporte terminada")
		bot.api.sendMessage(process.env.ADMIN,"Sesion de soporte terminada")
	}
}

/**
* #Mensajes Generales
*
* Actua como hub para todos los mensajes no controlados y permite redirigirlos a las funciones que le correspondan.
*/
async function mensajes_generales(ctx){
	//si aun no esta registrado al muro
	if(await DB.validar_usuario_canal(ctx.update.message.from.id, process.env.CHANNEL)||ctx.update.message.from.id==process.env.ADMIN){
		
		//validar si hay algun comando en curso
		if(await SESION.verificar_sesion(ctx.update.message.from.id)){
			//si hay algun comando en curso, por ejemplo username, entonces se carga en la variable del usuario lo que se ingrese por texto hasta que se cambie el comando
			switch (await SESION.obtener_comando(ctx.update.message.from.id)){
				case "username":
					username(ctx)
					break
				case "redes":
					redes(ctx)
					break
				case "contenido":
					contenido(ctx)
					break
				case "revision":
					revision(ctx)
					break
				case "soporte_aceptado":
					soporte(ctx)
					break
				case "difusion":
					difusion(ctx)
					break
			}
		}else{
			ctx.reply("Me alegra que te interese este proyecto. ¿Necesitas ayuda? recuerda que puedes iniciar estos comandos:\n/publicar Este comando te permite empezar con el formulario de publicacion. Puedes consultar los requisitos con el siguiente comando.\n/ayuda Este Comando te permite obtener ayuda sobre el bot.\n/soporte Este comando te permite enviarle un mensaje al administrador del bot.")
		}
	}else{
		ctx.reply("Hola, recuerda que debes estar registrado en el canal del @muro_escritores para poder utilizar este bot. Una vez hecho esto, te acompañare en el proceso para compartir tus entradas en el canal.\n\nSi te sigue saliendo este mensaje, puede que haya ocurrido algun error, puedes intentar desuscribirte y unirte de nuevo al canal o preguntar con el comando /soporte")
	}
}

function sobremi(ctx){
	ctx.reply("Hola, Soy el «Escriba del Muro», un bot diseñado por @drk0027 para el proyecto «Muro de Escritores»\nMi objetivo es ayudarte a publicar en el muro, de tal forma que se pueda crear una comuinidad en telegram donde haya mayor visibilidad para los escritores. Por supuesto, hay mucho spam en esta plataforma, por lo que he creado algunas reglas para mejorar la visibilidad y reducir el ruido. miralas en /ayuda\n\nSigue el canal del autor en @drk0072 para apoyar su trabajo o usa el comando /soporte para iniciar una sesion de soporte con el admin mediante el bot")
}

function ayuda(ctx){
	ctx.reply("El muro de los Escritores es un proyecto abierto a todos los usuarios de la plataforma de Telegram que quieran compartir sus obras en un punto comun, por lo que para aumentar la visibilidad y reducir el ruido, tengo las siguientes reglas antes de permitirte publicar:\n\n§ Debes estar suscrito al canal @muro_escritores\n§ Debes publicar exclusivamente conmigo (el bot @escriba_muro_bot)\n§ Debes ser usuario de Telegram.\n\nSon solo tres reglas faciles de seguir y cumplir y se puede publicar lo que quieras siempre y cuando se trate de escritura y de preferencia, tenga un canal de Telegram el cual se pueda seguir. Recuerda que puedes publicar una vez al dia y la moderacion es manual, asi que no desesperes, pronto tu publicacion estará en el muro :)\n\nSigue el canal del autor en @drk0072 para apoyar su trabajo o usa el comando /soporte para iniciar una sesion de soporte con el admin mediante el bot")
}

async function cancelar(ctx){
	if(await SESION.verificar_sesion(ctx.update.message.from.id)== true){
		SESION.cancelar_sesion(ctx.update.message.from.id)
		ctx.reply("Sesion Cancelada. Si tienes dudas, puedes consultar con el comando /ayuda o tambien puedes continuar con una nueva publicacion usando el comando /publicar")
	}else{
		ctx.reply("No hay nada que cancelar. ¿Que te parece comenzar una nueva publicacion?.\nUsa el comando /publicar para crear tu nueva entrada para el muro")
	}
}

//Comandos
bot.command("start", iniciar_bot);
bot.command("sobremi", sobremi);
bot.command("publicar", publicar);
bot.command("ayuda", ayuda);
bot.command("cancelar",cancelar)

//flujo de sesion
bot.command("guardar_username",guardar_username)//guarda el nombre del usuario y pasa al siguiente paso, registrar las redes sociales
bot.command("guardar_redes",guardar_redes)//guarda las redes y avanza a la siguiente fase, agregar contenido
bot.command("guardar_contenido",guardar_contenido)//guarda el contenido y crea la vista previa
//bot.command("enviar_revision",guardar_contenido)//guarda el contenido y crea la vista previa

//flujo de sesion para el admin
bot.command("revisar", iniciar_revision)
bot.command("aprobar", aprobar_publicacion)
bot.command("rechazar", rechazar_publicacion)

//flujo de sesion de soporte
bot.command("soporte", iniciar_soporte)
bot.command("revisar_soporte", revisar_soporte)
bot.command("terminar_soporte", terminar_soporte)



//mensajes en general
bot.on("message", mensajes_generales);

bot.on(":text", (ctx) => ctx.reply("Got dsgfsdf message!"));
//bot.on("my_chat_member", (ctx) => console.log(ctx.myChatMember));

//Inicializa el Pooling
bot.start({
	allowed_updates: ["chat_member", "message","my_chat_member"],
});

