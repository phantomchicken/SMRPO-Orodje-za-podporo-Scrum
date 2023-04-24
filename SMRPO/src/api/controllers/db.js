const mongoose = require('mongoose');
const passport = require('passport');
const LokalnaStrategija = require('passport-local').Strategy;
require('./db');
const User = require('../models/users')
//const User = mongoose.model("User");
const Project = require('../models/projects')
const Sprint = require('../models/sprints')
const Story = require('../models/stories')
const Task = require('../models/tasks')
const Post = require('../models/posts')
const WorkLog = require('../models/workLogs')

const usersData = require('../../../users.json');
const projectsData = require('../../../projects.json');
const sprintsData = require('../../../sprints.json');
const storiesData = require('../../../stories.json');
const tasksData = require('../../../tasks.json');
const postsData = require('../../../posts.json');

var userArray = new Array();
var projectArray = new Array();
var sprintArray = new Array();
var storyArray = new Array();
var taskArray = new Array();
var postArray = new Array();

const fs = require('fs');
const path = require('path');
// const multer = require('multer');

const getUser = (req, res) => {
    //console.log(req.params)
    User.findById(req.params.idUser).exec((error, user) => {
        console.log(user)
        if (!user) {
            return res.status(404).json({
                "message": "User not found."
            });
        } else if (error) {
            return res.status(500).json(error);
        } else {
            res.status(200).json(user);
        }
    });
}

const getUsers = (req, res) => {
    User.find({}, function (error, users) {
        if (error) {
            return res.status(500).json(error);
        } else {
            //console.log(users)
            users.map((user) => {
                user.password = undefined;
                return user;
            });
            //console.log(users)
            res.status(200).json(users);
        }
    });
}

const register = (req, res) => {
    //console.log(req.body);
    if (req.body === undefined) {
        res.status(500).send('Internal error')
        return;
    }

    if (!('firstname' in req.body &&
        'lastname' in req.body &&
        'username' in req.body &&
        'password' in req.body &&
        'email' in req.body)) {
        res.status(500).send('Missing argument')
        return;
    }

    const new_user = new User();
    new_user.username = req.body.username;
    new_user.firstname = req.body.firstname;
    new_user.lastname = req.body.lastname;
    new_user.email = req.body.email;
    new_user.setPassword(req.body.password);
    new_user.privilege = "normal";

    new_user.save(error => {
        console.log(error)
        if (error) {
            if (error.name == "MongoServerError" && error.code == 11000) {
                res.status(409).json({
                    "message": "User with that username/e-mail already exists!"
                });
            } else {
                res.status(500).json(error);
            }
        } else {
            res.status(201).json({
                "token": new_user.generateJwt()
            });
        }
    });
}

const login = (req, res) => {
    passport.authenticate('local', (error, user, informations) => {
        if (error)
            return res.status(500).json(error);
        else if (user) {
            User.updateTimestamp(user._id, function (err, user) {
                if (err) return res.status(500).json("Server error!");               
                else {
                    User.incrementCounter(user._id, function (err, user) {
                        if (err) return res.status(500).json("Server error!");
                        else {
                            return res.status(201).json({
                                "token": user.generateJwt()
                            });
                        }
                    });
                }
            });
        } else {
            return res.status(401).json(informations);
        }
    })(req, res);
};

const addUser = (req, res) => {
    //console.log(req.body);
    if (req.body === undefined) {
        res.status(500).send('Internal error')
        return;
    }

    if (!('firstname' in req.body &&
        'lastname' in req.body &&
        'username' in req.body &&
        'password' in req.body &&
        'privilege' in req.body &&
        'email' in req.body)) {
        res.status(500).send('Missing argument')
        return;
    }

    User.insertMany([{ privilege: req.body.privilege, firstname: req.body.firstname, lastname: req.body.lastname, username: req.body.username, password: req.body.password, email: req.body.email }],
        function (error, result) {
            if (error) {
                return res.status(500).json(error);
            } else {
                res.status(200).json(result);
            }
        });
}

const updateUser = (req, res) => {
    //console.log(req.body)
    //console.log(req.params)
    User.findById(req.params.idUser).exec((error, user) => {
        if (!user) {
            return res.status(404).json({
                "message": "No user found."
            });
        } else if (error) {
            return res.status(500).json(error);
        } else {
            //console.log(user)
            user.firstname = req.body.firstname;
            user.username = req.body.username;
            user.lastname = req.body.lastname;
            user.email = req.body.email;
            user.privilege = req.body.privilege
            if (req.body.password != null) user.setPassword(req.body.password);

            user.save((error, updated_user) => {
                if (error) {
                    res.status(500).json(error);
                } else {
                    res.status(200).json(updated_user);
                }
            });
        }
    });
}

const deleteUser = (req, res) => {
    User.findOneAndUpdate(
        { _id: req.params.idUser },
        { archived: true },
        { new: true },
        (error, user) => {
            if (!user) {
                return res.status(404).json({ message: "No user found." });
            } else if (error) {
                return res.status(500).json(error);
            } else {
                console.log(user);
                return res.json(user);
            }
        }
    );
}

const checkPassword = (req, res) => {
    if (!req.body.username || !req.body.password)
        return res.status(400).json({ message: "All fields required." });
    else
        passport.authenticate("local", (err, user, info) => {
            if (err) return res.status(500).json({ message: err.message });
            if (user) return res.status(200).json({ authorization: true });
            else return res.status(401).json({ message: info.message });
        })(req, res);
};

const addSprint = (req, res) => {
    if (req.body === undefined) {
        res.status(500).send('Internal error')
        return;
    }

    if (!('startDate' in req.body
        && 'endDate' in req.body
        && 'velocity' in req.body
        //&& 'project' in req.body
    )) {
        res.status(500).send('Missing argument')
        return;
    }

    let todayDate = new Date()
    let startDate = new Date(req.body.startDate)
    let endDate = new Date(req.body.endDate)

    let today = new Date(Date.UTC(todayDate.getUTCFullYear(), todayDate.getUTCMonth(), todayDate.getUTCDate()))
    let sDate = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate()))
    let eDate = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate()))

    if (sDate.getDay() === 6 || sDate.getDay() === 0)
      return res.status(500).send('Sprint must not end at weekend!');
    if (eDate.getDay() === 6 || eDate.getDay() === 0)
        return res.status(500).send('Sprint must not end at weekend!');
    
    if (sDate.getTime() > eDate.getTime()){
        return res.status(500).send("Sprint ends before it starts!");
    } else if (sDate.getTime() < today.getTime()){
        return res.status(500).send("Sprint starts before today!");
    }else if (isNaN(+req.body.velocity) || req.body.velocity < 0 || req.body.velocity > 100){
        return res.status(500).send("Sprint velocity must be a number between 1 and 100!!");
    } else{
      let overlap = false
      Sprint.find({}, function (error, sprints) {
        if (error) {
            return res.status(500).json(error);
        } else {
            for (var i=0; i < sprints.length; i++){
                if (sprints[i].project == this.project) { // get all sprints and check for overlap only for those concerning the same project
                  let s_i = new Date(sprints[i].startDate)
                  let e_i = new Date(sprints[i].endDate)
                  if ((sDate.getTime() >= s_i.getTime() && sDate.getTime() <= e_i.getTime())
                    || (eDate.getTime() >= s_i.getTime() && eDate.getTime() <= e_i.getTime())
                    || (s_i.getTime() >= sDate.getTime() && s_i.getTime() <= eDate.getTime())
                    || (e_i.getTime() >= sDate.getTime() && e_i.getTime() <= eDate.getTime())){
                      this.error = "Sprint overlaps with an existing sprint!"
                      overlap = true
                      break
                  }
                }
            }}
        });

        if(overlap)
            return res.status(500).send("Sprint overlaps with an existing sprint!");
    }

    const new_sprint = new Sprint();
    new_sprint.startDate = req.body.startDate;
    new_sprint.endDate = req.body.endDate;
    new_sprint.velocity = req.body.velocity;
    new_sprint.project = req.body.project;

    new_sprint.save(error => {
        console.log(error)
        if (error) {
            res.status(500).json(error);
        } else {
            res.status(201).json(new_sprint);
        }
    });
}
const getProject = (req, res) => {
    //console.log(req.params)
    Project.findById(req.params.idProject).exec((error, project) => {
        //console.log(project)
        if (!project) {
            return res.status(404).json({
                "message": "Project not found."
            });
        } else if (error) {
            return res.status(500).json(error);
        } else {
            res.status(200).json(project);
        }
    });
}

const getSprints = (req, res) => {
    Sprint.find({}, function (error, sprints) {
        if (error) {
            return res.status(500).json(error);
        } else {
            const modifiedSprints = sprints.map(sprint => {
                const sprintObj = sprint.toObject();
                sprintObj.editable = false;
                const currentDate = new Date();
                const endDate = new Date(sprintObj.endDate); // Convert to Date object if not already

                // Compare only the date portion
                const endDateDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
                const currentDateDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

                if (endDateDateOnly >= currentDateDateOnly) { 
                    sprintObj.editable = true;
                }

                return sprintObj;
            });
            sprints = sprints.map(sprint => sprint.toObject())
            //console.log(modifiedSprints);
            res.status(200).json(modifiedSprints);
        }
    });
}

const getSprint = (req, res) => {
    //console.log(req.params)
    Sprint.findById(req.params.idSprint).exec((error, sprint) => {
        //console.log(sprint)
        if (!sprint) {
            return res.status(404).json({
                "message": "Sprint not found."
            });
        } else if (error) {
            return res.status(500).json(error);
        } else {
            const sprintObj = sprint.toObject();
            sprintObj.editable = false;
            if (sprintObj.endDate.getTime() > Date.now()) // endDate so we can edit current sprints (only velocity)
                sprintObj.editable = true;
            //console.log(sprintObj)
            res.status(200).json(sprintObj);
        }
    });
}

const updateSprint = (req, res) => {
    //console.log(req.body)
    //console.log(req.params)

    let todayDate = new Date()
    let startDate = new Date(req.body.startDate)
    let endDate = new Date(req.body.endDate)

    let today = new Date(Date.UTC(todayDate.getUTCFullYear(), todayDate.getUTCMonth(), todayDate.getUTCDate()))
    let sDate = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate()))
    let eDate = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate()))

    if (sDate.getDay() === 6 || sDate.getDay() === 0)
        return res.status(500).send('Sprint must not end at weekend!');
    if (eDate.getDay() === 6 || eDate.getDay() === 0)
        return res.status(500).send('Sprint must not end at weekend!');

    if (sDate.getTime() > eDate.getTime()){
        return res.status(500).send("Sprint ends before it starts!");
    } else if (sDate.getTime() < today.getTime()){
        return res.status(500).send("Sprint starts before today!");
    }else if (isNaN(+req.body.velocity) || req.body.velocity < 0 || req.body.velocity > 100){
        return res.status(500).send("Sprint velocity must be a number between 1 and 100!!");
    } else{
        let overlap = false
        Sprint.find({}, function (error, sprints) {
            if (error) {
                return res.status(500).json(error);
            } else {
                for (var i=0; i < sprints.length; i++){
                    if (sprints[i].project == this.project) { // get all sprints and check for overlap only for those concerning the same project
                        let s_i = new Date(sprints[i].startDate)
                        let e_i = new Date(sprints[i].endDate)
                        if ((sDate.getTime() >= s_i.getTime() && sDate.getTime() <= e_i.getTime())
                            || (eDate.getTime() >= s_i.getTime() && eDate.getTime() <= e_i.getTime())
                            || (s_i.getTime() >= sDate.getTime() && s_i.getTime() <= eDate.getTime())
                            || (e_i.getTime() >= sDate.getTime() && e_i.getTime() <= eDate.getTime())){
                            this.error = "Sprint overlaps with an existing sprint!"
                            overlap = true
                            break
                        }
                    }
                }}
        });

        if(overlap)
            return res.status(500).send("Sprint overlaps with an existing sprint!");
    }

    Sprint.findById(req.params.idSprint).exec((error, sprint) => {
        if (!sprint) {
            return res.status(404).json({
                "message": "No sprint found."
            });
        } else if (error) {
            return res.status(500).json(error);
        } else {
            sprint.startDate = req.body.startDate;
            sprint.endDate = req.body.endDate;
            sprint.velocity = req.body.velocity;

            sprint.save((error, updated_sprint) => {
                if (error) {
                    res.status(500).json(error);
                } else {
                    res.status(200).json(updated_sprint);
                }
            });
        }
    });
}

const deleteSprint = (req, res) => {
    Sprint.findByIdAndRemove(req.params.idSprint).exec((error) => {
        if (error) {
            return res.status(500).json(error);
        } else {
            return res.status(204).json(null);
        }
    });
}

const getProjects = (req, res) => {
    Project.find({}, function (error, projects) {
        if (error) {
            return res.status(500).json(error);
        } else {
            //console.log(projects)
            res.status(200).json(projects);
        }
    });
}

const addProject = (req, res) => {
    //console.log(req.body)
    if (req.body === undefined) {
        res.status(500).send('Internal error')
        return;
    }

    if (!('name' in req.body
        && 'description' in req.body
        && 'developers' in req.body
        && 'scrum_master' in req.body
        && 'product_owner' in req.body
    )) {
        res.status(500).send('Missing argument')
        return;
    }

    const new_project = new Project();
    new_project.name = req.body.name;
    new_project.description = req.body.description;
    new_project.developers = req.body.developers;
    new_project.scrum_master = req.body.scrum_master;
    new_project.product_owner = req.body.product_owner;

    new_project.save(error => {
        console.log(error)
        if (error) {
            res.status(500).json(error);
        } else {
            res.status(201).json(new_project);
        }
    });
}

const updateProject = (req, res) => {
    //console.log(req.body)
    //console.log(req.params)
    Project.findById(req.params.idProject).exec((error, project) => {
        if (!project) {
            return res.status(404).json({
                "message": "No project found."
            });
        } else if (error) {
            return res.status(500).json(error);
        } else {
            //console.log(project)
            project.name = req.body.name;
            project.description = req.body.description;
            project.scrum_master = req.body.scrum_master;
            project.product_owner = req.body.product_owner;
            project.developers = req.body.developers
            if (req.body.documentation) project.documentation = req.body.documentation

            project.save((error, updated_project) => {
                if (error) {
                    res.status(500).json(error);
                } else {
                    res.status(200).json(updated_project);
                }
            });
        }
    });
}

const deleteProject = (req, res) => {
    Project.findByIdAndRemove(req.params.idProject).exec((error) => {
        if (error) {
            return res.status(500).json(error);
        } else {
            return res.status(204).json(null);
        }
    });
}

const createStory = (req, res) => {
    if (req.body === undefined) {
        res.status(500).send('Internal error')
        return;
    }

    if (!('name' in req.body 
        && 'description' in req.body
        && 'priority' in req.body 
        && 'acceptanceCriteria' in req.body 
        && 'businessValue' in req.body 
        && 'project' in req.body
    )) {
        res.status(500).send('Missing argument')
        return;
    }

    const new_story = new Story();
    new_story.name = req.body.name;
    new_story.description = req.body.description;
    new_story.storyPoints = req.body.storyPoints;
    new_story.priority = req.body.priority;
    new_story.acceptanceCriteria = req.body.acceptanceCriteria;
    new_story.businessValue = req.body.businessValue;
    if (req.body.status != "")
        new_story.status = req.body.status
    else
        new_story.status = "Backlog";
    new_story.project = req.body.project;
    new_story.sprint = req.body.sprint;
    new_story.assignee = req.body.assignee;
    new_story.comment = req.body.comment;

    new_story.save(error => {
        console.log(error)
        if (error) {
            res.status(500).json(error);
        } else {
            res.status(201).json(new_story);
        }
    });
}

const updateStory = (req, res) => {
    Story.findById(req.params.idStory).exec((error, story) => {
        if (!story) {
            return res.status(404).json({
                "message": "No story found."
            });
        } else if (error) {
            return res.status(500).json(error);
        } else {
            //console.log(story)
            if (req.body.name != "") story.name = req.body.name
            if (req.body.description != "") story.description = req.body.description
            if (req.body.storyPoints != "") story.storyPoints = req.body.storyPoints
            if (req.body.priority != "") story.priority = req.body.priority
            if (req.body.acceptanceCriteria != "") story.acceptanceCriteria = req.body.acceptanceCriteria
            if (req.body.businessValue != "") story.businessValue = req.body.businessValue
            if (req.body.status != "") story.status = req.body.status
            if (req.body.project != "") story.project = req.body.project
            if (req.body.sprint != "") story.sprint = req.body.sprint
            if (req.body.assignee!= "") story.assignee = req.body.assignee
            if (req.body.comment != "")
                story.comment = req.body.comment
            else
                story.comment = "";

            story.save((error, updated_story) => {
                if (error) {
                    res.status(500).json(error);
                } else {
                    res.status(200).json(updated_story);
                }
            });
        }
    });
}

const getStories = (req, res) => {
    Story.find({}, function (error, stories) {
        if (error) {
            return res.status(500).json(error);
        } else {
            res.status(200).json(stories);
        }
    });
}

const getStory = (req, res) => {
    //console.log(req.params)
    Story.findById(req.params.idStory).exec((error, story) => {
        //console.log(story)
        if (!story) {
            return res.status(404).json({
                "message": "Story not found."
            });
        } else if (error) {
            return res.status(500).json(error);
        } else {
            res.status(200).json(story);
        }
    });
}

const deleteStory = (req, res) => {
    Story.findByIdAndRemove(req.params.idStory).exec((error) => {
        if (error) {
            return res.status(500).json(error);
        } else {
            return res.status(204).json(null);
        }
    });
}

const createTask = (req, res) => {
        //console.log(req.body)
    if (req.body === undefined) {
        res.status(500).send('Internal error')
        return;
    }

    if (!('name' in req.body 
        && 'story' in req.body 
        && 'timeEstimate' in req.body
    )) {
        res.status(500).send('Missing argument')
        return;
    }

    const new_task = new Task();
    new_task.name = req.body.name;
    new_task.story = req.body.story;
    new_task.timeEstimate = req.body.timeEstimate;
    if (req.body.assignee !== "") new_task.assignee = req.body.assignee;

    new_task.save(error => {
        console.log(error)
        if (error) {
            res.status(500).json(error);
        } else {
            res.status(201).json(new_task);
        }
    });
}

const updateTask = (req, res) => {
    //console.log(req.body);
    Task.findById(req.params.idTask).exec((error, task) => {
      if (!task) {
        return res.status(404).json({
          "message": "No task found."
        });
      } else if (error) {
        return res.status(500).json(error);
      } else {
        if (req.body.name !== "") task.name = req.body.name;
        if (req.body.assignee === "") // so we can reject assigned - unset assignee
            task.assignee = null
        else 
            task.assignee = req.body.assignee
        if (req.body.story !== "") task.story = req.body.story;
        if (typeof req.body.done === "boolean") task.done = req.body.done; // update based on boolean value
        if (typeof req.body.accepted === "boolean") task.accepted = req.body.accepted; // update based on boolean value
        if (req.body.timeEstimate !== "") task.timeEstimate = req.body.timeEstimate;
  
        task.save((error, updated_task) => {
          if (error) {
            res.status(500).json(error);
          } else {
            res.status(200).json(updated_task);
          }
        });
      }
    });
  }
  

const getTasks = (req, res) => {
    Task.find({}, function (error, tasks) {
        if (error) {
            return res.status(500).json(error);
        } else {
            res.status(200).json(tasks);
        }
    });
}

const getTask = (req, res) => {
    //console.log(req.params)
    Task.findById(req.params.idTask).exec((error, task) => {
        if (!task) {
            return res.status(404).json({
                "message": "Task not found."
            });
        } else if (error) {
            return res.status(500).json(error);
        } else {
            res.status(200).json(task);
        }
    });
}

const deleteTask = (req, res) => {
    Task.findByIdAndRemove(req.params.idTask).exec((error) => {
        if (error) {
            return res.status(500).json(error);
        } else {
            return res.status(204).json(null);
        }
    });
}



const createWorkLog = (req, res) => {
if (req.body === undefined) {
    res.status(500).send('Internal error')
    return;
}

if (!('task' in req.body 
    && 'assignee' in req.body 
    && 'startTime' in req.body
)) {
    res.status(500).send('Missing argument')
    return;
}

const new_workLog = new WorkLog();
new_workLog.task = req.body.task;
new_workLog.assignee = req.body.assignee;
new_workLog.startTime = req.body.startTime;
if (req.body.stopTime !== "") new_workLog.stopTime = req.body.stopTime;

new_workLog.save(error => {
    console.log(error)
    if (error) {
        res.status(500).json(error);
    } else {
        res.status(201).json(new_workLog);
    }
});
}

const updateWorkLog = (req, res) => {
WorkLog.findById(req.params.idTask).exec((error, workLog) => {
  if (!workLog) {
    return res.status(404).json({
      "message": "No work log found."
    });
  } else if (error) {
    return res.status(500).json(error);
  } else {
    if (req.body.task !== "") workLog.task = req.body.task;
    if (req.body.assignee !== "") workLog.assignee = req.body.assignee;
    if (req.body.startTime !== "") workLog.startTime = req.body.startTime;
    if (req.body.stopTime !== "") workLog.stopTime = req.body.stopTime;

    workLog.save((error, updated_workLog) => {
      if (error) {
        res.status(500).json(error);
      } else {
        res.status(200).json(updated_workLog);
      }
    });
  }
});
}

const getWorkLogs = (req, res) => {
    WorkLog.find({}, function (error, workLogs) {
    if (error) {
        return res.status(500).json(error);
    } else {
        res.status(200).json(workLogs);
    }
});
}

const getWorkLog = (req, res) => {
WorkLog.findById(req.params.idWorkLog).exec((error, workLog) => {
    if (!workLog) {
        return res.status(404).json({
            "message": "Work Log not found."
        });
    } else if (error) {
        return res.status(500).json(error);
    } else {
        res.status(200).json(workLog);
    }
});
}

const deleteWorkLog = (req, res) => {
WorkLog.findByIdAndRemove(req.params.idWorkLog).exec((error) => {
    if (error) {
        return res.status(500).json(error);
    } else {
        return res.status(204).json(null);
    }
});
}

function Latch(limit) {
    this.limit = limit;
    this.count = 0;
    this.waitBlock = function () {
    };
};

Latch.prototype.async = function (fn, ctx) {
    var _this = this;
    setTimeout(function () {
        fn.call(ctx, function () {
            _this.count = _this.count + 1;
            if (_this.limit <= _this.count) {
                _this.waitBlock.call(_this.waitBlockCtx);
            }
        });
    }, 0);
};

Latch.prototype.await = function (callback, ctx) {
    this.waitBlock = callback;
    this.waitBlockCtx = ctx;
};

const deleteAllData = (req, res) => {
    userArray.splice(0, userArray.length)
    projectArray.splice(0, projectArray.length)
    sprintArray.splice(0, sprintArray.length)
    storyArray.splice(0, storyArray.length)
    Post.collection.drop();
    Project.collection.drop();
    Sprint.collection.drop();
    Story.collection.drop();
    User.collection.deleteMany( { privilege : "normal" });
    res.status(200).json({"message": "Contents on DB hard deleted!"});
};

const addSampleData = (req, res) => {
    var message = "Sample data is successfully added.";
    var barrier = new Latch(usersData.length);

    barrier.async(function (end) {
        for (var userData of usersData) {
            const user = new User();
            user.username = userData.username;
            user.firstname = userData.firstname;
            user.lastname = userData.lastname;
            user.email = userData.email;
            user.privilege = userData.privilege;

            user.setPassword(userData.username);
            user.checkPassword(userData.username);
            user.generateJwt();


            User
                .findOne({username: userData.username})
                .exec((error, foundUser) => {
                    if (!foundUser) {
                        user.save(user, (error, upo) => {
                            if (error)
                                message = error;
                            else
                                userArray.push(upo);
                            end();
                        });

                    } else{
                        userArray.push(foundUser);
                        end();
                    }
                });
        }
    });

    barrier.await(function () {
        addProjectData();
        res.status(200).json({"message": message});
    });
};

const addProjectData = () => {
    var barrier = new Latch(projectsData.length);

    barrier.async(function (end) {
        for (var projectData of projectsData) {
            const project = new Project();
            project.name = projectData.name;
            project.description = projectData.description;
            project.developers = userArray
                                    .filter(user => (projectData.developers.indexOf(user.username) >= 0))
                                    .map(user => user._id);
            var scrumQuery = userArray
                                .filter(user => (user.username == projectData.scrum_master))
                                .map(user => user._id);
            project.scrum_master = scrumQuery[0];
            var productQuery = userArray
                                .filter(user => (user.username == projectData.product_owner))
                                .map(user => user._id);
            project.product_owner = productQuery[0];
            
            Project
                .findOne({name: projectData.name})
                .exec((error, foundProject) => {
                    if (!foundProject) {
                        project.save(project, (error, pro) => {
                            if (error) 
                                message = error;
                            else
                                projectArray.push(pro);
                            end();
                        });
                    } else{
                        projectArray.push(foundProject);
                        end();
                    }
                });
        }
    });

    barrier.await(function () {
        addSprintData();
        addStoryData()
        addTaskData()
        addPostData()
    });
};

const addSprintData = () => {
    var barrier = new Latch(projectsData.length);

    barrier.async(function (end) {
        for (var sprintData of sprintsData) {
            const sprint = new Sprint();
            sprint.startDate = sprintData.startDate;
            sprint.endDate = sprintData.endDate;
            sprint.velocity = sprintData.velocity;
            var projectQuery = projectArray
                                    .filter(project => (project.name == sprintData.project))
                                    .map(project => project._id);
            sprint.project = projectQuery[0];

            sprint.save(sprint, (error, spr) => {
                if (error) 
                    message = error;
                else
                    sprintArray.push(spr);
                end();
            });
        }
    });
};

const addStoryData = () => {
    var barrier = new Latch(storiesData.length);
    barrier.async(function (end) {
        for (var storyData of storiesData) {
            const story = new Story();
            story.name = storyData.name
            story.description = storyData.description
            story.storyPoints = storyData.storyPoints
            story.status = storyData.status
            story.priority = storyData.priority
            story.businessValue = storyData.businessValue
            story.acceptanceCriteria = storyData.acceptanceCriteria
            
            var projectQuery = projectArray
                                    .filter(project => (project.name == storyData.project))
                                    .map(project => project._id)
            
    	    var sprintQuery = sprintArray
                                    .filter(sprint => (sprint.project == storyData.project && sprint.startDate == '2023-04-17T00:00:00.000Z') )
                                    .map(project => project._id)                                    

            if (story.priority!='Won\'t have this time') story.sprint = sprintQuery[0]
            story.project = projectQuery[0]

            story.save(story, (error, spr) => {
                if (error) 
                    message = error;
                else
                    storyArray.push(spr);
                end();
            });
        }
    });

    barrier.await(function () {
        console.log('DONE');
    });
};

const addPostData = () => {
    var barrier = new Latch(postsData.length);
    barrier.async(function (end) {
        for (var postData of postsData) {
            const post = new Post();
            post.title = postData.title
            post.content = postData.content
            post.date = postData.date
            // console.log(post)
            var projectQuery = projectArray
                .filter(project => (project.name == postData.project))
                .map(project => project._id)

            var userQuery = userArray
                .filter(user => (user.username == postData.user))
                .map(user => user._id)
            console.log(userQuery)
            post.project = projectQuery[0]
            post.user = userQuery[0]
            console.log(post)
            post.save(post, (error, pst) => {
                if (error)
                    message = error;
                else
                    postArray.push(pst);
                end();
            });
            console.log(message);
        }
    });

    barrier.await(function () {
        console.log('DONE4');
    });
};

//TODO link to project and sprint!
const addTaskData = () => {
    var barrier = new Latch(tasksData.length);
    barrier.async(function (end) {
        for (var taskData of tasksData) {
            const task = new Task();
            task.name = taskData.name
            task.description = taskData.description
            task.done = taskData.done
            task.accepted = taskData.accepted
            task.timeEstimate = taskData.timeEstimate
        
            
            var storyQuery = storyArray
                                    .filter(story => (story.name == taskData.story))
                                    .map(story => story._id)
            task.story = storyQuery[0]

            task.save(task, (error, spr) => {
                if (error) 
                    message = error;
                else
                    taskArray.push(spr);
                end();
            });
        }
    });

    barrier.await(function () {
        console.log('DONE2');
    });
};

const getPosts = (req, res) => {
    Post.find({}, function (error, posts) {
        if (error) {
            return res.status(500).json(error);
        } else {
            //console.log(posts)
            res.status(200).json(posts);
        }
    });
}

const getPostsByProjectId = (req, res) => {
    const idProject = req.params.idProject; //

    Post.find({ project: idProject }, function (error, posts) {
        if (error) {
            return res.status(500).json(error);
        } else {
            res.status(200).json(posts);
        }
    });
}

const getPost = (req, res) => {
    console.log(req.params)
    Post.findById(req.params.idPost).exec((error, post) => {
        // console.log(post)
        if (!post) {
            return res.status(404).json({
                "message": "Post not found."
            });
        } else if (error) {
            return res.status(500).json(error);
        } else {
            res.status(200).json(post);
        }
    });
}


const addPost = (req, res) => {
    console.log(req.body)
    if (req.body === undefined) {
        res.status(500).send('Internal error')
        return;
    }

    if (!('title' in req.body
        && 'content' in req.body
        && 'project' in req.body
        && 'user' in req.body
        && 'date' in req.body
    )) {
        res.status(500).send('Missing argument')
        return;
    }

    const post = new Post();
    post.title = req.body.title;
    post.content = req.body.content;
    post.project = req.body.project;
    post.user = req.body.user;
    post.date = req.body.date;

    post.save(error => {
        console.log(error)
        if (error) {
            res.status(500).json(error);
        } else {
            res.status(201).json(post);
        }
    });
}

const updatePost = (req, res) => {
    //console.log(req.body)
    //console.log(req.params)
    Post.findById(req.params.idPost).exec((error, post) => {
        if (!post) {
            return res.status(404).json({
                "message": "No post found."
            });
        } else if (error) {
            return res.status(500).json(error);
        } else {
            //console.log(post)
            post.title = req.body.title;
            post.content = req.body.content;
            // post.project = req.body.project;
            // post.user = req.body.user;
            post.date = req.body.date;

            post.save((error, updated_post) => {
                if (error) {
                    res.status(500).json(error);
                } else {
                    res.status(200).json(updated_post);
                }
            });
        }
    });
}

const deletePost = (req, res) => {
    console.log(req)
    Post.findByIdAndRemove(req.params.idPost).exec((error) => {
        if (error) {
            return res.status(500).json(error);
        } else {
            return res.status(204).json(null);
        }
    });
}

const addDocs = (req, res) => {
    if (!req.file) {
        return res.status(404).json({
            "message": "No file found"
        });

    } else {
        return res.status(201).json(req.file.filename);
    }
};

const readDocs =  (req, res) => {
    const fileName = 'test.txt'; // Replace with the name of your file in the assets folder
    const filePath = path.join( 'assets/', fileName);
    res.download(filePath, (err) => {
        if (err) {
            // Handle error while downloading file
            console.error('Failed to download file:', err);
            res.status(500).json({ message: 'Failed to download file' });
        } else {
            // File download successful
            console.log('File downloaded successfully');
        }
    });
};

module.exports =
{
    getUser: getUser,
    getUsers: getUsers,
    addUser: addUser,
    register: register,
    login: login,
    updateUser: updateUser,
    deleteUser: deleteUser,
    checkPassword: checkPassword,
    addSprint: addSprint,
    getSprints: getSprints,
    getSprint: getSprint,
    updateSprint: updateSprint,
    deleteSprint: deleteSprint,
    getProject: getProject,
    updateProject: updateProject,
    deleteProject: deleteProject,
    getProjects: getProjects,
    addProject: addProject,
    createStory: createStory,
    getStories: getStories,
    getStory: getStory,
    updateStory : updateStory,
    deleteStory: deleteStory,
    createTask: createTask,
    getTasks: getTasks,
    getTask: getTask,
    updateTask : updateTask,
    deleteTask: deleteTask,
    getPosts: getPosts,
    getPostsByProjectId: getPostsByProjectId,
    getPost: getPost,
    addPost: addPost,
    updatePost: updatePost,
    deletePost: deletePost,
    deleteAllData: deleteAllData,
    addSampleData: addSampleData,
    createWorkLog: createWorkLog,
    getWorkLogs: getWorkLogs,
    getWorkLog: getWorkLog,
    updateWorkLog : updateWorkLog,
    deleteWorkLog: deleteWorkLog,
    addDocs: addDocs,
    readDocs: readDocs
}
