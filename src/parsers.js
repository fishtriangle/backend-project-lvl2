import yaml from 'js-yaml';

export const parseJSON = (dataJSON) => (JSON.parse(dataJSON));
export const parseYAML = (dataYAML) => (yaml.load(dataYAML));
