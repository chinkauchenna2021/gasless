import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { RouletteVirtualFloor } from "@doubledice/platform/lib/graph";
import { ROULETTE_SESSIONS_VIRTUALFLOOR } from "graphql/queries";
import { useRouter } from "next/router";
import { convertTimestampToDate } from "utils/helpers";

import * as SC from "./styles";

const ChooseVirtual = () => {
  const router = useRouter()
  const { tableId } = router.query;

  console.log({tableId});
  

  const [rouletteVf, setRouletteVf] = useState<RouletteVirtualFloor[]>([]);
  
  const { loading } = useQuery<{ rouletteVirtualFloors: RouletteVirtualFloor[] }>(ROULETTE_SESSIONS_VIRTUALFLOOR, {
    variables: {
      tableId: Number(tableId)
    },
    onCompleted(data) {
      if (data) {
        setRouletteVf(data.rouletteVirtualFloors);
        console.log(data)
      }
    },
    onError(error) {
      console.log(error);      
    },
  });    



  if (loading) {
    return <p>Loading...</p>;
  }  

  return (
    <SC.Container>
      <div>
        <SC.Title>Choose existent session</SC.Title>

        <SC.TableContainer>
          <table id="customers">
            <thead>
              <tr>
                <th>VirtualFloor ID</th>
                <th>State</th>
                <th>Pool Amount</th>
                <th>Starting Pot</th>
                <th>TOpen</th>
                <th>TResolve</th>
              </tr>
            </thead>

            <tbody>
              {rouletteVf.length > 0
                ? rouletteVf.map((vf, index) => (
                  <tr key={index} onClick={() => {
                    router.push(`/spin/${vf.intId}`);
                  }}>
                    <td>{vf.id}</td>
                    <td>{vf.state}</td>
                    <td>{vf.totalSupply}</td>
                    <td>{vf.bonusAmount}</td>
                    <td>{convertTimestampToDate(vf.tOpen)}</td>
                    <td>{convertTimestampToDate(vf.tResolve)}</td>
                  
                    {/* {renderActiveSpin(session.rouletteVirtualFloors)} */}
                  </tr>
                ))
                : "There are no active sessions"}
            </tbody>
          </table>
        </SC.TableContainer>

      </div>
      <SC.CreateNewSession
        onClick={() => {
          router.push("/createSession");
        }}>
        Create new Session
      </SC.CreateNewSession>
    </SC.Container>
  );
};

export default ChooseVirtual;
