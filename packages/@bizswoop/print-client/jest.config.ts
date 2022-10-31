import type { Config } from "@jest/types";
import { pathsToModuleNameMapper } from "ts-jest";

const { compilerOptions } = require("./tsconfig.json");

const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testEnvironment: "node",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/src",
  }),
};

export default config;
