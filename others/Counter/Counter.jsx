import{ React, useState } from 'react';
import { Button } from 'antd';




const Counter =()=>{


    const [num,setNum]=  useState(0);
    
    const addCounter = ()=>{
        setNum(num+1);
    
    }
    
    return (
        <div>
             <Button type='primary' onClick={addCounter}>Counter {num}</Button>
        </div>
    )
}

export default Counter;