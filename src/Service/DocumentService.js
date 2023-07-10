import axios from "axios";


export async function propertyUnique(
  documentTypeName,
  property,
  value,
  objectId
) {
  let baseurl = `${process.env.REACT_APP_BASE_URL}/api/railhub/secured/documents?collectionName=${documentTypeName}&fields[]={%22name%22:%22${property}%22,%22filter%22:%22${value}%22%20}${objectId ? `&fields[]={"name":"_id","filter":"${objectId}" , "operator": "ne"}`: ""}`;
  let result = await axios.get(baseurl);
  return result;
}
export async function getDocuments(queryParams) {
  const baseUrl = `${process.env.REACT_APP_BASE_URL}/api/railhub/secured/documents`;
  let path = baseUrl;
  if (queryParams) {
    path += `?${queryParams}`;
  }
  let result = await axios.get(path);
  return result;
}
