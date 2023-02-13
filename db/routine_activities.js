const client = require("./client");

async function addActivityToRoutine({ routineId, activityId, count, duration }) {
  const routines = [{ routineId, activityId, count, duration }];
  const routineWithActivities = [...routines]
  const routineIds = routines.map(routine => routine.id)
  const binds = routines.map((routine, index) => `$${index + 1}`).join(",")
  
  
  const { rows: activities } = await client.query(`
  SELECT activities.*, routine_activities.duration,
  routine_activities.count, routine_activitIes."routineId", 
  routine_activities.id AS "routineActivityId" 
  FROM routine_activities
  JOIN activities ON activities.id = routine_activities."activityId"
  WHERE routine_activities."routineId" IN (${binds})
  `, routineIds);


  
  // for (let i = 0; i < routineWithActivities.length; i++) {
  //   const routine = routineWithActivities[i]
  //   routine.activities = activities.filter(activity => activity.routineid === routine.id )
  // }
  return routineWithActivities[0];
}

async function getRoutineActivityById(id) {
  const { rows: [routine_activities] } = await client.query(`
  SELECT * FROM routine_activities
  WHERE routine_activities.id = ${ id }
`);

  return routine_activities;
}
  

async function getRoutineActivitiesByRoutine({ id }) { }

async function updateRoutineActivity({ id, ...fields }) { }

async function destroyRoutineActivity(id) { }

async function canEditRoutineActivity(routineActivityId, userId) { }

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
