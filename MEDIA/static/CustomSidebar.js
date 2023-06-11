import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import { SidebarButton, Custom_HighEnd_Button, ThirdWindow, ChatForm, ProfileWindow, ProductCard, SidebarProductCard, NoPayloadSignal, BottomLine, GetCartProducts } from './components';
import { useSelector, useDispatch } from "react-redux";
import { CartProducts } from './features/counter/ReduxBase';
import { GetHost, Get_Static_Url } from './components';
function UISideBar(){
    
    const CurrentAnimationNeededButton = useSelector(Main=>Main.SideBarButtons.BtnID)

    const SocketProtocol = window.location.protocol == "https:" ? 'wss://' : 'ws://'
    const socket = new WebSocket(SocketProtocol + GetHost(false) + '/chat/')
    const bottomize = {bottom:"0", position:"fixed", width:"89%",}
    function Supportwindow(){
        var [UserText, Update_UserText] = React.useState('')
    
        socket.onmessage = BaseData=>{

        }
        
        
        const OnChangeHandler = (Base)=>{
            Update_UserText(Initial=>Base.target.value)
        }
        const SendToSocket = ()=>{
            socket.send(JSON.stringify({UsersText: UserText}))
        }

        return (
            
            <div>
                
                <div id='ChatBoxWrapper'>   
                    <ChatForm/> 
                </div>

                    <div id={ 'inputField' }>

                        <input onChange={OnChangeHandler} id='TypeBox' type={"text"}/>

                        <button onClick={SendToSocket} type="submit" id="CustomBootstrap">
                            <img id="TextingButtonImage" src={Get_Static_Url('/send_ICON.png')}/>
                        </button>

                    </div>

                </div>

        )

    }

    function SidebarCart(){
        // keys: id title price description image_url TrashIcon
        // GetCartProducts()
        const DispatchHandler = CartProducts.actions.UpdateButtonState
        const UpdateCartProducts = useDispatch(DispatchHandler)
    
        async function RequestData(){
            const request = await fetch("http://127.0.0.1:8000/GetUsersCardProducts/")
            const rawData = await request.json()
            UpdateCartProducts(DispatchHandler(rawData.result))
            return rawData.result
        }
        
        React.useEffect(Main=>{
            
            async function RequestData(){
                const request = await fetch("http://127.0.0.1:8000/GetUsersCardProducts/")
                const rawData = await request.json()
                UpdateCartProducts(DispatchHandler(rawData.result))
                return rawData.result
            }
            RequestData()
        
        }, [])

        const Products = useSelector(Main=>Main.UserCartProducts.Products)
        const TrashIcon = useSelector(Main=>Main.UserCartProducts.TrashIcon)
        
        const processedProducts = Products.map(each=><SidebarProductCard TrashIcon={TrashIcon} title={each.title} id={each.id} key={each.id} price={each.price} description={each.description} image_url={each.image} gpu={each.GPU_details} cpu={each.CPU_details} panel={each.Panel_details} ram={each.RAM_details}/>)
       
        return (

            <div id='SidebarCart'>
                {processedProducts}
                <BottomLine/>
            </div>

        )
    }

    const WindowIndexes = {

        1: <SidebarCart/>,
        2: <ProfileWindow/>,
        3: <Supportwindow/>

    }

    return (
        <Menu>
            
            <div id='Window1'>

                <SidebarButton index={1}/>  
                <SidebarButton index={2}/>
                <SidebarButton Animate={true} index={3}/>

            </div>

            <div id='Window3'>

                {WindowIndexes[CurrentAnimationNeededButton]}

            </div>

            {/* </div>   */}
        </Menu>
);
}

export default UISideBar;