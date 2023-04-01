// import Input from 'antd/es/input/Input';
import {React,useState} from 'react';








const InputToH1 =()=>{
    const [inputVal, setInputVal] = useState('');

    const typeOnChange = (e)=>{
        setInputVal(e.target.value);
    }
    return(
        <div>
            <input placeholder='Type anything '  value={inputVal} onChange={typeOnChange}/>
            <h2>{inputVal}</h2>
        </div>
    )

}
export default InputToH1;