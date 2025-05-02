const camelCaseToTitleCase = (camelCase: string) => {
  if (!camelCase) {
    return '';
  }

  const result = camelCase
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (match: string) => match.toUpperCase())
    .trim();

  return result;
};

export default camelCaseToTitleCase;
