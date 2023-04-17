import React from 'react'
import UserModal from '../../components/modals/user modal/UserModal'
import { MusicContext } from '../../context/MusicContext'

const Users = () => {
  const [users, setUsers] = React.useState([])
  const [errors, setErrors] = React.useState(null)
  const allUsers = React.useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/users', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })

      const json = await response.json()
      if (!response.ok) {
        setErrors(json.error)
        return
      }

      if (response.ok) {
        setUsers(json.users)
      }
    }
    fetchUsers()
  }, [])

  const [searchTerm, setSearchTerm] = React.useState('')
  const filteredUser = users.filter(
    user =>
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const {
    displayMusicBar,
    updateDisplayMusicBar,

    currentSong,
    updateCurrentSong,
    isPlay_Global,
    toggleIsPlay_G,
    setIsPlay_Global
  } = React.useContext(MusicContext)
  React.useEffect(() => {
    if (displayMusicBar == true) {
      setIsPlay_Global(false)
      updateDisplayMusicBar(false)
    }
  }, [])
  return (
    <div className='container'>
      <h1 className='text-light'>User Manager</h1>
      <input
        type='text'
        className='form-control mb-3'
        placeholder='Search by name or email'
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)} // Update search term state
      />
      {filteredUser?.length > 0 && (
        <>
          <table class='table table-dark table-bordered '>
            <thead>
              <tr>
                <th scope='col'>ID</th>
                <th scope='col'>IMG</th>
                <th scope='col'>NAME</th>
                <th scope='col'>Email</th>
                <th scope='col'>EDIT</th>
              </tr>
            </thead>
            <tbody>
              {filteredUser?.map(user => (
                <tr key={user._id}>
                  <th scope='row'>{user._id}</th>
                  <th>
                    <img src={user.imageURL} width={'50px'} alt='' />
                  </th>
                  <th>{user.displayName}</th>
                  <th>{user.email}</th>
                  <th>
                    <UserModal user={user} />
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}

export default Users
