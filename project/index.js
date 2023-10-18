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
            "    (SELECT COUNT(participante_codigo) FROM participantes p WHERE p.ideventos = e.ideventos) AS cantidad_de_participantes\n" +
            "FROM eventos e\n" +
            "JOIN actividad act ON e.idactividad = act.idactividad\n" +
            "JOIN lugares lug ON e.idlugares = lug.idlugares;\n";

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

/*Metodos Post para la creacion en los roles de Delegado General y Delegado de Actividad*/

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