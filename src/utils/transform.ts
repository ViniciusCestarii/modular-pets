export const fileToBase64 = async (file: File): Promise<string> => {
  const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");

  return base64;
};

export const fileToBase64Url = async (file: File): Promise<string> => {
  const base64 = await fileToBase64(file);
  const url = `data:${file.type};base64,${base64}`;

  return url;
};
