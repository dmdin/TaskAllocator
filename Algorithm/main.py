from mongo.MongoRepository import MongoRepository
from models.Branch import Branch, ConnectionDate
from models.AssignTask import AssignTask
import datetime
from typing import List
from models.TaskPriority import TaskPriority
from bson.objectid import ObjectId
from models.AssignTask import TaskAssignStatus

repo = MongoRepository()

repo.getAllTasks()

'''
Доставка карт и материалов
Условия:
1. Точка подключена вчера
2. Карты и материалы не доставлялись
'''
def isNeedTask1(branch: Branch):
    return branch.connectionDate == ConnectionDate.Yesterday or branch.cardMaterialsDelivered == False

'''
Задача: Обучение агента
Условия:
1. Отношение кол-ва выданных карт к одобренным заявкам менее 50%, если выдано больше 0 карт
'''
def isNeedTask2(branch: Branch):
    return branch.issuanceCardCount > 0 and (1.0 * branch.approvedIssuesNumber / branch.issuanceCardCount) < 0.5


'''
Задача: Выезд на точку для стимулирования выдач
Условия: 
1. Дата выдачи последней карты более 7 дней назад, при этом есть одобренные заявки
2. Дата выдачи последней карты более 14 дней назад
'''
def isNeedTask3(branch: Branch):
    return branch.lastCardIssuanceDays and branch.approvedIssuesNumber > 0 or  branch.lastCardIssuanceDays > 14


def sort_tasks(assignedTasks: List[AssignTask]):
    return sorted(assignedTasks, key=lambda t: (-int(t.priority.value), t.date))

def is_task_exists(tasksToDo: List[AssignTask], taskToCheck: AssignTask):
    for task in tasksToDo:
        if task.branchId == taskToCheck.branchId and task.taskId == taskToCheck.taskId:
            return True
    
    return False

def job():

    #Доставка карт и материалов
    task1Id = '654aa25628fd5a4d65e9e583'

    #Обучение агента
    task2Id = '654aa20a28fd5a4d65e9e581'

    #Выезд на точку для стимулирования выдач
    task3Id = '654aa1e128fd5a4d65e9e57e'

    repo = MongoRepository()
    branches = repo.getAllBranches()
    tasksToDo = repo.getAllActiveAssignedTasks()

    
    for branch in branches:

        assignedTask = AssignTask()
        assignedTask.id = str(ObjectId())
        assignedTask.branchId = branch.id
        assignedTask.status = TaskAssignStatus.Todo
        assignedTask.date = datetime.datetime.now()


        if isNeedTask1(branch):
            assignedTask.taskId = task1Id
            assignedTask.priority = TaskPriority.Low
        elif isNeedTask2(branch):
            assignedTask.taskId = task2Id
            assignedTask.priority = TaskPriority.Medium
        elif isNeedTask3(branch):
            assignedTask.taskId = task3Id
            assignedTask.priority = TaskPriority.High

        if assignedTask.taskId is not None and not is_task_exists(tasksToDo, assignedTask):
            tasksToDo.append(assignedTask)

    tasksToDo = sort_tasks(tasksToDo)

    for i in tasksToDo:
        i.specialistId = None

    repo.updateOrCreateAssignedTasks(tasksToDo)



job()

# schedule.every(10).seconds.do()


# while True:
#     schedule.run_pending()
#     time.sleep(1)

   
