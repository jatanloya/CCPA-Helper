const { record, right } = require("../models/record");

// const parseExcel = require("convert-excel-to-json");

// const result = parseExcel({
//   sourceFile: "./ispp-data.xlsx",
// });

// console.log(result);
async function populate() {
  const rtkObj = new right({
    exists: true,
    mechanism: "Form",
    url: "https://help.twitter.com/en/forms/privacy",
  });
  const rtdObj = new right({
    exists: true,
    mechanism: "Manual",
    url: "https://help.twitter.com/en/managing-your-account/how-to-deactivate-twitter-account",
  });
  const rtoObj = new right({
    exists: true,
    mechanism: "Manual",
    url: "https://optout.aboutads.info/",
    logo: true,
  });
  const recordObj = new record({
    comapny: "Twitter",
    mainURL: "https://twitter.com/",
    dateOfPolicy: Date.now(),
    policyURL: "https://twitter.com/en/privacy",
    CCPA: true,
    clicks: 2,
    //* Embedding Right Schema in Record Schema
    rtk: rtkObj,
    rtd: rtdObj,
    rto: rtoObj,
  });

  const result = await recordObj.save();
  console.log(result);
}
populate();
