import React, {useState, useRef, useEffect} from 'react';
import image from './images/RhinoProgressBar.png'; 
import ConfettiGenerator from "confetti-js";
//Test

function App() { 
  const [style, setStyle] = useState({
    width: "1552px",
    height: "811px",
    backgroundImage:`url(${image})`
  })

  const canvasStyle = {
    width: "1552px",
    height: "811px"
  }

  const [outlineStyle, setOutlineStyle] = useState({
    width: "1552px",
    height: "811px",
    backgroundImage:`url(${image})`,
    opacity: "25%"
  })

  var maxWidth = 1552

  const [donationGoal, setDonationGoal] = useState(0)
  const [width, setWidth] = useState(0)
  const [targetWidth, setTargetWidth] = useState(0)
  const [speed, setSpeed] = useState(5)
  const [canAnimate, setCanAnimate] = useState(true)
  const [canConfetti, setCanConfetti] = useState(true)

  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  useEffect(() => {
    const updateImage = () => {
      setStyle(previousState => {
        return { ...previousState, width: width.toString() + "px" }
      });
    }

    const updateOutline = () => {
      setOutlineStyle(previousState => {
        return { ...previousState, opacity: "100%" }
      });
    }

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
        setSpeed(5)
        setWidth(targetWidth)
      }
    }

    animate()
    updateImage()
  })

  const donationInputField = useRef()
  const pBar = useRef()
  const outline = useRef()

  function setDonationGoalButton(){
    setWidth(0)

    let result = donationInputField.current.value
    setDonationGoal(result)
  }

  function Donate(){
    if(donationGoal <= 0){
      alert("Donation Goal not set, please set one")
      return
    }

    const donationAmount = donationInputField.current.value
    var percentage = donationAmount / donationGoal

    let newWidth = width + (maxWidth * percentage)

    if(newWidth >= maxWidth){
      setTargetWidth(maxWidth)
    }
    else{
      setTargetWidth(newWidth)
    }
  }

  return (
    <>
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