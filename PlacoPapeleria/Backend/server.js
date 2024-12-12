const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '260832',
  database: 'papeleria',
  connectTimeout: 10000
});

db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos');
});

//endpoint para listar las tablas con procedimiento almacenado
app.get('/api/tablas', (req, res) => {
  db.query('CALL listarTablas();', (err, results) => {
    if (err) {
      console.error('Error ejecutando consulta:', err);
      res.status(500).send(err);
      return;
    }
    res.json(results[0]);
  });
});

//endpoint para obtener los datos de una tabla específica
app.get('/api/tabla/:nombre', (req, res) => {
  const { nombre } = req.params;
  db.query(`SELECT * FROM ??`, [nombre], (err, results) => {
    if (err) {
      console.error('Error ejecutando consulta:', err);
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

//endpoint para obtener la estructura de una tabla con procedimiento almacenado
app.get('/api/estructura/:tabla', (req, res) => {
  const { tabla } = req.params;
  db.query('CALL ObtenerEstructuraTabla(?)', [tabla], (err, results) => {
    if (err) {
      console.error('Error obteniendo estructura de la tabla:', err);
      res.status(500).send(err);
      return;
    }
    res.json(results[0]);
  });
});



// app.get('/api/empleados', (req, res) => {
//   db.query('SELECT id_empleado, nombre FROM empleado', (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ message: 'Error al obtener empleados.' });
//     }
//     res.json(results);
//   });
// });


// app.get('/api/formasPago', (req, res) => {
//   db.query('SELECT id_formapago, nombre FROM forma_pago', (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ message: 'Error al obtener formas de pago.' });
//     }
//     res.json(results);
//   });
// });

//obtener empleados con procedimiento almacenado
app.get('/api/empleados', (req, res) => {
  db.query('CALL ObtenerEmpleados()', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al obtener empleados.' });
    }
    res.json(results[0]);
  });
});

//obtener ids de productos
app.get('/api/ID_productos', (req, res) => {
  db.query('SELECT id_producto, nombre FROM producto order by id_producto asc', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al obtener productos.' });
    }
    res.json(results);
  });
});

//obtener formas de pago 
app.get('/api/formas_pago', (req, res) => {
  res.json([{ id_formapago: 1, tipo: 'Efectivo', descripcion: 'Pago en efectivo' }, { id_formapago: 2, tipo: 'Tarjeta de Crédito', descripcion: 'Pago con tarjeta de crédito' }, { id_formapago: 3, tipo: 'Tarjeta de Débito', descripcion: 'Pago con tarjeta de débito' }]);
});

//obtener razones de devolucion
app.get('/api/razones', (req, res) => {
  res.json([{ id_razon: 1, descripcion: 'Producto defectuoso' }, { id_razon: 2, descripcion: 'Producto incorrecto' }, { id_razon: 3, descripcion: 'Producto dañado' }, { id_razon: 4, descripcion: 'Compra accidental' }, { id_razon: 5, descripcion: 'Otro' }]);
});

//obtener sucursales con procedimiento almacenado
app.get('/api/sucursales', (req, res) => {
  db.query('CALL ObtenerSucursales', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al obtener las sucursales' });
    }
    res.json(results[0]);
  });
});

//obtnener ventas
app.get('/api/ventas', (req, res) => {
  db.query('SELECT id_venta FROM venta', (err, results) => {
    if (err) {
      console.error('Error al obtener las ventas:', err);
      return res.status(500).json({ message: 'Error al obtener las ventas' });
    }
    res.status(200).json(results);
  });
});

//agregar una columna
app.post('/api/agregar-columna', (req, res) => {
  const { tabla, columna, tipo } = req.body;

  if (!tabla || !columna || !tipo) {
    return res.status(400).json({ message: 'Faltan datos para agregar la columna.' });
  }

  const query = `ALTER TABLE ?? ADD COLUMN ?? ${tipo}`;
  db.query(query, [tabla, columna], (err, results) => {
    if (err) {
      console.error('Error al agregar la columna:', err);
      return res.status(500).json({ message: 'Error al agregar la columna.' });
    }

    res.status(200).json({ message: `Columna ${columna} añadida con éxito a la tabla ${tabla}` });
  });
});


//agregar un nuevo registro a una tabla
app.post('/api/tabla/:tabla', (req, res) => {
  const { tabla } = req.params;
  const nuevoRegistro = req.body;

  db.query(`INSERT INTO ?? SET ?`, [tabla, nuevoRegistro], (err, results) => {
    if (err) {
      console.error('Error al insertar registro:', err);
      res.status(500).send(err);
      return;
    }
    res.status(201).send({ message: 'Registro agregado correctamente' });
  });
});

//eliminar un registro por ID 
app.delete('/api/tabla/:tabla/:id', (req, res) => {
  const { tabla, id } = req.params;

  //obtener la estructura de la tabla para identificar la columna clave primaria
  db.query(`DESCRIBE ??`, [tabla], (err, results) => {
    if (err) {
      console.error('Error obteniendo estructura de la tabla:', err);
      return res.status(500).json({ error: 'Error obteniendo estructura de la tabla.' });
    }

    //buscar el primer campo que sea una clave primaria
    const campoId = results.find(col => col.Key === 'PRI')?.Field;

    if (!campoId) {
      return res.status(400).json({ error: 'No se encontró un campo clave primaria en la tabla.' });
    }

    //eliminar el registro usando el campo identificado como clave primaria
    const sql = `DELETE FROM ?? WHERE ?? = ?`;
    db.query(sql, [tabla, campoId, id], (err, result) => {
      if (err) {
        console.error('Error al eliminar registro:', err);
        return res.status(500).json({ error: 'Error al eliminar el registro.' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Registro no encontrado.' });
      }

      res.status(200).json({ message: 'Registro eliminado correctamente.' });
    });
  });
});


//obtener un registro específico por ID
app.get('/api/tabla/:tabla/registro/:id', (req, res) => {
  const { tabla, id } = req.params;

  //obtener la estructura de la tabla para identificar la clave primaria
  db.query(`DESCRIBE ??`, [tabla], (err, estructura) => {
    if (err) {
      console.error('Error obteniendo estructura de la tabla:', err);
      return res.status(500).send(err);
    }

    const campoId = estructura.find((col) => col.Key === 'PRI')?.Field;
    if (!campoId) {
      return res.status(400).json({ error: 'Clave primaria no encontrada en la tabla.' });
    }

    //obtener el registro específico
    db.query(`SELECT * FROM ?? WHERE ?? = ?`, [tabla, campoId, id], (err, result) => {
      if (err) {
        console.error('Error ejecutando consulta:', err);
        return res.status(500).send(err);
      }
      if (result.length === 0) {
        return res.status(404).json({ error: 'Registro no encontrado.' });
      }
      res.json(result[0]);
    });
  });
});

//actualizar un registro
app.put('/api/tabla/:tabla/registro/:id', (req, res) => {
  const { tabla, id } = req.params;
  const datosActualizados = req.body;

  //obtener la estructura de la tabla para identificar la clave primaria
  db.query(`DESCRIBE ??`, [tabla], (err, estructura) => {
    if (err) {
      console.error('Error obteniendo estructura de la tabla:', err);
      return res.status(500).send(err);
    }

    const campoId = estructura.find((col) => col.Key === 'PRI')?.Field;
    if (!campoId) {
      return res.status(400).json({ error: 'Clave primaria no encontrada en la tabla.' });
    }

    //actualizar el registro
    db.query(`UPDATE ?? SET ? WHERE ?? = ?`, [tabla, datosActualizados, campoId, id], (err, result) => {
      if (err) {
        console.error('Error actualizando registro:', err);
        return res.status(500).send(err);
      }
      res.json({ message: 'Registro actualizado correctamente.' });
    });
  });
});



//endpoint para obtener los datos de una tabla específica
app.get('/api/tabla/:nombre', (req, res) => {
  const { nombre } = req.params;
  db.query(`SELECT * FROM ??`, [nombre], (err, results) => {
    if (err) {
      console.error('Error ejecutando consulta:', err);
      res.status(500).send(err);
      return;
    }
    res.json({
      description: `Consulta que obtiene todos los registros de la tabla ${nombre}`,
      data: results
    });
  });
});

app.get('/api/productos', (req, res) => {
  db.query('SELECT * FROM producto', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.get('/api/clientes', (req, res) => {
  db.query('SELECT * FROM cliente', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// VENTA
app.post('/api/venta', (req, res) => {
  const { id_cliente, total, productos, id_empleado, id_formapago, id_sucursal } = req.body;

  if (!id_cliente || !total || productos.length === 0 || !id_empleado || !id_formapago || !id_sucursal) {
    return res.status(400).json({ message: 'Faltan datos para registrar la venta' });
  }

  console.log('Venta a enviar:', req.body);

  //validar el inventario antes de cualquier operación
  const validarInventario = productos.map(({ id_producto, cantidad }) => {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT cantidad FROM inventario WHERE id_producto = ? AND id_sucursal = ?',
        [id_producto, id_sucursal],
        (err, result) => {
          if (err) {
            console.error('Error al verificar inventario:', err);
            return reject(new Error('Error al verificar inventario'));
          }

          if (!result || result.length === 0 || result[0].cantidad < cantidad) {
            return reject(
              new Error(`Stock insuficiente para el producto con ID ${id_producto} en la sucursal ${id_sucursal}.`)
            );
          }

          resolve();
        }
      );
    });
  });

  //validar inventario primero
  Promise.all(validarInventario)
    .then(() => {
      //si la validación de inventario fue exitosa, registrar la venta
      db.query(
        'INSERT INTO venta (fecha, total, id_cliente, id_empleado, id_formapago, id_sucursal) VALUES (CURDATE(), ?, ?, ?, ?, ?)',
        [total, id_cliente, id_empleado, id_formapago, id_sucursal],
        (err, result) => {
          if (err) {
            console.error('Error al insertar la venta:', err);
            return res.status(500).json({ message: 'Error al registrar la venta' });
          }

          const id_venta = result.insertId; //ID de la venta registrada

          //insertar productos en detalle_venta
          const detallesVentaPromises = productos.map(({ id_producto, cantidad, precio_unitario }) => {
            return new Promise((resolve, reject) => {
              db.query(
                'INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
                [id_venta, id_producto, cantidad, precio_unitario],
                (err) => {
                  if (err) {
                    console.error('Error al insertar detalle de venta:', err);
                    return reject(new Error('Error al registrar los detalles de la venta'));
                  }
                  resolve();
                }
              );
            });
          });

          Promise.all(detallesVentaPromises)
            .then(() => {
              //actualizar el total de la venta después de insertar los productos
              db.query(
                'UPDATE venta SET total = (SELECT SUM(dv.cantidad * dv.precio_unitario) FROM detalle_venta dv WHERE dv.id_venta = ?) WHERE id_venta = ?',
                [id_venta, id_venta],
                (err) => {
                  if (err) {
                    console.error('Error al actualizar el total:', err);
                    return res.status(500).json({ message: 'Error al actualizar el total de la venta' });
                  }
                }
              );

              //actualizar inventario después de la venta
              const actualizarInventarioPromises = productos.map(({ id_producto, cantidad }) => {
                return new Promise((resolve, reject) => {
                  db.query(
                    'UPDATE inventario SET cantidad = cantidad - ? WHERE id_producto = ? AND id_sucursal = ?',
                    [cantidad, id_producto, id_sucursal],
                    (err) => {
                      if (err) {
                        console.error('Error al actualizar inventario:', err);
                        return reject(new Error('Error al actualizar inventario'));
                      }
                      resolve();
                    }
                  );
                });
              });

              Promise.all(actualizarInventarioPromises)
                .then(() => {
                  res.status(200).json({ message: 'Venta registrada con éxito' });
                })
                .catch((err) => {
                  console.error('Error al actualizar inventario:', err);
                  res.status(500).json({ message: err.message || 'Error al actualizar el inventario' });
                });
            })
            .catch((err) => {
              console.error('Error al registrar detalles de venta:', err);
              res.status(500).json({ message: err.message || 'Error al registrar detalles de venta' });
            });
        }
      );
    })
    .catch((err) => {
      console.error('Error en validación de inventario:', err.message);
      res.status(400).json({ message: err.message });
    });
});
//FIN VENTA



// DEVOLUCION
app.post('/api/devoluciones', (req, res) => {
  const { id_venta, id_producto, cantidad, razon, estado } = req.body;

  if (!id_venta || !id_producto || !cantidad || !razon) {
    return res.status(400).json({ message: 'Datos incompletos para la devolución.' });
  }

  //validar que el producto esté presente en la venta y que la cantidad no sea mayor que la comprada
  db.query(
    'SELECT dv.cantidad FROM detalle_venta dv INNER JOIN venta v ON v.id_venta = dv.id_venta WHERE v.id_venta = ? AND dv.id_producto = ?',
    [id_venta, id_producto],
    (err, result) => {
      if (err) {
        console.error('Error al validar la venta:', err);
        return res.status(500).json({ message: 'Error al validar la venta.' });
      }

      if (!result || result.length === 0) {
        //el producto no fue comprado en esa venta
        return res.status(400).json({ message: 'Este producto no fue comprado en la venta indicada.' });
      }

      const cantidadComprada = result[0].cantidad;

      if (cantidad > cantidadComprada) {
        //la cantidad que se quiere devolver es mayor a la cantidad comprada
        return res.status(400).json({ message: `No puedes devolver más de ${cantidadComprada} unidades de este producto.` });
      }

      //si la validación es exitosa, proceder con la devolución
      db.query(
        'INSERT INTO devolucion (fecha, cantidad, razon, estado, id_venta, id_producto) VALUES (NOW(), ?, ?, ?, ?, ?)',
        [cantidad, razon, estado, id_venta, id_producto],
        (err, result) => {
          if (err) {
            console.error('Error al registrar la devolución:', err);
            return res.status(500).json({ message: 'Error al registrar la devolución.' });
          }

          //actualizar el inventario
          db.query(
            'UPDATE inventario SET cantidad = cantidad + ? WHERE id_producto = ?',
            [cantidad, id_producto],
            (err) => {
              if (err) {
                console.error('Error al actualizar el inventario:', err);
                return res.status(500).json({ message: 'Error al actualizar el inventario.' });
              }

              res.status(200).json({ message: 'Devolución registrada con éxito.' });
            }
          );
        }
      );
    }
  );
});
// FIN DEVOLUCION



app.get('/api/query/:id', (req, res) => {
  const queryId = req.params.id;

  //mapa de queries
  const queries = {
    1: `SELECT 
    c.nombre AS cliente, 
    SUM(dv.cantidad * dv.precio_unitario) - COALESCE(SUM(d.cantidad * dv.precio_unitario), 0) AS total_neto_ventas
    FROM detalle_venta dv
    JOIN venta v ON dv.id_venta = v.id_venta
    JOIN cliente c ON v.id_cliente = c.id_cliente
    LEFT JOIN devolucion d ON dv.id_venta = d.id_venta AND dv.id_producto = d.id_producto
    GROUP BY c.id_cliente
    ORDER BY total_neto_ventas DESC;`,
  
  
    2: 
    `SELECT 
    p.nombre AS producto, 
    COUNT(d.id_devolucion) AS total_devoluciones
    FROM devolucion d
    JOIN producto p ON d.id_producto = p.id_producto
    GROUP BY p.id_producto
    ORDER BY total_devoluciones DESC;`,
  

    3: `SELECT 
    c.nombre AS cliente, 
    SUM(dv.cantidad * dv.precio_unitario) - COALESCE(SUM(d.cantidad * dv.precio_unitario), 0) AS total_neto_ventas
    FROM cliente c
    LEFT JOIN venta v ON c.id_cliente = v.id_cliente
    LEFT JOIN detalle_venta dv ON v.id_venta = dv.id_venta
    LEFT JOIN devolucion d ON dv.id_venta = d.id_venta AND dv.id_producto = d.id_producto
    GROUP BY c.id_cliente
    ORDER BY total_neto_ventas DESC;
`,
  
    4: `SELECT 
    o.id_orden, 
    p.nombre AS producto, 
    doc.cantidad, 
    i.cantidad AS inventario_actual
    FROM detalle_orden_compra doc
    JOIN orden_compra o ON doc.id_orden = o.id_orden
    JOIN producto p ON doc.id_producto = p.id_producto
    JOIN inventario i ON doc.id_producto = i.id_producto
    GROUP BY o.id_orden
    ORDER BY o.id_orden;`,
  
    5: `SELECT 
    p.nombre AS producto, 
    SUM(dv.cantidad * dv.precio_unitario) - COALESCE(SUM(d.cantidad * dv.precio_unitario), 0) AS ventas_netas
    FROM producto p
    LEFT JOIN detalle_venta dv ON p.id_producto = dv.id_producto
    LEFT JOIN devolucion d ON dv.id_venta = d.id_venta AND dv.id_producto = d.id_producto
    GROUP BY p.id_producto
    ORDER BY ventas_netas DESC;`,
  
    6: `SELECT 
    c.nombre AS cliente, 
    AVG(dv.cantidad) AS promedio_productos_comprados
    FROM cliente c
    JOIN venta v ON c.id_cliente = v.id_cliente
    JOIN detalle_venta dv ON v.id_venta = dv.id_venta
    GROUP BY c.id_cliente
    ORDER BY promedio_productos_comprados DESC;`,
  
    7: `SELECT 
    o.id_orden, 
    SUM(doc.cantidad * doc.precio_unitario) AS costo_total
    FROM orden_compra o
    JOIN detalle_orden_compra doc ON o.id_orden = doc.id_orden
    GROUP BY o.id_orden
    ORDER BY costo_total DESC;`,
  
    8: `SELECT 
    d.razon AS razon, 
    COUNT(d.id_devolucion) AS total_devoluciones, 
    SUM(dv.cantidad * dv.precio_unitario) AS impacto_en_ventas
    FROM devolucion d
    JOIN detalle_venta dv ON d.id_venta = dv.id_venta
    GROUP BY d.razon
    ORDER BY impacto_en_ventas DESC;`,
  
    9: `SELECT 
    c.nombre AS cliente, 
    COUNT(DISTINCT dv.id_producto) AS productos_unicos
    FROM cliente c
    JOIN venta v ON c.id_cliente = v.id_cliente
    JOIN detalle_venta dv ON v.id_venta = dv.id_venta
    GROUP BY c.id_cliente
    ORDER BY productos_unicos DESC;`,
  
    10: `SELECT 
    p.nombre AS producto, 
    SUM(doc.cantidad) AS total_ordenado
    FROM producto p
    JOIN detalle_orden_compra doc ON p.id_producto = doc.id_producto
    GROUP BY p.id_producto
    ORDER BY total_ordenado DESC;`,
  
    11: `SELECT 
    c.nombre AS cliente, 
    COUNT(DISTINCT d.id_producto) AS productos_devueltos
    FROM cliente c
    JOIN venta v ON c.id_cliente = v.id_cliente
    JOIN devolucion d ON v.id_venta = d.id_venta
    GROUP BY c.id_cliente
    ORDER BY productos_devueltos DESC;`,
  
    12: `SELECT 
    s.nombre AS sucursal, 
    COALESCE(SUM(dv.cantidad * dv.precio_unitario), 0) AS ingresos_totales, 
    COALESCE(SUM(g.monto), 0) AS gastos_totales, 
    COALESCE(SUM(dv.cantidad * dv.precio_unitario), 0) - COALESCE(SUM(g.monto), 0) AS balance_neto
    FROM sucursal s
    LEFT JOIN inventario i ON s.id_sucursal = i.id_sucursal
    LEFT JOIN producto p ON i.id_producto = p.id_producto
    LEFT JOIN detalle_venta dv ON p.id_producto = dv.id_producto
    LEFT JOIN gasto g ON s.id_sucursal = g.id_sucursal
    GROUP BY s.id_sucursal
    ORDER BY balance_neto DESC;`,
  
    13: `SELECT 
    s.nombre AS sucursal, 
    SUM(i.cantidad) AS total_inventario
    FROM sucursal s
    JOIN inventario i ON s.id_sucursal = i.id_sucursal
    GROUP BY s.id_sucursal
    ORDER BY total_inventario DESC;`,
      
    14: `SELECT 
    e.nombre AS empleado, 
    AVG(dv.cantidad * dv.precio_unitario) AS promedio_ventas
    FROM empleado e
    JOIN venta v ON e.id_empleado = v.id_empleado
    JOIN detalle_venta dv ON v.id_venta = dv.id_venta
    GROUP BY e.id_empleado
    ORDER BY promedio_ventas DESC;`,
  
    15: `SELECT 
    s.nombre AS sucursal, 
    p.nombre AS producto, 
    SUM(dv.cantidad) AS total_vendidos
    FROM sucursal s
    JOIN inventario i ON s.id_sucursal = i.id_sucursal
    JOIN producto p ON i.id_producto = p.id_producto
    JOIN detalle_venta dv ON p.id_producto = dv.id_producto
    GROUP BY s.id_sucursal, p.id_producto
    ORDER BY total_vendidos DESC;`,
  
    16: `SELECT 
    s.nombre AS sucursal, 
    SUM(g.monto) AS total_gastos
    FROM sucursal s
    JOIN gasto g ON s.id_sucursal = g.id_sucursal
    GROUP BY s.id_sucursal
    ORDER BY total_gastos DESC;`,
  
    17: `SELECT 
    p.nombre AS producto, 
    SUM(dv.cantidad) AS total_vendidos, 
    SUM(dv.cantidad * dv.precio_unitario) AS ganancias_totales
    FROM producto p
    JOIN detalle_venta dv ON p.id_producto = dv.id_producto
    GROUP BY p.id_producto
    ORDER BY ganancias_totales DESC;`,
  
    18: `SELECT 
    c.nombre AS cliente, 
    AVG(dv.cantidad * dv.precio_unitario) AS promedio_gasto
    FROM cliente c
    JOIN venta v ON c.id_cliente = v.id_cliente
    JOIN detalle_venta dv ON v.id_venta = dv.id_venta
    GROUP BY c.id_cliente
    ORDER BY promedio_gasto DESC;`,

    19: `SELECT 
    s.nombre AS sucursal, 
    e.nombre AS empleado, 
    SUM(dv.cantidad * dv.precio_unitario) AS ventas_totales
    FROM sucursal s
    JOIN empleado e ON s.id_sucursal = e.id_sucursal
    JOIN venta v ON e.id_empleado = v.id_empleado
    JOIN detalle_venta dv ON v.id_venta = dv.id_venta
    GROUP BY s.id_sucursal, e.id_empleado
    ORDER BY ventas_totales DESC;`,

    20: `SELECT 
    o.id_orden, 
    COUNT(DISTINCT doc.id_producto) AS productos_diferentes, 
    SUM(doc.cantidad * doc.precio_unitario) AS costo_total
    FROM orden_compra o
    JOIN detalle_orden_compra doc ON o.id_orden = doc.id_orden
    GROUP BY o.id_orden
    ORDER BY productos_diferentes DESC, costo_total DESC;`,

    21: `SELECT 
    s.nombre AS sucursal, 
    COALESCE(SUM(dv.cantidad * dv.precio_unitario), 0) AS ingresos_totales, 
    SUM(i.cantidad) AS inventario_actual
    FROM sucursal s
    LEFT JOIN inventario i ON s.id_sucursal = i.id_sucursal
    LEFT JOIN producto p ON i.id_producto = p.id_producto
    LEFT JOIN detalle_venta dv ON p.id_producto = dv.id_producto
    GROUP BY s.id_sucursal
    ORDER BY ingresos_totales DESC;`
};
  

  const query = queries[queryId];

  if (!query) {
    return res.status(404).json({ error: 'Consulta no encontrada.' });
  }

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error ejecutando consulta:', err);
      return res.status(500).send(err);
    }
    res.json({ data: results });
  });
});


//iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});