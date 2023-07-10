import axios from "axios"

export async function getCommonUser(userId) {
    const { data } = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/railhub/secured/document/common-user/${userId}`)
    return data
}
