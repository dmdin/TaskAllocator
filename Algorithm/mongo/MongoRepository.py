from pymongo import MongoClient
from models.Branch import Branch
from dotenv.main import load_dotenv
from models.Specialist import Specialist
from models.Task import Task
from models.AssignTask import AssignTask, TaskAssignStatus
import os
from typing import List



class MongoRepository:

    def __init__(self):
        load_dotenv()
        connectionString = os.environ.get('MONGO_CONNECTION_STRING')
        mongoClient = MongoClient(connectionString)
        self.db = mongoClient["task-allocator"]

    def getAllBranches(self):
        branchCollection = self.db["branches"] 

        branchesCursor = branchCollection.find({"is_office": False})
        
        return [Branch(id = str(branch["_id"]), **branch) for branch in  branchesCursor]
    
    def getAllSpecialists(self):
        specialistsCollection = self.db["specialists"]

        specialistsCursor = specialistsCollection.find({})

        return [Specialist(id = str(spec["_id"]),**spec) for spec in specialistsCursor]
    
    def getAllTasks(self):
        taskCollection = self.db["tasks"]

        tasksCursor = taskCollection.find({})

        return [Task(id = str(task["_id"]),**task) for task in tasksCursor]
    
    def getAllActiveAssignedTasks(self):
        assignedTasksCollection = self.db["task-assigns"]

        assignedTasksCursor = assignedTasksCollection.find({'status': '0'})

        return [AssignTask(id = str(assignedTask["_id"]),**assignedTask) for assignedTask in assignedTasksCursor]
    
    def updateOrCreateAssignedTasks(self, tasks: List[AssignTask]):
        assignedTasksCollection = self.db["task-assigns"]
        
        for task in tasks:
          task_dict =  dict(task, priority = task.priority.value, status = task.status.value)
          task_dict["_id"] = task_dict.pop("id")
          cnt = assignedTasksCollection.replace_one({"_id": task.id}, task_dict, upsert=True)    
          print(cnt)
    



