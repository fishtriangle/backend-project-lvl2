import yaml from 'js-yaml';

const parsers = {
  json: (dataJSON) => (JSON.parse(dataJSON)),
  yml: (dataYAML) => (yaml.load(dataYAML)),
  yaml: (dataYAML) => (yaml.load(dataYAML)),
};

const parseData = (data, dataType) => {
  const object = parsers[dataType] ? parsers[dataType](data) : parsers.json(data);
  return object;
};

export default parseData;
