'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function RegisterPage() {
  return (
    <main>
      <div className="flex flex-col w-full overflow-hidden relative min-h-screen radial-gradient items-center justify-center g-0 px-4">
        <div className="justify-center items-center w-full card lg:flex max-w-md">
          <div className="w-full card-body">
            <Link href="/" className="py-4 block">
              <Image
                src="/assets/images/logos/logo-light.svg"
                alt="Logo"
                width={150}
                height={40}
                className="mx-auto"
              />
            </Link>
            <p className="mb-4 text-gray-400 text-sm text-center">Your Social Campaigns</p>

            <form>
              <div className="mb-4">
                <label htmlFor="forName" className="block text-sm mb-2 text-gray-400">
                  Name
                </label>
                <input
                  type="text"
                  id="forName"
                  className="py-3 px-4 block w-full border-gray-200 rounded-sm text-sm focus:border-blue-600 focus:ring-0"
                  aria-describedby="hs-input-helper-text"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="forEmail" className="block text-sm mb-2 text-gray-400">
                  Email Address
                </label>
                <input
                  type="email"
                  id="forEmail"
                  className="py-3 px-4 block w-full border-gray-200 rounded-sm text-sm focus:border-blue-600 focus:ring-0"
                  aria-describedby="hs-input-helper-text"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="forPassword" className="block text-sm mb-2 text-gray-400">
                  Password
                </label>
                <input
                  type="password"
                  id="forPassword"
                  className="py-3 px-4 block w-full border-gray-200 rounded-sm text-sm focus:border-blue-600 focus:ring-0"
                  aria-describedby="hs-input-helper-text"
                />
              </div>

              <div className="grid my-6">
                <Link
                  href="/"
                  className="btn py-[10px] text-base text-white font-medium hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </div>

              <div className="flex justify-center gap-2 items-center">
                <p className="text-base font-semibold text-gray-400">Already have an Account?</p>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
} 