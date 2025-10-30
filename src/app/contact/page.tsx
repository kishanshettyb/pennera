import EmbedForm from '@/components/contactform'
import SmallBanner from '@/components/small-banner'
import {
  Building,
  Facebook,
  Instagram,
  Mail,
  Phone,
  ThumbsUp,
  Twitter,
  Youtube
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function ConatactPage() {
  return (
    <div>
      <SmallBanner title="Contact Us" image="/banner/banner-categories.png" />
      <div className="w-full mx-auto px-4 sm:px-6 sm:max-w-[540px] py-20 md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1560px] 2xl:max-w-[1560px]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 justify-center items-center lg:flex-row">
          <div className="w-full  ">
            <div className="rounded-2xl border   p-10  h-auto lg:h-[650px] bg-white shadow-2xl shadow-amber-50">
              <p className="text-xs font-bold mb-1"> We&apos;re here to help you!</p>
              <h2 className="mb-10 font-semibold text-start text-3xl">Let&apos;s get in touch</h2>
              <h3 className="text-x flex gap-2 justify-start items-center mb-3 font-semibold">
                <Building size="20" />
                Office Location
              </h3>
              <p className="text-md opacity-70 ml-5">
                <b>DISAN ESSENTIALS Private Limited</b> <br />
                GST: <b>29AAHCD8459L2ZT</b>
                <br />
                <b>Address:</b>GROUND FLOOR, 2947, Pooja Pushpa, 13th Main Road, 2nd Stage,
                Rajajinagar,Bengaluru, Karnataka, India, 560010
              </p>
              <h3 className="text-x flex gap-2 justify-start items-center mt-8 mb-3 font-semibold">
                <Mail size="20" /> Email
              </h3>
              <p className="text-md opacity-70 ml-5">
                <Link href="mailto:support@disanmart.com">support@disanmart.com</Link>
              </p>
              <h3 className="text-x flex gap-2 justify-start items-center mt-8 mb-3 font-semibold">
                <Phone size="20" />
                Phone
              </h3>
              <p className="text-md opacity-70 ml-5">
                <Link href="tel:+91 81508 05731">+91 81508 05731</Link>
              </p>
              <h3 className="text-x flex gap-2 justify-start items-center mt-8 mb-3 font-semibold">
                <ThumbsUp size="20" />
                Follow us
              </h3>
              <ul className="ml-5 flex justify-start items-center gap-5">
                <li>
                  <Link target="_blank" href="https://www.instagram.com/">
                    <Instagram size="20" className="opacity-70 cursor-pointer hover:opacity-100" />
                  </Link>
                </li>
                <li>
                  <Link target="_blank" href="https://www.facebook.com/">
                    <Facebook size="20" className="opacity-70 cursor-pointer hover:opacity-100" />
                  </Link>
                </li>
                <li>
                  <Link target="_blank" href="">
                    <Twitter size="20" className="opacity-70 cursor-pointer hover:opacity-100" />
                  </Link>
                </li>
                <li>
                  <Link target="_blank" href="https://www.youtube.com/">
                    <Youtube size="20" className="opacity-70 cursor-pointer hover:opacity-100" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full  ">
            <div className="rounded-2xl border p-6 bg-white shadow-2xl shadow-amber-50">
              <h2 className="mb-5 font-semibold text-center text-3xl">Contact Us</h2>
              <p className="text-xs opacity-70 text-center  mx-auto w-full mb-5">
                We&apos;re here to help! Whether you have questions, feedback, or need assistance,
                reach out to us and our team will get back to you promptly. Your satisfaction is our
                priority.
              </p>
              <EmbedForm id="6D2dyG43hyus" />
            </div>
          </div>
          <div>
            <Image
              src="/contact.jpg"
              className="w-full h-[400px] lg:h-[650px] object-cover object-bottom rounded-2xl"
              width="1000"
              height="1000"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConatactPage
