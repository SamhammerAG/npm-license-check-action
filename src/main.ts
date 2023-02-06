import * as core from "@actions/core";
import minimist from "minimist";
import licenseChecker, { ModuleInfos, ModuleInfo, InitOpts } from "license-checker-rseidelsohn";
import { forEach, padEnd, join } from "lodash";

const argv = minimist(process.argv.slice(2));

async function run(): Promise<void> {
  try {
    const allowedLicenses = argv.allowedLicenses ?? core.getInput("allowedLicenses");
    const packageDir = argv.packageDir ?? core.getInput("packageDir");

    const options: InitOpts = {
      start: packageDir,
      direct: 0 as unknown as boolean,
      production: true,
      development: false,
      excludePrivatePackages: true,
      onlyAllow: allowedLicenses,
    };

    licenseChecker.init(options, async (error, infos: ModuleInfos) => {
      if (error) {
        throw error;
      } else {
        await output(infos);
      }
    });
  } catch (error: unknown) {
    core.setFailed((error as { message: string }).message);
  }
}

async function output(infos: ModuleInfos): Promise<void> {
  const headline = { name: "Package", license: "License Type" };

  // output calculations
  const metaData = { name: 0, license: 0 };
  forEach(infos, (info, name) => {
    metaData.name = Math.max(metaData.name, name.length, headline.name.length);
    metaData.license = Math.max(metaData.license, getLicense(info).length, headline.license.length);
  });

  // output headline
  console.log(`| ${padEnd(headline.name, metaData.name)} | ${padEnd(headline.license, metaData.license)} |`);
  console.log(`|-${padEnd("", metaData.name, "-")}---${padEnd("", metaData.license, "-")}-|`);

  // output packages
  forEach(infos, (info, name) => {
    console.log(`| ${padEnd(name, metaData.name)} | ${padEnd(getLicense(info), metaData.license)} |`);
  });
}

function getLicense(info: ModuleInfo): string {
  return Array.isArray(info.licenses) ? join(info.licenses) : info.licenses as string;
}

run();
