import _ from 'lodash';

const createDiffs = (primaryData, secondaryData = primaryData) => {
  const primaryKeys = Object.keys(primaryData);
  const secondaryKeys = Object.keys(secondaryData);
  const unitedKeys = _.uniq(primaryKeys.concat(secondaryKeys));

  return _.sortBy(unitedKeys)
    .flatMap((key) => {
      const primaryValue = primaryData[key];
      const secondaryValue = secondaryData[key];
      if (_.isObject(primaryValue) && _.isObject(secondaryValue)) {
        return {
          key,
          type: 'nested',
          value: createDiffs(primaryValue, secondaryValue),
        };
      }

      if (_.isEqual(primaryValue, secondaryValue)) {
        return {
          key,
          type: 'unchanged',
          value: primaryValue,
        };
      }

      if (!(_.has(secondaryData, key))) {
        return {
          key,
          type: 'removed',
          value: _.isObject(primaryValue) ? createDiffs(primaryValue) : primaryValue,
        };
      }

      if (!(_.has(primaryData, key))) {
        return {
          key,
          type: 'added',
          value: _.isObject(secondaryValue) ? createDiffs(secondaryValue) : secondaryValue,
        };
      }

      return (
        {
          key,
          type: 'updated',
          value: _.isObject(secondaryValue) ? createDiffs(secondaryValue) : secondaryValue,
          valueBefore: _.isObject(primaryValue) ? createDiffs(primaryValue) : primaryValue,
        }
      );
    });
};

export default createDiffs;
