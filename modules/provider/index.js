/**
 * @param {Object} credentials
 * @return {Promise<{success: boolean, error?: string} | Object<string, string>>} - might contain also extra params
 * considered as a reference and used in tariff fetching
 */
const isValidAuthMetadata = async (credentials) => {
  return Promise.resolve({success: false, error: 'Not implemented'});
};

/**
 * @param {Object} reference - contains extra properties of the returned value of isValidAuthMetadata.
 * for e.g.: token, cookies etc
 * @return {Promise<{tariff: Object, reference_id?: string}>} - returns provider tariff object before
 * transformation to FlatPeak format
 */
const fetchTariffFromProvider = async (reference) => {
  return Promise.resolve({success: false, error: 'Not implemented'});
};

/**
 * @param tariff - Provider tariff object
 * @param reference_id - tariff reference id if exists, an account number for e.g.
 * @return {FlatPeak.Tariff} - converted tariff object
 */
const adoptProviderTariff = ({tariff, reference_id}) => {
  throw new Error('Not implemented');
};

module.exports = {
  fetchTariffFromProvider, isValidAuthMetadata, adoptProviderTariff
};
