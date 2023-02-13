const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  // return the new activity
  try {
    const { rows:  [activity]  } = await client.query(`
      INSERT INTO activities(name, description) 
      VALUES($1, $2) 
      ON CONFLICT (name) DO NOTHING 
      RETURNING *;
    `, [name, description]);
    return activity;
  } catch (error) {
    throw error;
  }

}

async function getAllActivities() {
  // select and return an array of all activities
  try {
    const { rows: activities } = await client.query(`
      SELECT id, name, description
      FROM activities;
    `);
    return activities;
  } catch (error) {
    throw error;
  }

}

async function getActivityById(id) {
  try {
  const { rows: [activities] } = await client.query(`
  SELECT id, name, description
  FROM activities
  WHERE activities.id = ${id};
`);

return activities;
} catch (error) {
throw error;
}
}

async function getActivityByName(name) {
  try {
    const { rows: [activities] } = await client.query(`
    SELECT id, name, description
    FROM activities
    WHERE activities.name = '${name}';
  `);
  
  return activities;
  } catch (error) {
  throw error;
  }
}

async function attachActivitiesToRoutines(routines) {
  const routineWithActivities = [...routines];
  const routineIds = routines.map(routine => routine.id);
  const binds = routines.map((routine, index) => `$${index + 1}`).join(", ");
  
  
  const { rows: activities } = await client.query(`
  SELECT activities.*, routine_activities.duration,
  routine_activities.count, routine_activitIes."routineId", 
  routine_activities.id AS "routineActivityId" 
  FROM activities
  JOIN activities ON activities.id = routine_activities."activityId"
  WHERE routine_activities."routineId" IN (${binds})
  `, routineIds);


  
  for (let i = 0; i < routineWithActivities.length; i++) {
    const routine = routineWithActivities[i]
    routine.activities = activities.filter(activity => activity.routineid === routine.id )
  }
  return routineWithActivities;
}

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity

  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const { rows: [ activity ] } = await client.query(`
      UPDATE activities
      SET ${ setString }
      WHERE activities.id=${ id }
      RETURNING *;
    `, Object.values(fields));

    return activity;
  } catch (error) {
    throw error;
  }
}


module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
