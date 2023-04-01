import {React, useState, useEffect} from 'react';
import axios from 'axios';
 


const RestCountries = ()=>{
    // console.log('hiii')
    const [countryNames, setCountryNames] = useState([""])

    const getData =  async()=>{
        const {data} = await axios.get("https://restcountries.com/v3.1/all");
// console.log(data)

const countryNames = data.map((currentCountry)=>{
return currentCountry.name.common;

})
 setCountryNames(countryNames);
 console.log(countryNames)
    }

useEffect(()=>{
    getData();

}, []);

    return (
        <div>getting api data
            <h3>{countryNames}</h3>
        </div>
    )
}
export default RestCountries;