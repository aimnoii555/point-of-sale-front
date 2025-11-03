const config = {
    path: 'http://localhost:3000',
    token_name: 'user_token',
    headers: () => {
        return {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user_token')
            }
        }
    }
}


export default config
