from mongo.MongoRepository import MongoRepository
from models.Branch import Branch, ConnectionDate
from models.AssignTask import AssignTask
import datetime
from typing import List
from models.TaskPriority import TaskPriority
from bson.objectid import ObjectId
from models.AssignTask import TaskAssignStatus
import pandas as pd
from get_time import MatrixWithMinutes
import uvicorn
import schedule
from fastapi import FastAPI
import time
import time
from concurrent.futures import ThreadPoolExecutor

pd.options.mode.chained_assignment = None



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

def get_sub_workers(point_id, workers_df, time_df, grade, ttime):
    sub_workers = workers_df[(workers_df.grade==grade) & (workers_df.work_time >= ttime*60)]
    if len(sub_workers) == 0:
        return sub_workers
    sub_workers["time_to"] = sub_workers.base_id.apply(lambda x: time_df[(time_df.id1 == x) & (time_df.id2 == point_id)]["t"].values[0])
    sub_workers = sub_workers.sort_values(by="time_to")
    sub_workers["diff_time"] = sub_workers["work_time"] - sub_workers["time_to"] - ttime * 60
    sub_workers = sub_workers[sub_workers.diff_time >= 0]
    return sub_workers

def job():

    WORK_HOURS_PER_DAY = 8
    MINUTES_IN_HOUR = 60

    #Доставка карт и материалов
    task1Id = '654aa25628fd5a4d65e9e583'

    #Обучение агента
    task2Id = '654aa20a28fd5a4d65e9e581'

    #Выезд на точку для стимулирования выдач
    task3Id = '654aa1e128fd5a4d65e9e57e'

    repo = MongoRepository()
    branches = repo.getAllBranches()
    tasksToDo = repo.getAllActiveAssignedTasks()
    workers = repo.getAllSpecialists()

    workers_df = pd.DataFrame([{'worker_id':t.id, 'base_id':t.address, 'grade': int(t.level.value)+1} for t in workers])
    workers_df["work_time"] = [WORK_HOURS_PER_DAY * MINUTES_IN_HOUR] * workers_df.shape[0]
    

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


    tasks_df = pd.DataFrame([{'id': t.id, 'point_id':t.branchId, 'prior': int(t.priority.value), 'task': t.taskId, 'dates': t.date} for t in tasksToDo])

    workers_task = {}

    matr = MatrixWithMinutes()

    time_df  = []

    for loc in matr.matrix:
        for loc2 in matr.matrix[loc]:
            time_df.append({'id1': loc, 'id2': loc2, 't': matr.matrix[loc][loc2]})

    time_df = pd.DataFrame(time_df)
    

    cur_p = 2
    while cur_p != -1:
        sub_tasks = tasks_df[tasks_df.prior == cur_p].drop(columns=["prior"])
        sub_tasks = sub_tasks.sort_values(by="dates")

        tmp = []

        is_smth_changed = False

        for i in range(len(sub_tasks)):
            worker = None
            point = None
            ttime = None
            assignTask = None

            if sub_tasks.iloc[i].task == task3Id:
                ttime = 4
                sub_workers = get_sub_workers(sub_tasks.iloc[i].point_id, workers_df, time_df, 3, ttime)
                if len(sub_workers) == 0:
                    continue
                worker = sub_workers.iloc[0].worker_id
                point = sub_tasks.iloc[i].point_id
                dt = sub_workers.iloc[0].diff_time

            if sub_tasks.iloc[i].task == task2Id:
                ttime = 2
                sub_workers = get_sub_workers(sub_tasks.iloc[i].point_id, workers_df, time_df, 2, ttime)
                if len(sub_workers) == 0:
                    sub_workers = get_sub_workers(sub_tasks.iloc[i].point_id, workers_df, time_df, 3, ttime)
                    if len(sub_workers) == 0:
                        continue
                worker = sub_workers.iloc[0].worker_id
                point = sub_tasks.iloc[i].point_id
                dt = sub_workers.iloc[0].diff_time

            if sub_tasks.iloc[i].task == task1Id:
                ttime = 1.5
                sub_workers = get_sub_workers(sub_tasks.iloc[i].point_id, workers_df, time_df, 1, ttime)
                if len(sub_workers) == 0:
                    sub_workers = get_sub_workers(sub_tasks.iloc[i].point_id, workers_df, time_df, 2, ttime)
                    if len(sub_workers) == 0:
                        sub_workers = get_sub_workers(sub_tasks.iloc[i].point_id, workers_df, time_df, 3, ttime)
                        if len(sub_workers) == 0:
                            continue
                worker = sub_workers.iloc[0].worker_id
                assignTask = sub_tasks.iloc[i].id
                point = sub_tasks.iloc[i].point_id
                dt = sub_workers.iloc[0].diff_time

            if worker is not None:

                for taskTodo in tasksToDo:
                    if taskTodo.id == assignTask:
                        taskTodo.specialistId = worker
                if worker not in workers_task:
                    workers_task[worker] = [assignTask]
                else:
                    workers_task[worker].append(assignTask)

                workers_df.loc[workers_df['worker_id'] == worker, "work_time"] = dt
                workers_df.loc[workers_df['worker_id'] == worker, "base_id"] = point
                is_smth_changed = True
                tasks_df = tasks_df[tasks_df.point_id != point]
        if not is_smth_changed:
            cur_p -= 1

        
    print(workers_df)

    repo.updateOrCreateAssignedTasks(tasksToDo)


app = FastAPI()


@ app.get("/force-allocate-tasks")
async def force_allocate_tasks():
    job()
    return "Задачи успешно распределены"


def run_fastapi():
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


def run_schedule():
    schedule.every(10).seconds.do(job)
    while True:
        schedule.run_pending()
        time.sleep(1)

if __name__ == "__main__":
    with ThreadPoolExecutor(max_workers=2) as executor:
        executor.submit(run_fastapi)
        executor.submit(run_schedule)