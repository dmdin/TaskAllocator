from pydantic import BaseModel
import datetime
from enum import Enum
from typing import Optional
from models.TaskPriority import TaskPriority 

class TaskAssignStatus(Enum):
  Todo = '0'
  InWork = '1' 
  Completed = '2'


class AssignTask(BaseModel):
  id: Optional[str] = None
  taskId: Optional[str] = None
  specialistId: Optional[str] = None
  branchId: Optional[str] = None
  date: Optional[datetime.datetime] = None
  taskNumber: Optional[int] = None
  status: Optional[TaskAssignStatus] = None
  priority: Optional[TaskPriority] = None