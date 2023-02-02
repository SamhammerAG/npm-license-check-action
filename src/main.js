const core = require("@actions/core");
const licenseChecker = require("license-checker-rseidelsohn");
const padEnd = require("lodash/padEnd");
const foreach = require("lodash/forEach");
const argv = require('minimist')(process.argv.slice(2));

try {
  const licenseWhitelist = argv.licenseWhitelist ?? core.getInput("licenseWhitelist");
  const startPath = argv.path ?? core.getInput("path");
  
  licenseChecker.init(
    {
      start: startPath, 
      direct: 0,
      production: true,
      development: false,
      excludePrivatePackages: true,
      onlyAllow: licenseWhitelist
    },
    (error, packages) => {
      if (error) {
        throw error;
      } else {
        const headline = { name: "Package", licenses: "License Type" };

        // output calculations
        const metaData = { name: 0, licenses: 0 };
        foreach(packages, (package, name) => {
          metaData.name = Math.max(metaData.name, name.length, headline.name.length);
          metaData.licenses = Math.max(metaData.licenses, package.licenses.length, headline.licenses.length);
        });

        // output headline
        console.log(`| ${ padEnd(headline.name, metaData.name)} | ${padEnd(headline.licenses, metaData.licenses)} |`);
        console.log(`|-${ padEnd("", metaData.name,"-")}---${padEnd("", metaData.licenses, "-")}-|`);

        // output packages
        foreach(packages, (package, name) => {
          console.log(`| ${ padEnd(name, metaData.name)} | ${padEnd(package.licenses, metaData.licenses)} |`);
        });
      }
    }
  );
} catch (error) {
  core.setFailed(error.message);
}

