import { Comunidad, MiembroComunidad, Mensaje, Usuario } from "../models/index.js";

export const listarComunidadesUsuario = async (req, res) => {
  try {
    const id_usuario = req.userId;
    
    const comunidades = await Comunidad.findAll({
      include: [
        {
          model: MiembroComunidad,
          where: { id_usuario, activo: true },
          attributes: [],
          include: [{
            model: Usuario,
            as: 'Usuario', // Relación para creador
            attributes: ['nombre', 'avatar']
          }]
        },
        {
          model: Mensaje,
          limit: 1,
          order: [['fecha_envio', 'DESC']],
          attributes: ['id_mensaje', 'mensaje', 'fecha_envio'],
          include: [{
            model: Usuario,
            attributes: ['nombre']
          }]
        }
      ],
      order: [[Mensaje, 'fecha_envio', 'DESC']],
      attributes: {
        include: [
          [MiembroComunidad.count, 'miembros']
        ]
      },
      group: ['Comunidad.id_comunidad'],
      having: { miembros: { [Op.gt]: 0 } }
    });

    // Calcular mensajes no leídos (simplificado)
    const comunidadesConStats = await Promise.all(comunidades.map(async (comunidad) => {
      const mensajesNoLeidos = await Mensaje.count({
        where: {
          id_comunidad: comunidad.id_comunidad,
          fecha_envio: { [Op.gt]: /* última vez que usuario vio chat */ new Date() } // Implementar lógica
        }
      });
      
      return {
        ...comunidad.toJSON(),
        ultimo_mensaje: comunidad.Mensajes?.[0],
        mensajes_no_leidos: mensajesNoLeidos,
        activa: !!comunidad.Mensajes?.[0]?.fecha_envio
      };
    }));

    res.json(comunidadesConStats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error listando comunidades" });
  }
};

export const crearComunidad = async (req, res) => {
  try {
    const id_usuario = req.userId;
    const { nombre, descripcion, es_publica = true } = req.body;

    const comunidad = await Comunidad.create({
      nombre,
      descripcion,
      es_publica,
      id_usuario_creador: id_usuario
    });

    // Agregar creador como moderador y miembro
    await MiembroComunidad.bulkCreate([
      {
        id_comunidad: comunidad.id_comunidad,
        id_usuario,
        es_moderador: true
      }
    ]);

    // Devolver con datos del creador
    const comunidadCompleta = await Comunidad.findByPk(comunidad.id_comunidad, {
      include: [{
        model: Usuario,
        as: 'Usuario',
        attributes: ['nombre', 'avatar']
      }]
    });

    res.status(201).json({ message: "Comunidad creada", comunidad: comunidadCompleta });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creando comunidad" });
  }
};

export const obtenerMensajesComunidad = async (req, res) => {
  try {
    const { id_comunidad } = req.params;
    const id_usuario = req.userId;

    // Verificar que usuario es miembro
    const esMiembro = await MiembroComunidad.findOne({
      where: { id_comunidad: parseInt(id_comunidad), id_usuario, activo: true }
    });

    if (!esMiembro && !req.userRole === 'admin') { // Permitir admins del sistema
      return res.status(403).json({ message: "No autorizado" });
    }

    const mensajes = await Mensaje.findAll({
      where: { id_comunidad: parseInt(id_comunidad) },
      include: [{
        model: Usuario,
        attributes: ['id_usuario', 'nombre', 'avatar']
      }],
      order: [['fecha_envio', 'ASC']],
      limit: 100 // Paginación en producción
    });

    res.json(mensajes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo mensajes" });
  }
};

export const enviarMensajeComunidad = async (req, res) => {
  try {
    const id_usuario = req.userId;
    const { id_comunidad } = req.params;
    const { mensaje, tipo = 'texto', mencionados = [] } = req.body;

    // Verificar membresía
    const esMiembro = await MiembroComunidad.findOne({
      where: { id_comunidad: parseInt(id_comunidad), id_usuario, activo: true }
    });

    if (!esMiembro) {
      return res.status(403).json({ message: "Debes ser miembro para enviar mensajes" });
    }

    const nuevoMensaje = await Mensaje.create({
      id_comunidad: parseInt(id_comunidad),
      id_usuario,
      mensaje,
      tipo,
      mencionados
    });

    // Enviar notificaciones push a mencionados (implementar según tu sistema)
    if (mencionados.length > 0) {
      // Lógica de notificaciones
      console.log(`Notificando a: ${mencionados.join(', ')}`);
    }

    const mensajeCompleto = await Mensaje.findByPk(nuevoMensaje.id_mensaje, {
      include: [{
        model: Usuario,
        attributes: ['id_usuario', 'nombre', 'avatar']
      }]
    });

    res.status(201).json({ message: "Mensaje enviado", mensaje: mensajeCompleto });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error enviando mensaje" });
  }
};