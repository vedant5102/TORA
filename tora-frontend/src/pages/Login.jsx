import React from 'react'
import { Link } from 'react-router-dom'

export default function Login(){
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md card">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input className="w-full mb-3 p-2 rounded bg-[#08101a]" placeholder="Email" />
        <input className="w-full mb-3 p-2 rounded bg-[#08101a]" placeholder="Password" type="password" />
        <button className="w-full button bg-green-600 mb-3">Login</button>
        <div className="text-sm text-slate-400">Don't have an account? <Link to='/signup' className="text-green-400">Signup</Link></div>
      </div>
    </div>
  )
}
