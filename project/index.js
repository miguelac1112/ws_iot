const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const e = require("express");
const app = express();

const conn = mysql.createConnection({
    database: "mydb",
    user: "root",
    password: "root",
    host: "localhost",
    port: 3306
});

/*Listas generales a mostrar*/

    /*Lista de Eventos general vista en la vista de Usuario*/
    app.get("/listaEventos", function (req, res) {

        let sql = "SELECT\n" +
            "    e.nombre AS evento,\n" +
            "    e.descripcion,\n" +
            "    e.fecha,\n" +
            "    e.hora,\n" +
            "    e.estado,\n" +
            "    act.nombre AS actividad,\n" +
            "    (SELECT COUNT(participante_codigo) FROM participantes p WHERE p.ideventos = e.ideventos) AS apoyos\n" +
            "FROM eventos e\n" +
            "JOIN actividad act ON e.idactividad = act.idactividad\n" +
            "JOIN lugares lug ON e.idlugares = lug.idlugares where e.estado=1;\n";

        conn.query(sql, function (err, result, fields) {
            if (err) throw err;

            // Itera sobre los resultados y cambia el valor del campo e.estado
            result.forEach(function (evento) {
                evento.estado = (evento.estado === 1) ? "activo" : "finalizado";
            });

            console.log("query exitoso");
            console.log(result);

            res.json({
                lista: result
            });
        });

    });

    /*Lista de eventos de una actividad por id*/
    app.get('/listaEventosidDelegado/:idDelegado', (req, res) => {
        const idDelegado = req.params.idDelegado;

        // Consulta SQL para obtener la lista de eventos ordenados por fecha y hora
        const query = `SELECT
                           e.nombre AS evento,
                           e.descripcion,
                           e.fecha,
                           e.hora,
                           e.estado,
                           act.nombre AS actividad,
                           (SELECT COUNT(participante_codigo) FROM participantes p WHERE p.ideventos = e.ideventos) AS apoyos
                       FROM eventos e
                                JOIN actividad act ON e.idactividad = act.idactividad
                                JOIN lugares lug ON e.idlugares = lug.idlugares
                       where e.estado=1 and act.delegado_codigo=?`;

        conn.query(query, [idDelegado], (err, rows) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Error en la consulta' });
            } else {
                res.json({ eventos: rows });
            }
        });
    });


    /*Lista de Eventos general vista en la vista de Delegado General*/
    app.get("/listaActividades", function (req, res) {

        let sql = "select act.nombre AS actividad, act.descripcion, usuar.nombre AS delegado\n" +
            "from actividad act, usuario usuar\n" +
            "where act.delegado_codigo = usuar.codigo";
        conn.query(sql, function (err, result, fields) {
            if (err) throw err;
            console.log("query exitoso");
            console.log(result);
            res.json({
                lista: result
            });
        });

    });

    /*Lista de Usuarios general vista en la vista de Delegado General*/
    app.get("/listaUsuarios", function (req, res) {
        let sql = "select nombre, condicion, validado \n" +
            "from usuario\n" +
            "where rol = 2 or rol = 3";
        conn.query(sql, function (err, result, fields) {
            if (err) throw err;

            // Mapear los resultados
            result = result.map((usuario) => {
                // Mapear la condición
                if (usuario.condicion === 1) {
                    usuario.condicion = "Estudiante";
                } else if (usuario.condicion === 2) {
                    usuario.condicion = "Egresado";
                }

                // Mapear la validación
                if (usuario.validado === 1) {
                    usuario.validado = "Validado";
                } else {
                    usuario.validado = "Denegado";
                }

                return usuario;
            });

            console.log("query exitoso");
            console.log(result);
            res.json({
                lista: result
            });
        });
    });

    /*Lista de eventos de una actividad por id*/
    app.get('/listaEventosidActividad/:idActividad', (req, res) => {
        const idActividad = req.params.idActividad;

        // Consulta SQL para obtener la lista de eventos ordenados por fecha y hora
        const query = `
        SELECT
          ROW_NUMBER() OVER (ORDER BY CONCAT(ev.fecha, ' ', ev.hora) ASC) AS evento_numero,
          ev.nombre
        FROM actividad act
        JOIN eventos ev ON act.idactividad = ev.idactividad
        WHERE ev.idactividad = ?
        ORDER BY CONCAT(ev.fecha, ' ', ev.hora) ASC;
      `;

        conn.query(query, [idActividad], (err, rows) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Error en la consulta' });
            } else {
                res.json({ eventos: rows });
            }
        });
    });

    /*Lista de participantes de un evento por id*/
    app.get('/listaParticipantesidEvento/:idEvento', (req, res) => {
        const idEvento = req.params.idEvento;

        // Consulta SQL para obtener la lista de participantes numerada y ordenada por participante_codigo
        const query = `
            SELECT
                ROW_NUMBER() OVER (ORDER BY participante_codigo) AS numero_participante,
                participante_codigo,
                usuar.nombre,
                CASE
                    WHEN asignacion = 1 THEN 'participante'
                    WHEN asignacion = 2 THEN 'barra'
                    ELSE 'desconocido'
                    END AS asignacion
            FROM participantes p, usuario usuar
            WHERE p.participante_codigo = usuar.codigo
              AND ideventos = ?
      `;

        conn.query(query, [idEvento], (err, rows) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Error en la consulta' });
            } else {
                res.json({ participantes: rows });
            }
        });
    });

/*Metodos Post para la creacion en los roles de Delegado General y Delegado de Actividad*/

    /*Creacion de actividad como Delegado General*/

    app.post("/crearActividad", bodyParser.json(), function (req, res) {
        const getLastIdQuery = "SELECT MAX(idactividad) AS lastId FROM actividad";

        conn.query(getLastIdQuery, (err, result) => {
            if (err) {
                throw err;
            }

            let nombre = req.body.nombre;
            let descripcion = req.body.descripcion;
            let delegado_codigo = req.body.delegado_codigo;

            // Paso 2: Incrementar el valor
            const lastId = result[0].lastId;
            const newId = lastId + 1;

            // Paso 3: Insertar el nuevo registro con el nuevo id
            const insertQuery = "INSERT INTO actividad (idactividad, nombre, descripcion, delegado_codigo) VALUES (?, ?, ?, ?)";
            const values = [newId, nombre, descripcion, delegado_codigo]; // Reemplaza los valores por los que desees

            conn.query(insertQuery, values, (err, result) => {
                if (err) {
                    res.json({success: "failure"});
                }
                console.log("Nuevo registro insertado con idactividad: " + newId);
                res.json({success: "ok"});
            });
        });
    });

    /*Crear evento pero pasando el id de la actividad en el url, no se si funcione de esa forma para movil xd*/
    app.post("/crearEvento/:idActividad", bodyParser.json(), function (req, res) {
        // Obtén idActividad de la URL en lugar de req.body
        let idActividad = req.params.idActividad; // Aquí estamos tomando el parámetro de la URL

        const getLastIdQuery = "SELECT MAX(ideventos) AS lastId FROM eventos";

        // Define un mapeo para convertir el valor del lugar
        const lugarMap = {
            "Bati": 1,
            "Cancha de Minas": 2,
            "Polideportivo PUCP": 3,
            "Digimundo": 4,
            "Estacionamiento de Letras": 5
        };

        conn.query(getLastIdQuery, (err, result) => {
            if (err) {
                throw err;
            }

            let nombre = req.body.nombre;
            let descripcion = req.body.descripcion;
            let fecha = req.body.fecha;
            let hora = req.body.hora;
            let lugar = req.body.lugar; // Esto obtiene el valor original del lugar

            // Convierte el valor del lugar según el mapeo
            const lugarId = lugarMap[lugar] || null;

            // Paso 2: Incrementar el valor
            const lastId = result[0].lastId;
            const newId = lastId + 1;

            console.log(newId);
            console.log(nombre);
            console.log(descripcion);
            console.log(fecha);
            console.log(hora);
            console.log(idActividad);
            console.log(lugarId); // Ahora esto es el valor convertido según el mapeo

            const insertQuery = "INSERT INTO eventos (ideventos, nombre, descripcion, fecha, hora, idactividad, idlugares) VALUES (?, ?, ?, ?, ?, ?, ?)";
            const values = [newId, nombre, descripcion, fecha, hora, idActividad, lugarId];

            conn.query(insertQuery, values, (err, result) => {
                if (err) {
                    res.json({ success: "failure" });
                } else {
                    console.log("Nuevo registro insertado con ideventos: " + newId);
                    res.json({ success: "ok" });
                }
            });
        });
    });

    /*Crear evento pero pasando el id dentro del body*/
    app.post("/crearEvento", bodyParser.json(), function (req, res) {
        // Obtén idActividad de la URL en lugar de req.body

        const getLastIdQuery = "SELECT MAX(ideventos) AS lastId FROM eventos";

        // Define un mapeo para convertir el valor del lugar
        const lugarMap = {
            "Bati": 1,
            "Cancha de Minas": 2,
            "Polideportivo PUCP": 3,
            "Digimundo": 4,
            "Estacionamiento de Letras": 5
        };

        conn.query(getLastIdQuery, (err, result) => {
            if (err) {
                throw err;
            }

            let nombre = req.body.nombre;
            let descripcion = req.body.descripcion;
            let fecha = req.body.fecha;
            let hora = req.body.hora;
            let idActividad = req.body.idActividad; // Aquí estamos tomando el parámetro de la URL
            let lugar = req.body.lugar; // Esto obtiene el valor original del lugar

            // Convierte el valor del lugar según el mapeo
            const lugarId = lugarMap[lugar] || null;

            // Paso 2: Incrementar el valor
            const lastId = result[0].lastId;
            const newId = lastId + 1;

            console.log(newId);
            console.log(nombre);
            console.log(descripcion);
            console.log(fecha);
            console.log(hora);
            console.log(idActividad);
            console.log(lugarId); // Ahora esto es el valor convertido según el mapeo

            const insertQuery = "INSERT INTO eventos (ideventos, nombre, descripcion, fecha, hora, idactividad, idlugares) VALUES (?, ?, ?, ?, ?, ?, ?)";
            const values = [newId, nombre, descripcion, fecha, hora, idActividad, lugarId];

            conn.query(insertQuery, values, (err, result) => {
                if (err) {
                    res.json({ success: "failure" });
                } else {
                    console.log("Nuevo registro insertado con ideventos: " + newId);
                    res.json({ success: "ok" });
                }
            });
        });
    });



/*pruebita**/
app.post("/prueba", bodyParser.json(), function (req, res) {
        let nombre = req.body.nombre;
        let descripcion = req.body.descripcion;
        let delegado_codigo = req.body.delegado_codigo;
        console.log(nombre);
        console.log(descripcion);
        console.log(delegado_codigo);
    });



app.listen(3000, function () {
    console.log("servidor iniciado correctamente en el puerto 3000");
})