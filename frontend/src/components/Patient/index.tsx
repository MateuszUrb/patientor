import { Diagnosis, Entry, EntryWithoutId, Gender, Patient } from "../../types";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import TransgenderIcon from "@mui/icons-material/Transgender";
import Entries from "./Entries";
import PatientService from "../../services/patients";
import { useEffect, useState } from "react";
import HealthCheckEntryForm from "./HealthCheckEntryForm";
import { Button } from "@mui/material";
import diagnosisService from "../../services/diagnoses";

interface Props {
  patient: Patient | null | undefined;
}

const PatientDetails = ({ patient }: Props) => {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<Diagnosis[]>([]);

  useEffect(() => {
    const fetchDiagnosis = async () => {
      const diagnosesData = await diagnosisService.getDiagnoses();
      setDiagnosis(diagnosesData);
    };
    fetchDiagnosis();
  }, []);
  const handleOpenForm = () => {
    setShowForm(true);
    setError(null);
  };
  const handleCloseForm = () => {
    setError(null);
    setShowForm(false);
  };

  const diagnosisMap = diagnosis.reduce(
    (acc, curr) => {
      acc[curr.code] = curr.name;
      return acc;
    },
    {} as Record<string, string>,
  );

  const handleSubmit = async (
    entry: EntryWithoutId,
  ): Promise<Entry | undefined> => {
    const patientID = patient?.id;
    if (!patientID) {
      setError("Patient Id misssing");
      return;
    }
    try {
      await PatientService.createEntry(patientID, entry);

      void handleCloseForm();
    } catch (error) {
      setError((error as Error).message);
    }
  };

  if (!patient) {
    return <div>Patient not found</div>;
  }

  const renderGenderIcon = (gender: Gender) => {
    switch (gender) {
      case Gender.Male:
        return <MaleIcon fontSize="medium" />;
      case Gender.Female:
        return <FemaleIcon fontSize="medium" />;
      case Gender.Other:
        return <TransgenderIcon fontSize="medium" />;
      default:
        return null;
    }
  };

  return (
    <section>
      <header>
        <h1>
          {patient.name} {renderGenderIcon(patient.gender)}
        </h1>
      </header>
      <p>ssn: {patient.ssn ? patient.ssn : "Not found"}</p>
      <p>occupation: {patient.occupation}</p>

      {!showForm && (
        <Button variant="contained" color="primary" onClick={handleOpenForm}>
          Add New HealthCheck Entry
        </Button>
      )}

      {showForm && (
        <HealthCheckEntryForm
          diagnosisMap={diagnosisMap}
          patientID={patient.id}
          error={error}
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
        />
      )}

      <Entries patient={patient} diagnosisMap={diagnosisMap} />
    </section>
  );
};

export default PatientDetails;
