'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  return (
    <main>
      <div className="flex flex-col w-full overflow-hidden relative min-h-screen radial-gradient items-center justify-center g-0 px-4">
        <div className="justify-center items-center w-full card lg:flex max-w-md">
          <div className="w-full card-body">
            <Link href="/" className="py-4 block">
              <Image
                src="/public/images/logos/logo-light.svg"
                alt="Logo"
                width={150}
                height={40}
                className="mx-auto"
              />
            </Link>
            <div>
            
            <div className="flex flex-col items-center gap-4 mt-6">
            {/* Google Login Button */}
              <Link href="/login/google">
                <div className="gsi-material-button-content-wrapper" style={{ cursor: 'pointer' }}>
                  <div className="gsi-material-button-icon">
                    <img
                      src="/images/login_icons/login_button_google.png"
                      alt="Google login"
                      style={{ width: '200px', height: '40px' }}
                    />
                  </div>
                  <span style={{ display: 'none' }}>Sign in with Google</span>
                </div>
              </Link>

            {/* Naver Login Button */}
              <Link href="/login/naver">
                <div className="gsi-material-button-content-wrapper" style={{ cursor: 'pointer' }}>
                  <div className="gsi-material-button-icon">
                    <img
                      src="/images/login_icons/login_button_naver.png"
                      alt="Naver login"
                      style={{ width: '200px', height: '40px' }}
                    />
                  </div>
                  <span style={{ display: 'none' }}>Sign in with Naver</span>
                </div>
              </Link>

            </div>
            </div>

            
          </div>
        </div>
      </div>
    </main>
  )
} 