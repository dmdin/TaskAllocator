from pydantic import BaseModel

class Address(BaseModel):
  latitude: float
  longitude: float
  address: str