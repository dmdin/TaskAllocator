import os
from pymongo import MongoClient

class MatrixWithMinutes:
    def __init__(self):
        self.matrix = {}
        self.read_mongo_matrix()

    def read_mongo_matrix(self):
        mongo_url = os.environ.get('MONGO_CONNECTION_STRING')
        client = MongoClient(mongo_url)
        db = client["task-allocator"]
        collection = db["from_to_in_minutes"]

        for row in collection.find():
            from_, to, minutes = row['from'], row['to'], row['minutes']
            self.matrix[from_] = self.matrix.get(from_, dict())
            self.matrix[to] = self.matrix.get(to, dict())
            self.matrix[from_][to] = minutes
            self.matrix[to][from_] = minutes

    def get(self, from_: str, to_: str) -> float:
        return self.matrix.get(from_, {}).get(to_, None)

if __name__ == "__main__":
    matr = MatrixWithMinutes()
    print(matr.get('', ''))
