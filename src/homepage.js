
import React from 'react';
import { GetHost } from './components' 

function IntroHomePage(){
    const [cssLoaded, setCssLoaded] = React.useState(false);
    var [images, Update_images] = React.useState([])
    async function GetImages(){

        const images = await fetch(GetHost()+'/GetIcon/MainPageImages/ForMainPage/')
        const response = await images.json()
        Update_images(Main=>response.MainPageImages)

    }

    const RedirectToMainPage = ()=> setTimeout(() => {
        window.location.pathname='../Main'
    }, 333);

    async function GetallStyles(){
        const cssFile = await import('./HomePage/assets/css/main.css')
        if(setCssLoaded)
            setCssLoaded(Main=>true)
    } 

    React.useEffect(Main=>{
        GetallStyles()
        GetImages()
        
    }, [])
    if (cssLoaded)

    return (

        <div >
          <div  id="page-wrapper">

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

        <div id="banner-wrapper">
        <div id="banner" className="box container">
        <div className="row">
        
        <div className="col-7 col-12-medium">
            <h2>Welcome !</h2>
                <img id="arrowSignal" src="https://djangostaticfileshub.s3.eu-north-1.amazonaws.com/curve-down-arrow.png"/>
                <button onClick={RedirectToMainPage} id="RedirectButton">Find the Best Laptop For Yourself!</button>
        </div>

        <div className="col-5 col-12-medium">
            
        </div>
        </div>
        </div>
        </div>

        <div id="features-wrapper">
        <div className="container">
        <div className="row">
        <div className="col-4 col-12-medium">

            <section className="box feature">
            <a className="image featured"><img src={images[0]} alt="" /></a>
            <div className="inner">
                <header>
                <h2>Dell XPS Premium Laptops</h2>
  
                </header>
                <p>Dell has been one of the top premium laptop manifacturers today and as well as our business sponsor!</p>
            </div>
            </section>

        </div>
        <div className="col-4 col-12-medium">


            <section className="box feature">
            <a className="image featured"><img src={images[1]} alt="" /></a>
            <div className="inner">
                <header>
                <h2>HP Spectre x360 series</h2>
     
                </header>
                <p>Introducing the extraordinary HP Spectre x360 with the groundbreaking Ryzen 6000 series CPU! Prepare to be amazed by its unparalleled performance and unrivaled versatility</p>
            </div>
            </section>

        </div>
        <div className="col-4 col-12-medium">

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


        <div id="main-wrapper">
        <div className="container">
        <div className="row gtr-200">
        <div className="col-4 col-12-medium">


            <div id="sidebar">
            <section className="widget thumbnails">

                <button className="btn btn-secondary"> About Mansur Davlatov</button>
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
                <p>Explore the best laptops you could find in the current tech industry, while being cheap as it is, our service also features free delivery if you do a purchase worth of over $999, so make sure you do not miss out this opportunity !</p>
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
</div>
    );
}


export default IntroHomePage;