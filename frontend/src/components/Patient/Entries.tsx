import {
  Entry,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthcareEntry,
  Patient,
} from "../../types";
import { assertNever } from "../../utils";

interface Props {
  patient: Patient | null | undefined;
  diagnosisMap: Record<string, string>;
}

function Entries({ patient, diagnosisMap }: Props) {
  if (!patient) {
    return <h1>Patient not found</h1>;
  }

  const renderEntryDetails = (entry: Entry) => {
    switch (entry.type) {
      case "Hospital":
        const hospitalEntry = entry as HospitalEntry;
        return (
          <div>
            <p>
              <strong>Discharge Date:</strong> {hospitalEntry.discharge.date}
            </p>
            <p>
              <strong>Criteria:</strong> {hospitalEntry.discharge.criteria}
            </p>
          </div>
        );
      case "OccupationalHealthcare":
        const occupationalEntry = entry as OccupationalHealthcareEntry;
        return (
          <div>
            <p>
              <strong>Employer:</strong> {occupationalEntry.employerName}
            </p>
            {occupationalEntry.sickLeave && (
              <div>
                <p>
                  <strong>Sick Leave Start Date:</strong>{" "}
                  {occupationalEntry.sickLeave.startDate}
                </p>
                <p>
                  <strong>Sick Leave End Date:</strong>{" "}
                  {occupationalEntry.sickLeave.endDate}
                </p>
              </div>
            )}
          </div>
        );
      case "HealthCheck":
        const healthCheckEntry = entry as HealthCheckEntry;
        return (
          <div>
            <p>
              <strong>Health Check Rating:</strong>{" "}
              {healthCheckEntry.healthCheckRating}
            </p>
          </div>
        );
      default:
        return assertNever(entry);
    }
  };

  const entryStyle = {
    border: "1px solid black",
    borderRadius: "3px",
    padding: "1rem",
    margin: "1rem 0",
  };

  return (
    <section>
      <h2>Entries:</h2>
      {patient.entries.length === 0 ? (
        <p>No entries available for this patient.</p>
      ) : (
        patient.entries.map((entry) => (
          <article key={entry.id} style={entryStyle}>
            <header>
              <time dateTime={entry.date}>{entry.date}</time>
              <p>
                <strong>Description:</strong> {entry.description}
              </p>
              <p>
                <strong>Specialist:</strong> {entry.specialist}
              </p>
            </header>
            {renderEntryDetails(entry)}
            {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
              <div>
                <h3>Diagnosis Codes:</h3>
                <ul>
                  {entry.diagnosisCodes.map((code) => (
                    <li key={code}>
                      {code}: {diagnosisMap[code] || "Unknown diagnosis"}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        ))
      )}
    </section>
  );
}

export default Entries;
