import React from "react";
import Chart from "react-apexcharts";
import "./index.css";

/**
 * This function calculates the amount of shares per category of posts.
 * @param {*} payees An array of walletAddresses.
 * @param {*} shares An array of numbers used to track the amount of shares.
 * @returns An array which contains the amount of shares per category of posts.
 */
function createDataForChart(payees, shares) {
  let amountOfOriginals = 0;
  let amountOfReshares = 0;
  let amountOfRemixes = 0;
  let amountOfPublisher = 0;

  for (let i = 0; i < payees.length; i++) {
    if (i === payees.length - 1) {
      amountOfPublisher = Number(shares[i]) / (1 * Math.pow(10, 18));
    } else {
      if (Number(shares[i]) / (1 * Math.pow(10, 18)) === 5) {
        amountOfOriginals += 5;
      } else if (Number(shares[i]) / (1 * Math.pow(10, 18)) === 4) {
        amountOfRemixes += 4;
      } else if (Number(shares[i]) / (1 * Math.pow(10, 18)) === 2) {
        amountOfReshares += 2;
      }
    }
  }

  // Alle shares van Original, Reshare en Remix + altijd 20% voor de publisher
  return [
    amountOfOriginals,
    amountOfReshares,
    amountOfRemixes,
    amountOfPublisher,
  ];
}

/**
 * This component displays a pie diagram of the shares per category of posts.
 * @param {*} props Contains the passed variables.
 * @returns The render components of the PopupWrapperLayout component.
 */
function RoyaltieSplitDiagram(props) {
  return (
    <React.Fragment>
      <h3>Pie Chart of Royaltysplit:</h3>
      <Chart
        options={{
          labels: ["Original", "Reshare", "Remix", "Publisher"],
          colors: ["#bf1f13", "#1391bf", "#41b037", "#8f246b"],
          legend: {
            fontSize: "20px",
            fontFamily: "PT Mono",
            fontWeight: 400,
            labels: {
              colors: ["#FFFFFF"],
            },
          },
        }}
        series={createDataForChart(props.payees, props.shares)}
        type="pie"
        width="500"
      />
    </React.Fragment>
  );
}

export default RoyaltieSplitDiagram;
