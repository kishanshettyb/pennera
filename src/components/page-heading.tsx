import React from 'react'
type HeadingProps = {
  title: string
  desc?: string
}

function PageHeading({ title, desc }: HeadingProps) {
  return (
    <div className="text-center">
      <h2 className="text-2xl lg:text-3xl font-semibold mb-4">{title}</h2>
      <p className="mb-5 text-sm lg:text-md text-slate-700">{desc}</p>
    </div>
  )
}

export default PageHeading
