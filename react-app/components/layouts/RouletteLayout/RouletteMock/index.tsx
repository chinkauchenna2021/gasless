import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRoulette } from "contexts/RouletteContext";

import * as SC from "./styles";
import { RouletteVirtualFloor } from "../../doubledice/platform/lib/graph";

enum BetOutcomes {
  FIRST_ROW,
  SECOND_ROW,
  THIRD_ROW,
  FIRST_TWELVE,
  SECOND_TWELVE,
  THIRD_TWELVE,
  FIRST_TO_EIGHTEEN,
  EVEN_NUMS,
  RED_NUMS,
  BLACK_NUMS,
  ODD_NUMS,
  NINETEEN_TO_THIRTY_SIX,
}

interface OutcomeProps {
  outcomeId: number;
  backgroundColor: string;
}

interface IProps {
  virtualFloor: RouletteVirtualFloor
}

const RouletteMockComponent = ({ virtualFloor }: IProps) => {
  const [selectedBetOutcomes, setSelectedBetOutcomes] = useState<BetOutcomes | undefined>();
  const { currentOutcomeIndexes, setCurrentOutcomeIndexes } = useRoulette();

  const outcomes: OutcomeProps[] = useMemo(
    () => [
      { outcomeId: 3, backgroundColor: "#c91f41" },
      { outcomeId: 6, backgroundColor: "#2a3035" },
      { outcomeId: 9, backgroundColor: "#c91f41" },
      { outcomeId: 12, backgroundColor: "#c91f41" },
      { outcomeId: 15, backgroundColor: "#2a3035" },
      { outcomeId: 18, backgroundColor: "#c91f41" },
      { outcomeId: 21, backgroundColor: "#c91f41" },
      { outcomeId: 24, backgroundColor: "#2a3035" },
      { outcomeId: 27, backgroundColor: "#c91f41" },
      { outcomeId: 30, backgroundColor: "#c91f41" },
      { outcomeId: 33, backgroundColor: "#2a3035" },
      { outcomeId: 36, backgroundColor: "#c91f41" },
      { outcomeId: 2, backgroundColor: "#2a3035" },
      { outcomeId: 5, backgroundColor: "#c91f41" },
      { outcomeId: 8, backgroundColor: "#2a3035" },
      { outcomeId: 11, backgroundColor: "#2a3035" },
      { outcomeId: 14, backgroundColor: "#c91f41" },
      { outcomeId: 17, backgroundColor: "#2a3035" },
      { outcomeId: 20, backgroundColor: "#2a3035" },
      { outcomeId: 23, backgroundColor: "#c91f41" },
      { outcomeId: 26, backgroundColor: "#2a3035" },
      { outcomeId: 29, backgroundColor: "#2a3035" },
      { outcomeId: 32, backgroundColor: "#c91f41" },
      { outcomeId: 35, backgroundColor: "#2a3035" },
      { outcomeId: 1, backgroundColor: "#c91f41" },
      { outcomeId: 4, backgroundColor: "#2a3035" },
      { outcomeId: 7, backgroundColor: "#c91f41" },
      { outcomeId: 10, backgroundColor: "#2a3035" },
      { outcomeId: 13, backgroundColor: "#2a3035" },
      { outcomeId: 16, backgroundColor: "#c91f41" },
      { outcomeId: 19, backgroundColor: "#c91f41" },
      { outcomeId: 22, backgroundColor: "#2a3035" },
      { outcomeId: 25, backgroundColor: "#c91f41" },
      { outcomeId: 28, backgroundColor: "#2a3035" },
      { outcomeId: 31, backgroundColor: "#2a3035" },
      { outcomeId: 34, backgroundColor: "#c91f41" },
    ],
    []
  );

  const handleSingleBetToogle = useCallback(
    (betOutcome: number) => {
      const foundExistingOutcome = currentOutcomeIndexes.find((outcome) => betOutcome === outcome);

      if (currentOutcomeIndexes.length <= 3 && foundExistingOutcome === undefined) {
        setCurrentOutcomeIndexes([...currentOutcomeIndexes, betOutcome].sort((a, b) => a - b));
      }

      if (currentOutcomeIndexes.length <= 4 && foundExistingOutcome !== undefined) {
        setCurrentOutcomeIndexes(currentOutcomeIndexes.filter((outcome) => outcome !== betOutcome));
      }
    },
    [currentOutcomeIndexes, setCurrentOutcomeIndexes]
  );

  const outcomeKeyValueToNumberList = useCallback((outcomesArray: OutcomeProps[]) => {
    return outcomesArray.map((outcome) => outcome.outcomeId).sort((a, b) => a - b);
  }, []);

  const selectedOutcomesBets = useMemo(() => {
    let filteredOutcomes: OutcomeProps[] = [];

    switch (selectedBetOutcomes) {
      case BetOutcomes.FIRST_ROW:
        filteredOutcomes = outcomes.filter((_, index) => index <= 11);
        break;
      case BetOutcomes.SECOND_ROW:
        filteredOutcomes = outcomes.filter((_, index) => index >= 12 && index <= 23);
        break;
      case BetOutcomes.THIRD_ROW:
        filteredOutcomes = outcomes.filter((_, index) => index >= 24);
        break;
      case BetOutcomes.FIRST_TWELVE:
        filteredOutcomes = outcomes.filter((outcome) => outcome.outcomeId <= 12);
        break;
      case BetOutcomes.SECOND_TWELVE:
        filteredOutcomes = outcomes.filter((outcome) => outcome.outcomeId >= 13 && outcome.outcomeId <= 24);
        break;
      case BetOutcomes.THIRD_TWELVE:
        filteredOutcomes = outcomes.filter((outcome) => outcome.outcomeId >= 25);
        break;
      case BetOutcomes.FIRST_TO_EIGHTEEN:
        filteredOutcomes = outcomes.filter((outcome) => outcome.outcomeId <= 18);
        break;
      case BetOutcomes.EVEN_NUMS:
        filteredOutcomes = outcomes.filter((outcome) => outcome.outcomeId % 2 === 0);
        break;
      case BetOutcomes.RED_NUMS:
        filteredOutcomes = outcomes.filter((outcome) => outcome.backgroundColor === "#c91f41");
        break;
      case BetOutcomes.BLACK_NUMS:
        filteredOutcomes = outcomes.filter((outcome) => outcome.backgroundColor === "#2a3035");
        break;
      case BetOutcomes.ODD_NUMS:
        filteredOutcomes = outcomes.filter((outcome) => outcome.outcomeId % 2 !== 0);
        break;
      case BetOutcomes.NINETEEN_TO_THIRTY_SIX:
        filteredOutcomes = outcomes.filter((outcome) => outcome.outcomeId >= 19);
        break;
      default:
        filteredOutcomes = [];
        break;
    }

    return outcomeKeyValueToNumberList(filteredOutcomes);
  }, [outcomes, selectedBetOutcomes, outcomeKeyValueToNumberList]);

  useEffect(() => {
    if (currentOutcomeIndexes.length && selectedOutcomesBets.length) return;

    setCurrentOutcomeIndexes(selectedOutcomesBets);
  }, [setCurrentOutcomeIndexes, selectedOutcomesBets]);

  const handleMultipleBetsToogle = useCallback(
    (betOutcomes: BetOutcomes) => {
      if (selectedBetOutcomes !== undefined) {
        setSelectedBetOutcomes(undefined);
      } else {
        setSelectedBetOutcomes(betOutcomes);
      }
    },
    [selectedBetOutcomes]
  );

  return (
    <SC.GridContainer>
      <SC.ZeroBtn isSelected={currentOutcomeIndexes.includes(0)} onClick={() => handleSingleBetToogle(0)}>
        0
      </SC.ZeroBtn>
      <SC.RoulleteContainer>
        {outcomes.map((outcome) => (
          <SC.RoulleteOutcomeBtn
            key={outcome.outcomeId}
            backgroundColor={outcome.backgroundColor}
            isSelected={currentOutcomeIndexes.includes(outcome.outcomeId)}
            onClick={() => handleSingleBetToogle(outcome.outcomeId)}>
            {outcome.outcomeId}
          </SC.RoulleteOutcomeBtn>
        ))}
      </SC.RoulleteContainer>
      <SC.RowBtnsContainer>
        <SC.RowBtn onClick={() => handleMultipleBetsToogle(BetOutcomes.FIRST_ROW)}>1to2</SC.RowBtn>
        <SC.RowBtn onClick={() => handleMultipleBetsToogle(BetOutcomes.SECOND_ROW)}>1to2</SC.RowBtn>
        <SC.RowBtn onClick={() => handleMultipleBetsToogle(BetOutcomes.THIRD_ROW)}>1to2</SC.RowBtn>
      </SC.RowBtnsContainer>
      <div />
      <SC.BetOutcomesContainer>
        <div>
          <SC.BetOutcomesBtn onClick={() => handleMultipleBetsToogle(BetOutcomes.FIRST_TWELVE)}>
            1st 12
          </SC.BetOutcomesBtn>
          <SC.BetOutcomesBtn onClick={() => handleMultipleBetsToogle(BetOutcomes.SECOND_TWELVE)}>
            2nd 12
          </SC.BetOutcomesBtn>
          <SC.BetOutcomesBtn onClick={() => handleMultipleBetsToogle(BetOutcomes.THIRD_TWELVE)}>
            3rd 12
          </SC.BetOutcomesBtn>
        </div>
        <div>
          <SC.BetOutcomesBtn onClick={() => handleMultipleBetsToogle(BetOutcomes.FIRST_TO_EIGHTEEN)}>
            1 to 18
          </SC.BetOutcomesBtn>
          <SC.BetOutcomesBtn onClick={() => handleMultipleBetsToogle(BetOutcomes.EVEN_NUMS)}>EVEN</SC.BetOutcomesBtn>
          <SC.BetOutcomesBtn backgroundColor="#c91f41" onClick={() => handleMultipleBetsToogle(BetOutcomes.RED_NUMS)}>
            RED
          </SC.BetOutcomesBtn>
          <SC.BetOutcomesBtn backgroundColor="#2a3035" onClick={() => handleMultipleBetsToogle(BetOutcomes.BLACK_NUMS)}>
            BLACK
          </SC.BetOutcomesBtn>
          <SC.BetOutcomesBtn onClick={() => handleMultipleBetsToogle(BetOutcomes.ODD_NUMS)}>ODD</SC.BetOutcomesBtn>
          <SC.BetOutcomesBtn onClick={() => handleMultipleBetsToogle(BetOutcomes.NINETEEN_TO_THIRTY_SIX)}>
            19 to 36
          </SC.BetOutcomesBtn>
        </div>
      </SC.BetOutcomesContainer>
    </SC.GridContainer>
  );
};

export default RouletteMockComponent;
