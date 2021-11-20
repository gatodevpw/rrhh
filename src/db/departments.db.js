const pool = require("./connection.db");
const TABLE = 'departments'
const TABLES = ['departments', 'employees', 'salaries', 'dept_emp', 'dept_manager']

/**
 * Retorna todos los departamentos
 * @returns 
 */
module.exports.getAll = async function () {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(`SELECT * FROM ${TABLE} d `);
    return rows;
  } catch (err) {
    return Promise.reject(err);
  } finally {
    if (conn) await conn.release();
  }
};

/**
 * Retorna un departamento por su clave primaria
 * @returns 
 */
module.exports.getById = async function (id) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(`SELECT * FROM ${TABLE} d WHERE dept_no=?`, [id]);
    return rows[0];
  } catch (err) {
    return Promise.reject(err);
  } finally {
    if (conn) await conn.release();
  }
};

/**
 * Retorna el manager actual de un Departamento y la fecha desde
 * @param {Object} departamento 
 * @returns 
 */
module.exports.getActualManager = async function (departamento) {
  let conn;
  try {
    conn = await pool.getConnection();
    const SQL = `
SELECT 
  e.*,
  dm.from_date AS fecha_desde
FROM dept_manager dm
	INNER JOIN employees e ON (e.emp_no = dm.emp_no)
WHERE dm.dept_no = ? AND dm.to_date='9999-01-01'
`;
    const rows = await conn.query(SQL, [departamento.dept_no]);
    return rows[0];
  } catch (err) {
    return Promise.reject(err);
  } finally {
    if (conn) await conn.release();
  }
};

/**
 * Agrega un departamento
 * @param {Object} departamento 
 * @returns 
 */
module.exports.add = async function (departamento) {
  let conn;
  try {
    conn = await pool.getConnection();
    const SQL = `INSERT INTO ${TABLE} (dept_no, dept_name) VALUES(?, ?)`
    const params = []
    params[0] = departamento.dept_no
    params[1] = departamento.dept_name
    const rows = await conn.query(SQL, params);
    return rows;
  } catch (err) {
    return Promise.reject(err);
  } finally {
    if (conn) await conn.release();
  }
};

/**
 * eliminar un Departamento
 * @param {Object} departamento 
 * @returns 
 */
module.exports.delete = async function (departamento) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(`DELETE FROM ${TABLE} WHERE dept_no=?`, [departamento.dept_no]);
    return rows;
  } catch (err) {
    return Promise.reject(err);
  } finally {
    if (conn) await conn.release();
  }
};

/**
 * Modifica un Departamento
 * @param {Object} departamento 
 * @returns 
 */
module.exports.update = async function (departamento) {
  let conn;
  try {
    conn = await pool.getConnection();
    const SQL = `UPDATE ${TABLE}  SET dept_name=? WHERE dept_no=?`
    const params = []
    params[0] = departamento.dept_name
    params[1] = departamento.dept_no
    const rows = await conn.query(SQL, params);
    return rows;
  } catch (err) {
    return Promise.reject(err);
  } finally {
    if (conn) await conn.release();
  }
};

/**
 *  Retorna el listado de empleados de un departamento por su número de departamento
 * @param {Object} departamento 
 * @returns 
 */
module.exports.getAllEmpByDept = async function (departamento) {
  let conn;
  try {
    conn = await pool.getConnection();
    const SQL = `
    SELECT 
      e.*,
      de.from_date AS fecha_desde
    FROM dept_emp de
      INNER JOIN employees e ON (e.emp_no = de.emp_no)
    WHERE de.dept_no = ? AND de.to_date='9999-01-01'
`;
    const rows = await conn.query(SQL, [departamento.dept_no]);
    console.log(rows)
    return rows;
  } catch (err) {
    return Promise.reject(err);
  } finally {
    if (conn) await conn.release();
  }
};

/**
 * Retorna un empleado por su clave primaria
 * @returns 
 */
 module.exports.getEmpById = async function (id) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(`SELECT * FROM ${TABLES[1]} d WHERE emp_no=?`, [id]);
    return rows[0];
  } catch (err) {
    return Promise.reject(err);
  } finally {
    if (conn) await conn.release();
  }
};

/**
 *  Permite obtener el listado de sueldos de un empleado por su número de empleado (emp_no).
 * @param {Object} employee 
 * @returns 
 */
module.exports.getSalaryByEmpNumber = async function (employee) {
  let conn;
  try {
    conn = await pool.getConnection();
    const SQL = `
    SELECT
        e.emp_no,
        e.last_name,
        e.first_name,
        s.salary,
        s.from_date,
        s.to_date
    FROM salaries s
        INNER JOIN employees e USING (emp_no)
    WHERE emp_no = ?
`;
    const rows = await conn.query(SQL, [employee.emp_no]);
    console.log(rows)
    return rows;
  } catch (err) {
    return Promise.reject(err);
  } finally {
    if (conn) await conn.release();
  }
};

/**
 * Modifica el salario de un empleado
 * @param {Object} salary 
 * @returns 
 */
 module.exports.updateSalary = async function (salary) {
  let conn;
  try {
    conn = await pool.getConnection();
    const SQL_UPDATE = `UPDATE ${TABLES[2]}  SET to_date=CURRENT_DATE() WHERE emp_no=? AND to_date = '9999-01-01'`
    const SQL_INSERT = `INSERT INTO ${TABLES[2]} (emp_no, salary, from_date, to_date) VALUES (?,?,CURRENT_DATE(),'9999-01-01')`
    const params = [salary.emp_no, salary.salary] 
    const rows_update = await conn.query(SQL_UPDATE, params[0]);
    const rows_insert = await conn.query(SQL_INSERT, params);
    return [rows_update, rows_insert];
  } catch (err) {
    return Promise.reject(err);
  } finally {
    if (conn) await conn.release();
  }
};

/**
 *  Permite obtener el depto de un empleado por su número de empleado (emp_no).
 * @param {Object} employee 
 * @returns 
 */
 module.exports.getDeptByEmpNumber = async function (employee) {
  let conn;
  try {
    conn = await pool.getConnection();
    const SQL = `
    SELECT
      e.emp_no,
      d.dept_no,
      d.from_date,
      d.to_date
    FROM dept_emp d
        INNER JOIN employees e USING (emp_no)
    WHERE emp_no = ?
`;
    const rows = await conn.query(SQL, [employee.emp_no]);
    console.log(rows)
    return rows;
  } catch (err) {
    return Promise.reject(err);
  } finally {
    if (conn) await conn.release();
  }
};

/**
 * Modifica el departamento de un empleado
 * @param {Object} dept
 * @returns 
 */
 module.exports.updateDepartment = async function (dept) {
  let conn;
  try {
    conn = await pool.getConnection();
    const SQL_UPDATE = `UPDATE ${TABLES[3]}  SET to_date=CURRENT_DATE() WHERE emp_no=? AND to_date = '9999-01-01'`
    const SQL_INSERT = `INSERT INTO ${TABLES[3]} (emp_no, dept_no, from_date, to_date) VALUES (?,?,CURRENT_DATE(),'9999-01-01')`
    const params = [dept.emp_no, dept.dept_no] 
    const rows_update = await conn.query(SQL_UPDATE, params[0]);
    const rows_insert = await conn.query(SQL_INSERT, params);
    return [rows_update, rows_insert];
  } catch (err) {
    return Promise.reject(err);
  } finally {
    if (conn) await conn.release();
  }
};



/**
 * Modifica el departamento de un jefe
 * @param {Object} dept
 * @returns 
 */
 module.exports.updateManagerDepartment = async function (dept) {
  let conn;
  try {
    conn = await pool.getConnection();
    const SQL_UPDATE = `UPDATE ${TABLES[4]}  SET to_date=CURRENT_DATE() WHERE emp_no=? AND to_date = '9999-01-01'`
    const SQL_INSERT = `INSERT INTO ${TABLES[4]} (emp_no, dept_no, from_date, to_date) VALUES (?,?,CURRENT_DATE(),'9999-01-01')`
    const params = [dept.emp_no, dept.dept_no] 
    const rows_update = await conn.query(SQL_UPDATE, params[0]);
    const rows_insert = await conn.query(SQL_INSERT, params);
    return [rows_update, rows_insert];
  } catch (err) {
    return Promise.reject(err);
  } finally {
    if (conn) await conn.release();
  }
};


