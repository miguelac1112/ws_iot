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


app.listen(3000, function () {
    console.log("servidor iniciado correctamente en el puerto 3000");
})