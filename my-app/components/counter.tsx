"use client";
import React, {useState} from "react";


const Counter = () => {

    const [count, setCount] = useState(0);


    const decrement = () =>  setCount( prev => prev - 1);  
    const increment = () =>  setCount( prev => prev + 1);

    const reset = () => {
        setCount(0);
    }
        
    

    

    return(
        <div style = {{textAlign: 'center', padding: '2rem'}}>
            <h1> Counter : {count}</h1>
            <div style = {{display: 'flex', justifyContent: 'center', gap: '1rem'}}>
                <button onClick={decrement}>-</button>
                <button onClick={reset}>Reset</button>
                <button onClick={increment}>+</button>
            </div>
        </div>
    )
}

export default Counter;