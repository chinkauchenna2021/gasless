import * as SC from "./styles";

interface CreateSessionInputProps {
  value?: any;
  label: string;
  name?: string;
  min?: string;
  type: "number" | "text" | "datetime-local";
  onChange?: (event: any) => void;
}

const CreateSessionInput = ({ value, label, name, min, type, onChange }: CreateSessionInputProps) => {
  return (
    <SC.InputWrapper>
      <SC.InputLabel htmlFor={name}>{label}</SC.InputLabel>
      <SC.Input type={type} value={value} name={name} id={name} min={min} onChange={onChange} />
    </SC.InputWrapper>
  );
};

export default CreateSessionInput;
