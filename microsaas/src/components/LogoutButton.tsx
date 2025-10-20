'use client'

import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const response = await fetch('/logout', {
      method: 'POST',
    })
    
    if (response.ok) {
      router.push('/login')
      router.refresh()
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="border px-4 py-2 text-sm hover:bg-gray-50"
    >
      Logout
    </button>
  )
}

