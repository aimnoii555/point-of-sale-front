const config = {
    path: 'https://pos-service.deekrub.com',
    token_name: 'user_token',
    token: ()=> {
        return localStorage.getItem('user_token')
    },
    headers: () => {
        return {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user_token')
            }
        }
    }
}


export default config
