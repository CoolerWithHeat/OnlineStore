import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { SidebarButton, Custom_HighEnd_Button, ThirdWindow, ChatForm } from './components';

const DisplayDimension = (ReducingTimeAmount) => ((window.screen.height) / 100 ) * ReducingTimeAmount
// const DisplayDimension = (ReducingTimeAmount) => ((window.screen.height) / 100 ) * ReducingTimeAmount

function FlexibleSideBar(){

    const DeviceHeight = window.screen.height
    // const processedDimension = ( DeviceHeight > 900 ) ? DisplayDimension(80) : DisplayDimension(80)
    const processedDimension = DisplayDimension(50)
    const BarStyle = {minHeight: `${processedDimension}px`}
    const Bar = document.getElementById("wrapper")
    

    const SidebarStatusindex = {
        true: 'is-open',
        false: 'is-closed',
    }

    const [isClosed, setIsClosed] = useState([false, SidebarStatusindex[false]]);

    const handleClick = () => {
        
    setIsClosed((Initial)=>{
        const NewState = [!isClosed[0], SidebarStatusindex[!isClosed[0]]];
        return NewState;
    });

    document.getElementById("wrapper").classList.toggle("toggled");

    };
    React.useEffect(Main=>{
        document.getElementById("wrapper").classList.toggle("toggled")
    }, [])
    return (
        <div style={BarStyle} id="wrapper">

            {/* <div className="overlay">

            </div> */}
                
                    {/* <!-- Sidebar --> */}
                <nav  className="navbar navbar-inverse fixed-top" id="sidebar-wrapper" role="navigation">

                    <div id='MainSideBarWrapper'>


                        <div id='Window1'>

                            <SidebarButton index={1}/>  
                            <SidebarButton index={2}/>
                            <SidebarButton Animate={true} index={3}/>
                            
                        </div>

                        {/* <div id='Window2'></div>     */}
                        
                        <div id='Window3'>

                            <div id='ChatBoxWrapper'>
                            <ChatForm/> 
                            </div>

                            <Custom_HighEnd_Button/>

                        </div>

                    </div>  

                </nav>


                <div id="page-content-wrapper">
                        
                    <button onClick={handleClick} type="button" className={`hamburger animated fadeInLeft ${isClosed[1]}`} data-toggle="offcanvas">
                        
                        <span className="hamb-top"></span>
                        <span className="hamb-middle"></span>
                        <span className="hamb-bottom"></span>

                    </button>

                </div>


        </div>

    )
}


export default FlexibleSideBar;