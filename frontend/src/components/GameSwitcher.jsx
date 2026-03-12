import { useEffect, useState } from "react"
import Leaderboard from "./Leaderboard"
import ConfettiEffect from "./ConfettiEffect"

export default function GameSwitcher({ gameData }) {

  const games = ["NFS", "ALTOS", "SUBWAY"]

  const [currentGameIndex, setCurrentGameIndex] = useState(0)
  const [previousTop, setPreviousTop] = useState(null)
  const [triggerConfetti, setTriggerConfetti] = useState(false)

  useEffect(() => {

    const interval = setInterval(() => {

      setCurrentGameIndex((prev) => (prev + 1) % games.length)

    }, 7000)

    return () => clearInterval(interval)

  }, [])

  const currentGame = games[currentGameIndex]
  const scores = gameData[currentGame] || []

  useEffect(() => {

    if(scores.length > 0){

      const newTop = scores[0].name

      if(previousTop && previousTop !== newTop){
        setTriggerConfetti(true)

        setTimeout(() => setTriggerConfetti(false), 2000)
      }

      setPreviousTop(newTop)

    }

  }, [scores])

  return (

    <div className="flex flex-col items-center">

      <ConfettiEffect trigger={triggerConfetti} />

      <Leaderboard
        title={`${currentGame} Leaderboard`}
        scores={scores}
      />

    </div>

  )

}