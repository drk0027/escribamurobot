const Sequelize = require('sequelize')
var sequelize

if(process.env.DB=="mysql"){
	console.log("Sistema MYSQL inicializado")
	sequelize = new Sequelize('restsys', 'restsys', 'restsys', {
	    host: 'localhost',
	    dialect: 'mysql', // por ejemplo, 'mysql',
	    pool: {
	        max: 5,
	        min: 0,
	        acquire: 30000,
	        idle: 10000
	    }
	})
}
if(process.env.DB=="sqlite"){
	console.log("Sistema SQLITE inicializado")
	sequelize = new Sequelize({
		dialect: "sqlite",
		storage: "./db_sys.db3"
	})
	
}

//DEFINIR LOS MODELOS
sequelize.define("usuarios",{
	id_usuario:{
		type: Sequelize.INTEGER,
		primaryKey: true,
		allowNull: false,
		unique: true,
		autoIncrement: true
	},
	codigo_usuario:{
		type: Sequelize.BIGINT,
		unique: true
	},
	nombre_usuario:{
		type: Sequelize.STRING,
		allowNull:false
	},
	nombres:{
		type: Sequelize.STRING,
		allowNull:true
	},	
	apellidos:{
		type: Sequelize.STRING,
		allowNull:true
	},
	idioma:{
		type: Sequelize.STRING,
	},
	comando_usuario:{
		type: Sequelize.STRING,
	},
	variables_usuario:{
		type:Sequelize.STRING
	},
    codigo_canal:{
        type:Sequelize.BIGINT,
        allowNull:true
    }
})

sequelize.define("mensajes",{
	id_mensaje:{
		type: Sequelize.INTEGER,
		primaryKey: true,
		allowNull: false,
		unique: true,
		autoIncrement: true
	},
    texto:{
        type: Sequelize.STRING
    }
})

sequelize.define("entradas",{
    id_entrada:{
        type: Sequelize.INTEGER,
		primaryKey: true,
		allowNull: false,
		unique: true,
		autoIncrement: true
    },
    texto:{//guarda los atributos de la entrada como json
        type:Sequelize.STRING
    },
    estado:{//si es post nuevo, se muestra al admin para moderar, sino, se publica
        type:Sequelize.BOOLEAN
    }
})

//DEFINIR LAS RELACIONES

relaciones()

function relaciones() {
    const { models } = sequelize

    models.mensajes.belongsTo(models.usuarios,{
        foreignKey:"id_usuario"
    })
}

//DEFINIR LA INICIALIZACION
//sync({force:true}) permite dropear la base de datos entera, sin eso sincroniza la base con el sistema, { alter: true } permite alterar
sequelize.sync().then(() => {
    //console.log('Drop and Resync Db');

    //initial(); //permite crear filas en la tabla seleccionada
});

async function initial() {
    const { models } = sequelize
    
    
}

module.exports = sequelize
