'use client'
import { Bricolage_Grotesque } from 'next/font/google'
import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

const bricolage_800 = Bricolage_Grotesque({ subsets: ['latin'],weight: '800' })
const bricolage_500 = Bricolage_Grotesque({ subsets: ['latin'],weight: '500' })


export default function Home() {

  const [clock, setClock] = useState('25:00')
  const [session, setSession] = useState('25')
  const [breakLength, setBreakLenght] = useState(5)
  const [play, setPlay] = useState(false)
  const intervalId = useRef<ReturnType<typeof setInterval> | null>(null)
  const isPlaying = useRef(false)
  const isOnBreak = useRef(false)
  
  const audioFile= document.getElementById('beep') as HTMLVideoElement
  let breakStyle = isOnBreak.current ? 'text-indigo-500' : '';

  function handleDecrementSession() {
    if(Number(session) === 1) return;
    setSession(session => {
      let next = (Number(session) - 1).toString()
      return Number(next) < 10 ? '0' + next : next
    })
  }
  function handleIncreaseSession() {
    if(Number(session)===60) return;
    setSession(session => {
      let next = (Number(session) + 1).toString()
      return Number(next) < 10 ? '0' + next : next
    })
  }
  function handleDecrementBreak() {
    if(breakLength === 1) return;
    setBreakLenght(prev => prev -1)
  }
  function handleIncreaseBreak() {
    if(breakLength===60) return;
    setBreakLenght(prev => prev + 1)
  }

  function handleReset() {
    isPlaying.current = false;
    isOnBreak.current = false;
    setPlay(false);
    // setClock(session.toString() + ':00') comented for passing tests
    // on reset should set clock to the last session state, but tests want to set it always to 25
    setSession('25')
    setBreakLenght(5)
    clearInterval(Number(intervalId.current))
    intervalId.current = null;
  }

  function handlePlayPause() { 
    isPlaying.current = !isPlaying.current

    if (!play) {
      setClock(session.toString() + ':00')
      setPlay(true)
    }

    if (isPlaying.current) {
      intervalId.current = setInterval(() => {

        setClock(prev => {
          let [minutes, seconds] = getTime(prev);

          if (minutes === '00' && seconds === '00') {
            if (!isOnBreak.current) {
              isOnBreak.current = true;
              audioFile.play()
              return breakLength > 9 ? breakLength.toString() + ':00' : '0' + breakLength.toString() + ':00'
            } else {
              isOnBreak.current = false;
              return session.toString() + ':00';
            }
          }

          if (seconds === '00') { 
            seconds = '59';
            minutes = (Number(minutes) - 1).toString()
          } else { 
            seconds = (Number(seconds) -1).toString() 
          }
          if(Number(seconds) < 10) { 
            seconds = '0' + seconds;
          }
          if(Number(minutes) < 10) {
            minutes = '0' + Number(minutes);    
          }
          return minutes + ':' + seconds
        })
      }, 100)
    } else {
      clearInterval(Number(intervalId.current))
    }
  }

  function getTime(clock:string) : Array<string> {
    let minutes = clock.substring(0, clock.indexOf(':'))
    let seconds = clock.substring(clock.indexOf(':') + 1, clock.length)
    
    return [minutes, seconds]
  }

  return (
    <>
    <Script src='https://cdn.freecodecamp.org/testable-projects-fcc/v1/bundle.js'></Script>
    <main className={`h-screen flex flex-col items-center ${bricolage_800.className}`}>
      <h1 className='text-2xl mt-44'>Pomodoro clock</h1>
        <div className='flex justify-evenly w-full mt-16' id='menu'>
          <div className='flex flex-col items-center' id='session-wrapper'>
            <div id="session-label">session</div>
            <div id="clock-and-buttons" className='flex gap-10'>
              <button id='session-decrement' onClick={handleDecrementSession} className='text-3xl p-5'>-</button>
              <div id="session-length" className='text-5xl py-5 mr-2 w-10'>{session}</div>
              <button id='session-increment' onClick={handleIncreaseSession} className='text-3xl p-5'>+</button>
            </div>
          </div>
          <div className='flex flex-col items-center' id='break-wrapper'>
            <div id="break-label">break</div>
            <div id="break-and-buttons" className='flex gap-10'>
              <button id='break-decrement' onClick={handleDecrementBreak} className='text-3xl p-5'>-</button>
              {/* <div id="break-length" className='text-5xl py-5 w-10'>{breakLength > 9 ? breakLength : '0' + breakLength}</div> commented for passing tests*/}
              <div id="break-length" className='text-5xl py-5 w-10'>{breakLength}</div>
              <button id='break-increment' onClick={handleIncreaseBreak} className='text-3xl p-5'>+</button>
            </div>
          </div>
        </div>
        <div className={`flex flex-col items-center ${breakStyle}`} id='break-wrapper'>
            <div id="timer-label" >{isOnBreak.current ? 'break' : 'clock'}</div>
            <div id="time-left" className='text-8xl'>
              {play ? clock : session + ':00'}
            </div>
        </div>
        <div className='flex gap-10 mt-2' id="controls">
          <button id="start_stop" onClick={handlePlayPause}>play/pause</button>
          <button  id="reset" onClick={handleReset}>reset</button>
          <audio src='https://cdn.freesound.org/previews/86/86991_1326056-lq.mp3' id='beep'/>
        </div>
    </main>
    </>
  )
}
