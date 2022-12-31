import styled from "styled-components";

export const Form = styled.form`
  max-width: 500px;
  margin: 0 auto;
`;

export const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(5, 1fr);
  grid-gap: 0.5rem;
  margin: 0.5rem 0;
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const InputLabel = styled.label`
  font-size: 1rem;
`;

export const Input = styled.input`
  width: 100%;
  border: 1px solid #000;
  border-radius: 8px;
  padding: 0.3rem;
`;

export const KeyValueContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0.5rem;
`;

export const ValueInnerDiv = styled.div`
  display: flex;

  button {
    margin-left: 0.5rem;
  }
`;
