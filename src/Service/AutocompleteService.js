import axios from "axios";

let api = `${process.env.REACT_APP_BASE_URL}/api/railhub/secured/autocomplete`;

export async function fetchAutocompleteOptions(
  inputValue,
  refDocCollection,
  fetchFields,
  queryFields,
  autoCompleteLimit,
  queryFilter
) {
  let data = {
    term: inputValue,
    documentTypeName: refDocCollection,
    fetchFields: fetchFields,
    queryFields: queryFields,
    limit: autoCompleteLimit,
    queryFilter: queryFilter
  };
  let response = await axios.post(api, data);
  return response;
}
