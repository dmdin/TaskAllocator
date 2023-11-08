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

        entities = []

        for branch in  branchesCursor:
            try:
                entities.append(Branch(id = str(branch["_id"]), **branch))
            except:
                print(f"Error while parsing branch: {branch}")
        
        return entities
    
    def getAllSpecialists(self):
        specialistsCollection = self.db["specialists"]

        specialistsCursor = specialistsCollection.find({})

        entities = []
        for spec in specialistsCursor:
            try:
                entities.append(Specialist(id = str(spec["_id"]),**spec))
            except:
                print(f"Error while parsing specialist: {spec}")
        
        return entities
    
    def getAllTasks(self):
        taskCollection = self.db["tasks"]

        tasksCursor = taskCollection.find({})
        entities = []

        for task in tasksCursor:
            try:
                entities.append(Task(id = str(task["_id"]),**task))
            except:
                print(f"Error while parsing task: {task}")
        
        return entities

    
    def getAllActiveAssignedTasks(self):
        assignedTasksCollection = self.db["task-assigns"]

        assignedTasksCursor = assignedTasksCollection.find({'status': '0'})

        entities = []
        for assignedTask in assignedTasksCursor:
            try:
                entities.append(AssignTask(id = str(assignedTask["_id"]),**assignedTask))
            except:
                print(f"Error while parsing assignTask: {assignedTask}")


        return entities
        
    
    def updateOrCreateAssignedTasks(self, tasks: List[AssignTask]):
        assignedTasksCollection = self.db["task-assigns"]
        
        for task in tasks:
          task_dict =  dict(task, priority = task.priority.value, status = task.status.value)
          task_dict["_id"] = task_dict.pop("id")
          assignedTasksCollection.replace_one({"_id": task.id}, task_dict, upsert=True)    
    



