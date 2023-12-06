/**
 * @param {Object} credentials
 * @return {Promise<{success: boolean, error?: string} | Object<string, string>>} - might contain also extra params
 * considered as a reference and used in tariff fetching
 */
const authorise = async (credentials, params) => {
  return Promise.resolve({success: true});
};

/**
 * @param {Object} reference - contains extra properties of the returned value of authorise.
 * for e.g.: token, cookies etc
 * @return {Promise<{tariff: Object, reference_id?: string}>} - returns provider tariff object before
 * transformation to FlatPeak format
 */
const capture = async (reference, params) => {
  console.log(reference, params);
  if (!params?.state?.client_metadata?.schedule) {
    return Promise.resolve({success: false, error: 'Schedule is missing'});
  }
  return Promise.resolve({
    success: true,
    tariff: {
      ...params?.state?.client_metadata,
      timezone: params?.state?.timezone,
    },
  });
};

/**
 * @param {{schedule: FlatPeak.Tariff, contract_end_date}} input - Provider tariff object
 * @param reference_id - tariff reference id if exists, an account number for e.g.
 * @return {FlatPeak.Tariff} - converted tariff object
 */
const convert = (input) => {
  const {contract_end_date, schedule, timezone} = input;
  return {
    'object': 'tariff',
    'display_name': '',
    'integrated': false,
    'product_id': undefined,
    'timezone': timezone,
    'time_expiry': contract_end_date,
    'contract_end_date': contract_end_date,
    'import': [schedule],
    'export': [],
  };
};

module.exports = {
  capture, authorise, convert,
};
