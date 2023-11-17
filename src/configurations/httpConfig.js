let BASE_URL = "https://ej0t9qbga6.execute-api.us-west-1.amazonaws.com/";
let env = "prod";
// let env="dev";


export const httpRequest = async (type, path, payload) => {
    let url = BASE_URL + env + "/" + path;
    if (type === "get") {
        axios.get(url)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                console.log(error)
            });
    } else if (type === "post") {
        await axios.post(url, payload)
    }
}