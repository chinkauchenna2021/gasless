import styled from "styled-components";

export const GridContainer = styled.div`
  width: 100%;
  height: 18rem;
  margin: auto;
  display: grid;
  grid-template-columns: 3rem 1fr 3rem;
  grid-template-rows: 3fr 1fr;
  background: #3f7430;
  padding: 2rem 15%;
`;

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);

  width: 100%;
`;

interface ZeroBtnProps {
  isSelected: boolean;
}

export const ZeroBtn = styled.button<ZeroBtnProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #fff;
  background: transparent;
  font-size: ${({ isSelected }) => (isSelected ? "1rem" : "0.8rem")};
  font-weight: ${({ isSelected }) => (isSelected ? "700" : "normal")};
  color: ${({ isSelected }) => (isSelected ? "#17c81e" : "#fff")};
`;

export const RoulleteContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(3, 1fr);
`;

interface RoulleteOutcomeBtnProps {
  isSelected: boolean;
  backgroundColor: string;
}

export const RoulleteOutcomeBtn = styled.button<RoulleteOutcomeBtnProps>`
  border: 1px solid #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ backgroundColor }) => backgroundColor};
  font-size: ${({ isSelected }) => (isSelected ? "1rem" : "0.8rem")};
  font-weight: ${({ isSelected }) => (isSelected ? "700" : "normal")};
  color: ${({ isSelected }) => (isSelected ? "#17c81e" : "#fff")};
`;

export const RowBtnsContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(3, 1fr);
`;

export const RowBtn = styled.button`
  border: 1px solid #fff;
  background: transparent;
  font-weight: bold;
  color: #fff;
`;

export const BetOutcomesContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(2, 1fr);

  div:first-child {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }

  div:last-child {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
  }
`;

interface BetOutcomesBtnProps {
  backgroundColor?: string;
}

export const BetOutcomesBtn = styled.button<BetOutcomesBtnProps>`
  border: 1px solid #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
  font-weight: bold;
  color: #fff;
  background: ${({ backgroundColor }) => backgroundColor ?? "transparent"};
`;
