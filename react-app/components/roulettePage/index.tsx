import { useQuery } from "@apollo/client";
import { RouletteVirtualFloor } from "../layouts/doubledice/platform/lib/graph";
import { ROULETTE_VIRTUALFLOOR } from "graphql/queries";
import { useRouter } from "next/router";

import RouletteLayout from "components/layouts/RouletteLayout";
import RouletteBetsManager from "components/layouts/RouletteLayout/RouletteBetsManager";
import RouletteMock from "components/layouts/RouletteLayout/RouletteMock";

const RoulettePage = () => {
  const router = useRouter()
  const { pid } = router.query;

  console.log({pid});

  const intId = pid
  
  
  const { loading, data, error } = useQuery<{ rouletteVirtualFloors: RouletteVirtualFloor[]}>(ROULETTE_VIRTUALFLOOR, {
    variables: { intId  },
    pollInterval: 1000,
    onCompleted: (data) => {
      console.log({ data });
    },
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  console.log({ data, error });
  
  
  return (
    <RouletteLayout>
      {
        data && data.rouletteVirtualFloors.length > 0 && (
          <>
            <RouletteMock virtualFloor={data.rouletteVirtualFloors[0]} />
            <RouletteBetsManager virtualFloor={data.rouletteVirtualFloors[0]} />
          </>
        )
      }
    </RouletteLayout>
  );
};

export default RoulettePage;
