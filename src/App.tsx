import { Combobox } from './components/Combobox'
import { FRUITS } from './components/Combobox/data.ts'

function App() {
  return (
    <main>
      <h1>Accessible Components Kit</h1>
      <section>
        <h2>Combobox</h2>
        <Combobox label="Favorite fruit" options={FRUITS} />
      </section>
    </main>
  )
}

export default App
