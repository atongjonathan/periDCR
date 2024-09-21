import React, { createContext, useState } from 'react'


export const MessageContext = createContext()

export const MessageProvider = ({ children }) => {
  const [showToast, setShowToast] = useState(false)
  const [variant, setVariant] = useState("")
  const [message, setMessage] = useState("")
  const [notify, setNotify] = useState(false)
  const [anchorLink, setAnchorLink] = useState(false)
  const [anchorText, setAnchorText] = useState(false)
  const [pText, setPText] = useState(false)
  const [header, setHeader] = useState(false)
  const dismiss = 2000

  function showToaster(variant, message) {
    setVariant(variant)
    setMessage(message)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, dismiss);

  }
  function showNotification(header, pText, anchorText, anchorLink) {
    setNotify(true)
    setHeader(header)
    setPText(pText)
    setAnchorLink(anchorLink)
    setAnchorText(anchorText)

  }

  return (
    <MessageContext.Provider value={{ variant, message, showToast, showToaster, notify, header, pText, anchorLink, anchorText, showNotification }}>{children}</MessageContext.Provider>
  )
}
