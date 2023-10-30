// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import {
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  fetchPokemon
} from '../pokemon'

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role='alert'>
      There was an error:{' '}
      <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function PokemonInfo({ pokemonName }) {
  const [state, setState] = React.useState({
    status: pokemonName ? 'pending' : 'idle',
    pokemon: null,
    error: null
  })

  React.useEffect(() => {
    if (!pokemonName) return

    setState({ status: 'pending' })

    fetchPokemon(pokemonName)
      .then((pokemon) => setState({ status: 'resolved', pokemon }))
      .catch((error) => setState({ status: 'rejected', error }))
  }, [pokemonName])

  switch (state.status) {
    default:
    case 'idle':
      return 'Submit a Pokémon'
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    case 'resolved':
      return <PokemonDataView pokemon={state.pokemon} />
    case 'rejected':
      throw state.error
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className='pokemon-info-app'>
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className='pokemon-info'>
        <ErrorBoundary
          resetKeys={[pokemonName]}
          FallbackComponent={ErrorFallback}
          onReset={handleReset}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
