import axios from "axios";

export async function migrate(migrationHandler, documentId, schema) {
    let obj = {
        "migrationHandler" : migrationHandler,
        "documentId" : documentId,
        "schema": schema
    }

    let baseurl = `${process.env.REACT_APP_BASE_URL}/api/railhub/secured/migrate/document`;
    let result = await axios.post(baseurl, obj);
    return result;
}

