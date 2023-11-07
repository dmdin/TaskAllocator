from pydantic import BaseModel, Field
from models.Address import Address
from enum import Enum

class Specialist(BaseModel):
    id: str
    firstName: str
    lastName: str
    fatherName: str
    address: Address
    level: str