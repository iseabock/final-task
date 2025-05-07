const titleCaseToCamelCase = (titleCase: string) => {
  return titleCase.replace(/\b\w/g, (char) => char.toLowerCase());
};

export default titleCaseToCamelCase;
