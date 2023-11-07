from typing import Optional 
from pydantic import BaseModel, Field
from models.Address import Address
from enum import Enum


class ConnectionDate(Enum):
  Yesterday = 0
  LongAgo = 1

class Branch(BaseModel):
  id: str
  address: Optional[Address]
  connectionDate: Optional[ConnectionDate]
  cardMaterialsDelivered: Optional[bool]
  lastCardIssuanceDays: Optional[int]
  approvedIssuesNumber: Optional[int]
  issuanceCardCount: Optional[int]