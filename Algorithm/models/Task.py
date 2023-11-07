from pydantic import BaseModel, Field
from models.Address import Address
from models.TaskPriority import TaskPriority
from typing import List
from enum import Enum

class EmployeeLevel(Enum):
  Junior = '0'
  Middle = '1'
  Senior = '2'
  
class appointmentConditions(BaseModel):
  text: str

class Task(BaseModel):
  id: str
  name: str
  priority: TaskPriority
  executionPeriodMinutes: int
#   conditions: List[appointmentConditions]
  level: EmployeeLevel