import { gql } from "@apollo/client";

const OUTCOME_COMMON_FIELDS = gql`
  fragment commonOutcomeFields on Outcome {
    index
    title
    totalSupply
    totalWeightedSupply
  }
`;

export const ROULETTE_SESSIONS = gql`
  query RouletteSession {
    rouletteSessions (orderBy: tOpen, orderDirection: desc) {
      id
      bonusAmounts
      environmentName
      tOpen
      tResolve
      tableName
      vfIds
      tableId
    }
  }
`;

export const ROULETTE_SESSIONS_VIRTUALFLOOR = gql`
  query RouletteVirtualFloors($tableId: Int!)  {
    rouletteVirtualFloors (where: {tableId: $tableId}, orderBy: tOpen, orderDirection: asc) {
      id
      environmentName
      tOpen
      intId
      bonusAmount
      totalSupply
      tResolve
      tableName
      tClose
      tableId
      state
    }
  }
`;

export const ROULETTE_VIRTUALFLOOR = gql`
  ${OUTCOME_COMMON_FIELDS}
  query RouletteVirtualFloor($intId: String!) {
    rouletteVirtualFloors (where: {intId: $intId}, orderBy: tOpen, orderDirection: asc) {
      id
      intId
      paymentToken {
        symbol
        decimals
      }
      totalFeeRate
      protocolFeeRate
      creationTxTimestamp
      tClose
      tOpen
      tResolve
      tableId
      state
      winningOutcome {
        ...commonOutcomeFields
      }
      winnerProfits
      resolutionOrCancellationTxHash
      totalSupply
      creator {
        id
      }
      outcomes {
        ...commonOutcomeFields
      }
      bonusAmount
      title
      description
      isListed
    }
  }
`;


export const USER_SPECIFIC_VIRTUAL_FLOOR = gql`
  # See https://www.apollographql.com/docs/react/data/fragments/
  fragment CommonOutcomeFields on Outcome {
    index
    title
    totalSupply
    totalWeightedSupply
    userOutcomes(where: { user: $userId, totalBalance_gt: 0 }) {
      totalBalance
      totalWeightedBalance
      userOutcomeTimeslots(where: { balance_gt: 0 }) {
        balance
        outcomeTimeslot {
          beta
          tokenId
        }
      }
    }
  }

  query ($vfIntId: String!, $userId: ID!) {
    # ToDo: Once Graph starts using intId as the id,
    # revert to virtualFloor(id: $vfIntId)
    virtualFloors(where: { intId: $vfIntId }) {
      intId
      state
      outcomes {
        ...CommonOutcomeFields
      }
      winningOutcome {
        ...CommonOutcomeFields
      }
      winnerProfits
      bonusAmount
    }
    user(id: $userId) {
      roleUsers {
        role {
          id
        }
      }
    }
  }
`;

