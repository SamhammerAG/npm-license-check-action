const core = require("@actions/core");
const licenseChecker = require("license-checker-rseidelsohn");
const join = require("lodash/join");

try {
  const licenseWhitelist = core.getInput("licenseWhitelist");

  licenseChecker.init(
    {
      start: ".",
      direct: true,
      production: true,
      development: false,
      excludePrivatePackages: true,
      onlyAllow: licenseWhitelist      
    },
    (error, packages) => {
      if (error) {
        throw error;
      } else {
        throw new Error(`license check failed on packages: ${join(Object.keys(packages), ";")}`);
      }
    }
  );
} catch (error) {
  core.setFailed(error.message);
}
