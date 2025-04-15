import diagnoses from "../data/diagnoses";
import { Diagnosis } from "../types";

function getDiagnosesEntries(): Diagnosis[] {
  return diagnoses;
}

export default {
  getDiagnosesEntries,
};
