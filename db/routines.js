const { attachActivitiesToRoutines } = require("./activities");
const client = require("./client");
const { addActivityToRoutine } = require("./routine_activities");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const { rows: [routine] } = await client.query(`
      INSERT INTO routines("creatorId", "isPublic", name, goal) 
      VALUES($1, $2, $3, $4) 
      RETURNING *;
    `, [creatorId, isPublic, name, goal]);

    return routine;
  } catch (error) {
    throw error;
  }

}

async function getRoutineById(id) {
  const { rows: [routines] } = await client.query(`
  SELECT * FROM routines;
  WHERE routines.id = ${id}
`, [id]);


  return routines;
}

async function getRoutinesWithoutActivities() {
  const { rows: routines } = await client.query(`
  SELECT * FROM routines;
`);

console.log(routines);
  return routines;

}

async function getAllRoutines() {
  const { rows: routines } = await client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id
    `);
  console.log(routines)

  return await attachActivitiesToRoutines(routines)
    // const allRoutines = await attachActivitiesToRoutines(routines);

    // return allRoutines;
  
}

async function getAllPublicRoutines() {
  // where ispublic is true
 }

async function getAllRoutinesByUser({ username }) {
  const { rows: routines } = await client.query(`
  SELECT users.username AS creatorName, routines.* FROM routines
  JOIN users ON routines."creatorId"= users.id
  WHERE users.username = ${username};
`)

  return await addActivityToRoutine(routines);
}

async function getPublicRoutinesByUser({ username }) {
//ispublic and username is true and equal 
const { rows: routines } = await client.query(`
SELECT users.username AS creatorName, routines.* FROM routines
JOIN users ON routines."creatorId" = users.id
WHERE users.username = ${username} AND routines."isPublic" = true ;
`)

return await addActivityToRoutine(routines);
 }

async function getPublicRoutinesByActivity({ id }) {
  //ispublic and id is true and equal
 }

async function updateRoutine({ id, ...fields }) { 
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  if (setString.length === 0) {
    return;
  }

  try {
    const { rows: [ routine ] } = await client.query(`
      UPDATE routines
      SET ${ setString }
      WHERE routines.id=${ id }
      RETURNING *;
    `, Object.values(fields));

    return routine;
  } catch (error) {
    throw error;
  }
}

async function destroyRoutine(id) {
  await client.query(`
  DELETE FROM routine_activities
  WHERE routine_activities."routineId" = ${id}`);

   await client.query(`
  DELETE FROM routines
  WHERE id = ${id}`);
}


module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
