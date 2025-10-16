import { Route, Routes } from 'react-router-dom'

export default function RouterSetup() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<></>}></Route>
      </Routes>
    </div>
  )
}
