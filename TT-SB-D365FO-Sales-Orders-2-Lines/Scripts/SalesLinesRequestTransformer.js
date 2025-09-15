function transformTTSalesLineMessageToFOMessage(salesLineMessageTT) {
  let sourceID = salesLineMessageTT.SourceId;
  let payload = salesLineMessageTT.Payload.filter((p) => !["Exception", "Preview"].includes(p["Status"])).filter((p) => !(p.IsReversed || p.IsReversal));

  let foSalesLines = payload.map((p) => ({
      "dataAreaId": p["LegalEntity"],
      "HSGeneratorID": p["GeneratorId"],
      "HSWellClassification": p["WellClassification"],
      "HSSourceLocationID": p["SourceLocationFormattedIdentifier"],
      "LineNumber": p["SalesLineNumber"].split('-')[0].substring(5),
      "SalesLineID": p["Id"],
      "HSServiceTypeName": p["ServiceTypeName"],
      "DefaultLedgerDimensionDisplayValue": `${p["LegalEntity"]}-${p["Division"]}-${p["BusinessUnit"]}-${p["FacilitySiteId"]}`,
      "HSIsDow": p["DowNonDow"],
      "HSContentType": p["CutType"],
      "HSCutPercent": p["QuantityPercent"],
      "Text": p["ProductName"],
      "SalesPrice": p["Rate"],
      "SalesOrderNumber": p["ProformaInvoiceNumber"],
      "SalesOrderId": p["InvoiceId"] || p["HistoricalInvoiceId"],
      "HSMaterialApproval": p["MaterialApprovalNumber"],
      "HSSourceLocationTypeName": p["SourceLocationTypeName"],
      "LineAmount": p["TotalValue"],
      "ProductSizeId": p["Substance"],
      "HSBillOfLading": p["BillOfLading"],
      "ConfirmedShippingDate": p["TruckTicketDate"],
      "HSManifestNumber": p["ManifestNumber"],
      "ShippingWarehouseId": p["FacilitySiteId"],
      "HSGrossWeight": p["GrossWeight"],
      "SalesUnitSymbol": p["UnitOfMeasure"],
      "HSGeneratorName": p["GeneratorName"],
      "ShippingSiteId": p["FacilitySiteId"],
      "OrderedSalesQuantity": p["Quantity"],
      "ItemNumber": p["ProductNumber"],
      "HSSourceLocationTypeID": p["SourceLocationTypeId"],
      "RequestedShippingDate": p["TruckTicketDate"],
      "HSTareWeight": p["TareWeight"],
      "HSTruckingCompanyName": p["TruckingCompanyName"],
      "HSTicketNumber": p["TruckTicketNumber"],
      "HSServiceTypeID": p["ServiceTypeId"],
      "HSEffectiveDate": p["TruckTicketEffectiveDate"].split('T')[0]
  }));

  let foSalesLineEDIs = payload.map((p) => {
    let { Id: SalesLineId, EdiFieldValues } = p;

    EdiFieldValues = EdiFieldValues || [];

    let foSalesLineEDI = EdiFieldValues.reduce(
      (a, v) => {
        a[v["EDIFieldName"]] = v["EDIFieldValueContent"];
        return a;
      },
      { SalesLineId: SalesLineId }
    );

    return foSalesLineEDI;
  });

  foSalesLineEDIs = foSalesLineEDIs.filter(edi => Object.keys(edi).length > 1);

  let foSalesLineAttachments = payload.flatMap((p) => {
    let SalesLineId = p.Id;

    p.Attachments = p.Attachments || [];

    return p.Attachments.map((a) => ({
      "ContainerName": a.Container,
      "FileName": a.File,
      "BlobPath": a.Path,
      "FileId": a.Id,
      "Restriction": a.AttachmentType,
      "SalesLineId": SalesLineId
    }));
  });

  let foMessage = {
    "salesLineMessage": {
      SourceID: sourceID,
      SalesLines: foSalesLines,
      SalesLineEDI: foSalesLineEDIs,
      Attachments: foSalesLineAttachments
    }
  };

  return foMessage;
}

function transformTTSalesLineMessageToFOMessage_LA() {
  console.error("Entering transformTTSalesLineMessageToFOMessage_LA");

  let salesLineMessageTT = workflowContext.actions.Parse_SalesLines_Body_as_Json.outputs.body

  var salesLineMessageFO = transformTTSalesLineMessageToFOMessage(salesLineMessageTT);

  console.log(salesLineMessageFO);

  console.warn("Exiting transformTTSalesLineMessageToFOMessage_LA");

  return salesLineMessageFO;
}

function transformTTSalesLineMessageToFOMessage_Test() {
  console.error("Entering transformTTSalesLineMessageToFOMessage_Test");

  const fs = require("fs");

  fs.readFile(
    "TTSalesLineMessage-TTINT.json",
    "utf8",
    (err, salesLineMessageTTStr) => {
      if (err) {
        console.error(err);
        return;
      }

      let salesLineMessageTT = JSON.parse(salesLineMessageTTStr);
      var salesLineMessageFO = transformTTSalesLineMessageToFOMessage(salesLineMessageTT);
      let salesLineMessageFOStr = JSON.stringify(salesLineMessageFO, null, 2);
      
      console.log(salesLineMessageFOStr);
    }
  );

  console.warn("Exiting transformTTSalesLineMessageToFOMessage_Test");
}

if (typeof workflowContext !== "undefined" && workflowContext) {
  return transformTTSalesLineMessageToFOMessage_LA();
} else {
  console.warn("Starting...");
  transformTTSalesLineMessageToFOMessage_Test();
  console.warn("Done.");
}
