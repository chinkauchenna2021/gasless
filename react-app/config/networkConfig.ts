const networkConfig = {
  networkId: Number(process.env.NEXT_PUBLIC_NETWORK_ID!),
  subgraphEndpoint: process.env.NEXT_PUBLIC_GRAPHQL_QUERIES_URL!,
  platformContractAddress: process.env.NEXT_PUBLIC_PLATFORM_CONTRACT_ADDRESS!,
  dummyUsdcContractAddress: process.env.NEXT_PUBLIC_DUMMY_USDC_CONTRACT_ADDRESS!,
  vrfCoordinatorContractAddress: process.env.NEXT_PUBLIC_VRF_COORDINATOR_CONTRACT_ADDRESS!,
  rouletteContractAddress: process.env.NEXT_PUBLIC_ROULETTE_CONTRACT_ADDRESS!,
};

export default networkConfig;
