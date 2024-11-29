import { pgSchema } from "drizzle-orm/pg-core";
import path from "path";

export const generateSchema = () => {
  const schemaName = getSchemaName();

  return pgSchema(schemaName);
};

const getSchemaName = () => {
  const originalFunc = Error.prepareStackTrace;

  let callerFile: string;
  try {
    const err = new Error();
    Error.prepareStackTrace = (_, stack) => stack;
    callerFile = (
      err.stack as unknown as NodeJS.CallSite[]
    )[2].getFileName() as string;
  } finally {
    Error.prepareStackTrace = originalFunc;
  }

  const parentDirPath = path.dirname(callerFile);
  const grandParentDirPath = path.dirname(parentDirPath);
  const schemaName = path.basename(grandParentDirPath);
  return schemaName;
};
