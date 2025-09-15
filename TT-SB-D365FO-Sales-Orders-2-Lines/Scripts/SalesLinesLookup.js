function createSalesLineLookup(salesLineMessageTT) {
  //console.log(salesLineMessageTT);

  let salesLineLookup = salesLineMessageTT.Payload.reduce(
    (a, v) => {
      let salesLineLookupKey = v.Id;
      let salesLineLookupValue = (({Id, SalesLineNumber, InvoiceId, ProformaInvoiceNumber, Status}) => ({Id, SalesLineNumber, InvoiceId, ProformaInvoiceNumber, Status}))(v);
  
      a[salesLineLookupKey] = salesLineLookupValue;
  
      return a;
    },
    {}
  );

  return salesLineLookup;
}

function createSalesLineLookup_LA() {
  console.error("Entering createSalesLineLookup_LA");

  let salesLineMessageTT = workflowContext.actions.Parse_SalesLines_Body_as_Json.outputs.body

  var salesLineLookup = createSalesLineLookup(salesLineMessageTT);

  console.log(salesLineLookup);

  console.warn("Exiting createSalesLineLookup_LA");

  return salesLineLookup;
}

function createSalesLineLookup_Test() {
  console.error("Entering createSalesLineLookup_Test");

  const fs = require("fs");

  fs.readFile(
    "TTSalesLineMessage-TTINT.json",
    "utf8",
    (err, salesLineMessageTTStr) => {
      if (err) {
        console.error(err);
        return;
      }

      // console.log(salesLineMessageTTStr);

      let salesLineMessageTT = JSON.parse(salesLineMessageTTStr);

      var salesLineLookup =
        createSalesLineLookup(salesLineMessageTT);

      //console.log(JSON.stringify(salesLineLookup));
      console.log(salesLineLookup);
    }
  );

  console.warn("Exiting createSalesLineLookup_Test");
}

if (typeof workflowContext !== "undefined" && workflowContext) {
  return createSalesLineLookup_LA();
} else {
  console.warn("Starting...");
  createSalesLineLookup_Test();
  console.warn("Done.");
}
