import axios from "axios";
import { Entry, EntryWithoutId, Patient, PatientFormValues } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(`${apiBaseUrl}/patients`);

  return data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(`${apiBaseUrl}/patients`, object);

  return data;
};

const createEntry = async (
  patientId: string,
  entry: EntryWithoutId,
): Promise<Entry> => {
  try {
    const { data } = await axios.post(
      `http://localhost:3001/api/patients/${patientId}/entries`,
      entry,
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error creating entry:",
        error.response?.data || error.message,
      );
      throw new Error(
        (error.response?.data && error.response.data.error) || error.message,
      );
    }
    throw new Error("An unexpected error occurred while creating the entry.");
  }
};

export default {
  getAll,
  create,
  createEntry,
};
