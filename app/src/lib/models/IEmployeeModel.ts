interface ISpecialist extends Document {
    firstName: string;
    lastName: string;
    fatherName: string;
    patronymic: string;
    Location: string;
    coordinates: number[];
    Level_of_specialist: SpecialistLevel;
  }