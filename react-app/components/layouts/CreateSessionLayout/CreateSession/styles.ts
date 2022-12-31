import styled from "styled-components";

export const Form = styled.form`
  width: 60%;
  margin: 0 auto;
`;

export const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(5, 1fr);
  grid-gap: 0.5rem;
  margin: 0.5rem 0;
`;

export const MetadataGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(2, 1fr);
  grid-gap: 0.5rem;
  margin: 0.5rem 0;
`;

export const Title = styled.h3`
  font-size: 1.5rem;
  text-align: center;
  margin: 2rem auto 1rem;
`;

export const Subtitle = styled.h3`
  margin: 1rem auto 0.4rem;
  font-size: 1.2rem;
  text-align: center;
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

export const Button = styled.button`
  width: 100%;
  margin-top: 1rem;
  border-radius: 8px;
  padding: 0.3rem;
  border: 1px solid #000;
`;
