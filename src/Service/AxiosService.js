import axios from "axios"
export default class AxiosService {

    static handleGetQuery(statusQuery) {
        return new Promise((resolve, reject) => {
            axios.get(statusQuery).then((response) => {
                resolve(response)
            }).catch(error => reject(error))
        })
    }

    static handlePostQuery(apiLocation,data) {
        return new Promise((resolve, reject) => {
            axios.post(apiLocation,data).then((response) => {
                resolve(response)
            }).catch(error => reject(error))
        })
    }
}
