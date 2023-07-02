import App from "./App";
import { createRoot } from 'react-dom/client';
import React from 'react';
import { IntroHomePage, UserThread, ErrorMessage, ProductCard, StaffClientsMonitor, AdminChatBox, Navbar, SeperateContactMode, NavbarCartMenu, SearchField, ErrorWindow, ProviderButton, ProfileWindow, SidebarProductCard, NoPayloadSignal, BottomLine, GetCartProducts, GetHost } from "./components";
import AccountLoginRegisterform from "./LoginForm";
import UISideBar from './CustomSidebar';
import { Provider } from 'react-redux'
import { CartProducts, ProductsBase, ResultProductsBase } from "./features/counter/ReduxBase";
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { store } from "./app/store";


const container = document.getElementById('root');
const root = createRoot(container);
// CartProducts

// const store = createStore(reducer)


function ArrangeProducts(ProductsProperties){
  var ProductsUpdatePath =  ProductsBase.actions.StoreProducts
  var processedProducts;
  const Base = useSelector(Main=>Main.ProductsPool)
  const SearchBase = useSelector(Main=>Main.ProductsSearchResult)

  const dispatch = useDispatch()
  const host = window.location.host == "localhost:3000" ? "http://127.0.0.1:8000/" : (window.location.protocol+'//'+window.location.host)

  async function RequestProducts(type){

    const request = await fetch(GetHost()+"/GetProducts/all/")
    const requestResult = await request.json()
    dispatch(ProductsUpdatePath(requestResult.products))

  }

  React.useEffect(Main=>{RequestProducts()}, [])

  // CPU_details price title image CPU_details GPU_details RAM_details Panel_details

  if (window.location.search){
    processedProducts = SearchBase.Products.map(Each=><ProductCard id={Each.id} title={Each.title} price={Each.price} key={Each.id} image={Each.image} cpu={Each.CPU_details} gpu={Each.GPU_details} ram={Each.RAM_details} panel={Each.Panel_details}/>)
  }

  else {
      processedProducts = Base.Products.map(Each=>
      <ProductCard id={Each.id} title={Each.title} price={Each.price} key={Each.id} image={Each.image} cpu={Each.CPU_details} gpu={Each.GPU_details} ram={Each.RAM_details} panel={Each.Panel_details}/>
    )
  }

  return (

    <div id='ProductsWindow'>

      {processedProducts}

    </div>

  )

}

function MainPageArrangement(WindowProperties){
  
  const ProductsUpdatePath =  ResultProductsBase.actions.StoreProducts
  const dispatch = useDispatch()

  return (

    <div>

      <Navbar/> 
      <SearchField/>
      <UISideBar/>
      <ArrangeProducts/>

    </div>
    
  )
}

function PaymentWindow(){

  const DispatchHandler = CartProducts.actions.UpdateButtonState
  const Bottom_Line = useSelector(Main=>Main.UserCartProducts.BottomLine)
  const UpdateCartProducts = useDispatch()
  const Products = useSelector(Main=>Main.UserCartProducts.Products)
  const TrashIcon = useSelector(Main=>Main.UserCartProducts.TrashIcon)
  const processedProducts = Products.map(each=><SidebarProductCard TrashIcon={TrashIcon} title={each.title} id={each.id} key={each.id} price={each.price} description={each.description} image_url={each.image} gpu={each.GPU_details} cpu={each.CPU_details} panel={each.Panel_details} ram={each.RAM_details}/>)
  const [PaymentID, Update_PaymentID] = React.useState(1)
  
  async function getStyle(){
    await import('./PaymentDropDown.css');
  }

  React.useEffect(Main=>{
            
    async function RequestData(){
        const request = await fetch(GetHost()+"/GetUsersCardProducts/", {headers: {Authorization: `Token ${localStorage.getItem('WebKey')}`}})
        const rawData = await request.json()
        UpdateCartProducts(DispatchHandler(rawData.result))
        return rawData.result
    }
    RequestData()
    getStyle()

  }, [])


  function ChangePayment(Element){
    Update_PaymentID(Main=>Element.target.value)
  }

  const PaymentImageIndices = {

    1: 'https://docs.click.uz/wp-content/themes/click_help/assets/images/logo.png',
    2: 'https://help.payme.uz/img/payme-logo.svg'

  }

  return (
    <div id="WholePaymentWindow">
      <ErrorMessage/>

      <div id="PaymentMain">
      <br/>
      <br/>
        <select onChange={ChangePayment} className="image-dropdown" id="PaymentSelect">

          <option value={1} >Click</option>
          <option value={2} >PayMe</option>

        </select>
        
        <br/>
        <br/>
        
        <img src={PaymentImageIndices[PaymentID]} id={`PaymentImage${PaymentID}`}/>
          <br/>
            <span className={Bottom_Line ? "price": 'No_Payload_Message'}>{Bottom_Line ? `Total: $${Bottom_Line}` : 'No Products Found In Your Cart'}</span>
          <br/>
        <br/>

        <div id="Products_Window">
          {processedProducts}
        </div>
      </div>
    </div>

  )
}


root.render(

  <Provider store={store}>
    
    <BrowserRouter>
      
      <Routes>

        <Route path="Main/" element={<MainPageArrangement />} />
        <Route path="Main/:str/" element={<MainPageArrangement />} />
        <Route path="login/" element={<AccountLoginRegisterform />} />
        <Route path="AdminChatBox/:str/" element={<StaffClientsMonitor/>}/>
        <Route path="AdminChatBox/" element={<AdminChatBox NoUsers={true}/>}/>
        <Route path="Payment/" element={<PaymentWindow/>}/>
        <Route path="Home/" element={<IntroHomePage/>}/>
        <Route path="Contact/" element={<SeperateContactMode/>}/>
          
      </Routes>

    </BrowserRouter>

  </Provider>

)