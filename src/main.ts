import * as core from "@actions/core";
import minimist from "minimist";
import licenseChecker, { ModuleInfos, ModuleInfo, InitOpts } from "license-checker-rseidelsohn";
import { padEnd, join } from "lodash";
import * as path from "path";
import * as fs from "fs";
import Mustache from "mustache";

const argv = minimist(process.argv.slice(2));

async function run(): Promise<void> {
  try {
    const allowedLicenses = argv.allowedLicenses ?? core.getInput("allowedLicenses");
    const packageDir = argv.packageDir ?? core.getInput("packageDir");
    const exportDir = argv.exportDir ?? core.getInput("exportDir");

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
        try {
          const data = await mapOutputData(infos);
          await output(data);

          if (exportDir) {
            await html(data, exportDir);
          }
        } catch (error: unknown) {
          core.setFailed((error as { message: string }).message);
        }
      }
    });
  } catch (error: unknown) {
    core.setFailed((error as { message: string }).message);
  }
}

async function output(data: ModuleOutput[]): Promise<void> {
  const headline = { name: "Package", license: "License Type" };

  // output calculations
  const metaData = { name: 0, license: 0 };
  for (const info of data) {
    metaData.name = Math.max(metaData.name, info.name.length, headline.name.length);
    metaData.license = Math.max(metaData.license, info.license.length, headline.license.length);
  }

  // output headline
  console.log(`| ${padEnd(headline.name, metaData.name)} | ${padEnd(headline.license, metaData.license)} |`);
  console.log(`|-${padEnd("", metaData.name, "-")}---${padEnd("", metaData.license, "-")}-|`);

  // output packages
  for (const info of data) {
    console.log(`| ${padEnd(info.name, metaData.name)} | ${padEnd(info.license, metaData.license)} |`);
  }
}

async function html(data: ModuleOutput[], outDir: string): Promise<void> {
  const outFile = path.join(outDir, "licenses.html");
  console.log("Exporting licenses to ", outFile);

  const templateFile = path.join(__dirname, "..", "export.mustache");
  const template: string = await fs.promises.readFile(templateFile, { encoding: "utf-8" });

  const output = Mustache.render(template, data);

  if (!fs.existsSync(outDir)) await fs.promises.mkdir(outDir), { recursive: true };
  await fs.promises.writeFile(outFile, output);
}

async function mapOutputData(infos: ModuleInfos): Promise<ModuleOutput[]> {
  const list: ModuleOutput[] = [];

  for await (const key of Object.keys(infos)) {
    const info = infos[key];

    const output = {
      name: key,
      license: getLicenseType(info),
      licenseText: await getLicenseText(info),
    };

    list.push(output);
  }

  return list;
}

async function getLicenseText(info: ModuleInfo): Promise<string> {
  if (info.licenseText) {
    return Promise.resolve(info.licenseText);
  }

  if (info.licenseFile) {
    return await fs.promises.readFile(info.licenseFile, { encoding: "utf-8" });
  }

  return Promise.resolve("");
}

function getLicenseType(info: ModuleInfo): string {
  return Array.isArray(info.licenses) ? join(info.licenses) : (info.licenses as string);
}

interface ModuleOutput {
  name: string;
  license: string;
  licenseText: string;
}

run();
