import axios from 'axios';

export default () => {
    const token  = window.localStorage.getItem('token');

    return axios.create({
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        },
        baseURL: 'https://devdeskq.herokuapp.com/'
    })
}