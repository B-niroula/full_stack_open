import { useState, useEffect } from 'react'
import phoneBookService from './services/phonebook'

const Filter = ({filterText, handleFilterChange}) => {
  return(
  <div>
    filter shown with <input value={filterText} onChange={handleFilterChange} />
  </div>
)
}
const PersonForm = (props) => {
  const {addName, newName, handleNameChange, newNumber, handleNumberChange} = props
  return (
  <form onSubmit={addName}>
        <div>
          <h2>Add a new</h2>
          name: <input value={newName} onChange={handleNameChange} />
          <br />
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}
const Persons = ({persons, handlePersonDelete}) => {
  return(
    <div>
    {persons.map(p =>
    <div key={p.id}> 
      <span>{p.name} {p.number}</span>&nbsp;&nbsp;
      <button onClick={() => handlePersonDelete(p.id, p.name)}>delete</button>
    </div>
    )}
    </div>
  )
}
const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('add')
  const [newNumber, setNewNumber] = useState('')
  const [filterText, setFilterText] = useState('')
  const filteredPersons = persons.filter(person => person.name?.toLowerCase().includes(filterText.toLowerCase()))

  useEffect(() => {
    phoneBookService.getAll().then(response => setPersons(response))
  }, [])

  const addName = (event) => {
    event.preventDefault()
    
    const personObject = {
      name : newName,
      number: newNumber
    }
    const nameExists = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())

    if (nameExists) {
      if (window.confirm(`${newName} is already in the Phonebook. Do you want to update the phone number?`)) {
        const updatedPerson = {...nameExists, number: newNumber}

        phoneBookService
          .update(nameExists.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== nameExists.id? p : returnedPerson))
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            alert(`Failed to update ${newName}'s number: ${error.message}`)
          })
      }
      return
    }
    phoneBookService
      .create(personObject)
      .then(addedPerson => {
        setPersons(persons.concat(addedPerson))
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        alert(`Failed to add ${newName} to the Phonebook: ${error.message}`)
      })
      
    
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setFilterText(event.target.value)
  }
  const handlePersonDelete = (id, name) => {
    if (window.confirm(`Delete ${name} for sure?`)) {
      phoneBookService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          alert(`${name} has already been deleted from the server: ${error.message}`)
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterText={filterText} handleFilterChange={handleFilterChange} />
      <PersonForm
        addName={addName} 
        newName={newName} 
        handleNameChange={handleNameChange}
        newNumber={newNumber} 
        handleNumberChange={handleNumberChange} 
      />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} handlePersonDelete={handlePersonDelete}/>
    </div>
  )
}

export default App