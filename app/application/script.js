import React, { useEffect } from 'react';
import { render } from 'react-dom';
import { useState } from 'react';

const { ipcRenderer } = window.require('electron');

const App = () => {
  const handleClose = () => {
    ipcRenderer.send('app-quit');
  };

  const [isStarted, setIsStarted] = useState(false);
  const [isRest, setIsRest] = useState(false);

  const [time, setTime] = useState(30);
  const [isRunning, setIsRunning] = useState(false);

  const playBell = () => {
    const bell = new Audio('./sounds/bell.wav');
    bell.play();
  }

  const Start = () => {
    setIsStarted(true);
    setIsRunning(true);
  }

  const Stop = () =>{
    setIsStarted(false);
    setIsRunning(false);
    setTime(1200);
  }

  useEffect(() => {
    let timer;

    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning]);

  const formatTime = (time) => {
    if (time > 60) {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
  
      if (seconds === 0) {
        return `${minutes}:00`;
      }
      if (seconds < 10) {
        return `${minutes}:0${seconds}`;
      }
      return `${minutes}:${seconds}`;
    } else {
      if (time < 10) {
        return `0${time}`;
      }
      return `${time}`;
    }
  };

  if(time == 0){
    playBell();
    setTime(20);
    setIsRest(true);
  }

  if(time == 0 && isRest === true){
    setTime(1200);
    setIsRest(false);
    playBell();
  }

  return (
    <div>
      <div className={isStarted ? 'hidden' : 'shown'}>
        <h1>Protect your eyes</h1>
        <p>According to optometrists in order to save your eyes, you should follow the 20/20/20. It means you should to rest your eyes every 20 minutes for 20 seconds by looking more than 20 feet away.</p>
        <p>This app will help you track your time and inform you when it's time to rest.</p>
        <button className="btn" onClick={() => Start()}>Start</button>
        <button className="btn btn-close" onClick={() => handleClose()}>X</button>
      </div>
      <div className={isStarted ? 'shown' : 'hidden'}>
        <img src="./images/work.png" className={isRest ? 'hidden' : ''} />
        <img src="./images/rest.png" className={isRest ? '' : 'hidden'} />
        <div className="timer">
          {formatTime(time)}
        </div>
        <button className="btn" onClick={() => Stop()}>Stop</button>
      </div>
    </div>
  )
};

render(<App />, document.querySelector('#app'));
