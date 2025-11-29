import chalk from "chalk";

export const BUILD_LOGGER = {
  ON_STARTING: ({
    actionName,
    atFolder = "'dist'",
    typeDirect = "folder",
    textDirectAction = "to",
    textDirectFolder = "at"
  }: {
    /**
     * @default
     * undefined
     */
    actionName: string;
    /**
     * @default
     * "'dist'"
     */
    atFolder?: string;
    /**
     * @default
     * "to"
     */
    textDirectAction?: string;
    /**
     * @default
     * "at"
     */
    textDirectFolder?: string;
    /**
     * @default
     * "folder"
     */
    typeDirect?: string;
  }) => {
    console.log(
      chalk.bold(
        `🕧 ${chalk.cyanBright(
          "Starting"
        )} ${textDirectAction} ${chalk.underline.blueBright(
          actionName
        )} ${textDirectFolder} ${chalk.italic.underline.whiteBright(
          atFolder
        )} ${typeDirect}.`
      )
    );
  },
  ON_FINISH: ({
    actionName,
    count,
    typeCount = "file",
    atFolder = "'dist'",
    typeDirect = "folder",
    textDirectFolder = "at"
  }: {
    /**
     * @default
     * undefined
     */
    actionName: string;
    /**
     * @default
     * "'dist'"
     */
    atFolder?: string;
    /**
     * @default
     * "file"
     */
    typeCount?: string;
    /**
     * @default
     * undefined
     */
    count: number;
    /**
     * @default
     * "at"
     */
    textDirectFolder?: string;
    /**
     * @default
     * "folder"
     */
    typeDirect?: string;
  }) => {
    console.log(
      chalk.bold(
        `✅ ${chalk.greenBright("Success")} ${chalk.underline.blueBright(
          actionName
        )} (${chalk.yellowBright(
          `${count} ${typeCount}${count > 1 ? "(s)" : ""}`
        )}) ${textDirectFolder} ${chalk.italic.underline.whiteBright(
          atFolder
        )} ${typeDirect}.`
      )
    );
  },
  ON_SKIPPING: ({
    actionName,
    reasonEndText,
    reasonSkipAction = "nothing left",
    reasonTitle = "because",
    reasonType = "files",
    atFolder = "'dist'",
    typeDirect = "folder",
    textDirectAction = "to",
    textDirectFolder = "at"
  }: {
    /**
     * @default
     * undefined
     */
    actionName: string;
    /**
     * @default
     * "because"
     */
    reasonTitle?: string;
    /**
     * @default
     * "nothing left"
     */
    reasonSkipAction?: string;
    /**
     * @default
     * undefined
     */
    reasonEndText: string;
    /**
     * @default
     * "'dist'"
     */
    atFolder?: string;
    /**
     * @default
     * "files"
     */
    reasonType?: string;
    /**
     * @default
     * "to"
     */
    textDirectAction?: string;
    /**
     * @default
     * "at"
     */
    textDirectFolder?: string;
    /**
     * @default
     * "folder"
     */
    typeDirect?: string;
  }) => {
    console.log(
      chalk.bold(
        `⚠️  ${chalk.yellowBright("Skipping")} ${chalk.underline.blueBright(
          actionName
        )} ${chalk.white(reasonTitle)} ${chalk.redBright(
          reasonSkipAction
        )} ${reasonType} ${textDirectFolder} ${chalk.italic.underline.whiteBright(
          atFolder
        )} ${typeDirect} ${textDirectAction} ${chalk.dim.redBright(reasonEndText)}.`
      )
    );
  },
  ON_ERROR: ({
    actionName,
    atFolder = "'dist'",
    typeDirect = "folder",
    textDirectAction = "to",
    textDirectFolder = "at",
    error
  }: {
    /**
     * @default
     * undefined
     */
    actionName: string;
    /**
     * @default
     * "to"
     */
    textDirectAction?: string;
    /**
     * @default
     * "at"
     */
    textDirectFolder?: string;
    /**
     * @default
     * "'dist'"
     */
    atFolder?: string;
    /**
     * @default
     * "folder"
     */
    typeDirect?: string;
    error: unknown;
  }) => {
    console.error(
      chalk.bold(
        `❌ ${chalk.redBright("Error")} ${textDirectAction} ${chalk.underline.blueBright(
          actionName
        )} ${textDirectFolder} ${chalk.cyan(
          atFolder
        )} ${typeDirect}, because: \n\n > ${chalk.inverse.red(error)}`
      )
    );
  },
  ON_PROCESS_COPY: ({
    actionName,
    count,
    copyTo,
    copyFrom,
    textFrom = "from",
    textArrow = "➔"
  }: {
    /**
     * @default
     * undefined
     */
    actionName: string;
    /**
     * @default
     * undefined
     */
    count: number;
    /**
     * @default
     * "from"
     */
    textFrom?: string;
    /**
     * @default
     * undefined
     */
    copyFrom: string;
    /**
     * @default
     * undefined
     */
    copyTo: string;
    /**
     * @default
     * "in"
     */
    textArrow?: string;
  }) => {
    console.log(
      `${chalk.bold("   >")} ${chalk.italic(
        `${chalk.white(count + ".")} ${chalk.white(actionName)} ${chalk.yellow(
          textFrom
        )} '${chalk.bold.underline.cyanBright(copyFrom)}' ${chalk.bold.gray(
          textArrow
        )} '${chalk.bold.underline.cyanBright(copyTo)}'.`
      )}`
    );
  },
  ON_PROCESS: ({
    actionName,
    count,
    nameDirect,
    textDirectFolder = "in"
  }: {
    /**
     * @default
     * undefined
     */
    actionName: string;
    /**
     * @default
     * undefined
     */
    count: number;
    /**
     * @default
     * "in"
     */
    textDirectFolder?: string;
    /**
     * @default
     * undefined
     */
    nameDirect: string;
  }) => {
    console.log(
      `${chalk.bold("   >")} ${chalk.italic(
        `${chalk.white(count + ".")} ${chalk.white(actionName)} ${chalk.magentaBright(
          textDirectFolder
        )} ${chalk.bold.underline.blue(nameDirect)}.`
      )}`
    );
  },
  ON_PROCESS_REFERENCING: ({
    actionName,
    count,
    referenceTo,
    referenceFrom,
    textFrom = "from",
    textArrow = "➔"
  }: {
    /**
     * @default
     * undefined
     */
    actionName: string;
    /**
     * @default
     * undefined
     */
    count: number;
    /**
     * @default
     * "from"
     */
    textFrom?: string;
    /**
     * @default
     * undefined
     */
    referenceFrom: string;
    /**
     * @default
     * undefined
     */
    referenceTo: string;
    /**
     * @default
     * "➔"
     */
    textArrow?: string;
  }) => {
    console.log(
      `${chalk.bold("   >")} ${chalk.italic(
        `${chalk.white(count + ".")} ${chalk.white(actionName)} ${chalk.magentaBright(
          textFrom
        )} ${chalk.bold.underline.cyanBright(referenceFrom)} ${chalk.bold.gray(
          textArrow
        )} ${chalk.bold.underline.blueBright(referenceTo)}.`
      )}`
    );
  }
} as const;
