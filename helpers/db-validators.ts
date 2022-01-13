const pool = require("../mysql/database");

export const existsPerson = async (dni: string) => {
  const dataPerson = await pool.query("SELECT * FROM persona WHERE dni = ?", [
    dni,
  ]);
  if (dataPerson?.length > 0) {
    throw new Error("La persona ya existe");
  }
};

export const existsRole = async (tipo_usuario: string) => {
  tipo_usuario = tipo_usuario.toUpperCase();
  const dataRoles = await pool.query(
    "SELECT * FROM tipo_cuenta WHERE nombre = ?",
    [tipo_usuario]
  );
  if (dataRoles?.length === 0) {
    throw new Error("El Rol no existe");
  }
};
export const existsInvestigator = async (idInvestigador: number) => {
  const dataInvestigator = await pool.query(
    `SELECT * FROM investigador WHERE id_investigador=${idInvestigador}`
  );
  if (dataInvestigator?.length === 0) {
    throw new Error("El investigador no existe");
  }
};
export const existsAsesor = async (idAsesor: number) => {
  const dataAsesor = await pool.query(
    `SELECT * FROM asesor WHERE id_asesor=${idAsesor}`
  );
  if (dataAsesor?.length === 0) {
    throw new Error("El asesor no existe");
  }
};

export const existsInvestigation = async (idInvestigacion: number) => {
  const dataInvestigation = await pool.query(
    `SELECT * FROM investigacion WHERE id_investigacion=${idInvestigacion}`
  );
  if (dataInvestigation?.length === 0) {
    throw new Error("La investigacion no existe");
  }
};

export const validPerson = async (idPerson: number) => {
  const dataPerson = await pool.query(
    `SELECT * FROM persona WHERE id_persona=${idPerson}`
  );
  if (dataPerson?.length === 0) {
    throw new Error("La persona no existe");
  }
};
