import React, {useState, useRef, useEffect} from 'react';
import image from './images/RhinoProgressBar.png'; 
import ConfettiGenerator from "confetti-js";

function App() { 
  /*Css for the progress bar. Sets the width, height, and image.*/
  const [style, setStyle] = useState({
    width: "1552px",
    height: "811px",
    backgroundImage:`url(${image})`
  })

  /*Css for the confetti which is wrapped inside a canvas.*/
  const canvasStyle = {
    width: "1552px",
    height: "811px"
  }

  /*Css for the progress bar's shadow, a clone of the progress bar with its opacity turned down.
  Stays stationary; width and height stay the same.*/
  const [outlineStyle, setOutlineStyle] = useState({
    width: "1552px",
    height: "811px",
    backgroundImage:`url(${image})`,
    opacity: "25%"
  })

  /*Maximum width the progress bar can go.
  This is the width of the provided image.*/
  var maxWidth = 1552

  /*donationGoal is the target goal for donations.*/
  const [donationGoal, setDonationGoal] = useState(0)
  /*width is the current width of the progress bar.*/
  const [width, setWidth] = useState(0)
  /*targetWidth is the width that the progress bar must be at.*/
  const [targetWidth, setTargetWidth] = useState(0)
  /*speed is the rate at which the width updates to equal targetWidth.*/
  const [speed, setSpeed] = useState(5)
  /*canAnimate governs whether or not width can update to equal targetWidth.*/
  const [canAnimate, setCanAnimate] = useState(true)
  /*canConfetti governs whether or not confetti can be activated.
  This is to ensure that confetti is not enabled multiple times.*/
  const [canConfetti, setCanConfetti] = useState(true)

  /*sleep makes the program wait a certain amount of time in milliseconds.*/
  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  /*useEffect runs every frame*/
  useEffect(() => {
    /*updateImage changes only the width of style with the global variable width.*/
    const updateImage = () => {
      setStyle(previousState => {
        return { ...previousState, width: width.toString() + "px" }
      });
    }

    /*updateOutline sets the opacity of outlineStyle to 100%.
    This only runs once when width is equal to maxWidth.
    This is done because confetti is a child of the progress bar's shadow.
    Without it the confetti would be 75% transparent.*/
    const updateOutline = () => {
      setOutlineStyle(previousState => {
        return { ...previousState, opacity: "100%" }
      });
    }

    /*animate sets width equal to targetWidth over time.
    This creates the allusion that the width is animated/moving.
    animate is also responsible for enabling the confetti and calling
    updateOutline when width equals maxWidth.*/
    const animate = async () => {
      if(canAnimate && width < targetWidth){
        setCanAnimate(false)
        await sleep(10)
        setWidth(width + speed)
        setSpeed(speed + 0.5)
        setCanAnimate(true)
      }
      else if( (width >= maxWidth) && canConfetti )
      {
        setCanConfetti(false)
        updateOutline()
        var confettiSettings = { target: 'my-canvas', size: "5" };
        var confetti = new ConfettiGenerator(confettiSettings);
        confetti.render();
      }
      else if(width >= targetWidth)
      {
        //Resets speed when width equals targetWidth and sets width to targetWidth.
        setSpeed(5)
        setWidth(targetWidth)
      }
    }

    animate()
    updateImage()
  })

  /*Variables for assigning id's to HTML containers.*/
  const donationInputField = useRef()
  const pBar = useRef() //progress bar id
  const outline = useRef() //progress bar's shadow id

  //sets the donationGoal.
  function setDonationGoalButton(){
    setWidth(0)

    let result = donationInputField.current.value
    setDonationGoal(result)
  }

  //Sets targetWidth.
  function Donate(){
    if(donationGoal <= 0){ //Alert the user and return if there is no donation goal.
      alert("Donation Goal not set, please set one")
      return
    }

    //Takes the users donation and divides by the donation goal to get the percentage amount the user is donating.
    const donationAmount = donationInputField.current.value
    var percentage = donationAmount / donationGoal

    /*Converts the percentage into the pixel length of that percentage in relation to the maximum width of the image 
    and adds that to the width to create a new variable called newWidth*/
    let newWidth = width + (maxWidth * percentage)

    if(newWidth >= maxWidth){
      setTargetWidth(maxWidth) //Sets targetWidth to maxWidth since newWidth exeeds maxWidth. Animate then sets width to targetWidth over a period of time.
    }
    else{
      setTargetWidth(newWidth) //Sets targetWidth to newWidth. Animate then sets width to targetWidth over a period of time.
    }
  }

  //Returns JSX to the main file for rendering
  return (
    <> {/*empty container with children containers since return can only return one element.
    Returns the progress bar, shadow, user input field, and buttons for donating and setting a donation goal.*/}
      <div ref={pBar} style={style}>
        <div ref={outline} style={outlineStyle}>
          <canvas id="my-canvas" style={canvasStyle}></canvas>
        </div>
      </div>
      <input type="number" ref={donationInputField}/>
      <button onClick={Donate}>Donate</button>
      <button onClick={setDonationGoalButton}>Set Donation Goal</button>
    </>
  );
}

export default App;