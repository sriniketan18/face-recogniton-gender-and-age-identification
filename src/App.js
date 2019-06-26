import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';

//You must add your own API key here from Clarifai.
const app = new Clarifai.App({
 apiKey: '7dbd55fce6bd41a890e04da4d7df7179'
});

const particlesOptions = {
  particles: {
    number: {
      value: 500,
      density: {
        enable: false,
      }
    },
    size: {
            value: 5,
            random: true,
             anim: {
                  speed: 4,
                  size_min: 0.3
              }
          },
          move: {
              random: true,
              speed: 1,
              direction: "top",
              out_mode: "out"
          },
          line_linked: {
              enable: false
          }
  },
  interactivity: {
          events: {
               onclick: {
                  enable: true,
                  mode: "repulse"
              },
               onhover: {
                  enable: true,
                  mode: "bubble"
              }
          },
          modes: {
             bubble: {
                  distance: 250,
                  duration: 2,
                  size: 0,
                  opacity: 0
              },
              repulse: {
                  distance: 400,
                  duration: 4
              }
          }
          }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
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

  calculateFaceLocation = (data) => {
    
    
    // const clarifaiFace2 = data.outputs[0].data.concepts[0].name;
     const clarifaiFace1 = data.outputs[0].data.regions[0].data.face.gender_appearance.concepts[0].name;
      const clarifaiFace2 = data.outputs[0].data.regions[0].data.face.age_appearance.concepts[0].name;
      const clarifaiFace3 = data.outputs[0].data.regions[0].data.face.multicultural_appearance.concepts[0].name;
      console.log(clarifaiFace2);
      if(clarifaiFace1==='feminine') {
        alert("gender=female and age="+clarifaiFace2+"and multicultural appearance="+clarifaiFace3);
      }
      else {
        alert("gender=male and age="+clarifaiFace2+"and multicultural appearance="+clarifaiFace3);
      }
    // alert(clarifaiFace2);
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models
      .predict(
        Clarifai.DEMOGRAPHICS_MODEL,
        this.state.input)
      .then(response => {
        if (response) {
          fetch('http://10.112.75.104:3002/image', {
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
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
         <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home'
          ? <div>
              <Logo />
              <Rank
                name={this.state.user.name}
                entries={this.state.user.entries}
              />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          : (
             route === 'signin'
             ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
             : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;

/*
class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
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

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
   // const clarifaiFace1 = data.outputs[0].data.regions[0].data.face.gender_appearance.concepts[0].name;
   // console.log(clarifaiFace1);
    const image = document.getElementById('inputimage');
    
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)

      /*leftCol1: clarifaiFace1.left_col * width,
      topRow1: clarifaiFace1.top_row * height,
      rightCol1: width - (clarifaiFace1.right_col * width),
      bottomRow1: height - (clarifaiFace1.bottom_row * height) */


