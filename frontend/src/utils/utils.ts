import { useEffect, useRef, useState } from 'react'
import { signout } from '../services/authService'
import { TUser } from '../routes/Profile'

export type Session = {
  token: string
  user: TUser
}

function createHandleFromEmail(email: string) {
  const index = email.indexOf('@')
  return '@' + email.slice(0, index)
}

function authenticate(jwt: Session, cb: () => void) {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('jwt', JSON.stringify(jwt))
  }
  cb()
}

function isAuthenticated() {
  if (typeof window == 'undefined') return false
  if (sessionStorage.getItem('jwt')) return JSON.parse(sessionStorage.getItem('jwt'))
  else return false
}

function clearJWT(cb) {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('jwt')
  }
  cb()
  signout().then(() => {
    document.cookie = 't=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  })
}

function useInView(options?: IntersectionObserverInit) {
  const [hasBeenViewed, setHasBeenViewed] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)
  const current = ref.current

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasBeenViewed) {
        setHasBeenViewed(true)
      }
    }, options)

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (current) {
        observer.unobserve(current)
      }
    }
  }, [options, hasBeenViewed, current])

  return { ref, hasBeenViewed }
}

function formatDate(timestamp: Date) {
  const date = new Date(timestamp)
  const month = date.toLocaleString('en-US', { month: 'short' })
  const day = date.getDate()
  return `${month} ${day}`
}

function formatDateAndTime(timestamp) {
  const date = new Date(timestamp);
  
  // Format time (9:55 PM)
  const timeFormatted = date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  // Format date (Dec 13 2024)
  const dateFormatted = date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  // Combine with middle dot
  return `${timeFormatted} · ${dateFormatted}`;
}

export default { authenticate, isAuthenticated, clearJWT }
export { createHandleFromEmail, useInView, formatDate, formatDateAndTime }
