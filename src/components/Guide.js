import React from 'react';
import './Guide.css' 

const Guide = () => {
    const handleOnMouseMove = e => {
        const { currentTarget: target } = e;
    
        const rect = target.getBoundingClientRect(),
          x= e.clientX - rect.left,
          y= e.clientY - rect.top;
    
        target.style.setProperty("--mouse-x", `${x}px`)
        target.style.setProperty("--mouse-y", `${y}px`)
    }

    return (
        <div class="table-wrapper" onMouseMove={handleOnMouseMove}>
            <div class="table-border"></div>
            <div class="table-content">
                <div class="text-content">
                    <h2>OPERATORS</h2>
                    <p class="guide">
                        <b>& </b> for conjunction<br></br>
                        <b>| </b> for disjunction<br></br>
                        <b>~ </b> for negation<br></br>
                        <b>--&gt; </b> for conditional<br></br>
                        <b>&lt;-&gt; </b> for biconditional<br></br>
                    </p>
                    <hr></hr>
                    <h2 class="guide-title">GUIDE</h2>
                    <p class="guide">
                        To generate a truth table, semantic logic formula input must adhere to the rules of well formed formulas. 
                        The above characters are logical operators. Variables may be any letter of the alphabet from A-Z, case-sensitive.<br></br><br></br> 
                        <b>Example: </b> ((p&q)--&gt;r)
                    </p>
                </div>                
            </div>
        </div>
    );
};

export default Guide;