import express from "express";
import cors from "cors";
import DiagnosesRouter from "./routes/diagnoses";
import PatientRouter from "./routes/patients";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

app.use("/api/diagnoses", DiagnosesRouter);
app.use("/api/patients", PatientRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
