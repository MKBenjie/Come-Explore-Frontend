import {React, useState, useEffect}  from 'react'
import AxiosInstance from './Axios'


const Home = () => {

    const [data, setData] = useState([])

    // const fetchData = () => {
    //     AxiosInstance.get(`path/`).then((response) => {
    //         setData(response.data)
    //     })
    // }

    // useEffect(() => {
    //     fetchData()
    // }, [])

    return (
        <div>
            This is Home Page
        </div>
    )
}

export default Home