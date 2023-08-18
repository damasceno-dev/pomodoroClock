'use client'
import { Bricolage_Grotesque } from 'next/font/google'
import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

const bricolage_800 = Bricolage_Grotesque({ subsets: ['latin'],weight: '800' })
const bricolage_500 = Bricolage_Grotesque({ subsets: ['latin'],weight: '500' })


export default function Home() {

  const [session, setSession] = useState(25)
  const [breakLength, setBreakLenght] = useState(5)
  const [clock, setClock] = useState('25:00')
  const [play, setPlay] = useState(false)
  const intervalId = useRef<ReturnType<typeof setInterval> | null>(null)
  // : ReturnType<typeof setInterval>;

  useEffect(() => {
    if (play) {
      intervalId.current = setInterval(() => {
        let [minutes, seconds] = getTime(clock);
        console.log(clock)
        console.log(minutes)
        console.log(seconds)
        if (seconds === '00') { 
          seconds = '59';
          minutes = (Number(minutes) - 1).toString()
        } else { 
          seconds = (Number(seconds) -1).toString() 
        }
        if(Number(seconds) < 9) {
          seconds = '0' + seconds;
        }
        if(Number(minutes) < 9) {
          minutes = '0' + minutes; 
        }
        console.log(minutes)
        console.log(seconds)
        setClock(minutes + ':'+ seconds)
      }, 1000);
      console.log(intervalId)
    }
  } , [play,clock])

  function handleDecrementSession() {
    if(session === 1) return;
    setSession(session => session - 1)
    setClock(session.toString() + ':00')
  }
  function handleIncreaseSession() {
    if(session===60) return;
    setSession(session => session + 1)
    setClock(session.toString() + ':00')
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
    setPlay(false);
    setClock(session.toString() + ':00')
    setBreakLenght(5);
    console.log(intervalId)
    clearInterval(Number(intervalId.current))
    intervalId.current = null;
  }

  function handlePlayPause() {
    if (play) {
      clearInterval(Number(intervalId.current))
    }
    setPlay(!play)
  }

  function updateClock() {

    let [minutes, seconds] = getTime(clock);
    console.log(clock)
    console.log(minutes)
    console.log(seconds)
    if (seconds === '00') {
      seconds = '59';
      minutes = (Number(minutes) - 1).toString()
    } else { 
      seconds = (Number(seconds) -1).toString() 
    }
    console.log(minutes)
    console.log(seconds)
    setClock(minutes + ':'+ seconds)
      // if (date.getSeconds() === 0) {
      //   if (session === 0) {
      //     //play audio
      //     setPlay(!play)
      //   } else {
      //     setClock((_) => {
      //       date.setSeconds(date.getSeconds() -1)
      //       return date.getMinutes().toString() + ':' + date.getSeconds().toString()
      //     })
      //     setSession(session => session -1)
      //   }
      // } else {
      //   setClock(seconds => {
      //     let numberSeconds = seconds === '00' ? 60 : Number(seconds)
      //     return (numberSeconds - 1).toString()
      //   })
      // }
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
            <div id="session-length">session</div>
            <div id="clock-and-buttons" className='flex gap-10'>
              <button onClick={handleDecrementSession} className='text-3xl p-5'>-</button>
              <div className='text-5xl py-5 mr-2 w-10' id="session-clock">{session > 9 ? session : '0' + session}</div>
              <button onClick={handleIncreaseSession} className='text-3xl p-5'>+</button>
            </div>
          </div>
          <div className='flex flex-col items-center' id='break-wrapper'>
            <div id="break-session">break</div>
            <div id="break-and-buttons" className='flex gap-10'>
              <button onClick={handleDecrementBreak} className='text-3xl p-5'>-</button>
              <div className='text-5xl py-5 w-10' id="break-clock">{breakLength > 9 ? breakLength : '0' + breakLength}</div>
              <button onClick={handleIncreaseBreak} className='text-3xl p-5'>+</button>
            </div>
          </div>
        </div>
        <div className='flex flex-col items-center' id='break-wrapper'>
            <div id="clock">clock</div>
            <div className='text-8xl' id="clock">
              {play ? clock : 
              session > 9 ? session + ':00' : '0' + session + ':00'
              }
              
            </div>
        </div>
        <div className='flex gap-10 mt-2' id="controls">
          <button onClick={handlePlayPause}>play/pause</button>
          <button onClick={handleReset}>reset</button>
        </div>
    </main>
    </>
  )
}
