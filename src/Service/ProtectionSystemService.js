import axios from "axios"

export const getAdditionalProtectionSystem = async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/railhub/secured/fields/additionalprotectionsystem`)
    return data
}