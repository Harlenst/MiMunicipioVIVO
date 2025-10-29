import { Grupo, MiembroGrupo, Mensaje, Usuario } from "../models/index.js";
import crypto from 'crypto';

export const listarGruposUsuario = async (req, res) => {
  try {
    const id_usuario = req.userId;
    
    const grupos = await Grupo.findAll({
      include: [
        {
          model: MiembroGrupo,
          where: { id_usuario, activo: true },
          attributes: [],
          include: [{
            model: Usuario,
            as: 'Usuario',
            attributes: ['nombre', 'avatar']
          }]
        },
        {
          model: Mensaje,
          limit: 1,
          order: [['fecha_envio', 'DESC']],
          attributes: ['id_mensaje', 'mensaje', 'fecha_envio']
        }
      ],
      order: [[Mensaje, 'fecha_envio', 'DESC']],
      attributes: {
        include: [
          [MiembroGrupo.count, 'miembros']
        ]
      }
    });

    res.json(grupos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error listando grupos" });
  }
};

export const crearGrupo = async (req, res) => {
  try {
    const id_usuario = req.userId;
    const { nombre, descripcion, es_privado = true } = req.body;

    // Generar código de invitación único
    let codigo_invitacion;
    let existe;
    do {
      codigo_invitacion = crypto.randomBytes(8).toString('hex').toUpperCase();
      existe = await Grupo.findOne({ where: { codigo_invitacion } });
    } while (existe);

    const grupo = await Grupo.create({
      nombre,
      descripcion,
      id_usuario_creador: id_usuario,
      codigo_invitacion,
      es_privado
    });

    // Agregar creador como admin
    await MiembroGrupo.create({
      id_grupo: grupo.id_grupo,
      id_usuario,
      rol: 'creador'
    });

    const grupoCompleto = await Grupo.findByPk(grupo.id_grupo, {
      include: [{
        model: Usuario,
        attributes: ['nombre', 'avatar']
      }]
    });

    res.status(201).json({ 
      message: "Grupo creado", 
      grupo: grupoCompleto,
      codigo_invitacion 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creando grupo" });
  }
};

export const unirseGrupoPorCodigo = async (req, res) => {
  try {
    const id_usuario = req.userId;
    const { codigo } = req.body;

    const grupo = await Grupo.findOne({ 
      where: { codigo_invitacion: codigo.toUpperCase(), activo: true } 
    });

    if (!grupo) {
      return res.status(404).json({ message: "Código inválido" });
    }

    // Verificar si ya es miembro
    const yaEsMiembro = await MiembroGrupo.findOne({
      where: { id_grupo: grupo.id_grupo, id_usuario }
    });

    if (yaEsMiembro) {
      return res.status(400).json({ message: "Ya eres miembro de este grupo" });
    }

    await MiembroGrupo.create({
      id_grupo: grupo.id_grupo,
      id_usuario,
      rol: 'miembro'
    });

    res.json({ message: "Unido al grupo exitosamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error uniéndose al grupo" });
  }
};

export const obtenerMensajesGrupo = async (req, res) => {
  try {
    const { id_grupo } = req.params;
    const id_usuario = req.userId;

    // Verificar membresía
    const esMiembro = await MiembroGrupo.findOne({
      where: { id_grupo: parseInt(id_grupo), id_usuario, activo: true }
    });

    if (!esMiembro) {
      return res.status(403).json({ message: "No eres miembro de este grupo" });
    }

    const mensajes = await Mensaje.findAll({
      where: { id_grupo: parseInt(id_grupo) },
      include: [{
        model: Usuario,
        attributes: ['id_usuario', 'nombre', 'avatar']
      }],
      order: [['fecha_envio', 'ASC']]
    });

    res.json(mensajes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo mensajes" });
  }
};

export const enviarMensajeGrupo = async (req, res) => {
  try {
    const id_usuario = req.userId;
    const { id_grupo } = req.params;
    const { mensaje, tipo = 'texto', mencionados = [] } = req.body;

    // Verificar membresía
    const esMiembro = await MiembroGrupo.findOne({
      where: { id_grupo: parseInt(id_grupo), id_usuario, activo: true }
    });

    if (!esMiembro) {
      return res.status(403).json({ message: "No eres miembro de este grupo" });
    }

    const nuevoMensaje = await Mensaje.create({
      id_grupo: parseInt(id_grupo),
      id_usuario,
      mensaje,
      tipo,
      mencionados
    });

    res.status(201).json({ message: "Mensaje enviado", mensaje: nuevoMensaje });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error enviando mensaje" });
  }
};