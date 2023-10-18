# Sistema de Escriba para el Bot «El Muro de los Escritores»

El sistema «Escriba del Muro» es un bot interactivo creado para registrar los anuncios de los escritores que se hayan subscrito al canal. Esta basado en la teoria de que una red social se fundamenta en la capacidad de encerrar a una comunidad de tal manera que todos estan obligados a recibir las actualizaciones de estados de los demas.

Si bien las redes sociales permiten crear redes de usuarios, actualmente las principales, youtube, facebook y twitter, obligan a todos los usuarios a ver las actualizaciones de usuarios desconocidos seleccionados segun cierto algoritmo para destacar, debido a que la probabilidad de que los usuarios que se siguen voluntariamente sean creadores de contenido, es demasiado baja como para poder mantener el interes regular sobre sus plataformas.

Esto es especialmente complicado para redes que dependen de la publicidad, porque necesitan aumentar la posibilidad de que alguien de click en los anuncios, asi que incrementan la dependencia de la red social aumentando los contenidos para consumir, cosa que a su vez se nota en otras plataformas de redes sociales como Mastodon, que, al no usar un sistema de contenidos curados por un algoritmo, capta mucha menos atencion que las redes anteriormente mencionadas.

La teoria sobre este sistema, el canal «El Muro de los Escritores» y el bot «El Escriba del Muro»

Fases

## Notas de Desarrollo

Desarrollo de bots: Escriba del Muro

El desarrollo de Bot es algo que me está resultando enigmático debido a que, lo mas frecuente, es solo encontrar breves tutoriales introductorios al desarrollo de Bot y luego, directamente herramientas que permiten hacer Bot sin tocar nada de código. Para tratar de comprender mejor el funcionamiento de un Bot y también la forma de desarrollar una interfaz sencilla y fácil de comprender para un chat Bot, estoy desarrollando el «Escriba del Muro» el cual mantendré en funcionamiento junto al canal «El muro de los escritores»

Los Bot de Telegram tienen una larga historia detrás y las empresas han visto su potencia, al punto de que en cada plataforma hay algún tipo de Bot, aun cuando en un tiempo estuvieron prohibidos, como es el caso de WhatsApp sin una cuenta Business, sin embargo, su enfoque esta demasiado centrado en simples asistentes virtuales que se limitan a responder unas cuantas preguntas bastante simples y muchas veces de forma tosca e improductiva.

El enfoque de los Bot que mas me esta gustando, es el de una interfaz de usuario para herramientas potentes, no necesariamente asistentes virtuales, pero tampoco interfaces extrañas que recuerdan a la de línea de comandos. Mi primer acercamiento a esta tecnología fue con el Bot de descargar música del cual ya he hablado antes y que pretendo hacer una actualización de acuerdo a lo que descubra de este Bot.


#Escriba del Muro

El «Escriba del muro» es un Bot cuya única función es hacer de una especie de formulario dinámico que permita saludar de forma amable a los usuarios y que los guie paso a paso en la publicación de entradas para publicarse en un canal. Esto me lo ha inspirado el canal @DimensionDraw, un canal para compartir dibujos y otros tipos de arte y su Bot @JumpBot que permite a los usuarios subir según ciertas reglas.

- Reglas para la creación del Bot

- Utilizar un lenguaje amigable pero neutral

- Permitir la oportunidad de cancelar el proceso en cualquier momento

- Utilizar un formato de asistente para el registro de publicaciones

- Crear un código totalmente propio sin consultar a otras fuentes

- Esquematizar el diseño del Bot sin basarme en el Bot de inspiración.

- Reglas para publicar

Así mismo, para evitar el spam y al mismo tiempo agregar una capa de integración social adicional al Bot, es necesario que los usuarios cumplan ciertos requisitos para poder publicar en el muro.

-La moderación es manual

-El usuario debe estar registrado en el canal para publicar

-Si el usuario se desuscribe, ya no podrá publicar mas

-Las redes sociales adjuntas deben tener por lo menos un enlace a un canal de Telegram
Se puede publicar una vez por día

Especificaciones Técnicas

Las tecnologías elegidas para la creación de este Bot son las siguientes:

- NodeJs
- SequelizeORM
- SQLite3
- Telegram Bot API
- GRAMMY Framework
- Estado actual

Por el momento, solo tengo iniciado el proyecto. Actualmente el Bot es capaz de lo siguiente:

- Detectar Subscripciones al canal

- Detectar Desubscripciones al canal

- Reaccionar a los siguientes comandos

  - /start
  - /sobremi
  - /publicar
  - /ayuda
  - /soporte
  - /cancelar

- Detectar si hay alguna sesion de comando activa

- Crear sesiones de comandos

- Persistencia

- Sesiones
 
Mas informacion en los siguientes enlaces:

https://interlan.ec/2023/05/29/desarrollo-de-bots-escriba-del-muro/

https://interlan.ec/2023/06/08/desarrollo-de-bots-escriba-del-muro-parte-2/

https://interlan.ec/2023/07/14/desarrollo-de-bots-escriba-del-muro-parte-3/

https://interlan.ec/2023/07/14/desarrollo-de-bots-escriba-del-muro-parte-4/


