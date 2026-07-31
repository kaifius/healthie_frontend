import { Board } from './components/Board'
import { seedBoard } from './data/seedBoard'

function App() {
  return <Board initialBoard={seedBoard} />
}

export default App
