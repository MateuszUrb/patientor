import { useState } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Typography,
  Alert,
  SelectChangeEvent,
  OutlinedInput,
  Chip,
} from "@mui/material";
import { Entry, EntryWithoutId, HealthCheckRating } from "../../types";

interface HealthCheckEntryFormProps {
  onSubmit: (entry: EntryWithoutId) => Promise<Entry | undefined>;
  onCancel: () => void;
  error: string | null;
  patientID: string;
  diagnosisMap: Record<string, string>;
}

const HealthCheckEntryForm = ({
  onSubmit,
  onCancel,
  error,
  diagnosisMap,
}: HealthCheckEntryFormProps) => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(
    HealthCheckRating.Healthy,
  );
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  const handleDiagnosisCodesChange = (
    event: SelectChangeEvent<typeof diagnosisCodes>,
  ) => {
    const {
      target: { value },
    } = event;
    setDiagnosisCodes(typeof value === "string" ? value.split(",") : value);
  };

  const handleSubmit = async () => {
    const newEntry: EntryWithoutId = {
      type: "HealthCheck",
      description,
      date,
      specialist,
      healthCheckRating,
      diagnosisCodes,
    };

    await onSubmit(newEntry);
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "auto",
        padding: 2,
        border: "1px solid #ccc",
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <Typography variant="h6" gutterBottom>
        New HealthCheck Entry
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        label="Specialist"
        value={specialist}
        onChange={(e) => setSpecialist(e.target.value)}
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="healthcheck-label">HealthCheck Rating</InputLabel>
        <Select
          labelId="healthcheck-label"
          label="HealthCheck Rating"
          value={healthCheckRating}
          onChange={(e) =>
            setHealthCheckRating(e.target.value as HealthCheckRating)
          }
        >
          <MenuItem value={HealthCheckRating.Healthy}>Healthy</MenuItem>
          <MenuItem value={HealthCheckRating.LowRisk}>Low Risk</MenuItem>
          <MenuItem value={HealthCheckRating.HighRisk}>High Risk</MenuItem>
          <MenuItem value={HealthCheckRating.CriticalRisk}>
            Critical Risk
          </MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel id="diagnosis-codes-label">Diagnosis Codes</InputLabel>
        <Select
          labelId="diagnosis-codes-label"
          multiple
          value={diagnosisCodes}
          onChange={handleDiagnosisCodesChange}
          input={
            <OutlinedInput id="select-multiple-chip" label="Diagnosis Codes" />
          }
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={`${value} - ${diagnosisMap[value]}`} />
              ))}
            </Box>
          )}
        >
          {Object.keys(diagnosisMap).map((code) => (
            <MenuItem key={code} value={code}>
              {`${code} - ${diagnosisMap[code]}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Add
        </Button>
      </Box>
    </Box>
  );
};

export default HealthCheckEntryForm;
