import { z } from "zod";
import { Diagnosis, Gender, HealthCheckRating } from "../types";

const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  gender: z.nativeEnum(Gender),
  ssn: z.string(),
  occupation: z.string(),
});

const BaseEntrySchema = z.object({
  description: z.string().min(1, "Description cannot be empty"),
  date: z.string().min(1, "Date cannot be empty"),
  specialist: z.string().min(1, "Specialist cannot be empty"),
  diagnosisCodes: z.array(z.string()).optional(),
});

const HospitalEntrySchema = BaseEntrySchema.extend({
  type: z.literal("Hospital"),
  discharge: z.object({
    date: z.string(),
    criteria: z.string(),
  }),
});

const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
  type: z.literal("OccupationalHealthcare"),
  employerName: z.string(),
  sickLeave: z
    .object({
      startDate: z.string(),
      endDate: z.string(),
    })
    .optional(),
});

const HealthCheckEntrySchema = BaseEntrySchema.extend({
  type: z.literal("HealthCheck"),
  healthCheckRating: z.nativeEnum(HealthCheckRating),
});

const EntrySchema = z.union([
  HospitalEntrySchema,
  OccupationalHealthcareEntrySchema,
  HealthCheckEntrySchema,
]);

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis["code"]> => {
  if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
    return [];
  }

  const diagnosisCodes = object.diagnosisCodes;
  if (!Array.isArray(diagnosisCodes)) {
    return [];
  }

  return diagnosisCodes.map((code: unknown) => {
    if (typeof code === "string") {
      return code;
    }
    throw new Error("Invalid diagnosis code");
  });
};

const toNewEntry = (object: unknown): NewEntry => {
  const parsedEntry = EntrySchema.safeParse(object);
  if (!parsedEntry.success) {
    console.error("Validation failed:", parsedEntry.error);
    throw new Error(parsedEntry.error.errors.map((e) => e.message).join(", "));
  }
  return parsedEntry.data;
};

export type NewEntry = z.infer<typeof EntrySchema>;
export default {
  NewPatientSchema,
  toNewEntry,
  parseDiagnosisCodes,
};
