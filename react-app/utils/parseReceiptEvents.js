const parseReceiptEvents = (contractInterface, receipt) =>
  receipt.logs.reduce(
    (eventsObj, currLog) => {
      try {
        const log = contractInterface.parseLog(currLog);
        console.info("parsed log >>>", log);
        eventsObj[log.name] = log.args;
      } catch (error) {
        eventsObj.unknownEvents.push(currLog);
      }
      return eventsObj;
    },
    { unknownEvents: [] }
  );

export default parseReceiptEvents;
