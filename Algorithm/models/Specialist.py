from pydantic import BaseModel, Field
from models.Address import Address
from enum import Enum
from typing import Optional

class SpecialistLevel(Enum):
  Junior = 0
  Middle = 1
  Senior = 2

class Specialist(BaseModel):
    id: str
    firstName: str
    lastName: str
    fatherName: str
    address: str
    level: SpecialistLevel