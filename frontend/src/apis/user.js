import axios from 'axios'
const url = 'https://quizzie-mern-backend.vercel.app/api'

export const Userlogin = async ({email, password}) => {
    try{
        const reqUrl = `${url}/user/login`
        const response = await axios.post(reqUrl, {email, password})
        return response.data
    }
    catch(err){
        console.log(err);
    }
}

export const Userregister = async ({name, email, password, confirmPassword}) => {
    try{
        const reqUrl  = `${url}/user/register`
        const response = await axios.post(reqUrl, {name, email, password, confirmPassword})
        return response.data
    }
    catch(err){
        console.log(err);
    }
}