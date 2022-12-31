#!/bin/sh

set -e

echo "🎲🎲 Generating AssemblyScript Graph entity wrappers..."
npx hardhat compile # to generate ./generated/abi/*.json
mkdir --verbose --parents ./subgraph/generated
rm -f ./subgraph/generated/*
cat ./generated/abi/DoubleDiceProtocol.json | jq 'del(.[] | select(.type == "error"))' > ./subgraph/generated/DoubleDiceProtocol.no-custom-errors.json
cat ./generated/abi/ClassicDoubleDiceApp.json | jq 'del(.[] | select(.type == "error"))' > ./subgraph/generated/ClassicDoubleDiceApp.no-custom-errors.json
cat ./generated/abi/RandomDoubleDiceApp.json | jq 'del(.[] | select(.type == "error"))' > ./subgraph/generated/RandomDoubleDiceApp.no-custom-errors.json
cat ./generated/abi/RouletteDoubleDiceApp.json | jq 'del(.[] | select(.type == "error"))' > ./subgraph/generated/RouletteDoubleDiceApp.no-custom-errors.json
npx envsub --protect --env-file .env ./subgraph/subgraph.template.yaml ./subgraph/generated/subgraph.yaml
npx envsub --protect --env-file .env ./subgraph/assemblyscript/env.template.ts ./subgraph/generated/env.ts
npx graph codegen ./subgraph/generated/subgraph.yaml

echo "🎲🎲 Generating TypeScript GraphQL response wrappers..."
mkdir -pv ./lib/generated
cat ./subgraph/schema.preamble.graphql ./subgraph/schema.graphql > ./lib/generated/schema.graphql
graphql-codegen --config ./subgraph/graphql-codegen.yml
