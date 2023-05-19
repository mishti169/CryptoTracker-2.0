import{ React, useState } from 'react';
import { Button } from 'antd';




const Counter2 =()=>{


    const [num,setNum]=  useState(0);
    
    const addCounter = ()=>{
        setNum(num+1);
    
    }

    const minusCounter = ()=>{
        setNum(num-1);
    }
    const resetCounter = ()=>{
        setNum(0);
    }
    
    return (
        <div>
            <h1>
                {num}
            </h1>
            <div>
             <Button type='primary' onClick={addCounter}>Increment</Button>
             <Button type='primary' onClick={minusCounter}>Decrement</Button>
             <Button type='primary' onClick={resetCounter}>Reset</Button>
            </div>
        </div>
    )
}

export default Counter2;