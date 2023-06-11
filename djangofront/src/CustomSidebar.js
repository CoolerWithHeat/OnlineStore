import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import { SidebarButton, Custom_HighEnd_Button, ThirdWindow, ChatForm, ProfileWindow, ProductCard, SidebarProductCard, NoPayloadSignal, BottomLine, GetCartProducts } from './components';
import { useSelector, useDispatch } from "react-redux";
import { CartProducts, SupportStaffClients, ProfileInfo } from './features/counter/ReduxBase';
import { GetHost, Get_Static_Url, CreateChatDialog } from './components';
import { json } from 'react-router-dom';
import ReconnectingWebSocket from 'reconnecting-websocket';
    
function UrlParseForClients(url){
    const data = url.split('/AdminChatBox/').slice(-1)[0].split('/')[0]
    const Client = data.split('CW').slice(0)[0]
    const Staff = data.split('CW').slice(1)[0].split('/')[0]
    return [Client, Staff]
}

function UISideBar(){
    const socketRef = React.useRef(null);
    const CurrentAnimationNeededButton = useSelector(Main=>Main.SideBarButtons.BtnID)
    const MessagesPath = SupportStaffClients.actions.UpdateMessages
    const AddToExistingBase = SupportStaffClients.actions.UpdateExistingMessages
    const dispatch = useDispatch()
    const SocketProtocol = window.location.protocol == "https:" ? 'wss://' : 'ws://'


    function Supportwindow(){
        const SendButton = React.useRef()
        function sendToSocket() {
            const userInput = document.getElementById('TypeBox').value;
            if (userInput) {

                socketRef.current.send(JSON.stringify({ UsersText: userInput, token: localStorage.getItem('WebKey') }));
                document.getElementById('TypeBox').value = null
            }
        }


        React.useEffect(Main=>{

            const socket = new ReconnectingWebSocket(SocketProtocol + GetHost(false) + 'chat/' + `token=${localStorage.getItem('WebKey')}`)
            
            socket.onmessage = (BaseData)=>{
                
                const response = JSON.parse(BaseData.data)
                
                if (response.status == 500){
                    window.location.pathname = '../login'
                }
    
                const UserKey = response.TempID ? localStorage.setItem('TempID', response.TempID) : null
                
                if (!response.TempID){
                    if (response.message){
                        const processedData = {id: response.id, SenderID: response.SenderID, SenderImage: response.SenderImage, SenderIsStaff: response.SenderIsStaff, StaffImage: response.StaffImage, message:response.message, sender:response.sender}
                        dispatch(AddToExistingBase(processedData))
       
                    }
                }
    
            }
            
            socketRef.current = socket;
            const handleKeyPress = (event) => {

                if (event.key == 'Enter'){
                    SendButton.current.click()
                }
                
            };
            
            document.addEventListener('keydown', handleKeyPress);
            return () => {
                socket.close();
            };
            
    
    
            
    
        }, [])

        return (
            
            <div>
                
                <div id='ChatBoxWrapper'>   
                    <ChatForm/> 
                </div>

                    <div id={ 'inputField' }>

                        <input id='TypeBox' type="text"/>

                        <button ref={SendButton} onClick={sendToSocket} id="CustomBootstrap">
                            <img id="TextingButtonImage" src={Get_Static_Url('/media/send_ICON.png')}/>
                        </button>

                    </div>

            </div>

        )

    }

    function SidebarCart(){
        // keys: id title price description image_url TrashIcon
        // GetCartProducts()
        const DispatchHandler = CartProducts.actions.UpdateButtonState
        const UpdateCartProducts = useDispatch()
    
        async function RequestData(){
            const request = await fetch("http://127.0.0.1:8000/GetUsersCardProducts/", {headers: {Authorization: `Token ${localStorage.getItem('WebKey')}`}})
            const rawData = await request.json()
            UpdateCartProducts(DispatchHandler(rawData.result))
            return rawData.result
        }
        
        React.useEffect(Main=>{
            async function RequestData(){

                const request = await fetch("http://127.0.0.1:8000/GetUsersCardProducts/", {headers: {Authorization: `Token ${localStorage.getItem('WebKey')}`}})
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
                <br/>
                <br/>
            </div>

        )
    }

    const WindowIndexes = {

        1: <SidebarCart/>,
        2: <ProfileWindow/>,
        3: <Supportwindow/>,
        
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