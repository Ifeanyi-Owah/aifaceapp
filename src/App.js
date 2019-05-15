import React, {Component} from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognitionImage from './components/FaceRecognitionImage/FaceRecognitionImage';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Signup from './components/Signup/Signup';
import Logo from './components/Logo/Logo';
import InputForm from './components/InputForm/InputForm';
import Rank from './components/Rank/Rank';
import './App.css';
import 'tachyons';

const app = new Clarifai.App({
  apiKey: 'b33c431cf31249f9a69d723c018dc176'
 });

const particlesPatterns = {
particles: {
   number : {
     value: 30,
     density: {
       enable:true,
       value_area:800
     }
   }
  }
}

const initialState = {
    input: '',
    imageUrl: '',
    faceLocation:{},
    route:'signin',
    isSignedIn: false,
    user: {
      id:'',
      name:'',
      email:'',
      entries:0,
      joined:''
    }
  }



class App extends Component {
  constructor(){
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calFaceLocation = (data) =>{
   const clarifaiFaceData = data.outputs[0].data.regions[0].region_info.bounding_box;
   const image = document.getElementById('inputImageUrl');
   const width = Number(image.width);
   const height = Number(image.height);
   console.log(width, height);
   return {
     leftCol: clarifaiFaceData.left_col * width,
     topRow: clarifaiFaceData.top_row * height,
     rightCol: width - (clarifaiFaceData.right_col * width),
     bottomRow: height - (clarifaiFaceData.bottom_row * height)
   }
  }

  displayFaceBox = (faceLocation) => {
    // console.log
    this.setState({faceLocation:faceLocation})
  }

  handleChange = (event) => {
    this.setState({input: event.target.value});
  }

  handleClick = (event)=>{
    // this.setState({imageUrl:input});
    event.preventDefault();
    this.setState({imageUrl: this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })
          }
        this.displayFaceBox(this.calFaceLocation(response))
      })
      .catch(err => console.log(err));
}

onRouteChange = (route) => {
  if(route === 'signout') {
    this.setState(initialState)
  }else if (route === 'home'){
    this.setState({isSignedIn:true})
  }
  this.setState({route: route});
}
  
  render(){
    const {isSignedIn, imageUrl, route, faceLocation} = this.state;
    return (
      <div className="App">
        <Particles className="particles" params = {particlesPatterns}/>
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        {route === 'home' ?
         <div>
         <Logo />
         <Rank 
            name={this.state.user.name}
            entries={this.state.user.entries}
            />
         <InputForm 
         handleChange ={this.handleChange} 
         handleClick={this.handleClick}/>
        <FaceRecognitionImage faceLocation={faceLocation} imageUrl={imageUrl}/>
        </div>
        :(
         route === 'signin' 
         ? <Signin loadUser={this.loadUser} onRouteChange = {this.onRouteChange}/>
         : <Signup loadUser={this.loadUser} onRouteChange = {this.onRouteChange}/>
        )
       
        }
      </div>
    );
  }
}

export default App;
