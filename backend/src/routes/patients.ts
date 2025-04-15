import express from "express";
import patientService from "../services/patientService";
import Utils from "../utils";
import { z } from "zod";

import { v1 as uuid } from "uuid";
import patients from "../data/patients";
import { Entry } from "../types";
const router = express.Router();

router.get("/", (_req, res) => {
  res.send(patientService.getPatientsEntries());
});

router.post("/", (req, res) => {
  try {
    const newPatient = Utils.NewPatientSchema.parse(req.body);
    const addedPatient = patientService.addPatient(newPatient);
    res.send(addedPatient);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
    }
    res.sendStatus(400);
  }
});

router.get("/:id", (req, res) => {
  const patient = patientService.findPatient(req.params.id);

  if (patient) {
    if (!patient.entries) {
      patient.entries = [];
    }
    res.status(200).send({ patient });
  } else {
    res.status(404).send({ error: "Patient not found" });
  }
});

router.post("/:id/entries", (req, res) => {
  const patientId = req.params.id;
  const patient = patients.find((patient) => patient.id === patientId);
  if (!patient) {
    res.status(404).send({ error: "Patient not found" });
  }

  try {
    const newEntry = Utils.toNewEntry(req.body);

    const diagnosisCodes = Utils.parseDiagnosisCodes(req.body);
    const entryWithId: Entry = {
      ...newEntry,
      id: uuid(),
      diagnosisCodes,
    };

    patient?.entries.push(entryWithId);
    res.json(entryWithId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.errors);
      res.status(400).send({ error: error.message });
    } else if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.sendStatus(500);
    }
  }
});

export default router;
