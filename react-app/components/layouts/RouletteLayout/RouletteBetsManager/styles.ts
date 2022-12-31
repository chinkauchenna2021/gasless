import styled from "styled-components";

export const Container = styled.div`
  width: 70%;
  margin: 0 auto;
  padding: 1rem 6rem;
`;
export const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0.8rem;

  width: 100%;
`;

export const Section = styled.div`
  display: grid;
  flex-direction: column;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  flex-wrap: wrap;
`;

export const Title = styled.h2`
  margin: 0.4rem 0;
`;

export const Subtitle = styled.h3`
  margin: 0.6rem 0;
`;

export const BetCard = styled.div`
  background-color: #3f743002;
  border: 1px solid #3f7430;
  padding: 0.6rem;
  margin: 0 0.6rem 0.6rem 0;
  border-radius: 8px;
`;

export const Value = styled.p`
  margin: 0 0 0.6rem 0;
`;

export const Text = styled.p`
  margin: 0;
`;

export const AmountInput = styled.input`
  width: 100%;
  border: 1px solid #000;
  border-radius: 8px;
  padding: 0.3rem;
  margin-bottom: 0.4rem;
`;

export const ClaimRewardsBtn = styled.button`
  width: 100%;
`;

export const PlaceBetBtn = styled.button`
  width: 100%;
`;

export const CommitBetsBtn = styled.button`
  width: 100%;
`;

export const ResolveSpinBtn = styled.button`
  width: 100%;
`;
