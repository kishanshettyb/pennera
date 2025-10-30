'use client'
import { useEffect } from 'react'

const EmbedForm = ({ id }: { id: string }) => {
  useEffect(() => {
    // Ensure the script is only loaded once
    const script = document.createElement('script')
    script.src = 'https://server.fillout.com/embed/v1/'
    script.async = true
    document.body.appendChild(script)

    // Cleanup the script on unmount
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div
      style={{ width: '100%', height: '500px' }}
      data-fillout-id={id}
      data-fillout-embed-type="standard"
      data-fillout-inherit-parameters
      data-fillout-dynamic-resize
    ></div>
  )
}

export default EmbedForm
