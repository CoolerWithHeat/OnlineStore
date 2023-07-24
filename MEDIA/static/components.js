import React from "react";
import {CustomCounterBase, FetchedProductsBase, AnimatedButtonStates, SideBarButtonsState} from './features/counter/ReduxBase';
import { useSelector, useDispatch } from "react-redux";
import { CartProducts, ProductsBase, ResultProductsBase } from "./features/counter/ReduxBase";
import { RecaptchaVerifier, updateProfile } from "firebase/auth";
import { Link } from "react-router-dom";

var host;
export const Get_Static_Url = (filename)=>{
    host = window.location.host
    return window.location.protocol + '//' + host + filename
}

export function GetHost(WithProtocol=true){
    return window.location.host == "localhost:3000" ? (WithProtocol ? "http://127.0.0.1:8000/" : '127.0.0.1:8000/') : window.location.host
}

export function GetCartProducts(){
    const DispatchHandler = CartProducts.actions.UpdateButtonState
    const UpdateCartProducts = useDispatch(DispatchHandler)

    async function RequestData(){
        const request = await fetch("http://127.0.0.1:8000/GetUsersCardProducts/")
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
        return ' '
}

export function SearchField(){

    const inputData = GetSearchKey()
    const products = useSelector(Main=>Main)
    const DispatchHandler = ResultProductsBase.actions.StoreProducts
    const UpdateCartProducts = useDispatch()

    async function GetProducts(){

        const request = await fetch(Get_Static_Url(`/GetFilteredData/${inputData ? inputData : ' '}/`))
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
        
        if (!(GetSearchKey() == ' ')){
            GetProducts()
        }

    }, [])
    
    return (

        <div id="SearchBar">
            
            <input defaultValue={inputData} type={"text"} id='SearchFieldInput'/>
            
            <button onClick={AddRequestDataToUrl} id="SearchButton"><img id="SeachButtonLoop" src="http://127.0.0.1:8000/media/SearchLoop_ICON.png/"/></button>

        </div>

    )

}   

export function BottomLine(){

    const Bottom_Line = useSelector(Main=>Main.UserCartProducts.BottomLine)
    if(Bottom_Line > 0)
        return (
            <button id="BottomLine">Pay off: ${Bottom_Line}</button>
        )
    
    return (
            <button id="BottomLine">Not Products Yet</button>
        )    
}

export function ProfileWindow(){
    // ProfileWindowStyles.scss
    async function getStyle(){
        let obj = await import('./css_files/ProfileWindowStyles.scss');
    }

    getStyle()

    return (
        <div id="login-container">

            <div className="profile-img"></div>
            
            <h1>
                Profile
            </h1>

            <div className="description">
                <ul>Sexy Girl</ul>
                <ul>Purchased products: 0</ul>
                <ul>Balance: 0</ul>
                <ul></ul>
            </div>

            
            <button>Log Out</button>

        </div>
    )
}

export function SidebarButton(BtnProperties){
    const CurrentAnimationNeededButton = useSelector(Main=>Main.SideBarButtons.BtnID)
    const dispatch = useDispatch()
    let letKnowRedux = SideBarButtonsState.actions.UpdateButtonState
    const Animate = {backgroundColor:'#ffffff', animation: "squashstretch 1.4s ease-in-out 0s infinite alternate"}

    const btnIndexes = {

        1: <img id='CartIcon' src='http://127.0.0.1:8000/media/Cart_ICON.png'/>,
        2: <img id='UserIcon' src='http://127.0.0.1:8000/media/user_ICON.png'/>,
        3: <img id='SupportIcon' src='http://127.0.0.1:8000/media/support_ICON.png'/>,
        
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
        let obj = await import('./css_files/SideBarProductsStyles.scss');
    }
    const DeleteStyle = {cursor: "pointer"};
    const TitleStyle = {fontSize:"22px"};
    const PriceStyle = {fontSize:"18px", position:"absolute", bottom:'0', right:'30%'};

    getStyle()

    const host = window.location.host == "localhost:3000" ? "http://127.0.0.1:8000/" : window.location.host
    const image_url = Get_Static_Url(ProductProperties.image_url)
    const TrashIcon = Get_Static_Url(ProductProperties.TrashIcon)
    
    const RemoveRequestHandler = (id)=>{
        const link = Get_Static_Url(`/AdjustCartProducts/0/${id}/`)

        async function RequestStatus(){

            const request = await fetch(link, {method:"POST"})
            
            if (request.status == 200){ 
            
                async function RequestData(){
                    const request = await fetch("http://127.0.0.1:8000/GetUsersCardProducts/")
                    const rawData = await request.json()
                    UpdateCartProducts(DispatchHandler(rawData.result))
                    return rawData.result
                }

                RequestData()

            }

        }
        RequestStatus()

    }
    return (        //keys: id title price description image_url
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
            
            <button onClick={()=>Redirect("Contact/")} id="navbarOption"><a id="MainLink">Contact</a></button>
            <button onClick={()=>Redirect("Home/")} id="navbarOption"><a id="MainLink">Home</a></button>
            <button className="btn btn-primary" onClick={ButtonStateChange} style={CartState[1]} id="NavbarCart">
                
                <img id="NavbarCartIconArrow" src={"http://127.0.0.1:8000/media/LeftArrow_ICON.png"}/>
                <img id="NavbarCartIcon" src={"http://127.0.0.1:8000/media/cartMain_ICON.png"}/>
            
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
                <img id="TextingButtonImage" src="http://127.0.0.1:8000/media/send_ICON.png"/>
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
    const CartAddRequestLink = (id)=>`http://127.0.0.1:8000/AdjustCartProducts/1/${id}/`
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

    var [btnState, UpdateBtnState] = React.useState({text:"Add To Card", loading:false}) 
    
    function resetButton(){
        UpdateBtnState(Initial=>{

            const PreparedState = {text:"Add To Card", loading:false};
            return PreparedState;

        })
    }

    function ButtonStateText(){
        return (

            <div id='CardMessage'>

                {btnState.loading ? <img id="CartMessageImage" src="http://127.0.0.1:8000/media/ShoppingCart.png"/> : null}

                <p id="CartMessageText">{btnState.text}</p>

            </div>

        )
    }
    
    //ChangeState
    //CartAddRequestLink
    function ChangeState(ProductId){
        
        const ProductEndpoint = CartAddRequestLink(ProductId)
        async function AddToCart(){ 
            const request = await fetch(ProductEndpoint, {method:"POST"})
            const requestResponse = await request.json()
            dispatch(DispatchMethodHandler(requestResponse))
            
        }

        AddToCart()

        setTimeout(() => {

            UpdateBtnState(Initial=>{

            const PreparedState = {text:StatusText[btnState.loading], loading:btnState.loading};
            return PreparedState;
            

        }) 

        setTimeout(() => {
            resetButton()
        }, 333);

        }, 555);



    
}
    

    return (

        <button onClick={ChangeState} className="AnimatedButton">
            {btnState.text == "Done!" ? <img id="CartMessageImage" src="http://127.0.0.1:8000/media/ShoppingCart.png"/> : null}
            <span>{btnState.text}</span><i className={StateIndexes[btnState.loading]}></i>
        </button>

    )

}



function GetProducts(single=false, id=0){

    const dispatch = useDispatch()
    const AddtoProducts = FetchedProductsBase.actions.UpdateProducts
    const API_endpoint = `http://127.0.0.1:8000/GetProducts/${single ? id : "all"}`;


    
    React.useEffect(Main=>{

        const request = fetch(API_endpoint).then(Main=>Main.json().then(Actual=>{
            const Products = Actual.products
            dispatch(AddtoProducts(Products))
        }))

    }, [])


    const products = useSelector(Main=>Main.ProductsBase.RawProducts)
    
    
    // if (products[0]){
    //     const data = products.map(each => <TrialCardForm key={each.id} title={each.title}/>)
    //     return data
    // }


}

export function ProductCard(CardProperties){


    const title = CardProperties.title
    const price = Number(CardProperties.price)
    const image_url = Get_Static_Url(CardProperties.image)
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
                
                {/* <div id="ButtonSpace"> */}

                <AnimatedButton id={CardProperties.id}/>

                {/* </div> */}

                

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

        cpu: "http://127.0.0.1:8000/media/cpu_ICON.png",
        gpu: "http://127.0.0.1:8000/media/gpu_ICON.png",
        ram: 'http://127.0.0.1:8000/media/ram_ICON.png',
        panel: 'http://127.0.0.1:8000/media/display1080_ICON.png',

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

export function ChatForm(FormProperties){

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
                                        <ul className="chat-box chatContainerScroll">

                                            <NoPayloadSignal message={"No Messages Yet"}/>
                                            {/* <LeftSideMessage side={"right"}/>  
                                            <LeftSideMessage side={"left"}/>    
                                            <LeftSideMessage side={"left"}/>  
                                            <LeftSideMessage side={"right"}/>  
                                            <LeftSideMessage side={"left"}/>  

                                            <LeftSideMessage side={"left"}/>  

                                            <LeftSideMessage side={"left"}/>   */}

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

const link_for_icon_downloads = "https://www.flaticon.com/search?word=cpu"

export function LeftSideMessage(MessageProperties){
    const MessageCondition = {
        left: <li className="chat-left">
        <div className="chat-avatar">
            <img src="https://www.bootdey.com/img/Content/avatar/avatar3.png" alt="Retail Admin"/>
            <div className="chat-name">Russell</div>
        </div>
        <div className="chat-text">Hello, I'm Russell.
            <br/>How can I help you today?</div>
        <div className="chat-hour">08:55 <span className="fa fa-check-circle"></span></div>
    </li>,


    right: <li className="chat-right">
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


export function SeperateContactMode(){
    return (
        <div id="MoreFocusedChat">

            <ChatForm focused={true}/>
            <Custom_HighEnd_Button bottom={true}/>

        </div>
    )
}

// #CartItemMainImageWindow{}

// #CartItemMainTitleWindow{}

// #CartItemMainTrashWindow{}

function CartItemForm(ItemProperties){
    const DispatchHandler = CartProducts.actions.UpdateButtonState
    const UpdateCartProducts = useDispatch(DispatchHandler)
    async function RequestData(){
        const request = await fetch(Get_Static_Url('/GetUsersCardProducts/'))
        const rawData = await request.json()
        UpdateCartProducts(DispatchHandler(rawData.result))
        return rawData.result
    }

    const image_url = Get_Static_Url(ItemProperties.image_url)
 

    const RemoveRequestHandler = (id)=>{
        const link = Get_Static_Url(`/AdjustCartProducts/0/${id}/`)
        async function RequestStatus(){
            const request = await fetch(link, {method:"POST"})
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
                <img id="CartItemTrashIcon" src={Get_Static_Url(ItemProperties.TrashIcon)}/>
            </div>

        </div>
    )
}


export function NavbarCartMenu(){
    const DispatchHandler = CartProducts.actions.UpdateButtonState
    const UpdateCartProducts = useDispatch(DispatchHandler)
    async function RequestData(){
        const request = await fetch("http://127.0.0.1:8000/GetUsersCardProducts/")
        const rawData = await request.json()
        UpdateCartProducts(DispatchHandler(rawData.result))
        return rawData.result
    }
    React.useState(Main=>{
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