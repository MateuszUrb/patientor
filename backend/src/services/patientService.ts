import { v1 as uuid } from "uuid";
import patients from "../data/patients";
import { NewPatient, Patient } from "../types";

function getPatientsEntries(): Patient[] {
  return patients.map(
    ({ id, name, dateOfBirth, gender, occupation, entries, ssn }) => ({
      id,
      name,
      ssn,
      dateOfBirth,
      gender,
      occupation,
      entries,
    }),
  );
}

function addPatient(patient: NewPatient): Patient {
  const id = uuid();
  const newPatient = {
    id,
    ...patient,
    entries: [],
  };

  return newPatient;
}

function findPatient(patientId: string): Patient | undefined {
  const patient = patients.find((patient) => patient.id === patientId);
  if (patient) {
    return patient;
  }
  return undefined;
}

export default {
  getPatientsEntries,
  addPatient,
  findPatient,
};
