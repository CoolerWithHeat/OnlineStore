import React, { Component } from "react";
import {WebsiteTranslationPack, CustomCounterBase, FetchedProductsBase, SideBarButtonsState} from './features/counter/ReduxBase';
import { useSelector, useDispatch } from "react-redux";
import { CartProducts, ProductsBase, ResultProductsBase, SupportStaffClients, ProfileInfo } from "./features/counter/ReduxBase";
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
        const url = window.location.protocol + '//' + window.location.host
        if (url === "http://localhost:3000")
            return 'http://localhost:8000' 
        else    
            return url
    }else{
        const url = window.location.host
        if (url === "localhost:3000")
            return 'localhost:8000' 
        else    
            return url
    }
}

export function ProductsPage(){

    const languagePack = useSelector(Main=>Main.LanguagePack)
    const languageUpdatePath = WebsiteTranslationPack.actions.Update_Language
    const ProductsPageLanguagePack = languagePack.products_page
    const LanguageState = useSelector(Main=>Main.LanguagePack.selected_language)
    const selectedLanguage = LanguageState == 2 ? 'russian' : 'english'
    const Base = useSelector(Main=>Main.ProductsPool)
    const SearchBase = useSelector(Main=>Main.ProductsSearchResult)
    const SearchProductsUpdatePath =  ResultProductsBase.actions.StoreProducts
    const ProductsUpdatePath =  ProductsBase.actions.StoreProducts
    const dispatch = useDispatch()
    const SearchInputField = React.useRef(null)
    const SearchButton = React.useRef(null)
    const language_details = [selectedLanguage == "english" ? <img id="USA-flag" src="https://djangostaticfileshub.s3.eu-north-1.amazonaws.com/USA.jpg" className="mr-2" alt="flag"/> :  <img id="RUSSIA-flag" src="https://djangostaticfileshub.s3.eu-north-1.amazonaws.com/Russia.jpg" className="mr-2" alt="flag"/>, selectedLanguage]
    var [cssLoaded, Update_Css_status] = React.useState(false) 

    const handleClickLogic =  () => {
        const CartButton = document.getElementsByClassName("round-button-1")
        setTimeout(() => {
            CartButton[0].click()
        }, 0);
    }

    async function GetProducts(searchKey){
        
        const request = await fetch(GetHost()+`/GetFilteredData/${searchKey}/`)
        const requestResult = await request.json()
        if (request.status == 200)
            dispatch(SearchProductsUpdatePath(requestResult.result))

    }

    function StartSearch(){

        const RequestedKeyword = SearchInputField.current.value

        if (RequestedKeyword){
            const url_Parameter = new URL(window.location.protocol + '//' + window.location.host + '/');
            url_Parameter.searchParams.append('Search', RequestedKeyword);
            window.location.href = url_Parameter.search
        }

        else{

            window.location.href = '../Main/'
        }

    }
    
    var processedProducts;
    if (window.location.search){

        processedProducts = SearchBase.Products.map(Each=><AdvancedProductCard key={Each.id} ProductData={Each}/>)
    }
  
    else {
  
        processedProducts = Base.Products.map(Each=><AdvancedProductCard key={Each.id} ProductData={Each}/>)
  
    }

    async function Request_All_Products(type){

        const request = await fetch(GetHost()+"/GetProducts/all/")
        const requestResult = await request.json()
        dispatch(ProductsUpdatePath(requestResult.products))
        
    }

    async function ImportStyles(type){

        const cssLoads = await import('./css_files/AdvancedProductsStyles.css')
        if (cssLoads)
            Update_Css_status(Main=>true)
        
        
    }

    function UpdateLanguage(LanguageID){
        localStorage.setItem("languageID", LanguageID)
        if (!(localStorage.getItem('languageID') == LanguageState)){
            dispatch(languageUpdatePath(localStorage.getItem('languageID')))
        }
    }

    React.useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'https://djangostaticfileshub.s3.eu-north-1.amazonaws.com/bootstrap.min.css';
        document.head.appendChild(link);
      }, []);

    React.useEffect(Main=>{
        const SearchFieldSpot = SearchInputField.current

        const handleKeyPress = (event) => {
            if (event.keyCode === 13) {
                SearchButton.current.click()
            }
        };

        if (SearchFieldSpot) {
            SearchFieldSpot.addEventListener('keydown', handleKeyPress);
            }

        ImportStyles()

        if (GetSearchKey()){
            SearchInputField.current.value = GetSearchKey()
            GetProducts(GetSearchKey())
        }else{
            Request_All_Products()
        }

    }, [])

    const imageStyle = {width:"270px", height:"160px"}
    if (cssLoaded)
    return (
        <div>
        <div className="banner_bg_main">

        <div className="container">
           <div className="header_section_top">
              <div className="row">
                 <div className="col-sm-12">
                    <div className="custom_menu">
                       
                       <ul>

                          <li><a href="#">| {ProductsPageLanguagePack[selectedLanguage][1]}: +998 99 045 17 68 |</a></li>
                          <li><a href="../Home">{ProductsPageLanguagePack[selectedLanguage][2]}</a></li>
                          
                       </ul>

                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="logo_section">
           <div className="container">
              <div className="row">
                 <div className="col-sm-12">
                    <div className="logo"><img style={imageStyle} src="https://djangostaticfileshub.s3.eu-north-1.amazonaws.com/Into+(1)-fotor-bg-remover-20230718235349.png"/></div>
                 </div>
              </div>
           </div>
        </div>

        <div className="header_section">
           <div className="container">
              <div className="containt_main">

            <div className="main">
                <div className="input-group">
                    <input ref={SearchInputField} type="text" className="form-control" placeholder={ProductsPageLanguagePack[selectedLanguage][3]}/>
                    <div className="input-group-append">
                        <button onClick={StartSearch} ref={SearchButton} className="btn btn-secondary" type="button">
                        <i className="fa fa-search"></i>
                        </button>
                    </div>
                </div>
            </div>
                 
                 <div className="header_box">
                    <div className="lang_box ">
                       <a title="Language" data-toggle="dropdown" aria-expanded="true">
                            <small id="LanguageDetails">{language_details[0]} {language_details[1]}</small> <i className="fa fa-angle-down ml-2" aria-hidden="true"></i>
                       </a>
                       <div className="dropdown-menu ">
                          <a onClick={()=>UpdateLanguage(1)} href="#" className="dropdown-item">
                          <img id="USA-flag" src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/1200px-Flag_of_the_United_States.svg.png" className="mr-2" alt="flag"/> English    

                          </a>
                          <a onClick={()=>UpdateLanguage(2)} href="#" className="dropdown-item">
                          <img id="RUSSIA-flag" src="https://www.youngpioneertours.com/wp-content/uploads/2020/03/russian-flag-russian-flag-russia-flag-of-russia.jpg" className="mr-2" alt="flag"/> русский    

                          </a>
                       </div>
                    </div>
                    <div className="login_menu">

                        <button className="btn btn-secondary" onClick={handleClickLogic}>
                            <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                            <span className="padding_10">{ProductsPageLanguagePack[selectedLanguage][4]}</span>
                        </button>
            
                    </div>
                 </div>
              </div>
           </div>
        </div>
        <div className="banner_section layout_padding">
           <div className="container">
              <div id="my_slider" className="carousel slide" data-ride="carousel">
                 <div className="carousel-inner">
                    <div className="carousel-item active">
                       <div className="row">
                          <div className="col-sm-12">
                             <h1 className="banner_taital"><br/>{ProductsPageLanguagePack[selectedLanguage][5][1]}</h1>
                          </div>
                       </div>
                    </div>
                    <div className="carousel-item">
                       <div className="row">
                          <div className="col-sm-12">
                             <h1 className="banner_taital"><br/>{ProductsPageLanguagePack[selectedLanguage][5][2]}</h1>
                          </div>
                       </div>
                    </div>
                    <div className="carousel-item">
                       <div className="row">
                          <div className="col-sm-12">
                             <h1 className="banner_taital"><br/>{ProductsPageLanguagePack[selectedLanguage][5][3]}</h1>
                          </div>
                       </div>
                    </div>
                 </div>
                 <a className="carousel-control-prev" href="#my_slider" role="button" data-slide="prev">
                 <i className="fa fa-angle-left"></i>
                 </a>
                 <a className="carousel-control-next" href="#my_slider" role="button" data-slide="next">
                 <i className="fa fa-angle-right"></i>
                 </a>
              </div>
           </div>
        </div>

        

     </div>
     
        
     <div className="fashion_section">
        <div id="main_slider" className="carousel slide" data-ride="carousel">
           <div className="carousel-inner">
              <div className="carousel-item active">
                 <div className="container">
                    <div className="fashion_section_2">
                       <div className="row">

                          {processedProducts}
 
                       </div>
                    </div>
                 </div>
              </div>
            
           </div>
           <a className="carousel-control-prev" href="#main_slider" role="button" data-slide="prev">
           <i className="fa fa-angle-left"></i>
           </a>
           <a className="carousel-control-next" href="#main_slider" role="button" data-slide="next">
           <i className="fa fa-angle-right"></i>
           </a>
        </div>
     </div>

     <SideBarAdvanced/>

     <div className="footer_section layout_padding">
        
        <div className="container">
        <div className="logo"><img style={imageStyle} src="https://djangostaticfileshub.s3.eu-north-1.amazonaws.com/Into+(1)-fotor-bg-remover-20230718235349.png"/></div>
 
           <div className="input_bt">
              


           </div>
           <div className="location_main">{ProductsPageLanguagePack[selectedLanguage][1]} : <a href="#">+998 99 045 17 68</a></div> 
           <div className="location_main">Email : <a href="#">mansurdavlatov@webster.edu</a></div>
        </div>
     </div>
     </div>
    )
}

export function AdvancedProductCard(ProductDetails){
    const [colorState, Update_colorState] = React.useState(0)
    
    const ChangeColorState = (digit)=>{
        Update_colorState(Main=>digit)
    }

    function GetRateStars(rate=0){
        var star = []
        for (let i = 0; i < rate; i++) {
            star.push(<i className="fa fa-star"></i>)
          }

        const empty_stars_needed_amount = 5-(star.length)
        for (let i = 0; i < empty_stars_needed_amount; i++) {
            star.push(<i className="fa fa-star grey"></i>)
          }

        return star
    }
    
    async function GetStyle(){
        await import('./css_files/CustomButtonStyle.css')
    }



    const ProductColorPrices = {
        1: ProductDetails.ProductData.price_for_rose,
        2: ProductDetails.ProductData.price_for_silver,
        3: ProductDetails.ProductData.price_for_black
    }

    React.useEffect(Main=>{
        GetStyle()
        
    }, [])

    return (
        <div id="mainCardBody">
            <div className="container">
                <div className="card">
                    <img id="ProductImage" width="100%" height="100%" src={ProductDetails.ProductData.image}/>
                    
                    <div className="card-body">
                    <div className="product-desc">
                        <span className="product-title">
                            {ProductDetails.ProductData.title}
                            <br/>
                            <AnimatedButton key={5} id={ProductDetails.ProductData.id}/>
                        </span>
                        <span className="product-caption">
                                TopStore Lnc.
                            </span>
                        <span className="product-rating">
                                
                                {GetRateStars(ProductDetails.ProductData.rating)}

                        </span>
                    </div>

                    <div className="product-properties">
                        <span className="product-size">
                            <ProductDetailsLayer key={1} type={'cpu'} text={ProductDetails.ProductData.CPU_details}/>
                            <ProductDetailsLayer key={2} type={'gpu'} text={ProductDetails.ProductData.GPU_details}/>
                            <ProductDetailsLayer key={3} type={'ram'} text={ProductDetails.ProductData.RAM_details}/>
                            <ProductDetailsLayer key={4} type={'panel'} text={ProductDetails.ProductData.Panel_details}/>
                        </span>
                    </div>
                    

                    </div>
                    <div id="Color_and_Price">
                            <span className="product-color">
                                    <h4>{localStorage.getItem('languageID') == 1 ? "Colours" : "Варианты"}</h4>
                                    <ul className="ul-color">
                                        <li><a onClick={()=>ChangeColorState(1)} className={colorState===1 ? "orange"+" active" : 'orange'}></a></li>
                                        <li><a onClick={()=>ChangeColorState(2)} className={colorState===2 ? "green"+" active" : 'green'}></a></li>
                                        <li><a onClick={()=>ChangeColorState(3)} className={colorState===3 ? "yellow"+" active" : 'yellow'}></a></li>
                                    </ul>
                            </span>
                            <span className="product-price">
                                    USD<b>{colorState == 0 ? ProductDetails.ProductData.price : ProductColorPrices[colorState]}</b>
                            </span>
                        </div>
                    </div>
                
                </div>

        </div>
    )
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

    if (!(GetSearchKey() == ' ')){
        GetProducts()
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
        async function GetStyle(){
            await import('./css_files/SearchField.css')
        }

        GetStyle()
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
        <h5 id="ErrorText">{localStorage.getItem('languageID') === 2 ? 'К сожалению, платежные системы еще не полностью интегрированы' : "Unfortunately, Payment Systems not fully Integrated Yet"}</h5>
    </div>)

}

export function BottomLine(CheckProperties){
    
    const Bottom_Line = useSelector(Main=>Main.UserCartProducts.BottomLine)
    
    function Redirect(url){
        window.location.pathname = `../${url}/`
    }

    React.useEffect(Main=>{
        async function getStyles(){

        }
    }, [])

    if(Bottom_Line > 0)
        return (
            <button onClick={()=>Redirect('Payment')} id="BottomLine">{localStorage.getItem('languageID') == 2 ? "Отплатить" : "Pay off"}: ${Bottom_Line}</button>
    )
    
    return (
            <button id="BottomLine">{CheckProperties.translated_text}</button>
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
        let obj = await import('./css_files/ProfileWindowStyles.scss');
    }

    function Logout(){
        localStorage.removeItem('WebKey')
        setTimeout(() => {
            if (!localStorage.getItem('WebKey'))
                window.location.pathname = 'login/'
        }, 111);
    }

    const emailRef = React.useRef(null);
    
    React.useEffect(Main=>{
 
        const emailElement = emailRef.current;
        const containerWidth = emailElement.offsetWidth;
        const textWidth = emailElement.scrollWidth;

        if (textWidth > containerWidth) {
            const fontSize = containerWidth / textWidth * 18; // Adjust the initial font size (18px) based on the container width
            emailElement.style.fontSize = `${fontSize}px`;
        }

        GetProfileDetails()
        getStyle()

    }, [])

    const Style = {width:'60px', height:'60px', borderRadius:'50%',}
    const SmallerText = {fontSize: '12px'}
    const BiggerText = {fontSize: '17px'}
    
    return (
        <div id="login-container">

            <div className="profile-img">
                <img style={Style} src={ProfileInfos.image_url}/>
            </div>
            
            <h1>
                Profile
            </h1>

            <div className="description">
                <ul ref={emailRef} style={BiggerText}>{ProfileInfos.email}</ul>
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

export function ProviderButton(BtnProperties){

    return (            
        
        <div id="ButtonWindow">
                
            <button id="AuthButton"><img id="ProviderButtonImage" src="https://cdn-icons-png.flaticon.com/512/2504/2504739.png"/></button>
            <button id="AuthButton"><img id="ProviderButtonImage" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1024px-Facebook_Logo_%282019%29.png"/></button>

        </div>
        )

}


export function AnimatedButton(ButtonProps){
    var [btnState, UpdateBtnState] = React.useState({initialImage:<img width='38px' height='37px' src="https://djangostaticfileshub.s3.eu-north-1.amazonaws.com/add-cart.png"/>, loading:false}) 
    const CartAddRequestLink = (id)=>GetHost()+`/AdjustCartProducts/1/${id}/`
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

    const StatusImage = {

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
            
            const PreparedState = {loading:true};
            return PreparedState;
            
    
        }) 
        
        setTimeout(() => {

            UpdateBtnState(Initial=>{

                const style = {color:'white'}
                const PreparedState = {initialImage:<img style={style} width='36px' height='36px' src="https://djangostaticfileshub.s3.eu-north-1.amazonaws.com/success.png"/>, loading:false};
                return PreparedState;   
        
            })  

        }, 999);
    
}


    return (

        <button onClick={()=>ChangeState(ButtonProps.id)} className="AnimatedButton">
            {btnState.text == "success!" ? <img id="CartMessageImage" src={'https://djangostaticfileshub.s3.eu-north-1.amazonaws.com/add-cart.png'}/> : null}
            <span>{btnState.initialImage}</span><i className={StateIndexes[btnState.loading]}></i>
        </button>

    )

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

export function CreateChatDialog(side, first_name=null, last_name=null, image_url=null, message=null, Custom=false){
    async function getConsumerChatStyles(){
        
        await import('./css_files/ConsumerChatStyles.css');
        
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
        
        await import('./css_files/AdminChatStyles.css');
        
    }

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
    const MessagedUsers = useSelector(Main=>Main.SupportStaff_Clients.MessagedUsers)
    const Base_Path = SupportStaffClients.actions.UpdateClients
    const MessagedUsersBase = SupportStaffClients.actions.Update_Messaged_Users


    const dispatch = useDispatch()

    async function getStyle(){
        
        await import('./css_files/AdminChatStyles.css');
        
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
    const RemoveFromCart = (id)=>{}

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

export function ChatComponent(ResponseProperties){

    const bodyIndecies = {

        left:   <li className="in">
                    <div className="chat-img">
                        <img alt="Avtar" src={ResponseProperties.user_image}/>
                    </div>
                    <div className="chat-body">
                        <div className="chat-message">
                            <h5>{ResponseProperties.username}</h5>
                            <p>{ResponseProperties.message}</p>
                        </div>
                    </div>
                </li>,
        
        right:  <li className="out">
                    <div className="chat-img">
                        <img alt="Avtar" src={ResponseProperties.user_image}/>
                    </div>
                    <div className="chat-body">
                        <div className="chat-message">
                            <h5>{ResponseProperties.username}</h5>
                            <p>{ResponseProperties.message}</p>
                        </div>
                    </div>
                </li>

    }

    return bodyIndecies[ResponseProperties.side]
}

export function UserThread(ObjectProperties){
    const MessagedUsers = useSelector(Main=>Main.SupportStaff_Clients.MessagedUsers)
    const [mail_icon, Update_mail_icon] = React.useState('');
    const messaged = MessagedUsers.includes(ObjectProperties.id)
    async function getStyle(){
          
      await import('./css_files/UsersMonitoring_Styles.css');
      
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




export function SideBarAdvanced() {

    const languagePack = useSelector(Main=>Main.LanguagePack)
    const SideBarLanguagePack = languagePack.sidebar
    const LanguageState = useSelector(Main=>Main.LanguagePack.selected_language)
    const selectedLanguage = LanguageState === 2 ? 'russian' : 'english'
    const containerRef = React.useRef(null);
    const navRef = React.useRef(null);
    const [clickedButton, Update_clickedButton] = React.useState(1)

    function Cart_Products_Window(){

        const CartWindow = React.useRef(null)
        const DispatchHandler = CartProducts.actions.UpdateButtonState
        const UpdateCartProducts = useDispatch()
        const responseWindowRef = React.useRef(null);


        function scrollToBottom() {
            const window = responseWindowRef.current
            if (responseWindowRef.current) {
              setTimeout(() => {
                window.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
              }, 66);
            }
        }
        async function getStyle(){
            await import('./css_files/SideBarProductsStyles.scss');
        }


        React.useEffect(Main=>{

            getStyle()
            
            async function RequestData(){

                const request = await fetch(GetHost()+"/GetUsersCardProducts/", {headers: {Authorization: `Token ${localStorage.getItem('WebKey')}`}})
                const rawData = await request.json()
                UpdateCartProducts(DispatchHandler(rawData.result))
                scrollToBottom()
                return rawData.result

            }

            RequestData()
        
        
        }, [])

        const Products = useSelector(Main=>Main.UserCartProducts.Products)
        const TrashIcon = useSelector(Main=>Main.UserCartProducts.TrashIcon)
        
        const processedProducts = Products.map(each=><SidebarProductCard TrashIcon={TrashIcon} title={each.title} id={each.id} key={each.id} price={each.price} description={each.description} image_url={each.image} gpu={each.GPU_details} cpu={each.CPU_details} panel={each.Panel_details} ram={each.RAM_details}/>)
       
        return (  
            
            <div id="MainChatBar">
                <ul className="chat-list">
                    <div className="ResponsesWindow" ref={responseWindowRef}>
                        {processedProducts}
                        <br/>
                        <br/>
                    </div>
                </ul>
                <li id="TextFormField">
                    <BottomLine translated_text={SideBarLanguagePack[selectedLanguage][1]}/>
                </li>
            </div>

        )
    }

    function Profile_Window(){

        const ProfileUpdatePath = ProfileInfo.actions.Save_Prifile_Infos
        const ProfileInfos = useSelector(Main=>Main.Profile.ProfileDetails)
        const dispatch = useDispatch()

        async function GetProfileDetails(){

            const request = await fetch(GetHost()+'/Authentication_Check/', {headers: {Authorization: `Token ${localStorage.getItem('WebKey')}`}})
            if (request.status===200){
               const request = await fetch(GetHost()+'/Get_UserInfo/', {
                    method: 'GET',
                    headers: {Authorization: `Token ${localStorage.getItem('WebKey')}`}
                })
                if (request.status===200){
                    const parsedData = await request.json()
                    dispatch(ProfileUpdatePath(parsedData.response))
                }
            }
            
            else{
                window.location.pathname = '../login'
            }

        }

        async function getStyle(){
            let obj = await import('./css_files/ProfileWindowStyles.scss');
        } 

        function Logout(){
            localStorage.removeItem('WebKey')
            setTimeout(() => {
                if (!localStorage.getItem('WebKey'))
                    window.location.pathname = 'login/'
            }, 111);
        }

        const emailRef = React.useRef(null);
    
        React.useEffect(Main=>{

            GetProfileDetails()
            getStyle()

        }, [])
    
        const Style = {width:'60px', height:'60px', borderRadius:'50%',}
            
        return (

            <div id="login-container">

                <div className="profile-img">
                    <img style={Style} src={ProfileInfos.image_url}/>
                </div>
                
                <h1>
                    {localStorage.getItem("languageID") === 1 ? "Profile" : 'Профиль'}
                </h1>
                
                <div className="description">
                    <ul ref={emailRef} id="EmailText">{ProfileInfos.email}</ul>
                    <br/>
                    <br/>
                    <ul id="PurchasedProductsText">{SideBarLanguagePack[selectedLanguage][2]}: 0</ul>
                    <ul id="BalanceText">{SideBarLanguagePack[selectedLanguage][3]}: 0</ul>
                    <br/>   
                </div>

                
                <button id="LogoutButton" onClick={Logout}>Log Out</button>

            </div>

        )
    }

    function Support_Window(){

        const socketRef = React.useRef(null);
        const MessagesPath = SupportStaffClients.actions.UpdateMessages
        const Messages = useSelector(Main=>Main.SupportStaff_Clients.AllMessages)
        const AddToExistingBase = SupportStaffClients.actions.UpdateExistingMessages
        const dispatch = useDispatch()
        const SocketProtocol = window.location.protocol === "https:" ? 'wss://' : 'ws://'
        const userdataField = React.useRef()
        const SendButton = React.useRef()
        const responseWindowRef = React.useRef(null);
        
        function sendToSocket() {
            const userInput = userdataField.current.value;
            if (userInput) {

                socketRef.current.send(JSON.stringify({ UsersText: userInput, token: localStorage.getItem('WebKey') }));
                userdataField.current.value = null
            }
        }
        
        async function GetClientMessages(){

            const messagesRequest = await fetch(GetHost()+'/GetClientMessages/' + localStorage.getItem('TempID'), {
                method: "GET",
                headers: {
                    'Authorization': `Token ${localStorage.getItem('WebKey')}`
                }
            })
            
            const response = await messagesRequest.json()
            dispatch(MessagesPath(response.response))
            scrollToBottom()
            
        }

        const processedMessages = Messages.map(Main=>{
            return <ChatComponent user_image={Main.SenderImage} key={Main.id} username={Main.sender} message={Main.message} side={Main.SenderID == localStorage.getItem('TempID') ? 'right' : 'left'}/>
        })

        function scrollToBottom() {
            const window = responseWindowRef.current
            if (responseWindowRef.current) {
              setTimeout(() => {
                window.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
              }, 66);
            }
        }

        


        React.useEffect(Main=>{

            
            const socket = new ReconnectingWebSocket(SocketProtocol + GetHost(false) + '/chat/' + `token=${localStorage.getItem('WebKey')}`)
            
            socket.onmessage = (BaseData)=>{
                
                const response = JSON.parse(BaseData.data)
                if (response.status === 500){
                    window.location.pathname = '../login'
                }

                const UserKey = response.TempID ? localStorage.setItem('TempID', response.TempID) : null

                if (!response.TempID){
                    if (response.message){
                        const processedData = {id: response.id, SenderID: response.SenderID, SenderImage: response.SenderImage, SenderIsStaff: response.SenderIsStaff, StaffImage: response.StaffImage, message:response.message, sender:response.sender}

                        dispatch(AddToExistingBase(processedData))
                        scrollToBottom()

       
                    }
                }
    
            }

            GetClientMessages()
            
            
            socketRef.current = socket;
            const handleKeyPress = (event) => {

                if (event.key === 'Enter'){
                    SendButton.current.click()
                }
                
            };

            async function getStyle(){
                await import('./css_files/UserChatStyles.css')
            }
            
            getStyle()
    
            document.addEventListener('keydown', handleKeyPress);
            return () => {
                socket.close();
            };

    
        }, [])
        return (

            <div id="MainChatBar">
                <ul className="chat-list">
                    <div className="ResponsesWindow" ref={responseWindowRef}>
                        {processedMessages.length === 0 ? <div id="QuestionAlert">{SideBarLanguagePack[selectedLanguage][4]}</div> : processedMessages}
                    </div>
                </ul>
                <li id="TextFormField">
                    <input ref={userdataField} id="UserTextField" className="form-control" placeholder={SideBarLanguagePack[selectedLanguage][5]}/>
                    <button ref={SendButton} onClick={sendToSocket} id="SendButton" className="btn btn-warning">
                    <img src="https://djangostaticfileshub.s3.eu-north-1.amazonaws.com/send_ICON.png" alt="Send" />
                    </button>
                </li>
            </div>
            
        )
    }

    const WindowIndicies = {
        1: <Cart_Products_Window/>,
        2: <Profile_Window/>,
        3: <Support_Window/>,
    }
    
    React.useEffect(() => {
      async function GetallStyles() {
        await import('./css_files/AdvancedSideBar.css');
      }
      GetallStyles();
    });
  
    function OpenBarWindow(button_ID) {
      const container = containerRef.current
      container.classList.add('active');
      Update_clickedButton(Main=>button_ID)
    }
  
    const handleClickOutside = (event) => {

        if (
          containerRef.current &&
          !containerRef.current.contains(event.target) &&
          !navRef.current.contains(event.target)
        ) {
          containerRef.current.classList.remove('active');
        }
    };
  
    React.useEffect(() => {
    
        document.addEventListener('click', handleClickOutside);
        
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };

    }, []);
  
    return (

      <div id="Sidebar_AS_Whole">

            <nav ref={navRef}>
                
                <button id="button_1" onClick={() => OpenBarWindow(1)} className="round-button-1">
                    <img id="ButtonIcon" src="https://djangostaticfileshub.s3.eu-north-1.amazonaws.com/Cart_ICON.png" />
                </button>
                <label id="space"/>
                <button onClick={() => OpenBarWindow(2)} className="round-button-2">
                    <img id="UserIcon" src="https://djangostaticfileshub.s3.eu-north-1.amazonaws.com/user_ICON.png" />
                </button>
                <label id="space"/>
                <button onClick={() => OpenBarWindow(3)} className="round-button-3">
                    <img id="SupportIcon" src="https://djangostaticfileshub.s3.eu-north-1.amazonaws.com/support_ICON.png" />
                </button>

            </nav>
    
            <div ref={containerRef} className="SidebarContainer">
                <div id="DisplayWindow">
                    {WindowIndicies[clickedButton]}
                </div>
            </div>

      </div>
      
    );
  }