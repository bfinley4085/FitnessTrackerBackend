const express = require('express');
const {getAllRoutines, getAllPublicRoutines, updateRoutine, createRoutine, destroyRoutine, addActivityToRoutine, attachActivitiesToRoutines, getRoutineById } = require('../db');
const { DuplicateRoutineActivityError } = require('../errors');
const routinesRouter = express.Router();

// GET /api/routines
routinesRouter.get('/', async (req, res, next) => {
    try {
      const routines = await getAllPublicRoutines();
      res.send( routines );
    } catch (error) {
      next(error);
    }
  });
// POST /api/routines
routinesRouter.post('/', async (req, res, next) => {
    try {
      const creatorId =req.user.id;
      const body = {isPublic, name, goal, creatorId}
      
      const newRoutine = await createRoutine(body);
  
      res.send(newRoutine);
    } catch (error) {
      next(error);
    }
  });
// PATCH /api/routines/:routineId
routinesRouter.patch('/api/routines/:routineId', async (req, res, next) => {
  const { routineId } = req.params;
  const { isPublic, name, goal } = req.body;

  const updateFields = {};

  if (name) {
    updateFields.name = name;
  }

  if (goal) {
    updateFields.goal = goal;
  }

  try {
    const originalRoutine = await getAllRoutines(routineId);

    if (originalRoutine.author.id === req.user.id) {
      const updatedRoutine = await updateRoutine(routineId, updateFields);
      res.send({ routine: updatedRoutine })
    } else {
      next({
        name: 'UnauthorizedUserError',
        message: 'You cannot update a post that is not yours'
      })
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});



// DELETE /api/routines/:routineId
// routines.Router.delete(
//   '/:routineId',
//   async (req, res, next) => {
//     const {routineId} = req.params;

//     try {
//       const response = await getRoutineById(routineId);

//     }
//   }
// )
// POST /api/routines/:routineId/activities
routinesRouter.post('/:routineId/activities', async (req, res, next) => {
     const { routineId, activityId, count, duration } = req.body;
     try {
        const response = await addActivityToRoutine(req.body);
        response
           ? res.send(response)
           : next({
                error: DuplicateRoutineActivityError(),
                name: 'Duplicated Routine Activity Error',
             });
     } catch (error) {
        next(error);
     }
  }
);
module.exports = routinesRouter;
// work on the POST,DELETE,PATCH