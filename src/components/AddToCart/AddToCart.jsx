import{ React, useState } from 'react';
import { Button } from 'antd';




const AddToCart =()=>{


    const [num,setNum]=  useState(0);
    
    const addCounter = ()=>{
        setNum(num+1);
    
    }

    const minusCounter = ()=>{
        // if(num==1){

        // }
        setNum(num-1);
    }
    const resetCounter = ()=>{
        setNum(0);
    }
    
    return (
        <div>
            <div>
            {num<=1 ? <Button type='primary' onClick={minusCounter}>Delet</Button> : <Button type='primary' onClick={minusCounter}>-</Button>
        }


             <span >
                {num}
            </span>
             <Button type='primary' onClick={addCounter}>+</Button>
             {/* <Button type='primary' onClick={resetCounter}>Reset</Button> */}
            </div>
        </div>
    )
}

export default AddToCart;