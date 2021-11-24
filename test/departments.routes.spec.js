require("dotenv").config();
const app = require("../src/app");
const request = require("supertest");

describe("Rest API Departamentos", () => {
  it("GET /api/v1/departamentos", async () => {
    const response = await request(app).get("/api/v1/departamentos");
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
    const deptos = response.body;
    expect(deptos.length).toBeGreaterThan(0);
  });

  it("GET /api/v1/departamentos/d009", async () => {
    const response = await request(app).get("/api/v1/departamentos/d009");
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
    const depto = response.body;
    expect(depto).toBeDefined();
    expect(depto.dept_no).toBeDefined();
    expect(depto.dept_no).toBe("d009");
    expect(depto.dept_name).toBeDefined();
    expect(depto.dept_name).toBe("Customer Service");
  });

  it("GET /api/v1/departamentos/d009/manager", async () => {
    const response = await request(app).get("/api/v1/departamentos/d009/manager");
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
    const manager = response.body;
    expect(manager).toBeDefined();
    expect(manager.emp_no).toBeDefined();
    expect(manager.emp_no).toBe(111939);
    expect(manager.first_name).toBeDefined();
    expect(manager.first_name).toBe("Yuchang");
  });

  it("GET /api/v1/departamentos/d00999", async () => {
    const response = await request(app).get("/api/v1/departamentos/d00999");
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("Departamento no encontrado!!!");
  });

  it("POST /api/v1/departamentos  sin parámetros", async () => {
    const response = await request(app).post("/api/v1/departamentos").send();
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("dept_no es Requerido!!!");
  });

  it("POST /api/v1/departamentos  sólo con dept_no", async () => {
    const depto = { dept_no: "d999" };
    const response = await request(app)
      .post("/api/v1/departamentos")
      .send(depto);
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("dept_name es Requerido!!!");
  });

  it("POST /api/v1/departamentos  sólo con dept_name", async () => {
    const depto = { dept_name: "Depto nueve nueve nueve" };
    const response = await request(app)
      .post("/api/v1/departamentos")
      .send(depto);
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("dept_no es Requerido!!!");
  });

  it("Verificar que agrega con POST /api/v1/departamentos", async () => {
    const depto = { dept_no: "d999", dept_name: "Depto nueve nueve nueve" };
    const response = await request(app)
      .post("/api/v1/departamentos")
      .send(depto);
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(201);
    expect(response.body).toStrictEqual(depto);

    //verificar que un objeto obtenido de la api conicide con el agregado
    const responseGET = await request(app).get("/api/v1/departamentos/d999");
    expect(responseGET).toBeDefined();
    expect(responseGET.statusCode).toBe(200);
    expect(responseGET.body).toStrictEqual(depto);

    // luego eliminar
    const responseDelete = await request(app)
      .delete("/api/v1/departamentos/d999")
      .send();
    expect(responseDelete).toBeDefined();
    expect(responseDelete.statusCode).toBe(204);
  });

  it("Verificar que modifica con PUT /api/v1/departamentos", async () => {
    const depto = { dept_no: "d999", dept_name: "Depto nueve nueve nueve" };
    //Primero Agregamos
    const response = await request(app)
      .post("/api/v1/departamentos")
      .send(depto);
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(201);
    expect(response.body).toStrictEqual(depto);

    //Ahora modificamos con PUT
    const deptoCopia = { ...depto }; //clonamos el objeto
    deptoCopia.dept_no = "este código no lo tiene en cuenta";
    deptoCopia.atributoAdicional =
      "a este atributo adicional tampoco lo tiene en cuenta";
    deptoCopia.dept_name = "Departamento 999"; //modifica el nombre del departamento
    const responseUpdate = await request(app)
      .put("/api/v1/departamentos/d999") // en la url debe ir la clave
      .send(deptoCopia); //enviamos la copia
    expect(responseUpdate).toBeDefined();
    expect(responseUpdate.statusCode).toBe(200);
    const deptoCopiaVerificar = { ...depto }; //clonamos el objeto
    deptoCopiaVerificar.dept_name = "Departamento 999"; //modifica el nombre del departamento
    expect(responseUpdate.body).toStrictEqual(deptoCopiaVerificar); //verificamos con la copia para verificar

    //verificar que un objeto obtenido de la api conicide con el agregado y luego modificado
    const responseGET = await request(app).get("/api/v1/departamentos/d999");
    expect(responseGET).toBeDefined();
    expect(responseGET.statusCode).toBe(200);
    expect(responseGET.body).toStrictEqual(deptoCopiaVerificar); //verificamos con la copia para verificar

    // luego eliminar
    const responseDelete = await request(app)
      .delete("/api/v1/departamentos/d999")
      .send();
    expect(responseDelete).toBeDefined();
    expect(responseDelete.statusCode).toBe(204);
  });

  //TP3

  it("GET /api/v1/departamentos/d009/employees", async () => {
    const response = await request(app).get("/api/v1/departamentos/d009/employees");
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
    const employees = response.body;
    const employee = employees[0];
    console.log(response.body[0]);
    expect(employees.length).toBeGreaterThan(1);
    expect(employee).toBeDefined();
    expect(employee.emp_no).toBe(10038);
    expect(employee.first_name).toBeDefined();
    expect(employee.first_name).toBe("Huan");
    //faltaria verificar que todos los elementos del array pertenezcan al objeto empleado
  });

  
  it("GET /api/v1/departamentos/empleado/10010/salario", async () => {
    const response = await request(app).get("/api/v1/departamentos/empleado/10010/salario");
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
    const salaries = response.body;
    const salary = salaries[0];
    console.log(response.body[0])
    expect(salary).toBeDefined();
    expect(salaries.length).toBeGreaterThan(1);
    expect(salary.last_name).toBe("Piveteau");
    expect(salary.first_name).toBeDefined();
    expect(salary.first_name).toBe("Duangkaew");
    expect(salary.salary).toBe(72488)
    //faltaria verificar que todos los elementos del array pertenezcan al objeto empleado
  });

  it("PUT /api/v1/departamentos/empleado/10014/salario", async () => {
    const salario = {salary: 867599};
    const date = new Date();
    date.setUTCHours(3,0,0,0);
 
    
    const respuestaEsperada = {
      "emp_no": 10014,
      "last_name": "Genin",
      "first_name": "Berni",
      "salary": 867599,
      "from_date": `${date.toISOString()}`,
      "to_date": "9999-01-01T03:00:00.000Z"
    }

    respuestaEsperada.from_date=date;
    //Primero modificamos
    const response = await request(app)
      .put("/api/v1/departamentos/empleado/10014/salario")
      .send(salario);
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(201);
    expect(response.body.emp_no).toBe(respuestaEsperada.emp_no);
    expect(response.body.from_date).toBe(date.toISOString());
    expect(response.body.salary).toBe(respuestaEsperada.salary);
    expect(response.body.to_date).toBe(respuestaEsperada.to_date);//SOLUCIONADO

    //Eliminamos el registro insertado
    
    const responseDelete = await request(app)
      .delete("/api/v1/departamentos/empleado/10014/salario")
      .send();
    expect(responseDelete).toBeDefined();
    expect(responseDelete.statusCode).toBe(204);


  })

  it("GET /api/v1/departamentos/empleado/10014/departamento", async () => {
    const response = await request(app).get("/api/v1/departamentos/empleado/10014/departamento");
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
    const deptos = response.body;
    const depto = deptos[0];
    console.log(response.body[0])
    expect(depto).toBeDefined();
    expect(depto.emp_no).toBe(10014);
    expect(depto.dept_no).toBeDefined();
    expect(depto.dept_no).toBe("d005");
    
  });

  it("PUT /api/v1/departamentos/empleado/10014/departamento", async () => {
    const depto = {dept_no: "d006"};
    const date = new Date();
    date.setUTCHours(3,0,0,0);
 
    
    const respuestaEsperada = {
      "emp_no": 10014,
      "dept_no": "d006",
      "from_date": `${date.toISOString()}`,
      "to_date": "9999-01-01T03:00:00.000Z"
    }

    respuestaEsperada.from_date=date;
    //Primero modificamos
    const response = await request(app)
      .put("/api/v1/departamentos/empleado/10014/departamento")
      .send(depto);
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(201);
    expect(response.body.emp_no).toBe(respuestaEsperada.emp_no);
    expect(response.body.dept_no).toBe(respuestaEsperada.dept_no);
    console.log(`from datee: ${JSON.stringify(response.body)}`);
    expect(response.body.from_date).toBe(date.toISOString());
    expect(response.body.to_date).toBe(respuestaEsperada.to_date);

    //Eliminamos el registro insertado
    const responseDelete = await request(app)
      .delete("/api/v1/departamentos/empleado/10014/departamento")
      .send();
    expect(responseDelete).toBeDefined();
    expect(responseDelete.statusCode).toBe(204);
  })

}


);



