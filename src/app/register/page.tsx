import { SignupForm } from '@/components/signup-form'
import React from 'react'

function RegisterPage() {
  return (
    <section className="py-40">
      <div className="w-full py-10 mx-auto px-4 sm:px-6 sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1560px] 2xl:max-w-[1560px] flex flex-col items-center justify-between">
        <h2 className="text-3xl text-center font-semibold mb-5">Create your Account</h2>
        <div className="w-full lg:w-2/5 ">
          <SignupForm />
        </div>
      </div>
    </section>
  )
}

export default RegisterPage
