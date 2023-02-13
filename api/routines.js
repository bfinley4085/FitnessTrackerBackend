const express = require('express');
const { getAllPublicRoutines, createRoutine, destroyRoutine, addActivityToRoutine, attachActivitiesToRoutines } = require('../db');
const router = express.Router();

// GET /api/routines
router.get('/api/routines', async (req, res, next) => {
    try {
      const routines = await getAllPublicRoutines();
      res.send({ routines });
    } catch (error) {
      next(error);
    }
  });
// POST /api/routines
router.post('/api/routines', async (req, res, next) => {
    try {
      const newRoutine = await createRoutine(req.body);
  
      res.send(newRoutine);
    } catch (error) {
      next(error);
    }
  });
// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities
router.post('/api/routines/:routineId/activities', async (req, res, next) => {
    try {
      const { newActivity } = req.body;
  
      const newRoutineActivity = await attachActivitiesToRoutines(newActivity);
      
      res.send(newRoutineActivity);
    } catch (error) {
      next(error);
    }
  });
module.exports = router;
// work on the POST,DELETE,PATCH