import { useState } from 'react'

const Button = ({handleClick, text}) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const StatisticLine = ({text, value}) => {
  return (
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
  )
}

const Statistics = ({good, neutral, bad }) => {
  const all = good + neutral + bad
  const average = (good - bad) / all
  const positive = (good / all) * 100

  if (all === 0) {
    return (
      <div>No feedbacks given yet</div>
    ) 
  } return (
    <table>
      <tbody>
        <StatisticLine text={"good "} value={good} />
        <StatisticLine text={"neutral "} value={neutral} />
        <StatisticLine text={"bad "} value={bad} />
        <StatisticLine text={"all "} value={all} />
        <StatisticLine text={"average "} value={average} />
        <StatisticLine text={"positive "} value={positive + "%"} />
      </tbody>
    </table>
  )
}


const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
    console.log(good)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
    console.log(neutral)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
    console.log(bad)
  }

  return (
  <div>
    <h1>give feedback</h1>
    <Button handleClick={handleGoodClick} text={"good"} />
    <Button handleClick={handleNeutralClick} text={"neutral"} />
    <Button handleClick={handleBadClick} text={"bad"} />
    <h2>statistics</h2>
    <Statistics good={good} neutral={neutral} bad={bad} />

  </div>
  )
}

export default App