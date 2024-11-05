const { Router } = require("express");
const router = Router();
const convert = require("xml-js");
const xmlbuilder = require('xmlbuilder');

const mysqlConnection = require("../database");

router.get("/", (req, res) => {
  mysqlConnection.query("Select * from empleados", (err, rows, fields) => {
    if (!err) {

      const root = xmlbuilder.create('empleados');



       // Iterate over the rows and add employee elements
       rows.forEach(row => {
        const empleado = root.element('empleado')
          empleado.ele('idEmpleado', row.idEmpleado)
          empleado.ele('nameEmpleado', row.nameEmpleado)
          empleado.ele('salarioEmpleado', row.salarioEmpleado)
          empleado.ele('cargoEmpleado', row.cargoEmpleado);
      });

      // Convertir el objeto a XML con la estructura deseada
      //  const result = convert.json2xml({ empleados }, { compact : true });

      // Convert the XML to a string
      const xmlString = root.end({ pretty: true });
       res.header("Content-Type", "application/xml");
       res.send(xmlString);

    } else {
      console.log(err);
    }
  });
});

router.get("/cargo", (req, res) => {
  mysqlConnection.query("Select * from empleados", (err, rows, fields) => {
    if (!err) {
      const cargosAgrupados = {
        cargos: rows.reduce((acc, empleado) => {
          let cargo = acc.find(
            (car) => car.nombreCargo === empleado.cargoEmpleado
          );

          // Si el cargo existe, añade el empleado; si no lo crea
          if (cargo) {
            cargo.empleados.push({
              id: empleado.idEmpleado,
              nombre: empleado.nameEmpleado,
              salario: empleado.salarioEmpleado,
              cargo: empleado.cargoEmpleado,
            });
          } else {
            acc.push({
              nombreCargo: empleado.cargoEmpleado,
              empleados: [
                {
                  id: empleado.idEmpleado,
                  nombre: empleado.nameEmpleado,
                  salario: empleado.salarioEmpleado,
                  cargo: empleado.cargoEmpleado,
                },
              ],
            });
          }

          return acc;
        }, []),
      };

      res.header("Content-Type", "application/xml");
      result = convert.js2xml(cargosAgrupados, { compact: true });
      res.send(result);
    } else {
      console.log(err);
    }
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  mysqlConnection.query(
    "Select * from empleados where idEmpleado = ?",
    [id],
    (err, rows, fields) => {
      if (!err) {
        res.header("Content-Type", "application/xml");
        result = convert.json2xml(rows[0], { compact: true });
        res.send(result);
      } else {
        console.log(err);
      }
    }
  );
});

router.post("/", (req, res) => {
  const { id, name, salary, cargo } = req.body;

  const query = `
        CALL empleadoAddorEdit(?,?,?,?);
            `;
  mysqlConnection.query(
    query,
    [id, name, salary, cargo],
    (err, rows, fields) => {
      if (!err) {
        res.send(
          convert.json2xml({ Status: "Empleado guardado" }, { compact: true })
        );
      } else {
        console.log(err);
      }
    }
  );
});

router.put("/:id", (req, res) => {
  const { name, salary, cargo } = req.body;
  const { id } = req.params;
  const query = `
      CALL empleadoAddorEdit(?,?,?,?);
          `;
  mysqlConnection.query(
    query,
    [id, name, salary, cargo],
    (err, rows, fields) => {
      if (!err) {
        res.send(
          convert.json2xml(
            { Status: "Empleado actualizado" },
            { compact: true }
          )
        );
      } else {
        console.log(err);
      }
    }
  );
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  mysqlConnection.query(
    "DELETE from empleados where idEmpleado = ?",
    [id],
    (err, rows, fields) => {
      if (!err) {
        res.send(
          convert.json2xml({ Status: "Empleado Eliminado" }, { compact: true })
        );
      } else {
        console.log(err);
      }
    }
  );
});

module.exports = router;
