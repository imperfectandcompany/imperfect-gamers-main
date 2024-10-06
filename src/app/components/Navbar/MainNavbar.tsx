import React, { useState, useRef } from 'react'
import MenuToggle from './MenuToggle'
import NavList from './NavList'
import RedirectMessage from './RedirectMessage'

function MainNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const [countdown, setCountdown] = useState(3)
  let redirectTimeout = useRef<number | null>(null)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleRedirect = (url: string) => {
    if (!redirecting) {
      setRedirecting(true)
      setCountdown(3)
      redirectTimeout.current = window.setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount <= 1) {
            if (redirectTimeout.current !== null) {
              clearInterval(redirectTimeout.current)
            }
            window.location.href = url
            return 0
          }
          return prevCount - 1
        })
      }, 1000)
    }
  }

  const cancelRedirect = () => {
    if (redirectTimeout.current !== null) {
      clearInterval(redirectTimeout.current)
    }
    setRedirecting(false)
    setIsOpen(false)
  }

  return (
    <nav className="relative">
      <MenuToggle isOpen={isOpen} redirecting={redirecting} toggleMenu={toggleMenu} cancelRedirect={cancelRedirect} />
      {redirecting ? (
        <RedirectMessage countdown={countdown} cancelRedirect={cancelRedirect} />
      ) : (
        <NavList isOpen={isOpen} redirecting={redirecting} handleRedirect={handleRedirect} />
      )}
    </nav>
  )
}

export default MainNavbar