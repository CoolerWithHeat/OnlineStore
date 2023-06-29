import React from "react";
import {CustomCounterBase, FetchedProductsBase, AnimatedButtonStates, SideBarButtonsState} from './features/counter/ReduxBase';
import { useSelector, useDispatch } from "react-redux";
import { CartProducts, ProductsBase, ResultProductsBase, SupportStaffClients, ProfileInfo } from "./features/counter/ReduxBase";
import { RecaptchaVerifier, updateProfile } from "firebase/auth";
import { Link, json } from "react-router-dom";
import { slide } from "react-burger-menu";
import ReconnectingWebSocket from 'reconnecting-websocket';
import $ from 'jquery';
window.jQuery = $;
window.$ = $;


var host;
export const Get_Static_Url = (filename)=>{
    host = window.location.host
    return window.location.protocol + '//' + host + filename
}

export function GetHost(WithProtocol=true){
    if (WithProtocol){
        return window.location.protocol + '//' + window.location.host
    }else{
        return window.location.host   
    }
}

export function GetCartProducts(){
    const DispatchHandler = CartProducts.actions.UpdateButtonState
    const UpdateCartProducts = useDispatch(DispatchHandler)

    async function RequestData(){
        const request = await fetch(GetHost()+"/GetUsersCardProducts/")
        const rawData = await request.json()
        UpdateCartProducts(DispatchHandler(rawData.result))
        return rawData.result
    }

    RequestData()

    return true
}

export function NoPayloadSignal(MessageProperties){

    return (
        
        <div id="PayloadAbsence">

            <h4 id="PayloadText">{MessageProperties.message}</h4>
            
        </div>

    )

}

const GetSearchKey = ()=>{
    
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const product = urlParams.get('Search')

    if (product == ' ')
        window.location.href = '../Main/'
        urlParams.delete('Search')
    if (product)
        return product
    else
        return ''

}

export function SearchField(){
    const SearchButton = React.useRef()
    var [InputFocused, Update_InputFocus] = React.useState(false) 
    const inputData = GetSearchKey()
    const products = useSelector(Main=>Main)
    const DispatchHandler = ResultProductsBase.actions.StoreProducts
    const UpdateCartProducts = useDispatch()

    async function GetProducts(){
        const Keyword = inputData[0] == ' ' ? inputData.substring(1) : inputData
        const request = await fetch(GetHost()+`/GetFilteredData/${inputData ? Keyword : ' '}/`)
        const requestResult = await request.json()
        UpdateCartProducts(DispatchHandler(requestResult.result))

    }

    function AddRequestDataToUrl(){
        
        const RequestedKeyword = document.getElementById("SearchFieldInput").value

        if (RequestedKeyword){
            const url_Parameter = new URL(window.location.protocol + '//' + window.location.host + '/');
            url_Parameter.searchParams.append('Search', RequestedKeyword);
            window.location.href = url_Parameter.search
        }

        else{

            window.location.href = '../Main/'
        }
    }

    React.useEffect(Main=>{

        const handleKeyPress = (event) => {

            if (event.key == 'Enter'){
                const currentElement = document.getElementById('SearchFieldInput')
                const in_actives = document.activeElement
                if (currentElement === in_actives)
                    SearchButton.current.click()
            }
            
        };

        document.addEventListener('keydown', handleKeyPress);
        if (!(GetSearchKey() == ' ')){
            GetProducts()
        }

    }, [])
    
    return (

        <div id="SearchBar">
            
            <input defaultValue={inputData} type={"text"} id='SearchFieldInput'/>
            
            <button ref={SearchButton} onClick={AddRequestDataToUrl} id="SearchButton"><img id="SeachButtonLoop" src="https://djangostaticfileshub.s3.eu-north-1.amazonaws.com/SearchLoop_ICON.png"/></button>

        </div>

    )

}   

export function ErrorMessage(){
    
    return (<div id="ErrorWindow">
        <h5 id="ErrorText">Unfortunately, Payment Systems not fully Integrated Yet</h5>
    </div>)

}

export function BottomLine(){

    const Bottom_Line = useSelector(Main=>Main.UserCartProducts.BottomLine)
    function Redirect(url){
        window.location.pathname = `../${url}/`
    }
    if(Bottom_Line > 0)
        return (
            <button onClick={()=>Redirect('Payment')} id="BottomLine">Pay off: ${Bottom_Line}</button>
        )
    
    return (
            <button id="BottomLine">Not Products Yet</button>
        )    
}

export function ProfileWindow(){
    const ProfileUpdatePath = ProfileInfo.actions.Save_Prifile_Infos
    const ProfileInfos = useSelector(Main=>Main.Profile.ProfileDetails)
    const dispatch = useDispatch()
    
    async function GetProfileDetails(){
        const request = await fetch(GetHost()+'/Authentication_Check/', {headers: {Authorization: `Token ${localStorage.getItem('WebKey')}`}})
        if (request.status == 200){
            const request = await fetch(GetHost()+'/Get_UserInfo/', {
                method: 'GET',
                headers: {Authorization: `Token ${localStorage.getItem('WebKey')}`}
            })
            if (request.status==200){
                const parsedData = await request.json()
                dispatch(ProfileUpdatePath(parsedData.response))
            }
        }
        else{
            window.location.pathname = '../login'
        }
    }
    
    async function getStyle(){
        let obj = await import('./ProfileWindowStyles.scss');
    }

    function Logout(){
        localStorage.removeItem('WebKey')
        setTimeout(() => {
            if (!localStorage.getItem('WebKey'))
                window.location.pathname = 'login/'
        }, 111);
    }
    
    React.useEffect(Main=>{
        
        GetProfileDetails()
        getStyle()

    }, [])

    const Style = {width:'60px', height:'60px', borderRadius:'50%',}
    const SmallerText = {fontSize: 'smaller'}
    const BiggerText = {fontSize: '18px'}
    
    return (
        <div id="login-container">

            <div className="profile-img">
                <img style={Style} src={ProfileInfos.image_url}/>
            </div>
            
            <h1>
                Profile
            </h1>

            <div className="description">
                <ul style={BiggerText}>{ProfileInfos.email}</ul>
                <br/>
                <br/>
                <ul style={SmallerText}>Purchased products: 0</ul>
                <ul style={SmallerText}>Balance: 0</ul>
                <br/>   
            </div>

            
            <button onClick={Logout}>Log Out</button>

        </div>
    )
}

export function SidebarButton(BtnProperties){

    const CurrentAnimationNeededButton = useSelector(Main=>Main.SideBarButtons.BtnID)
    const dispatch = useDispatch()
    let letKnowRedux = SideBarButtonsState.actions.UpdateButtonState
    const Animate = {backgroundColor:'#ffffff', animation: "squashstretch 1.4s ease-in-out 0s infinite alternate"}

    const btnIndexes = {

        1: <img id='CartIcon' src='https://djangostaticfileshub.s3.eu-north-1.amazonaws.com/Cart_ICON.png'/>,
        2: <img id='UserIcon' src='https://djangostaticfileshub.s3.eu-north-1.amazonaws.com/user_ICON.png'/>,
        3: <img id='SupportIcon' src='https://djangostaticfileshub.s3.eu-north-1.amazonaws.com/support_ICON.png'/>,
        
    }
    

    function ChangeState(){
        dispatch(letKnowRedux(BtnProperties.index))
    }

    return (

        <button onClick={ChangeState} style={CurrentAnimationNeededButton == BtnProperties.index ? Animate : null } id={`SideBarButton_${BtnProperties.index}`}>
            {btnIndexes[BtnProperties.index]}
        </button>

    )

}

export function ErrorWindow(WindowProperties){
    return (
        <div id="ErrorWindow">
            <h5>{WindowProperties.text}</h5>
        </div>
    )
}

export function SidebarProductCard(ProductProperties){

    const DispatchHandler = CartProducts.actions.UpdateButtonState
    const UpdateCartProducts = useDispatch(DispatchHandler)
    
    async function getStyle(){
        let obj = await import('./SideBarProductsStyles.scss');
    }

    getStyle()
    const DeleteStyle = {cursor: "pointer"};
    const TitleStyle = {fontSize:"22px"};
    const PriceStyle = {fontSize:"18px", position:"absolute", bottom:'0', right:'30%'};

    

    const host = window.location.host == "localhost:3000" ? "http://127.0.0.1:8000/" : window.location.host
    const image_url = ProductProperties.image_url
    const TrashIcon = ProductProperties.TrashIcon
    
    const RemoveRequestHandler = (id)=>{

        async function RequestStatus(){

            const request = await fetch(GetHost()+`/AdjustCartProducts/0/${id}/`, {method:"POST", headers: {Authorization: `Token ${localStorage.getItem('WebKey')}`}})
            
            if (request.status == 200){ 
            
                async function RequestData(){
                    const request = await fetch(GetHost()+"/GetUsersCardProducts/", {headers: {Authorization: `Token ${localStorage.getItem('WebKey')}`}})
                    const rawData = await request.json()
                    UpdateCartProducts(DispatchHandler(rawData.result))
                    return rawData.result
                }

                RequestData()

            }

        }
        RequestStatus()

    }
    return (        
        //keys: id title price description image_url
        <div className="wrapper">
            <div className="container">
                <div className="top">
                    <img width="100%" height="85%" src={image_url}></img>
                </div>

                <div className="bottom">
                    
                    <div className="left">  
                        <div className="details">
                        <h1 style={TitleStyle}>{ProductProperties.title}</h1>
                        <p style={PriceStyle}>${ProductProperties.price}</p>
                    </div>

                    <div onClick={()=>RemoveRequestHandler(ProductProperties.id)} style={DeleteStyle} className="buy">
                        <img width={'88px'} height={'88px'} src={TrashIcon}></img>
                    </div>

                </div>

                <div className="right">
                    <div className="done"><i className="material-icons">done</i></div>
                    <div className="details">
                    <h1>Chair</h1>
                    <p>Added to your cart</p>
                    </div>
                    <div className="remove"><i className="material-icons">clear</i></div>
                </div>

                </div>
            </div>
            <div className="inside">
                <div className="icon">
                    <i className="material-icons">Specs</i>
                </div>
                
                <div className="contents">

                <ProductDetailsLayer text={ProductProperties.cpu} type={"cpu"}/>
                <ProductDetailsLayer text={ProductProperties.gpu} type={"gpu"}/>
                <ProductDetailsLayer text={ProductProperties.ram} type={"ram"}/>
                <ProductDetailsLayer text={ProductProperties.panel} type={"panel"}/>

                </div>
            </div>
        </div>
    )
}

export function Navbar(){
    
    const stateIndex = {
        true: {backgroundColor:"white"},
        false: {backgroundColor:"transparent"},
    }

    const focusStyle = {backgoundColor:""}
    const [CartState, UpdateCartState] = React.useState([false, {backgroundColor:""}])
    const Redirect = (Link) => window.location.href = `/${Link}`;

    const ButtonStateChange = () => UpdateCartState(()=>{
        const newState = [!CartState[0], stateIndex[!CartState[0]]]

        return newState
    }

    )

    return (

            <div id="NavBarMain">
                
                <button id="navbarOption"><a id="MainLink">Contact</a></button>
                <button onClick={()=>Redirect("Home/")} id="navbarOption"><a id="MainLink">Home</a></button>
                <button className="btn btn-primary" onClick={ButtonStateChange} style={CartState[1]} id="NavbarCart">
                    
                    <img id="NavbarCartIconArrow" src="https://djangostaticfileshub.s3.eu-north-1.amazonaws.com/LeftArrow_ICON.png"/>
                    <img id="NavbarCartIcon" src="https://djangostaticfileshub.s3.eu-north-1.amazonaws.com/cartMain_ICON.png"/>
                
                </button>
                
                {CartState[0] ? <NavbarCartMenu/> : null}
            </div>
    
    )

}

export function CustomCounter(){
    
    const CurrentValue = useSelector((Base) => Base.AdvancedCounter.CurrentValue)
    const AddIn = CustomCounterBase.actions.Add_Or_ByFixedAmount
    const AddOff = CustomCounterBase.actions.SubtractOne

    const DispathAction = useDispatch()

    function PerformingAction(isPositive){
        
        return DispathAction(AddIn([15, isPositive]))

    }

    return (

        <div id="main">
            
            <div onClick={()=>PerformingAction(true)} id="LeftButton">+</div>
                <div id="ValueHolder">  {CurrentValue}  </div>
            <div onClick={()=>PerformingAction(false)} id="RightButton">-</div>

        </div>

    )

}

export function ProviderButton(BtnProperties){

    return (            
        
        <div id="ButtonWindow">
                
            <button id="AuthButton"><img id="ProviderButtonImage" src="https://cdn-icons-png.flaticon.com/512/2504/2504739.png"/></button>
            <button id="AuthButton"><img id="ProviderButtonImage" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1024px-Facebook_Logo_%282019%29.png"/></button>

        </div>
        )

}

export function Custom_HighEnd_Button(btnProps){

    const style = {width:`${btnProps.width}px`}

    const bottomize = {bottom:"0", position:"fixed", width:"89%",}
    
    return (

        <div id={ btnProps.bottom ? "FocusedTypingExperience" : 'inputField'}>

            <input id='TypeBox' type={"text"}/>

            <button type="submit" id="CustomBootstrap">
                <img id="TextingButtonImage" src={GetHost()+"/media/send_ICON.png"}/>
            </button>

        </div>

    )
} 

export function ThirdWindow(){
    return (

        <div id="ThirdWindow">

        </div>

    )
}

export function AnimatedButton(ButtonProps){
    var [btnState, UpdateBtnState] = React.useState({text:"Add To Card", loading:false}) 
    const CartAddRequestLink = (id)=>GetHost()+`/AdjustCartProducts/1/${id}/`
    const ProductId = ButtonProps.id
    const DispatchMethodHandler = CartProducts.actions.UpdateButtonState
    const dispatch = useDispatch()

    var DefaultState = {

        TriggerClassName:[false, ""],
        CurrentButtonText: 'Add To Card',
        
    }

    const StateIndexes = {

        false: 'fa',
        true : "fa fa-spinner fa-spin",

    };

    const StatusText = {

        true: "Adding",
        false: "Done!",

    }
    
    function resetButton(){
        UpdateBtnState(Initial=>{

            const PreparedState = {text:"Add To Card", loading:false};
            return PreparedState;

        })
    }

    function ButtonStateText(){
        return (

            <div id='CardMessage'>

                {btnState.loading ? <img id="CartMessageImage" src={GetHost()+'/media/ShoppingCart.png/'}/> : null}

                <p id="CartMessageText">{btnState.text}</p>

            </div>

        )
    }

    function ChangeState(ProductId){
        
        const ProductEndpoint = CartAddRequestLink(ProductId)

        async function AddToCart(){ 
            const Authentication_Check = await fetch(GetHost()+"/Authentication_Check/", {
                headers: {Authorization: `Token ${localStorage.getItem('WebKey')}`}
            })
            if (Authentication_Check.status == 200){
                const request = await fetch(ProductEndpoint, {
                    method:"POST",
                    headers: {Authorization: `Token ${localStorage.getItem('WebKey')}`} 
                })
                const requestResponse = await request.json()
                dispatch(DispatchMethodHandler(requestResponse.products))
            }
            else{
                window.location.pathname = '../login'
            }
            
        }

        AddToCart()


        UpdateBtnState(Initial=>{
            
            const PreparedState = {text:'loading', loading:true};
            return PreparedState;
            
    
            }) 
        
        setTimeout(() => {

            UpdateBtnState(Initial=>{
            
                const PreparedState = {text:'success!', loading:false};

                return PreparedState;
                
        
                })  

        }, 999);
    
        setTimeout(() => {
            resetButton()
        }, 1999);
    
}
    

    return (

        <button onClick={()=>ChangeState(ButtonProps.id)} className="AnimatedButton">
            {btnState.text == "success!" ? <img id="CartMessageImage" src={GetHost()+"/media/ShoppingCart.png"}/> : null}
            <span>{btnState.text}</span><i className={StateIndexes[btnState.loading]}></i>
        </button>

    )

}



function GetProducts(single=false, id=0){

    const dispatch = useDispatch()
    const AddtoProducts = FetchedProductsBase.actions.UpdateProducts
    const API_endpoint = GetHost()+`/GetProducts/${single ? id : "all"}`;


    
    React.useEffect(Main=>{

        const request = fetch(API_endpoint).then(Main=>Main.json().then(Actual=>{
            const Products = Actual.products
            dispatch(AddtoProducts(Products))
        }))

    }, [])


    const products = useSelector(Main=>Main.ProductsBase.RawProducts)
    

}

export function ProductCard(CardProperties){

    const title = CardProperties.title
    const price = Number(CardProperties.price)
    const image_url = CardProperties.image
    const SlashedPrice = true;

    const [state, setState] = React.useState('idle');

    const onClickHandler = ()=>{
        
        setState("loading")

        setTimeout(() => {
            setState("success")
        }, 555);
        
    }

    const btnStyle = {}


    return (

            <div id="Card">
                
                <img id="CardImage" src={image_url}/>

                <div id="ProductOverallDescription">

                    <div id="TitleLocation"><p>{title}</p></div>

                    <div id="PriceFieldLocation">
                        
                        <p id="PriceTagSlashed">${price+179}</p>

                        <p id={SlashedPrice ? "PriceTag" : "PriceTagWithoutSlashedPrice"}>${price}</p>

                    </div>
                
                </div>

                <ProductDetailsLayer text={CardProperties.cpu} type={"cpu"}/>
                <ProductDetailsLayer text={CardProperties.gpu} type={"gpu"}/>
                <ProductDetailsLayer text={CardProperties.ram} type={"ram"}/>
                <ProductDetailsLayer text={CardProperties.panel} type={"panel"}/>
                

                <AnimatedButton id={CardProperties.id}/>

                

            </div>

    )

}


export function ChatTypingForm(){
    return (
        <div id='inputField'>
            <input id="TypeBox" type="text"/>
            <button type="button" class="btn btn-warning">Warning</button>
        </div>
    )
}


export function ProductDetailsLayer(LayerProperties){

    const component_adressed = {

        cpu: "https://djangostaticfileshub.s3.eu-north-1.amazonaws.com/cpu_ICON.png",
        gpu: "https://djangostaticfileshub.s3.eu-north-1.amazonaws.com/gpu_ICON.png",
        ram: 'https://djangostaticfileshub.s3.eu-north-1.amazonaws.com/ram_ICON.png',
        panel: 'https://djangostaticfileshub.s3.eu-north-1.amazonaws.com/display1080_ICON.png',

    }

    return (

        <div id="EachDetail">

            <div id="ImageClosure">
                
                <img id="PCComponentIcons" src={component_adressed[LayerProperties.type]} /> 

            </div>
            
            <div id="TextClosure">

                <p id="DetailsText">{LayerProperties.text}</p>
                
            </div>


        </div>

    )

}

export function ChatDialog(FormProperties){

    const imageSide = FormProperties.Side == 'left' ? 'ProfileImageLeft' : 'ProfileImageRight'
    const image_url = FormProperties.image_url
    const text = FormProperties.text
    const style = {
        ProfileImageLeft: {
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            padding: '4px',
            borderColor: 'rgb(196, 145, 145)',
            borderWidth: '1px',
            float: 'left',
            backgroundPosition: 'center',
          },
          ProfileImageRight: {
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            padding: '4px',
            borderColor: 'rgb(196, 145, 145)',
            borderWidth: '1px',
            float: 'right',
            backgroundPosition: 'center',
          },
          TextPlace: {
            padding: '5px',
            paddingLeft: '6px',
            paddingBottom: '10px',
            overflowY: 'visible',
            color: 'white',
            fontSize: '15px',
          },
          DiologElement: {
            width: '200px',
            minHeight: '60px',
            borderRadius: '5px',
            backgroundColor: FormProperties.staff ? 'rgb(255, 99, 71)' : 'rgb(66, 59, 59)',
          },
    }
    const side = 'ProfileImage-' + FormProperties.Side

    const Htmlcode = <div style={style['DiologElement']} id="DialogElement">
                        <div id="imageFrame">
                            <img style={style[imageSide]} width="50px" height="50px" src={image_url}/>
                            <p id="TextPlace" style={style['TextPlace']}>{text}</p>
                        </div>
                    </div>

    return Htmlcode
}

export function ChatForm(FormProperties){
    var BoxReference = React.useRef(null)
    const Messages = useSelector(Main=>Main.SupportStaff_Clients.AllMessages)
    const MessagesPath = SupportStaffClients.actions.UpdateMessages
    const ProfileInformation = useSelector(Main=>Main.Profile.ProfileDetails)
    const dispatch = useDispatch()
    const ChatLog = Messages.map((EachElement)=><ChatDialog Side={EachElement.SenderID == localStorage.getItem('TempID') ? 'left' : 'right'} staff={EachElement.SenderIsStaff} text={EachElement.message} image_url={EachElement.SenderIsStaff ? EachElement.StaffImage : EachElement.SenderImage}/>)    
    
    function ScrollDownToBottom(){
        const ChatlogFrame = BoxReference.current
        if (ChatlogFrame)
            ChatlogFrame.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
    }
    
    async function GetMessages(){

        var chatMessages = await fetch(GetHost()+'/GetClientMessages/'+localStorage.getItem('TempID'), {
            method:'GET',
            headers: {Authorization: `Token ${localStorage.getItem('WebKey')}`}
        })

        const ParsedMessages = await chatMessages.json()
        if (chatMessages.status == '200')
            dispatch(MessagesPath(ParsedMessages.response))

    }
    
    React.useEffect(()=>{
        
        GetMessages()

    }, [])

    React.useEffect(Main=>ScrollDownToBottom())

    return (
        
        <div className="container">

            <div className={FormProperties.focused ? "content-wrapperAltered" : "content-wrapper"}>

                {/* <!-- Row start --> */}
                <div className="row gutters">

                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">

                        <div className="card m-0">

                            <div className="row no-gutters">

                                <div className="col-xl-8 col-lg-8 col-md-8 col-sm-9 col-9">
                                    <div className="chat-container">
                                        <ul ref={BoxReference} className="chat-box chatContainerScroll">
                                            
                                            {ChatLog.length == 0 ? <NoPayloadSignal message={'any questions?'}/> : ChatLog }
                                            
                                        <br/>
                                        <br/>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- Row end --> */}
                        </div>

                    </div>

                </div>
                {/* <!-- Row end --> */}

            </div>
            {/* <!-- Content wrapper end --> */}

        </div>
    )
}





export function LeftSideMessage(MessageProperties){
    const MessageCondition = {
        left:   <li className="chat-left">
                    <div className="chat-avatar">
                        <img src="https://www.bootdey.com/img/Content/avatar/avatar3.png" alt="Retail Admin"/>
                        <div className="chat-name">Russell</div>
                    </div>
                    <div className="chat-text">Hello, I'm Russell.
                        <br/>How can I help you today?</div>
                    <div className="chat-hour">08:55 <span className="fa fa-check-circle"></span></div>
                </li>,


    right:  <li className="chat-right">
                <div className="chat-hour">08:56 <span className="fa fa-check-circle"></span></div>
                <div className="chat-text">Hi, Russell
                    <br/> I need more information about Developer Plan.</div>
                <div className="chat-avatar">
                    <img src="https://www.bootdey.com/img/Content/avatar/avatar3.png" alt="Retail Admin"/>
                    <div className="chat-name">Sam</div>
                </div>
            </li>
    }
    return MessageCondition[MessageProperties.side]
}

function Admin_Inidicator_Button(ButtonProperties){

    const MessagedUsers = useSelector(Main=>Main.SupportStaff_Clients.MessagedUsers)
    const Base_Path = SupportStaffClients.actions.UpdateClickedButton
    const ClickedBtn = useSelector(Main=>Main.SupportStaff_Clients.ClickedButtonID)
    const clicked = ClickedBtn == ButtonProperties.id
    const dispatch = useDispatch()
    const messaged = MessagedUsers.includes(ButtonProperties.id)
    const Indicator_style = {backgroundColor: messaged ? 'yellow' : 'blue'}
    
    const ChangeState = ()=>{

        dispatch(Base_Path(ButtonProperties.id))
        localStorage.setItem('SocketID', ButtonProperties.id)
        window.location.pathname = `${window.location.pathname+String(ButtonProperties.id)}CW${localStorage.getItem('StaffID')}/`
        
    }

    React.useEffect(Main=>{

        const Mail_Icon_code = 'mail_icon' 
        
        async function GetBackendData(){
            const url = GetHost()+`/GetIcon/${Mail_Icon_code}/`
            const request = await fetch(url)
            const response = await request.json()

        }
        GetBackendData()
        
    })
    
    return (

        <div>
            <div onClick={ChangeState} id="IndicatorStyle" style={Indicator_style}>
                <p id="InidicatorText">User {ButtonProperties.id}</p>
            </div>  
        </div>

    )

}


export function ConsumerChatDialog(ElementProperties){
    const RightSide =    <div class="d-flex flex-row p-3">
                            <div class="bg-white mr-2 p-3"><span class="text-muted">Hello and thankyou for visiting .</span></div>
                            <img src="https://img.icons8.com/color/48/000000/circled-user-male-skin-type-7.png" width="30" height="30"/>
                        </div>
    
    const LeftSide =    <div class="d-flex flex-row p-3">
                            <img src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-7.png" width="30" height="30"/>
                            <div class="chat ml-2 p-3">Hello and thankyou for visiting. Please click the video above</div>
                        </div>
    return (
        ElementProperties.Side == 'left' ? LeftSide : RightSide
    )   
}

export function CreateChatDialog(side, first_name=null, last_name=null, image_url=null, message=null, Custom=false){
    async function getConsumerChatStyles(){
        
        await import('./ConsumerChatStyles.css');
        
    }
    getConsumerChatStyles()
    if (side == 'right')
        return  <li className="in">
                    <div className="chat-img">
                        <img alt="Avtar" src={image_url}/>
                    </div>
                    <div className="chat-body">
                        <div className="chat-message">
                            <h5>{first_name} {last_name}</h5>
                            <p>{message ? message : 'No Message'}</p>
                        </div>
                    </div>
                </li>
    else
        return  <li className="out">
                    <div className="chat-img">
                        <img alt="Avtar" src={image_url}/>
                    </div>
                    <div className="chat-body">
                        <div className="chat-message">
                            <h5>{first_name} {last_name}</h5>
                            <p>{message ? message : 'No Message'}</p>
                        </div>
                    </div>
                </li>
}


export function StaffClientsMonitor(ComponentProperties){

    var SocketReference = React.useRef(null)
    const chatBoxRef = React.useRef(null);
    const SocketProtocol = window.location.protocol == "https:" ? 'wss://' : 'ws://'
    const dispatch = useDispatch()
    const MessagesPath = SupportStaffClients.actions.UpdateMessages
    const Add_To_ExistingMessages = SupportStaffClients.actions.UpdateExistingMessages    
    const AllMessages = useSelector(Main=>Main.SupportStaff_Clients.AllMessages)

    const scrollChatBoxToBottom = () => {
        if (chatBoxRef.current) {
            const chatBoxElement = chatBoxRef.current;
            chatBoxElement.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
        }
      };

    async function GetMessages(){

        var chatMessages = await fetch(GetHost()+'/GetClientMessages/'+localStorage.getItem('ConnectingClient'), {
            method:'GET',
            headers: {Authorization: `Token ${localStorage.getItem('WebKey')}`}
        })

        const ParsedMessages = await chatMessages.json()
        if (chatMessages.status == '200')
            dispatch(MessagesPath(ParsedMessages.response))

    }

    function UrlParseForClients(url){
        const data = url.split('/AdminChatBox/').slice(-1)[0].split('/')[0]
        const Client = data.split('CW').slice(0)[0]
        const Staff = data.split('CW').slice(1)[0].split('/')[0]
        return [Client, Staff]
    }

    function GetUserID(){
        const url = window.location.pathname
        const clients = UrlParseForClients(url)
        localStorage.setItem('Client', clients[0])
        localStorage.setItem('Staff', clients[1]) 
        return clients[0]
    }

    async function getStyle(){
        
        await import('./AdminChatStyles.css');
        
    }

    const ClickedID = GetUserID()

    const processedMessages = AllMessages.map(Each=>{
        const ClientID = localStorage.getItem('ConnectingClient')
        return CreateChatDialog(Each.SenderID == ClientID ? 'left' : 'right', Each.sender, null, Each.SenderIsStaff ? Each.StaffImage : Each.SenderImage, Each.message)
    })

    function SendDataToSocket(){
        const userInput = document.getElementById('TypeBox').value
        if (userInput) {
            SocketReference.current.send(JSON.stringify({message: userInput, SenderToken:localStorage.getItem('WebKey')}))
            document.getElementById('TypeBox').value = null
        }
    }
    
    React.useEffect(Main=>{
        
        var socket = new ReconnectingWebSocket(SocketProtocol + GetHost(false) + '/SupportStaff/' + `${localStorage.getItem('Client')}CW${localStorage.getItem('Staff')}/token=${localStorage.getItem('WebKey')}`)
    
        socket.onmessage = (data) => {
            
            const response = JSON.parse(data.data)
            
            if (!response.StaffTempID && !response.TempID){
                const processedData = {id: response.id, SenderID: response.SenderID, SenderImage: response.SenderImage, SenderIsStaff: response.SenderIsStaff, StaffImage: response.StaffImage, message:response.message, sender:response.sender}
                dispatch(Add_To_ExistingMessages(processedData))
            }
        }

        SocketReference.current = socket;

        getStyle()
        GetMessages()
        const handleKeyPress = (event) => {

            if (event.key == 'Enter'){
                const SendButton = document.getElementById('CustomBootstrap') 
                SendButton.click()
            }
            
        };
        
        document.addEventListener('keydown', handleKeyPress);
    }, [])

    React.useEffect(()=>{


        scrollChatBoxToBottom();


    }, [AllMessages])

    return ( 
        <>
            <div className="container content">
                <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                        <div className="card">
                        
                            <div className="card-header">Admin Chat</div>
                            
                            <div className="card-body height3">
                                <ul ref={chatBoxRef} id="ChatBox" className="chat-list">
                                    {processedMessages.length == 0 ? <NoPayloadSignal message='No Previous Messages'/> : processedMessages}
                                <br/>
                                <br/>
                                </ul>
                            </div>


                            
                        </div>
                    </div>
                </div>


            </div>
            <div id={ 'inputFieldSupport' }>

                <input id='TypeBox' type={"text"}/>

                <button onClick={SendDataToSocket} type="submit" id="CustomBootstrap">
                    <img id="TextingButtonImage" src={GetHost()+'/media/send_ICON.png'}/>
                </button>

            </div>
        </>
    )
}

export function AdminChatBox(WindowProperties){

    localStorage.removeItem('SocketID')

    const ClientID_base = useSelector(Main=>Main.SupportStaff_Clients.Client_IDs)
    const Trigger = useSelector(Main=>Main.SupportStaff_Clients.SendTriggered)
    const MessagedUsers = useSelector(Main=>Main.SupportStaff_Clients.MessagedUsers)
    const Base_Path = SupportStaffClients.actions.UpdateClients
    const UpdateText = SupportStaffClients.actions.UpdateStaffText
    const MessagedUsersBase = SupportStaffClients.actions.Update_Messaged_Users
    const TriggerSend = SupportStaffClients.actions.TriggerSend
    const ClickedID = useSelector(Main=>Main.SupportStaff_Clients.ClickedButtonID)

    const dispatch = useDispatch()

    async function getStyle(){
        
        await import('./AdminChatStyles.css');
        
    }

    const Id_buttons  = ClientID_base.map(EachID=><UserThread id={EachID}/>)

    const StaffBaselink = GetHost()+'/getSupportClients/'

    async function GetStaffClients(){

        const response = await fetch(StaffBaselink, {
            method: "GET",
            headers: {'Authorization': `Token ${localStorage.getItem('WebKey')}`}
        });
        
        const DatabaseCheck = await response.json()

        localStorage.setItem('StaffID', DatabaseCheck.StaffId)
        dispatch(Base_Path(DatabaseCheck.clients))

    }

    React.useEffect(Main=>{

        GetStaffClients()
        
        const SocketProtocol = window.location.protocol == "https:" ? 'wss://' : 'ws://'
        const socket = new ReconnectingWebSocket(SocketProtocol+GetHost(false)+'/ClientsMonitor/' + `token=${localStorage.getItem('WebKey')}`)
    
        socket.onmessage = (WebsocketResponse) => {
            const response = JSON.parse(WebsocketResponse.data)    
            if (!response.StaffTempID){
                
                dispatch(MessagedUsersBase(response.Messaged_User_ID))

            }

        }


        getStyle()

    }, [])

    React.useEffect(Main=>{

    }, [MessagedUsers])



    return (
        <>
            <div className="container content">

                <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                        <div className="card">
                        
                            <div className="card-header">Admin Chat</div>
                            
                            <div className="card-body height3">
                                {Id_buttons}    
                            </div>
                            
                        </div>
                    </div>
                </div>


            </div>
        </>
    )

}

export function SeperateContactMode(){
    return (
        <div id="MoreFocusedChat">

            <ChatForm focused={true}/>
            <Custom_HighEnd_Button bottom={true}/>

        </div>
    )
}

function CartItemForm(ItemProperties){

    const DispatchHandler = CartProducts.actions.UpdateButtonState
    const UpdateCartProducts = useDispatch(DispatchHandler)

    async function RequestData(){
        const request = await fetch(GetHost()+'/GetUsersCardProducts/', {
            method:"GET",
            headers: {'Authorization': `Token ${localStorage.getItem('WebKey')}`} 
        })
        const rawData = await request.json()
        UpdateCartProducts(DispatchHandler(rawData.result))
        return rawData.result
    }

    const image_url = ItemProperties.image_url
    const RemoveFromCart = (id)=>{console.log(id, " removed from database!")}

    const RemoveRequestHandler = (id)=>{
        const link = GetHost()+`/AdjustCartProducts/0/${id}/`
        async function RequestStatus(){
            const request = await fetch(link, {
                method:"POST",
                headers: {'Authorization': `Token ${localStorage.getItem('WebKey')}`} 
            })
            if (request.status == 200){
                RequestData()
            }

        }
        RequestStatus()

    }

    return (

        <div id="CartItemMain">

            <div id="CartItemMainImageWindow">
                <img id="CartItemImage" src={image_url}/>
            </div>
            
            <div id="CartItemMainTitleWindow">
                <p id="CardItemTitle">{ItemProperties.title}</p>
            </div>

            <div onClick={()=>RemoveRequestHandler(ItemProperties.id)} id="CartItemMainTrashWindow">
                <img id="CartItemTrashIcon" src={ItemProperties.TrashIcon}/>
            </div>

        </div>

    )
}


export function NavbarCartMenu(){
    const DispatchHandler = CartProducts.actions.UpdateButtonState
    const UpdateCartProducts = useDispatch(DispatchHandler)

    React.useState(Main=>{
        async function RequestData(){
            const request = await fetch(GetHost()+'/Authentication_Check/', {headers: {Authorization: `Token ${localStorage.getItem('WebKey')}`}})
            if (request.status == 200){
                const request = await fetch(GetHost()+"/GetUsersCardProducts/", {
                    headers: {Authorization: `Token ${localStorage.getItem('WebKey')}`}
                })
                const rawData = await request.json()
                UpdateCartProducts(DispatchHandler(rawData.result))
                return rawData.result
            }
            else{
                window.location.pathname = '../login/'
            }
        }    

        RequestData()
    }, [])

    const Products = useSelector(Main=>Main.UserCartProducts.Products)
    const TrashIconLink = useSelector(Main=>Main.UserCartProducts.TrashIcon)
    const host = window.location.host


    
    const processedProducts = Products.map(each=><CartItemForm TrashIcon={TrashIconLink} title={each.title} id={each.id} key={each.id} price={each.price} description={each.description} image_url={each.image}/>)
    
    return (
        
        <div id="CartMenu">

    {/* <GetCartProducts/>   */}
            {processedProducts[0] ? processedProducts : <NoPayloadSignal message={"No Products Yet"}/>}

        </div>

    )

}

export function UserThread(ObjectProperties){
    const MessagedUsers = useSelector(Main=>Main.SupportStaff_Clients.MessagedUsers)
    const [mail_icon, Update_mail_icon] = React.useState('');
    const messaged = MessagedUsers.includes(ObjectProperties.id)
    async function getStyle(){
          
      await import('./UsersMonitoring_Styles.css');
      
    }

    function RedirectUser(){
        const StaffId = localStorage.getItem('StaffID');
        localStorage.setItem('ConnectingClient', ObjectProperties.id);
        const RedirectionUrl = window.location.pathname + ObjectProperties.id + 'CW' + StaffId + '/' ;
        window.location.pathname = RedirectionUrl;
    }


    
    React.useEffect(Main=>{

        const Mail_Icon_code = 'mail_icon' 
        
        async function GetBackendData(){
            
            const url = GetHost()+`/GetIcon/${Mail_Icon_code}/`
            const request = await fetch(url)
            const response = await request.json()
            
            if (request.status == 200)
                Update_mail_icon(Main=>response.file)
            
        }
    
        GetBackendData()
        getStyle()

        
      
    })
    const NotificationStyle = {body:{backgroundColor: 'rgb(47, 79, 79)', borderColor: 'white'}, textStyle: {color: 'white'}}
  
    return (
  
      <div onClick={RedirectUser} style={messaged ? NotificationStyle.body : null} id="MainThreadBody"> 
  
        <span style={messaged ? NotificationStyle.textStyle : null}  id="UserIdField">User {ObjectProperties.id}</span>
        { messaged ? <img id="MailIcon" src={mail_icon}/> : undefined }
      
      </div>
  
    )
  }

export function IntroHomePage(){
    var [images, Update_images] = React.useState([])
    async function GetImages(){

        const images = await fetch(GetHost()+'/GetIcon/MainPageImages/ForMainPage/')
        const response = await images.json()
        Update_images(Main=>response.MainPageImages)

    }
    
    async function GetallStyles(){
        await import('./HomePage/assets/css/main.css')
    } 

    React.useEffect(Main=>{
      
        GetallStyles()
        GetImages()
    }, [])

    React.useEffect(Main=>{

    }, [images])
    if (images)
        return (
        <div id="page-wrapper">

        <div id="header-wrapper">
        <header id="header" className="container">

            <div id="logo">
            <h1><a>TopStore</a></h1>
            <span>By Mansur</span>
            </div>

            <nav id="nav">
            <ul>
                <li><a>Fully Developed and Maintained By Mansur Davlatov</a></li>
            </ul>
            </nav>

        </header>
        </div>

        {/* <!-- Banner --> */}
        <div id="banner-wrapper">
        <div id="banner" className="box container">
            <div className="row">
            <div className="col-7 col-12-medium">
                <h2>Welcome !</h2>
                <p>Find the Best Laptop For Yourself!</p>
            </div>
            <div className="col-5 col-12-medium">
                <ul>
                <li><a href="../Main/" className="button large icon solid fa-arrow-circle-right">Go Find out what we have</a></li>
                </ul>
            </div>
            </div>
        </div>
        </div>

        {/* <!-- Features --> */}
        <div id="features-wrapper">
        <div className="container">
            <div className="row">
            <div className="col-4 col-12-medium">

                {/* <!-- Box --> */}
                <section className="box feature">
                <a className="image featured"><img src={images[0]} alt="" /></a>
                <div className="inner">
                    <header>
                    <h2>Dell XPS Premium Laptops</h2>
                    {/* <p>Maybe here as well I think</p> */}
                    </header>
                    <p>Dell has been one of the top premium laptop manifacturers today and as well as our business sponsor!</p>
                </div>
                </section>

            </div>
            <div className="col-4 col-12-medium">

                {/* <!-- Box --> */}
                <section className="box feature">
                <a className="image featured"><img src={images[1]} alt="" /></a>
                <div className="inner">
                    <header>
                    <h2>HP Spectre x360 series</h2>
                    {/* <p>the most powerful ryzen 6000 series to handle most of your tasks at once </p> */}
                    </header>
                    <p>Introducing the extraordinary HP Spectre x360 with the groundbreaking Ryzen 6000 series CPU! Prepare to be amazed by its unparalleled performance and unrivaled versatility</p>
                </div>
                </section>

            </div>
            <div className="col-4 col-12-medium">

                {/* <!-- Box --> */}
                <section className="box feature">
                <a className="image featured"><img src={images[2]} alt=""/></a>
                
                <div className="inner">
                    <header>
                        <h2>Oh, and finally ...</h2>
                        <p>Dell's Latest Alienware Gaming Laptops</p>
                    </header>
                        <p>Get ready to immerse yourself in the world of high-octane gaming with the Alienware m18's powerful Intel's 13th Gen series CPU </p>
                </div>
                
                </section>

            </div>
            </div>
        </div>
        </div>

        {/* <!-- Main --> */}
        <div id="main-wrapper">
        <div className="container">
            <div className="row gtr-200">
            <div className="col-4 col-12-medium">


                <div id="sidebar">
                <section className="widget thumbnails">
            
                    <a className="button icon fa-file-alt">More Personal Details</a>
                    <div className="grid">

                    </div>

                </section>
                </div>

            </div>
            <div className="col-8 col-12-medium imp-medium">

                <div id="content">
                <section className="last">
                    <h2>So what's all about me?</h2>
                    <p>
                        This Website,  
                        <strong> TopStore</strong>, is fully developed by me using <strong>html</strong>, <strong>css</strong>, <strong>javascript/React</strong>, <strong>Python/Django </strong> 
                        as well as <strong>Django Rest Framework</strong> toolkit specifically designed for django as a part of back-end functionality. 
                        You can explore the whole application experience once you click blue button on the top. 
                        My full name is Mansur Davlatov Sheralliyevich, born in 2004, currently sophomore student of Information Management Systems at Webster University</p>
                        <strong>Contact: +1 347 588 7492</strong>
                        <br/>
                            or
                        <br/>
                        <strong>Contact: +998 99 045 17 68</strong>
                        
                </section>
                </div>

            </div>
            </div>
        </div>
        </div>

        <div id="footer-wrapper">
        <footer id="footer" className="container">
            <div className="row">
            <div className="col-3 col-6-medium col-12-small">

            </div>
            <div className="col-3 col-6-medium col-12-small">

            </div>
            <div className="col-3 col-6-medium col-12-small">

            </div>
            <div className="col-3 col-6-medium col-12-small">

       
                <section className="widget contact last">
                <h3>Contact Me</h3>
                <ul>
                    <li><a className="icon brands fa-twitter"><span className="label">Twitter</span></a></li>
                    <li><a className="icon brands fa-facebook-f"><span className="label">Facebook</span></a></li>
                    <li><a className="icon brands fa-instagram"><span className="label">Instagram</span></a></li>
                    <li><a className="icon brands fa-dribbble"><span className="label">Dribbble</span></a></li>
                    <li><a className="icon brands fa-pinterest"><span className="label">Pinterest</span></a></li>
                </ul>
                <p>Abay Street, 16A<br />
                    Tashkent, Shaykhontoxur<br />
                    <strong>Contact: +998 99 045 17 68</strong>, only for phone calls</p>
                    
                    <br/> 
                    <strong>Contact: +1 347 588 7492 </strong>,  for both phone calls and messangers like Telegram or whatsApp
                </section>

            </div>
            </div>
            <div className="row">
            <div className="col-12">

         
                <section className="widget blurbs">
                <h3>About</h3>
                <p>Explore the best laptops you could find in the current tech industry, while being cheap as it is, our service also feature free delivery if you do a purchase worth of over $999, so make sure you do not miss out this opportunity !</p>
                </section>

            </div>
            </div>
            <div className="row">
                <div className="col-12">

                </div>
            </div>
        </footer>
        </div>

        </div>

    )
}