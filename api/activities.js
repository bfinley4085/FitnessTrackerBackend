const express = require('express');
const { getAllActivities, getActivityById, getPublicRoutinesByActivity } = require('../db');
const { ActivityNotFoundError, ActivityExistsError } = require('../errors');
const activitiesRouter = express.Router();


// GET /api/activities/:activityId/routines
activitiesRouter.get('/:activityId/routines', async (req, res, next) => {
    let activityId  = req.params.activityId;

    try {
      const activities = await getPublicRoutinesByActivity({activityId});
  
      if (!(await getActivityById(activityId))) {
        next({
            name: 'ActivityNotFound',
            error: ActivityNotFoundError(activityId)
        });
      }
  
      res.send({ activities });
    } catch ({ error}) {
      next(error);
    }
  });
// GET /api/activities
activitiesRouter.get('/', async (req, res, next) => {
    try {
      const activities = await getAllActivities();
    
      res.send(
        activities
      );
    } catch ({ error }) {
      next({ error});
    }
  });
// POST /api/activities
activitiesRouter.post('/', async (req, res, next) => {
    try {
       const { name, description } = req.body;
       const activity = await createActivity({ name, description });
       if (activity) {
          res.send(activity);
       } else {
          next({
             name: 'ActivityAlreadyMade',
             error: ActivityExistsError(activity.name),
          });
       }
    } catch (error) {
       next(error);
    }
 });
// PATCH /api/activities/:activityId
activitiesRouter.patch(
    '/:activityId',
    async (req, res, next) => {
       try {
          const { activityId } = req.params;
          const { name, description } = req.body;
          const updateObj = {};
          updateObj.id = activityId;
          if (name) {
             updateObj.name = name;
          }
          if (description) {
             updateObj.description = description;
          }
          if (!(await getActivityById(activityId))) {
             next({
                name: 'ActivityNotFoundError',
                error: ActivityNotFoundError(),
             });
          }
          if (await getActivityByName(name)) {
             next({
                name: 'ActivityAlreadyMade',
                error: ActivityExistsError(),
             });
          } else {
             const updatedActivity = await updateActivity(updateObj);
             if (updatedActivity) {
                res.send(updatedActivity);
             } else {
                next({
                   name: 'Nothing to upgrade',
                   message: 'No field to update',
                   error: 'Error!',
                });
             }
          }
       } catch (error) {
          next(error);
       }
    }
 );
module.exports = activitiesRouter;
